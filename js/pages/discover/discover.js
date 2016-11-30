var vmDiscover = avalon.define({
    $id: 'discover',
    isLogin: 3, //0:没登录   1：登录
    logOff: function() {
        mui.confirm("退出当前账号", "", ["取消", "确定"], function(e) {
            if (e.index == 1) {
                ajaxJsonp({
                    url: urls.logOut,
                    data: {},
                    successCallback: function(json) {
                        if (json.status === 1) {
                            var user = {
                                logState: 0
                            };
                            Storage.setLocal('user', user);
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
var c = Storage.getLocal('user').logState;
vmDiscover.isLogin = c;
