var vmCardLog = avalon.define({
    $id: 'log',
    data: {
        type: -1,
        account: '15618950312',
        name: '仔仔',
        bankNo: '4392250027129419',
        bank: '招商银行上海淮海路支行'
    },
    list: [
        {
            content: '余额提现',
            time: '2016.8.1',
            amount: 1000,
            type: '1'
        },
        {
            content: '会员卡返还到可提现余额',
            time: '2016.8.10',
            amount: 3000,
            type: '2'
        },
        {
            content: '推广奖励',
            time: '2016.11.10',
            amount: 200,
            type: '3'
        },
        {
            content: '余额提现',
            time: '2016.8.1',
            amount: 1000,
            type: '1'
        },
        {
            content: '会员卡返还到可提现余额',
            time: '2016.8.10',
            amount: 3000,
            type: '2'
        },
        {
            content: '推广奖励',
            time: '2016.11.10',
            amount: 200,
            type: '3'
        },
        {
            content: '余额提现',
            time: '2016.8.1',
            amount: 1000,
            type: '1'
        },
        {
            content: '会员卡返还到可提现余额',
            time: '2016.8.10',
            amount: 3000,
            type: '2'
        },
        {
            content: '推广奖励',
            time: '2016.11.10',
            amount: 200,
            type: '3'
        },
    ],
    openRule: function() {
        
        vmPopover.useCheck = 0;
        popover('./util/card-rule.html', 1);
    },
    goBind: function() {
        location.href = "card-bind.html";
    }
});

var vmPopover = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 1, //1 checkButton, 0 closeButton
    ok: function() {
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        down: {
            height: 50,//可选,默认50.触发下拉刷新拖动距离,
            auto: false,//可选,默认false.自动下拉刷新一次
            contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: reload //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        up: {
            height: 50,//可选.默认50.触发上拉加载拖动距离
            auto: false,//可选,默认false.自动上拉加载一次
            contentrefresh: '正在加载...',
            contentnomore: "没有更多数据了",
            callback: loadmore
        }
    }
});

function reload() {

}

function loadmore() {

}
