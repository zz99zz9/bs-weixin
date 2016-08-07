function getShareConfig(code) {
    ajaxJsonp({
        url: urls.weiXinConfig,
        data: {url:window.location.href},
        successCallback: function(json) {
            if(json.status === 1){
                wx.config({
                  debug: false,
                  appId: json.data.appId,
                  timestamp: json.data.timestamp,
                  nonceStr: json.data.nonceStr,
                  signature: json.data.signature,
                  jsApiList: [
                     'checkJsApi',
                     'onMenuShareTimeline',
                     'onMenuShareAppMessage',
                     'onMenuShareQQ',
                     'onMenuShareWeibo',
                     'onMenuShareQZone'
                  ]
              });
              wx.ready(function (){
                  wx.checkJsApi({
                     jsApiList: [
                     'onMenuShareTimeline',
                     'onMenuShareAppMessage',
                     'onMenuShareQQ'
                    ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                     success: function(res) {
                         // 以键值对的形式返回，可用的api值true，不可用为false
                         // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                     }
                 });
                 wx.onMenuShareTimeline({
                     title: '邀您来看INI的世界', // 分享标题
                     link:'', // 分享链接
                     imgUrl: '', // 分享图标
                     success: function () {
                         // 用户确认分享后执行的回调函数
                     },
                     cancel: function () {
                         console.log('取消分享到个人');
                         // 用户取消分享后执行的回调函数
                     }
                 });
                 wx.onMenuShareAppMessage({
                    title: '邀您来看INI的世界', // 分享标题
                    desc: '请记住您的邀请码，注册时填入', // 分享描述
                    link: '', // 分享链接
                    imgUrl: '', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        console.log("取消分享到朋友圈");
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareQQ({
                    title: '', // 分享标题
                    desc: '', // 分享描述
                    link: '', // 分享链接
                    imgUrl: '', // 分享图标
                    success: function () {
                       // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                       // 用户取消分享后执行的回调函数
                    }
                });
              });
            }
        }
    });
}

var vmInvite = avalon.define({
    $id:'invite',
    code:'',
    getInviteCode: function() {
        ajaxJsonp({
            url: urls.getInviteCode,
            data: {},
            successCallback: function(json) {
                if(json.status === 1){
                    vmInvite.code = json.data;
                    vmShare.initUrl();
                }
            }
        });
    },
    clickRule: function() {
        popover('./util/rule.html',1);
    },
    clickLog: function() {
        popover('./util/oldInvite.html',1);
    },
    clickShare: function() {
        getShareConfig(vmInvite.code);
        popover('./util/share.html',1);
        //jiathis_config.url = urlWeixin + "/register-1.html?code="+vmInvite.code;
    }
    // shareCode: function() {
    //     getShareConfig();
    // }
});
vmInvite.getInviteCode();
//过去的邀请
var vmOldInvite = avalon.define({
    $id:'oldInvite',
    list:[],
    count:0,
    getInfo: function(){
        ajaxJsonp({
            url: urls.getInvitationLogURL,
            data: {},
            successCallback: function(json) {
                if(json.status === 1)
                {
                    vmOldInvite.list = json.data.list;
                    vmOldInvite.count = json.data.count;
                }
            }
        });
    }
});
vmOldInvite.getInfo();
//jiaThis分享链接绑定
var vmShare = avalon.define({
    $id:'share',
    renrenUrl:'',
    txweiboUrl:'',
    sinaUrl:'',
    qzoneUrl:'',
    initUrl:function(){
        vmShare.renrenUrl = 'http://www.jiathis.com/send/?webid=renren&url=http://weixin.ini.xin/index.html'+vmInvite.code+'&title=本酒店,不将就';
        vmShare.sinaUrl = 'http://www.jiathis.com/send/?webid=tsina&url=http://weixin.ini.xin/index.html'+vmInvite.code+'&title=本酒店,不将就';
        vmShare.txweiboUrl = 'http://www.jiathis.com/send/?webid=tqq&url=http://weixin.ini.xin/index.html'+vmInvite.code+'&title=本酒店,不将就';
        vmShare.qzoneUrl = 'http://www.jiathis.com/send/?webid=qzone&url=http://weixin.ini.xin/register-1.html?code='+vmInvite.code+'&title=本酒店,不将就';
    }

});

//弹出框的确定按钮
vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //打开的窗口类型
    useCheck: 0, //1 checkButton, 0 closeButton
    ok: function() {
        
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})