var hotel = controlCore.getHotel();

var vmStatistic = avalon.define({
    $id: 'statistic',
    date: '',
    formatDate: '',
    pre: '',
    current: '',
    data: {in: {}, out: {}},
    getData: function() {
        ajaxJsonp({
            url: urls.reportIn,
            data: {date: vmStatistic.date, hid: hotel.hid},
            successCallback: function(json) {
                if (json.status === 1) {
                   vmStatistic.data.in = json.data;
               }
            }
        });

        ajaxJsonp({
            url: urls.reportOut,
            data: {date: vmStatistic.date, hid: hotel.hid},
            successCallback: function(json) {
                if (json.status === 1) {
                   vmStatistic.data.out = json.data;
               }
            }
        });
    },
});

//选择时间，默认当月
vmStatistic.formatDate = getToday('month');

vmStatistic.date = getToday('monthNotFormat');
vmStatistic.current = getToday('monthNotFormat');
vmStatistic.pre = getToday('preMonthNotFormat');

vmStatistic.getData();

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
                //vmStatistic.date = rs.text;
                if (rs.m.text == "全部") {
                    vmStatistic.date = rs.y.text;
                    vmStatistic.formatDate = rs.y.text + " 年 ";

                    vmStatistic.pre = parseInt(rs.y.text) - 1;
                } else {
                    if (rs.d.text == "全部") {
                        vmStatistic.date = rs.y.text + "-" + rs.m.text;
                        vmStatistic.formatDate = rs.y.text + " 年 " + parseInt(rs.m.text) + " 月 ";

                        vmStatistic.pre = getPreMonth(vmStatistic.date);
                    } else {
                        vmStatistic.date = rs.y.text + "-" + rs.m.text + "-" + rs.d.text;
                        vmStatistic.formatDate = rs.y.text + " 年 " + parseInt(rs.m.text) + " 月 " + parseInt(rs.d.text) + " 日 ";

                        vmStatistic.pre = getPreDay(vmStatistic.date);
                    }
                }

                vmStatistic.current = vmStatistic.date;
                vmStatistic.getData();
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
