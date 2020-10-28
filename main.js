/*
Datentypen müssen nicht angegeben werden
Terminal npm start
Terminal strg c zum beenden
*/

const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const {app, BrowserWindow} = electron;

let hello = 'image.jpg';

function createWindow(){
    let browserWindow = new BrowserWindow({
        webPreferences: {
          webSecurity: false
        }
      });
      
    let content = browserWindow.webContents;

    var html = [
        '<body style="background-image: url(\''+hello+'\'); background-size: cover;"></body>'
      ].join("");
      browserWindow.webContents.loadURL("data:text/html;charset=utf-8," + encodeURI(html));

    /*
    const html = 'image.html' ;
    const render = fs.readFileSync(path.join(__dirname, html));
    browserWindow.webContents.loadFile(path.join(__dirname, html));
    
    /*
    content.toggleDevTools();
    browserWindow.webContents.loadURL('https://calendar.google.com/calendar/u/0/r?tab=rc&pli=1', {
        userAgent: 'Chrome'
        });
    */
}

app.whenReady().then(createWindow);

