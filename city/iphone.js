/*
 *    tpl 和 css可以通过inline方式硬编码过来，这样可以做二次压缩和语法检测，比较方便,暂时还未提供
 *    另外组件怎么知道那些阿拉丁以及模块在使用呢？可以通过检测__inline__和use方法？提供两种引用方式
 *
 */
/**
 * <p>cheng
 * 	中间页组件提供以下功能
 * 	1 统一的后退和交互风格（包括整体样式，头部固定等, 另外头部的点击应该有点击日志的功能支持）
 * 	2 统一的hash管理
 * @author mengqinghui
 * @date 2014/07/21
 * @desc 作为弹出层
 * @param
 *     @cfg - object
 *
 */
B.COCO_UI.createUI = function(name, props) {
	if(B.COCO_UI[name]) {
		return false;
	}	
	props = props || {};
	B.COCO_UI[name] = function(cfg) {
		props.init && props.init.call(this, cfg);
	};
	var prototype = B.COCO_UI[name].prototype;
	$.extend(prototype, props);
};
B.COCO_UI.createUI('middle', {
	module:'middle', //模块名，中间页通常和其他模块搭配使用，module在这里主要是为了生成唯一的hash名称做准备的
    init: function(cfg) {
        this.config = $.extend({
			title: '',
			leftbtn: '返回',
			onLeftBtnClick: function() {},
			rightbtn: '',
			onRightBtnClick: function() {},
			body: ''
        }, cfg);
        this.run(this.config);
		this.hashChange();
		this.bindEvent();
    },
    container: null,
css: '.page-middle{position:absolute;top:0px;left:0px;width:100%;height:100%;background:#FFF;z-index:1000000;overflow:hidden}.page-middle-header{height:44px;line-height:44px;text-align:center;color:#000;font-weight:bold;font-size:18px;text-shadow:-1px 1px #fff;position:relative;width:100%;background:#FFF}.page-middle-body{background:#f0f0f0;text-align:left;overflow:auto;width:100%;position:absolute;top:45px;bottom:45px}.page-middle-footer{background:#FFF;line-height:45px;height:45px;position:absolute;bottom:0;width:100%;border-top:1px solid #aaa}.page-middle-backbtn{font-size:13px;position:absolute;z-index:2;left:5px;top:5px;height:30px;width:60px;color:#393939;background:#fff;text-align:center;border-radius:3px;border:1px solid #d2d6dd;}',
	tpl: '<div style="display:none" class="page-middle" id={containerId}>\
			<div class="page-middle-header">\
				<span class="page-middle-title">{title}</span>\
				<span class="page-middle-backbtn">{leftbtn}</span>\
				<span class="page-middle-rightbtn">{rightbtn}</span>\
			</div>\
			<div class="page-middle-body">\
			{body}\
			</div>\
			<div class="page-middle-footer">{footer}</div>\
		 </div>',
	run: function() {
		var me = this,
			config = me.config,
			containerId = 'page-middle-'+me.module;
		if(document.getElementById(containerId)) {
			return false;
		}
		B.COCO_UI.addStyle(me.css, "coco_middle");
		var  data = {}, cprop = '';
		['title', 'body', 'rightbtn', 'leftbtn'].forEach(function(prop) {
			cprop = config[prop];
			if(cprop && typeof cprop === 'function') {
				data[prop] = cprop.call(me);
			}else{
				data[prop] = cprop;
			}
		});
		var html = B.COCO_UI.tplConnect(me.tpl, $.extend(data, {
			containerId: containerId
		}));
		$('body').append(html);
		me.container = $('#'+containerId);
		me.backbtn = me.container.find('.page-middle-backbtn');
	},
	supportHashChange: function() {
		return window.onhashchnage ? true : false;	
	},
	addHash: function() {
		var hash = window.location.hash,
			me = this,
			hashName = 'ala_hash_'+me.module;
		if(hash) {
			if(hash.indexOf(hashName) == -1) {
				location.hash += '|' + hashName;	
			}else {
				location.hash += '|' + hashName;//如果已经存在，还要考虑是否支持hashchange的浏览器	
			
			}	
		}else {
		
			window.location.hash += '#' + hashName; 
		}
	},
	removeHash: function() {
		var hash = window.location.hash,
			me = this,
			hashName = 'ala_hash_'+me.module;
		if(hash) {
			if(hash.indexOf(hashName) == -1) {
			}else {
				var reg = new RegExp('([#\|])('+hashName+')([\|]?)', 'ig');
				location.hash = location.hash.replace(reg, function(a,s1, h, s2) {
					if(s1 == '#') {
						//如果是个#，表示是第一个hash，这个时候#不能去掉
						return s1 + '';
					}else {
						return s2;
					}
				});	
			}	
		}else {
		
		}
	
	},
	show: function() {
		var me = this;
		if(me.supportHashChange) {
			me.addHash();
		}else {
			me.doShow();
		}
	},
	doShow: function() {
	
		$('#page').hide();
		this.container.show();
	},
	hide: function() {
		var me = this;
		if(me.supportHashChange) {
			me.removeHash();	
		}else {
			me.doHide();
		}
	},
	doHide: function() {
		$('#page').show();
		this.container.hide();	
	},
	hashChange: function() {
		var	me = this,
			hash = location.hash,
			hashName = 'ala_hash_'+me.module;
		if(hash.indexOf(hashName) !== -1) {
			me.doShow();
		}else{
			me.doHide();
		}
			
	},
	bindEvent: function() {
		var me = this;
		$(window).on('hashchange', this.hashChange.bind(this));
		me.backbtn.on('click', this.hide.bind(this));
	}

});
