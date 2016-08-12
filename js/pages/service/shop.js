var vmService = avalon.define({
    $id: "shop",
    list: [],
    isExpand: false,
    swiperRender: function() {
        var swiper1 = new Swiper('.foodSwiper', {
            slidesPerView: 1,
            width: window.innerWidth - 20,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4
        });

        var swiper2 = new Swiper('.tourSwiper', {
            slidesPerView: 1,
            width: window.innerWidth - 20,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4
        });

        var swiper3 = new Swiper('.beautySwiper', {
            slidesPerView: 1,
            width: window.innerWidth - 20,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4
        });

        var swiper4 = new Swiper('.fitnessSwiper', {
            slidesPerView: 1,
            width: window.innerWidth - 20,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4
        });
    },
    expand: function(isExpand) {
        if (isExpand == false) {
            vmService.isExpand = true;
        } else {
            vmService.isExpand = false;
        }
    },
    picture: function() {
        ajaxJsonp({
            url: urls.socialList,
            data: {
                hid: 1,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmService.list = json.data;
                }
            }
        });
    },
})

vmService.picture();
// vmService.list = [{
//     type: 'food',
//     name: '餐饮',
//     isExpand: false,
//     list: [
//         { id: 1, name: '全家来牛排', coverUrl: '../img/food1.jpg', introduction: '精品马合木咖啡 店长推荐 精品马合木咖啡 店长推荐 精品马合木咖啡 店长推荐 精品马合木咖啡 店长推荐 精品马合木咖啡 店长推荐', addtress: '祖冲之路2288弄2#630' },
//         { id: 2, name: '85度C', coverUrl: '../img/food2.jpg', introduction: '国际象棋 店长推荐', addtress: '祖冲之路2288弄2#630' },
//         { id: 3, name: '肯德基', coverUrl: '../img/food3.jpg', introduction: '铁观音 店长推荐', addtress: '祖冲之路2288弄2#630' },
//     ]
// }, {
//     type: 'tour',
//     name: '旅游',
//     isExpand: false,
//     list: [
//         { id: 1, name: '赏樱花', coverUrl: '../img/tour1.jpg', introduction: '精品马合木咖啡 店长推荐', addtress: '祖冲之路2288弄2#630' },
//         { id: 2, name: '西域行', coverUrl: '../img/tour2.jpg', introduction: '国际象棋 店长推荐', addtress: '祖冲之路2288弄2#630' },
//         { id: 3, name: '霍比特小镇', coverUrl: '../img/tour3.jpg', introduction: '铁观音 店长推荐', addtress: '祖冲之路2288弄2#630' },
//     ]
// }, {
//     type: 'beauty',
//     name: '美业',
//     isExpand: false,
//     list: [
//         { id: 1, name: '文峰美体', coverUrl: '../img/beauty1.jpg', introduction: '精品马合木咖啡 店长推荐', addtress: '祖冲之路2288弄2#630' },
//         { id: 2, name: '洪涛桑拿', coverUrl: '../img/beauty2.jpg', introduction: '国际象棋 店长推荐', addtress: '祖冲之路2288弄2#630' },
//         { id: 3, name: '大桶大', coverUrl: '../img/beauty3.jpg', introduction: '铁观音 店长推荐', addtress: '祖冲之路2288弄2#630' },
//     ]
// }, {
//     type: 'fitness',
//     name: '健康',
//     isExpand: false,
//     list: [
//         { id: 1, name: '一兆韦伦健身', coverUrl: '../img/fitness1.jpg', introduction: '精品马合木咖啡 店长推荐', addtress: '祖冲之路2288弄2#630' },
//         { id: 2, name: '金仕堡健身', coverUrl: '../img/fitness2.jpg', introduction: '国际象棋 店长推荐', addtress: '祖冲之路2288弄2#630' },
//         { id: 3, name: '威尔士健身', coverUrl: '../img/fitness3.jpg', introduction: '铁观音 店长推荐', addtress: '祖冲之路2288弄2#630' },
//     ]
// }];
