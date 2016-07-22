var roomid = getParam("rid");
if(roomid != "") {
    if(isNaN(roomid)) {
        location.href = document.referrer || "index.html";
    } else {
        roomid = parseInt(roomid);
    }
} else {
    location.href = "index.html";
}

var vmRoomAssess= avalon.define({
    $id: "roomassess",
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
        }
    }
});