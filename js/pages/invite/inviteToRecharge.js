var code = getParam('code');
// if (!code) {
//     location.href = document.referrer || "index.html";
// }

setTimeout(function() {
  //邀请码储存到本地
  var user = Storage.getLocal("user");
  $.extend(user, {
      inviteCode: code
  });
  Storage.setLocal('user', user);
}, 500);

// $(function() {
//   setTimeout(function() {
//     $('.planeStatic').show();
//     $('.planeBox').hide();
//   }, 4500);
// });

var vmInviteToRecharge = avalon.define({
    $id: 'rechargeFriend',
    data: { headImg: '' },
    getData: function() {
        ajaxJsonp({
            url: urls.getInviterByCode,
            data: { invitationCode: code },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmInviteToRecharge.data = json.data;
                } else {
                    mui.alert(json.data.message);
                }
            }
        });
    },
    goRecharge: function() {
        ajaxJsonp({
            url: urls.goWeixin,
            data: { url: urlWeixin + "/tokensRecharge.html" },
            successCallback: function(json) {
                if (json.status === 1) {
                    location.href = json.data;
                } else {
                    mui.alert(json.data.message);
                }
            }
        });
    }
});

// vmInviteToRecharge.getData();
