var cardID = getParam('cid');
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
    getBuyCard: function() {
        ajaxJsonp({
            url: urls.getCardList,
            successCallback: function(json) {
                if (json.status === 1) {
                    if(json.data.length == 0) {
                        mui.alert(
                            '您还没有会员卡',
                            function() {
                                location.href = document.referrer || "index.html";
                            });
                    } else {
                        json.data.map(function(c) {
                            if( c.cid == cardID) {
                                vmCardBuy.cardNo = c.cardNo;
                                vmCardBuy.validDate = c.endTime.slice(0, 4) + '/' + c.endTime.slice(5, 7);
                            }
                        })

                        if(vmCardBuy.validDate == '') {
                            location.href = document.referrer || "index.html";
                        }
                    }
                }
            }
        });
    },
    getType: function() {
        return 'img/card/No' + cardID + '.png';
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

    switch(cardID) {
        case 2:
        case 3:
            $('.card-font').css('color', 'white');
            break;
    }
});
