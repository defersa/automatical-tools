try {  new CustomEvent("IE has CustomEvent, but doesn't support constructor");
} catch (e) {
  window.CustomEvent = function(event, params) {
    var evt;
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };
  CustomEvent.prototype = Object.create(window.Event.prototype);
}
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

var tools = {
	createHTML: function(options){
		if(typeof options == 'object' && options != null){
			var new_element = 	document.createElement(options.tag);
			if(options.parent != undefined) 			options.parent.appendChild(new_element);
			if(options.className != undefined) 			new_element.className = options.className;
			if(options.id != undefined) 				new_element.id = options.id;
			if(options.innerHTML != undefined)			new_element.innerHTML = options.innerHTML;
			if(options.src != undefined)				new_element.src = options.src;
			if(options.style != undefined)				new_element.style.cssText = options.style;
			if(options.title != undefined)				new_element.title = options.title;

			if(options.onmousedown != undefined)		new_element.onmousedown = options.onmousedown;
			if(options.onclick != undefined)			new_element.onclick = options.onclick;
			if(options.ondblclick != undefined)			new_element.ondblclick = options.ondblclick;
			if(options.oncontextmenu != undefined)		new_element.oncontextmenu = options.oncontextmenu;

			if(options.onmouseover != undefined)		new_element.onmouseover = options.onmouseover;
			if(options.onmouseout != undefined)			new_element.onmouseout = options.onmouseout;
			if(options.onmousemove != undefined)		new_element.onmousemove = options.onmousemove;
			
			if(options.onscroll != undefined)			new_element.onscroll = options.onscroll;
			if(options.onkeydown != undefined)			new_element.onkeydown = options.onkeydown;
			if(options.onkeyup != undefined)			new_element.onkeyup = options.onkeyup;
			if(options.onblur != undefined)				new_element.onblur = options.onblur;

			if(options.onwheel != undefined){
				if(window.clipboardData)				new_element.onmousewheel = options.onwheel;
				else									new_element.onwheel = options.onwheel;
			}			
				
			if(options.tabIndex != undefined)			new_element.tabIndex = options.tabIndex;
			return new_element;
		} else console.warn('function "%c%s%c" has incorrect format', 'color: blue; font-style: italic;', 'tools.createHTML', '');	},
	destroyHTML: function(object){
		if(object.parentNode != undefined) object.parentNode.removeChild(object);
		else console.warn('function "%c%s%c" has incorrect input variable', 'color: blue; font-style: italic;', 'tools.destroyHTML', ''); },
	roundPlus: function(value, decimals) {
		return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
	},
	closest: function(target, className){
		if( target != undefined){
			if( tools.hasClass(target, className))			return target;
			else											return tools.closest( target.parentNode, className);	}},
	hasClass: function(elem, className){
		if(elem)	return new RegExp("(^|\\s)"+className+"(\\s|$)").test(elem.className);	},
	cloneObject: function(source_obj){
		if (source_obj === null || typeof source_obj !== 'object')	return source_obj;
	
		var obj;
		if (Array.isArray(source_obj))						obj = [];
		else												obj = {};
	
		for (var key in source_obj)			{
			if (source_obj.hasOwnProperty(key))				obj[key] = tools.cloneObject(source_obj[key]);
		}	
		return obj;
	},
	stopProp: function(e){
		if (e.stopPropagation)		e.stopPropagation();
		else						e.cancelBubble = true; 
	},
	startBackdrop: function(options){
		var backdrop = document.getElementById('tools-backdrop');
		if(backdrop == undefined)		backdrop = tools.createHTML({tab: 'div', parent: document.body, id: 'tools-backdrop', style: 'position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: 999;'});
		if(options.cursor)				backdrop.style.cursor = options.cursor;
	},
	endBackdrop: function(){
		var backdrop = document.getElementById('tools-backdrop');
		if(backdrop != undefined)		tools.destroyHTML(backdrop);
		
	}
}

