var tapCount = 0; 
//时租房时间选择
var vmPart = avalon.define({
    $id: "partTime",
    statusControl: {
        isTimeListShow: true, //时租房时间列表是否显示
    },
    //时间选择
    partTimeClick: function() {
        vmPart.statusControl.isTimeListShow = true;
    },
    minIndex: 16,
    maxIndex: 40,
    partTimeIndex: 0, //时租房开始序号
    partTimeNumber: 6, //时租房数列（半小时1个单位）
    partTimeStart: "", //时租房开始时间
    partTimeEnd: "", //时租房结束时间
    timeStatus: "000000000000000000000000000000000000000000000000", //默认都可以选
    timeList: [],
    partTimePrice: [], //房间时租房时段价格
    partTimePay: 0, //时租房费用
    selectTime: function(index) {
        tapCount++;
        if (tapCount < 2) {
            //时租房订房开始时间受当前时间影响
            var hourIndex = getHourIndex();
            if (index <= hourIndex)
                index = hourIndex + 1;

            //时租房订房结束时间不能超过最大值
            if (index + vmPart.partTimeNumber > vmPart.maxIndex) {
                vmPart.partTimeNumber = vmPart.maxIndex - index;
            }

            if (index >= vmPart.minIndex && (index <= (vmPart.maxIndex - 6)) && vmPart.partTimeNumber >= 6) {
                vmPart.partTimeIndex = index;

                select_bar.style.top = this.offsetTop + 'px';

                select_bar.style.height = '';
                select_bar.className = "bar";

                var list = vmPart.timeList;

                for (var i = 1; i <= vmPart.partTimeNumber; i++) {
                    if (list[index + i].isBook || list[index + i].isWait) {
                        vmPart.partTimeIndex = index - (vmPart.partTimeNumber - i);
                        select_bar.style.top = this.offsetTop - 21 * (vmPart.partTimeNumber - i) + 'px';
                        break;
                    }
                }
                setPartTime(vmPart.partTimeIndex, vmPart.partTimeNumber);
            } else {
                vmPart.partTimeIndex = 0;
                vmPart.partTimeNumber = 6;
                vmPart.partTimeStart = "";
                vmPart.partTimeEnd = "";
                vmPart.partTimePay = 0;
            }
            tapCount = 0;
        }
        setTimeout(function() {
            tapCount = 0;
        }, 100)
    },
    addTime: function() {

        if ((vmPart.partTimeIndex + vmPart.partTimeNumber) < vmPart.maxIndex && canOrderPartTime()) {
            vmPart.partTimeNumber++;

            select_bar.style.height = select_bar.offsetHeight + 21 + 'px';

            setPartTime(vmPart.partTimeIndex, vmPart.partTimeNumber);
        }
    },
    minusTime: function() {
        if (vmPart.partTimeNumber > 6) {
            vmPart.partTimeNumber--;

            select_bar.style.height = select_bar.offsetHeight - 21 + 'px';

            setPartTime(vmPart.partTimeIndex, vmPart.partTimeNumber);
        } else {
            select_bar.className = "mui-hidden bar";
            vmPart.partTimeStart = "";
            vmPart.partTimeEnd = "";
            vmPart.partTimeIndex = 0;
        }
    },
})

//获得时租房的入住退房时间，费用
function setPartTime(index, number) {
    var startHour = Math.floor(index / 2);
    var endHour = Math.floor((index + number) / 2);
    vmPart.partTimeStart = (startHour < 10 ? ('0' + startHour) : startHour) + ":" + (index % 2 ? "30" : "00");
    vmPart.partTimeEnd = (endHour < 10 ? ('0' + endHour) : endHour) + ":" + ((index + number) % 2 ? "30" : "00");

    vmPart.partTimePay = 0;
    for (var i = index; i < (index + number); i++) {
        vmPart.partTimePay += vmPart.partTimePrice[i];
    }
}

//房间状态返回时租房时间列表对象
function getTimeList(status) {
    var list = status.split(''),
        olist = [],
        o = {},
        count = 0,
        index = getHourIndex();

    //已过的时间都灰掉
    for (var i = 0; i < 48; i++) {
        if (i < index) {
            list[i] = '1';
        }
    }
    vmPart.timeStatus = list.join('');

    for (var i = 0; i < 48; i++) {
        if (count > 0) {
            count++;
        }

        o = { isBook: 0, isWait: 0, price: 0, node: 0 };

        if (list[i] == 0 && (list[i - 1] == 1)) {
            o.isWait = 1;
            count = 1;
        }
        if (list[i] == 0 && (list[i + 1] == 1)) {
            o.isWait = 1;
        }

        if (list[i] == 1) {
            o.isBook = 1;
            //间隔不足5个全部灰掉
            if (count <= 6 && count > 0) {
                for (var j = 1; j <= count; j++) {
                    olist[olist.length - j].isBook = 1;
                }
            }
            count = 0;
        }

        o.price = vmPart.$model.partTimePrice[i];
        if (o.price != vmPart.$model.partTimePrice[i - 1]) {
            o.node = 1;
        }
        olist.push(o);

    }

    return olist;
}

//判断是否能否半个小时能否订时租房
function canOrderPartTime() {
    var list = vmPart.timeList;
    return !(list[vmPart.partTimeIndex + vmPart.partTimeNumber].isBook || list[vmPart.partTimeIndex + vmPart.partTimeNumber].isWait);
}

//在时租房时间列表上，显示时间段节点价格
function partTimePriceShow(index, node, price) {
    if (node) {
        return " " + index / 2 + "点以后，每半小时 " + price + " 元";
    } else {
        return '';
    }
}

vmPart.timeList = getTimeList(vmPart.timeStatus);

vmPart.$watch("partTimeIndex", function(a) {
    var startShow, endShow, amount,
        start = vmPart.partTimeStart,
        end = vmPart.partTimeEnd;

    if (start) {
        startShow = '今日<br><br>' + start;
    } else {
        startShow = '<br>请选择';
    }

    if (end) {
        endShow = '今日<br><br>' + end;
    } else {
        endShow = '<br>请选择';
    }

    if (start && end) {
        amount = vmPart.partTimeNumber / 2;
    } else {
        amount = '?';
    }

    $.extend(newOrder.partTime, {
        partTimeIndex: a,
        partTimeNumber: vmPart.partTimeNumber,
        startShow: startShow,
        endShow: endShow,
        amount: amount
    });
    Storage.set("newOrder", newOrder);
});

vmPart.$watch("partTimeNumber", function(a) {
    var startShow, endShow, amount,
        start = vmPart.partTimeStart,
        end = vmPart.partTimeEnd;

    if (start) {
        startShow = '今日<br><br>' + start;
    } else {
        startShow = '<br>请选择';
    }

    if (end) {
        endShow = '今日<br><br>' + end;
    } else {
        endShow = '<br>请选择';
    }

    if (start && end) {
        amount = vmPart.partTimeNumber / 2;
    } else {
        amount = '?';
    }

    $.extend(newOrder.partTime, {
        partTimeIndex: vmPart.partTimeIndex,
        partTimeNumber: a,
        startShow: startShow,
        endShow: endShow,
        amount: amount
    });
    Storage.set("newOrder", newOrder);
});
