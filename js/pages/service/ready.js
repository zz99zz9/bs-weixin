//var hotel = controlCore.getHotel();

// var articleid = getParam("id");
// if (articleid != "") {
//     if (isNaN(articleid)) {
//         location.href = document.referrer || "homepage.html";
//     } else {
//         articleid = parseInt(articleid);
//     }
// } else {
//     articleid = 0;
// }

var vmServiceReady = avalon.define({
    $id: 'serviceReady',
    name: '',
    pageNo: 1,
    pageSize: 10,
    data: [],
    temperature: "一键预温",
    orderList: {
        roomNo: 1123,
    },
    list: [
        { id: 1, information: "儿童专用耗材及浴衣一套" },
        { id: 2, information: "周边地图一份" },
        { id: 3, information: "旅游景点介绍手册一份" },
        { id: 4, information: "已预约VR体验" },
    ],
    addService: function() { //添加更多定制服务
        stopSwipeSkip.do(function() {
            mui.prompt('您还需要？', '在此输入', ' ', ['提交', '取消'], null, 'div')
            document.querySelector('.mui-popup-input input').type = 'password'
        })
    },
});
vmServiceReady.data = vmServiceReady.list;
