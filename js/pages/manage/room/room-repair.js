var rid = getParam('id');

var vmRepair = avalon.define({
    $id: 'repair',
    date:'',
    tools:'',
    isDisabled: false,
    submit: function() {
        if(vmRepair.date===''||vmRepair.tools===''){
            if(vmRepair.tools===''){
                mui.toast("请填写损坏物品");
                return;
            }
            if(vmRepair.date==''){
                mui.toast("请填写对应的时间");
                return;
            }
        }
        vmRepair.isDisabled = true;
        ajaxJsonp({
            url: urls.roomRepairLogSave,
            data: {
                rid:rid,
                damageGoods:vmRepair.tools,
                damageDate:vmRepair.date
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    document.referrer ? history.go(-1) : location.replace('../manage/room-details.html?id='+rid);
                } else {
                    vmRepair.isDisabled = false;
                    alert(json.message);
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
vmRepair.date = getToday();
(function($, doc) {
    $.init();
    var btn = doc.getElementById('datePicker')
    btn.addEventListener('tap', function() {
        var optionsJson = btn.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        var picker = new $.DtPicker(options);
        picker.show(function(rs) {
            vmRepair.date = rs.text;
            picker.dispose();
        });
    }, false);
})(mui, document);
