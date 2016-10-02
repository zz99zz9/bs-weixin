var prData = Storage.get('prData');

if (!prData) {
    prData = { index: 0 };
} else {
    if (!prData.index) {
        prData.index = 0;
    }
}

var vmDetail = avalon.define({
    $id: 'detail',
    data: {
        num: 3,
        yearIncome: 43200,
        a: 0 //勾子
    },
    list: [0, 0, 0],
    complete: function(index) {
        console.log(index);
        if(vmDetail.list[index] == 0) {
            mui.confirm('已经完成本次推广？','',
                ["否", "是"], 
                function(e) {
                    if(e.index == 1) {
                        vmDetail.list[index] = 1; 
                        vmDetail.data.a += 1; //只改动数组的某项时，不会触发数据刷新
                    }
                })
        }
    },
    openRule: function() {
        vmPopover.useCheck = 0;
        popover('./util/promotion-rule.html', 1);
    },
});

var swiper = new Swiper('.swiper', {
    initialSlide: prData.index,
    slidesPerView: 1,
    width: window.innerWidth - 20,
    spaceBetween: 5,
    freeMode: true,
    freeModeSticky: true,
    freeModeMomentumRatio: 0.4,
    onSlideChangeEnd: function(swiper) {
        prData.index = swiper.activeIndex;
        Storage.set('prData', prData);
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

/**
 * canvas画圆形
 */
var $circle = $('#circle');
var context = $circle[0].getContext('2d');
$circle.attr("width", window.innerWidth);
$circle.attr("height", 160);

context.beginPath();
context.arc((window.innerWidth) / 2,
    80,
    75, getRadians(135), getRadians(45), false);
context.lineWidth = 7;
context.strokeStyle = "rgb(186,160,113)";
context.stroke();
