var hid = controlCore.getHotel().hid;
var id = getParam("id");

if(id != "") {
    if(isNaN(id)) {
        location.href = document.referrer || "invoice.html";
    } else {
        id = parseInt(id);
    }
} else {
    location.href = "invoice.html";
}

var vmInvoice = avalon.define({
    $id: "detail",
    data: {},
    invoiceId: '',
    isSended: false,
    isDisabled: true,
    changed: function(a) {
        //符合一定规则再让按钮可以点击
        if(a != '') {
            vmInvoice.isDisabled = false;
        } else {
            vmInvoice.isDisabled = true;
        }
    },
    send: function() {
        vmInvoice.isDisabled = true;

        if(vmInvoice.invoiceId.length < 10 || vmInvoice.invoiceId.length > 12 ) {
            alert("请填写正确的发票代码");
            return;
        }

        /*to do: 对接修改发票状态接口*/
        if(confirm('确认修改寄出吗？')){
            ajaxJsonp({
                url: urls.invoiceSend,
                data: {id: id, code: vmInvoice.invoiceId},
                successCallback: function(json) {
                    if (json.status === 1) {
                        vmInvoice.data.code = vmInvoice.invoiceId;
                        vmInvoice.data.status = 2;
                        vmInvoice.isSended = 2;
                    } else {
                        // location.href = document.referrer || "index.html";
                    }
                }
            });
            
        } else {
            vmInvoice.isDisabled = false;
        }
    }
})

ajaxJsonp({
    url: urls.invoiceDetail,
    data: {id: id},
    successCallback: function(json) {
        if (json.status === 1) {
            vmInvoice.data = json.data;
            //开票状态：1-待寄出；2-已寄出
            vmInvoice.isSended = json.data.status == 2;
        } else {
            // location.href = document.referrer || "index.html";
        }
    }
});
