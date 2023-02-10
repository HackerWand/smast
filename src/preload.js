const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  request: (...args) => ipcRenderer.invoke('request', ...args),
  db: {
    sync: (args) => ipcRenderer.invoke('request', 'Db.sync', args),
    install: () => ipcRenderer.invoke('request', 'Db.install'),
  },
  kit: {
    md5: (txt) => ipcRenderer.invoke('request', 'App.md5', txt),
  },
  env: {
    platform: process.platform,
    systemVersion: process.getSystemVersion()
  }
})