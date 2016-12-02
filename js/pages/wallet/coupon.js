var vmMoney = avalon.define({
    $id:'fund',
    fundList:[],
    goInvite: function() {
        location.href = "user-invite.html";
    },
    getFuncList: function(){
        ajaxJsonp({
            url: urls.getUserFundURL,
            data: {},
            successCallback: function(json) {

                if(json.data.list.length > 0) {
                    json.data.list.map(function(o) {
                        if(o.isValid) {
                            vmMoney.fundList.push(o);
                        }
                    });
                }
            }
        });
    },
    openRule: function() {
        popover('./util/coupon-rule.html',1);
    }
});

//弹出框的确定按钮
vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //打开的窗口类型
    useCheck: 0, //1 checkButton, 0 closeButton
    ok: function() {
        
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})

vmMoney.getFuncList();
