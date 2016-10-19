var vmCardBuy = avalon.define({
    $id: 'cardShow',
    data: {},
    cardNo: '',
    validDate: '',
    cardType: 0,
    getBuyCard: function() {
        ajaxJsonp({
            url: urls.getCardDetail,
            data: { bid: cardID },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmCardBuy.data = json.data;
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
                    // location.href = "index.html";
                }
            }
        });
    },
    getType: function() {
        return 'img/card/No' + vmCardBuy.cardType + '.png';
    }
});

var cardIndex, 
    cardID = getParam('id'), 
    isShowNew = getParam('isShowNew');
if (cardID != "") {
    if (isNaN(cardID)) {
        location.href = document.referrer || "index.html";
    } else {
        cardID = parseInt(cardID);
    }

    vmCardBuy.getBuyCard();
} else {
    //没有id可能是第一次买卡跳转过来的，判断下
    ajaxJsonp({
        url: urls.getCardList,
        successCallback: function(json) {
            if (json.status == 1) {
                if (json.data.length) {
                    if(isShowNew) {
                        cardIndex = json.data.length - 1;
                        cardID = json.data[cardIndex].id;

                        vmCardBuy.getBuyCard();
                    } else {
                        var data = Storage.get('cardData');
                        if(data) {
                            cardIndex = data.cardIndex;
                            cardID = json.data[cardIndex].id;

                            vmCardBuy.getBuyCard();
                        }
                    }
                }
                else {
                    location.href = "index.html";
                }
            }
        }
    });
}

//进入首页时，默认打开个人中心弹窗
Storage.setLocal('user', {openUserInfo: 1});

var cardWidth, cardHeight;
avalon.ready(function() {
    cardWidth = $('.card-show').width();
    
    //卡的长高比例 1.73
    cardHeight = cardWidth / 1.73;

    $('.card-font').css('left', cardWidth * 0.05 + 'px');
    $('.card-font').css('top', cardHeight * 0.64 + 'px');
});
