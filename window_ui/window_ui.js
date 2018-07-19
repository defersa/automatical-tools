function window_ui(options){
	// variables for changing size
	var resize;//support container
	var sides;
	var corners;

	//main controls and containers
	var parent;
	var modal;	
	var main_window;
	this.container;
	var buttons;
	var header;
	var footer;

	var fragment = document.createDocumentFragment(); //inner parent
	var link = this; //link
	var setting; //general options
	var functions; //functions for buttons and events

	//icons for header bar
	var cross_icon	= '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" xml:space="preserve"><style type="text/css">.wu-button .fill {fill: transparent;}.wu-button .cross{fill: #d7ebf5;}.wu-button:hover  .cross{fill: #FFFFFF;}.wu-button:hover  .fill {fill: #1562af;}.wu-button:active .cross{fill: #FFFFFF;}.wu-button:active .fill {fill: #0d3b69;}.wu-button .fill, .wu-button .cross, .wu-button:hover .cross, .wu-button:hover .fill, .wu-button:active .cross, .wu-button:active .fill { -webkit-transition: .3s;-moz-transition: .3s;transition: .3s; }</style><g class="fill"><path d="M 0,0 L 24,0 L 24,24 L 0,24 L 0,0 z" /></g><g class="cross"><path d="M 5.5,7 L 7,5.5 L 18.5,17 L 17,18.5 L 5.5,7 z" /><path d="M 5.5,17 L 7,18.5 L 18.5,7 L 17,5.5 L 5.5,17 z" /></g></svg>';
	var max_icon	= '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" xml:space="preserve"><style type="text/css">.wu-button .fill {fill: transparent;}.wu-button .cross{fill: #d7ebf5;}.wu-button:hover  .cross{fill: #FFFFFF;}.wu-button:hover  .fill {fill: #1562af;}.wu-button:active .cross{fill: #FFFFFF;}.wu-button:active .fill {fill: #0d3b69;}.wu-button .fill, .wu-button .cross, .wu-button:hover .cross, .wu-button:hover .fill, .wu-button:active .cross, .wu-button:active .fill { -webkit-transition: .3s;-moz-transition: .3s;transition: .3s; }</style><g class="fill"><path d="M 0,0 L 24,0 L 24,24 L 0,24 L 0,0 z" /></g><g class="cross"><path d="M 6,6 L 18,6 L 18,18 L 6,18 L 6,10 L 7,10 L 7,17 L 17,17 L 17,10 L 6,10 L 6,6 z" /></g></svg>';
	var min_icon	= '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" xml:space="preserve"><style type="text/css">.wu-button .fill {fill: transparent;}.wu-button .cross{fill: #d7ebf5;}.wu-button:hover  .cross{fill: #FFFFFF;}.wu-button:hover  .fill {fill: #1562af;}.wu-button:active .cross{fill: #FFFFFF;}.wu-button:active .fill {fill: #0d3b69;}.wu-button .fill, .wu-button .cross, .wu-button:hover .cross, .wu-button:hover .fill, .wu-button:active .cross, .wu-button:active .fill { -webkit-transition: .3s;-moz-transition: .3s;transition: .3s; }</style><g class="fill"><path d="M 0,0 L 24,0 L 24,24 L 0,24 L 0,0 z" /></g><g class="cross"><path d="M 5,10 L 15,10 L 15,18 L 5,18 L 5,12 L 6,12 L 6,17 L 14,17 L 14,12 L 5,12 L 5,10 z" /><path d="M 8,6 L 19,6 L 19,14 L 16,14 L 16,13 L 18,13 L 18,8 L 10,8 L 10,9 L 9,9 L 9,6 z" /></g></svg>';
	var quest_icon	= '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" xml:space="preserve"><style type="text/css">.wu-button .fill {fill: transparent;}.wu-button .cross{fill: #d7ebf5;}.wu-button:hover  .cross{fill: #FFFFFF;}.wu-button:hover  .fill {fill: #1562af;}.wu-button:active .cross{fill: #FFFFFF;}.wu-button:active .fill {fill: #0d3b69;}.wu-button .fill, .wu-button .cross, .wu-button:hover .cross, .wu-button:hover .fill, .wu-button:active .cross, .wu-button:active .fill { -webkit-transition: .3s;-moz-transition: .3s;transition: .3s; }</style><g class="fill"><path d="M 0,0 L 24,0 L 24,24 L 0,24 L 0,0 z" /></g><g class="cross"><path d="M 8,10 C 8,7.5 9.5,6 12,6 C 14.5,6 16,7.5 16,10	L 16,10.25	C 16,10.75 16,11.5 14.5,12.5	Q 13,13.5 13,14.5		L 13,15	L 11,15 	L 11,14	Q 11,13 12.5,12	Q 14,11 14,10	C 14,8.75 13.25,8 12,8	C 10.75,8 10,8.75 10,10	 z" /><path d="M 11,16 L 13,16 L 13,18 L 11,18 L 11,16 z" /></g></svg>';

	link.create = function(options){
		if(main_window != undefined) this.remove();

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
		if(options.title == undefined)		options.title = 'Default';

		if(options.move == undefined)		options.move = true;
		if(options.fullSize == undefined)	options.fullSize = false; //fullsize mode at startup
		if(options.modal == undefined)		options.modal = false;
		if(options.resize == undefined)		options.resize = true;
		if(options.show == undefined)		options.show = true;
		if(options.parent == undefined)		options.parent = document.body;

		if(options.parent)		parent = options.parent;
		else if(!parent)		{ console.warn('Please set correct parent and try create window again!'); return; }
		
		buttons = {};	functions = {};		setting = {};

		//create basic control and containers
		main_window = tools.createHTML( {tag: 'div', className: 'wu-window', onmousedown: self_events.window_main_down});
		main_window.tabIndex = '-1';
		main_window.onkeydown = self_events.window_main_keydown; 		main_window.onkeyup = self_events.window_main_keyup;
		header			= tools.createHTML( {tag: 'div', parent: main_window, className: 'wu-header', onmousedown: window_move.mdown, ondblclick: function(e){if(!tools.closest(e.target, 'wu-button')) self_events.change_minMax_click();}});
		link.container	= tools.createHTML( {tag: 'div', parent: main_window, className: 'wu-content'});
		buttons.title	= tools.createHTML( {tag: 'div', parent: header, className: 'wu-title'});

		this.change(options);
	}
	link.remove = function(){
		if(setting.show){
			if(setting.modal)	modal.parentNode.removeChild(modal);
			else				main_window.parentNode.removeChild(main_window);
		}
		sides = undefined;		corners = undefined;
		resize = undefined;		parent = undefined;
		modal = undefined;		buttons = undefined;
		header = undefined;		footer = undefined;
		link.container = undefined;

		main_window = undefined;	functions = undefined;
		fragment = document.createDocumentFragment();
		setting = {};
	}
	link.change = function(options){
		if(options.parent != undefined)			self_change.change_parent(options);
		if(options.footer != undefined)			self_create.footer(options);			
		if(options.footer != undefined)			link.container.style.bottom =  ( (options.footer)? '51' : '3' ) + 'px';
		if(options.resize != undefined)			self_create.resize(options);
		if(options.footerContent != undefined)	self_change.change_footer_content(options);
		if(options.enterKey != undefined)		setting.enterKey = options.enterKey;
	
		if(options.ok != undefined || options.close != undefined || options.cancel != undefined 
			|| options.apply != undefined || options.customButtons != undefined)															self_create.footer_button(options);
		if(options.picCancel != undefined || options.picMinMax != undefined || options.picHelp != undefined)								self_create.header_icon(options);
		if(options.move != undefined)																										self_change.change_move(options);
		if(options.width != undefined || options.height != undefined || options.minWidth != undefined || options.minHeight != undefined)	self_change.change_size(options);
		if(options.left != undefined || options.top != undefined )																			self_change.change_position(options);

		if(options.title != undefined)			buttons.title.innerHTML = options.title;
		if(options.picMinMax != undefined)		self_change.change_minMax(options);
		if(options.modal != undefined)			self_change.change_modal(options);
		if(options.show != undefined)			self_change.change_visible(options);
		if(options.content != undefined)		self_change.change_content(options);
		if(options.functions != undefined)		self_change.set_functions(options);
		
		if(setting.show)	self_change.apply_position();
	}
	link.getOptions = function(){
		return tools.cloneObject(setting);
	}
	link.hasFocus = function(){
		if(document.activeElement == main_window)	return true;
		else										return false;
	}

	var self_events = {
		window_main_keydown: function(e){

			if(typeof functions.keyDown == 'function')	functions.keyDown(e, link);
			else {
				if(e.keyCode == 27 && (buttons.picCancel || buttons.cancel) ) onclick.cancel_button();
				if(e.keyCode == 13 && setting.enterKey){
					if(setting.ok) 			onclick.ok_button();
					else if(setting.apply)	onclick.apply_button();
				}
			}

			if (e.ctrlKey && ((e.keyCode == 37 || e.which == 37) || (e.keyCode == 39 || e.which == 39)) && setting.modal){
				tools.stopProp(e);
				return false;
			}
		},
		window_main_keyup: function(e){
			if(setting.modal)				tools.stopProp(e);
			return false;
		},
		change_minMax_click: function(){ //apply new option minimize/maximize
			if(buttons.picMinMax != undefined){
				self_change.change_minMax({fullSize: !setting.fullSize});
				self_change.apply_position();

				var event = new CustomEvent("resize", {bubbles: true, cancelable: true});		
				window.dispatchEvent(event);
			}
		},
		activeWindowChanged: function(){//change window on not active
			if(setting.active){
				setting.active = false;

				if(setting.modal)			modal.className = 'wu-modal wu-not-active';
				else						main_window.className = 'wu-window wu-not-active';
			}
		},
		window_main_down: function(){//change window on active
			if(!setting.active){
				var event = new CustomEvent("activeWindowChanged", {});		
				window.dispatchEvent(event);
				setting.active = true;
				if(setting.modal)			modal.className = 'wu-modal wu-active';
				else						main_window.className = 'wu-window wu-active';
				main_window.focus();
			}
		}
	}
	var self_change = {
		change_parent: function(options){
			parent = options.parent;
			if(setting.show)
				parent.appendChild(main_window);
		},
		change_content: function(options){
			link.container.innerHTML = '';
			if(typeof options.content == 'object'){
				link.container.appendChild(options.content);
				options.content.style.cssText = 'left: 0; right: 0; top: 0; bottom: 0; display: block; position: absolute;';
			}
		},
		change_footer_content: function(options){
			if(setting.footer){
				footer.content.innerHTML = '';
				if(typeof options.footerContent == 'object'){
					footer.content.appendChild(options.footerContent);
					options.footerContent.style.cssText = 'left: 0; right: 0; top: 0; bottom: 0; display: block; position: absolute;';
				} 
			}
		},
		change_move: function(options){
			setting.move = options.move;
		},
		change_modal: function(options){
			setting.modal = options.modal;
			self_create.modal(options);		
		},
		change_visible: function(options){
			if(options.show && !setting.show){
				window.addEventListener('activeWindowChanged', self_events.activeWindowChanged);
				if(modal)
					parent.appendChild(modal);
				else
					parent.appendChild(main_window);

				self_events.window_main_down();
				main_window.focus();
			} else if(!options.show && setting.show){
				window.removeEventListener('activeWindowChanged', self_events.activeWindowChanged);
				if(modal)
					fragment.appendChild(modal);
				else
					fragment.appendChild(main_window);
			} else if(options.show && setting.show){
				self_events.window_main_down();
				main_window.focus();
			}
			setting.show = options.show;
		},
		change_minMax: function(options){
			setting.fullSize = options.fullSize;
			if(buttons.picMinMax){
				if(options.fullSize)	buttons.picMinMax.innerHTML = min_icon;
				else					buttons.picMinMax.innerHTML = max_icon;
			}
		},
		change_size: function(options){// set input size for window
			if(options.width != undefined){
				setting.width_type = 1;
				if(options.width.indexOf('%') != -1){			setting.width = parseFloat(options.width.substring(0, options.width.indexOf('%')));
				} else if(options.width.indexOf('px') == -1){	setting.width = parseFloat(options.width);
				} else {
					setting.width = parseFloat(options.width.substring(0, options.width.indexOf('px')));
					setting.width_type = 0;
				}
			}
			if(options.height != undefined){
				setting.height_type = 1;
				if(options.height.indexOf('%') != -1){			setting.height = parseFloat(options.height.substring(0, options.height.indexOf('%')));
				} else if(options.height.indexOf('px') == -1){	setting.height = parseFloat(options.height);
				} else {
					setting.height = parseFloat(options.height.substring(0, options.height.indexOf('px')));
					setting.height_type = 0;
				}
			}
			if(options.minWidth != undefined){
				if(options.minWidth.indexOf('px') != -1)		setting.minWidth = parseFloat(options.minWidth.substring(0, options.minWidth.indexOf('px')));
				else if(typeof options.minWidth == 'string')	setting.minWidth = parseFloat(options.minWidth);
				else											setting.minWidth = options.minWidth;
			}
			if(options.minHeight != undefined){
				if(options.minHeight.indexOf('px') != -1)		setting.minHeight = parseFloat(options.minHeight.substring(0, options.minHeight.indexOf('px')));
				else if(typeof options.minHeight == 'string')	setting.minHeight = parseFloat(options.minHeight);
				else											setting.minHeight = options.minHeight;
			}
		},
		change_position: function(options){// set input position for window
			if(options.left != undefined){
				setting.left_type = 1;
				if(options.left == 'left')						setting.left = 0;
				else if(options.left == 'center'){
					if(setting.width_type)					setting.left = 50 - tools.roundPlus(setting.width/2,1);
					else										setting.left = 50;
				} else if(options.left == 'right'){
					if(setting.width_type)					setting.left = 100 - setting.width;
					else										setting.left = -1;
				} else if(options.left.indexOf('%') != -1){		setting.left = parseFloat(options.left.substring(0, options.left.indexOf('%')));
				} else if(options.left.indexOf('px') != -1){	setting.left = parseFloat(options.left.substring(0, options.left.indexOf('px')));
																setting.left_type = 0;
				} else if(typeof options.left == 'string')		setting.left = parseFloat(options.left);
				else if(typeof options.left == 'number')		setting.left = options.left;
			}

			if(options.top != undefined){
				setting.top_type = 1;
				if(options.top == 'top')						setting.top = 0;
				else if(options.top == 'center'){
					if(setting.height_type)				setting.top = 50 - tools.roundPlus(setting.height/2,1);
					else										setting.top = 50;
				} else if(options.top == 'bottom'){
					if(setting.height_type)				setting.top = 100 - setting.height;
					else										setting.top = -1;
				} else if(options.top.indexOf('%') != -1){		setting.top = parseFloat(options.top.substring(0, options.top.indexOf('%')));
				} else if(options.top.indexOf('px') != -1){		setting.top = parseFloat(options.top.substring(0, options.top.indexOf('px')));
																setting.top_type = 0;
				} else if(typeof options.top == 'string')		setting.top = parseFloat(options.top);
				else if(typeof options.top == 'number')			setting.top = options.top;
			}
		},
		apply_position: function(){
			if(!setting.fullSize){
				var cssText = '';

				if(setting.left == -1)										cssText += 'width: ' + (setting.width + (setting.width_type? '%' : 'px')) + '; right: 0; ';
				else if(setting.left_type && !setting.width_type)			cssText += 'width: ' + setting.width + 'px; left: Calc(' + setting.left + '% - ' + Math.round(setting.width/2) + 'px); '; 
				else														cssText += 'width: ' + (setting.width + (setting.width_type? '%' : 'px')) + '; left:' + (setting.left + (setting.left_type? '%' : 'px')) + '; ';
				
				if(setting.top == -1)										cssText += 'height: ' + (setting.height + (setting.height_type? '%' : 'px')) + '; bottom: 0; ';
				else if(setting.top_type && !setting.height_type)			cssText += 'height: ' + setting.height + 'px; top: Calc(' + setting.top + '% - ' + Math.round(setting.height/2) + 'px); '; 
				else														cssText += 'height: ' + (setting.height + (setting.height_type? '%' : 'px')) + '; top:' + (setting.top + (setting.top_type? '%' : 'px')) + '; ';
			
																			cssText += 'min-height: ' + (setting.minHeight + 'px') + '; min-width: ' + (setting.minWidth + 'px');

				main_window.style.cssText  = cssText;
			} else main_window.style.cssText = 'left: 0; right: 0; top: 0; bottom:0';
		},
		set_functions: function(options){ //set custom (input) functions for buttons
			if(options.functions.ok !== undefined)				functions.ok = options.functions.ok;
			if(options.functions.cancel !== undefined)			functions.cancel = options.functions.cancel;
			if(options.functions.close !== undefined)			functions.close = options.functions.close;
			if(options.functions.help !== undefined)			functions.help = options.functions.help;
			if(options.functions.apply !== undefined)			functions.apply = options.functions.apply;
			if(options.functions.keyDown !== undefined)			functions.keyDown = options.functions.keyDown;
		}
	}
	var self_create = {
		resize: function(options){ //create and destroy resize controls
			if(options.resize != setting.resize && options.resize){
				setting.resize = true;
				resize = tools.createHTML( {tag: 'div', parent: main_window })
				resize.style.cssText = 'positon: absolute; left: 0; right: 0; top: 0; bottom: 0;';
		
				sides = {	r:	tools.createHTML( {tag: 'div', parent: resize, onmousedown: function(e){window_resize.mdown(e,1,0)}, className: 'wu-sides-r'}),
							b:	tools.createHTML( {tag: 'div', parent: resize, onmousedown: function(e){window_resize.mdown(e,0,1)}, className: 'wu-sides-b'}),
							l:	tools.createHTML( {tag: 'div', parent: resize, onmousedown: function(e){window_resize.mdown(e,2,0)}, className: 'wu-sides-l'}),
							t:	tools.createHTML( {tag: 'div', parent: resize, onmousedown: function(e){window_resize.mdown(e,0,2)}, className: 'wu-sides-t'})};
		
				corners = {	rb:	tools.createHTML( {tag: 'div', parent: resize, onmousedown: function(e){window_resize.mdown(e,1,1)}, className: 'wu-corners-rb'}),
							lb:	tools.createHTML( {tag: 'div', parent: resize, onmousedown: function(e){window_resize.mdown(e,2,1)}, className: 'wu-corners-lb'}),
							lt:	tools.createHTML( {tag: 'div', parent: resize, onmousedown: function(e){window_resize.mdown(e,2,2)}, className: 'wu-corners-lt'}),
							rt:	tools.createHTML( {tag: 'div', parent: resize, onmousedown: function(e){window_resize.mdown(e,1,2)}, className: 'wu-corners-rt'})};		
		
			} else if(options.resize != setting.resize && !options.resize && resize != undefined) {
				setting.resize = false;
				tools.destroyHTML	(resize);
			} else setting.resize = false;
		},
		footer: function(options){ //create and destroy footer
			if(options.footer != setting.footer){
				if(options.footer){
					footer 				=	tools.createHTML( {tag: 'div', parent: main_window, className: 'wu-footer'});
					footer.buttons		=	tools.createHTML( {tag: 'div', parent: footer, className: 'wu-footer-buttons'});
					footer.content		=	tools.createHTML( {tag: 'div', parent: footer, className: 'wu-footer-content'});
					buttons.ok			=	tools.createHTML( {tag: 'div', parent: footer.buttons, className: 'wu-button-dark',  onclick: onclick.ok_button, innerHTML: '<span>OK</span>'});
					buttons.apply		=	tools.createHTML( {tag: 'div', parent: footer.buttons, className: 'wu-button-dark',  onclick: onclick.apply_button, innerHTML: '<span>Apply</span>'});
					buttons.cancel		=	tools.createHTML( {tag: 'div', parent: footer.buttons, className: 'wu-button-white', onclick: onclick.cancel_button,  innerHTML: '<span>Cancel</span>'});
					buttons.close		=	tools.createHTML( {tag: 'div', parent: footer.buttons, className: 'wu-button-white', onclick: onclick.close_button, innerHTML: '<span>Close</span>'});
				}
				setting.footer = options.footer;
			}
		},
		footer_button: function(options){
			if(setting.footer){
				if(options.ok != undefined){
					if(!options.ok)						buttons.ok.style.display = 'none';
					else if(options.ok)					buttons.ok.style.display = '';
					setting.ok = options.ok;
				}
				if(options.apply != undefined){
					if(!options.apply)					buttons.apply.style.display = 'none';
					else if(options.apply)				buttons.apply.style.display = '';
					setting.apply = options.apply;
				}
				if(options.cancel != undefined){
					if(!options.cancel)					buttons.cancel.style.display = 'none';
					else if(options.cancel)				buttons.cancel.style.display = '';
					setting.cancel = options.cancel;
				}
				if(options.close != undefined){
					if(!options.close)					buttons.close.style.display = 'none';
					else if(options.close)				buttons.close.style.display = '';
					setting.close = options.close;
				}

				if(Array.isArray(options.customButtons)){
					if(Array.isArray(buttons.custom_buttons)){
						for(var i = 0; i < buttons.customButtons.length; i++)
							tools.destroyHTML(buttons.customButtons[i]);
					}
					buttons.custom_buttons = [];
					for(var i = 0; i < options.customButtons.length; i++){
						buttons.custom_buttons[i] = tools.createHTML( {tag: 'div', parent: footer, className: ((options.customButtons[i].style == 1) ? 'wu-button-dark' : 'wu-button-white')});
						tools.createHTML( {tag: 'span', parent: buttons.custom_buttons[i], innerHTML: options.customButtons[i].name});
						buttons.custom_buttons[i].onclick = options.customButtons[i].onclick;
					}
				}
			}
		},
		header_icon: function(options){ // create and destriy headers buttons
			if(options.picHelp && !buttons.picHelp) buttons.picHelp	= tools.createHTML( {tag: 'div', parent: header, className: 'wu-button', onclick: onclick.help_button, innerHTML: quest_icon});
			else if(!options.picHelp && buttons.picHelp && options.picHelp != undefined) tools.destroyHTML(buttons.picHelp);

			if(options.picMinMax && !buttons.picMinMax) buttons.picMinMax	= tools.createHTML( {tag: 'div', parent: header, className: 'wu-button', onclick: self_events.change_minMax_click});
			else if(!options.picMinMax && buttons.picMinMax && options.picMinMax != undefined) tools.destroyHTML(buttons.picMinMax);

			if(options.picCancel && !buttons.picCancel) buttons.picCancel	= tools.createHTML( {tag: 'div', parent: header, className: 'wu-button', onclick: onclick.cancel_button, innerHTML: cross_icon});
			else if(!options.picCancel && buttons.picCancel && options.picCancel != undefined) tools.destroyHTML(buttons.picCancel);
		},
		modal: function(options){ //set,create and destroy modals block
			if(options.modal && !modal){
				modal = tools.createHTML({tag: 'div', className: 'wu-modal', onclick: function(e){if(main_window != undefined && !tools.closest(e.target, 'wu-window')){ main_window.focus();} }});
				modal.appendChild(main_window);

				if(setting.show)	parent.appendChild(modal);
				else				fragment.appendChild(modal);

			} else if(!options.modal && modal){
				if(setting.show)	parent.appendChild(main_window);
				else				fragment.appendChild(main_window);

				tools.destroyHTML(modal);
			}
		}
	}
	var onclick = {// function onclick for buttons
		cancel_button: function(){	
			 if(typeof functions.cancel == 'function'){
				if(functions.cancel(link)) self_change.change_visible({show: false});
			} else self_change.change_visible({show: false});
		},
		close_button: function(){
			 if(typeof functions.close == 'function'){
				if(functions.close(link)) self_change.change_visible({show: false});
			} else self_change.change_visible({show: false});		 
		},
		apply_button: function(){
			if(typeof functions.apply == 'function'){
				if(functions.apply(link)) self_change.change_visible({show: false});
			} else self_change.change_visible({show: false});
		},
		ok_button: function(){
			if(typeof functions.ok == 'function'){
				if(functions.ok(link)) self_change.change_visible({show: false});
			} else self_change.change_visible({show: false});
		},
		help_button: function(){
			if(typeof functions.help == 'function'){
				functions.help(link);
			}
		}
	}

	var window_resize = new function(){//fullstack functions for resize window
		var self;
		this.mdown = function(e, h, v){//h - horizontal move; v - vertical move
			self = {sx: e.pageX, sy: e.pageY, h: h, v: v, height: main_window.offsetHeight, width: main_window.offsetWidth, left: main_window.offsetLeft, top: main_window.offsetTop, offHeight: parent.clientHeight, offWidth: parent.clientWidth};
			self.rectangle = tools.createHTML({tag:'div', className:'wu-rectangle-resize', parent: parent });

			mmove(e);
			window.addEventListener("mousemove", mmove);
			window.addEventListener("mouseup", mup);
		}
		function mmove(e){
			var nself = {left: self.left, top: self.top, height: self.height, width: self.width};

			if(self.h == 1)			nself.width = self.width - (self.sx - e.pageX);
			else if(self.h == 2){	nself.left = self.left - (self.sx - e.pageX);	nself.width = self.width + (self.sx - e.pageX);	}
			if(self.v == 1)			nself.height = self.height - (self.sy - e.pageY);
			else if(self.v == 2){	nself.top = self.top - (self.sy - e.pageY);		nself.height = self.height + (self.sy - e.pageY);	}

			if(nself.width < setting.minWidth){
				nself.width = setting.minWidth;
				if(self.h == 2) nself.left = self.left + self.width - setting.minWidth;
			}
			if(nself.height < setting.minHeight){
				nself.height = setting.minHeight;
				if(self.h == 2) nself.top = self.top + self.height - setting.minHeight;
			}

			if(nself.top + nself.height > (self.offHeight)) nself.height = self.offHeight - nself.top;
			if(nself.left + nself.width > (self.offWidth)) nself.width = self.offWidth - nself.left;

			if(nself.top < 0) { nself.top = 0; nself.height = self.height + self.top; }
			if(nself.left < 0){ nself.left = 0; nself.width = self.width + self.left; }

			self.nself = nself;
			self.rectangle.style.cssText = 'left: ' + nself.left + 'px; top: ' + nself.top + 'px; width: ' + nself.width + 'px; height: ' + nself.height + 'px;';
		}
		function mup(e){

			if(self.nself.left == 0 && self.nself.top == 0 && self.nself.width == self.offWidth && self.nself.height == self.offHeight)	self_change.change_minMax({minMax:true});
			else {
				if(setting.minMax) self_change.change_minMax({minMax:false});
				if(setting.width_type)										setting.width = tools.roundPlus((self.nself.width*100)/self.offWidth,1);
				else														setting.width = self.nself.width;
				if(setting.height_type)										setting.height = tools.roundPlus((self.nself.height*100)/self.offHeight,1);
				else														setting.height = self.nself.height;

				if(setting.left_type && !setting.width_type){				setting.left = tools.roundPlus((self.nself.left*100 + self.nself.width*50)/self.offWidth,1);
					if(tools.roundPlus((self.nself.left*100 + self.nself.width*100)/self.offWidth,1) == 100) setting.left = -1;
				} else if(setting.left_type)								setting.left = tools.roundPlus((self.nself.left*100)/self.offWidth,1);
				else														setting.left = self.nself.left;
				if(setting.top_type && !setting.height_type){				setting.top = tools.roundPlus((self.nself.top*100 + self.nself.height*50)/self.offHeight,1);
					if(tools.roundPlus((self.nself.top*100 + self.nself.height*100)/self.offHeight,1) == 100) setting.top = -1;
				} else if(setting.top_type)									setting.top = tools.roundPlus((self.nself.top*100)/self.offHeight,1);
				else														setting.top = self.nself.top;
			}			

			self_change.apply_position();
			tools.destroyHTML(self.rectangle);

			var event = new CustomEvent("resize", {bubbles: true, cancelable: true});		
			window.dispatchEvent(event);

			window.removeEventListener("mousemove", mmove);
			window.removeEventListener("mouseup", mup);
			self = undefined;
		}
	}
	var window_move = new function(){//fullstack functions for moving window
		var self;
		this.mdown = function(e){
			if(!setting.move || tools.closest(e.target, 'wu-button') ) return;
			
			self = {sx: e.pageX, sy: e.pageY, width: parent.clientWidth, height: parent.clientHeight};

			window.addEventListener("mousemove", mmove);
			window.addEventListener("mouseup", mup);
		}
		function mmove(e){
			if(!self.move){
				if(Math.abs(self.sx - e.pageX) > 3 || Math.abs(self.sy - e.pageY) > 3 ){
					self.move = true;

					if(setting.left == -1)									self.left = (100 - tools.roundPlus((setting.width*100)/(self.width*2), 1));
					else													self.left = setting.left;
					if(setting.top == -1)									self.top = (100 - tools.roundPlus((setting.height*100)/(self.height*2), 1));
					else													self.top = setting.top;
	
					if(setting.left_type && !setting.width_type)			self.minLeft = tools.roundPlus((setting.width*100)/(self.width*2), 1);
					else													self.minLeft = 0;
					if(setting.top_type && !setting.height_type)			self.minTop = tools.roundPlus((setting.height*100)/(self.height*2), 1);
					else													self.minTop = 0;

					if(setting.left_type && !setting.width_type)			self.maxLeft = 100 - tools.roundPlus(((setting.width*100)/(self.width*2)),1);
					else if(setting.left_type)								self.maxLeft = 100 - setting.width;
					else													self.maxLeft = self.width - main_window.offsetWidth;
		
					if(setting.top_type && !setting.height_type)			self.maxTop = 100 - tools.roundPlus(((setting.height*100)/(self.height*2)),1);
					else if(setting.top_type)								self.maxTop = 100 - setting.height;
					else													self.maxTop = self.height - main_window.offsetHeight;
				}
			} else {
				if(setting.left_type)	setting.left = tools.roundPlus(self.left - ((self.sx - e.pageX)*100)/self.width,1);
				else					setting.left = (self.left - self.sx + e.pageX);
				
				if(setting.top_type)	setting.top = tools.roundPlus(self.top - ((self.sy - e.pageY)*100)/self.height,1);
				else					setting.top = (self.top - self.sy + e.pageY);

				if(setting.left < self.minLeft)						setting.left = self.minLeft;
				if(setting.top  < self.minTop) 						setting.top = self.minTop;
				if(setting.left > self.maxLeft){
					if(setting.left_type && !setting.width_type)	setting.left = -1;
					else 											setting.left = self.maxLeft;
				} 
				if(setting.top  > self.maxTop) {
					if(setting.top_type && !setting.height_type)	setting.top = -1;
					else 											setting.top = self.maxTop;
				} 
				self_change.apply_position();
			}
		}
		function mup(e){
			window.removeEventListener("mousemove", mmove);
			window.removeEventListener("mouseup", mup);
			self = undefined;
		}
	}

	if(!options)
		options = {};	
	link.create(options);
}
