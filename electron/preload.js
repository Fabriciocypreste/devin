// Preload script for Electron
// This script runs before the renderer process loads

const { contextBridge } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true
});

console.log('RedFlix Desktop - Preload script loaded');
