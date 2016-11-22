var vmDiscover = avalon.define({
    $id: 'discover',
    logOff: function() {
        mui.confirm("退出当前账号", "", ["取消", "确定"], function(e) {
            if (e.index == 1) {
                ajaxJsonp({
                    url: urls.logOut,
                    data: {},
                    successCallback: function(json) {
                        if (json.status === 1) {
                            location.href = "index.html";
                        } else {
                            mui.alert(json.message);
                        }
                    }
                });
            }
        });
    },
});
