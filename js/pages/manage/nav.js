var hotel = controlCore.getHotel();

var vmNav = avalon.define({
    $id: 'nav',
    list: [],
    go: function(type) {
        location.href = type;
    }
});

//获取用户所选区域酒店列表数据
ajaxJsonp({
    url: urls.menuList,
    successCallback: function(json) {
        if (json.status === 1) {
            json.data[0].menuList.map(function(o) {
                vmNav.list.push({
                    name: o.menuName,
                    type: o.url,
                });
            });
        }
    }
});

$("#headerReplace").text(hotel.name);
