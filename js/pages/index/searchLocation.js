var position = Storage.get('position'),
    searchHistory = Storage.get('searchHistory') || [];

var vmSearch = avalon.define({
    $id: 'search',
    mode:  {
        value: 1, 
        city: 1, 
        center: 2, 
        nearby: 3
    },
    city: {
        name: '盘古创业',
        lng: 121.516546,
        lat: 31.217467
    },
    center: {name: '上海市', cid: 803},
    position: '上海市', //所在的城市
    search: '', //搜索输入的内容
    searchCityIndex: -1,
    openCityList: [],
    
    selectSearchCity: function(index, city, cid) {
        stopSwipeSkip.do(function() {
            vmSearch.searchCityIndex = index;

            autocomplete = new AMap.Autocomplete({
                city: city, 
                count: 20
            });

            vmSearch.mode.value = vmSearch.mode.city;
            vmSearch.city = {name: city, cid: cid};
            vmSearch.saveCityMode(city, cid);

            Observer.fire('mapModeChange');
        });
    },
    selectLocation: function(name, lng, lat, isHistory) {
        stopSwipeSkip.do(function() {
            var data = {
                name: name,
                lng: lng,
                lat: lat
            };
            vmSearch.mode.value = vmSearch.mode.center;
            vmSearch.center = data;
            vmSearch.saveCenterMode(name, lng, lat);

            if(!isHistory){
                searchHistory.splice(0,0,data);
                vmSearch.searchHistoryList = searchHistory;
                vmSearch.saveSearchHistory(searchHistory);
            }

            if(location.pathname.indexOf('city')>-1) {
                Observer.fire('mapModeChange');
                vmSearch.closePop();
            } else {
                location.href = "../city.html";
            }
        });
    },
    deleteHistory: function(index) {
        searchHistory.splice(index,1);
        vmSearch.searchHistoryList = searchHistory;
        vmSearch.saveSearchHistory(searchHistory);
    },
    tipList: [{}],
    isShowTipList: 0,
    searchHistoryList: [],
    saveSearchHistory: function(arr) {
        Storage.set('searchHistory', arr);
    },
    currentLocation: '正在定位...',
    getCurrentPosition: function() {
        vmSearch.currentLocation = '正在定位...';
        geolocation.getCurrentPosition();
    },
    closePop: function() {
        stopSwipeSkip.do(function() {
            modalClose();
            vmSearch.clear();
        })
    },
    clear: function() {
        vmSearch.search = '';
        vmSearch.isShowTipList = false;
    },
    saveCityMode: function(city, cid) {
        if(city) {
            $.extend(position, {
                mode: {
                    value: positionIniData.mode.city,
                    city: positionIniData.mode.city, 
                    center: positionIniData.mode.center, 
                    nearby: positionIniData.mode.nearby
                },
                city: {name: city, cid: cid}
            });
        } else {
            $.extend(position, {
                mode: {
                    value: positionIniData.mode.nearby,
                    city: positionIniData.mode.city, 
                    center: positionIniData.mode.center, 
                    nearby: positionIniData.mode.nearby
                }
            });
        }
        Storage.set("position", position);
    },
    saveCenterMode: function(name, lng, lat) {
        $.extend(position, {
            mode: {
                value: positionIniData.mode.center,
                city: positionIniData.mode.city, 
                center: positionIniData.mode.center, 
                nearby: positionIniData.mode.nearby
            },
            center: {name: name, lng: lng, lat: lat}
        });
        Storage.set("position", position);
    }
});

if(position) {
    vmSearch.mode.value = position.mode.value;
    vmSearch.center = position.center;
    vmSearch.city = position.city;
} else {
    position = positionIniData;
    Storage.set("position", position);
}

vmSearch.searchHistoryList = searchHistory;

AMap.plugin(['AMap.Autocomplete','AMap.CitySearch'], function() {
    //实例化城市查询类
    var citysearch = new AMap.CitySearch();
    //自动获取用户IP，返回当前城市
    citysearch.getLocalCity(function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            if (result && result.city && result.bounds) {
                var cityinfo = result.city;
                var citybounds = result.bounds;

                vmSearch.position = result.city;

                autocomplete = new AMap.Autocomplete({
                    city: vmSearch.city.name, //城市，默认全国
                    count: 20
                });
            }
        }
    });
});

ajaxJsonp({
    url: urls.getCityImgList,
    successCallback: function(json) {
        if (json.status === 1) {
            vmSearch.openCityList = json.data;


            json.data.map(function(o, index) {
                if(o.name == vmSearch.city.name) {
                    vmSearch.searchCityIndex = index;
                }
            });
        } else {
            console.log(json.message);
        }
    }
});

vmSearch.$watch('search', function(a) {
    if(a) {
        autocomplete.search(a, function(status, result){
            console.log(result)
            switch(status) {
                case 'complete': 
                    if(result.tips.length > 0) {
                        vmSearch.isShowTipList = 1;
                        vmSearch.tipList = result.tips;
                    }
                    break;
                case 'error':
                case 'no_data':
                    vmSearch.tipList = [];
                    break;
            }
        });
    } else {
        vmSearch.isShowTipList = false;
    }
})
