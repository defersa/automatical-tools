;window.setDragImageIEPreload=function(image){var bodyEl,preloadEl;bodyEl=document.body;preloadEl=document.createElement("div");preloadEl.style.background='url("'+image.src+'")';preloadEl.style.position="absolute";preloadEl.style.opacity=0.001;bodyEl.appendChild(preloadEl);setTimeout(function(){bodyEl.removeChild(preloadEl);},5000);};if("function"!==typeof DataTransfer.prototype.setDragImage){DataTransfer.prototype.setDragImage=function(image,offsetX,offsetY){var randomDraggingClassName,dragStylesCSS,dragStylesEl,headEl,parentFn,eventTarget;randomDraggingClassName="setdragimage-ie-dragging-"+Math.round(Math.random()*Math.pow(10,5))+"-"+Date.now();dragStylesCSS=["."+randomDraggingClassName,"{",'background: url("'+image.src+'") no-repeat #fff 0 0 !important;',"width: "+image.width+"px !important;","height: "+image.height+"px !important;","text-indent: -9999px !important;","border: 0 !important;","outline: 0 !important;","}","."+randomDraggingClassName+" * {","display: none !important;","}"];dragStylesEl=document.createElement("style");dragStylesEl.innerText=dragStylesCSS.join("");headEl=document.getElementsByTagName("head")[0];headEl.appendChild(dragStylesEl);parentFn=DataTransfer.prototype.setDragImage.caller;while(!(parentFn.arguments[0] instanceof DragEvent)){parentFn=parentFn.caller;}eventTarget=parentFn.arguments[0].target;eventTarget.classList.add(randomDraggingClassName);setTimeout(function(){headEl.removeChild(dragStylesEl);eventTarget.classList.remove(randomDraggingClassName);},0);};}
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
if (!Array.prototype.has){
    Array.prototype.has = function(item){
    	for(var i = 0; i < this.length; i++){
    		if(this[i] == item)		return true;
    	}
        return false;
    };
};

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};


var tools = {
	createHTML: function(options){
		if(typeof options == 'object' && options != null){
			var obj = 	document.createElement(options.tag);
			if(options.parent != undefined) 			options.parent.appendChild(obj);
			if(options.className != undefined) 			obj.className = options.className;
			if(options.id != undefined) 				obj.id = options.id;
			if(options.innerHTML != undefined)			obj.innerHTML = options.innerHTML;
			if(options.value != undefined)				obj.value = options.value;
			if(options.type != undefined)				obj.type = options.type;
			if(options.src != undefined)				obj.src = options.src;
			if(options.style != undefined)				obj.style.cssText = options.style;
			if(options.title != undefined)				obj.title = options.title;

			if(options.onmousedown != undefined)		obj.onmousedown = options.onmousedown;
			if(options.onclick != undefined)			obj.onclick = options.onclick;
			if(options.ondblclick != undefined)			obj.ondblclick = options.ondblclick;
			if(options.oncontextmenu != undefined)		obj.oncontextmenu = options.oncontextmenu;

			if(options.onmouseover != undefined)		obj.onmouseover = options.onmouseover;
			if(options.onmouseout != undefined)			obj.onmouseout = options.onmouseout;
			if(options.onmouseenter != undefined)		obj.onmouseenter = options.onmouseenter;
			if(options.onmousemove != undefined)		obj.onmousemove = options.onmousemove;
			if(options.onmouseleave != undefined)		obj.onmouseleave = options.onmouseleave;
			
			if(options.onscroll != undefined)			obj.onscroll = options.onscroll;
			if(options.onkeydown != undefined)			obj.onkeydown = options.onkeydown;
			if(options.onkeyup != undefined)			obj.onkeyup = options.onkeyup;
			if(options.onblur != undefined)				obj.onblur = options.onblur;
			if(options.onfocus != undefined)			obj.onfocus = options.onfocus;

			if(options.ondrop != undefined)				obj.ondrop = options.ondrop;
			if(options.ondragover != undefined)			obj.ondragover = options.ondragover;

			// variable to communicate with the object
			if(options.link != undefined)				obj.link = options.link;

			if(options.onwheel != undefined){
				if(window.clipboardData)				obj.onmousewheel = options.onwheel;
				else									obj.onwheel = options.onwheel;
			}			
				
			if(options.tabIndex != undefined)			obj.tabIndex = options.tabIndex;
			return obj;
		} else console.warn('function "%c%s%c" has incorrect format', 'color: blue; font-style: italic;', 'tools.createHTML', '');	},
	destroyHTML: function(object){
		if(object.parentNode != undefined) object.parentNode.removeChild(object);
		else console.warn('function "%c%s%c" has incorrect input variable', 'color: blue; font-style: italic;', 'tools.destroyHTML', ''); },
	roundPlus: function(value, decimals) {
		if(decimals > 16)	decimals = 16;
		var svalue = (value !== undefined) ? (value + '') : '';
		if(svalue.indexOf('e') == -1){
			return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
		} else {
			var index = svalue.indexOf('e');
			var ivalue = parseFloat(svalue.slice(0, index));
			var dvalue = parseInt(svalue.slice(index + 1));

			return Number(Math.round(ivalue + 'e' + (decimals + dvalue))+'e-'+ decimals);
		}
	},
	round: function(value, decimals) {
		if(decimals > 16)	decimals = 16;
		var svalue = (value !== undefined) ? (value + '') : '';
		if(svalue.indexOf('e') == -1){
			return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
		} else {
			var index = svalue.indexOf('e');
			var ivalue = parseFloat(svalue.slice(0, index));
			var dvalue = parseInt(svalue.slice(index + 1));

			return Number(Math.round(ivalue + 'e' + (decimals + dvalue))+'e-'+ decimals);
		}
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
	resize: function(){
		var event = new CustomEvent("resize", {bubbles: true, cancelable: true});		
		window.dispatchEvent(event);
	},
	startBackdrop: function(options){
		var backdrop = document.getElementById('tools-backdrop');
		if(backdrop == undefined)		backdrop = tools.createHTML({tag: 'div', parent: document.body, id: 'tools-backdrop', style: 'position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: 999;'});
		if(options.cursor)				backdrop.style.cursor = options.cursor;
	},
	endBackdrop: function(){
		var backdrop = document.getElementById('tools-backdrop');
		if(backdrop != undefined)		tools.destroyHTML(backdrop);		
	},
	getWidth: function( text, font){
		var canvas = tools.createHTML({
			tag: 'canvas'
		});
		if(!font)
			font = "13pt Sans";

		var ctx = canvas.getContext("2d");
		ctx.font = font;

		var width = ctx.measureText(text).width

		canvas = undefined;
		return width;
	},
	pasteHtmlAtCaret: function(html, selectPastedContent) {
		var sel, range;
		if (window.getSelection) {
			// IE9 and non-IE
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
	
				// Range.createContextualFragment() would be useful here but is
				// only relatively recently standardized and is not supported in
				// some browsers (IE9, for one)
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(), node, lastNode;
				while ( (node = el.firstChild) ) {
					lastNode = frag.appendChild(node);
				}
				var firstNode = frag.firstChild;
				range.insertNode(frag);
	
				// Preserve the selection
				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					if (selectPastedContent) {
						range.setStartBefore(firstNode);
					} else {
						range.collapse(true);
					}
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
		}
	}
}

