const { ocrLoctionXY } = require("./utils");

// !ocrLoctionXY([400, 300, 700, 500], "已下单", false, 80, 20)[0]
console.log(ocrLoctionXY([400, 300, 700, 500], "已下单", false, 100, 10)[0]);
// !ocrLoctionXY