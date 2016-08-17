mui.init();
//初始化单页view
var viewApi = mui('#app').view({
    defaultPage: '#infoPage'
});

$('.cancelBtn').on('tap', function() {
    viewApi.back();
});
