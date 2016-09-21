// (function (factory) {
//   if (typeof define === 'function' && define.amd) {
//     // AMD. Register as anonymous module.
//     define(['jquery'], factory);
//   } else if (typeof exports === 'object') {
//     // Node / CommonJS
//     factory(require('jquery'));
//   } else {
//     // Browser globals.
//     factory(jQuery);
//   }
// })(function ($) {

'use strict';

var console = window.console || { log: function() {} };

function CropAvatar($element) {
    this.$container = $element;

    // this.$avatarView = this.$container.find('.avatar-view');
    // this.$avatar = this.$avatarView.find('img');
    // this.$avatarModal = this.$container.find('#avatar-modal');
    this.$loading = this.$container.find('.loading');

    this.$avatarForm = this.$container.find('.avatar-form');
    this.$avatarUpload = this.$avatarForm.find('.avatar-upload');
    this.$avatarSrc = this.$avatarForm.find('.avatar-src');
    this.$avatarData = this.$avatarForm.find('.avatar-data');
    this.$avatarInput = this.$avatarForm.find('.avatar-input');
    // this.$avatarSave = this.$avatarForm.find('.avatar-save');
    // this.$avatarBtns = this.$avatarForm.find('.avatar-btns');

    this.$avatarWrapper = this.$container.find('.avatar-wrapper');
    // this.$avatarPreview = this.$container.find('.avatar-preview');
    this.$avatarBtn = this.$container.find('#submitDataURL');
    this.init();
}

CropAvatar.prototype = {
    constructor: CropAvatar,

    support: {
        fileList: !!$('<input type="file">').prop('files'),
        blobURLs: !!window.URL && URL.createObjectURL,
        formData: !!window.FormData
    },

    init: function() {
        this.support.datauri = this.support.fileList && this.support.blobURLs;

        if (!this.support.formData) {
            this.initIframe();
        }

        // this.initTooltip();
        // this.initModal();
        this.addListener();
    },

    addListener: function() {
        // this.$avatarView.on('click', $.proxy(this.click, this));
        this.$avatarInput.on('change', $.proxy(this.change, this));
        this.$avatarForm.on('submit', $.proxy(this.submit, this));
        // this.$avatarBtns.on('click', $.proxy(this.rotate, this));
    },

    // initTooltip: function () {
    //   this.$avatarView.tooltip({
    //     placement: 'bottom'
    //   });
    // },

    // initModal: function () {
    //   this.$avatarModal.modal({
    //     show: false
    //   });
    // },

    // initPreview: function () {
    //   var url = this.$avatar.attr('src');

    //   this.$avatarPreview.html('<img src="' + url + '">');
    // },

    initIframe: function() {
        var target = 'upload-iframe-' + (new Date()).getTime();
        var $iframe = $('<iframe>').attr({
            name: target,
            src: ''
        });
        var _this = this;

        // Ready ifrmae
        $iframe.one('load', function() {

            // respond response
            $iframe.on('load', function() {
                var data;

                try {
                    data = $(this).contents().find('body').text();
                } catch (e) {
                    console.log(e.message);
                }

                if (data) {
                    try {
                        data = $.parseJSON(data);
                    } catch (e) {
                        console.log(e.message);
                    }

                    _this.submitDone(data);
                } else {
                    _this.submitFail('Image upload failed!');
                }

                _this.submitEnd();

            });
        });

        this.$iframe = $iframe;
        this.$avatarForm.attr('target', target).after($iframe.hide());
    },

    click: function() {
        // this.$avatarModal.modal('show');
        // this.initPreview();
    },

    change: function() {
        var files;
        var file;

        if (this.support.datauri) {
            files = this.$avatarInput.prop('files');

            if (files.length > 0) {
                file = files[0];

                if (this.isImageFile(file)) {
                    if (this.url) {
                        URL.revokeObjectURL(this.url); // Revoke the old one
                    }

                    this.url = URL.createObjectURL(file);
                    this.startCropper();
                }
            }
        } else {
            file = this.$avatarInput.val();

            if (this.isImageFile(file)) {
                this.syncUpload();
            }
        }
    },

    submit: function() {
        if (!this.$avatarSrc.val() && !this.$avatarInput.val()) {
            return false;
        }

        if (this.support.formData) {
            this.ajaxUpload();
            return false;
        }
    },

    // rotate: function (e) {
    //   var data;

    //   if (this.active) {
    //     data = $(e.target).data();

    //     if (data.method) {
    //       this.$img.cropper(data.method, data.option);
    //     }
    //   }
    // },

    isImageFile: function(file) {
        if (file.type) {
            return /^image\/\w+$/.test(file.type);
        } else {
            return /\.(jpg|jpeg|png|gif)$/.test(file);
        }
    },

    startCropper: function() {
        var _this = this;

        if (this.active) {
            this.$img.cropper('replace', this.url);
        } else {
            this.$img = $('<img src="' + this.url + '">');
            this.$avatarWrapper.empty().html(this.$img);
            this.$img.cropper({
                aspectRatio: 1,
                // preview: this.$avatarPreview.selector,
                crop: function(e) {
                    var json = [
                        '{"x":' + e.x,
                        '"y":' + e.y,
                        '"height":' + e.height,
                        '"width":' + e.width,
                        '"rotate":' + e.rotate + '}'
                    ].join();

                    _this.$avatarData.val(json);
                }
            });

            this.active = true;
        }

        // this.$avatarModal.one('hidden.bs.modal', function () {
        //   _this.$avatarPreview.empty();
        //   _this.stopCropper();
        // });
    },

    stopCropper: function() {
        if (this.active) {
            this.$img.cropper('destroy');
            this.$img.remove();
            this.active = false;
        }
    },

    ajaxUpload: function() {
        var url = this.$avatarForm.attr('action');
        var data = new FormData(this.$avatarForm[0]);
        console.log(data);
        var _this = this;

        $.ajax(url, {
            type: 'post',
            data: data,
            dataType: 'json',
            processData: false,
            contentType: false,

            beforeSend: function() {
                _this.submitStart();
            },

            success: function(data) {
                _this.submitDone(data);
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                _this.submitFail(textStatus || errorThrown);
            },

            complete: function() {
                _this.submitEnd();
            }
        });
    },

    syncUpload: function() {
        this.$avatarSave.click();
    },

    submitStart: function() {
        this.$loading.fadeIn();
    },

    submitDone: function(data) {
        console.log(data);

        if ($.isPlainObject(data) && data.state === 200) {
            if (data.result) {
                this.url = data.result;

                if (this.support.datauri || this.uploaded) {
                    this.uploaded = false;
                    this.cropDone();
                } else {
                    this.uploaded = true;
                    this.$avatarSrc.val(this.url);
                    this.startCropper();
                }

                this.$avatarInput.val('');
            } else if (data.message) {
                this.alert(data.message);
            }
        } else {
            this.alert('Failed to response');
        }
    },

    submitFail: function(msg) {
        this.alert(msg);
    },

    submitEnd: function() {
        this.$loading.fadeOut();
    },

    cropDone: function() {
        this.$avatarForm.get(0).reset();
        // this.$avatar.attr('src', this.url);
        this.stopCropper();
        // this.$avatarModal.modal('hide');
    },

    alert: function(msg) {
        var $alert = [
            '<div class="alert alert-danger avatar-alert alert-dismissable">',
            '<button type="button" class="close" data-dismiss="alert">&times;</button>',
            msg,
            '</div>'
        ].join('');

        this.$avatarUpload.after($alert);
    },

    //通过 canvas 获取图片二进制数据
    getCanvasDataURL: function() {
        if (!this.$avatarSrc.val() && !this.$avatarInput.val()) {
            alert("请先上传图片");
            this.$avatarBtn.attr("disabled", true);
            return '';
        }
        
        return this.$img.cropper('getCroppedCanvas').toDataURL('image/jpeg');
    },

}
// });

var bs_cropper;
var user = {
  openUserInfo: 1
};
Storage.setLocal('user', user);

var vmAvatar = avalon.define({
    $id: 'avatar',
    headImg: '',
    isEdit: false,
    pickImg: function() {
        var $input = $("#avatarInput");

        if ($input) {
            $input.click();
        }
    },
    cancelEdit: function() {
        // vmAvatar.isEdit = false;
        // bs_cropper.stopCropper();
        location.href = "index.html";
    },
    isUpload: false,
    upload: function() {
        //显示loading遮罩
        bs_cropper.submitStart();
        vmAvatar.isUpload = true;
        
        var dataURL = encodeURI(bs_cropper.getCanvasDataURL());

        $.ajax({
            type: 'post',
            url: urln.UploadFileFromBase64,
            data: { "data": dataURL },
            dataType: "json",
            success: function(data) {
                console.log(data.Message);
                if (data.Status == 1) {
                    //上传成功，调接口保存url
                    ajaxJsonp({
                        url: urls.saveUserInfo,
                        data: {
                            headUrl: data.Data.thuUrl
                        },
                        successCallback: function(json) {
                            bs_cropper.submitEnd();

                            if (json.status === 1) {
                                // vmAvatar.isUpload = false;
                                // //切换到头像展示模式，显示 zip 格式图
                                // vmAvatar.headImg = data.Data.zipUrl;
                                // vmAvatar.isEdit = false;
                                // bs_cropper.stopCropper();

                                // //my.js 读下接口，更新本底数据
                                // vmSide.getUserInfo();

                                //更新本地头像数据
                                var user = {
                                  headImg: data.Data.thuUrl,
                                };
                                Storage.setLocal('user', user);

                                location.href = "index.html";
                            } else {
                                alert(json.message);
                                vmAvatar.isUpload = false;
                            }
                        }
                    });
                } else {
                  bs_cropper.submitEnd();
                  alert(data.Message);
                  vmAvatar.isUpload = false;
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.responseText + "\n" + textStatus + "\n" + errorThrown);
            }
        });
    }
});

vmAvatar.headImg = Storage.getLocal('user').headImg.replace('100.', 'ZIP.');

$(function() {
    $('.avatar-input').on('change', function() {
        //选择图片后显示编辑面板
        vmAvatar.isEdit = true;
    });

    bs_cropper = new CropAvatar($('#crop-avatar'));
});