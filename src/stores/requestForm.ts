import { defineStore } from 'pinia'

interface Item {
  name: string
  specs: string
  brand: string
  budget: number
  quantity: number
}

interface RequestForm {
  title: string
  deadline: string
  items: Item[]
}

export const useRequestFormStore = defineStore('requestForm', {
  state: (): RequestForm => ({
    title: '',
    deadline: '',
    items: [
      { name: '', specs: '', brand: '', budget: undefined as unknown as number, quantity: undefined as unknown as number }
    ]
  }),
  actions: {
    setTitle(title: string) {
      this.title = title
    },
    setDeadline(deadline: string) {
      this.deadline = deadline
    },
    addItem() {
      this.items.push({ name: '', specs: '', brand: '', budget: undefined as unknown as number, quantity: undefined as unknown as number })
    },
    updateItem(index: number, updated: Partial<Item>) {
      this.items[index] = { ...this.items[index], ...updated }
    },
    removeItem(index: number) {
      this.items.splice(index, 1)
    },
    resetForm() {
      this.title = ''
      this.deadline = ''
      this.items = [
        { name: '', specs: '', brand: '', budget: undefined as unknown as number, quantity: undefined as unknown as number }
      ]
    }
  }
})
