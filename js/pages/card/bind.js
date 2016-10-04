var vmCardBind = avalon.define({
    $id: 'bind',
    bindType: 1, //1 支付宝, 2 银行卡
    bind: function() {
        mui.confirm(
            '请确认帐号信息无误，绑定完成后，如需更改请联系客服。',
            '绑定提现帐号',
            ['否','是'],
            function(e) {
                if(e.index) {
                    mui.alert('绑定成功', function() {
                        location.replace("card-log.html");
                    });
                }
            });
    },
    select: function(type) {
        this.bindType = type;
    }
})
