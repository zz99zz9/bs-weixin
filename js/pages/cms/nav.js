var vmFoundation = avalon.define({
    $id: 'foundation',
    data: {
        cnName: '',
        enName: '',
        brief: '',
        introduction: '',
        logoUrl: ''
    },
    accountData: {
        totalDonateAmount: 0,
        cashAmount: 0,
        numberStudent: 0,
        numberAccount: 0
    },
    fid: 0,
    getFid: function() {
        ajaxJsonp({
            url: urls.getFoundationByUid,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmFoundation.fid = json.data.id;
                    vmFoundation.data = json.data;
                    
                    ajaxJsonp({
                        url: urls.getFoundationAccount,
                        data: { fid: vmFoundation.fid },
                        successCallback: function(json) {
                            if (json.status == 1) {
                                vmFoundation.accountData = json.data;
                            } else {
                                mui.alert(json.message);
                            }
                        }
                    });
                } else {
                    mui.alert(json.message, function() {
                        location.href = document.referrer || '../index.html';
                    });
                }
            }
        })
    },
    goDonation: function() {
        location.href = "donation.html";
    },
    goAccount: function() {
        location.href = "account.html";
    },
    goFavoreeList: function() {
        location.href = "favoreeList.html";
    },
    goSubList: function() {
        location.href = "subList.html";
    },
});

vmFoundation.getFid();
