var vmFoundation = avalon.define({
    $id: 'foundation',
    data: {
        name: '杜氏助学公益基金',
        des: '基金创始于2012年，从最初发起人个人资助特贫困大学生完成学业开始，迅速发展成苏北地区具有较高影响力的助学公益组织，秉承基金创始人杜玉莲女士“让每个孩子只少能够拥有受教育的机会”之理念，坚持资助必须有始有终，不为名利，只为能够保留孩子心中那一丝对未来的期望！',
        img: '../img/commonweal/love.png',
        amount: 0,
        account: 0,
        number: 0,
        child: 0
    },
    fid: 0,
    getFid: function () {
        ajaxJsonp({
            url: urls.getFoundationByUid,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmFoundation.fid = json.data.id;
                    vmFoundation.data.name = json.data.cnName;
                    vmFoundation.data.des = json.data.introduction;
                    vmFoundation.data.img = urlAPINet + json.data.logoUrl;;

                    ajaxJsonp({
                        url: urls.getFoundationAccount,
                        data: {fid: vmFoundation.fid},
                        successCallback: function(json) {
                            if (json.status == 1) {
                                vmFoundation.data.account = json.data.cashAmount;
                                vmFoundation.data.number = json.data.number;
                                vmFoundation.data.amount = json.data.totalDonateAmount;
                                vmFoundation.data.child = json.data.numberAccount;
                                
                            } else {
                                mui.alert(json.message);
                            }
                        }
                    });
                } else {
                    mui.alert(json.message);
                }
            }
        })
    },
});

vmFoundation.getFid();
