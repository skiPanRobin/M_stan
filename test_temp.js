const { ocrLoctionXY, getOcrObj, imgClips, takeScreenShot } = require('./utils');

// !ocrLoctionXY([400, 300, 700, 500], "已下单", false, 80, 20)[0]
var latters = ['C', "D", 'F', 'G', 'H', 'J', 'K', 'N','Q', 'S']
latters.forEach(latter => {
    var [lx, ly] = ocrLoctionXY(imgClips.xy城市开头大写, latter, true, 140, 40)
    console.log(lx,ly);

});
