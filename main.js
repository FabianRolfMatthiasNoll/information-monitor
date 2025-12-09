const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const {app, BrowserWindow, ipcMain} = electron;

async function createWindow(){

  let browserWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }, 
    fullscreen: true,
    autoHideMenuBar: true
  });
  let content = browserWindow.webContents;

  displayContent(content);


}

async function displayContent(content){
  
  let config = fs.readFileSync('./config.json');
  config = JSON.parse(config);

  let fileNames = fs.readdirSync('./slideshow');
  fileNames.sort();
  const length = fileNames.length;

  content.loadFile('html/basic.html');

  await sleep(1000);

  for (i = 0; i < length; i++){
    
    content.send('imageChange', fileNames[i]);

    const ext = path.extname(fileNames[i]).toLowerCase();
    if (ext === '.mp4' || ext === '.webm' || ext === '.mkv') {
      await new Promise(resolve => {
        ipcMain.once('videoEnded', () => resolve());
      });
    } else {
      await sleep(config["sleepTimeImage"]);
    }
  }

  content.loadURL(config["urls"][0], {
    userAgent: 'Chrome'
    });

  await sleep(config["sleepTimeMain"]);  

  for (i = 1; i < config["urls"].length; i++){

    content.loadURL(config["urls"][i], {
      userAgent: 'Chrome'
      }); 

    await sleep(config["sleepTimeSecondary"]);  

  }

  displayContent(content);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  

app.whenReady().then(createWindow);