
var canvas = document.getElementById('clock'),
    ctx = canvas.getContext('2d'),
    cw = 240,
    ch = 240, //画布大小
    canvasBackgroundColor = "#fff",
    r = 100, //圆半径
    lw = 36, //线宽
    circleColor = "#eee",
    tColor = "#ccc",
    arcColor = "#169488",
    dr = 18, //点半径
    dx1 = 100,
    dy1 = 0, //点1的位置
    t1 = 3,
    dx2 = 0,
    dy2 = -100, //点2的位置
    t2 = 12,
    dotColor = "#B3DFDB",
    isTouchDot1 = false,
    isTouchDot2 = false,
    hourCoord = [];

canvas.width = cw;
canvas.height = ch;
ctx.translate(cw / 2, ch / 2); //画布原点移到 0，0
document.getElementById('startHour').innerHTML = t1 + ':00';
document.getElementById('endHour').innerHTML = t2 + ':00';

//步进模式，记录步进点的坐标
for (var i = 1; i <= 12; i++) {
    hourCoord.push({
        x: r * Math.cos((i - 3) / 12 * 2 * Math.PI),
        y: r * Math.sin((i - 3) / 12 * 2 * Math.PI)
    });
}

//触摸事件绑定
canvas.ontouchstart = function(e) {
    e.preventDefault();

    var coord = getCoord(e.touches[0].pageX, e.touches[0].pageY, cw, ch, canvas.offsetLeft, canvas.offsetTop),
        tx = coord.x,
        ty = coord.y;

    isTouchDot1 = isDot1Touched(tx, ty);
    isTouchDot2 = isDot2Touched(tx, ty);
}

canvas.ontouchmove = function(e) {
    var coord = getCoord(e.touches[0].pageX, e.touches[0].pageY, cw, ch, canvas.offsetLeft, canvas.offsetTop),
        tx = coord.x,
        ty = coord.y,
        newCoord;

    // if (isDot1Touched(tx, ty) && isTouchDot1) {//手指要沿着圆规拖动
    if (isTouchDot1) {
        t1 = calHour(t1, tx, ty)

        document.getElementById('startHour').innerHTML = t1 + ':00';
        //沿着圆平滑移动
        newDx1 = tx * r / Math.sqrt(tx * tx + ty * ty);
        newDy1 = ty * r / Math.sqrt(tx * tx + ty * ty);
        draw(newDx1, newDy1, dx2, dy2);

        //步进模式
        // newCoord = clockStep(tx, ty);
        // draw(newCoord.x, newCoord.y, dx2, dy2);
    }

    // if (isDot2Touched(tx, ty) && isTouchDot2 && !isTouchDot1) {//手指要沿着圆拖动
    if (isTouchDot2 && !isTouchDot1) {
        t2 = calHour(t2, tx, ty);
        document.getElementById('endHour').innerHTML = t2 + ':00';

        //沿着圆平滑移动
        newDx2 = tx * r / Math.sqrt(tx * tx + ty * ty);
        newDy2 = ty * r / Math.sqrt(tx * tx + ty * ty);
        draw(dx1, dy1, newDx2, newDy2);
        //步进模式
        // newCoord = clockStep(tx, ty);
        // draw(dx1, dy1, newCoord.x, newCoord.y);
    }
}

canvas.ontouchend = function(e) {
    isTouchDot1 = false;
    isTouchDot2 = false;
}

//初始值
draw(dx1, dy1, dx2, dy2);

function draw(x1, y1, x2, y2) {
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
    drawClock();
    drawArc();

    drawDot(x2, y2);
    drawDotText("退", x2, y2);
    //记录点2的最新位置
    dx2 = x2;
    dy2 = y2;

    drawDot(x1, y1);
    drawDotText("入", x1, y1);
    //记录点1的最新位置
    dx1 = x1;
    dy1 = y1;

    drawTime();
}

//画表盘
function drawClock() {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    ctx.strokeStyle = circleColor;
    ctx.lineWidth = lw;
    ctx.stroke();

    //画刻度
    for (var i = 0; i < 12; i++) {
        ctx.save();

        var angle = i * 30 * Math.PI / 180;
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.fillStyle = circleColor;
        ctx.rect(r - lw + 6, -1.2, 8, 2.4);
        ctx.fill();

        ctx.restore();
    }

    //写时间刻度
    var tl = r - lw - 3;
    ctx.fillStyle = tColor;
    ctx.font = "13px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (var j = 1; j <= 12; j++) {
        var tangle = (j - 3) * 30 * Math.PI / 180;
        if (j % 3 == 0) {
            ctx.fillText(j, tl * Math.cos(tangle), tl * Math.sin(tangle));
        }
    }
}

function drawTime() {
    //写时间
    ctx.fillStyle = "black";
    ctx.font = "18px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(t2 - t1 + "小时", 0, 0)
}

function calHour(time, tx, ty) {
    var cos = Math.acos(tx / Math.sqrt(tx * tx + ty * ty));
    var angle = cos * 360 / 2 / Math.PI;

    if (tx >= 0) {
        if (ty < 0)
            angle = 90 - angle; //第一象限
        else
            angle = 90 + angle; //第四象限
    } else {
        if (ty >= 0)
            angle = 90 + angle; //第三象限
        else
            angle = 180 - angle + 270; //第二象限
    }
    var hour = Math.floor(angle / 360 * 12);
    
    if(time == 0){
        if (hour == 11) {
            time = 23;
        } else {
            time = hour;
        }
    } else if (time == 11) {
        if (hour == 0) {
            time = 12;
        } else {
            time = hour;
        }
    } else if(time == 12) {
        if(hour == 11)
            time = 11;
        else
            time = hour + 12;
    } else if (time > 12 && time < 23) {
        time = hour + 12;
    } else if (time == 23) {
        if (hour == 0) {
            time = 0;
        } else {
            time = hour + 12;
        }
    } else {
        time = hour;
    }

    return time;
}

//步进模式
function clockStep(tx, ty) {
    var cos = Math.acos(tx / Math.sqrt(tx * tx + ty * ty));
    var angle = cos * 360 / 2 / Math.PI;

    if (tx >= 0) {
        if (ty < 0)
            angle = 90 - angle; //第一象限
        else
            angle = 90 + angle; //第四象限
    } else {
        if (ty >= 0)
            angle = 90 + angle; //第三象限
        else
            angle = 180 - angle + 270; //第二象限
    }
    var hour = angle / 360 * 12;

    index = hour < 1 ? 0 : (Math.round(hour) - 1);
    return {
        x: hourCoord[index].x,
        y: hourCoord[index].y
    }
}

//画弧线
function drawArc() {
    //arcTo 只会画最短的弧
    // var k = (dy1 - dy2) / (dx2 - dx1),
    //     x = k * r * r / (dx1 * k + dy1),
    //     y = r * r / (dx1 * k + dy1);
    // ctx.beginPath();
    // ctx.moveTo(dx1, dy1);
    // ctx.arcTo(x, y, dx2, dy2, r);

    ctx.beginPath();
    ctx.arc(0, 0, r, Math.atan2(dy1, dx1), Math.atan2(dy2, dx2), false);
    ctx.strokeStyle = arcColor;
    ctx.lineWidth = lw;
    ctx.stroke();
}

function drawDot(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, dr, 0, 2 * Math.PI, true);
    ctx.fillStyle = dotColor;
    ctx.fill();

    ctx.arc(x, y, dr, 0, 2 * Math.PI, true);
    ctx.strokeStyle = arcColor;
    ctx.lineWidth = 0.5;
    ctx.stroke();
}

function drawDotText(text, x, y) {
    ctx.fillStyle = arcColor;
    ctx.font = "15px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
}

function isDot1Touched(x, y) {
    if (Math.abs(x - dx1) <= lw && Math.abs(y - dy1) <= lw) {
        return true;
    } else {
        return false;
    }
}

function isDot2Touched(x, y) {
    if (Math.abs(x - dx2) <= lw && Math.abs(y - dy2) <= lw) {
        return true;
    } else {
        return false;
    }
}

//获取触摸位置在画布坐标系的坐标
function getCoord(x, y, w, h, left, top) {
    return {
        x: x - w / 2 - left,
        y: y - h / 2 - top
    };
}
