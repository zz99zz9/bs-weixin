/**
 * Created by lyh on 2016/8/2/002.
 */

var vmInvoicePaySuccess = avalon.define({
    $id: 'invoicePaySuccess',
    payEnd: function () {
        top.location = 'invoice-list.html';
    }
});