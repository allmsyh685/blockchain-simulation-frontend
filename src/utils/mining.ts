import { sha256 } from './crypto';
import type { BlockchainBlock, MiningStep } from '../types/blockchain';

function createConsistentHashString(block: any, previousHash: any, nonce: any) {
    const data = block.data;
    
    // Ensure items structure matches backend: each item has both 'token' (first token) and 'tokens' (array)
    const normalizedItems = (data.items || []).map((item: any, idx: number) => {
      let tokens: string[] = [];
      let primaryToken = '';
      // Reconstruct tokens array as in backend
      if (Array.isArray(item.tokens) && item.tokens.length > 0) {
        tokens = item.tokens;
        primaryToken = item.tokens[0];
      } else if (item.token) {
        primaryToken = item.token;
        tokens = [item.token];
      } else if (item.productToken) {
        primaryToken = item.productToken;
        tokens = [item.productToken];
      } else if (item.sku) {
        primaryToken = item.sku;
        tokens = [item.sku];
      } else if (item.productId) {
        primaryToken = item.productId;
        tokens = [item.productId];
      } else if (item.id) {
        primaryToken = item.id;
        tokens = [item.id];
      } else {
        primaryToken = `TOKEN${Date.now()}_${idx}`;
        tokens = [primaryToken];
      }
      return {
        name: item.name || item.productName || item.title || item.itemName || item.description || `Product ${idx + 1}`,
        token: primaryToken,
        tokens: tokens,
        quantity: parseInt(item.quantity) || parseInt(item.qty) || parseInt(item.amount) || 1,
        price: parseFloat(item.price) || parseFloat(item.unitPrice) || parseFloat(item.cost) || parseFloat(item.value) || 0
      };
    });

    // Buat objek dengan urutan field yang konsisten
    const orderedData = {
      transactionId: data.transactionId,
      buyer: data.buyer,
      vendor: data.vendor,
      items: normalizedItems,
      total: data.total,
      timestamp: data.timestamp,
      buyerName: data.buyerName,
      vendorName: data.vendorName
    };
    
    // Urutan: block.index + nonce + data + previousHash
    return block.index + nonce + JSON.stringify(orderedData) + previousHash;
}

export function mineBlockSteps(block: any, previousHash: any, blockchain: any) {
    const steps = [];
    let nonce = 0;
    
    while (true) {
      // Gunakan fungsi createConsistentHashString dengan nonce
      const nonceString = nonce.toString();
      const hashInput = createConsistentHashString(block, previousHash, nonceString);
      console.log(hashInput);
      
      // Lakukan proses hashing
      const hash = sha256(hashInput);
      
      steps.push({
        nonce: nonce,
        hash: hash,
        description: `Mining attempt with nonce ${nonce}`,
        messagePadding: hashInput,
        messageScheduling: '', 
        messageCompression: '', 
        finalHash: hash
      });
      
      // Cek difficulty
      if (hash.startsWith('000')) {
        break;
      }
      
      nonce++;
      
      // Safety limit untuk mencegah infinite loop
      if (nonce > 1000000) {
        console.warn('Mining stopped after 1M iterations');
        break;
      }
    }
    
    return steps;
}

// Export fungsi untuk konsistensi
export { createConsistentHashString };

const normalizeBlockData = (blockData: any): any => {
  const normalizedData = { ...blockData };
  
  if (normalizedData.transactionId && typeof normalizedData.transactionId === 'object' && normalizedData.transactionId._id) {
    if (normalizedData.transactionId.items && Array.isArray(normalizedData.transactionId.items)) {
      normalizedData.items = normalizedData.transactionId.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        tokens: item.tokens,
        _id: item._id
      }));
    }
    
    normalizedData.transactionId = normalizedData.transactionId._id;
  }
  
  return normalizedData;
};

const addVerificationSteps = (
  steps: MiningStep[], 
  block: BlockchainBlock, 
  allBlocks: BlockchainBlock[]
): void => {
  const foundBlock = allBlocks.find(b => 
    b.index === block.index &&
    b.timestamp === block.timestamp && 
    b.previousHash === block.previousHash
  );
  
  if (foundBlock) {
    const blockNormalizedData = normalizeBlockData(foundBlock.data);
    
    // Gunakan urutan yang konsisten: index + nonce + data + previousHash
    const actualHashInput = `${foundBlock.index}${foundBlock.nonce}${JSON.stringify(blockNormalizedData)}${foundBlock.previousHash}`;
    
    steps.push({
      nonce: foundBlock.nonce,
      hash: foundBlock.hash,
      description: `Hasil Akhir Sebenarnya dari Blockchain`,
      messagePadding: `Data transaksi dari blockchain: ${JSON.stringify(blockNormalizedData)}`,
      messageScheduling: `Final Hash Input: ${foundBlock.index} + ${foundBlock.nonce} + ${JSON.stringify(blockNormalizedData)} + ${foundBlock.previousHash}`,
      messageCompression: `Hash yang tersimpan di blockchain: ${foundBlock.hash}`,
      finalHash: foundBlock.hash
    });
    
    // Verifikasi hash
    const calculatedHash = sha256(actualHashInput);
    const isValid = calculatedHash === foundBlock.hash;
    
    steps.push({
      nonce: foundBlock.nonce,
      hash: calculatedHash,
      description: isValid ? `✅ Verifikasi Hash Berhasil` : `❌ Verifikasi Hash Gagal - Hash tidak cocok`,
      messagePadding: isValid ? `Hash terhitung ulang cocok dengan hash yang tersimpan` : `Expected: ${foundBlock.hash}`,
      messageScheduling: `Verifikasi: ${actualHashInput.substring(0, 100)}...`,
      messageCompression: `Calculated Hash: ${calculatedHash}`,
      finalHash: calculatedHash
    });
  }
};