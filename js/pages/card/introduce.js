var vmIntroduce = avalon.define({
    $id: 'introduce',
    data: [{
        discount: 1, 
        amount: 0, 
        monthReturnAmount: 0, 
        lotteryShareTimes: 0, 
        lotteryDefaultTimes: 0
    },{
        discount: 1, 
        amount: 0, 
        monthReturnAmount: 0, 
        lotteryShareTimes: 0, 
        lotteryDefaultTimes: 0
    },{
        discount: 1, 
        amount: 0, 
        monthReturnAmount: 0, 
        lotteryShareTimes: 0, 
        lotteryDefaultTimes: 0
    },{
        discount: 1, 
        amount: 0, 
        monthReturnAmount: 0, 
        lotteryShareTimes: 0, 
        lotteryDefaultTimes: 0
    }],
    getData: function() {
        ajaxJsonp({
            url: urls.getAllDicCardList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmIntroduce.data = json.data;
                }
            }
        });
        
    }
});

vmIntroduce.getData();