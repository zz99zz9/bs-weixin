// var roomid, bensue, newOrder, vmService, vmBtn, vmServiceAssess,
//     isSuccess = false,
//     positionInStorage = Storage.getLocal("position");

// hid = getParam("id");
// if (hid != "") {
//     if (isNaN(hid)) {
//         location.href = document.referrer || "index.html";
//     } else {
//         hid = parseInt(hid);
//     }
// } else {
//     location.href = "index.html";
// }

var vmService = avalon.define({
    $id: "service",
    data: [],
    list: [],
    socialList: [],
    swiperRender: function() {
        var swiper = new Swiper('.swiper', {
            slidesPerView: 1,
            width: window.innerWidth - 20,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4
        });
    },
    pop: function(index) {
        stopSwipeSkip.do(function() {
            vmAInfo.type = 1;
            vmAInfo.goods = vmService.$model.list[index];
            vmAInfoBtn.selectText = '购买';
            popover('', none);
        });
    },
    call: function(s) {
        stopSwipeSkip.do(function() {
            vmAInfoBtn.selectText = '呼叫';
            popover('', none);

            vmAInfo.type = s.name.indexOf('干洗')>-1?3:2;
            vmAInfo.goods = s;
        });
    },
    alarm: function() {
        mui.toast("安保人员正在火速前往中");
    },
    goods: function() {
        stopSwipeSkip.do(function() {
            //获取房间详情
            ajaxJsonp({
                url: urls.inStoreGoods,
                data: { hid: 1 },
                successCallback: function(json) {
                    if (json.status === 1) {
                        json.data.list.map(function(a) {
                            a.number = 1;
                        });
                        vmService.list = json.data.list;
                    }
                }
            });
        });
    },
    picture: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.socialService,
                data: {},
                successCallback: function(json) {
                    if (json.status === 1) {
                        vmService.socialList = json.data;
                    }
                }
            });
        });
    },
    hotelService: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.hotelService,
                data: { hid: 1 },
                successCallback: function(json) {
                    if (json.status === 1) {
                        json.data.map(function(a) {
                            a.number = 1;
                        });
                        vmService.data = json.data;
                    }
                }
            });
        });
    },
    social: function(a) {
        stopSwipeSkip.do(function() {
            switch (a) {
                case 0:
                    location.href = 'shop.html#food';
                    break;
                case 1:
                    location.href = 'shop.html#tour';
                    break;
                case 2:
                    location.href = 'shop.html#beauty';
                    break;
                case 3:
                    location.href = 'shop.html#fitness';
                    break;
            }
        });
    },
    all: function() {
        vmService.goods();
        vmService.picture();
        vmService.hotelService();
    },
})

vmService.goods();


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
    vmService.all();
    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    mui('#pullrefresh').pullRefresh().refresh(true);
}

var vmAInfo = avalon.define({
    $id: 'aInfo',
    goods: {},
    type: '', //1商品，2服务（不含干洗），3干洗
    payType: 2, //1支付宝，2微信支付
    // goods: {cid: 0, gid: 0, price: 0, number: 1, imgUrl:'', name:'', brief:'', cate:''}
    newRadio1: function() {
        vmAInfo.payType = 2;
    },
    newRadio2: function() {
        vmAInfo.payType = 1;
    },
});


var vmAInfoBtn = avalon.define({
    $id: 'aInfoBtn',
    selectText: '购买',
    select: function() {

        if (vmAInfo.goods.number >= 1) {

            $('.popover').addClass('popover-hide');
            popover_ishide = true;
        }
    }
});
