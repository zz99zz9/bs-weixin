var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var replace = require('gulp-regex-replace');
var contentIncluder = require('gulp-content-includer');
var rev = require('gulp-rev'); //~ 对文件名加 MD5 后缀
var revCollector = require('gulp-rev-collector'); //~ 路径替换
var del = require('del');

function clean(done) {
    del.sync('src/');
    del.sync('dist/');
    done();
}

function openConnect() {
    connect.server({
        root: './dist',
        livereload: true,
        port: 8010
    });
}

function sassCompile(callback) {
    sass('./sass/mui.scss')
        .on('error', sass.logError)
        .pipe(minifycss()) //执行压缩
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/css'))
        .on('finish', callback)
}

/**
 * 给js文件加 md5
 */
function md5JS() {
    return gulp.src('js/**/*.js')
        .pipe(rev())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'));
}

/**
 * 给css文件加 md5
 */
function md5CSS() {
    return gulp.src('./css/**.css')
        .pipe(rev())
        .pipe(gulp.dest('./dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/css')); //输出文件夹
}

/**
 * 将文件里js、css改为带MD5的新名字，并输出
 */
function md5Rev() {
    return gulp.src(['./rev/**/*.json', './src/**/*.html']) //- 读取 rev-manifest.json 文件以及需要进行js、css名替换的文件
        .pipe(revCollector()) //- 执行文件内js、css名的替换
        .pipe(gulp.dest('./dist')); //- 替换后的文件输出的目录
}

/**
 *   =======================================================
 *                       登录&注册
 *   =======================================================
 */
function register1() {
    return gulp.src('./js/layout/shell-register.html')
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/register/register-1.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/register/register-1.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('register-1.html'))
        .pipe(gulp.dest('./src'));
}

//短信验证码
function register2() {
    return gulp.src('./js/layout/shell-register.html')
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/register/register-2.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/register/register-2.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('register-2.html'))
        .pipe(gulp.dest('./src'));
}

//微信自动登录处理页面
function weixin() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/proxy/vmodel-weixin.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/proxy/weixin.html"-->'
        }))
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title"></h1>',
            replace: '<h1 id="headerReplace" class="mui-title">加载中</h1>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('weixin.html'))
        .pipe(gulp.dest('./src'));
}

/**
 *   =======================================================
 *                       OTA相关页面
 *   =======================================================
 */
//加载页
function loading() {
    return gulp.src('./js/pages/loading/loading.html')
        .pipe(gulp.dest('./src'));
}

//首页
function index() {
    return gulp.src('./js/layout/shell-index.html')
        .pipe(replace({
            regex: '<!-- top -->',
            replace: '<!--include "../layout/top.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/index/index.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- bottom -->',
            replace: '<!--include "../layout/bottom.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">\n<link rel="stylesheet" href="css/index.css">'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"--><!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/lib/swiper.min.js"></script>\n' + '<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=0743dafb590f3622f52d0d4218a9f1f7"></script>\n' + '<script src="js/pages/index/vmodel.js"></script>\n' + '<script src="js/util/calendar.js"></script>\n' + '<script src="js/util/partTime.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- roomSlide -->',
            replace: '<!--include "../util/roomSlide-hotel.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./src'))
}

//酒店页面
function hotel() {
    return gulp.src('./js/layout/shell-index.html')
        .pipe(replace({
            regex: '<!-- top -->',
            replace: '<!--include "../layout/top.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/hotel/hotel.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">\n<link rel="stylesheet" href="css/hotel.css">'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"--><!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/lib/swiper.min.js"></script>\n' + '<script src="js/pages/hotel/vmodel.js"></script>\n' + '<script src="js/util/calendar.js"></script>\n<script src="js/util/partTime.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- roomSlide -->',
            replace: '<!--include "../util/roomSlide-type.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('hotel.html'))
        .pipe(gulp.dest('./src'));
}

//房间页面
function room() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">\n<link rel="stylesheet" href="css/room.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/room/room.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/lib/mui.zoom.js"></script>\n<script src="js/lib/mui.previewimage.js"></script>\n<script src="js/lib/swiper.min.js"></script>\n' + '<script src="js/pages/room/vmodel.js"></script>\n<script src="js/util/calendar.js"></script>\n<script src="js/util/partTime.js"></script>\n' + '<script src="js/util/contactList.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- roomSlide -->',
            replace: '<!--include "../util/roomSlide-type.html"-->'
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('room.html'))
        .pipe(gulp.dest('./src'));
}

//订单列表页
function orderList() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/order/vmodel-orderList.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/order/orderList.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('orderList.html'))
        .pipe(gulp.dest('./src'));
}

//订单详情页
function order() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/order/vmodel-order.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/order/order.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('order.html'))
        .pipe(gulp.dest('./src'));
}

//下单成功页面
function payend() {
    return gulp.src('./js/layout/shell.html')
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/order/vmodel-payend.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/order/payend.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('payend.html'))
        .pipe(gulp.dest('./src'));
}

//支付宝支付提示跳转页面
function alipay() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/util/alipay.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../util/alipay.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('alipay.html'))
        .pipe(gulp.dest('./src'));
}

//支付宝支付完成页面
function closePage() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../util/closePage.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('closePage.html'))
        .pipe(gulp.dest('./src'));
}

//支付宝支付--被微信屏蔽
function alipayIframe() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/alipay/vmodel-alipay.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/alipay/alipay-iframe.html"-->'
        }))
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title"></h1>',
            replace: '<h1 id="headerReplace" class="mui-title">支付宝支付</h1>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../pages/room/pop-btn.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('alipay-iframe.html'))
        .pipe(gulp.dest('./src'));
}

//用户提交评论
function submitassess() {
    return gulp.src('./js/layout/shell.html')
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/assess/sub.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/assess/submitassess.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('submitassess.html'))
        .pipe(gulp.dest('./src'));
}

/**
 *   =======================================================
 *                       发现相关页面
 *   =======================================================
 */

//发现页面
function discover() {
    return gulp.src('./js/layout/shell.html')
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/discover/discover.html"-->'
        }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">个人信息</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('discover.html'))
        .pipe(gulp.dest('./src'));
}

//会员中心
function memberCenter() {
    return gulp.src('./js/layout/shell.html')
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/discover/member-center.html"-->'
        })).pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('member-center.html'))
        .pipe(gulp.dest('./src'));
}

//关于
function about() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">'
        }))
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/about.html"-->'
        }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">关于因爱</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('about.html'))
        .pipe(gulp.dest('./src'));
}

//合作加盟介绍
function allianceIntro() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">'
        }))
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/discover/alliance-intro.html"-->'
        }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">关于因爱</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('alliance-intro.html'))
        .pipe(gulp.dest('./src'));
}

//加入我们
function joinUs() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">'
        }))
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/discover/joinUs.html"-->'
        }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">关于因爱</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('joinUs.html'))
        .pipe(gulp.dest('./src'));
}

//午夜特价房
function special() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">'
        }))
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/discover/special.html"-->'
        }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">关于因爱</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('special.html'))
        .pipe(gulp.dest('./src'));
}


/**
 *   =======================================================
 *                       用户个人信息相关页面
 *   =======================================================
 */
//个人信息
function userInfo() {
    return gulp.src('./js/layout/shell.html')
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/lib/mui.view.js"></script> \n <script src="js/pages/user/vmodel-info.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/user/user-info.html"-->'
        }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">个人信息</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('user-info.html'))
        .pipe(gulp.dest('./src'));
}

//邀请好友注册
function userInvite() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/invite/user-invite.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/invite/user-invite.html"-->'
        }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">邀请好友</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('user-invite.html'))
        .pipe(gulp.dest('./src'));
}

//被邀请注册页面
function inviteToUser() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/invite/inviteToUser.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/invite/inviteToUser.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('inviteToUser.html'))
        .pipe(gulp.dest('./src'));
}

//邀请好友成为VIP
function vipInvite() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/invite/vip-invite.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/invite/vip-invite.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('vip-invite.html'))
        .pipe(gulp.dest('./src'));
}

//被邀请成为VIP页面
function inviteToVip() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/invite/inviteToVip.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/invite/inviteToVip.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('inviteToVip.html'))
        .pipe(gulp.dest('./src'));
}

//优惠券页
function coupon() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/wallet/coupon.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/wallet/coupon.html"-->'
        }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">体验基金</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('coupon.html'))
        .pipe(gulp.dest('./src'));
}

//账户余额
function balance() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/franchisee.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/user/balance.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/user/balance.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- modal -->',
            replace: '<!--include "../util/modal.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('balance.html'))
        .pipe(gulp.dest('./src'));
}
//账户余额交易明细
function balanceLog() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/franchisee.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/user/balance-log.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/user/balance-log.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('balance-log.html'))
        .pipe(gulp.dest('./src'));
}

//入住人列表页
function frequentContactList() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/user/vmodel-contact.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/user/frequent-contact-list.html"-->'
        }))
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title"></h1>',
            replace: '<h1 id="headerReplace" class="mui-title">入住人信息管理</h1>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../pages/room/pop-btn.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('frequent-contact-list.html'))
        .pipe(gulp.dest('./src'));
}

//发票列表页
function invoiceList() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/user/vmodel-invoice.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/user/invoice-list.html"-->'
        }))
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title"></h1>',
            replace: '<h1 id="headerReplace" class="mui-title">发票管理</h1>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../pages/room/pop-btn.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('invoice-list.html'))
        .pipe(gulp.dest('./src'));
}

//申请发票
function invoiceApply() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/user/vmodel-invoice-apply.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/user/invoice-apply.html"-->'
        }))
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title"></h1>',
            replace: '<h1 id="headerReplace" class="mui-title">申请发票</h1>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../pages/room/pop-btn.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('invoice-apply.html'))
        .pipe(gulp.dest('./src'));
}

//支付发票快递费用成功页
function invoicePaySuccess() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/user/vmodel-invoice-pay-success.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/user/invoice-pay-success.html"-->'
        }))
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title"></h1>',
            replace: '<h1 id="headerReplace" class="mui-title">支付成功</h1>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../pages/room/pop-btn.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('invoice-pay-success.html'))
        .pipe(gulp.dest('./src'));
}

/**
 *   =======================================================
 *                       客控模块相关页面
 *   =======================================================
 */
//服务页
function service() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="../css/swiper.min.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/service/service.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/lib/swiper.min.js"></script>\n<script src="../js/pages/service/service.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- info -->等待加载……',
            replace: '<!--include "../pages/room/article-info.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../pages/room/pop-btn.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('service.html'))
        .pipe(gulp.dest('./src'));
}

//店铺列表页
function shop() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="../css/swiper.min.css">'
        }))
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">合作商家</h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/service/shop.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/lib/swiper.min.js"></script>\n<script src="../js/pages/service/shop.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('shop.html'))
        .pipe(gulp.dest('./src'));
}

/**
 *   =======================================================
 *                       加盟商相关页面
 *   =======================================================
 */
function franchisee() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">\n<link rel="stylesheet" href="css/franchisee.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/franchisee/index.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/lib/swiper.min.js"></script>\n' + '<script src="js/pages/franchisee/index.js"></script>\n<script src="js/lib/echarts.simple.min.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('franchisee.html'))
        .pipe(gulp.dest('./src'));
}

function franchiseeNote() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/franchisee.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/franchisee/note.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('franchisee-note.html'))
        .pipe(gulp.dest('./src'));
}

function franchiseeToday() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/franchisee.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/franchisee/today.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/lib/swiper.min.js"></script>\n' + '<script src="js/pages/franchisee/today.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('franchisee-today.html'))
        .pipe(gulp.dest('./src'));
}

function franchiseeMonth() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/franchisee.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/franchisee/month.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/franchisee/month.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('franchisee-month.html'))
        .pipe(gulp.dest('./src'));
}

function franchiseeIncome() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/franchisee.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/franchisee/income.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/franchisee/income.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('franchisee-income.html'))
        .pipe(gulp.dest('./src'));
}

function franchiseeRecord() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/franchisee.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/franchisee/record.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/franchisee/record.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('franchisee-record.html'))
        .pipe(gulp.dest('./src'));
}

/**
 *   =======================================================
 *                       会员卡相关页面
 *   =======================================================
 */

//会员中心-会员介绍
function cardIntroduce() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/card.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/card/introduce.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/card/introduce.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('card-introduce.html'))
        .pipe(gulp.dest('./src'));
}

//会员中心-会员安全性
function cardSafe() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/card.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/card/safe.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('card-safe.html'))
        .pipe(gulp.dest('./src'));
}

//一张图看懂本宿
function cardIntroducePicture() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/card.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/card/introduce-picture.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('card-introduce-picture.html'))
        .pipe(gulp.dest('./src'));
}

//会员中心-VIP会员收益
function cardPromotion() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">\n<link rel="stylesheet" href="css/card.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/card/promotion.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('card-promotion.html'))
        .pipe(gulp.dest('./src'));
}

//会员中心-成为VIP会员
function cardList() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/card.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/card/list.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/card/list.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('card-list.html'))
        .pipe(gulp.dest('./src'));
}

//会员卡购买
function cardBuy() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/card.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/card/buy.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/card/buy.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK-av2.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('card-buy.html'))
        .pipe(gulp.dest('./src'));
}

//会员卡展示
function cardShow() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/card.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/card/show.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/card/show.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('card-show.html'))
        .pipe(gulp.dest('./src'));
}

//钱包
function cardDetail() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">\n<link rel="stylesheet" href="css/card.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/card/detail.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/lib/swiper.min.js"></script>\n<script src="js/pages/card/detail.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK-av2.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('card-detail.html'))
        .pipe(gulp.dest('./src'));
}

//账户提现账号及资金操作历史
function cardLog() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/card.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/card/log.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/card/log.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK-av2.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('card-log.html'))
        .pipe(gulp.dest('./src'));
}

//绑定提现账号页面
function cardBind() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />\n<link rel="stylesheet" href="css/card.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/card/bind.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/lib/mui.picker.all.js"></script>\n<script src="js/pages/card/bind.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK-av2.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('card-bind.html'))
        .pipe(gulp.dest('./src'));
}

//推广申请
function promotionApply() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/promotion.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/promotion/apply.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/promotion/apply.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK-av2.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('promotion-apply.html'))
        .pipe(gulp.dest('./src'));
}

//会员卡推广详情
function promotionDetail() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">\n<link rel="stylesheet" href="css/promotion.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/promotion/detail.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/lib/swiper.min.js"></script>\n' + '<script src="js/pages/promotion/detail.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK-av2.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('promotion-detail.html'))
        .pipe(gulp.dest('./src'));
}

//会员卡推广分享页
function promotionShare() {
    return gulp.src('./js/layout/shell-av2.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/promotion.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/promotion/share.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/promotion/share.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('promotion-share.html'))
        .pipe(gulp.dest('./src'));
}

//抽奖
function lottery() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/swiper.min.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/lottery/lottery.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/lib/swiper.min.js"></script>\n<script src="js/lib/jQueryRotate.2.2.js"></script>\n<script src="js/pages/lottery/lottery.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- modal -->',
            replace: '<!--include "../util/modal.html"-->'
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('lottery.html'))
        .pipe(gulp.dest('./src'));
}


/**
 *   =======================================================
 *                       管理模块相关页面
 *   =======================================================
 */

//管理登录
function login() {
    return gulp.src('./js/layout/shell-register.html')
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/login.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('login.html'))
        .pipe(gulp.dest('./src/manage'));
}

//管理模式欢迎页
function homepage() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">欢迎进入管理模式</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />\n<link href="../css/report.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/homepage/homepage.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/lib/mui.picker.all.js"></script>\n<script src="../js/pages/manage/homepage/homepage.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('homepage.html'))
        .pipe(gulp.dest('./src/manage'));
}

//酒店管理导航页
function nav() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">酒店管理</h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/nav.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/nav.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- nav -->',
            replace: '<!--include "../util/nav.string"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('nav.html'))
        .pipe(gulp.dest('./src/manage'));
}

//客房管理
function roomList() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">客房管理</h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/room/room.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/room/room.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('room.html'))
        .pipe(gulp.dest('./src/manage'));
}
//客房详情
function roomDetails() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/room/room-details.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/room/room-details.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('room-details.html'))
        .pipe(gulp.dest('./src/manage'));
}
//报修表单
function roomRepair() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">维修</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/room/room-repair.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/room/room-repair.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('room-repair.html'))
        .pipe(gulp.dest('./src/manage'));
}
//停用表单
function roomBan() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/room/room-ban.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/room/room-ban.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('room-ban.html'))
        .pipe(gulp.dest('./src/manage'));
}

//耗材管理导航页
function consume() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">耗材管理</h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../util/nav.string"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/consume/nav.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('consume.html'))
        .pipe(gulp.dest('./src/manage'));
}

//耗材管理表格页
function consumeTable() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../util/table.string"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/consume/table.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('consume-table.html'))
        .pipe(gulp.dest('./src/manage'));
}

//耗材管理-日耗品详情页
function consumeArticle() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/consume/article.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/consume/article.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('consume-article.html'))
        .pipe(gulp.dest('./src/manage'));
}

//耗材管理-床上用品详情页
function consumeBedding() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/consume/bedding.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/consume/bedding.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('consume-bedding.html'))
        .pipe(gulp.dest('./src/manage'));
}

//耗材管理-固定资产详情页
function consumeAsset() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/consume/asset.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/consume/asset.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('consume-asset.html'))
        .pipe(gulp.dest('./src/manage'));
}

//财务管理表格页
function finance() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">财务管理</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/finance/finance.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/lib/mui.picker.all.js"></script>\n<script src="../js/pages/manage/finance/nav.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('finance.html'))
        .pipe(gulp.dest('./src/manage'));
}

//发票管理表格页
function invoice() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">发票管理</h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../util/table.string"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/finance/invoice.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('invoice.html'))
        .pipe(gulp.dest('./src/manage'));
}

//发票详情表单页
function invoiceDetail() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">发票详情</h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/finance/invoice-detail.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/finance/invoice-detail.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('invoice-detail.html'))
        .pipe(gulp.dest('./src/manage'));
}

//财务管理页
function financeTable() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../util/table.string"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/finance/table.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('finance-table.html'))
        .pipe(gulp.dest('./src/manage'));
}

//财务管理-日用品支出详情
function commodityOut() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/finance/commodity-out.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/finance/commodity-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('commodity-out.html'))
        .pipe(gulp.dest('./src/manage'));
}
//财务管理-物品损坏详情
function toolwasteOut() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/finance/toolwaste-out.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/finance/toolwaste-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('toolwaste-out.html'))
        .pipe(gulp.dest('./src/manage'));
}
//财务管理-人员工资详情
function salaryOut() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/finance/salary-out.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/finance/salary-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('salary-out.html'))
        .pipe(gulp.dest('./src/manage'));
}
//财务管理-能耗详情
function energyOut() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/finance/energy-out.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/finance/energy-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('energy-out.html'))
        .pipe(gulp.dest('./src/manage'));
}
//财务管理-设备支出
function deviceOut() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/finance/device-out.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/finance/device-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('device-out.html'))
        .pipe(gulp.dest('./src/manage'));
}
//财务管理-税务支出
function taxOut() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/finance/tax-out.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/finance/tax-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('tax-out.html'))
        .pipe(gulp.dest('./src/manage'));
}
//财务管理-其他支出
function otherOut() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/finance/other-out.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/finance/other-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('other-out.html'))
        .pipe(gulp.dest('./src/manage'));
}
//财务管理-支出修改明细
function detailOut() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">支出明细修改</h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/finance/detail-out.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/finance/detail-out.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('detail-out.html'))
        .pipe(gulp.dest('./src/manage'));
}
//人员管理-导航页
function staff() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">人员管理</h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/staff/staff.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/staff/staff.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('staff.html'))
        .pipe(gulp.dest('./src/manage'));
}
//人员管理-排班表
function paibanForm() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">排班表</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/staff/paiban-form.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/staff/paiban-form.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('paiban-form.html'))
        .pipe(gulp.dest('./src/manage'));
}
//人员管理-添加人员
function addstaffForm() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">添加员工</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/staff/addstaff-form.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/staff/addstaff-form.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('addstaff-form.html'))
        .pipe(gulp.dest('./src/manage'));
}
//人员管理-当天排班
function arrangementToday() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">当天排班</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/staff/arrangement-today.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/staff/arrangement-today.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('arrangement-today.html'))
        .pipe(gulp.dest('./src/manage'));
}
//统计报表
function statistic() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">统计报表</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />\n<link href="../css/report.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/statistic/statistic.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/lib/mui.picker.all.js"></script>\n<script src="../js/pages/manage/statistic/statistic.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('statistic.html'))
        .pipe(gulp.dest('./src/manage'));
}

//人员管理-员工详情页
function staffDetail() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/staff/detail.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/staff/detail.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('staff-detail.html'))
        .pipe(gulp.dest('./src/manage'));
}

//人员管理-提交评价页
function assessForm() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/staff/assess-form.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/staff/assess-form.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('assess-form.html'))
        .pipe(gulp.dest('./src/manage'));
}

//仓库管理导航页
function warehouse() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">仓库管理</h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../util/nav.string"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/warehouse/nav.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('warehouse.html'))
        .pipe(gulp.dest('./src/manage'));
}

//仓库管理表单页
function warehouseList() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/warehouse/list.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/warehouse/list.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('warehouse-list.html'))
        .pipe(gulp.dest('./src/manage'));
}

//入库详情、添加页
function warehouseFormIn() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/warehouse/warehouse-form-in.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/warehouse/warehouse-form-in.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('warehouse-form-in.html'))
        .pipe(gulp.dest('./src/manage'));
}

//出库详情、添加页
function warehouseFormOut() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.poppicker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/warehouse/warehouse-form-out.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/warehouse/warehouse-form-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('warehouse-form-out.html'))
        .pipe(gulp.dest('./src/manage'));
}

//调拨详情、添加页
function warehouseFormAllocate() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/warehouse/warehouse-form-allocate.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/warehouse/warehouse-form-allocate.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('warehouse-form-allocate.html'))
        .pipe(gulp.dest('./src/manage'));
}

//仓库盘点详情、添加页
function warehouseFormStock() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/manage/warehouse/warehouse-form-stock.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/manage/warehouse/warehouse-form-stock.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('warehouse-form-stock.html'))
        .pipe(gulp.dest('./src/manage'));
}

/**
 *   =======================================================
 *                       客服
 *   =======================================================
 */

//客服待审核任务列表
function auditList() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="../css/customer.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/customer/auditList.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/customer/auditList.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('customer/auditList.html'))
        .pipe(gulp.dest('./src'));
}

/**
 *   =======================================================
 *                       本宿公益
 *   =======================================================
 */

//介绍页面
function commonwealIntro() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/commonweal.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/commonweal/intro.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/commonweal/intro.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- modal -->',
            replace: '<!--include "../util/modal.html"-->'
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK-av2.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('commonweal-introduce.html'))
        .pipe(gulp.dest('./src'));
}

//我的公益记录
function commonwealRecord() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/commonweal.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/commonweal/record.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/commonweal/record.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('commonweal-record.html'))
        .pipe(gulp.dest('./src'));
}

//列表详情
function commonwealDetail() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/commonweal.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/commonweal/detail.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/pages/commonweal/detail.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- modal -->',
            replace: '<!--include "../util/modal.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('commonweal-detail.html'))
        .pipe(gulp.dest('./src'));
}


/**
 *   =======================================================
 *                       公益管理
 *   =======================================================
 */

//公益基金管理导航页
function cmsNav() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">欢迎进入公益管理模式</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="../css/commonweal.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/cms/nav.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/cms/nav.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('nav.html'))
        .pipe(gulp.dest('./src/cms'));
}

//基金编辑资料
function editFund() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">编辑资料</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="../css/commonweal.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/cms/editFund.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/cms/editFund.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('editFund.html'))
        .pipe(gulp.dest('./src/cms'));
}

//捐赠列表页
function cmsDonation() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">捐赠详情</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="../css/commonweal.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/cms/donation.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/cms/donation.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('donation.html'))
        .pipe(gulp.dest('./src/cms'));
}

//公益基金账户
function cmsAccount() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">账户详情</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="../css/commonweal.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/cms/account.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/cms/account.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->\n<!--include "../pages/user/popover.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('account.html'))
        .pipe(gulp.dest('./src/cms'));
}

//受益人列表页面
function cmsFavoreeList() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">受益学生管理</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="../css/commonweal.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/cms/favoreeList.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/cms/favoreeList.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('favoreeList.html'))
        .pipe(gulp.dest('./src/cms'));
}

//子账号列表页面
function cmsSubList() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">账户管理</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="../css/commonweal.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/cms/subList.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/cms/subList.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('subList.html'))
        .pipe(gulp.dest('./src/cms'));
}

//添加子账户
function subAdd() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">添加子账户</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="../css/commonweal.css">'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/cms/subAdd.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/cms/subAdd.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('subAdd.html'))
        .pipe(gulp.dest('./src/cms'));
}

//添加学生
function favoree() {
    return gulp.src('./js/layout/shell-manage.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title"></h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="../css/commonweal.css">\n<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/cms/favoree.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/lib/mui.picker.all.js"></script>\n<script src="../js/pages/cms/favoree.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('favoree.html'))
        .pipe(gulp.dest('./src/cms'));
}

//头像编辑页面
function avatar() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link rel="stylesheet" href="css/cropper.min.css">'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="js/lib/cropper.min.js"></script>\n<script src="js/pages/user/avatar.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/user/avatar.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('avatar.html'))
        .pipe(gulp.dest('./src'));
}

//客服页的一级页面————订单列表页
function serviceOrderList() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/service/orderList.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/service/orderList.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('orderList.html'))
        .pipe(gulp.dest('./src/service'));
}

//客服页————前置服务选项页
function serviceProcess() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/service/process.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/service/process.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('process.html'))
        .pipe(gulp.dest('./src/service'));
}

//客服页————前置服务就绪页面
function serviceReady() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">已经就绪</h1>'
        }))
        .pipe(replace({
            regex: '<!-- css -->',
            replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />'
        }))
        .pipe(replace({
            regex: '<!-- content -->',
            replace: '<!--include "../pages/service/ready.html"-->'
        }))
        .pipe(replace({
            regex: '<!-- js -->',
            replace: '<script src="../js/pages/service/ready.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>'
        }))
        .pipe(replace({
            regex: '<!-- pop -->',
            replace: '<!--include "../util/pop.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('ready.html'))
        .pipe(gulp.dest('./src/service'));
}

/**
 * 输出弹框相关页面
 */
function popHtml() {
    return gulp.src([
            './js/pages/hotel/hotelIntroduction.html',
            './js/pages/hotel/hotelFeature.html',
            './js/pages/hotel/roomFilter.html',
            './js/pages/wallet/coupon-rule.html',
            './js/pages/invite/user-invite-rule.html',
            './js/pages/invite/user-invite-log.html',
            './js/pages/invite/vip-invite-log.html',
            './js/pages/invite/share.html',
            './js/pages/register/agreement.html',
            './js/pages/assess/assess.html',
            './js/pages/index/searchLocation.html',
            './js/pages/index/midnightBanner.html',
            './js/util/contactList.html',
            './js/util/code.html',
            './js/util/card-select.html',
            './js/util/pay.html', //支付方式选择弹框
            './js/pages/user/frequent-contact-add.html',
            './js/pages/user/delivery-address-add.html',
            './js/pages/room/note.html',
            './js/pages/room/designer.html',
            './js/pages/card/card-rule.html',
            './js/pages/card/card-rule-5.html', //校园卡会员条款
            './js/pages/card/card-withdraw.html',
            './js/pages/card/lottery-log.html',
            './js/pages/card/lottery-rule.html',
            './js/pages/lottery/prizeModal.html',
            './js/pages/promotion/promotion-rule.html',
            './js/pages/promotion/shareList.html',
            './js/pages/commonweal/commonweal-pop.html',
            './js/pages/commonweal/noCard.html',
            './js/pages/card/ETF.html',
            './js/pages/cms/foundation-withdraw.html'
        ])
        .pipe(gulp.dest('./dist/util/'));
}

/**
 * 输出时间弹框相关页面
 */
function timeHtml() {
    return gulp.src(['./js/util/calendar.html', './js/util/partTime.html'])
        // .pipe(replace({
        //     regex: '<!-- filter -->',
        //     replace: '<!--include "../util/filter.html"-->'
        // }))
        // .pipe(contentIncluder({
        //     includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        // }))
        .pipe(gulp.dest('./dist/util/'));
}

/**
 * 输出图片
 */
function copyImg() {
    return gulp.src('img/**/*').pipe(gulp.dest('./dist/img/'));
}

/**
 * 输出字体
 */
function copyFonts() {
    return gulp.src('fonts/*').pipe(gulp.dest('./dist/fonts/'));
}

/**
 * 拼接html源文件
 */
gulp.task('html', gulp.parallel(
    loading,
    index,
    hotel,
    room,
    payend,
    orderList,
    order,
    submitassess,
    avatar,
    userInfo,
    userInvite,
    inviteToUser,
    vipInvite,
    inviteToVip,
    coupon,
    about,
    allianceIntro,
    joinUs,
    register1,
    register2,
    service,
    shop,
    balance,
    balanceLog,
    frequentContactList,
    invoiceList,
    invoiceApply,
    // alipayIframe,
    invoicePaySuccess,
    weixin,
    franchisee,
    franchiseeNote,
    franchiseeToday,
    franchiseeMonth,
    franchiseeIncome,
    franchiseeRecord,
    cardList,
    cardBuy,
    cardShow,
    cardDetail,
    cardLog,
    cardBind,
    cardIntroduce,
    cardSafe,
    // cardIntroducePicture,
    cardPromotion,
    promotionApply,
    promotionDetail,
    promotionShare,
    lottery,
    login,
    homepage,
    nav,
    roomList,
    roomDetails,
    roomRepair,
    roomBan,
    consume,
    consumeTable,
    consumeArticle,
    consumeBedding,
    consumeAsset,
    finance,
    financeTable,
    invoice,
    invoiceDetail,
    commodityOut,
    toolwasteOut,
    salaryOut,
    energyOut,
    deviceOut,
    taxOut,
    otherOut,
    detailOut,
    staff,
    staffDetail,
    assessForm,
    paibanForm,
    addstaffForm,
    arrangementToday,
    statistic,
    warehouse,
    warehouseList,
    warehouseFormIn,
    warehouseFormOut,
    warehouseFormAllocate,
    warehouseFormStock,
    discover,
    memberCenter,
    special,
    alipay,
    closePage,
    auditList,
    commonwealIntro,
    commonwealDetail,
    commonwealRecord,
    cmsNav,
    cmsDonation,
    cmsAccount,
    cmsFavoreeList,
    cmsSubList,
    subAdd,
    favoree,
    editFund,
    serviceOrderList,
    serviceProcess,
    serviceReady
));

function watchForReload() {
    gulp.watch('js/**/*', gulp.series(
        gulp.parallel(md5JS, popHtml, timeHtml),
        'html',
        md5Rev,
        reload
    ));
    gulp.watch('sass/**', gulp.series(sassCompile, reload));
    gulp.watch('css/**', gulp.series(md5CSS, 'html', md5Rev, reload));
    gulp.watch('img/**', gulp.series(copyImg, reload));
}

function reload() {
    return gulp.src('dist/')
        .pipe(connect.reload());
}

/**
 * 开发使用
 */
gulp.task('default', gulp.parallel(openConnect, watchForReload));

/**
 * producttion build，加MD5，替换html里面的js、css文件名，并输出
 */
gulp.task('build', gulp.series(
    clean,
    sassCompile,
    gulp.parallel(md5CSS, md5JS, popHtml, timeHtml, copyImg, copyFonts),
    'html',
    md5Rev
));
