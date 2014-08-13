/**
 * @author mengqinghui
 * @date 2014/07/24
 * @desc 作为弹出层
 * @param
 *     @cfg - object
 *
 */
/**
 * @author mengqinghui
 * @date 2014/07/21
 *
 */

B.COCO_UI.tplConnect  =  function(tpl,obj){//模板拼装函数
	var rel='';
	rel = tpl.replace(/\<{([\w|\[|\]]+)\}>/gi,function(word,key){
		if(obj[key] != undefined){ //若obj含有这个属性，则返回obj的属性值
			return obj[key];
		}else if(B.COCO_UI.config[key] != undefined){ //若obj没有这个属性，则返回全局config中的属性值
			return B.COCO_UI.config[key];
		}else{
			word = word.replace(/\w+\[(\w+)\]/gi,function(a,b){
				return b;
			})  
			return word;
		}   
	}); 
	return rel;
};   
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
B.COCO_UI.supportHashChange =  function() {
	return window.onhashchnage ? true : false;	
}	
B.COCO_UI.addHash =  function(module) {
	var hash = window.location.hash,
		hashName = 'ala_hash_'+module;
	if(hash) {
		if(hash.indexOf(hashName) == -1) {
			location.hash += '|' + hashName;	
		}else {
			location.hash += '|' + hashName;//如果已经存在，还要考虑是否支持hashchange的浏览器	
		
		}	
	}else {
	
		window.location.hash += '#' + hashName; 
	}
};
B.COCO_UI.removeHash =  function(module) {
	var hash = window.location.hash,
		hashName = 'ala_hash_'+module;
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

};
;
/**
 * <p>middle 中间页组件
 * 	中间页组件提供以下功能
 * 	<ol>
 * 		<li>
 * 		 统一的后退和交互风格（包括整体样式，头部固定等, 另外头部的点击应该有点击日志的功能支持）
 * 		</li>
 * 		<li>
 * 		 统一的hash管理
 * 	    </li>
 * 	</ol>
 * 	<p>具体的demo</p>
 * 	<ol>
 *		<li><a href="/ui/middle/demo.html" target="_blank">中间页demo</a></li>
 * 	</ol>
 * </p>
 * @class middle
 */
B.COCO_UI.createUI('middle', {
	/**
	 * 作为构造函数，传入middle组件所需要的配置项
	 * @memberof middle
	 * @instance 
	 * @param {object} cfg
	 * @param {(string|function)} cfg.title - 中间页的标题
	 * @param {(string|function)} [cfg.leftbtn=返回] - 返回按钮文案（允许自定义）
	 * @param {function} [cfg.onLeftBtnClick] - 点击返回按钮的时候触发动作，return true或者false，如果return false，不会返回到上一个状态
	 * @param {(string|function)} [cfg.rightbtn] -  中间页右部按钮,如果是function，必须return string
	 * @param {function} [cfg.onRightBtnClick] - 中间页右部按钮点击的时候触发动作
	 * @param {(string|function)} [cfg.body] - 中间页的内容部分，可以不指定，后续通过setContent方法填充内容
	 *
	 */
    init: function(cfg) {
        this.config = $.extend({
			title: '',
			module:'middle', //模块名，中间页通常和其他模块搭配使用，module在这里主要是为了生成唯一的hash名称做准备的
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
	/**
	 *
	 * middle组件的css，通过__inline 方式引进来
	 * @memberof middle
	 * @instance
	 * @member {string}
	 *
	 */
	css: ".page-middle {\n\tposition:absolute;\n\ttop:0px;\n\tleft:0px;\n\twidth:100%;\n\theight:100%;\n\tbackground:#FFF;\n\tz-index:1000000;\n\toverflow:hidden\n}\n.page-middle-header {\n\theight:44px;\n\tline-height:44px;\n\ttext-align:center;\n\tcolor:#000;\n\tfont-weight:bold;\n\tfont-size:18px;\n\ttext-shadow:-1px 1px #fff;\n\tposition:relative;\n\twidth:100%;\n\tbackground:#FFF\n}\n.page-middle-body {\n\tbackground:#f0f0f0;\n\ttext-align:left;\n\toverflow:auto;\n\twidth:100%;\n\tposition:absolute;\n\ttop:45px;\n\tbottom:45px\n}\n.page-middle-footer {\n\tbackground:#FFF;\n\tline-height:45px;\n\theight:45px;\n\tposition:absolute;\n\tbottom:0;\n\twidth:100%;\n\tborder-top:1px solid #aaa\n}\n.page-middle-backbtn {\n\tfont-size:13px;\n\tposition:absolute;\n\tz-index:2;\n\tleft:5px;\n\ttop:5px;\n\theight:30px;\n\twidth:60px;\n\tcolor:#393939;\n\tbackground:#fff;\n\ttext-align:center;\n\tborder-radius:3px;\n\tborder:1px solid #d2d6dd;\n}\n\n",
	/**
	 *
	 * middle组件的tpl，通过__inline 方式引进来
	 * @memberof middle
	 * @instance
	 * @member {string}
	 *
	 */
	tpl: "<div style=\"display:none\" class=\"page-middle\" id=\"<{containerId}>\">\n\t<div class=\"page-middle-header\">\n\t\t<span class=\"page-middle-title\"><{title}></span>\n\t\t<span class=\"page-middle-backbtn\"><{leftbtn}></span>\n\t\t<span class=\"page-middle-rightbtn\"><{rightbtn}></span>\n\t</div>\n\t<div class=\"page-middle-body\">\n\t<{body}>\n\t</div>\n\t<div class=\"page-middle-footer\"><{footer}></div>\n </div>\n",
	/**
	 * 组件启动函数 
	 * @memberof middle
	 * @instance 
	 * @return {this}
	 */
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
	   	me.bodyEl = me.container.find('.page-middle-body');
	},
	/**
	 * 显示组件
	 * @memberof middle
	 * @instance 
	 * @return {this}
	 */
	show: function() {
		var me = this;
		if(B.COCO_UI.supportHashChange) {
			B.COCO_UI.addHash(me.config.module);
		}else {
			me.doShow();
		}
	},
	doShow: function() {
	
		$('#page').hide();
		this.container.show();
	},
	/**
	 * 隐藏组件
	 * @memberof middle
	 * @instance 
	 * @return {this}
	 */
	hide: function() {
		var me = this;
		if(B.COCO_UI.supportHashChange) {
			B.COCO_UI.removeHash(me.config.module);	
		}else {
			me.doHide();
		}
	},
	doHide: function() {
		$('#page').show();
		this.container.hide();	
	},
	getHashName: function() {
		return "ala_hash_"+this.config.module;
	},
	hashChange: function() {
		var	me = this,
			hash = location.hash,
			hashName = me.getHashName();
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
	},
	/**
	 * 设置中间页的内容
	 * @memberof middle
	 * @instance 
	 * @param {string} html - 需要填充的html，该函数没有对html做任何处理
	 * @return {this}
	 */
	setContent: function(html) {
		var me = this;
		me.bodyEl.html(html);
	}

});
;
/**
 *
 *
 * <p>Listview 组件，提供中间页形式的下拉列表，主要是给city，医院等组件使用 
 *    ListView  使用 中间页组件
 * 	<p>具体的demo</p>
 * 	<ol>
 *		<li><a href="/ui/listview/demo.html" target="_blank">下拉列表demo</a></li>
 * 	</ol>
 * </p>
 * @class listview
 */
B.COCO_UI.createUI('listview', {
	module:'listview', //模块名，中间页通常和其他模块搭配使用，module在这里主要是为了生成唯一的hash名称做准备的

	/**
	 * 作为构造函数，传入listview组件所需要的配置项
	 * @memberof listview
	 * @instance 
	 * @param {object} cfg
	 * @param {(object)} cfg.middle - 中间页的基本配置，具体可参考@see middle 的init 方法的cfg
	 * @param {(array|function)} cfg.data - listview的数据
	 * @param {function} [cfg.itemRender] -  listview中每个项的渲染方式，必须return string
	 * @param {function} [cfg.onItemClick] - 点击每个项的时候触发，传入的参数是该li元素
	 *
	 */

    init: function(cfg) {
        this.config = $.extend(true, {
			middle: {
				//中间页的配置项
				module: 'listview',
			},
		 	data: function() {
				//获取data的配置项，能支持异步加载的机制
			},
			itemRender: function(item) {
				return item;
			},
			onItemClick: function(){
			
			}
			
        }, cfg);
        this.run(this.config);
		this.bindEvent();
    },
	css: ".page-listview-item{\n\tborder-bottom:1px solid #d1d1d1;\n\tline-height:38px;\n\ttext-indent:30px;\n}\n",
	_response: function(data) {
		var me = this,
			cfg = me.config;
		if(data && data.length) {
			var html = ['<ul class="page-listview-list">'];
			data.forEach(function(item) {
				 html.push('<li class="page-listview-item">'+cfg.itemRender.call(me, item)+'</li>'); 
			});
			html.join('</ul>');
			me.middlePage.setContent(html.join(''));
		}	
	},
	run: function() {
		var me = this,
			config = me.config,
			containerId = 'page-middle-'+me.module;
		B.COCO_UI.addStyle(me.css, "coco_listview");
		this.middlePage = new B.COCO_UI['middle'](config.middle);
		this._processData();
	},
	_processData: function() {
		var me = this,
			config = me.config;
		var data = config.data;
		if($.isArray(data)) {
			me._response(data);
		}else if($.isFunction(data)){
			data.call(me, {}, me._response.bind(me));
		}
	},
	show: function() {
		var me = this;
		if(B.COCO_UI.supportHashChange) {
			B.COCO_UI.addHash(me.module);
		}else {
			me.doShow();
		}
	},
	doShow: function() {
	
		$('#page').hide();
		this.middlePage.container.show();
	},
	hide: function() {
		var me = this;
		if(B.COCO_UI.supportHashChange) {
			B.COCO_UI.removeHash(me.module);	
		}else {
			me.doHide();
		}
	},
	doHide: function() {
		$('#page').show();
		this.middlePage.container.hide();	
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
		me.middlePage.bodyEl.on('click', function(e) {
			var target = e.target;
			var $li = $(target).closest('.page-listview-item');
			if($li.length) {
				var onItemClick = me.config.onItemClick;
				onItemClick && onItemClick.call(me, $li);
			}
		});
	}

});
