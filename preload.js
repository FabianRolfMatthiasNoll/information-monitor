const { ipcRenderer } = require('electron')
let documentID = document.getElementById("image");
ipcRenderer.on('imageChange', (event, fileName, imageFolder) => {
    let url = imageFolder + '/' + fileName;
    documentID.src = url;
})
