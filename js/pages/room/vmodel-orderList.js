
// mui.init({
//     pullRefresh: {
//         container: "#pullrefresh",
//         up: {
//             contentrefresh: "正在加载...",
//             contentnomore: "没有更多数据了",
//             callback: loadmore
//         }
//     }
// });

// (function($) {
// 	//阻尼系数
// 	var deceleration = mui.os.ios?0.003:0.0009;
// 	$('.mui-scroll-wrapper').scroll({
// 		bounce: false,
// 		indicators: true, //是否显示滚动条
// 		deceleration:deceleration
// 	});
// })(mui);

// function loadmore() {
// 	console.log("加载更多");
// }

var vmOrders = avalon.define({
	$id: 'orders',
	list1: [],//待支付订单列表
	list2: [],//待入住订单列表
	list3: [],//已入住订单列表
	list4: [],//已离店订单列表
	goDetail: function(id) {
		location.href = "order.html?&id=" + id;
	}
});
function show1(){
	ajaxJsonp({
		url: urls.getOrderList,
		data: {
			statusList:'1'
		},
		successCallback: function (json) {
			if (json.status !== 1) {
				alert(json.message)
				return;
			} else {
				vmOrders.list1 = json.data.list;
			}
		}
	});
}
show1();
function show2(){
	ajaxJsonp({
		url: urls.getOrderList,
		data: {
			statusList:'2'
		},
		successCallback: function (json) {
			if (json.status !== 1) {
				alert(json.message)
				return;
			} else {
				vmOrders.list2 = json.data.list;
			}
		}
	});
}
show2();
function show3(){
	ajaxJsonp({
		url: urls.getOrderList,
		data: {
			statusList:'3'
		},
		successCallback: function (json) {
			if (json.status !== 1) {
				alert(json.message)
				return;
			} else {
				vmOrders.list3 = json.data.list;
			}
		}
	});
}
show3();
function show4(){
	ajaxJsonp({
		url: urls.getOrderList,
		data: {
			statusList:'4'
		},
		successCallback: function (json) {
			if (json.status !== 1) {
				alert(json.message)
				return;
			} else {
				vmOrders.list3 = json.data.list;
			}
		}
	});
}
show4();