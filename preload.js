const { ipcRenderer } = require('electron')
let documentID = document.getElementById("image");
ipcRenderer.on('imageChange', (event, i, imageFolder) => {
    let url = imageFolder + '/image' + i + '.JPG';
    documentID.src = url;
})
