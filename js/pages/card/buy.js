var cardType = getParam('cid');
if (cardType != "") {
    if (isNaN(cardType)) {
        location.href = document.referrer || "index.html";
    } else {
        cardType = parseInt(cardType);
    }
} else {
    location.href = "index.html";
}

var vmCardBuy = avalon.define({
    $id: 'cardBuy',
    payType: 2,
    isAgree: true,
    data: [
        {   
            id: 1,
            name: '黑卡',
            discount: 7.5,
            price: 36000,
            award: 3000,
            imgUrl: 'img/card/black.png',
            discountUrl: 'img/card/black_discount.png',
            awardUrl: 'img/card/black_award.png',
            promoteUrl: 'img/card/black_promote.png',
        },
        {
            id: 2,
            name: '金卡',
            discount: 8,
            price: 10800,
            award: 900,
            imgUrl: 'img/card/gold.png',
            discountUrl: 'img/card/gold_discount.png',
            awardUrl: 'img/card/gold_award.png',
            promoteUrl: 'img/card/gold_promote.png',
        },
        {
            id: 3,
            name: '银卡',
            discount: 8.8,
            price: 3600,
            award: 300,
            imgUrl: 'img/card/silver.png',
            discountUrl: 'img/card/silver_discount.png',
            awardUrl: 'img/card/silver_award.png',
            promoteUrl: 'img/card/silver_promote.png',
        }
    ],
    clickIsAgree: function() {
        this.isAgree = !this.isAgree;
    },
    openRule: function() {
        stopSwipeSkip.do(function() {
            vmPopover.useCheck = 1;
            popover('./util/card-rule.html', 1);
        });
    },
    chooseType: function(type) {
        this.payType = type;
    },
    goCard: function() {
        if(this.isAgree) {
            //todo: 对接支付接口

            location.replace("card-show.html?type=" + this.getType(cardType));
        } else {
            vmPopover.useCheck = 1;
            popover('./util/card-rule.html', 1);
        }
    },
    getType: function(cid) {
        switch(cid) {
            case 1:
                return 'black';
            case 2:
                return 'gold';
            case 3:
                return 'silver';
        }
    }
});

var vmPopover = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 1, //1 checkButton, 0 closeButton
    ok: function() {
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;

        vmCardBuy.isAgree = true;
    }
});
