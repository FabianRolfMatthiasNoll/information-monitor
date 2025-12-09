const { ipcRenderer } = require('electron')
let image = document.getElementById("image");
let video = document.getElementById("video");

ipcRenderer.on('imageChange', (event, fileName) => {
    let url = '../slideshow/' + fileName;
    
    if (fileName.toLowerCase().endsWith('.mp4') || fileName.toLowerCase().endsWith('.webm') || fileName.toLowerCase().endsWith('.mkv')) {
        image.style.display = "none";
        video.style.display = "inline";
        video.src = url;
        video.play();
        video.onended = () => {
            ipcRenderer.send('videoEnded');
        };
    } else {
        video.pause();
        video.style.display = "none";
        image.style.display = "inline";
        image.src = url;
    }
})
