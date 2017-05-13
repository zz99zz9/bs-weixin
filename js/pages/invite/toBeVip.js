var vmToBeVip = avalon.define({
    $id: 'toBeVip',
    beVip: function() {
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
            location.href = "../tokensRecharge.html";
        });
    },
});
