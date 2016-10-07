var vmApply = avalon.define({
    $id: 'apply',
    getList: function() {
        ajaxJsonp({
            url: urls.promotionList,
            successCallback: function(json) {
                if (json.status == 1) {
                    if(json.data.length > 0) {
                        json.data.map(function(p) {
                            if(p.status == 2) {
                                location.href = 'promotion-detail.html';
                            }
                        });
                    }
                }
            }
        });
    },
    isAgree: true,
    clickIsAgree: function() {
        this.isAgree = !this.isAgree;
    },
    openRule: function() {
        stopSwipeSkip.do(function() {
            vmPopover.useCheck = 1;
            popover('./util/promotion-rule.html', 1);
        });
    },
    goDetail: function() {
        if(this.isAgree) {
            ajaxJsonp({
                url: urls.applyPromotion,
                successCallback: function(json) {
                    if (json.status == 1) {
                        if(json.data.status == 2) {
                            mui.alert('申请成功', function(){
                                location.href = "promotion-detail.html";
                            });
                        } else {
                            mui.alert(json.message);
                        }
                    } else {
                        mui.alert(json.message);
                    }
                }
            });
        } else {
            vmPopover.useCheck = 1;
            popover('./util/promotion-rule.html', 1);
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

        vmApply.isAgree = true;
    }
});

vmApply.getList();
