var cardID = getParam('id');
if (cardID != "") {
    if (isNaN(cardID)) {
        location.href = document.referrer || "index.html";
    } else {
        cardID = parseInt(cardID);
    }
} else {
    location.href = "index.html";
}

//进入首页时，默认打开个人中心弹窗
Storage.setLocal('user', {openUserInfo: 1});

var vmCardBuy = avalon.define({
    $id: 'cardShow',
    cardNo: '',
    validDate: '',
    cardType: 0,
    getBuyCard: function() {
        ajaxJsonp({
            url: urls.getCardDetail,
            data: { bid: cardID },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmCardBuy.cardNo = json.data.cardNo;
                    vmCardBuy.validDate = json.data.endTime.slice(0, 4) + '/' + json.data.endTime.slice(5, 7);
                    vmCardBuy.cardType = json.data.type;

                    switch(vmCardBuy.cardType) {
                        case 2:
                        case 3:
                            $('.card-font').css('color', 'white');
                            break;
                    }
                } else {
                    location.href = document.referrer || "index.html";
                }
            }
        });
    },
    getType: function() {
        return 'img/card/No' + vmCardBuy.cardType + '.png';
    }
});

vmCardBuy.getBuyCard();

var cardWidth, cardHeight;
avalon.ready(function() {
    cardWidth = $('.card-show').width();
    
    //卡的长高比例 1.73
    cardHeight = cardWidth / 1.73;

    $('.card-font').css('left', cardWidth * 0.05 + 'px');
    $('.card-font').css('top', cardHeight * 0.64 + 'px');
});
