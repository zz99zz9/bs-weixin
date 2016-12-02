var code = getParam('code');
if (!code) {
  location.href = document.referrer || "index.html";
}

//防止和my.js的未登录状态
setTimeout(function() {
    var user = Storage.getLocal("user");
    $.extend(user, {
      inviteCode: code
    });
    Storage.setLocal('user', user);
}, 500);

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