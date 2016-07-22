var hotel = controlCore.getHotel();

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        down: {
            callback: pulldownRefresh
        }
    }
});

var vmList = avalon.define({
	$id: "roomList",
	statusList: [
		{status: 0, name: '全部', color: '#fff', key:'totalCount', count: 0},
		{status: 1, name: '空房', color: '#e7cfe7', key:'emptyCount', count: 0},
		{status: 2, name: '预订', color: '#8fff8f', key:'bookCount', count: 0},
		{status: 3, name: '已入住', color: '#ffff8f', key:'checkInCount', count: 0},
		{status: 4, name: '已延退', color: '#ffd392', key:'timeoutCount', count: 0},
		{status: 5, name: '脏房', color: '#6599ff', key:'dirtyCount', count: 0},
		{status: 6, name: '维修', color: '#cd3333', key:'repairCount', count: 0},
		{status: 7, name: '停用', color: '#888888', key:'disableCount', count: 0},
	],
	actionImg: [
		"",//没有状态
		"../img/repair.png",//保修
		"../img/call.png",//呼叫
		"../img/breakfast.png",//早餐
		"../img/change.png",//换耗材
		"../img/dnd.png",//免打扰
	],
	miniList: [],
	list: [],
	maxList: [],
	go: function(id) {
		stopSwipeSkip.do(function(){
			location.href = "room-details.html?id=" + id;
		});
	}
});

function getRoomList(callback) {
	vmList.miniList = [];
	vmList.list = [];
	vmList.maxList = [];

	//获取用户所选区域酒店列表数据
	ajaxJsonp({
	    url: urls.roomList,
	    data: {hid: hotel.hid},
	    successCallback: function(json) {
	        if (json.status === 1) {
	        	for(var i = 0; i< vmList.$model.statusList.length; i++) {
		        	vmList.statusList[i].count = json.data.roomCount[vmList.statusList[i].key];
		    	}

				json.data.roomTypeList[0].roomList.map(function(o) {
					o.actionId = o.serviceList[0] || 0;
					o.time = o.timeList.join(" ");
					vmList.miniList.push(o);
				});

				json.data.roomTypeList[1].roomList.map(function(o) {
					o.actionId = o.serviceList[0] || 0;
					o.time = o.timeList.join(" ");
					vmList.list.push(o);
				});

				json.data.roomTypeList[2].roomList.map(function(o) {
					o.actionId = o.serviceList[0] || 0;
					o.time = o.timeList.join(" ");
					vmList.maxList.push(o);
				});

				if(typeof callback == 'function'){
					callback();
				}
	        }
	    }
	});
}

var vmOccupancy = avalon.define({
	$id: "occupancy",
	allRate: [],
	monthRate: []
});

function getOccupancyRate() {
	//获取用户所选区域酒店列表数据
	ajaxJsonp({
	    url: urls.occupancyRate,
	    data: {hid: hotel.hid},
	    successCallback: function(json) {
	        if (json.status === 1) {
	        	vmOccupancy.allRate = json.data.allRate;
	        	vmOccupancy.monthRate = json.data.monthRate;
	        }
	    }
	});
};

getRoomList();
getOccupancyRate();

function pulldownRefresh() {
	getRoomList(function() {
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	});
	getOccupancyRate();
}

