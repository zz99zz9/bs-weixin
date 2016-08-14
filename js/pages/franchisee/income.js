var vmHeader = avalon.define({
    $id: 'header',
    number: 20463,
    sale: 2280000,
    income: 1280966
});

var vmChart = avalon.define({
    $id: 'chart',
    list: [
        {
            date: '2016年7月',
            sale: 15302,
            income: 62911,
        },
        {
            date: '2016年6月',
            sale: 13732,
            income: 54302,
        },
        {
            date: '2016年5月',
            sale: 18674,
            income: 72421
        },
        {
            date: '2016年4月',
            sale: 17876,
            income: 70002,
        },
        {
            date: '2016年3月',
            sale: 15302,
            income: 66953,
        },
        {
            date: '2016年2月',
            sale: 15302,
            income: 66953,
        },
        {
            date: '2016年1月',
            sale: 15302,
            income: 66953,
        },
        {
            date: '2015年12月',
            sale: 15302,
            income: 66953,
        }
    ],
    goMonth: function() {
        location.href = "franchisee-month.html";
    }
});