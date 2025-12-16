const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    title: 'RedFlix',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#141414',
    autoHideMenuBar: true,
    show: false
  });

  // Load the app - try local build first, then fallback to URL
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // Development mode - load from localhost (port 3000 matching vite.config.ts)
    mainWindow.loadURL(process.env.REDFLIX_URL || 'http://localhost:3000');
  } else {
    // Production mode - load from local build files
    // When packaged, extraResources are in process.resourcesPath/dist
    // When running locally, they're in ../dist
    const isPackaged = app.isPackaged;
    const indexPath = isPackaged
      ? path.join(process.resourcesPath, 'dist', 'index.html')
      : path.join(__dirname, '..', 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Remove menu bar
  Menu.setApplicationMenu(null);
}

// App ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS: re-create window when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: prevent new windows
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
});
