export interface BlockchainBlock {
    index: number;
    timestamp: string;
    data: any;
    previousHash: string;
    nonce: number;
    hash: string;
  }
  
  export interface MiningStep {
    nonce: number;
    hash: string;
    description: string;
    messagePadding: string;
    messageScheduling: string;
    messageCompression: string;
    finalHash: string;
  }