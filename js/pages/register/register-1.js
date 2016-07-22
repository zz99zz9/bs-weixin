var prePage = getParam('prePage');
var code = getParam('code') || '';
var vmPhone = avalon.define({
    $id: 'phone',
    phone: '',
    goVertify: function() {
        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!(vmPhone.phone.length === 11 && reg.test(vmPhone.phone))) {
            alert("请输入正确的手机号码");
            return false;
        } else {
            window.location.replace("register-2.html?pNum=" + vmPhone.phone + '&code=' + code + "&prePage=" + prePage);
            //history.replaceState(null, "",prePage);
        }
    },
    clickA: function() {
        popover('agreement.html', 1);
    }
});
//动态加载title
var $body = $('body');
document.title = '输入手机号';

var $iframe = $('<iframe src="/favicon.ico"></iframe>');
$iframe.on('load', function() {
    setTimeout(function() {
        $iframe.off('load').remove();
    }, 0);
}).appendTo($body);
