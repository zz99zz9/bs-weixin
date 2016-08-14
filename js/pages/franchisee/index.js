var vmGraph = avalon.define({
    $id: 'graph',
    todaySale: 5621,
    todayCheckIn: 88,
    lastMonthIncome: 180000,
    lastMonthSale: 80000,
    lastMonthCheckIn: 1562,
    totalIncome: 1280966,
    balance: 84500,
    withdrawCash: 54500,
    isVerifyShow: false,
    withdrawClick: function() {
        if(vmGraph.isVerifyShow){
            vmGraph.isVerifyShow = false;
        } else {
            vmGraph.isVerifyShow = true;
        }
    }
})

var swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    width: window.innerWidth - 20,
    spaceBetween: 5,
    freeMode: true,
    freeModeSticky: true,
    freeModeMomentumRatio: 0.4,
});

/**
 * canvas画圆形
 */
var $circle = $('#circle');
var context = $circle[0].getContext('2d');
$circle.attr("width", window.innerWidth);
$circle.attr("height", window.innerHeight);

context.beginPath();
context.arc((window.innerWidth)/2,
    window.innerHeight*0.23,
    75,getRadians(135),getRadians(45),false);
context.lineWidth = 7;
context.strokeStyle = "rgb(186,160,113)";
context.stroke();

$(function() {
    var myChart = echarts.init(document.getElementById('chart'));

    var option = {
        color: ['#baa071'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
        xAxis : [
            {
                type : 'category',
                data : ['8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '7'],
                axisLine: {
                    lineStyle: {
                        color: '#999'
                    }
                },
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLine: { //坐标轴
                    show: false
                },
                splitLine: { //分割线
                    show: false
                },
                axisLabel: { //坐标轴刻度标签
                    show: false
                }
            }
        ],
        series : [
            {
                name:'分佣',
                type:'bar',
                barWidth: '60%',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: '{c}k'
                    }
                },
                data:[17, 16, 15, 13, 12, 14, 12, 13, 14, 15, 18, 18]
            }
        ]
    };
    myChart.setOption(option);
});

function getRadians(degrees) {
    return degrees*(Math.PI/180);
}
