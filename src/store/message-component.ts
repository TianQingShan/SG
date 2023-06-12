import { defineStore } from 'pinia'

export const useStore = defineStore('message-component', {
  state: () => ({
    message: [] as string[],
    timer: undefined as (undefined | number)
  }),
  actions: {
    addMessage(message: string) {
      this.message.push(message)

      if (this.timer) return

      this.timer = window.setInterval(() => {
        this.message.shift()

        if (this.message.length) return
        window.clearInterval(this.timer)
        this.timer = undefined
      }, 3000)
    }
  }
})
