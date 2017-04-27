/**
 * Created by lyh on 2017/4/5/005.
 */
var swiper4;
var vmIndex2 = avalon.define({
    $id: 'index2',
    list: [],
    list1: [],
    data: [
        { name: '附近', ico: '../img/icon/location.svg' },
        { name: '上海', ico: '../img/qietu-shanghai.png' },
        { name: '杭州', ico: '../img/qietu-hangzhou.png' },
        { name: '南京', ico: '../img/qietu-nanjing.png' },
        { name: '苏州', ico: '../img/qietu-suzhou.png' },
        { name: '上海', ico: '../img/qietu-shanghai.png' },
        { name: '杭州', ico: '../img/qietu-hangzhou.png' },
        { name: '南京', ico: '../img/qietu-nanjing.png' },
        { name: '苏州', ico: '../img/qietu-suzhou.png' },
        { name: '所有城市', ico: '../img/icon/allCity.svg' }
    ],
    hotelMarkers: [],
    goToUrl: function(url) {
        location.href = url;
    },
    goIndex: function() {
        stopSwipeSkip.do(function() {
            location.href = "../index.html";
        })
    },
    goRoom: function() {
        stopSwipeSkip.do(function() {
            location.href = "service/orderList.html";
        })
    },
    goOrder: function() {
        stopSwipeSkip.do(function() {
            location.href = "../newOrderList.html";
        })
    },
    goMore: function() {
        stopSwipeSkip.do(function() {
            location.href = "../more.html";
        })
    },
    goCity: function() {
        stopSwipeSkip.do(function() {
            location.href = "../city.html";
        })
    },
    openPop: function() {
        stopSwipeSkip.do(function() {
            modalShow('./util/searchLocation.html', 1);
        })
    },
    swiper1Render: function() {
        var swiper1 = new Swiper('.swiper1', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto',
            onClick: function(swiper) {
                if (swiper.clickedIndex==9) {
                    modalShow('./util/searchLocation.html', 1);
                } else {
                    location.href = "../city.html";
                }
            }
        });
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
        //先销毁老的 再实例化新的
        if (swiper4) {
            swiper4.destroy();
        }
        swiper4 = new Swiper('.swiper4', {
            slidesPerView: 1,
            width: window.innerWidth - 100,
            spaceBetween: 10,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4,
        });
    },
    //问候语swiper翻转效果
    greetList: [
        { name: '你  好'},
        { name: 'Hello'},
        { name: 'Bonjour'},
        { name: 'Guten Tag'},
        { name: 'こんにちは'},
        { name: '안녕하세요'},
        { name: 'illāc'},
        { name: 'ciao'},
        { name: 'Olá'},
        { name: 'Hola'},
        { name: 'Saluton'}
    ],
    greetSwiper: function() {
        swiper = new Swiper('.swiper', {
            direction: 'vertical',
            autoplay: 2000,
            autoplayDisableOnInteraction: false,
            loop: true,
            slidesPerView: 1,
            width: window.innerWidth,
            height: 32,
            noSwiping : true
        });
    },
});

//更多房间
ajaxJsonp({
    url: urls.getRoomTypeList,
    data: {
        hid: 1,
        isPartTime: 0
    },
    successCallback: function(json) {
        if (json.status === 1) {
            vmIndex2.list = json.data;
        } else {
            console.log(json.message);
        }
    }
});

ajaxJsonp({
    url: urls.getHotelByPosition,
    data: {
        lng: 121.749,
        lat: 31.0469,
        isPartTime: 0,
        distance: 100000,
        pageCount: 20
    },
    successCallback: function(json) {
        if (json.status == 1) {
            vmIndex2.hotelMarkers = json.data;
        }
    }
});

var vmSearch = avalon.define({
    $id: 'search',
    city: '上海',
    currentLocation: '正在定位...',
    getCurrentPosition: function() {
        vmSearch.currentLocation = '正在定位...';
        geolocation.getCurrentPosition();
    },
    closePop: function() {
        stopSwipeSkip.do(function() {
            modalClose();
        })
    }
});
