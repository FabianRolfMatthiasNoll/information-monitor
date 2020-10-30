const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const ipc = require("electron").ipcRenderer;

const {app, BrowserWindow, ipcRenderer} = electron;

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

  let fileNames = [];

  const length = fs.readdirSync(config["imageFolder"]).length;

  fs.readdir(config["imageFolder"], (err, dir) => {
    dir.forEach(file => {
      fileNames.push(file);
    })
  })

  fileNames.sort();

  content.loadURL(path.join(__dirname,"/basic.html"));

  await sleep(1000);

  for (i = 0; i < length; i++){
    
    content.send('imageChange', fileNames[i], config["imageFolder"]);
    await sleep(config["sleepTimeImage"]);

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