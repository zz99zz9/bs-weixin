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
        console.log(1);

        location.href = "card-buy.html?cid=" + id;
    }
});
