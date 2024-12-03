var ele最多 = textContains('最多可添加').findOne(300)
var ele = ele最多.parent().children()[3].children()[0]
var children = ele.children()
console.log(children.length);
for (let index = 0; index < children.length; index++) {
    var element = children[index];
    if (isNumeric(element.text())) {
        // console.log(`杯数 ${element.text()}, 下标: ${index}`);
        pressXY(children[index - 1].bounds().centerX(), children[index - 1].bounds().centerY(), 150, 500)
        break
    } 
}