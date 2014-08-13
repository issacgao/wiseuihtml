
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
