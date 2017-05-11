var vmGetTimeCoins = avalon.define({
    $id: 'getTimeCoins',
    goInviteFriend: function() {
        ajaxJsonp({
            url: urls.goWeixin,
            data: { url: urlWeixin + "/recharge-invite.html" },
            successCallback: function(json) {
                if (json.status === 1) {
                    location.href = json.data;
                } else {
                    mui.alert(json.data.message);
                }
            }
        });
    },
    goCheckourEarly: function() {
        ajaxJsonp({
            url: urls.goWeixin,
            data: { url: urlWeixin + "/recharge.html" },
            successCallback: function(json) {
                if (json.status === 1) {
                    location.href = json.data;
                } else {
                    mui.alert(json.data.message);
                }
            }
        });
    },
    goToBeVip: function() {
        ajaxJsonp({
            url: urls.goWeixin,
            data: { url: urlWeixin + "/tokensRecharge.html" },
            successCallback: function(json) {
                if (json.status === 1) {
                    location.href = json.data;
                } else {
                    mui.alert(json.data.message);
                }
            }
        });
    },
});