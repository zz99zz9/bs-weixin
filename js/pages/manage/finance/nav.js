var hotel = controlCore.getHotel();

var vmNav = avalon.define({
    $id: 'nav',
    page: 'finance',
    date: '',
    startTime: '',
    endTime: '',
    data: { 
        in: [
            { key: "nightAmount", text: "夜房", value: 0, type: 1 },
            { key: "partTimeAmount", text: "时租房", value: 0, type: 2 },
            { key: "goodsAmount", text: "非房", value: 0, type: 3 }
        ],
        out: [
            { key: "dailyAmount", text: "日用品", value: 0, type: 4 },
            { key: "damagedAmount", text: "物品损坏", value: 0, type: 5 },
            { key: "salaryAmount", text: "人员工资", value: 0, type: 6 },
            { key: "energyAmount", text: "能耗", value: 0, type: 7 },
            { key: "equipmentAmount", text: "设备", value: 0, type: 8 },
            { key: "taxAmount", text: "税务", value: 0, type: 9 },
            { key: "otherAmount", text: "其它", value: 0, type: 10 }
        ],
        sumIn: 0,
        sumOut: 0
    },
    getData: function() {
        ajaxJsonp({
            url: urls.income,
            data: {hid: hotel.hid, startTime: vmNav.startTime, endTime:vmNav.endTime},
            successCallback: function(json) {
                if (json.status === 1) {
                    var inList = vmNav.$model.data.in;
                    for(var i in inList) {
                        vmNav.data.in[i].value = json.data[inList[i].key];
                    }

                    vmNav.data.sumIn = json.data.totalAmount;
                }
            }
        });

        ajaxJsonp({
            url: urls.outlay,
            data: {hid: hotel.hid, startTime: vmNav.startTime, endTime:vmNav.endTime},
            successCallback: function(json) {
                if (json.status === 1) {
                    var outList = vmNav.$model.data.out;
                    for(var i in outList) {
                        vmNav.data.out[i].value = json.data[outList[i].key];
                    }

                    vmNav.data.sumOut = json.data.totalAmount;
                }
            }
        });
    },
    isActive: function() {
        var financeTemp = Storage.get("financeTemp");
        if (financeTemp) {
            return parseInt(financeTemp.id) < 4;
        } else {
            return true;
        }
    },
    jump: function() {
        location.href = 'invoice.html';
    },
    go: function(type) {
        if (type < 4) {
            location.href = vmNav.page + '-table.html?type=' + type;
        } else if (type == 11) {
            location.href = 'detail-out.html?type=11';
        } else {
            location.href = vmNav.page + '-table.html?type=' + type;
        }
    }
});
if(hotel.dateFinance) {
    vmNav.date = hotel.dateFinance;
    vmNav.startTime = hotel.startTime;
    vmNav.endTime = hotel.endTime;
} else {
    //如果没有选择过，默认看本月的数据
    vmNav.date = getToday('month');
    vmNav.startTime = getToday("monthFirst");
    vmNav.endTime = getToday();

    hotel.dateFinance = vmNav.date;
    hotel.startTime = vmNav.startTime;
    hotel.endTime = vmNav.endTime;
    Storage.set("hotel",hotel);
}
vmNav.getData();

function format(a) {
    if (a.indexOf("0") == 0) {
        return a[1];
    } else {
        return a;
    }
}

(function($) {
    $.init();
    var btns = $('.btn');
    btns.each(function(i, btn) {
        btn.addEventListener('tap', function() {
            var optionsJson = this.getAttribute('data-options') || '{}';
            var options = JSON.parse(optionsJson);
            options.isSection = true; //月份和日期有全部的选项
            var id = this.getAttribute('id');
            /*
             * 首次显示时实例化组件
             * 示例为了简洁，将 options 放在了按钮的 dom 上
             * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
             */
            var picker = new $.DtPicker(options);
            picker.show(function(rs) {
                /*
                 * rs.value 拼合后的 value
                 * rs.text 拼合后的 text
                 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
                 * rs.m 月，用法同年
                 * rs.d 日，用法同年
                 * rs.h 时，用法同年
                 * rs.i 分（minutes 的第二个字母），用法同年
                 */
                //vmNav.date = rs.text;
                if (rs.m.text == "全部") {
                    vmNav.date = rs.y.text + " 年 ";

                    vmNav.startTime = rs.y.text + "-01-01";
                    vmNav.endTime = rs.y.text + "-12-31";
                } else {
                    if (rs.d.text == "全部") {
                        vmNav.date = rs.y.text + " 年 " + format(rs.m.text) + " 月 ";

                        vmNav.startTime = rs.y.text + "-" + rs.m.text + "-01";
                        vmNav.endTime = rs.y.text + "-" + rs.m.text + "-" + getDayNum(parseInt(format(rs.y.text)), parseInt(format(rs.m.text)));
                    } else {
                        vmNav.date = rs.y.text + " 年 " + format(rs.m.text) + " 月 " + format(rs.d.text) + " 日 ";

                        vmNav.startTime = rs.y.text + "-" + rs.m.text + "-" + rs.d.text;
                        vmNav.endTime = rs.y.text + "-" + rs.m.text + "-" + rs.d.text;
                    }
                }
                
                hotel.dateFinance = vmNav.date;
                hotel.startTime = vmNav.startTime;
                hotel.endTime = vmNav.endTime;

                Storage.set("hotel", hotel);
                vmNav.getData();
                /* 
                 * 返回 false 可以阻止选择框的关闭
                 * return false;
                 */
                /*
                 * 释放组件资源，释放后将将不能再操作组件
                 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
                 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
                 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
                 */
                picker.dispose();
            });
        }, false);
    });
})(mui);
