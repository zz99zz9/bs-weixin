/**
 * Created by lyh on 2016/7/29/029.
 */

var vmInvoiceApply = avalon.define({
    $id: 'invoiceApply',
    amount: 0,
    oids: [],
    invoiceType: 1,
    payType: 2,
    title: '',
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
    openDeliveryAddress: function () {
        vmInvoiceApply.editDeliveryAddress.name = vmInvoiceApply.defaultDeliveryAddress.name;
        vmInvoiceApply.editDeliveryAddress.mobile = vmInvoiceApply.defaultDeliveryAddress.mobile;
        vmInvoiceApply.editDeliveryAddress.fullAddress = vmInvoiceApply.defaultDeliveryAddress.fullAddress;
        popover('delivery-address-add.html', 1);
    },
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

vmInvoiceApply.getDeliveryAddress();
vmInvoiceApply.getInvoiceExpressFee();