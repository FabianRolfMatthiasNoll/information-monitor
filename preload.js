const { ipcRenderer } = require('electron');

let image = null;
let video = null;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupHandlers);
} else {
  setupHandlers();
}

function setupHandlers() {
  image = document.getElementById('image');
  video = document.getElementById('video');
  
  if (!image || !video) {
    console.error('image or video element not found');
    return;
  }

  ipcRenderer.on('imageChange', (event, data) => {
    const { fileName, isVideo } = data;
    const url = '../slideshow/' + fileName;
    
    try {
      if (isVideo) {
        image.style.display = 'none';
        video.style.display = 'inline';
        video.src = url;
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error('Video play error:', err);
            ipcRenderer.send('videoEnded');
          });
        }
        
        video.onended = () => {
          ipcRenderer.send('videoEnded');
        };
      } else {
        video.pause();
        video.currentTime = 0;
        video.style.display = 'none';
        image.style.display = 'inline';
        image.src = url;
      }
    } catch (error) {
      console.error('Error handling imageChange:', error);
    }
  });
}
