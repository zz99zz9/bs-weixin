/**
 * Created by lyh on 2016/7/29/029.
 */

var vmInvoiceApply = avalon.define({
    $id: 'invoiceApply',
    amount: 0,
    oids: [],
    invoiceType: 1,
    payType: 2,
    head: '',
    invoiceExpressFee: 0,
    editDeliveryAddress: {
        name: '',
        mobile: '',
        fullAddress: ''
    },
    defaultDeliveryAddress: {
        id: '',
        name: '',
        mobile: '',
        fullAddress: ''
    },
    payInfo: {},
    invoiceId: '',
    /**
     * 获取快递费用
     */
    getInvoiceExpressFee: function () {
        ajaxJsonp({
            url: urls.getInvoiceExpressFee,
            successCallback: function (json) {
                if (json.status == 1) {
                    vmInvoiceApply.invoiceExpressFee = json.data;
                } else {
                    alert(json.message);
                }
            }
        });
    },
    /**
     * 打开收货地址编辑框
     */
    openDeliveryAddress: function () {
        vmInvoiceApply.editDeliveryAddress.name = vmInvoiceApply.defaultDeliveryAddress.name;
        vmInvoiceApply.editDeliveryAddress.mobile = vmInvoiceApply.defaultDeliveryAddress.mobile;
        vmInvoiceApply.editDeliveryAddress.fullAddress = vmInvoiceApply.defaultDeliveryAddress.fullAddress;
        popover('./util/delivery-address-add.html', 1);
    },
    /**
     * 获取默认收货地址
     */
    getDeliveryAddress: function () {
        ajaxJsonp({
            url: urls.getDeliveryAddress,
            successCallback: function (json) {
                if (json.status == 1) {
                    if (isNotEmpty(json.data)) {
                        vmInvoiceApply.defaultDeliveryAddress = json.data;
                    }
                } else {
                    alert(json.message);
                }
            }
        });
    },
    /**
     * 保存收货地址
     * @returns {boolean}
     */
    saveDeliveryAddress: function () {
        if (vmInvoiceApply.editDeliveryAddress.name == "") {
            alert("收货人姓名不能为空");
            return false;
        }
        if (vmInvoiceApply.editDeliveryAddress.mobile == "") {
            alert("手机号不能为空");
            return false;
        }
        if (vmInvoiceApply.editDeliveryAddress.fullAddress == "") {
            alert("收货地址不能为空");
            return false;
        }
        if (vmInvoiceApply.editDeliveryAddress.name.length > 50) {
            alert("名字不能大于50个字");
            return false;
        }
        if (vmInvoiceApply.editDeliveryAddress.mobile.length < 11) {
            alert("手机号不能小于11位");
            return false;
        }
        if (vmInvoiceApply.editDeliveryAddress.mobile.length > 11) {
            alert("手机号不能大于11位");
            return false;
        }
        if (vmInvoiceApply.editDeliveryAddress.fullAddress.length > 255) {
            alert("名字不能大于255个字");
            return false;
        }
        vmInvoiceApply.defaultDeliveryAddress.name = vmInvoiceApply.editDeliveryAddress.name;
        vmInvoiceApply.defaultDeliveryAddress.mobile = vmInvoiceApply.editDeliveryAddress.mobile;
        vmInvoiceApply.defaultDeliveryAddress.fullAddress = vmInvoiceApply.editDeliveryAddress.fullAddress;

        ajaxJsonp({
            url: urls.saveDeliveryAddress,
            data: {
                id: vmInvoiceApply.defaultDeliveryAddress.id,
                mobile: vmInvoiceApply.defaultDeliveryAddress.mobile,
                name: vmInvoiceApply.defaultDeliveryAddress.name,
                fullAddress: vmInvoiceApply.defaultDeliveryAddress.fullAddress
            },
            successCallback: function (json) {
                if (json.status !== 1) {
                    alert(json.message);
                    return;
                } else {
                    vmInvoiceApply.defaultDeliveryAddress = json.data;
                    $('#pop-text').empty();
                    $('.popover').addClass('popover-hide');
                    popover_ishide = true;
                }
            }
        });
    },
    /**
     申请发票
     */
    saveInvoice: function () {
        if (vmInvoiceApply.invoiceType == 2) {
            if (isEmpty(vmInvoiceApply.head)) {
                alert('请填写公司抬头');
                return;
            }
        }
        ajaxJsonp({
            url: urls.saveInvoice,
            data: {
                oids: vmInvoiceApply.oids.join(','),
                head: vmInvoiceApply.invoiceType == 1 ? '个人' : vmInvoiceApply.head,
                aid: vmInvoiceApply.defaultDeliveryAddress.id
            },
            successCallback: function (json) {
                if (json.status === 1) {
                    vmInvoiceApply.invoiceId = json.data.id;
                    vmInvoiceApply.payInvoice();
                } else {
                    alert(json.message);
                }
            }
        });
    },
    /**
     * 发起支付
     */
    payInvoice: function () {
        ajaxJsonp({
            url: urls.payInvoice,
            data: {
                id: vmInvoiceApply.invoiceId,
                payType: vmInvoiceApply.payType
            },
            successCallback: function (json) {
                if (json.status === 1) {
                    vmInvoiceApply.payInfo = json.data;
                    if (vmInvoiceApply.payType == 1) {//支付宝支付
                        if (isweixin) {//如果是在微信里打开
                            location.href = 'alipay-iframe.html?payUrl=' + encodeURIComponent(json.data.payUrl);
                        } else {//在其它浏览器打开
                            location.href = json.data.payUrl;
                        }
                    } else if (vmInvoiceApply.payType == 2) {//微信支付
                        onBridgeReady();
                    }
                } else {
                    alert(json.message);
                }
            }
        });
    }
});

var vmAInfoBtn = avalon.define({
    $id: 'aInfoBtn',
    selectText: '确定',
    select: function () {
        vmInvoiceApply.saveDeliveryAddress();
    }
});
function load() {
    var invoiceApply = Storage.get('invoiceApply');
    if (!invoiceApply) {
        alert('请先选择要开发票的项！');
        location.href = 'invoice-list.html';
    }
    vmInvoiceApply.amount = invoiceApply.amount;
    vmInvoiceApply.oids = invoiceApply.oids;
}

/**
 * 准备微信支付
 */
function onBridgeReady() {
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', callWcpay, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', callWcpay);
            document.attachEvent('onWeixinJSBridgeReady', callWcpay);
        }
    } else {
        callWcpay();
    }
}
/**
 * 发起微信支付
 */
function callWcpay() {
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
        "appId": vmInvoiceApply.payInfo.appId,
        "timeStamp": vmInvoiceApply.payInfo.timeStamp,
        "nonceStr": vmInvoiceApply.payInfo.nonceStr,
        "package": vmInvoiceApply.payInfo.package,
        "signType": vmInvoiceApply.payInfo.signType,
        "paySign": vmInvoiceApply.payInfo.paySign
    }, function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
            alert("支付成功");
            location.href = 'payend.html';
        } else {
            if (res.err_msg == "get_brand_wcpay_request:fail") {
                alert("Ooops，出问题了，请重试");
            }
        }
    });
}

load();

vmInvoiceApply.getDeliveryAddress();
vmInvoiceApply.getInvoiceExpressFee();