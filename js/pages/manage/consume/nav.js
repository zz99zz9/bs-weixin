var hotel = Storage.get("hotel");

if(!(hotel && hotel.hid)) {
    location.href = document.referrer || "nav.html";
}

var vmNav = avalon.define({
    $id: 'nav',
    page: 'consume',
    list: [
        { name: '日耗品', type: 1},
        { name: '床上用品', type: 2 },
        { name: '固定资产', type: 3 }
    ],
    go: function(type) {
            location.href = vmNav.page + '-table.html?type=' + type;
    }
});
