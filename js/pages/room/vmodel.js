var roomid = getParam("id");
if(roomid != "") {
    if(isNaN(roomid)) {
        location.href = document.referrer || "index.html";
    } else {
        roomid = parseInt(roomid);
    }
} else {
    location.href = "index.html";
}
var newOrder = {room: {}, goods: []};

var vmRoom = avalon.define({
    $id: "room",
    room: {
        hotel: {name:'',alias:'',address:''},
        roomGalleryList: [],
        designer: {name:'',message:''},
        amenityList: []
    },
    assess: {count: 0, data: {}},
    goDesigner: function() {
        location.href = "designer.html?id=" + vmRoom.room.designer.id;
    },
    goAssess: function() {
        location.href = "assess.html?rid=" + vmRoom.room.id;
    },
    goRooms: function() {
        location.href = "rooms.html";
    },
    list: [],
    goRoom: function(id) {
        location.href = "room.html?id=" + id;
    },
    isGoNext: false,
    goNext: function() {
        vmRoom.isGoNext = true;
        Storage.set("newOrder", newOrder);
        location.href = "rooms.html?type=order";
    },
    swiper1Render: function() {
        var swiper1 = new Swiper('.swiper1', {
            slidesPerView: 1,
            width: window.innerWidth - 40,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky : true,
            freeModeMomentumRatio : 0.4
        });

        mui.previewImage();
    },
    swiper2Render: function() {
        var swiper2 = new Swiper('.swiper2', {
            slidesPerView: 1,
            width: window.innerWidth - 40,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky : true,
            freeModeMomentumRatio : 0.4
        });
    }
});

var vmDesigner = avalon.define({
    $id: "designer",
    designer: {}
});

var vmAmenity = avalon.define({
    $id: "amenity",
    list: []
});

//获取房间详情
ajaxJsonp({
    url: urls.getRoomDetail,
    data: {rid: roomid},
    successCallback: function(json) {
        if(json.status === 1) {
            vmRoom.room = json.data;
            newOrder.room.rid = json.data.id;
            newOrder.room.hid = json.data.hid;
            newOrder.room.name = json.data.name;
            newOrder.room.dayPrice = json.data.dayPrice;
            // newOrder.room.hourPrice = json.data.hourPrice;
            vmAmenity.list = json.data.amenityList;
            vmRoomAssess.designer = json.data.designer;
        }
    }
});

//获取房间时租房价格列表
ajaxJsonp({
    url: urls.getRoomPartTimePrice,
        data: { rid: roomid },
        successCallback: function(json) {
            if (json.status == 1) {
                newOrder.room.hourPrice = json.data;
            }
        }
});

//更多房间
ajaxJsonp({
    url: urls.getRoomList,
    //data: {url:window.location.href},
    successCallback: function(json) {
        if(json.status === 1){
            vmRoom.list = json.data.list;
        }
    }
});

var vmRoomAssess= avalon.define({
    $id: "roomassess",
    designer: {portraitUrl: '', name: '', message: ''},
    list: [],
    scoreList: [
    {name: '淋浴舒适度', r:1, s:5, list:[1,2,3,4,5]},
    {name: '浴舒适度', r:2, s:5, list:[1,2,3,4,5]},
    {name: '清洁度', r:3, s:5, list:[1,2,3,4,5]},
    ],
    pageNo:1,
    count:0,
    s1: 5,
    s2: 5,
    s3: 5,
    r: 0,
    s: 0,
    pageSize:20
});

//获取评论
ajaxJsonp({
    url: urls.getRoomAssess,
    data: {rid:roomid,pageSize:20},
    successCallback: function(json) {
        if(json.status === 1){
            vmRoomAssess.list = json.data.list;
            vmRoomAssess.count = json.data.count;

            if(json.data.score){
                vmRoomAssess.s1 = json.data.score.score1;
                vmRoomAssess.s2 = json.data.score.score2;
                vmRoomAssess.s3 = json.data.score.score3;
            }

            vmRoom.assess.count = json.data.count;
            if(json.data.list.length > 0) {
                vmRoom.assess.data = json.data.list[0];
            }
        }
    }
});


