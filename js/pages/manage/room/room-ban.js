var rid = getParam('id');

var vmBan = avalon.define({
    $id: 'ban',
    date1:'',
    date2:'',
    reason:'',
    isDisabled: false,
    submit: function() {
        if(vmBan.date1===''||vmBan.reason===''||vmBan.date2===''){
            if(vmBan.reason===''){
                mui.toast("请填写停用原因");
                return;
            }
            if(vmBan.date1==''){
                mui.toast("请填写起始时间");
                return;
            }
            if(vmBan.date2==''){
                mui.toast("请填写结束时间");
                return;
            }
        }
        vmBan.isDisabled = true;
        ajaxJsonp({
            url: urls.disableRoom,
            data: {
                rid:rid,
                reason:vmBan.reason,
                startTime:vmBan.date1,
                endTime:vmBan.date2
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    document.referrer ? history.go(-1) : location.replace('../manage/room.html');
                } else {
                    vmBan.isDisabled = false;
                }
            }
        });
    },
    cancel: function() {
            if(confirm("确定取消？")){
                document.referrer ? history.go(-1) : location.replace('../manage/room-details.html?id='+rid);
            }
        }
});
vmBan.date1 = getToday();
vmBan.date2 = getToday();
(function($, doc) {
    $.init();
    var btn1 = doc.getElementById('datePicker1')
    btn1.addEventListener('tap', function() {
        var optionsJson = btn1.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        var picker = new $.DtPicker(options);
        picker.show(function(rs) {
            vmBan.date1 = rs.text;
            picker.dispose();
        });
    }, false);
    var btn2 = doc.getElementById('datePicker2')
    btn2.addEventListener('tap', function() {
        var optionsJson = btn1.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        var picker = new $.DtPicker(options);
        picker.show(function(rs) {
            vmBan.date2 = rs.text;
            picker.dispose();
        });
    }, false);
})(mui, document);
