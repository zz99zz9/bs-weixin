/*
 * 域名路径放到 domainName.js
 */
var urls = {
    //登录注册
    loginURL: urlAPI + '/usr/user/login',
    getCodeURL: urlAPI + '/usr/sms/register',
    getRegisterLogURL: urlAPI + '/usr/user/exists',
    userInfotUrl: urlAPI + '/usr/user/info',
    weiXinConfig: urlAPI + '/wx/wechat/config',
    saveUserInfo: urlAPI + '/usr/user/save',
    saveInvoiceLog: urlAPI + '/usr/invoiceLog/save',
    getInviteCode: urlAPI + '/usr/user/invitationCode',
    getHomeBannerList: urlAPI + '/sys/homeBanner/list',
    getRedPacketUrl: urlAPI + '/wx/wechat/getRedPacketUrl',//获取基金分享地址
    openRedPacket: urlAPI + '/wx/redPacket/open', //打开邀请基金

    //授权微信获取信息
    authWeixin: urlAPI + '/usr/user/authWeixin',
    //首页
    getCityGallery: urlAPI + '/res/cityImage/list', //城市图片列表
    getHotelByPosition: urlAPI + '/res/hotel/aroundList', //查找周边酒店列表
    getRecentViewLog: urlAPI + '/usr/viewLog/roomList', //最近浏览
    getFilter: urlAPI + '/res/searchCriteriaAmenity/list', //筛选条件

    getINIrecommendURL: urlAPI + '/res/room/recommendList',
    getHotelInfoList: urlAPI + '/res/hotel/localList', //根据地区获取酒店信息列表
    getUserFundURL: urlAPI + '/usr/userFund/list', //用户基金列表
    getInvitationLogURL: urlAPI + '/usr/invitationLog/list', //用户邀请列表
    //酒店
    getHotelDetail: urlAPI + '/res/hotel/detail',//酒店详细信息
    getHotelFilter: urlAPI + '/res/hotelAmenity/searchCriteria', //酒店的筛选条件
    //联系人
    getContactList: urlAPI + '/usr/frequentContact/list', //常用联系人列表
    getContact: urlAPI + '/usr/frequentContact/get', //获取常用联系人信息
    saveContact: urlAPI + '/usr/frequentContact/save', //常用联系人增加、修改
    deleteContact: urlAPI + '/usr/frequentContact/delete', //常用联系人删除
    setDefaultContact: urlAPI + '/usr/frequentContact/updateById', //设置默认入住人
    //发票管理
    getInvoiceList: urlAPI + '/trd/orderInfo/invoiceList', //可以开发票的订单列表
    saveInvoice: urlAPI + '/usr/invoiceLog/save', //申请发票
    payInvoice: urlAPI + '/trd/pay/invoiceExpressFeePay/cashier', //支付发票快递费用
    //收货地址
    saveDeliveryAddress: urlAPI + '/usr/deliveryAddress/save', //收货地址增加、修改getInvoiceExpressFee
    getDeliveryAddress: urlAPI + '/usr/deliveryAddress/get', //获取收货地址
    getInvoiceExpressFee: urlAPI + '/usr/invoiceLog/invoiceExpressFee', //获取发票快递费用
    //房间相关
    getRoomTypeList: urlAPI + '/res/roomType/list', //房间类型列表
    getRoomList: urlAPI + '/res/room/list', //房间列表
    getRoomDetail: urlAPI + '/res/room/detail', //房间详情
    getRoomAssess: urlAPI + '/trd/orderComment/list', //房间评价列表
    getRoomGoodsList: urlAPI + '/res/goods/roomGoods', //房间物品列表
    getFundAvailable: urlAPI + '/usr/userFund/availableList', //可用基金列表
    getRoomBookDate: urlAPI + '/res/roomStatus/busy', //查询房间已预订日期
    getRoomStatus: urlAPI + '/res/roomStatus/get', //查询房间当天所有时间段预订状态
    getRoomPartTimePrice: urlAPI + '/res/partTimePrice/list', //房间时租房价格列表
    getRoomPartTimeRange: urlAPI + '/res/partTimePrice/range', //房间时租房时间范围
    getRoomNightDiscount: urlAPI + '/res/nightDiscount/list', //查询房间夜房优惠价格
    getNightDiscount: urlAPI + '/res/nightDiscount/times', //查询搜索时，要显示的夜房优惠价格列表
    //设计师相关
    getDesigner: urlAPI + '/usr/designer/get', //设计师详情
    //订单相关
    getOrderList: urlAPI + '/trd/orderInfo/list', //订单列表
    getOrderDetail: urlAPI + '/trd/orderInfo/detail', //订单详情
    submitOrder: urlAPI + '/trd/orderInfo/submit', //提交订单
    cancelOrder: urlAPI + '/trd/orderInfo/cancel', //取消订单
    saveSub: urlAPI + '/trd/orderComment/save', //用户提交评论
    payOrder: urlAPI + '/trd/pay/orderInfoPay/cashier', //支付订单
    unsubscribeOrder: urlAPI + '/trd/refund/orderInfoRefund/refund', //退订订单
    checkout: urlAPI + '/trd/orderInfo/checkOut', //退房
    
    //客控
    inStoreGoods: urlAPI + '/svr/inStoreGoods/list',//店内商品列表
    hotelService: urlAPI + '/svr/hotelService/list',//店内服务列表
    socialService: urlAPI + '/svr/socialServiceCategory/list',//社会化服务列表
    socialList: urlAPI + '/svr/hotelSocialStore/list',//社会化商铺列表

    //管理
    //欢迎页
    getManager: urlAPI + '/mgr/hotelManagerNote/getByHid',//店长寄语
    regionList: urlAPI + '/sys/area/getMyList',//用户拥有的区域列表
    hotelList: urlAPI + '/mgr/hotelManage/myHotelList',//用户拥有的酒店列表
    menuList: urlAPI + '/usr/menu/list',//用户拥有的菜单列表

    //房间管理
    roomList: urlAPI + '/mgr/hotelManage/roomList',//客房管理列表
    occupancyRate: urlAPI + '/mgr/reportManage/hotelOccupancyRate',//酒店入住率
    roomDetail: urlAPI + '/mgr/hotelManage/roomDetail',//酒店客房状态详情
    roomRepairLogSave: urlAPI + '/mgr/roomRepairLog/save',//添加维修
    disableRoom: urlAPI + '/mgr/hotelManage/disableRoom',//停用房间
    confirmRepair: urlAPI + '/mgr/hotelManage/confirmRepair',//确认维修
    roomRepairLog: urlAPI + '/mgr/roomRepairLog/detail',//维修详情

    //耗材
    articleList: urlAPI + '/mgr/materialManage/findListConsumables',//日用品列表
    articleGoods: urlAPI + '/mgr/materialManage/goodsByGid',//日用品商品信息
    articleDetail: urlAPI + '/mgr/materialManage/storageDetails',//日用品明细
    articleModify: urlAPI + '/mgr/materialManage/insertStock',//日用品修改
    beddingList: urlAPI + '/mgr/materialManage/bedLiningsList',//床上用品列表
    beddingGoods: urlAPI + '/mgr/materialManage/bedLiningsDetail',//床上用品商品信息
    beddingDetail: urlAPI + '/mgr/materialManage/findListbedLiningsDetailLog',//床上用品明细
    beddingModify: urlAPI + '/mgr/materialManage/updateBedLinings',//床上用品修改
    assetList: urlAPI + '/mgr/materialManage/damagedOutlay',//固定资产列表
    assetGoods: urlAPI + '/mgr/materialManage/byHidCidBedLinings',//固定资产信息
    assetDetail: urlAPI + '/mgr/materialManage/findListDamagedOutlay',//固定资产明细

    //人员管理
    employeeList: urlAPI + '/mgr/employee/list',//人员列表
    employeeDetail: urlAPI + '/mgr/employee/detail',//人员详情
    employeeCheckList: urlAPI + '/mgr/employeeCheckingIn/list',//人员当月考勤列表
    employeeCheckSave: urlAPI + '/mgr/employeeCheckingIn/save',//人员添加考勤
    employeeEvaluateList: urlAPI + '/mgr/employeeEvaluate/list',//员工评价列表
    employeeFired: urlAPI + '/mgr/employee/dimission',//员工离职
    employeeEvaluateSave: urlAPI + '/mgr/employeeEvaluate/save',//添加评价
    employeeSave: urlAPI + '/mgr/employee/save',//添加员工
    scheduleList: urlAPI + '/mgr/scheduleTime/list',//排版时间段表
    employeeScheduleList: urlAPI + '/mgr/employeeSchedule/list',//员工排班时间表
    employeeScheduleSave: urlAPI + '/mgr/employeeSchedule/save',//当天排班人员添加修改
    employeeScheduleDay: urlAPI + '/mgr/employeeSchedule/day',//当天排班详情
    dictList: urlAPI + '/sys/dict/list',//字典列表

    //财务
    income: urlAPI + '/mgr/financeManage/income', //收入统计
    outlay: urlAPI + '/mgr/financeManage/outlay', //支出统计
    invoiceManage: urlAPI + '/mgr/invoiceManage/flist', //发票管理
    invoiceDetail: urlAPI + '/mgr/invoiceManage/detail', //发票详情
    invoiceSend: urlAPI + '/mgr/invoiceManage/send', //寄出发票
    fRoomIncome: urlAPI + '/trd/orderInfo/fRoomIncome', //房间收入列表
    fGoodsIncome: urlAPI + '/trd/orderInfo/fGoodsIncome', //非房收入列表
    commodityOut: urlAPI + '/mgr/commodityOutlay/flist', //日用品或能耗或设备支出列表
    damagedOut: urlAPI + '/mgr/damagedOutlay/flist', //物品损坏支出列表
    salaryOut: urlAPI + '/mgr/salaryInfoOutlay/flist', //人员工资支出列表
    taxOut: urlAPI + '/mgr/taxOutlay/flist', //税务支出支出列表
    otherOut: urlAPI + '/mgr/otherOutlay/flist', //其它支出支出列表
    outLog: urlAPI + '/mgr/outlayLog/list', //支出修改明细列表
    commodityList: urlAPI +'/res/commodity/slist',//日用品项列表
    commoditySave: urlAPI +'/mgr/commodityOutlay/save',//日用品等修改添加
    commodityDetail: urlAPI + '/mgr/commodityOutlay/detail',//日用品等详情接口
    damagedOutDetail: urlAPI + '/mgr/damagedOutlay/detail',//物品损坏详情
    damagedOutSave: urlAPI + '/mgr/damagedOutlay/save',//物品损坏添加
    taxOutDetail: urlAPI + '/mgr/taxOutlay/detail',//税务支出详情
    taxOutSave : urlAPI + '/mgr/taxOutlay/save',//税务支出添加
    otherOutDetail: urlAPI + '/mgr/otherOutlay/detail',//其他支出详情
    otherOutSave: urlAPI + '/mgr/otherOutlay/save',//其他支出添加
    salaryOutDetail: urlAPI + '/mgr/salaryInfoOutlay/detail',//人员工资详情
    salaryOutSave: urlAPI + '/mgr/salaryInfoOutlay/save',//人员工资添加

    //仓库
    supplierList: urlAPI + '/mgr/supplier/slist',//供应商列表
    commodityStockList: urlAPI +'/mgr/stockInNote/commodityList',//仓库商品列表
    warehouseList: urlAPI + '/mgr/warehouse/slist',//仓库列表
    warehouseInList: urlAPI + '/mgr/stockInNote/list',//入库单列表
    warehouseInDetail: urlAPI + '/mgr/stockInNote/detail',//入库单详情
    warehouseInSave: urlAPI + '/mgr/stockInNote/save',//入库单添加
    warehouseWayList: urlAPI + '/mgr/warehousePutWay/slist',//出入库方式列表
    warehouseOutList: urlAPI + '/mgr/stockOutNote/list',//出库单列表
    warehouseOutDetail: urlAPI + '/mgr/stockOutNote/detail',//出库单详情
    warehouseOutSave: urlAPI + '/mgr/stockOutNote/save',//出库单添加
    warehouseAllocateList: urlAPI + '/mgr/stockAllotNote/list',//调拨单列表
    warehouseAllocateDetail: urlAPI + '/mgr/stockAllotNote/detail',//调拨单详情
    warehouseAllocateSave: urlAPI + '/mgr/stockAllotNote/save',//调拨单添加
    warehouseStockList: urlAPI + '/mgr/materialManage/findListstockTaking',//库存盘点列表
    warehouseStockDetail: urlAPI + '/mgr/materialManage/findListByIdStockTaking',//库存盘点详情
    warehouseStockAdd: urlAPI + '/mgr/materialManage/byHidCidStock',//库存盘点添加详细
    warehouseStockSave: urlAPI + '/mgr/materialManage/stockTalingInsert',//库存盘点添加

    //统计报表
    reportIn: urlAPI + '/mgr/reportManage/income',//收入统计
    reportOut: urlAPI + '/mgr/reportManage/outlay',//支出统计

    //加盟商
    saleRangeStatistics: urlAPI + '/trd/roomIncomeDaily/saleRangeStatistics', //销售数据统计
    commissionRangeStatistics: urlAPI + '/acc/hotelCommissionLog/commissionRangeStatistics', //分佣数据统计
    fraMonthlyList: urlAPI + '/acc/hotelCommissionLog/monthlyList', //每月分佣数据列表
    fraAccount: urlAPI + '/acc/allianceBusinessAccount/account', //加盟商账户数据
    fraSaleDailyList: urlAPI + '/trd/roomIncomeDaily/saleDailyList', //每日销售数据列表
    fraSaleMonthlyList: urlAPI + '/trd/roomIncomeDaily/saleMonthlyList', //每月销售数据列表
    fraLogList: urlAPI + '/acc/hotelCapitalLog/list', //操作记录
    fraSms: urlAPI + '/usr/sms/applyCash', //申请提现验证码
    fraCash: urlAPI + '/acc/applyCash/apply', //申请提现

    //会员卡
    getDicCardList: urlAPI + '/vip/membershipCard/list', //获取会员卡字典数据
    getCardList: urlAPI + '/vip/userBuyCard/list', //已经购买的会员卡列表
    getDicCardDetail: urlAPI + '/vip/membershipCard/detail', //会员卡详情字典数据
    getCardDetail: urlAPI + '/vip/userBuyCard/detail', //已经购买的会员卡详情
    submitCardOrder: urlAPI + '/vip/userBuyCardOrderInfo/submit', //购买会员卡下单
    payCardOrder: urlAPI + '/vip/pay/userBuyCardOrderInfoPay/cashier', //会员卡订单支付
    getCardAccountList: urlAPI + '/vip/userCardAccount/list', //钱包会员卡列表
    getDefaultCashAccount: urlAPI + '/vip/userCardAccountApplyCashAccount/defaultAccount', //获取默认提现帐号
    bindCashAccountSMS: urlAPI + '/usr/sms/bindApplyCashAcccount', //绑定提现帐号验证码
    bindCashAccount: urlAPI + '/vip/userCardAccountApplyCashAccount/bind', //绑定提现帐号
    withdrawCash: urlAPI + '/vip/userCardAccountApplyCashLog/apply', //申请提现
    getAccountLogList: urlAPI + '/vip/userCardAccountOperateLog/list', //账户资金记录
    applyPromotion: urlAPI + '/vip/marketApplyLog/apply', //申请加入推广套餐
    promotionList: urlAPI + '/vip/userCardMarketPackage/list', //用户的推广套餐列表
    goPromotion: urlAPI + '/vip/userCardMarketPackage/apply', //开通推广套餐
    promoteTaskList: urlAPI + '/vip/userCardMarketPackageTask/currentMonth', //当前任务列表
    submitPromoteTaskList: urlAPI + '/vip/userCardMarketPackageTask/submit', //提交任务
    getAccountList: urlAPI + '/vip/userCardAccount/accountList', //会员卡账户列表
    getDiscountList: urlAPI + '/vip/userBuyCard/discountList', //会员卡折扣列表
}