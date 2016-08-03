/**
 * Created by lyh on 2016/8/2/002.
 */

var vmInvoicePaySuccess = avalon.define({
    $id: 'invoicePaySuccess',
    body: '',
    total_fee: '',
    payEnd: function () {
        top.location = 'invoice-list.html';
    },
    getValues: function () {
        vmInvoicePaySuccess.body = decodeURIComponent(getParam('body'));
        vmInvoicePaySuccess.total_fee = decodeURIComponent(getParam('total_fee'));
    }
});

vmInvoicePaySuccess.getValues();