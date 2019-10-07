function window_ui(options){
	//main controls and containers
	var parent;
	var modal;	
	this.container;
	var buttons;
	
	var _resize;//support container
	var _window;
	var _header;
	var _footer;

	var _fragment = document.createDocumentFragment(); //inner parent
	var _setting; //general options
	var _functions; //functions for buttons and events

	var link = this; //link for self

	//icons for header's bar
	var svgCross	= '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 24 24" xml:space="preserve"><g class="fill"><path d="M 0,0 L 24,0 L 24,24 L 0,24 L 0,0 z" /></g><g class="cross"><path d="M 5.5,7 L 7,5.5 L 18.5,17 L 17,18.5 L 5.5,7 z" /><path d="M 5.5,17 L 7,18.5 L 18.5,7 L 17,5.5 L 5.5,17 z" /></g></svg>';
	var svgQuest	= '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 24 24" xml:space="preserve"><g class="fill"><path d="M 0,0 L 24,0 L 24,24 L 0,24 L 0,0 z" /></g><g class="cross"><path d="M 8,10 C 8,7.5 9.5,6 12,6 C 14.5,6 16,7.5 16,10	L 16,10.25	C 16,10.75 16,11.5 14.5,12.5	Q 13,13.5 13,14.5		L 13,15	L 11,15 	L 11,14	Q 11,13 12.5,12	Q 14,11 14,10	C 14,8.75 13.25,8 12,8	C 10.75,8 10,8.75 10,10	 z" /><path d="M 11,16 L 13,16 L 13,18 L 11,18 L 11,16 z" /></g></svg>';
	var svgMax	= '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 24 24" xml:space="preserve"><g class="fill"><path d="M 0,0 L 24,0 L 24,24 L 0,24 L 0,0 z" /></g><g class="cross"><path d="M 6,6 L 18,6 L 18,18 L 6,18 L 6,10 L 7,10 L 7,17 L 17,17 L 17,10 L 6,10 L 6,6 z" /></g></svg>';
	var svgMin	= '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 24 24" xml:space="preserve"><g class="fill"><path d="M 0,0 L 24,0 L 24,24 L 0,24 L 0,0 z" /></g><g class="cross"><path d="M 5,10 L 15,10 L 15,18 L 5,18 L 5,12 L 6,12 L 6,17 L 14,17 L 14,12 L 5,12 L 5,10 z" /><path d="M 8,6 L 19,6 L 19,14 L 16,14 L 16,13 L 18,13 L 18,8 L 10,8 L 10,9 L 9,9 L 9,6 z" /></g></svg>';

	link.create = function(options){
		if(!options)						options = {};
		if(_window != undefined)			this.remove();

		//verification of input data and assignment default value
		if(options.width == undefined)		options.width  = '50%';
		if(options.height == undefined)		options.height = '50%';		
		if(options.minWidth == undefined)	options.minWidth  = '200px';
		if(options.minHeight == undefined)	options.minHeight = '200px';
		if(options.left == undefined)		options.left  = 'center';
		if(options.top == undefined)		options.top = 'center';

		if(options.enterKey == undefined)	options.enterKey = true;
		if(options.footer == undefined)		options.footer = true;
		
		if(options.ok == undefined)			options.ok = false;
		if(options.apply == undefined)		options.apply = true;
		if(options.cancel == undefined)		options.cancel = true;
		if(options.close == undefined)		options.close = false;

		if(options.picCancel == undefined)	options.picCancel = true;
		if(options.picMinMax == undefined)	options.picMinMax = true;
		if(options.picHelp == undefined)	options.picHelp = false;
		if(options.title === undefined)		options.title = 'Default';

		if(options.move == undefined)		options.move = true;
		if(options.fullSize == undefined)	options.fullSize = false; //fullsize mode at startup
		if(options.modal == undefined)		options.modal = false;
		if(options.resize == undefined)		options.resize = true;
		if(options.show == undefined)		options.show = true;
		if(options.parent == undefined)		options.parent = document.body;

		if(options.parent)		parent = options.parent;
		else if(!parent)		{ console.warn('Please set correct parent and try create window again!'); return; }
		
		buttons = {};	_functions = {};		_setting = {};

		//create basic control and containers
		CREATE.main();

		this.change(options);
	}
	link.remove = function(){
		if(_setting.show){
			if(_setting.modal)	modal.parentNode.removeChild(modal);
			else				_window.parentNode.removeChild(_window);
		}
		parent = undefined;			modal = undefined;
		_header = undefined;		buttons = undefined;
		_footer = undefined;		_resize = undefined;
		link.container = undefined;

		_window = undefined;		_functions = undefined;
		_fragment = document.createDocumentFragment();
		_setting = {};
	}
	link.change = function(options){
		if(!options)								options = {};

		if(options.parent != undefined)				CHANGE.parent(options);
		if(options.footer != undefined)				CREATE.footer(options);			
		if(options.footer != undefined)				link.container.style.bottom = (options.footer)? '51px' : '';
		if(options.resize != undefined)				CREATE.resize(options);
		if(options.footerContent != undefined)		CHANGE.footerContent(options);
		if(options.enterKey != undefined)			_setting.enterKey = options.enterKey;
	
		if(	options.ok != undefined
			|| options.close != undefined
			|| options.cancel != undefined
			|| options.customButtons != undefined
			|| options.apply != undefined)			CREATE.footerButtons(options);
		if(options.picCancel != undefined
			|| options.picMinMax != undefined
			|| options.picHelp != undefined)		CREATE.headerIcons(options);
		if(options.move != undefined)				CHANGE.move(options);
		if(options.width != undefined
			|| options.height != undefined
			|| options.minWidth != undefined
			|| options.minHeight != undefined)		CHANGE.size(options);
		if(options.left != undefined
			|| options.top != undefined )			CHANGE.position(options);

		if(options.title != undefined)				buttons.title.innerHTML = options.title;
		if(options.picMinMax != undefined)			CHANGE.minMax(options);
		if(options.modal != undefined)				CHANGE.modal(options);
		if(options.show != undefined)				CHANGE.visible(options);
		if(options.content != undefined)			CHANGE.content(options);
		if(options.functions != undefined)			CHANGE.functions(options);
		
		if(_setting.show)	CHANGE.apply_position();

		var event = new CustomEvent("resize", {bubbles: true, cancelable: true});		
		window.dispatchEvent(event);
	}
	link.getSetting = function(){
		return tools.cloneObject(_setting);
	}
	link.hasFocus = function(){
		if(document.activeElement == _window)	return true;
		else									return false;
	}
	link.setFocus = function(){
		_window.focus();
	}

	var EVENTS = {
		down: {
			window: function(){
				if(!_setting.active){
					var event = new CustomEvent("activeWindowChanged", {});		
					window.dispatchEvent(event);
					_setting.active = true;
					if(_setting.modal)			modal.className = 'wu-modal wu-active';
					else						_window.className = 'wu-window wu-active';
					_window.focus();
				}
			},
			header: function(e){
				if(!_setting.move || tools.closest(e.target, 'wu-button') ) return;
				DRAG.down(e);
			},
			resize: function(e, h, v){
				RESIZE.down(e, h, v);
			},
			modal: function(e){
				if(_window != undefined && !tools.closest(e.target, 'wu-window')){
					
					function modalUp(){
						window.removeEventListener("mouseup", modalUp);
						_window.focus();
					}
					window.addEventListener("mouseup", modalUp);
				}
			},
		},
		click: {
			minMax: function(e){
				if(buttons.picMinMax != undefined){
					CHANGE.minMax({fullSize: !_setting.fullSize});
					CHANGE.apply_position();
	
					var event = new CustomEvent("resize", {bubbles: true, cancelable: true});		
					window.dispatchEvent(event);
				}
			},
			cancel: function(){	
				if(typeof _functions.cancel == 'function'){
					if(_functions.cancel(link)) CHANGE.visible({show: false});
				} else CHANGE.visible({show: false});
			},
			close: function(){
				if(typeof _functions.close == 'function'){
					if(_functions.close(link)) CHANGE.visible({show: false});
				} else CHANGE.visible({show: false});		 
			},
			apply: function(){
				if(typeof _functions.apply == 'function'){
					if(_functions.apply(link)) CHANGE.visible({show: false});
				} else CHANGE.visible({show: false});
			},
			ok: function(){
				if(typeof _functions.ok == 'function'){
					if(_functions.ok(link)) CHANGE.visible({show: false});
				} else CHANGE.visible({show: false});
			},
			help: function(){
				if(typeof _functions.help == 'function'){
					_functions.help(link);
				}
			}
		},
		dbl: {
			header: function(e){
				if(!tools.closest(e.target, 'wu-button')) EVENTS.click.minMax();
			}
		},
		key: {
			down: function(e){
				if(typeof _functions.keyDown == 'function')	_functions.keyDown(e, link);
				else {
					if(e.keyCode == 27 && (buttons.picCancel || buttons.cancel) ) EVENTS.click.cancel();
					if(e.keyCode == 13 && _setting.enterKey){
						if(_setting.ok) 			EVENTS.click.ok();
						else if(_setting.apply)		EVENTS.click.apply();
					}
				}
	
				if (e.ctrlKey && ((e.keyCode == 37 || e.which == 37) || (e.keyCode == 39 || e.which == 39)) && _setting.modal){
					tools.stopProp(e);
					return false;
				}
				if( _setting.modal && e.keyCode == 9){

					var indextabs = _window.querySelectorAll('[tabIndex]:not([style*="display: none"]), input:not([style*="display: none"]), textarea:not([style*="display: none"])');

					indextabs = Array.prototype.slice.call(indextabs);
				
					indextabs.push(_window);

					var index = 0;

					for(var i = 0; i < indextabs.length; i++){
						if(indextabs[i] == document.activeElement)
							index = i;
					}

					indextabs[(index + 1)%indextabs.length].focus();

					tools.stopProp(e);
					return false;
				}
			},
			up: function(e){
				if(_setting.modal)				tools.stopProp(e);
				return false;
			}
		},
		custom: {
			changeActive: function(){
				if(_setting.active){
					_setting.active = false;
	
					if(_setting.modal)			modal.className = 'wu-modal wu-not-active';
					else						_window.className = 'wu-window wu-not-active';
				}
			}
		}
	}
	var CHANGE = {
		parent: function(options){
			parent = options.parent;
			if(_setting.show)
				parent.appendChild(_window);
		},
		content: function(options){
			link.container.innerHTML = '';
			if(typeof options.content == 'object'){
				link.container.appendChild(options.content);
				options.content.style.cssText = 'left: 0; right: 0; top: 0; bottom: 0; display: block; position: absolute;';
			}
		},
		footerContent: function(options){
			if(_setting.footer){
				_footer.content.innerHTML = '';
				if(typeof options.footerContent == 'object'){
					_footer.content.appendChild(options.footerContent);
					options.footerContent.style.cssText = 'left: 0; right: 0; top: 0; bottom: 0; display: block; position: absolute;';
				} 
			}
		},
		move: function(options){		_setting.move = options.move;	},
		modal: function(options){		_setting.modal = options.modal;		CREATE.modal(options);	},
		visible: function(options){
			if(options.show && !_setting.show){
				window.addEventListener('activeWindowChanged', EVENTS.custom.changeActive);
				if(modal)				parent.appendChild(modal);
				else					parent.appendChild(_window);

				EVENTS.down.window();
				_window.focus();
			} else if(!options.show && _setting.show){
				window.removeEventListener('activeWindowChanged', EVENTS.custom.changeActive);
				if(modal)				_fragment.appendChild(modal);
				else					_fragment.appendChild(_window);
			} else if(options.show && _setting.show){
				EVENTS.down.window();
				_window.focus();
			}
			_setting.show = options.show;
		},
		minMax: function(options){
			_setting.fullSize = options.fullSize;
			if(buttons.picMinMax){
				if(options.fullSize)	buttons.picMinMax.innerHTML = svgMin;
				else					buttons.picMinMax.innerHTML = svgMax;
			}
		},
		size: function(options){// set input size for window
			if(options.width != undefined){
				_setting.width_type = 1;
				if(options.width.indexOf('%') != -1){			_setting.width = parseFloat(options.width.substring(0, options.width.indexOf('%')));
				} else if(options.width.indexOf('px') == -1){	_setting.width = parseFloat(options.width);
				} else {
					_setting.width = parseFloat(options.width.substring(0, options.width.indexOf('px')));
					_setting.width_type = 0;
				}
			}
			if(options.height != undefined){
				_setting.height_type = 1;
				if(options.height.indexOf('%') != -1){			_setting.height = parseFloat(options.height.substring(0, options.height.indexOf('%')));
				} else if(options.height.indexOf('px') == -1){	_setting.height = parseFloat(options.height);
				} else {
					_setting.height = parseFloat(options.height.substring(0, options.height.indexOf('px')));
					_setting.height_type = 0;
				}
			}
			if(options.minWidth != undefined){
				if(options.minWidth.indexOf('px') != -1)		_setting.minWidth = parseFloat(options.minWidth.substring(0, options.minWidth.indexOf('px')));
				else if(typeof options.minWidth == 'string')	_setting.minWidth = parseFloat(options.minWidth);
				else											_setting.minWidth = options.minWidth;
			}
			if(options.minHeight != undefined){
				if(options.minHeight.indexOf('px') != -1)		_setting.minHeight = parseFloat(options.minHeight.substring(0, options.minHeight.indexOf('px')));
				else if(typeof options.minHeight == 'string')	_setting.minHeight = parseFloat(options.minHeight);
				else											_setting.minHeight = options.minHeight;
			}
		},
		position: function(options){// set input position for window
			if(options.left != undefined){
				_setting.left_type = 1;
				if(options.left == 'left')						_setting.left = 0;
				else if(options.left == 'center'){
					if(_setting.width_type)						_setting.left = 50 - tools.roundPlus(_setting.width/2,1);
					else										_setting.left = 50;
				} else if(options.left == 'right'){
					if(_setting.width_type)						_setting.left = 100 - _setting.width;
					else										_setting.left = -1;
				} else if(options.left.indexOf('%') != -1){		_setting.left = parseFloat(options.left.substring(0, options.left.indexOf('%')));
				} else if(options.left.indexOf('px') != -1){	_setting.left = parseFloat(options.left.substring(0, options.left.indexOf('px')));
																_setting.left_type = 0;
				} else if(typeof options.left == 'string')		_setting.left = parseFloat(options.left);
				else if(typeof options.left == 'number')		_setting.left = options.left;
			}

			if(options.top != undefined){
				_setting.top_type = 1;
				if(options.top == 'top')						_setting.top = 0;
				else if(options.top == 'center'){
					if(_setting.height_type)					_setting.top = 50 - tools.roundPlus(_setting.height/2,1);
					else										_setting.top = 50;
				} else if(options.top == 'bottom'){
					if(_setting.height_type)					_setting.top = 100 - _setting.height;
					else										_setting.top = -1;
				} else if(options.top.indexOf('%') != -1){		_setting.top = parseFloat(options.top.substring(0, options.top.indexOf('%')));
				} else if(options.top.indexOf('px') != -1){		_setting.top = parseFloat(options.top.substring(0, options.top.indexOf('px')));
																_setting.top_type = 0;
				} else if(typeof options.top == 'string')		_setting.top = parseFloat(options.top);
				else if(typeof options.top == 'number')			_setting.top = options.top;
			}
		},
		apply_position: function(){
			if(!_setting.fullSize){
				var cssText = '';

				if(_setting.left == -1)										cssText += 'width: ' + (_setting.width + (_setting.width_type? '%' : 'px')) + '; right: 0; ';
				else if(_setting.left_type && !_setting.width_type)			cssText += 'width: ' + _setting.width + 'px; left: Calc(' + _setting.left + '% - ' + Math.round(_setting.width/2) + 'px); '; 
				else														cssText += 'width: ' + (_setting.width + (_setting.width_type? '%' : 'px')) + '; left:' + (_setting.left + (_setting.left_type? '%' : 'px')) + '; ';
				
				if(_setting.top == -1)										cssText += 'height: ' + (_setting.height + (_setting.height_type? '%' : 'px')) + '; bottom: 0; ';
				else if(_setting.top_type && !_setting.height_type)			cssText += 'height: ' + _setting.height + 'px; top: Calc(' + _setting.top + '% - ' + Math.round(_setting.height/2) + 'px); '; 
				else														cssText += 'height: ' + (_setting.height + (_setting.height_type? '%' : 'px')) + '; top:' + (_setting.top + (_setting.top_type? '%' : 'px')) + '; ';
			
																			cssText += 'min-height: ' + (_setting.minHeight + 'px') + '; min-width: ' + (_setting.minWidth + 'px');

				_window.style.cssText  = cssText;
			} else _window.style.cssText = 'left: 0; right: 0; top: 0; bottom:0';
		},
		functions: function(options){ //set custom (input) functions for buttons
			if(options.functions.ok !== undefined)				_functions.ok = options.functions.ok;
			if(options.functions.cancel !== undefined)			_functions.cancel = options.functions.cancel;
			if(options.functions.close !== undefined)			_functions.close = options.functions.close;
			if(options.functions.help !== undefined)			_functions.help = options.functions.help;
			if(options.functions.apply !== undefined)			_functions.apply = options.functions.apply;
			if(options.functions.keyDown !== undefined)			_functions.keyDown = options.functions.keyDown;
		}
	}
	var CREATE = {
		main: function(options){
			_window = tools.createHTML( {			tag: 'div',
													className: 'wu-window',
													tabIndex: '-1',
													onmousedown: EVENTS.down.window,
													onkeydown: EVENTS.key.down,
													onkeyup: EVENTS.key.up });
			_header	= tools.createHTML( {			tag: 'div',
													parent: _window,
													className: 'wu-header',
													onmousedown: EVENTS.down.header,
													ondblclick: EVENTS.dbl.header });
			link.container = tools.createHTML( {	tag: 'div',
													parent: _window,
													className: 'wu-content'});
			buttons.title = tools.createHTML( {		tag: 'div',
													parent: _header,
													className: 'wu-title'});
		},
		resize: function(options){ //create and destroy resize controls
			if(options.resize != _setting.resize && options.resize){
				_setting.resize = true;
				_resize = tools.createHTML( {tag: 'div', parent: _window })
				_resize.style.cssText = 'positon: absolute; left: 0; right: 0; top: 0; bottom: 0;';
		
				_resize.sides = {	r:	tools.createHTML( {tag: 'div', parent: _resize, onmousedown: function(e){ EVENTS.down.resize( e, 1, 0)}, className: 'wu-sides-r'}),
									b:	tools.createHTML( {tag: 'div', parent: _resize, onmousedown: function(e){ EVENTS.down.resize( e, 0, 1)}, className: 'wu-sides-b'}),
									l:	tools.createHTML( {tag: 'div', parent: _resize, onmousedown: function(e){ EVENTS.down.resize( e, 2, 0)}, className: 'wu-sides-l'}),
									t:	tools.createHTML( {tag: 'div', parent: _resize, onmousedown: function(e){ EVENTS.down.resize( e, 0, 2)}, className: 'wu-sides-t'})};
		
				_resize.corners = {	rb:	tools.createHTML( {tag: 'div', parent: _resize, onmousedown: function(e){ EVENTS.down.resize( e, 1, 1)}, className: 'wu-corners-rb'}),
									lb:	tools.createHTML( {tag: 'div', parent: _resize, onmousedown: function(e){ EVENTS.down.resize( e, 2, 1)}, className: 'wu-corners-lb'}),
									lt:	tools.createHTML( {tag: 'div', parent: _resize, onmousedown: function(e){ EVENTS.down.resize( e, 2, 2)}, className: 'wu-corners-lt'}),
									rt:	tools.createHTML( {tag: 'div', parent: _resize, onmousedown: function(e){ EVENTS.down.resize( e, 1, 2)}, className: 'wu-corners-rt'})};		
		
			} else if(	options.resize != _setting.resize
						&& !options.resize && _resize != undefined) {
				_setting.resize = false;
				tools.destroyHTML(_resize);
			} else _setting.resize = false;
		},
		footer: function(options){ //create and destroy footer
			if(options.footer != _setting.footer){
				if(options.footer){
					_footer 			=	tools.createHTML( {tag: 'div', parent: _window, className: 'wu-footer'});
					_footer.buttons		=	tools.createHTML( {tag: 'div', parent: _footer, className: 'wu-footer-buttons'});
					_footer.content		=	tools.createHTML( {tag: 'div', parent: _footer, className: 'wu-footer-content'});
					buttons.ok			=	tools.createHTML( {tag: 'div', parent: _footer.buttons, className: 'wu-button-dark',  onclick: EVENTS.click.ok, innerHTML: '<span>OK</span>'});
					buttons.apply		=	tools.createHTML( {tag: 'div', parent: _footer.buttons, className: 'wu-button-dark',  onclick: EVENTS.click.apply, innerHTML: '<span>Apply</span>'});
					buttons.cancel		=	tools.createHTML( {tag: 'div', parent: _footer.buttons, className: 'wu-button-white', onclick: EVENTS.click.cancel,  innerHTML: '<span>Cancel</span>'});
					buttons.close		=	tools.createHTML( {tag: 'div', parent: _footer.buttons, className: 'wu-button-white', onclick: EVENTS.click.close, innerHTML: '<span>Close</span>'});
				}
				_setting.footer = options.footer;
			}
		},
		footerButtons: function(options){
			if(_setting.footer){
				if(options.ok != undefined){
					if(!options.ok)						buttons.ok.style.display = 'none';
					else if(options.ok)					buttons.ok.style.display = '';
					_setting.ok = options.ok;
				}
				if(options.apply != undefined){
					if(!options.apply)					buttons.apply.style.display = 'none';
					else if(options.apply)				buttons.apply.style.display = '';
					_setting.apply = options.apply;
				}
				if(options.cancel != undefined){
					if(!options.cancel)					buttons.cancel.style.display = 'none';
					else if(options.cancel)				buttons.cancel.style.display = '';
					_setting.cancel = options.cancel;
				}
				if(options.close != undefined){
					if(!options.close)					buttons.close.style.display = 'none';
					else if(options.close)				buttons.close.style.display = '';
					_setting.close = options.close;
				}

				if(Array.isArray(options.customButtons)){
					if(Array.isArray(buttons.custom_buttons)){
						for(var i = 0; i < buttons.customButtons.length; i++)
							tools.destroyHTML(buttons.customButtons[i]);
					}
					buttons.custom_buttons = [];
					for(var i = 0; i < options.customButtons.length; i++){
						buttons.custom_buttons[i] = tools.createHTML( {tag: 'div', parent: _footer.buttons, className: ((options.customButtons[i].style == 1) ? 'wu-button-dark' : 'wu-button-white')});
						tools.createHTML( {tag: 'span', parent: buttons.custom_buttons[i], innerHTML: options.customButtons[i].name});
						buttons.custom_buttons[i].onclick = options.customButtons[i].onclick;
					}
				}
			}
		},
		headerIcons: function(options){ // create and destriy headers buttons
			if(options.picHelp && !buttons.picHelp) buttons.picHelp	= tools.createHTML( {tag: 'div', parent: _header, className: 'wu-button', onclick: EVENTS.click.help, innerHTML: svgQuest});
			else if(!options.picHelp && buttons.picHelp && options.picHelp != undefined) tools.destroyHTML(buttons.picHelp);

			if(options.picMinMax && !buttons.picMinMax) buttons.picMinMax	= tools.createHTML( {tag: 'div', parent: _header, className: 'wu-button', onclick: EVENTS.click.minMax});
			else if(!options.picMinMax && buttons.picMinMax && options.picMinMax != undefined) tools.destroyHTML(buttons.picMinMax);

			if(options.picCancel && !buttons.picCancel) buttons.picCancel	= tools.createHTML( {tag: 'div', parent: _header, className: 'wu-button', onclick: EVENTS.click.cancel, innerHTML: svgCross});
			else if(!options.picCancel && buttons.picCancel && options.picCancel != undefined) tools.destroyHTML(buttons.picCancel);
		},
		modal: function(options){ //set,create and destroy modals block
			if(options.modal && !modal){
				modal = tools.createHTML({tag: 'div', className: 'wu-modal', onmousedown: EVENTS.down.modal });
				modal.appendChild(_window);

				if(_setting.show)	parent.appendChild(modal);
				else				_fragment.appendChild(modal);

			} else if(!options.modal && modal){
				if(_setting.show)	parent.appendChild(_window);
				else				_fragment.appendChild(_window);

				tools.destroyHTML(modal);
			}
		}
	}
	var RESIZE = new function(){		//subclass for resize window
		var self;
		this.down = function(e, h, v){//h - horizontal move; v - vertical move
			self = {sx: e.pageX, sy: e.pageY, h: h, v: v,
					height: _window.offsetHeight,
					width: _window.offsetWidth,
					left: _window.offsetLeft,
					top: _window.offsetTop,
					offHeight: parent.clientHeight,
					offWidth: parent.clientWidth};
			self.rectangle = tools.createHTML({tag:'div', className:'wu-rectangle-resize', parent: parent });

			move(e);
			window.addEventListener("mousemove", move);
			window.addEventListener("mouseup", up);
		}
		function move(e){
			var nself = {left: self.left, top: self.top, height: self.height, width: self.width};

			if(self.h == 1)			nself.width = self.width - (self.sx - e.pageX);
			else if(self.h == 2){	nself.left = self.left - (self.sx - e.pageX);	nself.width = self.width + (self.sx - e.pageX);	}
			if(self.v == 1)			nself.height = self.height - (self.sy - e.pageY);
			else if(self.v == 2){	nself.top = self.top - (self.sy - e.pageY);		nself.height = self.height + (self.sy - e.pageY);	}

			if(nself.width < _setting.minWidth){
				nself.width = _setting.minWidth;
				if(self.h == 2) nself.left = self.left + self.width - _setting.minWidth;
			}
			if(nself.height < _setting.minHeight){
				nself.height = _setting.minHeight;
				if(self.h == 2) nself.top = self.top + self.height - _setting.minHeight;
			}

			if(nself.top + nself.height > (self.offHeight)) nself.height = self.offHeight - nself.top;
			if(nself.left + nself.width > (self.offWidth)) nself.width = self.offWidth - nself.left;

			if(nself.top < 0) { nself.top = 0; nself.height = self.height + self.top; }
			if(nself.left < 0){ nself.left = 0; nself.width = self.width + self.left; }

			self.nself = nself;
			self.rectangle.style.cssText = 'left: ' + nself.left + 'px; top: ' + nself.top + 'px; width: ' + nself.width + 'px; height: ' + nself.height + 'px;';
		}
		function up(e){

			if(self.nself.left == 0 && self.nself.top == 0 && self.nself.width == self.offWidth && self.nself.height == self.offHeight)	CHANGE.minMax({minMax:true});
			else {
				if(_setting.minMax) CHANGE.minMax({minMax:false});
				if(_setting.width_type)										_setting.width = tools.roundPlus((self.nself.width*100)/self.offWidth,1);
				else														_setting.width = self.nself.width;
				if(_setting.height_type)									_setting.height = tools.roundPlus((self.nself.height*100)/self.offHeight,1);
				else														_setting.height = self.nself.height;

				if(_setting.left_type && !_setting.width_type){				_setting.left = tools.roundPlus((self.nself.left*100 + self.nself.width*50)/self.offWidth,1);
					if(tools.roundPlus((self.nself.left*100 + self.nself.width*100)/self.offWidth,1) == 100) _setting.left = -1;
				} else if(_setting.left_type)								_setting.left = tools.roundPlus((self.nself.left*100)/self.offWidth,1);
				else														_setting.left = self.nself.left;
				if(_setting.top_type && !_setting.height_type){				_setting.top = tools.roundPlus((self.nself.top*100 + self.nself.height*50)/self.offHeight,1);
					if(tools.roundPlus((self.nself.top*100 + self.nself.height*100)/self.offHeight,1) == 100) _setting.top = -1;
				} else if(_setting.top_type)								_setting.top = tools.roundPlus((self.nself.top*100)/self.offHeight,1);
				else														_setting.top = self.nself.top;
			}			

			CHANGE.apply_position();
			tools.destroyHTML(self.rectangle);

			var event = new CustomEvent("resize", {bubbles: true, cancelable: true});		
			window.dispatchEvent(event);

			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
			self = undefined;
		}
	}
	var DRAG = new function(){			//subclass for moving window
		var self;

		this.down = function(e){
			self = {sx: e.pageX, sy: e.pageY, width: parent.clientWidth, height: parent.clientHeight};
			window.addEventListener("mousemove", move);
			window.addEventListener("mouseup", up);
		}
		function move(e){
			if(!self.move){
				if(Math.abs(self.sx - e.pageX) > 3 || Math.abs(self.sy - e.pageY) > 3 ){
					self.move = true;

					if(_setting.left == -1)									self.left = (100 - tools.roundPlus((_setting.width*100)/(self.width*2), 1));
					else													self.left = _setting.left;
					if(_setting.top == -1)									self.top = (100 - tools.roundPlus((_setting.height*100)/(self.height*2), 1));
					else													self.top = _setting.top;
	
					if(_setting.left_type && !_setting.width_type)			self.minLeft = tools.roundPlus((_setting.width*100)/(self.width*2), 1);
					else													self.minLeft = 0;
					if(_setting.top_type && !_setting.height_type)			self.minTop = tools.roundPlus((_setting.height*100)/(self.height*2), 1);
					else													self.minTop = 0;

					if(_setting.left_type && !_setting.width_type)			self.maxLeft = 100 - tools.roundPlus(((_setting.width*100)/(self.width*2)),1);
					else if(_setting.left_type)								self.maxLeft = 100 - _setting.width;
					else													self.maxLeft = self.width - _window.offsetWidth;
		
					if(_setting.top_type && !_setting.height_type)			self.maxTop = 100 - tools.roundPlus(((_setting.height*100)/(self.height*2)),1);
					else if(_setting.top_type)								self.maxTop = 100 - _setting.height;
					else													self.maxTop = self.height - _window.offsetHeight;
				}
			} else {
				if(_setting.left_type)	_setting.left = tools.roundPlus(self.left - ((self.sx - e.pageX)*100)/self.width,1);
				else					_setting.left = (self.left - self.sx + e.pageX);
				
				if(_setting.top_type)	_setting.top = tools.roundPlus(self.top - ((self.sy - e.pageY)*100)/self.height,1);
				else					_setting.top = (self.top - self.sy + e.pageY);

				if(_setting.left < self.minLeft)						_setting.left = self.minLeft;
				if(_setting.top  < self.minTop) 						_setting.top = self.minTop;
				if(_setting.left > self.maxLeft){
					if(_setting.left_type && !_setting.width_type)	_setting.left = -1;
					else 											_setting.left = self.maxLeft;
				} 
				if(_setting.top  > self.maxTop) {
					if(_setting.top_type && !_setting.height_type)	_setting.top = -1;
					else 											_setting.top = self.maxTop;
				} 
				CHANGE.apply_position();
			}
		}
		function up(e){
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
			self = undefined;
		}
	}

	link.create(options);
}
