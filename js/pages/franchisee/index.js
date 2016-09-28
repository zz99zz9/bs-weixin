var frData = Storage.get('frData'),
    user = Storage.getLocal('user'),
    mobile = user.mobile,
    wait = 60;

if (!frData) {
    frData = { index: 0 };
} else {
    if (!frData.index) {
        frData.index = 0;
    }
}

var vmGraph = avalon.define({
    $id: 'graph',
    todaySale: 0,
    todayCheckIn: 0,
    getToday: function() {
        ajaxJsonp({
            url: urls.saleRangeStatistics,
            data: {
                startTime: getToday('date'),
                endTime: getToday('date')
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmGraph.todaySale = json.data.amount;
                    vmGraph.todayCheckIn = json.data.number;
                }
            }
        });
    },
    lastMonthIncome: 0,
    getLastMonthIncome: function() {
        ajaxJsonp({
            url: urls.commissionRangeStatistics,
            data: {
                startTime: getLastMonth('start'),
                endTime: getLastMonth('end')
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmGraph.lastMonthIncome = json.data.hotelAmount;
                }
            }
        });
    },
    lastMonthSale: 0,
    lastMonthCheckIn: 0,
    getLastMonth: function() {
        ajaxJsonp({
            url: urls.saleRangeStatistics,
            data: {
                startTime: getLastMonth('start'),
                endTime: getLastMonth('end')
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmGraph.lastMonthSale = json.data.amount;
                    vmGraph.lastMonthCheckIn = json.data.number;
                }
            }
        });
    },
    totalIncome: 0,
    getLastYearIncome: function() {
        ajaxJsonp({
            url: urls.commissionRangeStatistics,
            data: {
                startTime: getDates(-365),
                endTime: getLastMonth('end')
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmGraph.totalIncome = json.data.hotelAmount;
                }
            }
        });

        var monthList = [],
            monthIncomeList = [];
        ajaxJsonp({
            url: urls.fraMonthlyList,
            data: {
                startTime: getDates(-365),
                endTime: getLastMonth('end')
            },
            successCallback: function(json) {
                if (json.status === 1) {

                    json.data.list.map(function(o) {
                        monthList.push(o.monthPart);
                        monthIncomeList.push(round((o.hotelAmount / 1000), 0));
                    });

                    //渲染表格
                    var myChart = echarts.init(document.getElementById('chart'));

                    var option = {
                        color: ['#baa071'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        textStyle: {
                            color: '#999'
                        },
                        grid: {
                            left: '1%',
                            right: '1%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [{
                            type: 'category',
                            data: monthList,
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            axisTick: {
                                alignWithLabel: true
                            }
                        }],
                        yAxis: [{
                            type: 'value',
                            axisLine: { //坐标轴
                                show: false
                            },
                            splitLine: { //分割线
                                show: false
                            },
                            axisLabel: { //坐标轴刻度标签
                                show: false
                            }
                        }],
                        series: [{
                            name: '分佣',
                            type: 'bar',
                            barWidth: '60%',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{c}k'
                                }
                            },
                            data: monthIncomeList
                        }]
                    };
                    myChart.setOption(option);
                }
            }
        });
    },
    balance: 0,
    withdrawCash: 0,
    getAccount: function() {
        ajaxJsonp({
            url: urls.fraAccount,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmGraph.withdrawCash = json.data.cashAmount;
                    vmGraph.balance = json.data.cashAmount + json.data.rentAmount;
                }
            }
        });
    },
    goToday: function() {
        location.href = "franchisee-today.html";
    },
    goMonth: function() {
        location.href = "franchisee-month.html";
    },
    goIncome: function() {
        location.href = "franchisee-income.html";
    },
    goRecord: function() {
        location.href = "franchisee-record.html";
    },
    goNote: function() {
        //location.href = "franchisee-note.html";
    },
    codeMsg: '发送验证码',
    amount: '', //提现金额
    code: '', //输入的验证码
    isSuccess: false,
    isDisabled1: true,
    isDisabled2: false,
    isShow: true,
    withdrawClick: function() {
        vmGraph.getCode();
        vmGraph.isShow = false;
        vmGraph.isDisabled2 = true;
        vmGraph.code = '';
    },
    confirm: function() {
        vmGraph.submit();
        vmGraph.isShow = true;
        vmGraph.isDisabled1 = true;
        vmGraph.amount = '';
    },
    cancel: function() {
        vmGraph.isShow = true;
        vmGraph.isDisabled1 = false;
    }, 
    getCode: function() {
        ajaxJsonp({
            url: urls.fraSms,
            data: {},
            successCallback: function(json) {
                if (json.status !== 1) {
                    alert(json.message);
                    return;
                } else {
                    wait = 60;
                    countSecond();
                }
            }
        });
    },
    submit: function() {
        ajaxJsonp({
            url: urls.fraCash,
            data: {
                code: vmGraph.code,
                amount: vmGraph.amount,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmGraph.getAccount();
                    vmGraph.amount = ''; 
                    mui.alert("提现成功","余额提现");
                } else {
                    vmGraph.isDisabled = false;
                    alert(json.massage);
                }
            }
        });
    },
    //提现按钮变化
    changed1: function() {
        if (vmGraph.amount <= vmGraph.balance && vmGraph.amount.length > 0 && vmGraph.amount.length < 10) {
            vmGraph.isDisabled1 = false;
        } else {
            vmGraph.isDisabled1 = true;
        }
    },
    //确定按钮变化
    changed2: function() {
        if (vmGraph.code.length > 0 && vmGraph.code.length < 10) {
            vmGraph.isDisabled2 = false;
        } else {
            vmGraph.isDisabled2 = true;
        }
    },
})
// vmGraph.$watch("code", function(a) {
//     if (a.length > 0 && a.length < 10) {
//         vmGraph.isDisabled = false;
//     } else {
//         vmGraph.isDisabled = true;
//     }
// });


var swiper = new Swiper('.swiper', {
    initialSlide: frData.index,
    slidesPerView: 1,
    width: window.innerWidth - 20,
    spaceBetween: 5,
    freeMode: true,
    freeModeSticky: true,
    freeModeMomentumRatio: 0.4,
    onSlideChangeEnd: function(swiper) {
        frData.index = swiper.activeIndex;
        Storage.set('frData', frData);
    }
});
vmGraph.getToday();
vmGraph.getLastMonth();
vmGraph.getLastMonthIncome();
vmGraph.getLastYearIncome();
vmGraph.getAccount();

/**
 * canvas画圆形
 */
var $circle = $('#circle');
var context = $circle[0].getContext('2d');
$circle.attr("width", window.innerWidth);
$circle.attr("height", window.innerHeight);

context.beginPath();
context.arc((window.innerWidth) / 2 - 20,
    window.innerHeight * 0.18,
    75, getRadians(135), getRadians(45), false);
context.lineWidth = 7;
context.strokeStyle = "rgb(186,160,113)";
context.stroke();

function getRadians(degrees) {
    return degrees * (Math.PI / 180);
}
//倒计时
function countSecond() {
    if (wait === 0) {
        vmGraph.isSuccess = false;
        vmGraph.codeMsg = '发送验证码';
        wait = 60;
    } else {
        vmGraph.codeMsg = wait + '秒后可重新获取';
        vmGraph.isSuccess = true;
        wait--;
        setTimeout(countSecond, 1000);
    }

}

//是否已注册
ajaxJsonp({
    url: urls.getRegisterLogURL,
    data: {
        mobile: mobile
    },
    successCallback: function(json) {
        if (json.status === 1) {
            vmGraph.isUsed = json.data;
        }
    }
});
