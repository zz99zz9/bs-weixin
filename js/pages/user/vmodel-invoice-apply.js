/**
 * Created by lyh on 2016/7/29/029.
 */

var vmInvoiceApply = avalon.define({
    $id: 'invoiceApply',
    amount: 0,
    oids: [],
    invoiceType: 1,
    payType: 2,
    name: '',
    mobile: '',
    fullAddress: '',
    openDeliveryAddress: function () {
        popover('delivery-address-add.html', 1);
    },
    saveDeliveryAddress: function () {
        if (vmInvoiceApply.name == "") {
            alert("收货人姓名不能为空");
            return false;
        }
        if (vmInvoiceApply.mobile == "") {
            alert("手机号不能为空");
            return false;
        }
        if (vmInvoiceApply.fullAddress == "") {
            alert("收货地址不能为空");
            return false;
        }
        if (vmInvoiceApply.name.length > 50) {
            alert("名字不能大于50个字");
            return false;
        }
        if (vmInvoiceApply.mobile.length < 11) {
            alert("手机号不能小于11位");
            return false;
        }
        if (vmInvoiceApply.mobile.length > 11) {
            alert("手机号不能大于11位");
            return false;
        }
        if (vmInvoiceApply.fullAddress.length > 255) {
            alert("名字不能大于255个字");
            return false;
        }

        ajaxJsonp({
            url: urls.saveDeliveryAddress,
            data: {
                mobile: vmInvoiceApply.mobile,
                name: vmInvoiceApply.name,
                fullName: vmInvoiceApply.fullName
            },
            successCallback: function (json) {
                if (json.status !== 1) {
                    alert(json.message);
                    return;
                } else {
                    $('#pop-text').empty();
                    $('.popover').addClass('popover-hide');
                    popover_ishide = true;
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

load();