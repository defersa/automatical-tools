//
//	Created by Makarov Aleksand
//

//	Feaches:


//	Custom functions:

//	click - ARGUMENTS(e, type, item): e - parameter of event, type - true/false click on item or under item , item - the item above the cursor. - RETURNS - none
//	rightClick - ARGUMENTS(e, type, item): e - parameter of event, type - true/false click on item or under item, item - the item above the cursor. - RETURNS - none
//	keyDown - ARGUMENTS(e, type, items): e - parameter of event, type - true/false click on item or above item, items - the item which selected. - RETURNS - need to call standard behavior (true - yes / false - no)
//	curren - ARGUMENTS(item): item - the item which become current. - RETURNS - none
//  drag - event before start drag (based on HTML5 D&D) - ARGUMENTS(e, link, selected): e - parameter of event, link - reference to the tree where the event occurred, selected - selected items. - RETURNS - text that will be in "dataTransfer.data"
// 	drop - event after drop in tree(based on HTML5 D&D) - ARGUMENTS(e, link, index, items): e - parameter of event, link - reference to the tree from which drag, index - position in parent, items - selected items that drag.
// 

function list_ui(options){

	var _bar;

	var _setting;
	var _functions;

	var link = this;
	var _fragment = document.createDocumentFragment();

	link.create = function(options){
		
		if(!options)		options = {};

		if(_bar)			link.remove();

		// default value

		if(options.iterator === undefined)		options.iterator = true;
		if(options.maxWidth === undefined)		options.maxWidth = '';

		// create main object
		CREATE.bar();

		_setting = {};
		_functions = {};

		// apply initial values
		link.change(options);
	}

	link.change = function(options){
		if(!options)									options = {};

		if(options.parent !== undefined)				SET.parent(options);
		if(options.functions !== undefined)				SET.functions(options);
		if(options.ratio !== undefined)					SET.ratio(options);
		if(options.maxWidth !== undefined)				SET.maxWidth(options);

		if(options.items !== undefined)					link.addItems(options.items);


		if(options.iterator !== undefined)				CHANGE.iterator(options);

		CHANGE.refresh();
	}

	link.remove = function(options){
		_functions = undefined;
		_setting = undefined;

		SELECT.removeAll();
		CURRENT.clear();
		tools.destroyHTML(_bar.viewport);
		_bar = undefined
	}
	link.addItems = function(arr, position){
		if(!Array.isArray(arr))		arr = [arr];
		if(position === undefined)	position = _bar.list.length;
		
		var result = [];

		for(var i = 0; i < arr.length; i++){
			result[i] = CHANGE.add( arr[i], position + i )
		}

		CHANGE.normalize();
		return result;
	}
	link.removeItems = function(arr){
		if(arr == undefined)		arr = _bar.list.concat();
		if(!Array.isArray(arr))		arr = [arr];

		for(var i = 0; i < arr.length; i++){
			if(typeof arr[i] == 'number')	
				arr[i] = GET.itemByNumber(arr[i]);		
		}

		for(var i = 0; i < arr.length; i++){
			CHANGE.remove(arr[i]);
		}
		CHANGE.normalize();
	}

	link.getItems = function(){		return _bar.list.concat();	}
	link.getCurrent = function(){	return CURRENT.get();	}
	link.getSelect = function(){	return SELECT.get();	}
	link.setCurrent = function(item){
		if(typeof item == 'number')	
			item = GET.itemByNumber(item);		
	
		CURRENT.set(item);	}
	link.setSelect = function(items){
		if(!Array.isArray(items))		items = [items];
	
		for(var i = 0; i < items.length; i++){
		
			if(typeof items[i] == 'number')	
				items[i] = GET.itemByNumber(items[i]);		
		
			SELECT.add(items[i]);
		}
		link.showItem(items.last());
		CURRENT.set(items.last());	}
	link.setFocus = function(){		_bar.viewport.html.focus();	}
	link.removeSelect = function(items){
		if(items == undefined){
			SELECT.removeAll();
		} else {
			if(!Array.isArray(items))		items = [items];
			
			for(var i = 0; i < items.length; i++){
			
				if(typeof items[i] == 'number')
					items[i] = GET.itemByNumber(items[i]);			
	
				SELECT.remove(items[i]);
			}
		}	}
	link.showItem = function(item){
		
		if(item === undefined)	return;

		if(typeof item == 'number')
			item = GET.itemByNumber(item);

		if(_bar.viewport.html.scrollTop > item.html.offsetTop){
			_bar.viewport.html.scrollTop = item.html.offsetTop - 20;
		}
		if((_bar.viewport.html.offsetHeight + _bar.viewport.html.scrollTop) < (item.html.offsetTop + item.html.offsetHeight)){
			_bar.viewport.html.scrollTop = item.html.offsetTop + item.html.offsetHeight - _bar.viewport.html.offsetHeight + 20;
		}	}
	link.move = function(items, position){
				
		if(position < 0)
			position = 0;

		if(!_bar.list.length || !items)
			return;

		if(!Array.isArray(items))
			items = [items];

		// get branch with wishes position
		var wishesItemPosition;
		if(position >= _bar.list.length){
			wishesItemPosition = _bar;
		} else {
			wishesItemPosition = _bar.list[position];
		}

		// save scroll position
		_bar.content.html.style.height = _bar.content.html.offsetHeight + 'px';

		for(var j = 0; j < items.length; j++){
			for(var i = 0; i < _bar.list.length; i++){
				if(items[j] == _bar.list[i]){
					_bar.list.splice(i, 1);
					_fragment.appendChild(items[j].html);
					_fragment.appendChild(items[j].indent);
					break;
				}
			}
		}
		
		CHANGE.normalize();

		// get wishes position
		position = wishesItemPosition.position;

		for(var i = 0; i < items.length; i++){
			SET.position(items[i], position + i);
		}

		// return default value of height
		_bar.content.html.style.height = undefined;
		CHANGE.normalize();
	}

	var EVENTS = {
		mouse: {
			down: {
				bar: function(e){
					
				}
			},
			click: {
				bar: function(e){

					var indent = tools.closest(e.target, 'pvb-indent');
					var item = tools.closest(e.target, 'pvb-item');

					if(item){

						item = item.link;
						var items = [];

						if(!e.ctrlKey){
							SELECT.removeAll();
						}

						if(e.shiftKey && CURRENT.item){
							
							var position = CURRENT.item.current ? ( (item.position < CURRENT.item.position) ? (CURRENT.item.position - 1) : CURRENT.item.position ) : CURRENT.item.position;

							CURRENT.set(CURRENT.item);
							CURRENT.setShift(item);
							
							var first = (item.position > position) ? position : item.position ;
							var last = (item.position < position) ? position : item.position ;
							
							for(var i = first; i <= last; i++){
								items.push( _bar.list[i] );
							}

						} else {
							items.push(item);
							CURRENT.set(item);
						}
						
						for(var i = 0; i < items.length; i++){
							if(items[i].select){
								SELECT.remove(items[i]);
							} else {
								SELECT.add(items[i]);
							}
						}

						if( typeof _functions.click == 'function' ){
							_functions.click( e, true, item );
						}
						return;

					} else if(!indent){
						indent = _bar.indent;
					}

					item = indent.link;
					CURRENT.setIndent(item);

					if(item.position){
						item = _bar.list[item.position - 1];
					} else {
						item = undefined;
					}

					if( typeof _functions.click == 'function' ){
						_functions.click( e, false, item );
					}

					return;
				}
			},
			dblclick: {
				bar: function(e){
					
					_bar.viewport.html.focus();

					var indent = tools.closest(e.target, 'pvb-indent');
					var item = tools.closest(e.target, 'pvb-item');


					if(item){
						item = item.link;
						if(!item.select){
							SELECT.removeAll();
							CURRENT.set(item);
							SELECT.add(item);
						}

						if( typeof _functions.dblClick == 'function' ){
							_functions.dblClick( e, true, item );
						}

						return false;
					} else if(!indent){
						indent = _bar.indent;
					}

					item = indent.link;
					CURRENT.setIndent(item);

					if(item.position){
						item = _bar.list[item.position - 1];
					} else {
						item = undefined;
					}

					if( typeof _functions.dblClick == 'function' ){
						_functions.dblClick( e, false, item );
					}

					return false;
				}
			},
			right: {
				bar: function(e){
					
					_bar.viewport.html.focus();

					var indent = tools.closest(e.target, 'pvb-indent');
					var item = tools.closest(e.target, 'pvb-item');


					if(item){
						item = item.link;
						if(!item.select){
							SELECT.removeAll();
							CURRENT.set(item);
							SELECT.add(item);
						}

						if( typeof _functions.rightClick == 'function' ){
							_functions.rightClick( e, true, item );
						}

						return false;
					} else if(!indent){
						indent = _bar.indent;
					}

					item = indent.link;
					CURRENT.setIndent(item);

					if(item.position){
						item = _bar.list[item.position - 1];
					} else {
						item = undefined;
					}

					if( typeof _functions.rightClick == 'function' ){
						_functions.rightClick( e, false, item );
					}

					return false;
				}
			}
		},
		key: {
			down: function(e){

				var kc = e.keyCode;
				var result = true; //flag of make default algorithm
	
				if(!CURRENT.get()){
					if(_bar.list.length != 0){
						CURRENT.set(_bar.list[0]);
						SELECT.add(_bar.list[0]);
						
						return false;
					}
				}

				var items = SELECT.get();

				if(CURRENT.item.current){
					
					if(kc == 38 || kc == 40){
						var item;
	
						if( kc == 38 )			item = GET.itemByNumber(CURRENT.item.position - 1);
						else if(kc == 40)		item = GET.itemByNumber(CURRENT.item.position);

						SELECT.removeAll();
						CURRENT.set(item);
						SELECT.add(item);
					}
					
					items = [CURRENT.item];

					if( e.ctrlKey && kc == 86 ){
						if(typeof _functions.keyDown == 'function'){
							if(_functions.keyDown(e, true, items)){
								tools.stopProp(e);
								return false;
							}
						}
					}
				} else if(items.length && (kc == 38 || kc == 40) ){
					if(e.ctrlKey && e.shiftKey){
						if(kc == 38){
							link.move(items, 0 );
							link.showItem(items[0]);
						} else if(kc == 40){						
							link.move(items, _bar.list.length + 1 );
							link.showItem(items.last());
						}
						link.showItem(items[0]);
					} else if(e.ctrlKey){
						if(kc == 38){
							link.move(items, items[0].position - 1 );
							link.showItem(items[0]);
						} else if(kc == 40){						
							link.move(items, items[0].position + items.length + 1 );
							link.showItem(items.last());
						}
	
					} else if(e.shiftKey){
						var item = CURRENT.getShift();
						var newItem;
						if(kc == 38){
							newItem = GET.itemByNumber( item.position - 1);
						} else if(kc == 40){						
							newItem = GET.itemByNumber( item.position + 1);
						}
						SELECT.removeAll();

						CURRENT.setShift(newItem);
						var sp = (newItem.position > CURRENT.get().position) ? CURRENT.get().position : newItem.position;
						var lp = (newItem.position < CURRENT.get().position) ? CURRENT.get().position : newItem.position;

						for(var i = sp; i <= lp; i++){
							SELECT.add(_bar.list[i]);
						}
						link.showItem(newItem);

					} else {
						SELECT.removeAll();
						var newItem;
						if(kc == 38){
							newItem = GET.itemByNumber( items[0].position - 1);
						} else if(kc == 40){						
							newItem = GET.itemByNumber( items.last().position + 1);
						}
						CURRENT.set(newItem);
						SELECT.add(newItem);
						link.showItem(newItem);					
					}
					return false;
				} else if( (e.ctrlKey && (kc == 67 || kc == 86)) || kc == 46 || kc == 13 ){
					if(typeof _functions.keyDown == 'function'){
						if(_functions.keyDown(e, false, items)){
							tools.stopProp(e);
							return false;
						}
					}
				}
				return;	
			}
		}
	}

	var CREATE = {
		bar: function(){
			_bar = {};

			_bar.viewport = {};
			_bar.viewport.html = tools.createHTML({
				tag: 'div',
				className: 'pvb-viewport',

				onclick: EVENTS.mouse.click.bar,
				oncontextmenu: EVENTS.mouse.right.bar,
				ondblclick: EVENTS.mouse.dblclick.bar,
				onkeydown: EVENTS.key.down,
				
				tabIndex: 0,
				parent: _fragment
			});


			_bar.content = {};
			_bar.content.html = tools.createHTML({
				tag: 'div',
				className: 'pvb-content',
				parent: _bar.viewport.html
			})

			_bar.content.html.ondragover = DRAGDROP.over;
			_bar.content.html.ondragleave = DRAGDROP.leave;
			_bar.content.html.ondrop = DRAGDROP.drop;


			_bar.indent = tools.createHTML({
				tag: 'div',
				link: _bar,
				className: 'pvb-indent',
				innerHTML: '<div class="pvb-indent-inner"></div>',
				parent: _bar.content.html
			});

			_bar.canvas = tools.createHTML({
				tag: 'canvas'
			});

			_bar.ctx = _bar.canvas.getContext("2d");
			_bar.ctx.font = "15px helvetica";

			_bar.list = [];
		},
		svgPreview: function(id, text){
			var svgFile = '';

			var svgWidth = 140;
			var textArray = [];

			svgFile += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 160 90" >';
			svgFile += '<style>.pvb-text { font: 14px helvetica; fill: #000;}</style>';

			svgFile += "<text x='10' y='20' class='pvb-text'>" + id + "</text>";

			var startLength = Math.floor(text.length/(_bar.ctx.measureText(text).width/svgWidth));

			for(var i = 0; i < 3; i++){

				if(startLength < text.length){
					var newLength = startLength + 1;
					var bit = 0;
					do {
						newLength--;
						bit = _bar.ctx.measureText(text.substring(0, newLength)).width;
					} while (bit > svgWidth)
					textArray.push({text: text.substring(0, newLength)});
					text = text.substring(newLength, text.length);
				} else {
					textArray.push({text: text});
					text = '';
					break;
				}
			}
			if(text)
				textArray.last().text = textArray.last().text.substring(0, textArray.last().text.length - 2) + '...';

			for(var i = 0; i < textArray.length; i++){
				svgFile += "<text x='10' y='" + (42 + i*18) + "' class='pvb-text'>" + textArray[i].text + "</text>";
			}


			svgFile += '</svg>';

			return svgFile;
		},
		htmlPreview: function(id, text){
			var htmlPr = '';

			htmlPr += '<div class="pvb-prev-id">' + id + '</div>';
			htmlPr += '<div class="pvb-prev-text">' + text + '</div>';

			return htmlPr;
		}
	}

	var GET = {
		itemByNumber: function(item){
			if(typeof item == 'number'){
				if(item < 0)						item = 0;
				else if(item >= _bar.list.length)	item = _bar.list.length - 1;
			} else {
				item = 0;
			}
			return _bar.list[item];
		}
	}

	var SET = {
		parent: function(options){
			_setting.parent = options.parent;

			if(options.parent instanceof Node)
				options.parent.appendChild(_bar.viewport.html);
			else
				_fragment.appendChild(_bar.viewport.html);
		},
		position: function(item, position){
			
			var childBefore = _bar.content.html.children[position*2];

			// ordered addition of elements
			_bar.content.html.insertBefore( item.indent, childBefore );
			_bar.content.html.insertBefore( item.html, childBefore );

			_bar.list.splice(position, 0, item);
			item.position = position;

			CHANGE.normalize();
		},
		maxWidth: function(options){
			_setting.maxWidth = options.maxWidth;
			if(options.maxWidth){
				_bar.content.html.style.maxWidth = options.maxWidth + 'px';
			} else {
				_bar.content.html.style.maxWidth = '';
			}
		},
		ratio: function(options){
			_setting.ratio = options.ratio;
			if(options.ratio){
				_bar.viewport.html.className = 'pvb-viewport pvb-old';
			} else {
				_bar.viewport.html.className = 'pvb-viewport';
			}
		},
		functions: function(options){
			if( options.functions.click !== undefined )					_functions.click = options.functions.click;
			if( options.functions.rightClick !== undefined )			_functions.rightClick = options.functions.rightClick;
			if( options.functions.dblClick !== undefined )				_functions.dblClick = options.functions.dblClick;
			if( options.functions.current !== undefined )				_functions.current = options.functions.current;
			if( options.functions.keyDown !== undefined )				_functions.keyDown = options.functions.keyDown;
			if( options.functions.drag !== undefined )					_functions.drag = options.functions.drag;
			if( options.functions.drop !== undefined )					_functions.drop = options.functions.drop;
		}
	}

	var CHANGE = {
		add: function(obj, position){

			// default - add in end
			if(position === undefined)	position = _bar.list.length;

			var item = {};
			item.obj = obj;
			item.html = tools.createHTML({
				tag: 'div',
				className: 'pvb-item',
				link: item
			});

			item.html.draggable = true;
			item.html.ondragstart = DRAGDROP.start;
			item.html.ondragend = DRAGDROP.end;

			item.indent = tools.createHTML({
				tag: 'div',
				className: 'pvb-indent',
				link: item,
				innerHTML: '<div class="pvb-indent-inner"></div>'
			});


			item.iterator = tools.createHTML({
				tag: 'div',
				className: 'pvb-item-iterator',
				parent: item.html,
				innerHTML: position + 1
			});

			item.wrapper = tools.createHTML({
				tag: 'div',
				className: 'pvb-item-wrapper',
				parent: item.html
			});

			item.container = tools.createHTML({
				tag: 'div',
				className: 'pvb-item-container',
				parent: item.wrapper
			});

			item.inner = item.obj.text;

			item.preview = tools.createHTML({
				tag: 'div',
				className: 'pvb-item-preview',
				link: item,
				innerHTML: item.inner,
				parent: item.container
			});

			if(obj.span){
				item.iterator.style.display = 'none';
			}

			SET.position( item, position );

			return item;
		},
		remove: function(item){
			SELECT.remove(item);
			if(CURRENT.get() == item) CURRENT.clear();
			tools.destroyHTML(item.html);
			tools.destroyHTML(item.indent);
			_bar.list.splice(item.position, 1);

			CHANGE.normalize();
		},
		normalize: function(){
			var count = 1;
			_bar.list.forEach(function(item, i){
				item.position = i;
				item.iterator.style.visibility = '';

				if(item.obj.iterator === false){
					item.iterator.style.visibility = 'hidden';
					item.iterator.innerHTML = count;					
				} else if(!item.obj.span ){
					item.iterator.innerHTML = count++;
				}
			});
			_bar.position = _bar.list.length;
		},
		refresh: function(){
			for(var i = 0; i < _bar.list.length; i++){
				var item = _bar.list[i];
				if(item.inner != item.obj.text){
					item.inner = item.obj.text;
					item.preview.innerHTML = item.inner;
				}

				if(item.hidden){
					item.html.style.display = 'none';
					item.indent.style.display = 'none';
				} else {
					item.html.style.display = 'flex';
					item.indent.style.display = 'block';				
				}
			}
			CHANGE.normalize();
		},
		iterator: function(options){
			_setting.iterator = options.iterator;
			if(_setting.iterator){
				_bar.content.html.className = 'pvb-content';
			} else {
				_bar.content.html.className = 'pvb-content pvb-no-iterator';
			}
		}
	}

	var SELECT = new function(){
		this.items = [];

		this.add = function(item){
			if( !item.select ){
				SELECT.items.push(item);
				
				item.select = true;
				item.html.className = 'pvb-item pvb-select';
			}
		}

		this.remove = function(item){
			if(item.select){
				for(var i = 0; i < SELECT.items.length; i++){
					if(item == SELECT.items[i]){
						
						SELECT.items.splice(i, 1);
	
						item.select = false;
						item.html.className = 'pvb-item';
						
						break;
					}
				}
			}
		}

		this.removeAll = function(){
			for(var i = 0; i < SELECT.items.length; i++){

				SELECT.items[i].select = false;
				SELECT.items[i].html.className = 'pvb-item';
			}

			SELECT.items = [];
		}

		this.get = function(){
			var result = [];
			for(var i = 0; i < _bar.list.length; i++){
				if(_bar.list[i].select){
					result.push(_bar.list[i]);
				}
			}
			return result;
		}
	}

	var CURRENT = new function(){
		this.item = undefined;

		this.shift = undefined;

		// item without visual effects
		this.set = function(item){
			this.clear()

			// ???????????????
			if(typeof _functions.current == 'function')
				_functions.current( item)

			this.item = item;
			CURRENT.setShift(item);
		}

		// space before item with visual
		this.setIndent = function(item){
			this.clear();

			this.item = item;
			this.item.current = true;
			item.indent.className = "pvb-indent pvb-current";
			SELECT.removeAll();
		}


		this.clear = function(){
			if(this.item){
				this.item.current = false;
				this.item.indent.className = "pvb-indent";
			}
		}

		this.get = function(){
			return this.item;
		}

		this.setShift = function(item){
			this.shift = item;
		}

		this.getShift = function(){
			return this.shift;
		}
	}

	var DRAGDROP = new function(){

		this.start = function(e){
			function getAvatar(items){
				var avatar = '';
				for(var i = 0; i < items.length; i++){
					avatar += '<div class="pvb-item pvb-select" style=" position: absolute; width: 150px; left: ' + 4*i + 'px; top: ' + 4*i + 'px; z-index: ' + i + '">'
							+ '<div class="pvb-item-wrapper">'
							+ '<div class="pvb-item-container">'
							+ '<div class="pvb-item-preview">' + items[i].inner + '</div></div></div></div>';
				}
				return avatar;
			}

			var item = tools.closest(e.target, 'pvb-item');

			if(!item){
				return false;
			}

			item = item.link;

			if(!item.select){
				CURRENT.set(item);
				SELECT.removeAll();
				SELECT.add(item);
			}

			var items = SELECT.get();

			if(!items.length){
				return false;
			}

			var htmlAvatar = tools.createHTML({
				tag: 'div',
				className: 'pvb-avatar',
				parent: document.body,
				innerHTML: getAvatar(items)
			});
			
			if(!window.clipboardData)
				e.dataTransfer.setDragImage(htmlAvatar, -5, -5);

			var dtText = 'text';
			if(typeof _functions.drag == 'function')
				dtText = _functions.drag(e, link, items);


		  	e.dataTransfer.effectAllowed = 'copy';
		  	e.dataTransfer.setData('text', dtText);

			window.customDrag = {
				avatar: htmlAvatar,
				items: items,
				input: link
			};


		  	tools.stopProp(e);
		}

		this.over = function(e){
			if(window.customDrag){
				var item = tools.closest(e.target, 'pvb-item');
				var indent = tools.closest(e.target, 'pvb-indent');

				if(!item && !indent)
					indent = _bar.indent;

				if(window.customDrag.target == indent && indent != undefined){
					return false;
				}

				if(window.customDrag.target){
					window.customDrag.target.id = '';
				}

				if(item){
					window.customDrag.target = item;
					return true;
				} else if(indent){
					window.customDrag.target = indent;
					indent.id = 'pvb-dragdrop';
					return false;
				}
			}
		}

		this.leave = function(e){

			var output = tools.closest(document.elementFromPoint(e.pageX, e.pageY), 'pvb-content');

			if(!window.customDrag)				return;
			if(output == _bar.content.html)		return;
			if(!window.customDrag.target)		return;
		
			window.customDrag.target.id = '';
			window.customDrag.target = undefined;
		}

		this.drop = function(e){
			if(window.customDrag){

				var items = window.customDrag.items;
				var index = window.customDrag.target.link.position;
				var move = true;

				if(_functions.drop){
					move = _functions.drop(e, link, index, items);
				}
				if(move){
					link.move( items, index );
				}
			}
			DRAGDROP.end(e);
		}
	
		this.end = function(e){
			if(window.customDrag){
				if(window.customDrag.target){
					window.customDrag.target.id = '';
				}
				tools.destroyHTML(window.customDrag.avatar)
				window.customDrag = undefined;
			}			
		}
	}

	link.create(options);
}