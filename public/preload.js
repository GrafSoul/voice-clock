try {
    const { contextBridge, ipcRenderer } = require('electron');

    contextBridge.exposeInMainWorld('electron', {
        hideWindow: () => ipcRenderer.send('hide-window'),
        toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
        getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top'),
    });
} catch (error) {
    console.error('Preload script error:', error);
}
