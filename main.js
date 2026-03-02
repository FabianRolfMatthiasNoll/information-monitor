const electron = require('electron');
const path = require('path');
const fs = require('fs');

const {app, BrowserWindow, ipcMain} = electron;

let mainWindow;
let restartSignal = false;          // indicates the slideshow folder changed
let config = null;                  // current configuration
let watchersSetup = false;

function reloadConfig() {
  try {
    const newConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
    config = newConfig;
    console.log('configuration reloaded');
  } catch (e) {
    console.error('failed to reload config.json:', e);
  }
}

function setupWatchers() {
  if (watchersSetup) return;
  watchersSetup = true;

  const configPath = path.join(__dirname, 'config.json');
  // watch config changes; reload but don't force cycle restart
  const configHandler = () => {
    console.log('config changed, reloading');
    reloadConfig();
  };
  fs.watch(configPath, {persistent: false}, (ev, fn) => {
    console.log(`fs.watch event for config: ${ev} ${fn}`);
    configHandler();
  });
  fs.watchFile(configPath, {interval: 1000}, (curr, prev) => {
    if (curr.mtimeMs !== prev.mtimeMs) {
      console.log('fs.watchFile detected config.json change');
      configHandler();
    }
  });

  const slideDir = path.join(__dirname, 'slideshow');
  try {
    fs.watch(slideDir, {persistent: false}, (ev, fn) => {
      console.log(`slideshow folder event: ${ev} ${fn}`);
      restartSignal = true;
    });
  } catch (err) {
    console.error('could not watch slideshow folder:', err);
  }
}

async function createWindow() {
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
  setupWatchers();
  reloadConfig();
  runLoop(mainWindow.webContents);
}

// helper that waits until restartSignal becomes true
function waitUntilRestart() {
  return new Promise(resolve => {
    const id = setInterval(() => {
      if (restartSignal) {
        clearInterval(id);
        resolve();
      }
    }, 100);
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runLoop(content) {
  while (true) {
    try {
      console.log('starting new display cycle');
      restartSignal = false;

      // config is reloaded by watcher; ensure we have a value
      if (!config) {
        try {
          reloadConfig();
        } catch {}
      }
      let fileNames;
      try {
        fileNames = fs.readdirSync(path.join(__dirname, 'slideshow'))
          .filter(f => !f.startsWith('.'))
          .sort();
      } catch (e) {
        console.error('Failed to list slideshow folder:', e);
        await wait(5000);
        continue;
      }

      // show slideshow
      // ensure page has our elements (in case previous cycle left a URL loaded)
      await new Promise(resolve => {
        content.loadFile('html/basic.html');
        content.once('did-finish-load', () => resolve());
      });

      if (fileNames.length === 0) {
        console.log('slideshow folder empty, showing default image');
        // show default image for the configured duration, then continue
        await waitWithRestart(config.imageDisplayTime);
      } else {
        for (const fileName of fileNames) {
          if (restartSignal) break;
          const ext = path.extname(fileName).toLowerCase();
          const isVideo = ['.mp4', '.webm', '.mkv'].includes(ext);
          console.log('displaying slideshow item', fileName);
          content.send('imageChange', { fileName, isVideo });

          if (isVideo) {
            await new Promise(resolve => {
              const timeout = setTimeout(resolve, 300000);
              ipcMain.once('videoEnded', () => {
                clearTimeout(timeout);
                resolve();
              });
            });
            if (restartSignal) break;
          } else {
            // imageDisplayTime might have been updated in config
            await waitWithRestart(config.imageDisplayTime);
          }
        }
      }

      if (restartSignal) continue;

      // show urls
      console.log('starting URL cycle');
      for (const [idx, url] of config.urls.entries()) {
        if (restartSignal) break;
        console.log('loading url', url);
        content.loadURL(url, { userAgent: 'Chrome' });
        const duration = idx === 0 ? config.calendarDisplayTime : config.secondaryUrlDisplayTime;
        await waitWithRestart(duration);
      }

      console.log('finished URL cycle');
      // loop automatically; if restartSignal was set, the outer while will handle it
    } catch (err) {
      console.error('runLoop encountered an error:', err);
      await wait(5000);
    }
  }
}

async function waitWithRestart(ms) {
  const interval = 200;
  let elapsed = 0;
  while (elapsed < ms && !restartSignal) {
    await wait(interval);
    elapsed += interval;
  }
}

app.whenReady().then(createWindow);