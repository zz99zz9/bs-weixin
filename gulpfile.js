var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var replace = require('gulp-regex-replace'),
    contentIncluder = require('gulp-content-includer');

gulp.task('sass', function() {
    sass('./sass/mui.scss')
        .on('error', sass.logError)
        //.pipe(minifycss())//执行压缩
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('minifycss', function() {
    gulp.src('./css/**.css') //压缩的文件
        //.pipe(minifycss())   //执行压缩
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css')); //输出文件夹
});

gulp.task('connect', function() {
    connect.server({
        root: './dist',
        livereload: true,
        port: 8010
    });
});

//首页
gulp.task('index', function() {
    gulp.src('./js/layout/index.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        // .pipe(replace({ regex: '<!-- info -->等待加载……', replace: '<!--include "../pages/index/searchLocation.html"-->' }))
        // .pipe(contentIncluder({
        //     includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        // }))
        .pipe(replace({
            regex: '<button class="popover-closeButton"></button>',
            replace: '<!--include "../util/popoverBtnOK.html"-->'
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//房间列表
gulp.task('rooms', function() {
    gulp.src('./js/layout/shell-top.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/room/vmodel-rooms.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/room/rooms.html"-->' }))
        .pipe(replace({ regex: '<!-- tab -->', replace: '<!--include "../pages/room/room-type.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({ regex: '<!-- roomSlide -->', replace: '<!--include "../util/roomSlide.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('rooms.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//筛选页面
// gulp.task('filter',function() {
//     gulp.src('./js/layout/shell.html')
//         .pipe(replace({regex:'<!-- pop -->', replace:'<!--include "../util/pop.html"-->'}))
//         .pipe(replace({regex:'<!-- js -->', replace:'<script src="js/pages/room/vmodel-filter.js"></script>'}))
//         .pipe(replace({regex:'<!-- content -->', replace:'<!--include "../pages/room/filter.html"-->'}))
//         .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<!--include "../pages/room/room-type.html"-->'}))
//         .pipe(contentIncluder({
//             includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
//         }))
//         .pipe(rename('filter.html'))
//         .pipe(gulp.dest('./dist'));
//         process.stdout.write('\x07');
// });

//房间页面
gulp.task('room', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- css -->', replace: '<link rel="stylesheet" href="css/swiper.min.css">' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/lib/mui.zoom.js"></script>\n<script src="js/lib/mui.previewimage.js"></script>\n<script src="js/lib/swiper.min.js"></script>\n<script src="js/pages/room/vmodel.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/room/room.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(replace({ regex: '<!-- roomSlide -->', replace: '<!--include "../util/roomSlide.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('room.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//房间便利设施页面
gulp.task('facilities', function() {
    gulp.src('./js/pages/room/facilities.html')
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//用户提交评论
gulp.task('submitassess', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/assess/sub.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/assess/submitassess.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('submitassess.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//房间用品
gulp.task('article', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"--> \n <!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/room/vmodel-article.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/room/article.html"-->' }))
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
        .pipe(rename('article.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//下单支付页面
gulp.task('pay', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/room/vmodel-pay.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/room/pay.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('pay.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//下单成功页面
gulp.task('payend', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/room/vmodel-payend.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/room/payend.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('payend.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//常用联系人列表页
gulp.task('contactList', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/contact/vmodel-list.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/contact/contactList.html"-->' }))
        .pipe(replace({ regex: '<h1 id="headerReplace" class="mui-title"></h1>', replace: '<h1 id="headerReplace" class="mui-title">我的联系人</h1>' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('contactList.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//常用联系人详情页
gulp.task('contact', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/contact/vmodel.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/contact/contact.html"-->' }))
        .pipe(replace({ regex: '<h1 id="headerReplace" class="mui-title"></h1>', replace: '<h1 id="headerReplace" class="mui-title">联系人详情</h1>' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('contact.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//订单列表页
gulp.task('orderList', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/room/vmodel-orderList.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/room/orderList.html"-->' }))
        .pipe(replace({ regex: '<h1 id="headerReplace" class="mui-title"></h1>', replace: '<h1 id="headerReplace" class="mui-title">我的订单</h1>' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('orderList.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//订单详情页
gulp.task('order', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/room/vmodel-order.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/room/order.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('order.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//个人信息
gulp.task('user-info', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/lib/mui.view.js"></script> \n <script src="js/pages/user/vmodel-info.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/user/user-info.html"-->' }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">个人信息</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('user-info.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});
//邀请好友
gulp.task('user-invite', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->\n <!--include "../pages/user/popover.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/invite/vmodel-invite.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/invite/user-invite.html"-->' }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">邀请好友</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('user-invite.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});
//约会基金
gulp.task('wallet', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/wallet/wallet.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/wallet/wallet.html"-->' }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">体验基金</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('wallet.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});
//我的发票
gulp.task('user-bill', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/user/vmodel-bill.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/user/user-bill.html"-->' }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">我的发票</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('user-bill.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});
//关于因爱
gulp.task('about', function() {
    gulp.src('./js/layout/shell.html')
        .pipe(replace({ regex: '<!-- css -->', replace: '<link rel="stylesheet" href="css/swiper.min.css">' }))
        .pipe(replace({ regex: '<!-- pop -->', replace: '<!--include "../util/pop.html"-->' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/about.html"-->' }))
        // .pipe(replace({regex:'<h1 id="headerReplace" class="mui-title"></h1>', replace:'<h1 id="headerReplace" class="mui-title">关于因爱</h1>'}))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('about.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});
//注册
gulp.task('register', function() {
    gulp.src('./js/layout/shell-register.html')
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
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
    gulp.src('./js/layout/shell-register.html')
        .pipe(replace({ regex: '<!-- js -->', replace: '<script src="js/pages/register/register-2.js"></script>' }))
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/register/register-2.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('register-2.html'))
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

/*
    =======================================================
                        客控模块相关页面
    =======================================================
*/
//服务页
gulp.task('service', function() {
    gulp.src('./js/layout/shell.html')
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
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

//店铺列表页
gulp.task('shop', function() {
    gulp.src('./js/layout/shell.html')
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
        .pipe(gulp.dest('./dist'));
    process.stdout.write('\x07');
});

/*
    =======================================================
                        管理模块相关页面
    =======================================================
*/
//管理登录
gulp.task('login', function() {
    gulp.src('./js/layout/shell-register.html')
        .pipe(replace({ regex: '<!-- content -->', replace: '<!--include "../pages/manage/login.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('login.html'))
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});


//管理模式欢迎页
gulp.task('homepage', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//酒店管理导航页
gulp.task('nav', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//客房管理
gulp.task('roomList', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//客房详情
gulp.task('room-details', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//报修表单
gulp.task('room-repair', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//停用表单
gulp.task('room-ban', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//耗材管理导航页
gulp.task('consume', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//耗材管理表格页
gulp.task('consume-table', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//耗材管理-日耗品详情页
gulp.task('consume-article', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//耗材管理-床上用品详情页
gulp.task('consume-bedding', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//耗材管理-固定资产详情页
gulp.task('consume-asset', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//财务管理表格页
gulp.task('finance', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//发票管理表格页
gulp.task('invoice', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//发票详情表单页
gulp.task('invoice-detail', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//财务管理页
gulp.task('finance-table', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//财务管理-日用品支出详情
gulp.task('commodity-out', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//财务管理-物品损坏详情
gulp.task('toolwaste-out', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//财务管理-人员工资详情
gulp.task('salary-out', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//财务管理-能耗详情
gulp.task('energy-out', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//财务管理-设备支出
gulp.task('device-out', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//财务管理-税务支出
gulp.task('tax-out', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//财务管理-其他支出
gulp.task('other-out', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//财务管理-支出修改明细
gulp.task('detail-out', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//人员管理-导航页
gulp.task('staff', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//人员管理-排班表
gulp.task('paiban-form', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//人员管理-添加人员
gulp.task('addstaff-form', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//人员管理-当天排班
gulp.task('arrangement-today', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});
//统计报表
gulp.task('statistic', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//人员管理-员工详情页
gulp.task('staff-detail', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//人员管理-提交评价页
gulp.task('assess-form', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//仓库管理导航页
gulp.task('warehouse', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//仓库管理表单页
gulp.task('warehouse-list', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//入库详情、添加页
gulp.task('warehouse-form-in', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//出库详情、添加页
gulp.task('warehouse-form-out', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//调拨详情、添加页
gulp.task('warehouse-form-allocate', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

//仓库盘点详情、添加页
gulp.task('warehouse-form-stock', function() {
    gulp.src('./js/layout/shell-manage.html')
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
        .pipe(gulp.dest('./dist/manage'));
    process.stdout.write('\x07');
});

gulp.task('txt-copy', function() {
    gulp.src('./js/pages/invite/rule.html').pipe(gulp.dest('./dist'));
    gulp.src('./js/pages/invite/oldInvite.html').pipe(gulp.dest('./dist'));
    gulp.src('./js/pages/invite/share.html').pipe(gulp.dest('./dist'));
    gulp.src('./js/pages/register/agreement.html').pipe(gulp.dest('./dist'));
    gulp.src('./js/pages/assess/assess.html').pipe(gulp.dest('./dist'));
    gulp.src('./js/pages/designer/designer.html').pipe(gulp.dest('./dist'));
    gulp.src('./js/pages/index/searchLocation.html').pipe(gulp.dest('./dist'));
    gulp.src('./js/util/calendar.html')
        .pipe(replace({ regex: '<!-- filter -->', replace: '<!--include "../util/filter.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(gulp.dest('./dist'));
    gulp.src('./js/util/partTime.html')
        .pipe(replace({ regex: '<!-- filter -->', replace: '<!--include "../util/filter.html"-->' }))
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(gulp.dest('./dist'));
})

gulp.task('copy', ['sass', 'minifycss'], function() {
    gulp.src('img/**/*').pipe(gulp.dest('./dist/img/'));
    gulp.src('uploads/*').pipe(gulp.dest('./dist/uploads/'));
    gulp.src('js/**/*.js').pipe(gulp.dest('./dist/js/'));
    gulp.src('fonts/*').pipe(gulp.dest('./dist/fonts/'));
    //gulp.src('css/*.css').pipe(gulp.dest('./dist/css/'));
    process.stdout.write('\x07');
});

gulp.task('manage', [
    'login',
    'homepage',
    'nav',
    'roomList',
    'room-details',
    'room-repair',
    'room-ban',
    'consume',
    'consume-table',
    'consume-article',
    'consume-bedding',
    'consume-asset',
    'finance',
    'finance-table',
    'invoice',
    'invoice-detail',
    'commodity-out',
    'toolwaste-out',
    'salary-out',
    'energy-out',
    'device-out',
    'tax-out',
    'other-out',
    'detail-out',
    'staff',
    'staff-detail',
    'assess-form',
    'paiban-form',
    'addstaff-form',
    'arrangement-today',
    'statistic',
    'warehouse',
    'warehouse-list',
    'warehouse-form-in',
    'warehouse-form-out',
    'warehouse-form-allocate',
    'warehouse-form-stock'
]);

gulp.task('all', [
    'index',
    'rooms',
    'room',
    'facilities',
    'submitassess',
    'article',
    'pay',
    'payend',
    'contactList',
    'contact',
    'orderList',
    'order',
    'user-info',
    'user-bill',
    'user-invite',
    'wallet',
    'about',
    'register',
    'service',
    'shop',
    'manage',
    'txt-copy',
    'copy'
]);

gulp.task('watchJS', function() {
    gulp.watch('js/**/*', ['all']);
});

gulp.task('js', function() {
    gulp.src('dist/**/*')
        .pipe(connect.reload());
});

gulp.task('watchForReload', function() {
    gulp.watch('js/**/*', ['all', 'js']);
    gulp.watch('sass/**', ['sass']);
    gulp.watch('css/**', ['minifycss']);
    gulp.watch('img/**', ['copy']);
});

gulp.task('default', ['connect', 'watchForReload']);
