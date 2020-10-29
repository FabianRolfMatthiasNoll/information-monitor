const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const {app, BrowserWindow} = electron;

async function createWindow(){

  let browserWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false
    }
  });
  let content = browserWindow.webContents;

  displayContent(content);

}

async function displayContent(content){

  const length = fs.readdirSync('./slideshow').length;

  for (i = 0; i < length; i++){

  const html = 'image'+i+'.html';
  content.loadURL(path.join(__dirname, html));

  await sleep(10000);

  }

  content.loadURL('https://calendar.google.com/calendar/u/1/r?tab=mc&pli=1', {
    userAgent: 'Chrome'
    });

  await sleep(10000);  

  content.loadURL('https://www.elektronik-kompendium.de/news/', {
    userAgent: 'Chrome'
    }); 

  await sleep(10000);  

  content.loadURL('https://www.electronicspecifier.com/', {
    userAgent: 'Chrome'
    }); 
  
  await sleep(10000);
  
  displayContent(content);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  

app.whenReady().then(createWindow);