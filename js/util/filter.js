var vmFilter = avalon.define({
    $id: 'filter',
    type: 0,
    dayFilter: [],
    selectDayFilter: [],
    partTimeFilter: [],
    selectPartTimeFilter: [],
    getFilter: function() {
        ajaxJsonp({
            url: urls.getFilter,
            data: {
                isPartTime: 0
            },
            successCallback: function(json) {
                if (json.status !== 0) {
                    vmFilter.dayFilter = json.data;

                    //读取本地数据
                    if(newOrder.day.filter) {
                        vmFilter.selectDayFilter = newOrder.day.filter;
                    }
                }
            }
        });
        ajaxJsonp({
            url: urls.getFilter,
            data: {
                isPartTime: 1
            },
            successCallback: function(json) {
                if (json.status !== 0) {
                    vmFilter.partTimeFilter = json.data;

                    //读取本地数据
                    if(newOrder.partTime.filter) {
                        vmFilter.selectPartTimeFilter = newOrder.partTime.filter;
                    }
                }
            }
        });
    }
});