var cardType = getParam('type');

var vmCardBuy = avalon.define({
    $id: 'cardShow',
    blackUrl: 'img/card/black.png',
    goldUrl: 'img/card/gold.png',
    silverUrl: 'img/card/silver.png',
    cardNo: '2016101000001',
    validDate: '2017/10',
    getType: function() {
        switch(cardType) {
            case 'black':
                return this.blackUrl;
            case 'gold':
                return this.goldUrl;
            case 'silver':
                return this.silverUrl;
        }
    }
});

var cardWidth, cardHeight;
avalon.ready(function() {
    cardWidth = $('.card-show').width();
    
    //卡的长高比例 1.73
    cardHeight = cardWidth / 1.73;

    $('.card-font').css('left', cardWidth * 0.05 + 'px');
    $('.card-font').css('top', cardHeight * 0.64 + 'px');

    switch(cardType) {
        case 'gold':
        case 'silver':
            $('.card-font').css('color', 'white');
            break;
    }
});
