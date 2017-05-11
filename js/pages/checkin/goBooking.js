// created by zwh on 2017/05/11

// var currentRoom = Storage.get("currentRoom"),
//     roomId = currentRoom.roomId;
var vmTemperature = avalon.define({
    $id: 'goBooking',
    goBooking: '../img/qietu-goBooking.jpeg',
    goBook: function() {
        stopSwipeSkip.do(function() {
            location.href = "../index.html";
        });
    },
});
