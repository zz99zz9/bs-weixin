var vmTelecontroller = avalon.define({
    $id: 'telecontroller',
    isSwitch: 0,  //默认不启动  0-不启动  1-启动
    switch1: function() {
        stopSwipeSkip.do(function() {
            if (vmTelecontroller.isSwitch==0) {
                $("#switch1").css("background-color", "#444");
                vmTelecontroller.isSwitch = 1;
            } else {
                $("#switch1").css("background-color", "#bdbdbd");
                vmTelecontroller.isSwitch = 0;
            }
        })
    },
    isThreed: 0,  //默认不启动  0-不启动  1-启动
    threeD: function() {
        stopSwipeSkip.do(function() {
            if (vmTelecontroller.isThreed==0) {
                $("#threeD").css("background-color", "#bdbdbd");
                vmTelecontroller.isThreed = 1;
            } else {
                $("#threeD").css("background-color", "#f2f2f2");
                vmTelecontroller.isThreed = 0;
            }
        })
    },
});
