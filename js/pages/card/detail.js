var cardData = Storage.get('cardData');

if (!cardData) {
    cardData = { index: 0 };
} else {
    if (!cardData.index) {
        cardData.index = 0;
    }
}

var user = {
  openUserInfo: 1
};
Storage.setLocal('user', user);

var vmCardDetail = avalon.define({
    $id: 'detail',
    data: [
        {
            name: '银卡',
            cardNo: '201610100001',
            account: 3600,
            cash: 1320,
            award: 1200,
            promote: 120,
        },
        {
            name: '黑卡',
            cardNo: '201610100002',
            account: 36000,
            cash: 6600,
            award: 6000,
            promote: 600,
        }
    ],
    swiper: function() {
        var swiper = new Swiper('.swiper', {
            initialSlide: cardData.index,
            slidesPerView: 1,
            width: window.innerWidth,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4,
            onSlideChangeEnd: function(swiper) {
                cardData.index = swiper.activeIndex;
                Storage.set('cardData', cardData);
            }
        });
    },
    goLog: function() {
        location.href = 'card-log.html';
    }
});

