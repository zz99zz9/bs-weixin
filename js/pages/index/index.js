/**
 * Created by lyh on 2017/4/5/005.
 * Edited by Michael on 2017/5/2
 */

var user = Storage.getLocal("user"), autocomplete;
var vmIndex = avalon.define({
    $id: 'index',
    userName: '先生/女士',
    //问候语swiper翻转效果
    greetList: [
        { name: '你  好' },
        { name: 'Hello' },
        { name: 'Bonjour' },
        { name: 'Guten Tag' },
        { name: 'こんにちは' },
        { name: '안녕하세요' },
        { name: 'illāc' },
        { name: 'ciao' },
        { name: 'Olá' },
        { name: 'Hola' },
        { name: 'Saluton' }
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
            noSwiping: true
        });
    },
    openSearch: function() {
        stopSwipeSkip.do(function() {
            modalShow('./util/searchLocation.html', 1);
        });
    },
    cityList: [],
    getCityImgList: function() {
        ajaxJsonp({
            url: urls.getCityImgList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmIndex.cityList = json.data;
                } else {
                    console.log(json.message);
                }
            }
        });
    },
    swiper1Render: function() {
        var swiper1 = new Swiper('.swiper1', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto'
        });
    },
    goToUrl: function(url) {
        location.href = url;
    },
<<<<<<< HEAD
    goCity: function(city, cid) {
        stopSwipeSkip.do(function() {

            vmSearch.saveCityMode(city, cid);

            location.href = "../city.html";
        })
    },
    goHotel: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "../hotel.html?id=" + id;
        })
=======
    goCity: function(cityName,sh) {
        stopSwipeSkip.do(function() {
            console.log(sh);
            if(sh === 1){
            location.href = "../city.html?position=" + cityName;
         }
        });
>>>>>>> jj
    },
    moreHotel: [],
    getMoreHote: function() {
        //热门酒店推荐
        ajaxJsonp({
            url: urls.getRecommendHotelList,
            data: {
                lng: 121.749,
                lat: 31.0469,
                isPartTime: 0,
                pageCount: 10
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmIndex.moreHotel = json.data.list;
                } else {
                    alert(json.message);
                }
            }
        });
    },
    swiperMoreHotelRender: function() {
        var swiperMoreHotel = new Swiper('.swiperMoreHotel', {
            slidesPerView: 1,
            width: window.innerWidth - 100,
            spaceBetween: 10,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4,
        });
    },

});

if (user && user.nickname) {
    vmIndex.userName = user.nickname;
}

vmIndex.getCityImgList();
vmIndex.getMoreHote();
<<<<<<< HEAD
=======

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
        });
    }
});
>>>>>>> jj
