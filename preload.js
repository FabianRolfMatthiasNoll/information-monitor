const { ipcRenderer } = require('electron')
let documentID = document.getElementById("image");
ipcRenderer.on('imageChange', (event, fileName) => {
    let url = '../slideshow/' + fileName;
    documentID.src = url;
})
