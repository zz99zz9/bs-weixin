var vmIntroduce = avalon.define({
    $id: 'introduce',
    data: [],
    getData: function() {
        ajaxJsonp({
            url: urls.getAllDicCardList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmIntroduce.data = [];
                    json.data.map(function(c) {
                        vmIntroduce.data.push(c);
                    });
                }
            }
        });
        
    }
});

vmIntroduce.getData();