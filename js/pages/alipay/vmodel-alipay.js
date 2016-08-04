/**
 * Created by lyh on 2016/8/2/002.
 */

var vmAlipay = avalon.define({
    $id: 'alipay',
    payUrl: '',
    getPayUrl: function () {
        vmAlipay.payUrl = decodeURIComponent(getParam('payUrl'));
        console.log(vmAlipay.payUrl);
        if (isweixin) {//如果是在微信里打开
            var h = Math.max(document.body.scrollHeight, document.body.clientHeight) - 6;
            var myiframe = document.getElementById('myiframe');
            myiframe.height = h;
        } else {//在其它浏览器打开
            top.location = vmAlipay.payUrl;
        }
    }
});

vmAlipay.getPayUrl();
