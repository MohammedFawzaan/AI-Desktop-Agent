const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('api', {
    sendMessage: (text) => ipcRenderer.send('user-message', text),
    onResponse: (callback) => ipcRenderer.on('agent-response', (event, response) => callback(response))
});
