//进入首页时，默认打开个人中心弹窗
Storage.setLocal('user', {openUserInfo: 1});

var vmCardList = avalon.define({
    $id: 'cardList',
    getBuyCard: function() {
        ajaxJsonp({
            url: urls.getCardList,
            successCallback: function(json) {
                if (json.status === 1) {
                    //todo: 判断有没有资格打开本页面（登录，并且会员卡少于两张）
                    if( json.data.length == 2) {
                        mui.alert(
                            '您的会员卡数量已经达到上限',
                            function() {
                                location.href = "index.html";
                            });
                    }
                }
            }
        });
    },
    data: [{imgUrl: ''}],
    getData: function() {
        ajaxJsonp({
            url: urls.getDicCardList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmCardList.data = [];
                    json.data.map(function(c) {
                        c.imgUrl = 'img/card/card_list_No' + c.id + '.png';

                        vmCardList.data.push(c);
                    });
                }
            }
        });
    },
    goBuyCard: function(id) {
        location.href = "card-buy.html?cid=" + id;
    }
});

vmCardList.getBuyCard();
vmCardList.getData();