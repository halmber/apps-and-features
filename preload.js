const { contextBridge, ipcRenderer, shell } = require("electron");

contextBridge.exposeInMainWorld("api", {
    getInstalledSoftware: () => ipcRenderer.invoke("get/installedSoftware"),
    shell: shell,
});
