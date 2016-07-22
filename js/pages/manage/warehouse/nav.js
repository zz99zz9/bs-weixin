var hotel = controlCore.getHotel();

var vmNav = avalon.define({
    $id: 'nav',
    page: 'warehouse',
    list: [
        { name: '入库', type: 1 },
        { name: '出库', type: 2 },
        { name: '调拨', type: 3 },
        { name: '库存盘点', type: 4 }
    ],
    go: function(type) {
        if (type <= 4) {
            location.href = vmNav.page + '-list.html?type=' + type;
        } else {
            return;
        }
    }
});
