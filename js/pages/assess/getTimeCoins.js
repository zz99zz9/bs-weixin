var vmGetTimeCoins = avalon.define({
    $id: 'getTimeCoins',
    goInviteFriend: function() {
        // ajaxJsonp({
        //     url: urls.goWeixin,
        //     data: { url: urlWeixin + "/recharge-invite.html" },
        //     successCallback: function(json) {
        //         if (json.status === 1) {
        //             location.href = json.data;
        //         } else {
        //             mui.alert(json.data.message);
        //         }
        //     }
        // });
        stopSwipeSkip.do(function() {
            location.href = "../recharge-invite.html";
        });
    },
    goCheckourEarly: function() {
        // ajaxJsonp({
        //     url: urls.goWeixin,
        //     data: { url: urlWeixin + "/recharge.html" },
        //     successCallback: function(json) {
        //         if (json.status === 1) {
        //             location.href = json.data;
        //         } else {
        //             mui.alert(json.data.message);
        //         }
        //     }
        // });
        stopSwipeSkip.do(function() {
            location.href = "../checkoutEarly.html";
        });
    },
    goToBeVip: function() {
        // ajaxJsonp({
        //     url: urls.goWeixin,
        //     data: { url: urlWeixin + "/tokensRecharge.html" },
        //     successCallback: function(json) {
        //         if (json.status === 1) {
        //             location.href = json.data;
        //         } else {
        //             mui.alert(json.data.message);
        //         }
        //     }
        // });
        stopSwipeSkip.do(function() {
            location.href = "../toBeVip.html";
        });
    },
});