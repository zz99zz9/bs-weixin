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
    }
});

vmMoney.getFuncList();
