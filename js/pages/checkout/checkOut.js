var vmCheckOut = avalon.define({
	$id:'checkOut',
	list:[
		{"name":'睡眠',typeList:[{"typeName":'入睡时间',"number":"11:30"},
			{"typeName":'深睡',"number":"4h"},{"typeName":'浅睡',"number":"3h"}],"suggest":'提前半小时入睡，睡前请勿做剧烈运动'},
		{"name":'心率',typeList:[{"typeName":'最低',"number":"58"},
			{"typeName":'平均心率',"number":"68"},{"typeName":'最高',"number":"120"}],"suggest":'属于正常范围，剧烈运动时间过长，请节制'},
		{"name":'呼吸',typeList:[{"typeName":'呼吸次数',"number":'8000'},
			{"typeName":'呼吸频率',"number":'15次/分钟'}],"suggest":'略低于平均值，请平常多注意肺部保护'}
	],
	remarks:'最好在11点前入睡，保证每天8小时的充足睡眠；睡前做简单的放松活动；尽量避免剧烈运动；在上海时刻注意肺部保护；建议多吃甘梨、橙子和鱼肉类食物。',
	nowDate: '',
    date: function (){
    	vmCheckOut.nowDate = getToday('month')+getToday('day')+'日';
    },
	alert: function () {
		mui.alert('欢迎下次再来哦','谢谢您的意见!','<span id="ss">3</span>')
		window.setInterval("vmCheckOut.run();", 1000)
	},
	run:function (){
		var s = document.getElementById("ss");
		 	if(s.innerHTML == 0){
		 		window.location.href='index2.html';
				return false;
			}
		s.innerHTML = s.innerHTML * 1 - 1;
	},
	goIndex2: function() {
        stopSwipeSkip.do(function() {
            location.href = "../index2.html";
        })
    },
    goRoom: function() {
        stopSwipeSkip.do(function() {
            location.href = "service/orderList.html";
        })
    },
    goOrder: function() {
        stopSwipeSkip.do(function() {
            location.href = "../newOrderList.html";
        })
    },
    goUser: function() {
        stopSwipeSkip.do(function() {
            location.href = "../user-info.html";
        })
    },
})
vmCheckOut.date();
