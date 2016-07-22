var vmFilter = avalon.define({
    $id: "filter",
    startTime: getDates(0).substring(0, 10),
    endTime: getDates(1).substring(0, 10),
    timeType: 1,
    timeOptions: {type: 'date'},
    timeSelect: function(i){
        vmFilter.timeType = i;

        vmFilter.startTime = getDates(0).substring(0, 10);
    },
    roomType: 1,
    roomSelect: function(i){
        vmFilter.roomType = i;
    },
    goRooms: function(){

    },
    calendar: []
});

// function getCalendar() {
//     var d = new Date();
//     d.setDate(d.getDate() + 2);
//     var year = d.getFullYear();
//     var month = d.getMonth() + 1;
//     var day = d.getDate();
//     var weekday = d.getDay();
//     var list = [], 
//         temp = [];
//     d.setDate(d.getDate() - (weekday - 1));
//     for(var i = 1; i < weekday; i++) {
//         list.push({month:month, day: d.getDate(), disabled:true});
//         d.setDate(d.getDate() + 1);
//     }

//     var monthDay = {
//         1:31,2:28,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31
//     };

//     if(year%4 == 0 && month <= 2)
//         monthDay["2"] = 29;

//     temp = [];
//     var index = 0;
//     for(var i in monthDay) {
//         for(var j = 1; j <= monthDay[i]; j++) {
//             temp.push({month: i, day: j, disabled:false});
//             if(month > parseInt(i) ||(month == i && day > j))
//                 index ++;
//         }
//     }

    
//     list.push.apply(list, temp.splice(index, temp.length));
//     list.push.apply(list, temp);

//     vmFilter.month = month;
//     vmFilter.calendar = list;
// }

function getCalendar() {
    var d = new Date();
    var year = d.getFullYear();
    var weekday = d.getDay();

    var list = [];
    d.setDate(d.getDate() - (weekday - 1));
    for(var i = 1; i < weekday; i++) {
        list.push({month: d.getMonth() + 1, day: d.getDate(), disabled: true});
        d.setDate(d.getDate() + 1);
    }

    d = new Date();
    for(var i = 0; i < 365; i++) {
        list.push({month: d.getMonth() + 1, day: d.getDate(), disabled: false})
        d.setDate(d.getDate() + 1);
    }

    vmFilter.calendar = list;
}

getCalendar();

(function($) {
    $.init();
    document.getElementById('datepickerStart').addEventListener('tap', function() {
        var picker = new $.DtPicker(vmFilter.$model.timeOptions);
        picker.show(function(rs) {
            vmFilter.startTime = rs.text;
            picker.dispose();
        });
    }, false);
    document.getElementById('datepickerEnd').addEventListener('tap', function() {
        var picker = new $.DtPicker(vmFilter.$model.timeOptions);
        picker.show(function(rs) {
            vmFilter.endTime = rs.text;
            picker.dispose();
        });
    }, false);
})(mui);