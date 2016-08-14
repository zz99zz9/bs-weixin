var vmHeader = avalon.define({
    $id: 'header',
    date: '2016年7月',
    number: 1562,
    sale: 180000,
    income: 80000
});

var vmChart = avalon.define({
    $id: 'chart',
    list: [
        {
            date: '7月1日',
            sale: 5302,
            room: [
                {
                    type: '全天房',
                    checkin: 18
                },
                {
                    type: '时租房',
                    checkin: 29
                }
            ]
        },
        {
            date: '7月2日',
            sale: 4732,
            room: [
                {
                    type: '全天房',
                    checkin: 15
                },
                {
                    type: '时租房',
                    checkin: 21
                }
            ]
        },
        {
            date: '7月3日',
            sale: 6674,
            room: [
                {
                    type: '全天房',
                    checkin: 21
                },
                {
                    type: '时租房',
                    checkin: 19
                }
            ]
        },
        {
            date: '7月4日',
            sale: 5876,
            room: [
                {
                    type: '全天房',
                    checkin: 16
                },
                {
                    type: '时租房',
                    checkin: 24
                }
            ]
        },
        {
            date: '7月5日',
            sale: 5302,
            room: [
                {
                    type: '全天房',
                    checkin: 18
                },
                {
                    type: '时租房',
                    checkin: 29
                }
            ]
        },
        {
            date: '7月6日',
            sale: 5302,
            room: [
                {
                    type: '全天房',
                    checkin: 18
                },
                {
                    type: '时租房',
                    checkin: 29
                }
            ]
        },
        {
            date: '7月7日',
            sale: 5302,
            room: [
                {
                    type: '全天房',
                    checkin: 18
                },
                {
                    type: '时租房',
                    checkin: 29
                }
            ]
        },
        {
            date: '7月8日',
            sale: 5302,
            room: [
                {
                    type: '全天房',
                    checkin: 18
                },
                {
                    type: '时租房',
                    checkin: 29
                }
            ]
        }
    ],
    goToday: function() {
        location.href = "franchisee-today.html";
    }
});