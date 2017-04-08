var hid, roomTypeId, bensue, newOrder, vmRoom, vmBtn, vmDesigner, vmAmenity,
    isSuccess = false,
    roomType = 0,//住宿类型
    user = Storage.getLocal("user");

hid = getParam("hid");
if (hid != "") {
    if (isNaN(hid)) {
        location.href = document.referrer || "index.html";
    } else {
        hid = parseInt(hid);
    }
} else {
    location.href = "index.html";
}

//房型
roomTypeId = getParam("tid");
if (roomTypeId != "") {
    if (isNaN(roomTypeId)) {
        location.href = document.referrer || "index.html";
    } else {
        roomTypeId = parseInt(roomTypeId);
    }
} else {
    location.href = "index.html";
}

vmRoom = avalon.define({
    $id: "room",
    type: 0, //0 全天房，1 时租房, 2 午夜房
    start: '请选择',
    end: '请选择',
    amount: '0',
    unit: '',
    price: 0,
    room: {
        hotel: {
            name: '',
            alias: '',
            address: ''
        },
        roomGalleryList: [],
        designer: {
            name: '',
            message: ''
        },
        amenityList: []
    },
    assess: {
        count: 0,
        data: {}
    },
    list: [],
    startTimeIndex: 1, //夜房入住时间表盘
    todayIndex: 0,
    startIndex: -1,
    roomNightDiscount: [{
        discount: 0
    }],
    checkinList: [],
    isAgree: true,
    getData: function() {
        //获取房型详情
        ajaxJsonp({
            url: urls.getRoomTypeDetail,
            data: {
                tid: roomTypeId,
                startTime: vmRoom.type ? newOrder.partTime.start : newOrder.day.start,
                endTime: vmRoom.type ? newOrder.partTime.end : newOrder.day.end,
                hid: hid,
                isPartTime: roomType,
                aids: vmRoom.aids,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmRoom.room = json.data;

                    $.extend(newOrder, {
                        room: {
                            id: json.data.id,
                            name: json.data.name
                        },
                        hotel: {
                            id: json.data.hotel.id,
                            name: json.data.hotel.name,
                            address: json.data.hotel.address
                        }
                    });
                    Storage.set("newOrder", newOrder);

                    vmAmenity.list = json.data.optionalAmenityList;
                    vmDesigner.designer = json.data.designer;
                    if (roomType == 1) {
                        //时租房的价格，接口返回的是每半个小时
                        vmRoom.price = vmRoom.room.minPrice * 2;
                    }
                }
            }
        });
    },
    goHotel: function() {
        stopSwipeSkip.do(function() {
            location.href = "index.html";
            // location.href = "hotel.html?id=" + vmRoom.room.hotel.id;
        });
    },
    openNav: function() {
        stopSwipeSkip.do(function() {
            if (isSuccess) {
                wx.openLocation({
                    latitude: vmRoom.room.hotel.lat, // 纬度，浮点数，范围为90 ~ -90
                    longitude: vmRoom.room.hotel.lng, // 经度，浮点数，范围为180 ~ -180。
                    name: vmRoom.room.hotel.name, // 位置名
                    address: vmRoom.room.hotel.address, // 地址详情说明
                    scale: 26, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
                });
            } else {
                alert("微信接口配置注册失败，将重新注册");
                registerWeixinConfig();
            }
        });
    },
    openFilter: function() {
        event.stopPropagation();
        stopSwipeSkip.do(function() {
            vmBtn.type = "amenity";
            vmBtn.useCheck = 1;
            popover('./util/roomFilter.html', 1);
        })
    },
    openTimePanel: function() {
        stopSwipeSkip.do(function() {
            if (vmRoom.type == 0) {
                vmBtn.type = "date";
                vmBtn.useCheck = 1;
                modalShow('./util/calendar.html', 1, function() {
                    $('#calendarPanel').height($(window).height() - 230);
                    //初始状态打开选择入住时间
                    if (!(vmCalendar.statusControl.isEndEdit || vmCalendar.statusControl.isStartEdit)) {
                        vmCalendar.startClick();
                    }
                    newOrder.day.todayIndex = vmCalendar.todayIndex;
                    vmRoom.todayIndex = vmCalendar.todayIndex;
                    // if (!bookDateList) {
                    //     //查询夜房预订日期
                    //     ajaxJsonp({
                    //         url: urls.getRoomBookDate,
                    //         data: {
                    //             rid: roomid
                    //         },
                    //         successCallback: function(json) {
                    //             if (json.status == 1) {
                    //                 bookDateList = {
                    //                     inIndex: [],
                    //                     inStr: json.data.list3.concat(json.data.list1),
                    //                     outIndex: [],
                    //                     outStr: json.data.list3.concat(json.data.list2),
                    //                 };

                    //                 getCalendar();
                    //             }
                    //         }
                    //     });
                    // }

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

var now = new Date();
t1 = now.getHours();
//步进模式，记录步进点的坐标
for (var i = 1; i <= 12; i++) {
    hourCoord.push({
        x: r * Math.cos((i - 3) / 12 * 2 * Math.PI),
        y: r * Math.sin((i - 3) / 12 * 2 * Math.PI)
    });
}
if (t1 > 12) {
    dx1 = hourCoord[t1 - 13].x;
    dy1 = hourCoord[t1 - 13].y;
} else if (t1 == 12 && t1 == 0) {
    dx1 = 0;
    dy1 = -100;
} else {
    dx1 = hourCoord[t1 - 1].x;
    dy1 = hourCoord[t1 - 1].y;
}

canvas.width = cw;
canvas.height = ch;
ctx.translate(cw / 2, ch / 2); //画布原点移到 0，0
document.getElementById('startHour').innerHTML = t1 + ':00';
document.getElementById('endHour').innerHTML = t2 + ':00';

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

    var n = Math.floor((dayNum * 24 + t2 - t1)/24),
        r = (dayNum * 24 + t2 - t1)%24;
    if (n>0) {
        ctx.fillText(n + "天 " + r + "小时", 0, 0);
    } else {
        ctx.fillText(r + "小时", 0, 0);
    }
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
                });
            } else {
                vmBtn.type = "partTime";
                vmBtn.useCheck = 1;
                popover('./util/partTime.html', 1, function() {
                    $('#select_time').height($(window).height() - 150);
                    loadSessionPartTime();

                    //查询时租房预订时间情况
                    // ajaxJsonp({
                    //     url: urls.getRoomStatus,
                    //     data: {
                    //         rid: roomid,
                    //         roomDate: getToday('date')
                    //     },
                    //     successCallback: function(json) {
                    //         if (json.status == 1) {
                    //             vmPart.timeList = getTimeList(json.data.status);
                    //         }
                    //     }
                    // });
                });
            }
        });
    },
    openDesigner: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 0;
            popover('./util/designer.html', 1);
        });
    },
    // openAssess: function() {
    //     stopSwipeSkip.do(function() {
    //         vmBtn.useCheck = 0;
    //         popover('./util/assess.html', 1);
    //     });
    // },
    openCheckin: function() {
        stopSwipeSkip.do(function() {
            vmBtn.type = "checkin";
            vmBtn.useCheck = 1;
            popover('./util/contactList.html', 1, function() {

                //获取联系人列表
                ajaxJsonp({
                    url: urls.getContactList,
                    data: {
                        pageSize: 30 //因为要维护选中状态，没有用loadmore按钮
                    },
                    successCallback: function(json) {
                        if (json.status === 1) {
                            vmContactList.list = json.data.list;

                            //读取本地保存
                            if (newOrder.hasOwnProperty("contact")) {
                                vmContactList.selectedList = [];
                                for (var i in json.data.list) {
                                    if (newOrder.contact.length > 0) {
                                        //绑定本地储存已选联系人
                                        newOrder.contact.map(function(c) {
                                            if (c.id == json.data.list[i].id) {
                                                vmContactList.selectedList.push(parseInt(i));
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
            });
        });
    },
    selectDiscount: function(index, hour) {
        stopSwipeSkip.do(function() {
            var isDisabled = disableCheckinTime(vmRoom.startIndex, hour);

            if (!isDisabled) {
                vmRoom.startTimeIndex = index;

                newOrder.day.startTimeIndex = index;
                newOrder.day.startTime = vmRoom.roomNightDiscount[index].startTime;

                Storage.set("newOrder", newOrder);
            }
        })
    },
    clickIsAgree: function() {
        stopSwipeSkip.do(function() {
            vmRoom.isAgree = !vmRoom.isAgree;
        });
    },
    openRule: function() {
        event.stopPropagation();
        stopSwipeSkip.do(function() {
            vmBtn.type = "rule";
            vmBtn.useCheck = 1;
            popover('./util/note.html', 1);
        })
    },
    showTotalPrice: function(price, amount) {
        if (isNaN(amount)) {
            return round(price);
        } else {
            return round(price * amount);
        }
    },
    goRoom: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "room.html?hid=" + hid + "&tid=" + id;
        });
    },
    goHotelById: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "index.html";
            // location.href = "hotel.html?id=" + id;
        });
    },
    isGoNext: false,
    //下单
    goNext: function() {
        var popCase = '';
        vmRoom.isGoNext = true;
        // Storage.set("newOrder", newOrder);

        if (vmRoom.type == 1) {
            if (!newOrder.partTime.start || !newOrder.partTime.end || newOrder.partTime.start == '' || newOrder.partTime.end == '' || newOrder.partTime.start.length < 12 || newOrder.partTime.end.length < 12) {
                // mui.toast('请选择时间');
                popCase = 'time';
                vmRoom.isGoNext = false;
            }
        } else {
            if (!newOrder.day.start || !newOrder.day.end || newOrder.day.start == '' || newOrder.day.end == ' 14:00') {
                // mui.toast('请选择时间');
                popCase = 'time';
                vmRoom.isGoNext = false;
            }
        }

        if (vmRoom.isGoNext && vmRoom.checkinList.length < 1) {
            // mui.toast('请选择入住人');
            vmRoom.isGoNext = false;
            popCase = 'checkin';
        }

        if (vmRoom.isGoNext && !vmRoom.isAgree) {
            // mui.toast('请阅读并同意《入住条款》');
            vmRoom.isGoNext = false;
            popCase = 'rule';
        }

        if (vmRoom.isGoNext) {
            ajaxJsonp({
                url: urls.submitOrder,
                data: {
                    tid: roomTypeId,
                    startTime: vmRoom.type ? newOrder.partTime.start : (newOrder.day.start + " " + newOrder.day.startTime + ":00"),
                    endTime: vmRoom.type ? newOrder.partTime.end : newOrder.day.end,
                    isPartTime: vmRoom.type,
                    cids: newOrder.contact.map(function(o) {
                        return o.id;
                    }).join(','),
                    aids: vmRoom.aids,
                },
                successCallback: function(json) {
                    if (json.status == 1) {
                        Storage.delete("newOrder");   //清空该用户的缓存记录

                        location.href = "order.html?id=" + json.data.id;
                    } else {
                        alert(json.message);
                        vmRoom.isGoNext = false;
                    }
                }
            })
        } else {
            switch (popCase) {
                case 'time':
                    vmRoom.openTimePanel();
                    vmRoom.openTimePanel();
                    break;
                case 'checkin':
                    vmRoom.openCheckin();
                    vmRoom.openCheckin();
                    break;
                case 'rule':
                    vmRoom.openRule();
                    vmRoom.openRule();
                    break;
                default:
                    break;
            }
        }
    },
    swiper1Render: function() {
        var swiper1 = new Swiper('.swiper1', {
            slidesPerView: 1,
            width: window.innerWidth,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4,
            autoplay: 3000,
            speed: 300
        });

        mui.previewImage();
    },
    swiper2Render: function() {
        var swiper2 = new Swiper('.swiper2', {
            slidesPerView: 1,
            width: window.innerWidth - 20,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4
        });
    },
    swiper3Render: function() {
        var swiper3 = new Swiper('.swiper3', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto'
        });
    },
    swiper4Render: function() {
        var swiper4 = new Swiper('.swiper4', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto'
        });
    },
    //显示夜房的入住时间
    showDate: function() {
        var startObj, endObj, startIndex, endIndex;
        if (vmCalendar.startIndex == -1) {
            vmRoom.start = '请选择';
        } else {
            startObj = vmCalendar.calendar[vmCalendar.startIndex];
            if (startObj) {
                startIndex = vmCalendar.startIndex;
                vmRoom.start = startObj.month + '月' + startObj.day + '日' + '<br>' + getWeekday(startObj.date);
            }
        }

        if (vmCalendar.endIndex == -1) {
            vmRoom.end = '请选择';
        } else {
            endObj = vmCalendar.calendar[vmCalendar.endIndex];
            if (endObj) {
                endIndex = vmCalendar.endIndex;
                vmRoom.end = endObj.month + '月' + endObj.day + '日' + '<br>' + getWeekday(endObj.date);
            }
        }

        if ((startIndex >= 0) && endIndex) {
            vmRoom.amount = (endIndex - startIndex);
        } else {
            vmRoom.amount = '0';
        }

        dateDataToSession();
    },
    //显示时租房的入住时间
    showPartTime: function() {
        var start = vmPart.partTimeStart,
            end = vmPart.partTimeEnd;
        if (start) {
            vmRoom.start = '今日<br>' + start;
        } else {
            vmRoom.start = '请选择';
        }

        if (end) {
            vmRoom.end = '今日<br>' + end;
        } else {
            vmRoom.end = '请选择';
        }

        if (start && end) {
            vmRoom.amount = vmPart.partTimeNumber / 2;
        } else {
            vmRoom.amount = '0';
        }

        dateDataToSession();
    }
});

//弹出框的确定按钮
vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //打开的窗口类型
    useCheck: 1, //1 checkButton, 0 closeButton
    ok: function() {
        switch (vmBtn.type) {
            case 'amenity':
                vmRoom.aids = vmAmenity.selectedList.join(',');
                saveStorage();
                break;
            case 'date':
                vmRoom.showDate();
                saveStorage();
                vmRoom.startIndex = vmCalendar.startIndex;
                vmCalendar.startClick();
                break;
            case 'partTime':
                vmRoom.showPartTime();
                saveStorage();
                break;
            case 'checkin':
                if (vmContactList.selectDone()) {
                    vmRoom.checkinList = newOrder.contact;
                    break;
                } else {
                    return;
                }
            case 'rule':
                vmRoom.isAgree = true;
                break;
        }
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})

vmDesigner = avalon.define({
    $id: "designer",
    designer: {
        portraitUrl: '',
        name: '',
        message: ''
    }
});

vmAmenity = avalon.define({
    $id: 'amenity',
    list: [],
    selectedList: [],
    select: function(id) {
        stopSwipeSkip.do(function() {
            var i = vmAmenity.selectedList.indexOf(id);
            if (i == -1) {
                vmAmenity.selectedList.push(id);
            } else {
                vmAmenity.selectedList.splice(i, 1);
            }
        });
    }
});

//获取住宿类型 0-全天房，1-时租房，2-午夜房
bensue = Storage.get("bensue");
if (bensue) {
    roomType = bensue.type || 0;
}
vmRoom.type = roomType;

newOrder = Storage.get("newOrder");
if (newOrder) {
    //显示本地时间数据
    if (newOrder.day) {
        sessionToDateData();
    }

    //本地有入住人信息优先使用本地数据
    //没有的话就读接口查询是否设置过默认入住人
    if (newOrder.contact && newOrder.contact.length > 0) {
        vmRoom.checkinList = newOrder.contact;
    } else {
        newOrder.contact = [];
    }
} else {
    newOrder = {
        room: {},
        hotel: {},
        day: {
            filter: []
        },
        partTime: {
            filter: []
        },
        contact: []
    };
}

room_init();

//用pullRefresh防止穿透
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        down: {
            height: 50, //可选,默认50.触发下拉刷新拖动距离,
            auto: true, //可选,默认false.自动下拉刷新一次
            contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: reload //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
    }
});

//下拉刷新
function reload() {
    //room_init();
    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    mui('#pullrefresh').pullRefresh().refresh(true);
}

/*
 **函数声明
 */
function room_init() {
    vmRoom.getData();

    if (roomType == 0) {
        //查询房间夜房优惠价格
        ajaxJsonp({
            url: urls.getRoomNightDiscount,
            data: {
                tid: roomTypeId
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmRoom.roomNightDiscount = json.data;

                    //加载本地保存数据
                    if (newOrder.day && newOrder.day.startTimeIndex > 0) {
                        vmRoom.startTimeIndex = newOrder.day.startTimeIndex;
                        vmRoom.price = json.data[newOrder.day.startTimeIndex].discount;

                        if (getToday('date') == newOrder.day.start) {
                            setDefaultStartTime();
                        }
                    } else {
                        //默认选择第二个时间
                        vmRoom.price = json.data[1].discount;
                        newOrder.day.startTimeIndex = 1;
                        newOrder.day.startTime = json.data[1].startTime;
                        Storage.set("newOrder", newOrder);
                    }
                }
            }
        });
    }

    //更多房间
    ajaxJsonp({
        url: urls.getRoomTypeList,
        data: {
            hid: hid,
            isPartTime: vmRoom.type,
            startTime: vmRoom.type ? newOrder.partTime.start : newOrder.day.start,
            endTime: vmRoom.type ? newOrder.partTime.end : newOrder.day.end,
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmRoom.list = json.data;
            } else {
                console.log(json.message);
            }
        }
    });

    //获取评论
    // ajaxJsonp({
    //     url: urls.getRoomAssess,
    //     data: { rid: roomid, pageSize: 20 },
    //     successCallback: function(json) {
    //         if (json.status === 1) {
    //             json.data.list.map(function(o) {
    //                 o.s = vmRoomAssess.sum(o.score1, o.score2, o.score3);
    //             })
    //             vmRoomAssess.list = json.data.list;
    //             vmRoomAssess.count = json.data.count;
    //         }
    //     }
    // });

    if(user && user.logState) {
        //获取默认联系人
        ajaxJsonp({
            url: urls.getContactList,
            successCallback: function(json) {
                var defaultList = [];
                if (json.status === 1) {
                    json.data.list.map(function(o) {
                        if (o.isDefault) {
                            defaultList.push(o);
                        }
                    });
                    //如果有默认入住人，就覆盖本地数据
                    if (defaultList.length > 0) {
                        newOrder.contact = defaultList;
                        vmRoom.checkinList = defaultList;
                    }
                }
            }
        });
    }

    registerWeixinConfig();
}

//判断夜房的入住时间时钟是否要灰掉
// @todayIndex: 日历模块中今天的序号
// @hour: 入住时间，几点
function disableCheckinTime(startIndex, hour) {
    //入住时间选今天，要灰掉小于当前时间的表盘
    // if (vmRoom.todayIndex == startIndex) {
    //     if (hour * 2 < getHourIndex() && hour < vmRoom.roomNightDiscount[3].startTime) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // } else if
    // if (bookDateList && bookDateList.outIndex.indexOf(startIndex) > -1) {
    //     //14点以前的入住时段要灰掉
    //     //设置默认表盘
    //     if (hour < 14) {
    //         var index = vmRoom.startTimeIndex;
    //         while(vmRoom.roomNightDiscount[index].startTime  < 14) {
    //             if(index == 3) {
    //                 break;
    //             }
    //             index ++;
    //         }
    //         vmRoom.startTimeIndex = index;

    //         vmRoom.price = vmRoom.roomNightDiscount[index].discount;
    //         newOrder.day.startTimeIndex = index;
    //         newOrder.day.startTime = vmRoom.roomNightDiscount[index].startTime;
    //         Storage.set("newOrder", newOrder);
    //         return true;
    //     } else {
    //         return false;
    //     }
    // } else {
    //     return false;
    // }

    return false;
}

function getClock(index, startTimeIndex, startIndex, hour) {
    var isDisabled = disableCheckinTime(startIndex, hour);
    switch (index) {
        case 0:
            if (isDisabled) {
                return 'img/clock/6-dis.png';
            } else {
                if (index == startTimeIndex) {
                    return 'img/clock/6-sel.png';
                } else {
                    return 'img/clock/6.png';
                }
            }
        case 1:
            if (isDisabled) {
                return 'img/clock/13-dis.png';
            } else {
                if (index == startTimeIndex) {
                    return 'img/clock/13-sel.png';
                } else {
                    return 'img/clock/13.png';
                }
            }
        case 2:
            if (isDisabled) {
                return 'img/clock/16-dis.png';
            } else {
                if (index == startTimeIndex) {
                    return 'img/clock/16-sel.png';
                } else {
                    return 'img/clock/16.png';
                }
            }
        case 3:
            if (isDisabled) {
                return 'img/clock/6-dis.png';
            } else {
                if (index == startTimeIndex) {
                    return 'img/clock/6-sel.png';
                } else {
                    return 'img/clock/6.png';
                }
            } 
    }
}

function dateDataToSession() {
    if (roomType == 0) {
        newOrder.day.startShow = vmRoom.start;
        newOrder.day.endShow = vmRoom.end;
        newOrder.day.amount = vmRoom.amount;
    } else {
        newOrder.partTime.startShow = vmRoom.start;
        newOrder.partTime.endShow = vmRoom.end;
        newOrder.partTime.amount = vmRoom.amount;
    }

    Storage.set("newOrder", newOrder);
}

function sessionToDateData() {
    if (roomType == 0) {
        if (newOrder.day.startShow) {
            vmRoom.start = newOrder.day.startShow;
        }
        if (newOrder.day.endShow) {
            vmRoom.end = newOrder.day.endShow;
        }
        if (newOrder.day.amount) {
            vmRoom.amount = newOrder.day.amount;
        }
        if (newOrder.day.todayIndex) {
            vmRoom.todayIndex = newOrder.day.todayIndex;
        }
        if (newOrder.day.startIndex) {
            vmRoom.startIndex = newOrder.day.startIndex;
        }
    } else {
        if (newOrder.partTime.startShow) {
            vmRoom.start = '今日<br>' + newOrder.partTime.startShow;
        }
        if (newOrder.partTime.endShow) {
            vmRoom.end = '今日<br>' + newOrder.partTime.endShow;
        }
        if (newOrder.partTime.amount) {
            vmRoom.amount = newOrder.partTime.amount;
        }
    }
}

//保存到本地
function saveStorage() {
    if (roomType == 1) {
        $.extend(newOrder.partTime, {
            start: getStartTime(roomType),
            end: getEndTime(roomType),
        });
    } else {
        $.extend(newOrder.day, {
            start: getStartTime(roomType),
            end: getEndTime(roomType),
        });
    }

    Storage.set("newOrder", newOrder);

    vmRoom.getData();
}

//注册导航接口
function registerWeixinConfig() {
    ajaxJsonp({
        url: urls.weiXinConfig,
        data: {
            url: window.location.href
        },
        successCallback: function(json) {
            if (json.status === 1) {
                wx.config({
                    debug: false,
                    appId: json.data.appId,
                    timestamp: json.data.timestamp,
                    nonceStr: json.data.nonceStr,
                    signature: json.data.signature,
                    jsApiList: [
                        'checkJsApi',
                        'openLocation',
                        'getLocation'
                    ],
                });
                isSuccess = true;
            }
        }
    });
}

vmRoom.$watch('startTimeIndex', function(a) {
    if (a > -1) {
        vmRoom.price = vmRoom.roomNightDiscount[a].discount;
    } else {
        vmRoom.price = 0;
    }
})

vmRoom.$watch('startIndex', function(a) {
    //如果入住时间选择了今天
    //根据当前的小时，选择表盘
    if (a == vmRoom.todayIndex) {
        setDefaultStartTime();
    }
})

//预订今天全天房时，设置默认的表盘
function setDefaultStartTime() {
    var index = vmRoom.startTimeIndex;

    //已选择的表盘早于当前时间，就修改为晚于当前时间的第一个表盘
    //如果当前时间晚于最后一个表盘，就选择最后一个
    while (vmRoom.roomNightDiscount[index].startTime * 2 < getHourIndex()) {
        if (index == 3) {
            break;
        }
        index++;
    }

    vmRoom.startTimeIndex = index;

    vmRoom.price = vmRoom.roomNightDiscount[index].discount;
    newOrder.day.startTimeIndex = index;
    newOrder.day.startTime = vmRoom.roomNightDiscount[index].startTime;
    Storage.set("newOrder", newOrder);
}
