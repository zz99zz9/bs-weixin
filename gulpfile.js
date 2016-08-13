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
        //.pipe(minifycss())//执行压缩
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'))
        .on('finish', callback)
}

/**
 * 给js文件加 md5
 */
function md5JS(){
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
    return gulp.src(['./rev/**/*.json', './src/**/*.html'])//- 读取 rev-manifest.json 文件以及需要进行js、css名替换的文件
        .pipe(revCollector())//- 执行文件内js、css名的替换
        .pipe(gulp.dest('./dist'));//- 替换后的文件输出的目录
}

//首页
function index() {
    return gulp.src('./js/layout/index.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- roomSlide -->', replace: '<!--include "../util/roomSlide.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- slide-info -->',
            replace: '<!--include "../util/roomSlide-hotel.html"-->'
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
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- css -->', replace: '<link rel="stylesheet" href="css/swiper.min.css">\n<link rel="stylesheet" href="css/hotel.css">' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/hotel/hotel.html"-->' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/lib/swiper.min.js"></script>\n'
            + '<script src="js/util/filter.js"></script>\n<script src="js/pages/hotel/vmodel.js"></script>\n'
            + '<script src="js/util/calendar.js"></script>\n<script src="js/util/partTime.js"></script>' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({ regex: '<!-- roomSlide -->', replace: '<!--include "../util/roomSlide.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- slide-info -->',
            replace: '<!--include "../util/roomSlide-room.html"-->'
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link rel="stylesheet" href="css/swiper.min.css">\n<link rel="stylesheet" href="css/room.css">' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/room/room.html"-->' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/lib/mui.zoom.js"></script>\n<script src="js/lib/mui.previewimage.js"></script>\n<script src="js/lib/swiper.min.js"></script>\n'
            + '<script src="js/pages/room/vmodel.js"></script>\n<script src="js/util/calendar.js"></script>\n<script src="js/util/partTime.js"></script>\n'
            + '<script src="js/util/contactList.js"></script>' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({ regex: '<!-- roomSlide -->', replace: '<!--include "../util/roomSlide.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({
            regex: '<!-- slide-info -->',
            replace: '<!--include "../util/roomSlide-hotel.html"-->'
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

//房间便利设施页面
// function facilities() {
//     return gulp.src('./js/pages/room/facilities.html')
//         .pipe(gulp.dest('./src'));
// }

//房间用品
// function article() {
//     return gulp.src('./js/layout/shell.html')
//         .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"--> \n <!--include "../pages/user/popover.html"-->' }))
//         .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/room/vmodel-article.js"></script>' }))
//         .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/room/article.html"-->' }))
//         .pipe(contentIncluder({
//             includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
//         }))
//         .pipe(replace({ regex: '<!-- info -->等待加载……', replace: '<!--include "../pages/room/article-info.html"-->' }))
//         .pipe(contentIncluder({
//             includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
//         }))
//         .pipe(replace({
//             regex: '<button class="popover-closeButton"></button>',
//             replace: '<!--include "../pages/room/pop-btn.html"-->'
//         }))
//         .pipe(contentIncluder({
//             includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
//         }))
//         .pipe(rename('article.html'))
//         .pipe(gulp.dest('./src'));
// }

// //下单支付页面
// function pay() {
//     return gulp.src('./js/layout/shell.html')
//         .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/room/vmodel-pay.js"></script>' }))
//         .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/room/pay.html"-->' }))
//         .pipe(contentIncluder({
//             includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
//         }))
//         .pipe(rename('pay.html'))
//         .pipe(gulp.dest('./src'));
// }

// //常用联系人列表页
// function contactList() {
//     return gulp.src('./js/layout/shell.html')
//         .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
//         .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/contact/vmodel-list.js"></script>' }))
//         .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/contact/contactList.html"-->' }))
//         .pipe(replace({ regex: '<h1 id="headerReplace" class="mui-title"></h1>', replace: '<h1 id="headerReplace" class="mui-title">我的联系人</h1>' }))
//         .pipe(contentIncluder({
//             includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
//         }))
//         .pipe(rename('contactList.html'))
//         .pipe(gulp.dest('./src'));
// }

// //常用联系人详情页
// function contact() {
//     return gulp.src('./js/layout/shell.html')
//         .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
//         .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/contact/vmodel.js"></script>' }))
//         .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/contact/contact.html"-->' }))
//         .pipe(replace({ regex: '<h1 id="headerReplace" class="mui-title"></h1>', replace: '<h1 id="headerReplace" class="mui-title">联系人详情</h1>' }))
//         .pipe(contentIncluder({
//             includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
//         }))
//         .pipe(rename('contact.html'))
//         .pipe(gulp.dest('./src'));
// }

//订单列表页
function orderList() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/order/vmodel-orderList.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/order/orderList.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('orderList.html'))
        .pipe(gulp.dest('./src'));
}

//订单详情页
function order() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/order/vmodel-order.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/order/order.html"-->' }))
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
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/order/vmodel-payend.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/order/payend.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('payend.html'))
        .pipe(gulp.dest('./src'));
}

//用户提交评论
function submitassess() {
    return gulp.src('./js/layout/shell.html')
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/assess/sub.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/assess/submitassess.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('submitassess.html'))
        .pipe(gulp.dest('./src'));
}

//个人信息
function userInfo() {
    return gulp.src('./js/layout/shell.html')
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/lib/mui.view.js"></script> \n <script src="js/pages/user/vmodel-info.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/user/user-info.html"-->' }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">个人信息</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('user-info.html'))
        .pipe(gulp.dest('./src'));
}
//邀请好友
function userInvite() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/invite/vmodel-invite.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/invite/user-invite.html"-->' }))
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
//约会基金
function wallet() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/wallet/wallet.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/wallet/wallet.html"-->' }))
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
        .pipe(rename('wallet.html'))
        .pipe(gulp.dest('./src'));
}
// //我的发票
// function userBill() {
//     return gulp.src('./js/layout/shell.html')
//         //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
//         .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/user/vmodel-bill.js"></script>' }))
//         .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/user/user-bill.html"-->' }))
//         // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">我的发票</h1>'}))
//         .pipe(contentIncluder({
//             includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
//         }))
//         .pipe(rename('user-bill.html'))
//         .pipe(gulp.dest('./src'));
// }
//关于
function about() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- css -->', replace: '<link rel="stylesheet" href="css/swiper.min.css">' }))
        //.pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/about.html"-->' }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">关于因爱</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('about.html'))
        .pipe(gulp.dest('./src'));
}


//入住人列表页
function frequentContactList() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/user/vmodel-contact.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/user/frequent-contact-list.html"-->' }))
        .pipe(replace({ regex: '<h1 id="headerReplace" class="mui-title"></h1>', replace: '<h1 id="headerReplace" class="mui-title">入住人信息管理</h1>' }))
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
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/user/vmodel-invoice.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/user/invoice-list.html"-->' }))
        .pipe(replace({ regex: '<h1 id="headerReplace" class="mui-title"></h1>', replace: '<h1 id="headerReplace" class="mui-title">发票管理</h1>' }))
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
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/user/vmodel-invoice-apply.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/user/invoice-apply.html"-->' }))
        .pipe(replace({ regex: '<h1 id="headerReplace" class="mui-title"></h1>', replace: '<h1 id="headerReplace" class="mui-title">申请发票</h1>' }))
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

//支付宝支付
function alipayIframe() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/alipay/vmodel-alipay.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/alipay/alipay-iframe.html"-->' }))
        .pipe(replace({ regex: '<h1 id="headerReplace" class="mui-title"></h1>', replace: '<h1 id="headerReplace" class="mui-title">支付宝支付</h1>' }))
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

//支付发票快递费用成功页
function invoicePaySuccess() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/user/vmodel-invoice-pay-success.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/user/invoice-pay-success.html"-->' }))
        .pipe(replace({ regex: '<h1 id="headerReplace" class="mui-title"></h1>', replace: '<h1 id="headerReplace" class="mui-title">支付成功</h1>' }))
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

//微信自动登录处理页面
function weixin() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/proxy/vmodel-weixin.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/proxy/weixin.html"-->' }))
        .pipe(replace({ regex: '<h1 id="headerReplace" class="mui-title"></h1>', replace: '<h1 id="headerReplace" class="mui-title">加载中</h1>' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('weixin.html'))
        .pipe(gulp.dest('./src'));
}

//注册
function register1() {
    return gulp.src('./js/layout/shell-register.html')
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/register/register-1.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/register/register-1.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('register-1.html'))
        .pipe(gulp.dest('./src'));
}
function register2() {
    return gulp.src('./js/layout/shell-register.html')
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/register/register-2.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/register/register-2.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('register-2.html'))
        .pipe(gulp.dest('./src'));
}

/*
    =======================================================
                        客控模块相关页面
    =======================================================
*/
//服务页
function service() {
    return gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- css -->', replace: '<link rel="stylesheet" href="../css/swiper.min.css">' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/service/service.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/lib/swiper.min.js"></script>\n<script src="../js/pages/service/service.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->\n<!--include "../pages/user/popover.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({ regex: '<!-- info -->等待加载……', replace: '<!--include "../pages/room/article-info.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link rel="stylesheet" href="../css/swiper.min.css">' }))
        .pipe(replace({
            regex: '<h1 id="headerReplace" class="mui-title">标题</h1>',
            replace: '<h1 id="headerReplace" class="mui-title">合作商家</h1>'
        }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/service/shop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/lib/swiper.min.js"></script>\n<script src="../js/pages/service/shop.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('shop.html'))
        .pipe(gulp.dest('./src'));
}

/*
    =======================================================
                        管理模块相关页面
    =======================================================
*/
//管理登录
function login() {
    return gulp.src('./js/layout/shell-register.html')
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/login.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />\n<link href="../css/report.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/homepage/homepage.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/lib/mui.picker.all.js"></script>\n<script src="../js/pages/manage/homepage/homepage.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/nav.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/nav.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({ regex: '<!-- nav -->', replace: '<!--include "../util/nav.string"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/room/room.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/room/room.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/room/room-details.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/room/room-details.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/room/room-repair.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/room/room-repair.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/room/room-details.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/room/room-ban.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../util/nav.string"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/consume/nav.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../util/table.string"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/consume/table.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/consume/article.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/consume/article.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/consume/bedding.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/consume/bedding.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/consume/asset.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/consume/asset.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/finance/finance.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/lib/mui.picker.all.js"></script>\n<script src="../js/pages/manage/finance/nav.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../util/table.string"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/finance/invoice.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/finance/invoice-detail.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/finance/invoice-detail.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../util/table.string"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/finance/table.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/finance/commodity-out.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/finance/commodity-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/finance/toolwaste-out.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/finance/toolwaste-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/finance/salary-out.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/finance/salary-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/finance/energy-out.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/finance/energy-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/finance/device-out.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/finance/device-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/finance/tax-out.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/finance/tax-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/finance/other-out.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/finance/other-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/finance/detail-out.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/finance/detail-out.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/staff/staff.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/staff/staff.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/staff/paiban-form.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/staff/paiban-form.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/staff/addstaff-form.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/staff/addstaff-form.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/staff/arrangement-today.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/staff/arrangement-today.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />\n<link href="../css/report.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/statistic/statistic.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/lib/mui.picker.all.js"></script>\n<script src="../js/pages/manage/statistic/statistic.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/staff/detail.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/staff/detail.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/staff/assess-form.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/staff/assess-form.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../util/nav.string"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/warehouse/nav.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/warehouse/list.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/warehouse/list.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/warehouse/warehouse-form-in.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/warehouse/warehouse-form-in.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.poppicker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/warehouse/warehouse-form-out.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/warehouse/warehouse-form-out.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/warehouse/warehouse-form-allocate.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/warehouse/warehouse-form-allocate.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
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
        .pipe(replace({ regex: '<!-- css -->', replace: '<link href="../css/mui.picker.all.css" rel="stylesheet" />' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/warehouse/warehouse-form-stock.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="../js/pages/manage/warehouse/warehouse-form-stock.js"></script>\n<script src="../js/lib/mui.picker.all.js"></script>' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('warehouse-form-stock.html'))
        .pipe(gulp.dest('./src/manage'));
}


/**
 * 输出弹框相关页面
 */
function popHtml() {
    return gulp.src([
            './js/pages/invite/rule.html',
            './js/pages/invite/oldInvite.html',
            './js/pages/invite/share.html',
            './js/pages/register/agreement.html',
            './js/pages/assess/assess.html',
            './js/pages/index/searchLocation.html',
            './js/util/contactList.html',
            './js/pages/user/frequent-contact-add.html',
            './js/pages/user/delivery-address-add.html',
            './js/pages/room/note.html'])
        .pipe(gulp.dest('./dist/util/'));
}

/**
 * 输出时间弹框相关页面
 */
function timeHtml() {
    return gulp.src(['./js/util/calendar.html','./js/util/partTime.html'])
        .pipe(replace({ regex: '<!-- filter -->', replace: '<!--include "../util/filter.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
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
    index,
    hotel,
    room,
    payend,
    orderList,
    order,
    submitassess,
    userInfo,
    userInvite,
    wallet,
    about,
    register1,
    register2,
    service,
    shop,
    frequentContactList,
    invoiceList,
    invoiceApply,
    alipayIframe,
    invoicePaySuccess,
    weixin,
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
    warehouseFormStock
));

function watchForReload() {
    gulp.watch('js/**/*', gulp.series(
        gulp.parallel(md5JS, popHtml, timeHtml),
        'html',
        md5Rev
    ));
    gulp.watch('sass/**', sassCompile);
    gulp.watch('css/**', gulp.series(md5CSS, 'html', md5Rev));
    gulp.watch('img/**', copyImg);
    gulp.watch("dist/**/*").on('change', function(file) {
        gulp.src('dist/')
            .pipe(connect.reload());
    });
}
gulp.task(watchForReload);

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
