// mui.init();
// //初始化单页view
// var viewApi = mui('#app').view({
//     defaultPage: '#infoPage'
// });

// $('.cancelBtn').on('tap', function() {
//     vmSetting.getUserInfo();
//     viewApi.back();
// });

// var user = {
//   openUserInfo: 1
// };
// Storage.setLocal('user', user);

var vmSetting = avalon.define({
    $id: 'setting',
    logOff: function() {
        stopSwipeSkip.do(function() {
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
        })
    },
});