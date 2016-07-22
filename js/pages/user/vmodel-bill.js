var vmBill = avalon.define({
    $id:'bill',
    invoiceMoney:0,
    amount:0,
    company:'',
    cate:'',
    address:'',
    receiver:'',
    phone:'',
    getInfo: function() {
        vmBill.name = Storage.getLocal('user').name;
        vmBill.invoiceMoney = Storage.getLocal('user').invoiceMoney;
    },
    confirm: function() {
        ajaxJsonp({
            url: urls.saveInvoiceLog,
            data: {
                money: vmBill.amount,
                head: vmBill.company,
                subject: vmBill.cate,
                address: vmBill.address,
                receiver: vmBill.receiver,
                phone: vmBill.phone
            },
            successCallback: function(json) {
                if(json.status !== 1){
                    alert(json.data.message);
                }
            }
        });
    }
})
vmBill.getInfo();
