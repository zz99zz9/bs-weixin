/**
 * Created by lyh on 2016/8/2/002.
 */

var vmAlipay = avalon.define({
    $id: 'alipay',
    payUrl: '',
    getPayUrl: function () {
        vmAlipay.payUrl = decodeURIComponent(getParam('payUrl'));
        console.log(vmAlipay.payUrl);
        if (isweixin) {
            var h = Math.max(document.body.scrollHeight, document.body.clientHeight) - 5;
            var myiframe = document.getElementById('myiframe');
            myiframe.height = h;
        } else {
            top.location = vmAlipay.payUrl;
        }
    }
});

vmAlipay.getPayUrl();