/**
 * Created by lyh on 2016/8/8/008.
 */

var vmWeixin = avalon.define({
    $id: 'weixin',
    authWeixin: function () {
        console.log("ok");
        var authCode = getParam("authCode");
        var openId = getParam("openId");
        var url = getParam("url");
        if (openId && authCode) {
            ajaxJsonp({
                url: urls.authWeixin,
                data: {
                    authCode: authCode,
                    openId: openId
                },
                successCallback: function (json) {
                    if (json.status === 1) {
                        Storage.setLocal('user', json.data);
                    } else {
                        console.log(json.message);
                    }
                    if (isNotEmpty(url)) {
                        location.replace(url);
                    }
                }
            });
        } else {
            if (isNotEmpty(url)) {
                location.replace(url);
            }
        }
    }
});

vmWeixin.authWeixin();