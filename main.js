const electron = require('electron');
const path = require('path');
const fs = require('fs');

const {app, BrowserWindow, ipcMain} = electron;

let mainWindow;

async function createWindow(){
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }, 
    fullscreen: true,
    autoHideMenuBar: true,
    show: true
  });

  mainWindow.loadFile('html/basic.html');
  
  displayContent(mainWindow.webContents);
}

async function displayContent(content) {
  try {
    let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    let fileNames = fs.readdirSync('./slideshow').filter(f => !f.startsWith('.'));
    fileNames.sort();

    // Slideshow cycle
    for (const fileName of fileNames) {
      const ext = path.extname(fileName).toLowerCase();
      const isVideo = ['.mp4', '.webm', '.mkv'].includes(ext);
      
      content.send('imageChange', { fileName, isVideo });
      
      if (isVideo) {
        // Wait for video to finish
        await new Promise(resolve => {
          const timeout = setTimeout(() => resolve(), 300000); // 5 min safety timeout
          ipcMain.once('videoEnded', () => {
            clearTimeout(timeout);
            resolve();
          });
        });
      } else {
        await sleep(config.sleepTimeImage);
      }
    }

    // URL cycle
    for (const [idx, url] of config.urls.entries()) {
      content.loadURL(url, { userAgent: 'Chrome' });
      const duration = idx === 0 ? config.sleepTimeMain : config.sleepTimeSecondary;
      await sleep(duration);
    }
  } catch (error) {
    console.error('Display cycle error:', error);
    await sleep(5000);
  }

  // Loop back
  displayContent(content);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  

app.whenReady().then(createWindow);