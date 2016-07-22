var rid = getParam('id');
var vmDetails = avalon.define({
    $id:'details',
    date:'',
    name:'',
    nightPrice:0,//夜房价格
    partPrice:0,//时租房单价
    nightCount:0,
    hourCount:0,
    bookTimeList:'',
    currTimeList:'',
    comsueList:[],
    toolList:[],
    toolName:'',
    options:'确认',
    damageTool:'',
    roomStatus:0,
    repairMoney:0,
    isDisabled:false,
    repairLogId:0,
    submit: function() {
        switch(vmDetails.roomStatus){
                case 3:
                    
                break;
                case 4:
                    
                break;
                case 5:
                    
                break;
                case 6:
                    if(vmDetails.repairMoney===''||vmDetails.repairMoney==='0')
                    {
                        mui.toast('请填写维修金额');
                        return;
                    }
                    vmDetails.isDisabled = true;
                    ajaxJsonp({
                        url: urls.confirmRepair,
                        data: {
                            rid: rid,
                            amount: vmDetails.repairMoney,
                            repairId:vmDetails.repairLogId
                        },
                        successCallback: function(json) {
                            if (json.status === 1) {
                                alert('操作成功');
                                document.referrer ? history.go(-1) : location.replace('../manage/room-details.html?id='+rid);
                            } else {
                                vmDetails.isDisabled = false;
                                alert(json.message);
                            }
                        }
                    });                    
                break;
                case 7:
                    
                break;
            }        

    },
    cancel: function() {
        if(confirm("确定取消？")){
            document.referrer ? history.go(-1) : location.replace('../manage/room-details.html?id='+rid);
        }
    },
    goRepair: function() {
        location.href="../manage/room-repair.html?id="+rid;
    },
    goBan: function() {
        location.href="../manage/room-ban.html?id="+rid;
    }
});

ajaxJsonp({
    url: urls.roomDetail,
    data: {rid: rid},
    successCallback: function(json) {
        if (json.status === 1) {
            vmDetails.name = json.data.roomNo;
            vmDetails.nightPrice = json.data.avgNightPrice;
            vmDetails.partPrice = json.data.avgPartTimePrice;
            vmDetails.bookTimeList = json.data.bookTimeList;
            vmDetails.currTimeList = json.data.currTimeList;
            vmDetails.nightCount = json.data.nightCheckInCount;
            vmDetails.hourCount = json.data.partTimeCheckInCount;
            //1-空房；2-预订；3-已入住；4-到点未退；5-脏房；6-维修；7-停用
            vmDetails.roomStatus = json.data.roomStatus;
            console.log(json.data.roomStatus);
            $("#headerReplace").text(json.data.roomNo);
            switch(vmDetails.roomStatus){
                case 1:

                break;
                case 2:

                break;
                case 3:
                    vmDetails.options = '确认处理';
                break;
                case 4:
                    vmDetails.options = '退房';
                break;
                case 5:
                    vmDetails.options = '确认打扫';
                break;
                case 6:
                    vmDetails.options = '确认维修';
                break;
                case 7:
                    vmDetails.options = '确认停用';
                break;
            }
        }
    }
});
ajaxJsonp({
    url: urls.roomRepairLog,
    data: {rid: rid},
    successCallback: function(json) {
        if (json.status === 1) {
            vmDetails.repairLogId = json.data.id;
            vmDetails.damageTool = json.data.damageGoods;
        }
    }
});


vmDetails.date = getToday('date');

(function($) {
    $.init();
    var btns = $('.btn');
    btns.each(function(i, btn) {
        btn.addEventListener('tap', function() {
            var optionsJson = this.getAttribute('data-options') || '{}';
            var options = JSON.parse(optionsJson);
            options.isSection = false; //月份和日期有全部的选项
            var id = this.getAttribute('id');
            var picker = new $.DtPicker(options);
            picker.show(function(rs) {
                vmDetails.date = rs.text;
                picker.dispose();
            });
        }, false);
    });
})(mui);
(function($, doc) {
    $.init();
    $.ready(function() {
        var toolPicker = new $.PopPicker();
        toolPicker.setData(vmDetails.toolList);
        var showUserPickerButton = doc.getElementById('toolPicker');
        showUserPickerButton.addEventListener('tap', function(event) {
            toolPicker.show(function(items) {
                //vmDetails.toolName = items[0].text;
            });
        }, false);
    });
})(mui, document);
