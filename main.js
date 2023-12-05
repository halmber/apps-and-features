const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { getInstalledSoftware } = require("./src/getInstalledSoftware");

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            devTools: true,
            preload: path.join(__dirname, "./preload.js"),
            defaultEncoding: "UTF-8",
        },
    });
    mainWindow.webContents.openDevTools();

    mainWindow.loadFile("./public/index.html");
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.handle("get/installedSoftware", async (event, args) => {
    return await getInstalledSoftware();
});
