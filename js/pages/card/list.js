//进入首页时，默认打开个人中心弹窗
Storage.setLocal('user', {openUserInfo: 1});

var vmCardList = avalon.define({
    $id: 'cardList',
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

vmCardList.getData();