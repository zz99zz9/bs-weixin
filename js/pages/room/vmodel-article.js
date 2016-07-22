var newOrder = Storage.get("newOrder") || null;
if(newOrder) {
    var roomid = newOrder.room.rid;

    if(roomid) {
        if(isNaN(roomid)) {
            location.href = document.referrer || "index.html";
        } else {
            roomid = parseInt(roomid);
        }
    } else {
        location.href = "index.html";
    }
} else {
    location.href = "index.html";
}

var vmArticles = avalon.define({
    $id: 'articles',
    price: 0,
    priceList: [],//用来记录选择对象
    list: [],
    getPrice: function(price) {
        if (price==0)
            return '免费使用';
        else 
            return '¥' + price;
    },
    render: function() {
        //mui.init();

        (function($) {
            //阻尼系数
            var deceleration = mui.os.ios?0.003:0.0009;
            $('.mui-scroll-wrapper').scroll({
                bounce: true,
                deceleration:deceleration
            });
        })(mui);
    },
    selectList: [], //拼接字符串，用来计算是否选中
    pop: function(cid, gid, price, number, stock, imgUrl, thumbUrl, name, brief, cate, choosable, e) {
        e.stopPropagation();

        stopSwipeSkip.do(function() {
                var o = {
                    cid: cid,
                    gid: gid,
                    price: price,
                    number: number,
                    stock: stock,
                    imgUrl: urlAPINet + imgUrl,
                    thumbUrl: urlAPINet + thumbUrl,
                    name: name,
                    brief: brief,
                    cate: cate,
                    choosable: choosable
                }
                vmAInfo.goods = o;
                popover('', none);
            }
        );
    },
    goNext: function() {
        location.href = "pay.html";
    }
});

var vmAInfo = avalon.define({
    $id: 'aInfo',
    goods: {}
    // goods: {cid: 0, gid: 0, price: 0, number: 1, imgUrl:'', name:'', brief:'', cate:''}
});


var vmAInfoBtn = avalon.define({
    $id: 'aInfoBtn',
    selectText: '确定',
    select: function() {

        if(vmAInfo.goods.number >= 1) {

            //修改数量
            var o = vmArticles.$model.list;
            for(var i in o) {
                for(var j in o[i].categoryList) {
                    if(o[i].categoryList[j].id == vmAInfo.goods.cid) {
                        for(var k in o[i].categoryList[j].goodsList) {
                            if(o[i].categoryList[j].goodsList[k].id == vmAInfo.goods.gid)
                            o[i].categoryList[j].goodsList[k].number = vmAInfo.goods.number;
                        }
                    }
                }
            }

            vmArticles.list = o;

            for(var i in vmArticles.$model.selectList) {
                if(vmArticles.$model.selectList[i].indexOf(vmAInfo.goods.cid + "_") > -1){
                    vmArticles.selectList[i] = vmAInfo.goods.cid + "_" + vmAInfo.goods.gid;
                }
            }

            calPrice(vmAInfo.$model.goods);

            $('.popover').addClass('popover-hide');
            popover_ishide = true;
        }
    }
});

ajaxJsonp({
    url: urls.getRoomGoodsList,
    data: {rid: roomid},
    successCallback: function(json) {
        if(json.status === 1){
            for(var i in json.data) {
                for(var j in json.data[i].categoryList) {
                    for(var k in json.data[i].categoryList[j].goodsList) {
                        json.data[i].categoryList[j].goodsList[k].number = 1;
                    }
                }
            }

            vmArticles.list = json.data;

            if(newOrder.goods && newOrder.goods.length == 0) {
                //默认选中第一个，并计算价格
                json.data.map(function(firstLevel) {
                    firstLevel.categoryList.map(function(secondLevel) {
                        if(secondLevel.goodsList.length > 0) {
                            vmArticles.selectList.push(secondLevel.goodsList[0].cid + "_" + secondLevel.goodsList[0].id);
                            
                            vmArticles.priceList.push({
                                cid: secondLevel.goodsList[0].cid,
                                gid: secondLevel.goodsList[0].id,
                                price: secondLevel.goodsList[0].price,
                                number: 1,
                                name: secondLevel.goodsList[0].name,
                                cate: secondLevel.name,
                                imgUrl: urlAPINet + secondLevel.goodsList[0].imgUrl,
                                thumbUrl: urlAPINet + secondLevel.goodsList[0].thumbUrl
                            });

                            vmArticles.price += secondLevel.goodsList[0].price;
                        }
                    });
                });

                newOrder.goods = vmArticles.$model.priceList;

                Storage.set("newOrder", newOrder);
            } else {
                //绑定本地数据
                var o = vmArticles.$model.list;

                newOrder.goods.map(function(g) {
                    vmArticles.selectList.push(g.cid + "_" + g.gid);
                    
                    vmArticles.price += g.price * g.number;

                    //修改数量
                    for(var i in o) {
                        for(var j in o[i].categoryList) {
                            if(o[i].categoryList[j].id == g.cid) {
                                for(var k in o[i].categoryList[j].goodsList) {
                                    if(o[i].categoryList[j].goodsList[k].id == g.gid)
                                    o[i].categoryList[j].goodsList[k].number = g.number;
                                }
                            }
                        }
                    }
                })
                vmArticles.list = o;

                vmArticles.priceList = newOrder.goods;
            }
        }
    }
});

document.title = '本酒店｜房间用品';

//更新选择对象列表并重新计算总价格
function calPrice(o) {
    vmArticles.price = 0;

    for(var i in vmArticles.$model.priceList) {
        if(vmArticles.$model.priceList[i].cid == o.cid) {
            vmArticles.priceList[i].gid = o.gid;
            vmArticles.priceList[i].price = o.price;
            vmArticles.priceList[i].number = o.number;
            vmArticles.priceList[i].imgUrl = o.imgUrl;
            vmArticles.priceList[i].thumbUrl = o.thumbUrl;
            vmArticles.priceList[i].name = o.name;
            vmArticles.priceList[i].cate = o.cate;
        }

        vmArticles.price += vmArticles.priceList[i].price * vmArticles.priceList[i].number;
    }

    newOrder.goods = vmArticles.$model.priceList;
    Storage.set("newOrder", newOrder);
}

