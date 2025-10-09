const { app, BrowserWindow, Tray, Menu } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const isDev = require('electron-is-dev');

if (isDev) {
    try {
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
            hardResetMethod: 'exit'
        });
    } catch (err) {
        console.log('electron-reload not available');
    }
}

const getIcon = () => {
    if (process.platform === 'win32')
        return path.join(__dirname, 'icons/icon.ico');
    if (process.platform === 'darwin')
        return path.join(__dirname, 'icons/icon.icns');
    return path.join(__dirname, 'icons/16x16.png');
};

const getTrayIcon = () => {
    if (process.platform === 'darwin') {
        // Для macOS menu bar используем template иконку (автоматически адаптируется к светлой/темной теме)
        return path.join(__dirname, 'icons/iconTemplate.png');
    }
    if (process.platform === 'win32') {
        return path.join(__dirname, 'icons/icon.ico');
    }
    return path.join(__dirname, 'icons/16x16.png');
};

let mainWindow, tray, contextMenu;

const createWindow = async () => {
    if (isDev) {
        try {
            const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
            await installExtension(REACT_DEVELOPER_TOOLS);
        } catch (err) {
            console.log('DevTools extension failed to install:', err);
        }
    }

    let mainWindowState = windowStateKeeper({
        defaultWidth: 280,
        defaultHeight: 175,
    });

    mainWindow = new BrowserWindow({
        title: 'Voice Clock',
        show: false,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        focusable: true,
        icon: getIcon(),
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: 280,
        height: 175,
        titleBarStyle: 'hidden',
        backgroundColor: '#282c34',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });

    mainWindowState.manage(mainWindow);

    const { ipcMain } = require('electron');
    
    ipcMain.on('hide-window', () => {
        if (mainWindow) {
            mainWindow.hide();
        }
    });

    ipcMain.handle('toggle-always-on-top', () => {
        if (mainWindow) {
            const currentState = mainWindow.isAlwaysOnTop();
            mainWindow.setAlwaysOnTop(!currentState);
            return !currentState;
        }
        return false;
    });

    ipcMain.handle('get-always-on-top', () => {
        if (mainWindow) {
            return mainWindow.isAlwaysOnTop();
        }
        return false;
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, 'index.html')}`,
    );

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    tray = new Tray(getTrayIcon());

    const menuTemplate = [
        {
            label: 'Show/Hide',
            click() {
                if (mainWindow) {
                    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
                }
            },
        },
    ];

    if (isDev) {
        menuTemplate.push(
            { type: 'separator' },
            {
                label: 'Developer Tools',
                click() {
                    if (mainWindow) {
                        mainWindow.webContents.toggleDevTools();
                    }
                },
            }
        );
    }

    menuTemplate.push(
        { type: 'separator' },
        {
            label: 'Exit',
            role: 'quit',
        }
    );

    contextMenu = Menu.buildFromTemplate(menuTemplate);

    tray.on('click', () => {
        if (mainWindow) {
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        }
    });

    tray.setToolTip('Voice Clock');
    tray.setContextMenu(contextMenu);
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else if (mainWindow) {
        // Показываем окно, если оно было скрыто (клик по иконке в Dock на macOS)
        mainWindow.show();
    }
});
