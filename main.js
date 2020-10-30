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

  const length = fs.readdirSync('./slideshow').length;

  for (i = 0; i < length; i++){
    
    /*
    fs.access('image'+i+'.html', fs.constants.R_OK, (err) => {
      if(err);
      else {
      }
    });
    */

    var htmlContent = '<html><style>.aligncenter {text-align: center;}</style><body style="height:100%; background-color: white"><p class="aligncenter"><img src="./slideshow/image'+i+'.JPG" height="100%"></p></body></html>';
    fs.writeFile('./image'+i+'.html', htmlContent, (error) => {/*handle error*/});
  
  }

  displayContent(content);

}

async function displayContent(content){

  const length = fs.readdirSync('./slideshow').length;

  for (i = 0; i < length; i++){

  const html = 'image'+i+'.html';
  content.loadURL(path.join(__dirname, html));

  await sleep(6000);

  }

  content.loadURL('https://calendar.google.com/calendar/u/1/r?tab=mc&pli=1', {
    userAgent: 'Chrome'
    });

  await sleep(60000);  

  content.loadURL('https://www.elektronik-kompendium.de/news/', {
    userAgent: 'Chrome'
    }); 

  await sleep(5000);  

  content.loadURL('https://www.electronicspecifier.com/', {
    userAgent: 'Chrome'
    }); 
  
  await sleep(5000);
  
  displayContent(content);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  

app.whenReady().then(createWindow);