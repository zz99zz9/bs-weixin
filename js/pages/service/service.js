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
        vmAInfo.goods = vmService.$model.list[index];

        vmAInfoBtn.selectText = '购买';
        popover('', none);
    },
    call: function(service) {
        var o = {
            breakfast: { imgUrl: '../img/food2.jpg', name: '西式早餐', brief: '面包、牛奶\n呼叫后，服务人员将会送到房间内。', isService: true },
            cleaning: { imgUrl: '../img/cleaning.jpg', name: '房间清洁', brief: '呼叫后，服务人员将会清洁房间并更换洗护用品。', isService: true },
            shuttle: { imgUrl: '../img/shuttle.jpg', name: '接送', brief: '本酒店提供专车接送，呼叫后客服人员将会联系你。', isService: true },
            dryCleaning: { imgUrl: '../img/dryCleaning.jpg', number: 1, stock: 999, price: 25, name: '干洗', brief: '快速干洗，每件25元，24小时内送回。', choosable: true }
        };
        switch (service) {
            case "breakfast":
                vmAInfo.goods = o.breakfast;
                break;
            case "cleaning":
                vmAInfo.goods = o.cleaning;
                break;
            case "shuttle":
                vmAInfo.goods = o.shuttle;
                break;
            case "dryCleaning":
                vmAInfo.goods = o.dryCleaning;
                break;
        }
        vmAInfoBtn.selectText = '呼叫';
        popover('', none);
    },
    alarm: function() {
        mui.toast("安保人员正在火速前往中");
    },
    goods: function() {
        //获取房间详情
        ajaxJsonp({
            url: urls.inStoreGoods,
            data: { hid: 1 },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmService.list = json.data.list;
                }
            }
        });
    },
    picture: function() {
        ajaxJsonp({
            url: urls.socialService,
            data: {},
            successCallback: function(json) {
                if (json.status === 1) {
                    vmService.socialList = json.data;
                }
            }
        });
    },
    hotelService: function() {
        ajaxJsonp({
            url: urls.hotelService,
            data: { hid: 1 },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmService.data = json.data;
                }
            }
        });
    },
})


vmService.goods();
vmService.picture();
vmService.hotelService();

var vmAInfo = avalon.define({

    $id: 'aInfo',
    goods: {}
    // goods: {cid: 0, gid: 0, price: 0, number: 1, imgUrl:'', name:'', brief:'', cate:''}
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
