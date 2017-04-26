var clock = function(startH, endH) {

    var $ = function(selector) {
        return document.querySelector(selector);
    }

    var canvas = $('#clock'),
        ctx = canvas.getContext('2d'),
        cw = 300,
        ch = 300, //画布大小
        canvasBackgroundColor = "#fff",
        status = {
            key: 3,
            dayClock: 3,
            partTimeClock: 4
        },
        partTimeStart = 7, //时租房预定的起始时间最早7点
        partTimeEnd = 18, //时租房预定的起始时间最晚18点
        partTimeInterval = 3, //时租房间隔最少3小时
        r = 120, //圆半径
        lw = 40, //线宽
        circleColor = "#eee",
        tColor = "#ccc",
        arcColor = "#444",
        dr = 20, //点半径
        dx1, dy1, //点1的位置
        timeSpan = '',
        t1 = new Date(),
        h1 = t1.getHours(),
        deltaHour1 = 0, //时间变化增量
        beforeTouchT1,
        dx2, dy2, //点2的位置
        t2 = new Date(t1.getFullYear(), t1.getMonth(), t1.getDate() + 1, 12, 0, 0), //默认退房时间第二天中午12点
        h2 = 12,
        deltaHour2 = 0,
        beforeTouchT2,
        dotColor = "#f2f2f2",
        isTouchDot1 = false,
        isTouchDot2 = false,
        hourCoord = [],
        _tempDate = null,
        colorArray = ["rgb(238,238,238)","rgb(221,221,221)","rgb(204,204,204)","rgb(187,187,187)","rgb(170,170,170)","rgb(153,153,153)","rgb(136,136,136)","rgb(119,119,119)","rgb(102,102,102)","rgb(85,85,85)"];


    //步进模式，记录步进点的坐标
    for (var i = 1; i <= 12; i++) {
        hourCoord.push({
            x: r * Math.cos((i - 3) / 12 * 2 * Math.PI),
            y: r * Math.sin((i - 3) / 12 * 2 * Math.PI)
        });
    }

    getSessionData();

    iniCanvas();

    //读取本地储存
    function getSessionData() {
        var coord = {},
            bensue = Storage.get("bensue"),
            newOrder = Storage.get("newOrder");

        if(bensue.type){
            status.key = bensue.type?status.partTimeClock:status.dayClock;
        }

        switch(status.key){
            case status.dayClock: 
                if (newOrder && newOrder.day) {
                    if (newOrder.day.start) {
                        t1 = new Date(newOrder.day.start.replace(/-/g, "/"));
                    }
                    if (newOrder.day.end) {
                        t2 = new Date(newOrder.day.end.replace(/-/g, "/"));
                    }

                    if (newOrder.day.startHour) {
                        h1 = newOrder.day.startHour;
                        t1.setHours(h1);
                        coord = getCoordByHour(h1);
                        dx1 = coord.x;
                        dy1 = coord.y;
                    }
                    if (newOrder.day.endHour) {
                        h2 = 12;
                        t2.setHours(h2);
                        coord = getCoordByHour(h2);
                        dx2 = coord.x;
                        dy2 = coord.y;
                    }
                }
                break;
            case status.partTimeClock:
                if (newOrder && newOrder.partTime) {
                    if (newOrder.partTime.start) {
                        t1 = new Date(newOrder.partTime.start.replace(/-/g, "/"));
                        t2 = new Date(newOrder.partTime.end.replace(/-/g, "/"));
                    } else {
                        //如果首次直接加载 partTimeClock
                        //退房时间比入住时间晚3个小时
                        h2 = t1.getHours() + 3
                        t2.setDate(t1.getDate());
                        t2.setHours(h2);
                    }
 
                    if (newOrder.partTime.startHour) {
                        h1 = newOrder.partTime.startHour;
                        t1.setHours(h1);
                        h2 = newOrder.partTime.endHour;
                        t2.setHours(h2);
                    }

                    coord = getCoordByHour(h1);
                    dx1 = coord.x;
                    dy1 = coord.y;
                    coord = getCoordByHour(h2);
                    dx2 = coord.x;
                    dy2 = coord.y;
                }
                break;
        }
    }

    //触摸事件绑定
    canvas.ontouchstart = function(e) {
        e.preventDefault();

        var coord = getCoord(e.touches[0].pageX, e.touches[0].pageY, cw, ch, canvas.offsetLeft, canvas.offsetTop),
            tx = coord.x,
            ty = coord.y;

        isTouchDot1 = isDot1Touched(tx, ty);
        beforeTouchT1 = t1;
        isTouchDot2 = isDot2Touched(tx, ty);
        beforeTouchT2 = t2;
    }

    canvas.ontouchmove = function(e) {
        var coord = getCoord(e.touches[0].pageX, e.touches[0].pageY, cw, ch, canvas.offsetLeft, canvas.offsetTop),
            tx = coord.x,
            ty = coord.y,
            clock1 = {},
            clock2 = {},
            newCoord;

        // if (isDot1Touched(tx, ty) && isTouchDot1) {//手指要沿着圆拖动
        if (isTouchDot1) {
            clock1 = calHour(h1, tx, ty);

            //全天房
            if(status.key == status.dayClock) {
                //日期联动
                // deltaHour1 += clock.deltaHour;
                // t1 = dateAdd(beforeTouchT1, 'h', deltaHour1);
                h1 = clock1.time;
                t1.setHours(h1);

                // if (isChangeDay(beforeTouchT1, deltaHour1, h1)) {
                //     //天数出现变动，发布消息
                //     //日历calendar.js会订阅
                //     Observer.fire('startChange', {
                //         date: t1,
                //         delta: clock.deltaHour,
                //     });
                // }

                // if (t1 >= t2) {
                //     t2 = dateAdd(t2, 'd', 1);
                //     Observer.fire('endChange', {
                //         date: t2,
                //         delta: 1,
                //     });
                // }

                //沿着圆平滑移动
                newDx1 = tx * r / Math.sqrt(tx * tx + ty * ty);
                newDy1 = ty * r / Math.sqrt(tx * tx + ty * ty);

                //步进模式
                // newCoord = clockStep(tx, ty);
                // draw(newCoord.x, newCoord.y, dx2, dy2);

                draw(newDx1, newDy1, dx2, dy2);
            }

            //时租房
            if(status.key == status.partTimeClock) {
                //入住时间应该在预定范围内
                //入住时间不能早于当前时间
                if(clock1.time >=partTimeStart && clock1.time<=partTimeEnd && clock1.time >= getNowHour()) {
                    h1 = clock1.time;
                    t1.setHours(h1);

                    //沿着圆平滑移动
                    newDx1 = tx * r / Math.sqrt(tx * tx + ty * ty);
                    newDy1 = ty * r / Math.sqrt(tx * tx + ty * ty);

                    //如果间隔小于3小时，自动调整退房时间
                    if (h2 - h1 < partTimeInterval) {
                        h2 = h1 + partTimeInterval;
                        t2.setHours(h2);
                        newCoord = getCoordByHour(h2);
                        dx2 = newCoord.x;
                        dy2 = newCoord.y;
                    }

                    draw(newDx1, newDy1, dx2, dy2);
                }
            }
        }

        // if (isDot2Touched(tx, ty) && isTouchDot2 && !isTouchDot1) {//手指要沿着圆拖动
        if (isTouchDot2 && !isTouchDot1 && (status.key == status.partTimeClock)) {
            //只有时租房模式才能转动退房时间
            clock2 = calHour(h2, tx, ty);
            if((clock2.time >= partTimeStart + partTimeInterval) 
                && (clock2.time<= partTimeEnd + partTimeInterval)
                && clock2.time >= getNowHour() + partTimeInterval) {
                //日期联动
                // deltaHour2 += clock.deltaHour;
                // t2 = dateAdd(beforeTouchT2, 'h', deltaHour2);
                h2 = clock2.time;
                t2.setHours(h2);
                // if (isChangeDay(beforeTouchT2, deltaHour2, h2)) {
                //     Observer.fire('endChange', {
                //         date: t2,
                //         delta: clock.deltaHour,
                //     });
                // }

                // if (t2 <= t1) {
                //     t1 = dateAdd(t1, 'd', -1);
                //     Observer.fire('startChange', {
                //         date: t1,
                //         delta: -1,
                //     });
                // }

                //沿着圆平滑移动
                newDx2 = tx * r / Math.sqrt(tx * tx + ty * ty);
                newDy2 = ty * r / Math.sqrt(tx * tx + ty * ty);
                //步进模式
                // newCoord = clockStep(tx, ty);
                // draw(dx1, dy1, newCoord.x, newCoord.y);

                //如果间隔小于3小时，自动调整入住房时间
                if (h2 - h1 < partTimeInterval) {
                    h1 = h2 - partTimeInterval;
                    t1.setHours(h1);
                    newCoord = getCoordByHour(h1);
                    dx1 = newCoord.x;
                    dy1 = newCoord.y;
                }

                draw(dx1, dy1, newDx2, newDy2);
            }
        }

        getStartandEnd();
    }

    canvas.ontouchend = function(e) {
        isTouchDot1 = false;
        isTouchDot2 = false;

        deltaHour1 = 0;
        deltaHour2 = 0;

        _tempDate = null;
    }

    //画布初始化
    function iniCanvas() {
        canvas.width = cw;
        canvas.height = ch;
        ctx.translate(cw / 2, ch / 2); //画布原点移到 0，0

        var coord = getCoordByHour(h1);
        dx1 = coord.x;
        dy1 = coord.y;

        coord = getCoordByHour(h2);
        dx2 = coord.x;
        dy2 = coord.y;

        //初始值
        draw(dx1, dy1, dx2, dy2);

        getStartandEnd();
    }

    //根据小时获取对应表面坐标
    function getCoordByHour(hour) {
        var x, y;

        if (hour > 12) {
            x = hourCoord[hour - 13].x;
            y = hourCoord[hour - 13].y;
        } else if (hour == 12 || hour == 0) {
            x = 0;
            y = -1 * r;
        } else {
            x = hourCoord[hour - 1].x;
            y = hourCoord[hour - 1].y;
        }

        return {
            x: x,
            y: y
        }
    }

    //显示入住时间和退房时间
    function getStartandEnd() {
        $('#startDay').innerHTML = (t1.getMonth() + 1) + '月' + t1.getDate() + '日';
        // $('#startDay').innerHTML = t1.toString();
        $('#startHour').innerHTML = h1 + ':00';


        $('#endDay').innerHTML = (t2.getMonth() + 1) + '月' + t2.getDate() + '日';
        // $('#endDay').innerHTML = t2.toString();
        $('#endHour').innerHTML = h2 + ':00';

    }

    function calHour(hour, tx, ty) {
        //根据位置算出目前的角度
        var cos = Math.acos(tx / Math.sqrt(tx * tx + ty * ty)),
            angle = cos * 360 / 2 / Math.PI,
            deltaHour = 0,
            deltaDay = 0,
            oldHour = hour;

        //换算到时钟的坐标系
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
        //算出目前是表盘上的几点，直接舍去小数点
        var newHour = Math.floor(angle / 360 * 12);

        //从12转换到24
        if (hour == 0) {
            if (newHour == 11) {
                hour = 23;
                deltaDay = -1;
            } else {
                hour = newHour;
            }
        } else if (hour == 11) {
            if (newHour == 0) {
                hour = 12;
            } else {
                hour = newHour;
            }
        } else if (hour == 12) {
            if (newHour == 11)
                hour = 11;
            else
                hour = newHour + 12;
        } else if (hour > 12 && hour < 23) {
            hour = newHour + 12;
        } else if (hour == 23) {
            if (newHour == 0) {
                hour = 0;
                deltaDay = 1;
            } else {
                hour = newHour + 12;
            }
        } else {
            hour = newHour;
        }

        //算出小时增量
        if (deltaDay == 1) {
            deltaHour = 1
        } else if (deltaDay == -1) {
            deltaHour = -1;
        } else {
            deltaHour = hour - oldHour;
        }

        return {
            time: hour,
            deltaHour: deltaHour
        };
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

    function draw(x1, y1, x2, y2) {
        ctx.fillStyle = canvasBackgroundColor;
        ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
        drawClock();

        drawTime();
        drawArc();

        
        if (status.key == status.dayClock) {
            drawDot(x2, y2, true);
            drawDotText("退", x2, y2, true);
        } else {
            drawDot(x2, y2, false);
            drawDotText("退", x2, y2, false);
        }
        //记录点2的最新位置
        dx2 = x2;
        dy2 = y2;

        drawDot(x1, y1, false);
        drawDotText("入", x1, y1, false);
        //记录点1的最新位置
        dx1 = x1;
        dy1 = y1;
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
            ctx.fillStyle = "#eee";
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
        var dayNum = Math.floor((Date.parse(t2) - Date.parse(t1)) / 86400000);
        h = 0;

        if (dayNum > 0) {
            h = (dayNum * 24 + h2 - h1) % 24;
        } else {
            // h = Math.floor((Date.parse(t2) - Date.parse(t1)) / 3600000);

            h = h2 - h1;
            if (h <= 0) {
                h = 24 + h;
            }
        }

        if (dayNum > 0) {
            circleColor = colorArray[dayNum < 10 ? dayNum : 9];
            ctx.fillText(dayNum + "天 " + h + "小时", 0, 0);
            timeSpan = dayNum + "天 " + h + "小时";
        } else {
            circleColor = colorArray[0];
            ctx.fillText(h + "小时", 0, 0);
            timeSpan = h + "小时";
        }

        //画圆环
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
        ctx.strokeStyle = circleColor;
        ctx.lineWidth = lw;
        ctx.stroke();
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

    function drawDot(x, y, isDisabled) {

        ctx.beginPath();
        ctx.arc(x, y, dr, 0, 2 * Math.PI, true);
        if(isDisabled) {
            ctx.fillStyle = arcColor; 
        } else {
            ctx.fillStyle = dotColor;     
        }
        ctx.fill();

        if(!isDisabled){
            ctx.arc(x, y, dr, 0, 2 * Math.PI, true);
            ctx.strokeStyle = arcColor;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    function drawDotText(text, x, y, isDisabled) {
        if (isDisabled) {
            ctx.fillStyle = "#fff";
        } else {
            ctx.fillStyle = arcColor;
        }
        ctx.font = "20px serif";
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

    //判断是否跨天
    function isChangeDay(date, deltaHour, hour) {
        var newDate = dateAdd(date, 'h', deltaHour),
            isChange = false;

        if (!isSameDay(newDate, date)) {
            if (_tempDate) {
                if (!isSameDay(newDate, _tempDate)) {
                    isChange = true;
                }
            } else {
                isChange = true;
            }
            _tempDate = newDate;
        } else {
            if (_tempDate) {
                if (!isSameDay(newDate, _tempDate)) {
                    isChange = true;
                }
            }
            _tempDate = newDate;
        }
        return isChange;
    }

    function isSameDay(a, b) {
        return a.getFullYear() == b.getFullYear() &&
            a.getMonth() == b.getMonth() &&
            a.getDate() == b.getDate();
    }

    function formatDate(date, type) {
        switch (type) {
            case 'yyyy-mm-dd hh:00':
                return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':00';
            case 'yyyy-mm-dd':
                return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        }
    }

    function getNowHour(){
        var date = new Date();
        return date.getHours();
    }

    return {
        setStatus: function(key) {

            status.key = key;
            if (key == status.dayClock) {
                this.setEndHour(12); //夜房固定12点退房
            }
            getSessionData();

            getStartandEnd();
            draw(dx1, dy1, dx2, dy2);
        },
        setStart: function(month, day) {
            t1.setMonth(month - 1);
            t1.setDate(day);
            getStartandEnd();
            draw(dx1, dy1, dx2, dy2);
        },
        setEnd: function(month, day) {
            t2.setMonth(month - 1);
            t2.setDate(day);
            getStartandEnd();
            // this.setEndHour(12); //夜房固定12点退房
            draw(dx1, dy1, dx2, dy2);
        },
        setPartTimeStart: function(hour) {
            t1 = new Date();
            this.setStartHour(hour);
        },
        setPartTimeEnd: function(hour) {
            t2 = new Date();
            this.setEndHour(hour + partTimeInterval);
            // if ((h1 > 6) && (h1 + 6 < 24)) { //6点以前，18点以后不能订钟点
            //     this.setEndHour(h1 + 3); //钟点房最短间隔3个小时
            // } else if (h1 <= 6) {
            //     this.setEndHour(12);
            // } else {
            //     dateAdd(t2, 'd', 1);
            //     Observer.fire('endChange', {
            //         date: t2,
            //         delta: 1,
            //     });
            // }

            draw(dx1, dy1, dx2, dy2);
        },
        getStartHour: function() {
            return t1.getHours();
        },
        getEndHour: function() {
            return t2.getHours();
        },
        getStart: function() {
            return formatDate(t1, 'yyyy-mm-dd hh:00');
        },
        getEnd: function() {
            return formatDate(t2, 'yyyy-mm-dd hh:00');
        },
        setStartHour: function(hour) {
            t1.setHours(hour);

            h1 = hour;
            var coord = getCoordByHour(hour);
            dx1 = coord.x;
            dy1 = coord.y;
            getStartandEnd();
        },
        setEndHour: function(hour) {
            t2.setHours(hour);

            h2 = hour;
            var coord = getCoordByHour(hour);
            dx2 = coord.x;
            dy2 = coord.y;
            getStartandEnd();
        },
        getTimeSpan: function() {
            return timeSpan;
        },
        getStartShow: function() {
            return (t1.getMonth() + 1) + '月' + t1.getDate() + '日' + '<br>' + t1.getHours() + ':00<br>' + getWeekday(formatDate(t1, 'yyyy-mm-dd'));
        },
        getEndShow: function() {
            return (t2.getMonth() + 1) + '月' + t2.getDate() + '日' + '<br>' + t2.getHours() + ':00<br>' + getWeekday(formatDate(t2, 'yyyy-mm-dd'));
        },
        getCoord: function(index) {
            return hourCoord[index];
        }
    };
};
