import { defineStore } from 'pinia'

export default defineStore('configs', {
  state: () => {
    return {
      machineCode: null,
      activationCode: null,
      activationTime: null,
      orgName: null
    }
  },
  actions: {
    async init () {
      const res = await window.electron.request('Configs.init')
      this.setConfigs(res)
    },
    async load () {
      const res = await window.electron.request('Configs.get')
      this.setConfigs(res)
    },
    setConfigs (configs) {
      const objs = {}
      configs.forEach(item => {
        objs[item.key] = item.value
      })
      this.machineCode = objs.machineCode || null
      this.activationCode = objs.activationCode || null
      this.activationTime = objs.activationTime || null
      this.orgName = objs.orgName || null
    },
    set (key, value) {
      this[key] = value
      return window.electron.request('Configs.set', {
        key, value
      })
    }
  }
})