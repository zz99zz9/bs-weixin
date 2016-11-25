const loadUrl = 1;
const loadStr = 2;
const none = 0;
var popover_ishide = false;

function popover(url, type, callback) {
    popover_ishide = false;
    $('.popover').show();
    switch (type) {
        case loadUrl:
            $('#pop-text').load(url, function() {
                avalon.scan(document.getElementById('modal-text-content'));

                if (typeof callback == "function") {
                    callback();
                }
                // avalon.scan(document.getElementsByClassName('popover')[0]);
            });
            break;
        case loadStr:
            $('#pop-text').html(url);
            avalon.scan(document.getElementById('modal-text-content'));
            
            // avalon.scan(document.getElementsByClassName('popover')[0]);
            break;
        default:
            break;
    }
    setTimeout("$('.popover').removeClass('popover-hide')", 10);
};

$(function() {
    // $('.popover-content').height(window.screen.height-185);
    if (!isios && isweixin) {
        //$('.popover').css('-webkit-transition-duration','0');
    }
    $('.popover').on('webkitTransitionEnd', function() {
        if (popover_ishide) {
            $('.popover').hide();
        }
    })
    $('.popover').on('touchmove', function(e) {
        e.stopPropagation();
    })

    $('.popover-closeButton').on('click', function() {

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    })
});
