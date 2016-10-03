var vmApply = avalon.define({
    $id: 'apply',
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
            // 判断是否有会员卡
            // 有会员卡就跳转
            location.href = "promotion-detail.html";

            // 没有会员卡，接口返回是否提交过申请
            // ajaxJsonp({});
            // 没提交过，接口提交
            // ajaxJsonp({});
            // mui.toast('提交成功，请等待审核');
            // 提交过
            // mui.toast('你已经提交过了，请等待审核');
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

