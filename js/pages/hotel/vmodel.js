var hid, 
    roomType = 0, 
    midnightDiscount = 1,
    myPosition, myLng, myLat,
    bensue, roomType, newOrder,
    isexpand = false,
    isSuccess = false,
    user;

hid = getParam("id");
if (hid != "") {
    if (isNaN(hid)) {
        location.href = document.referrer || "index.html";
    } else {
        hid = parseInt(hid);
    }
} else {
    location.href = "index.html";
}

myPosition = Storage.getLocal("position");
if (myPosition) {
    myLng = myPosition.lng || "";
    myLat = myPosition.lat || "";
}

bensue = Storage.get("bensue");
if (bensue) {
    roomType = bensue.type;

    if (bensue.type == 2) {
        midnightDiscount = bensue.midnightDiscount;
    }
} else {
    //第一次加载
    roomType = 0;
    Storage.set("bensue", { type: 0 });
}

newOrder = Storage.get("newOrder");
if (!newOrder) {
    newOrder = {
        day: {
            start: '',
            end: ''
        },
        partTime: {
            start: '',
            end: ''
        },
    };
    Storage.set("newOrder", newOrder);
}

var vmTop = avalon.define({
    $id: 'top',
    headImg: 'img/defaultHeadImg.png', //左上角头像
    type: 0,
    selectType: function(type) {
        stopSwipeSkip.do(function() {
            roomType = type;
            vmTop.type = type;
            vmHotel.type = type;
            Storage.set("bensue", { type: type });

            vmHotel.getHotelDetail();
            vmHotel.getRoomTypeList();

            // mui('#pullrefresh').pullRefresh().refresh(true);
        });
    },
    goDiscover: function() {
        stopSwipeSkip.do(function() {
            location.href = "discover.html";
        });
    },
    goMidnight: function() {
        stopSwipeSkip.do(function() {
            location.href = "special.html";
        });
    },
    closeMidnight: function() {
        event.stopPropagation();
        stopSwipeSkip.do(function() {
            //隐藏广告栏
            $('#midnight').hide();
            //调整顶部导航的高度
            $('#header-nav').css('height', '48px');
        });
    },
    su: function() {
        //页面向上滑
        $('header').slideUp();
    },
    sd: function() {
        //向下滑
        $('header').slideDown();
    },
});

var vmHotel = avalon.define({
    $id: 'hotel',
    type: 0, //0 全天房, 1 夜房
    alias: '',
    name: '',
    tel: '',
    address: '',
    introduction: '',
    circTraffic: '',
    lng: '',
    lat: '',
    distance: '',
    surplusList: [],
    galleryList: [],
    serviceList: [],
    amenityList: [],
    openTimePanel: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 1;
            if (roomType == 0) {
                vmBtn.type = 'date';
                modalShow('./util/calendar.html', 1, function() {
                    $('#calendarPanel').height($(window).height() - 230);
                    //初始状态打开`入住时间
                    if (!(vmCalendar.statusControl.isEndEdit || vmCalendar.statusControl.isStartEdit)) {
                        vmCalendar.startClick();
                    }

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
                vmBtn.type = 'partTime';
                modalShow('./util/partTime.html', 1, function() {
                    $('.select-time').height($(window).height() - 150);
                    loadSessionPartTime();
                });
            }
        });
    },
    getHotelDetail: function() {
        ajaxJsonp({
            url: urls.getHotelDetail,
            data: {
                hid: hid,
                lng: myLng,
                lat: myLat,
                isPartTime: roomType
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmHotel.alias = json.data.alias;
                    vmHotel.name = json.data.name;
                    vmHotel.tel = json.data.telephone;
                    vmHotel.address = json.data.address;
                    vmHotel.introduction = json.data.introduction;
                    vmHotel.circTraffic = json.data.circTraffic;
                    vmHotel.lng = json.data.lng;
                    vmHotel.lat = json.data.lat;

                    if (json.data.distance > 0) {
                        vmHotel.distance = round(json.data.distance / 1000, 1);
                    }
                    //顶部轮播导入图片数据
                    vmHotel.galleryList = json.data.hotelGalleryList;
                    //房型数量
                    vmHotel.surplusList = json.data.surplusList;
                    // //酒店特色
                    vmHotel.serviceList = json.data.serviceList;
                    vmHotel.amenityList = json.data.amenityList;
                }
            }
        });
    },
    expand: function() {
        stopSwipeSkip.do(function() {
            var h = ($(".pic-info"))[0].scrollHeight;
            isexpand = !isexpand;
            if (isexpand) {
                $(".pic-info").addClass('expanded');
                $(".tdclass").text("收起");
                $(".pic-info").css('height', h + 'px')
            } else {
                $(".pic-info").removeClass('expanded');
                $(".tdclass").text("展开");
                $(".pic-info").css('height', '')
            }
        });
    },
    openIntroduction: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 0;
            popover('./util/hotelIntroduction.html', 1);
        });
    },
    openFeature: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 0;
            popover('./util/hotelFeature.html', 1);
        });
    },
    /*
     * 评价相关
     */
    assessCount: 0,
    score: { score1: 5, score2: 5, score3: 5, totalScore: 5 },
    assessList: [],
    assessPageNo: 1,
    assessPageSize: 8,
    getAssess: function() {
        ajaxJsonp({
            url: urls.getRoomAssess,
            data: {
                hid: 1,
                pageNo: vmHotel.assessPageNo,
                pageSize: vmHotel.assessPageSize
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    if (json.data.list.length > 0) {
                        if (json.data.pageCount > 1) {
                            vmHotel.isShowLoadMoreBtn = true;
                        }
                        json.data.list.map(function(o) {
                            o.s = round((o.score1 + o.score2 + o.score3) / 3, 1);
                        });

                        vmHotel.score = json.data.score;
                        vmHotel.assessCount = json.data.count;
                        vmHotel.assessList = json.data.list;
                        vmHotel.assessPageNo = 2;
                    }
                }
            }
        });
    },
    openAssess: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 0;
            popover('./util/assess.html', 1);
        });
    },
    isShowLoadMoreBtn: false,
    loadMore: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.getRoomAssess,
                data: { hid: 1, pageNo: vmHotel.assessPageNo, pageSize: vmHotel.assessPageSize },
                successCallback: function(json) {
                    if (json.status === 1) {
                        vmHotel.assessPageNo++;
                        json.data.list.map(function(o) {
                            o.s = round((o.score1 + o.score2 + o.score3) / 3, 1);
                        });

                        vmHotel.assessList.push.apply(vmHotel.assessList, json.data.list);
                        if (vmHotel.assessPageNo > json.data.pageCount) {
                            vmHotel.isShowLoadMoreBtn = false;
                        }
                    }
                }
            });
        });
    },
    goShop: function() {
        stopSwipeSkip.do(function() {
            location.href = 'shop.html';
        })
    },
    openNav: function() {
        stopSwipeSkip.do(function() {
            if (isSuccess) {
                wx.openLocation({
                    latitude: vmHotel.lat, // 纬度，浮点数，范围为90 ~ -90
                    longitude: vmHotel.lng, // 经度，浮点数，范围为180 ~ -180。
                    name: vmHotel.name, // 位置名
                    address: vmHotel.address, // 地址详情说明
                    scale: 26, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: 'bensue.com' // 在查看位置界面底部显示的超链接,可点击跳转
                });
            } else {
                console.log("微信接口配置注册失败，将重新注册");
                registerWeixinConfig();
            }
        });
    },
    midnightDiscount: 1,
    roomTypeList: [],
    tid: '', //房间类型，默认为全部
    getRoomTypeList: function() {
        ajaxJsonp({
            url: urls.getRoomTypeList,
            data: {
                startTime: roomType ? newOrder.partTime.start : (newOrder.day.start == getToday('date') ? getToday() : newOrder.day.start),
                endTime: roomType ? newOrder.partTime.end : newOrder.day.end,
                hid: hid,
                isPartTime: roomType,
                discount: midnightDiscount
            },
            successCallback: function(json) {
                if (json.status == 1) {

                    vmHotel.roomTypeList = [];
                    json.data.map(function(o) {
                        if(o.minPrice) {
                            vmHotel.roomTypeList.push(o);

                        }
                    });
                }
            }
        });
    },
    pageNo: 1,
    pageSize: 6,
    roomList: [],
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
    },
    swiper3Render: function() {
        var swiper3 = new Swiper('.swiper3', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto'
        });
    },
    goHotelById: function(id) {
        stopSwipeSkip.do(function() {
            // location.href = "hotel.html?id=" + id;
            location.href = "index.html";
        });
    },
    goRoom: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "room.html?hid=" + hid + "&tid=" + id;
        });
    }
})

//弹出框的确定按钮
var vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 1, //1 checkButton, 0 closeButton
    ok: function() {
        switch (vmBtn.type) {
            case 'date':
                //vmCalendar.startClick();
            case 'partTime':
                // mui('#pullrefresh').pullRefresh().refresh(true);
                
                newOrder.partTime.startShow = vmPart.partTimeStart;
                newOrder.partTime.endShow = vmPart.partTimeEnd;
                newOrder.partTime.amount = vmPart.partTimeNumber / 2;
                Storage.set("newOrder", newOrder);
                saveStorage();
                vmHotel.getRoomTypeList();
                break;
            case 'roomType':
                // mui('#pullrefresh').pullRefresh().refresh(true);
                saveStorage();
                vmHotel.getRoomTypeList();
                break;
        }

        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})

user = Storage.getLocal("user");
//更换登录用户头像
if (user) {
    if (user.logState && user.headImg) {
        vmTop.headImg = urlAPINet + user.headImg;
    }

    if (user.openUserInfo) {
        vmSide.show();
    }
}

vmHotel.type = roomType;

registerWeixinConfig();

//获得用户的位置
wx.ready(function() {
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function(res) {
            console.log(res);
            myLat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            myLng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            vmHotel.getHotelDetail();

            Storage.setLocal("position", {
                lat: myLat,
                lng: myLng
            });
        }
    });
});

vmHotel.getHotelDetail();
vmHotel.getAssess();
vmHotel.getRoomTypeList();

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
    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    mui('#pullrefresh').pullRefresh().refresh(true);
}

//保存到本地
function saveStorage() {
    if (roomType) {
        $.extend(newOrder.partTime, {
            start: getStartTime(roomType),
            end: getEndTime(roomType)
        });
    } else {
        $.extend(newOrder.day, {
            start: getStartTime(roomType),
            end: getEndTime(roomType)
        });
    }
    Storage.set("newOrder", newOrder);
}
