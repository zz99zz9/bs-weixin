/*
 * 域名路径放到 domainName.js
 */
var urls = {
    //登录注册
    getServerTime: urlAPI + '/web/sys/info', //获取系统信息
    loginURL: urlAPI + '/web/usr/user/login',
    logOut: urlAPI + '/web/usr/user/logout',
    getCodeURL: urlAPI + '/web/usr/sms/register',
    getRegisterLogURL: urlAPI + '/web/usr/user/exists',
    userInfotUrl: urlAPI + '/web/usr/user/info',
    weiXinConfig: urlAPI + '/web/wx/wechat/config',
    saveUserInfo: urlAPI + '/web/usr/user/save',
    saveInvoiceLog: urlAPI + '/web/usr/invoiceLog/save',
    getInviteCode: urlAPI + '/web/usr/user/invitationCode',
    getHomeBannerList: urlAPI + '/web/sys/homeBanner/list',
    getRedPacketUrl: urlAPI + '/web/wx/wechat/getRedPacketUrl',//获取基金分享地址
    openRedPacket: urlAPI + '/web/wx/redPacket/open', //打开邀请基金

    //授权微信获取信息
    authWeixin: urlAPI + '/web/usr/user/authWeixin',
    goWeixin: urlAPI + '/web/wx/wechat/getMenuUrl', //通过微信授权页面跳转到公众号指定页面

    //首页
    getCityGallery: urlAPI + '/web/res/cityImage/list', //城市图片列表
    getCityImgList: urlAPI + '/ordercenter/res/cityImage/cityList', //订单系统的城市图片列表
    getHotelByPosition: urlAPI + '/ordercenter/res/hotel/aroundList', //查找指定位置周边酒店列表
    getHotelByCity: urlAPI + '/ordercenter/res/hotel/localList', //查找指定城市酒店列表

    getRecentViewLog: urlAPI + '/web/usr/viewLog/roomList', //最近浏览
    getFilter: urlAPI + '/web/res/searchCriteriaAmenity/list', //筛选条件
    getRecommendHotelList: urlAPI + '/ordercenter/res/hotel/recommendList', //获取热门酒店
    
    getINIrecommendURL: urlAPI + '/web/res/room/recommendList',
    getHotelInfoList: urlAPI + '/web/res/hotel/localList', //根据地区获取酒店信息列表
    getUserFundURL: urlAPI + '/web/usr/userFund/list', //用户基金列表
    getInvitationLogURL: urlAPI + '/web/usr/invitationLog/list', //用户邀请列表
    //酒店
    getHotelDetail: urlAPI + '/web/res/hotel/detail',//酒店详细信息
    getHotelFilter: urlAPI + '/web/res/hotelAmenity/searchCriteria', //酒店的筛选条件
    //联系人
    getContactList: urlAPI + '/web/usr/frequentContact/list', //常用联系人列表
    getContact: urlAPI + '/web/usr/frequentContact/get', //获取常用联系人信息
    saveContact: urlAPI + '/web/usr/frequentContact/save', //常用联系人增加、修改
    deleteContact: urlAPI + '/web/usr/frequentContact/delete', //常用联系人删除
    setDefaultContact: urlAPI + '/web/usr/frequentContact/updateById', //设置默认入住人
    //发票管理
    getInvoiceList: urlAPI + '/web/trd/orderInfo/invoiceList', //可以开发票的订单列表
    saveInvoice: urlAPI + '/web/usr/invoiceLog/save', //申请发票
    payInvoice: urlAPI + '/web/trd/pay/invoiceExpressFeePay/cashier', //支付发票快递费用
    //收货地址
    saveDeliveryAddress: urlAPI + '/web/usr/deliveryAddress/save', //收货地址增加、修改getInvoiceExpressFee
    getDeliveryAddress: urlAPI + '/web/usr/deliveryAddress/get', //获取收货地址
    getInvoiceExpressFee: urlAPI + '/web/usr/invoiceLog/invoiceExpressFee', //获取发票快递费用
    //房间相关
    getRoomTypeList: urlAPI + '/ordercenter/res/roomType/list', //房间类型列表
    getRoomTypeDetail: urlAPI + '/ordercenter/res/roomType/detail', //房间类型详情
    getRoomList: urlAPI + '/web/res/room/list', //房间列表
    getRoomDetail: urlAPI + '/web/res/room/detail', //房间详情
    getRoomAssess: urlAPI + '/web/trd/orderComment/list', //房间评价列表
    getRoomGoodsList: urlAPI + '/web/res/goods/roomGoods', //房间物品列表
    getFundAvailable: urlAPI + '/web/usr/userFund/availableList', //可用基金列表
    getRoomBookDate: urlAPI + '/web/res/roomStatus/busy', //查询房间已预订日期
    getRoomStatus: urlAPI + '/web/res/roomStatus/get', //查询房间当天所有时间段预订状态
    getRoomPartTimePrice: urlAPI + '/web/res/partTimePrice/list', //房间时租房价格列表
    getRoomPartTimeRange: urlAPI + '/web/res/partTimePrice/range', //房间时租房时间范围
    getRoomNightDiscount: urlAPI + '/web/res/nightDiscount/list', //查询房间夜房优惠价格
    getNightDiscount: urlAPI + '/web/res/nightDiscount/times', //查询搜索时，要显示的夜房优惠价格列表
    getMidnightDiscount: urlAPI + '/web/res/midnightDiscount/list', //午夜特价房折扣列表
    getRoomPrice: urlAPI + '/ordercenter/res/room/amount', //查询房间金额

    //设计师相关
    getDesigner: urlAPI + '/web/usr/designer/get', //设计师详情
    //订单相关
    getOrderList: urlAPI + '/web/trd/orderInfo/list', //订单列表
    getOrderDetail: urlAPI + '/web/trd/orderInfo/detail', //订单详情
    submitOrder: urlAPI + '/web/trd/orderInfo/submit', //提交订单
    cancelOrder: urlAPI + '/web/trd/orderInfo/cancel', //取消订单
    saveSub: urlAPI + '/web/trd/orderComment/save', //用户提交评论
    payOrder: urlAPI + '/ordercenter/trd/pay/orderInfoPay/cashier', //支付订单
    unsubscribeOrder: urlAPI + '/web/trd/refund/orderInfoRefund/refund', //退订订单
    getWaitRoomList: urlAPI + '/ordercenter/trd/orderRoom/findByUidOrderRoomList', //根据用户查询待入住房间列表

    //余额
    getBalance: urlAPI + '/web/usr/userBalanceAccount/info', //查询用户余额详情
    submitBalanceOrder: urlAPI + '/web/usr/userBalanceOrderInfo/submit', //提交余额充值订单
    payBalanceOrder: urlAPI + '/web/usr/pay/userBalanceOrderInfoPay/cashier', //支付余额充值订单
    getBalanceOrderDetail: urlAPI + '/web/usr/userBalanceOrderInfo/detail', //获取余额充值订单详情
    getBalanceLog: urlAPI + '/web/usr/userBalanceAccountOperateLog/list', //获取余额交易记录
    getTotalAssets: urlAPI + '/ordercenter/usr/userTimeCoinAccountOperateLog/userTotalCoin', //总资产钱包累计
    getTotalAssetsRecord: urlAPI + '/ordercenter/usr/userTimeCoinAccountOperateLog/findListByUid', //总资产收支明细
    //服务
    inStoreGoods: urlAPI + '/web/svr/inStoreGoods/list',//店内商品列表
    hotelService: urlAPI + '/web/svr/hotelService/list',//店内服务列表
    socialService: urlAPI + '/web/svr/socialServiceCategory/list',//社会化服务列表
    socialList: urlAPI + '/web/svr/hotelSocialStore/list',//社会化商铺列表
    //客控
    openDoorList: urlAPI + '/web/trd/hotelControl/openDoorList',//查询当前登录用户开门列表
    checkOutDoorList: urlAPI + '/web/trd/hotelControl/checkOutList',//查询当前登录用户退房列表
    openDoor: urlAPI + '/web/trd/hotelControl/openDoor',// 微信开门
    checkOutDoor: urlAPI + '/web/trd/hotelControl/checkOut',//微信退房
    getAirDeviceList: urlAPI + '/ordercenter/smk/airc/deviceList',//空调设备列表
    closeAir: urlAPI + '/ordercenter/smk/airc/close',//空调关机
    changeAirMode: urlAPI + '/ordercenter/smk/airc/changeMode',//空调切换模式
    changeAirWind: urlAPI + '/ordercenter/smk/airc/changeSpeed',//空调切换风速
    openAir: urlAPI + '/ordercenter/smk/airc/open',//空调开机
    getAirStatus: urlAPI + '/ordercenter/smk/airc/status',//查询空调状态
    AirTempDown: urlAPI + '/ordercenter/smk/airc/downTemp',//空调降低温度
    AirTempUp: urlAPI + '/ordercenter/smk/airc/upTemp',//空调升高温度
    controlTele3d: urlAPI + 'ordercenter/smk/tv/operate',//遥控器3D
    getTeleDeviceList: urlAPI + '/ordercenter/smk/tv/deviceList',//tv设备列表
    curtainOpen: urlAPI + '/ordercenter/smk/curtain/open',//打开窗帘
    curtainPause: urlAPI + '/ordercenter/smk/curtain/stop',//暂停窗帘
    curtainClose: urlAPI + '/ordercenter/smk/curtain/close',//关闭窗帘
    getCurtainDeviceList: urlAPI + '/ordercenter/smk/curtain/deviceList',//窗帘设备列表
    getScePageDeviceList: urlAPI + '/ordercenter/smk/scePage/deviceList',//场景设备列表
    ScePageOperate: urlAPI + '/ordercenter/smk/scePage/operate',//操作场景
    getLightDeviceList: urlAPI + '/ordercenter/smk/light/deviceList',//灯设备列表
    closeLight: urlAPI + '/ordercenter/smk/light/close',//关灯
    openLight: urlAPI + '/ordercenter/smk/light/open',//开灯
    openRoomDoor: urlAPI + '/ordercenter/smk/door/open',//打开房间门
    //管理
    //欢迎页
    getManager: urlAPI + '/web/mgr/hotelManagerNote/getByHid',//店长寄语
    regionList: urlAPI + '/web/sys/area/getMyList',//用户拥有的区域列表
    hotelList: urlAPI + '/web/mgr/hotelManage/myHotelList',//用户拥有的酒店列表
    menuList: urlAPI + '/web/usr/menu/list',//用户拥有的菜单列表

    //房间管理
    roomList: urlAPI + '/web/mgr/hotelManage/roomList',//客房管理列表
    occupancyRate: urlAPI + '/web/mgr/reportManage/hotelOccupancyRate',//酒店入住率
    roomDetail: urlAPI + '/web/mgr/hotelManage/roomDetail',//酒店客房状态详情
    roomRepairLogSave: urlAPI + '/web/mgr/roomRepairLog/save',//添加维修
    disableRoom: urlAPI + '/web/mgr/hotelManage/disableRoom',//停用房间
    confirmRepair: urlAPI + '/web/mgr/hotelManage/confirmRepair',//确认维修
    roomRepairLog: urlAPI + '/web/mgr/roomRepairLog/detail',//维修详情

    //耗材
    articleList: urlAPI + '/web/mgr/materialManage/findListConsumables',//日用品列表
    articleGoods: urlAPI + '/web/mgr/materialManage/goodsByGid',//日用品商品信息
    articleDetail: urlAPI + '/web/mgr/materialManage/storageDetails',//日用品明细
    articleModify: urlAPI + '/web/mgr/materialManage/insertStock',//日用品修改
    beddingList: urlAPI + '/web/mgr/materialManage/bedLiningsList',//床上用品列表
    beddingGoods: urlAPI + '/web/mgr/materialManage/bedLiningsDetail',//床上用品商品信息
    beddingDetail: urlAPI + '/web/mgr/materialManage/findListbedLiningsDetailLog',//床上用品明细
    beddingModify: urlAPI + '/web/mgr/materialManage/updateBedLinings',//床上用品修改
    assetList: urlAPI + '/web/mgr/materialManage/damagedOutlay',//固定资产列表
    assetGoods: urlAPI + '/web/mgr/materialManage/byHidCidBedLinings',//固定资产信息
    assetDetail: urlAPI + '/web/mgr/materialManage/findListDamagedOutlay',//固定资产明细

    //人员管理
    employeeList: urlAPI + '/web/mgr/employee/list',//人员列表
    employeeDetail: urlAPI + '/web/mgr/employee/detail',//人员详情
    employeeCheckList: urlAPI + '/web/mgr/employeeCheckingIn/list',//人员当月考勤列表
    employeeCheckSave: urlAPI + '/web/mgr/employeeCheckingIn/save',//人员添加考勤
    employeeEvaluateList: urlAPI + '/web/mgr/employeeEvaluate/list',//员工评价列表
    employeeFired: urlAPI + '/web/mgr/employee/dimission',//员工离职
    employeeEvaluateSave: urlAPI + '/web/mgr/employeeEvaluate/save',//添加评价
    employeeSave: urlAPI + '/web/mgr/employee/save',//添加员工
    scheduleList: urlAPI + '/web/mgr/scheduleTime/list',//排版时间段表
    employeeScheduleList: urlAPI + '/web/mgr/employeeSchedule/list',//员工排班时间表
    employeeScheduleSave: urlAPI + '/web/mgr/employeeSchedule/save',//当天排班人员添加修改
    employeeScheduleDay: urlAPI + '/web/mgr/employeeSchedule/day',//当天排班详情
    dictList: urlAPI + '/web/sys/dict/list',//字典列表

    //财务
    income: urlAPI + '/web/mgr/financeManage/income', //收入统计
    outlay: urlAPI + '/web/mgr/financeManage/outlay', //支出统计
    invoiceManage: urlAPI + '/web/mgr/invoiceManage/flist', //发票管理
    invoiceDetail: urlAPI + '/web/mgr/invoiceManage/detail', //发票详情
    invoiceSend: urlAPI + '/web/mgr/invoiceManage/send', //寄出发票
    fRoomIncome: urlAPI + '/web/trd/orderInfo/fRoomIncome', //房间收入列表
    fGoodsIncome: urlAPI + '/web/trd/orderInfo/fGoodsIncome', //非房收入列表
    commodityOut: urlAPI + '/web/mgr/commodityOutlay/flist', //日用品或能耗或设备支出列表
    damagedOut: urlAPI + '/web/mgr/damagedOutlay/flist', //物品损坏支出列表
    salaryOut: urlAPI + '/web/mgr/salaryInfoOutlay/flist', //人员工资支出列表
    taxOut: urlAPI + '/web/mgr/taxOutlay/flist', //税务支出支出列表
    otherOut: urlAPI + '/web/mgr/otherOutlay/flist', //其它支出支出列表
    outLog: urlAPI + '/web/mgr/outlayLog/list', //支出修改明细列表
    commodityList: urlAPI +'/res/commodity/slist',//日用品项列表
    commoditySave: urlAPI +'/mgr/commodityOutlay/save',//日用品等修改添加
    commodityDetail: urlAPI + '/web/mgr/commodityOutlay/detail',//日用品等详情接口
    damagedOutDetail: urlAPI + '/web/mgr/damagedOutlay/detail',//物品损坏详情
    damagedOutSave: urlAPI + '/web/mgr/damagedOutlay/save',//物品损坏添加
    taxOutDetail: urlAPI + '/web/mgr/taxOutlay/detail',//税务支出详情
    taxOutSave : urlAPI + '/web/mgr/taxOutlay/save',//税务支出添加
    otherOutDetail: urlAPI + '/web/mgr/otherOutlay/detail',//其他支出详情
    otherOutSave: urlAPI + '/web/mgr/otherOutlay/save',//其他支出添加
    salaryOutDetail: urlAPI + '/web/mgr/salaryInfoOutlay/detail',//人员工资详情
    salaryOutSave: urlAPI + '/web/mgr/salaryInfoOutlay/save',//人员工资添加

    //仓库
    supplierList: urlAPI + '/web/mgr/supplier/slist',//供应商列表
    commodityStockList: urlAPI +'/mgr/stockInNote/commodityList',//仓库商品列表
    warehouseList: urlAPI + '/web/mgr/warehouse/slist',//仓库列表
    warehouseInList: urlAPI + '/web/mgr/stockInNote/list',//入库单列表
    warehouseInDetail: urlAPI + '/web/mgr/stockInNote/detail',//入库单详情
    warehouseInSave: urlAPI + '/web/mgr/stockInNote/save',//入库单添加
    warehouseWayList: urlAPI + '/web/mgr/warehousePutWay/slist',//出入库方式列表
    warehouseOutList: urlAPI + '/web/mgr/stockOutNote/list',//出库单列表
    warehouseOutDetail: urlAPI + '/web/mgr/stockOutNote/detail',//出库单详情
    warehouseOutSave: urlAPI + '/web/mgr/stockOutNote/save',//出库单添加
    warehouseAllocateList: urlAPI + '/web/mgr/stockAllotNote/list',//调拨单列表
    warehouseAllocateDetail: urlAPI + '/web/mgr/stockAllotNote/detail',//调拨单详情
    warehouseAllocateSave: urlAPI + '/web/mgr/stockAllotNote/save',//调拨单添加
    warehouseStockList: urlAPI + '/web/mgr/materialManage/findListstockTaking',//库存盘点列表
    warehouseStockDetail: urlAPI + '/web/mgr/materialManage/findListByIdStockTaking',//库存盘点详情
    warehouseStockAdd: urlAPI + '/web/mgr/materialManage/byHidCidStock',//库存盘点添加详细
    warehouseStockSave: urlAPI + '/web/mgr/materialManage/stockTalingInsert',//库存盘点添加

    //统计报表
    reportIn: urlAPI + '/web/mgr/reportManage/income',//收入统计
    reportOut: urlAPI + '/web/mgr/reportManage/outlay',//支出统计

    //加盟商
    saleRangeStatistics: urlAPI + '/web/trd/roomIncomeDaily/saleRangeStatistics', //销售数据统计
    commissionRangeStatistics: urlAPI + '/web/acc/hotelCommissionLog/commissionRangeStatistics', //分佣数据统计
    fraMonthlyList: urlAPI + '/web/acc/hotelCommissionLog/monthlyList', //每月分佣数据列表
    fraAccount: urlAPI + '/web/acc/allianceBusinessAccount/account', //加盟商账户数据
    fraSaleDailyList: urlAPI + '/web/trd/roomIncomeDaily/saleDailyList', //每日销售数据列表
    fraSaleMonthlyList: urlAPI + '/web/trd/roomIncomeDaily/saleMonthlyList', //每月销售数据列表
    fraLogList: urlAPI + '/web/acc/hotelCapitalLog/list', //操作记录
    fraSms: urlAPI + '/web/usr/sms/applyCash', //申请提现验证码
    fraCash: urlAPI + '/web/acc/applyCash/apply', //申请提现

    //会员卡
    getDicCardList: urlAPI + '/web/vip/membershipCard/list', //获取会员卡字典数据
    getCardList: urlAPI + '/web/vip/userBuyCard/list', //已经购买的会员卡列表
    getDicCardDetail: urlAPI + '/web/vip/membershipCard/detail', //会员卡详情字典数据
    getCardDetail: urlAPI + '/web/vip/userBuyCard/detail', //已经购买的会员卡详情
    getCardDetailByCardNo: urlAPI + '/web/vip/userBuyCard/detailByCardNo', //根据会员卡号获取会员卡详情
    submitCardOrder: urlAPI + '/web/vip/userBuyCardOrderInfo/submit', //购买会员卡下单
    payCardOrder: urlAPI + '/web/vip/pay/userBuyCardOrderInfoPay/cashier', //会员卡订单支付
    getCardAccountList: urlAPI + '/web/vip/userCardAccount/list', //钱包会员卡列表
    getDefaultCashAccount: urlAPI + '/web/vip/userCardAccountApplyCashAccount/defaultAccount', //获取默认提现帐号
    bindCashAccountSMS: urlAPI + '/web/usr/sms/bindApplyCashAcccount', //绑定提现帐号验证码
    bindCashAccount: urlAPI + '/web/vip/userCardAccountApplyCashAccount/bind', //绑定提现帐号
    withdrawCash: urlAPI + '/web/vip/userCardAccountApplyCashLog/apply', //申请提现
    getAccountLogList: urlAPI + '/web/vip/userCardAccountOperateLog/list', //账户资金记录
    applyPromotion: urlAPI + '/web/vip/marketApplyLog/apply', //申请加入推广套餐
    promotionList: urlAPI + '/web/vip/userCardMarketPackage/list', //用户的推广套餐列表
    goPromotion: urlAPI + '/web/vip/userCardMarketPackage/apply', //开通推广套餐
    promoteTaskList: urlAPI + '/web/vip/userCardMarketPackageTask/currentMonth', //当前任务列表
    submitPromoteTaskList: urlAPI + '/web/vip/userCardMarketPackageTask/submit', //提交任务
    getAccountList: urlAPI + '/web/vip/userCardAccount/accountList', //会员卡账户列表
    getDiscountList: urlAPI + '/web/vip/userBuyCard/discountList', //会员卡折扣列表
    getCardOrderInfo: urlAPI + '/web/vip/userBuyCardOrderInfo/detail', //会员卡订单详情
    getAllArea: urlAPI + '/web/sys/area/getAllTree', //获取所有地区数据
    getPrize: urlAPI + '/web/vip/lottery/luck', //抽奖
    getPrizeLogList: urlAPI + '/web/vip/prizeLog/myList', //所有的中奖记录
    getWinnerList: urlAPI + '/web/vip/prizeLog/list', //所有的中奖记录
    getLotteryTimes: urlAPI + '/web/vip/lotteryTimes/times', //会员的剩余抽奖次数
    getAllDicCardList: urlAPI + '/web/vip/membershipCard/all', //获取所有会员卡字典数据
    getAccountCommonwealInfo: urlAPI + '/web/bnf/userDonateFoundation/cardDonateAmount', //会员账户的公益信息
    getShareList: urlAPI + '/web/vip/shareMessage/list', //分享内容列表
    getShareData: urlAPI + '/web/vip/shareMessage/detail', //分享内容详情
    getInviteVIPLogList: urlAPI + '/web/vip/userBuyCardOrderInfo/inviteeList', //查询邀请VIP记录
    getInviteVIPAward: urlAPI + '/web/vip/userBuyCardOrderInfo/sumKickback', //查询邀请VIP获得的总奖励
    getInviterByCode: urlAPI + '/web/usr/user/getUserByInvitationCode', //根据邀请码获取邀请人的信息

    //客服
    getAuditList: urlAPI + '/web/vip/userCardMarketPackageTask/auditList', //查询待审核任务列表
    getAuditSuccess: urlAPI + '/web/vip/userCardMarketPackageTask/auditSuccess', //审核任务通过或不通过
    getPreServiceList: urlAPI + '/ordercenter/svr/hotelPreService/findListPreService', //前置服务列表
    savePreService: urlAPI + '/ordercenter/svr/userService/saveUserService', //添加前置服务
    getPreService: urlAPI + '/ordercenter/svr/userService/findListByUidOrid', //获取用户选择的服务
    getReservationServiceList: urlAPI + '/ordercenter/svr/hotelService/findListByHid',//获取店内服务
    getHotelRecommendedAround: urlAPI + '/ordercenter/svr/hotelRecommendedAround/findListByHid',//获取酒店周边推荐
    getSaveUserService: urlAPI + '/ordercenter/svr/userShopService/saveUserService',//添加用户店内服务
    getSaveStatus: urlAPI + '/ordercenter/svr/userShopService/saveStatus',//修改用户服务状态
    getFindByOridSid: urlAPI + '/ordercenter/svr/userShopService/findByOridSid',//获取订单房间服务状态

    //公益
    commonwealList: urlAPI + '/web/bnf/nonprofitFoundationInfo/findListEnabled', //查询公益信息列表
    getFoundationInfo: urlAPI + '/web/bnf/nonprofitFoundationInfo/get', //根据id查询公益基金信息详情
    updateFoundationInfo: urlAPI + '/web/bnf/nonprofitFoundationInfo/update', //根据id修改公益基金信息
    benefitStudentList: urlAPI + '/web/bnf/benefitStudent/findListByFid', //受资助学生列表
    benefitStudentDetail: urlAPI + '/web/bnf/benefitStudent/get', //受益学生详情
    saveBenefitStudent: urlAPI + '/web/bnf/benefitStudent/save', //受益学生保存
    getDonationList: urlAPI + '/web/bnf/donationLog/findListByFid', //捐赠列表
    benefitAmount: urlAPI + '/web/bnf/nonprofitFoundationAccount/amountByFid', //根据基金ID查询捐赠总额和捐赠人数
    benefitAmountUid: urlAPI + '/web/bnf/nonprofitFoundationInfo/findByUid', //根据基金ID查询捐赠总额和捐赠人数
    getDonationAmount: urlAPI + '/web/bnf/userDonateFoundation/amount', //每月捐赠金额
    getMyWealCount: urlAPI + '/web/bnf/donationLog/findByUidCount', //根据用户ID查询我的公益捐赠总额
    getMyWealRecord: urlAPI + '/web/bnf/donationLog/findByUid', //根据用户ID查询我的公益记录
    goDonate: urlAPI + '/web/bnf/userDonateFoundation/donate', //马上捐赠
    addSubAccount: urlAPI + '/web/bnf/nonprofitFoundationManager/add', //添加子账户
    delSubAccount: urlAPI + '/web/bnf/nonprofitFoundationManager/delete', //删除子账户
    getFoundationByid: urlAPI + '/web/bnf/nonprofitFoundationInfo/findByUid', //根据id查询公益基金信息详情
    getFoundationByUid: urlAPI + '/web/bnf/nonprofitFoundationInfo/findByUid', //根据uid查询公益基金信息详情
    getFoundationAccount: urlAPI + '/web/bnf/nonprofitFoundationAccount/statistics', //公益管理模式首页数据统计
    getFoundationAccountLog: urlAPI + '/web/bnf/nonprofitFoundationAccountOperateLog/list', //获取公益基金帐户资金操作记录
    getFoundationCashAccount: urlAPI + '/web/bnf/nonprofitFoundationAccountApplyCashAccount/defaultAccount', //获取公益基金默认体现账号
    bindFoundationCashAccount: urlAPI + '/web/bnf/nonprofitFoundationAccountApplyCashAccount/bind', //绑定公益基金提现账号
    foundationWithdrawCash: urlAPI +'/bnf/nonprofitFoundationAccountApplyCashLog/apply', //公益基金账户申请提现
    getFoundationSubList: urlAPI + '/web/bnf/nonprofitFoundationManager/list', //获取公益基金子账户列表
    deleteFoundationSub: urlAPI + '/web/bnf/nonprofitFoundationManager/delete', //删除子账户
}