var orderid = getParam("id");

if (orderid != "") {
    if (isNaN(orderid)) {
        location.href = document.referrer || "index.html";
    } else {
        orderid = parseInt(orderid);
    }
} else {
    location.href = "index.html";
}

var vmPayend = avalon.define({
	$id: "payend",
	data: {},
    goHotelById: function(id) {
        location.href = "hotel.html?id=" + id;
    },
    openNav: function(lat, lng, name, addr) {
        stopSwipeSkip.do(function() {
            if (isSuccess) {
                wx.openLocation({
                    latitude: lat, // 纬度，浮点数，范围为90 ~ -90
                    longitude: lng, // 经度，浮点数，范围为180 ~ -180。
                    name: name, // 位置名
                    address: addr, // 地址详情说明
                    scale: 26, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: 'ini.xin' // 在查看位置界面底部显示的超链接,可点击跳转
                });
            } else {
                alert("微信接口配置注册失败，将重新注册");
                registerWeixinConfig();
            }
        });
    },
	goOrder: function() {
		location.href = "order.html?id=" + orderid;
	}
});

ajaxJsonp({
    url: urls.getOrderDetail,
    data: { id: orderid },
    successCallback: function(json) {
        if (json.status === 1) {
            //只有订单是未入住的状态，才能打开这个页面
            if(json.data.status == 2) {
                vmPayend.data = json.data;
            } else {
                location.href = document.referrer || "index.html";
            }
        }
    }
});

registerWeixinConfig();
