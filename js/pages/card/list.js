//todo: 判断有没有资格打开本页面（登录，并且会员卡少于两张）

var user = {
  openUserInfo: 1
};
Storage.setLocal('user', user);

var vmCardList = avalon.define({
    $id: 'cardList',
    data: [
        {   
            id: 1,
            name: '黑卡',
            discount: 7.5,
            award: 3000,
            imgUrl: 'img/card/card_list_black.png'
        },
        {
            id: 2,
            name: '金卡',
            discount: 8,
            award: 900,
            imgUrl: 'img/card/card_list_gold.png'
        },
        {
            id: 3,
            name: '银卡',
            discount: 8.8,
            award: 300,
            imgUrl: 'img/card/card_list_silver.png'
        }
    ],
    goBuyCard: function(id) {
        location.href = "card-buy.html?cid=" + id;
    }
});
