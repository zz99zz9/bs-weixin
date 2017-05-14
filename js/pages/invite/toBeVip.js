var vmToBeVip = avalon.define({
    $id: 'toBeVip',
    beVip: function() {
        stopSwipeSkip.do(function() {
            location.href = "../tokensRecharge.html";
        });
    },
});
