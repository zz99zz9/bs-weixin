var ishide = false, 
    isManageMode = false, 
    localpath = location.pathname;

//判断是否为管理模式
isManageMode = localpath.indexOf('manage') > 0 ? true : false;

$(function() {
    if (!isios && isweixin) {
        // $('#popModule').css('-webkit-transition-duration', '0');
    }
    $('#menu').on('tap', function(event) {
        event.preventDefault();
        vmSide.show();
    });
    $('#popModule').on('webkitTransitionEnd', function() {
        if (ishide) {
            $('#popModule').hide();
        }
    })
    $('#closebtn').on('click', function() {
        $('#popModule').addClass('hide');
        ishide = true;
    })
});

var vmSide = avalon.define({
    $id: 'aside',
    headImg: defaultHeadImg,
    name: '',
    nickName: '',
    isVip: 0,
    isAdmin: 0,
    isAlliance: 0,
    isManage: isManageMode,
    cardList: [
        {
            id: 0,
            img: '../img/card/card_null.svg'
        },{
            id: 0,
            img: '../img/card/card_null.svg'
        },
    ],
    goCard: function(id, index) {
        stopSwipeSkip.do(function() {
            if(id > 0) {
                location.href = "card-show.html?id=" + id;
            } else {
                Storage.set('cardData', {cardIndex: index});
                location.href = "card-list.html";
            }
        });
    },
    show: function() {
        vmSide.getUserInfo();
        ishide = false;
        $('#popModule').show();
        setTimeout("$('#popModule').removeClass('hide')", 10);
        //$('#popModule').removeClass('hide');
        var user = {
            openUserInfo: 0
        };
        Storage.setLocal('user', user);
    },
    getUserInfo: function() {
        var userInfo = Storage.getLocal('user') || {};
		var token = userInfo.accessToken || '';
		var openid = userInfo.openId || '';

		$.ajax({
			type: "get",
			async: true,
			url: urls.userInfotUrl + "?accessToken=" + token + "&openId=" + openid,
			dataType: "jsonp",
			jsonp: "jsonpcallback",
			success: function(json) {
				if (json.status === -1) {
					vmSide.nickName = ' 未登录 ';
				} else {
					if (json.data.headUrl === '') {
						vmSide.headImg = defaultHeadImg;
					} else {
						vmSide.headImg = urlAPINet + json.data.headUrl;
					}

                    if(location.pathname.indexOf('index')>=0) {
                        vmHotel.headImg = vmSide.headImg;
                    }

					vmSide.nickName = json.data.nickname;
					vmSide.isAdmin = json.data.isAdmin;
                    vmSide.isAlliance = json.data.isAlliance;

                    if(json.data.userBuyCardList && json.data.userBuyCardList.length) {
                        var cList = json.data.userBuyCardList;
                        for(var i = 0; i< cList.length; i++) {
                            vmSide.cardList[i].id = cList[i].id;
                            vmSide.cardList[i].img = '../img/card/card_No' + cList[i].type + '.svg';
                        }
                    }

					var user = {
						uid: json.data.id,
						mobile: json.data.mobile,
						openId: json.data.openId,
						name: json.data.name,
						nickname: json.data.nickname,
						headImg: json.data.headUrl,
						logState: 1,
						idUrl: json.data.idUrl,
						idNo: json.data.idNo,
						authStatus: json.data.authStatus,
						invoiceMoney: json.data.invoiceMoney,
                        isVip: json.data.isVip,
						isAdmin: json.data.isAdmin,
                        isAlliance: json.data.isAlliance,
						accessToken: json.data.accessToken
					};
					Storage.setLocal('user', user);
				}
			},
			error: function(XMLHttpRequest, type, errorThrown) {
				console.log(XMLHttpRequest.responseText + "\n" + type + "\n" + errorThrown);
			}
		});
    },
    changeImg: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.userInfotUrl,
                data: {},
                successCallback: function(json) {
                    if (json.status == 1) { //已登录
                        location.href = 'avatar.html';
                        //通过config接口注入权限验证配置
                        // ajaxJsonp({
                        //     url: urls.weiXinConfig,
                        //     data: {
                        //         url: window.location.href
                        //     },
                        //     successCallback: function(json) {
                        //         if (json.status === 1) {
                        //             wx.config({
                        //                 debug: false,
                        //                 appId: json.data.appId,
                        //                 timestamp: json.data.timestamp,
                        //                 nonceStr: json.data.nonceStr,
                        //                 signature: json.data.signature,
                        //                 jsApiList: ['chooseImage','uploadImage']
                        //             });

                        //             wx.ready(function() {
                        //                 wx.chooseImage({
                        //                     count: 1, // 默认9
                        //                     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        //                     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        //                     success: function(res) {
                        //                         wx.uploadImage({
                        //                             localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                        //                             isShowProgressTips: 1, // 默认为1，显示进度提示
                        //                             success: function(res1) {
                        //                                 //alert(res1.serverId);
                        //                                 savePic(res1.serverId);
                        //                                 // console.log(res1.serverId);
                        //                             }
                        //                         });
                        //                     }
                        //                 });
                        //             })
                        //         }
                        //     }
                        // });
                    }
                }
            });
        });
    },
    clickA: function(i) {
        stopSwipeSkip.do(function() {
            switch (i) {
                case 1:
                    location.href = "../user-info.html";
                    break;
                case 2:
                    location.href = "../orderList.html";
                    break;
                case 3:
                    location.href = "../service.html";
                    break;
                case 4:
                    // location.href = "../wallet.html";
                    goPromotion(); //config.js
                    break;
                case 5:
                    location.href = "../manage/homepage.html";
                    break;
                case 6:
                    location.href = "../index.html";
                    break;
                case 7:
                    location.href = "../manage/homepage.html";
                    break;
                case 8:
                    location.href = "../franchisee.html";
                    break;
                case 9:
                    location.href = "../card-detail.html";
                    break;
            }
        });
    }
});

function savePic(serverId) {
    ajaxJsonp({
        url: urls.saveUserInfo,
        data: {
            headUrl: serverId
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmSide.getUserInfo();
                alert(json.message);
            } else {
                alert(json.message);
            }
        }
    });
}

vmSide.getUserInfo();
