const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

function createWindow() {
    try {
        // Create the browser window
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            minWidth: 800,
            minHeight: 600,
            backgroundColor: '#1a1b1e',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                sandbox: false
            },
            sandbox: false,
            frame: false // Frameless window for custom title bar
        });

        // Load the index.html file
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

        // Open the DevTools in development
        // mainWindow.webContents.openDevTools();

        // Emitted when the window is closed
        mainWindow.on('closed', () => {
            mainWindow = null;
        });

        // Handle window maximize/unmaximize
        mainWindow.on('maximize', () => {
            mainWindow.webContents.send('window-state-change', 'maximized');
        });

        mainWindow.on('unmaximize', () => {
            mainWindow.webContents.send('window-state-change', 'normal');
        });

    } catch (error) {
        console.error('Error creating window:', error);
        app.exit(1);
    }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// IPC Communication
ipcMain.on('minimize-window', () => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});

ipcMain.on('maximize-window', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

ipcMain.on('close-window', () => {
    if (mainWindow) {
        mainWindow.close();
    }
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});
