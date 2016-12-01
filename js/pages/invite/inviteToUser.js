var vmShare = avalon.define({
    $id: "share",
    inviter: { name: '' },
    userFundInviter: { money: 0 },
    userFundInvitee: { money: 0, useEndTime: '' },
    message: '',
    getData: function() {
        ajaxJsonp({
            url: urls.openRedPacket,
            data: {},
            successCallback: function(json) {
                if (json.status === 1) {
                    vmShare.inviter = json.data.inviter;
                    vmShare.userFundInviter = json.data.userFundInviter;
                    vmShare.userFundInvitee = json.data.userFundInvitee;
                } else {
                    vmShare.message = json.message;
                }
            }
        });
    }
})

vmShare.getData();  