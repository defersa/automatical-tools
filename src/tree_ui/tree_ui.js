//
//	Created by Makarov Aleksand
//

//	feature:

// 	to add new items in root need use function "addItems" or "change" with argument "items"
//  to change (add - remove) items in tree occurs by changes to the source tree and use fucntion "change" without arguments
//  to change parameters in item need set value and use funtion "change" without arguments

//	Custom functions:

//	keyDown - ARGUMENTS(e, item, link): e - parameter of event, item - the item above the cursor, link - reference to the tree where the event occurred. - RETURNS - need to call standard behavior (true - yes / false - no)
//	rightClick - ARGUMENTS(e, item, selected): e - parameter of event, item - clicked item, selected - selected items. 
//	dblClick - ARGUMENTS(e, item): e - parameter of event, item - clicked item.
//	singleClick - ARGUMENTS(e, item): e - parameter of event, item - clicked item.
//	afterSelect - event after changing selection - ARGUMENTS(e, selected): e - parameter of event that caused changes, selected - selected items.
//  drag - event before start drag (based on HTML5 D&D) - ARGUMENTS(e, selected, link): e - parameter of event, selected - selected items, link - reference to the tree where the event occurred. - RETURNS - text that will be in "dataTransfer.data"
// 	drop - event after drop in tree(based on HTML5 D&D) - ARGUMENTS(e, export, import, items, parent, index): e - parameter of event, export - reference to the tree from which drag, import - reference to the tree from which drop, parent - item in which the release drop, index - position in parent
// 

function tree_ui(options){

	var parent; //outer container
	var timer;

	var _canvas; //background container
	var _viewport; //viewport container

	var _tree;	//topmost level of tree
	var _setting;
	var _functions;

	var link = this;
	var fragment = document.createDocumentFragment();

	link.create = function(options){
		if(_tree)										link.remove();

		if(options.width == undefined)					options.width = 20;
		if(options.height == undefined)					options.height = 20;

		if(options.defaultExpand == undefined)			options.defaultExpand = false;
		if(options.defaultDrag == undefined)			options.defaultDrag = false;
		if(options.defaultDrop == undefined)			options.defaultDrop = false;
		if(options.rootDrop == undefined)				options.rootDrop = false;

		if(options.defaultFolderOpen == undefined)		options.defaultFolderOpen = 'tu-FolderOpen';
		if(options.defaultFolderClose == undefined)		options.defaultFolderClose = 'tu-FolderClose';
		if(options.defaultTableIcon == undefined)		options.defaultTableIcon = 'tu-TableIcon';

		if(options.parent == undefined)					options.parent = fragment;
		if(options.show == undefined)					options.show = true;

		CREATE.viewport();
		_setting = {};
		_functions = {};
		_tree = { tree: { children: [] }, vector: [] };

		link.change(options);
	}
	link.remove = function(){
		tools.destroyHTML(_viewport);
		_tree = undefined;
		parent = undefined;
		_setting = undefined;
		_functions = undefined;

		window.removeEventListener("resize", DISPLAY.display);

		_viewport = undefined;
		_canvas = undefined;
	}
	link.change = function(options){
		if(!options)									options = {};

		if(options.parent != undefined)					CREATE.parent(options);
		if(options.functions != undefined)				CREATE.functions(options);
		if(options.show != undefined)					CREATE.show(options);
		if(options.defaultExpand != undefined)			CREATE.defaultExpand(options);

		if(options.height != undefined)					_setting.height = options.height;
		if(options.width != undefined)					_setting.width = options.width;
		if(options.defaultFolderOpen != undefined)		_setting.defaultFolderOpen = options.defaultFolderOpen;
		if(options.defaultFolderClose != undefined)		_setting.defaultFolderClose = options.defaultFolderClose;
		if(options.defaultTableIcon != undefined)		_setting.defaultTableIcon = options.defaultTableIcon;

		if(options.defaultDrop != undefined)			_setting.defaultDrop = options.defaultDrop;
		if(options.defaultDrag != undefined)			_setting.defaultDrag = options.defaultDrag;
		if(options.rootDrop != undefined)				_tree.tree.drop = options.rootDrop;
		if(options.outline !== undefined)				SET.outline(options);
		if(options.current != undefined)				CURRENT.set(options.current);

		if(options.items != undefined)					link.addItems(options.items);

		DISPLAY.generate();
	}

	link.addItems = function(items, position){
		if(position == undefined)		position = _tree.tree.children.length;
		if(!Array.isArray(items))		items = [items];
		for(var i = 0; i < items.length; i++){
			_tree.tree.children.splice(position + i, 0, items[i]);
		}	}
	link.removeItems = function(items){
		if(items == undefined)										items = _tree.tree.children;
		if(!Array.isArray(items))									items = [items];
		items = items.concat();

		for(var i = items.length - 1, index; i >= 0; i--){
			SELECT.remove(items[i]);			
			for(var j = 0; j < items[i].parent.children.length; j++){
				if(items[i].parent.children[j] == items[i])			index = j;
			}
			items[i].parent.children.splice(index, 1);
			if(items[i] == CURRENT.item)							CURRENT.item = undefined;
		}
		DISPLAY.generate();	}

	link.getRoot = function()				{	return _tree.tree;	}
	link.getItems = function()				{	return _tree.tree.children;	}
		//return current value of scroll in "viewport" 
	link.getScroll = function()				{	return _viewport.scrollTop; }
		//return selected items. "onlyParent" - true - return only selected parent, without his selected children
	link.getSelected = function(onlyParent)	{	return SELECT.get(onlyParent);	}
		//return items with concurrence "text"
	link.getFoundItems = function(text) 	{	return SEARCH.findItems(text);	}
		//showed items which fit the "text"
	link.showFoundItems = function(text)	{	SEARCH.showItems(text);	}
		//showed item; place: 0 - on the top, 1 - in the center,2 - at the end; showed - true - dont move viewport if item already showed
	link.showItem = function(item, place, showed)	{

		var visible = false;
		if(item.position >= _viewport.scrollTop && (item.position + _setting.width) <= (_viewport.offsetHeight + _viewport.scrollTop))
			visible = true;

		var parent = item.parent;
		while(parent != _tree.tree){
			parent.expand = true;
			parent = parent.parent;
		}
		DISPLAY.generate();
		var newTop = item.position - 10;

		if(place == 1)					newTop += - Math.round(_viewport.clientHeight/2) + 10;
		else if(place == 2)				newTop += - _viewport.clientHeight + 40;

		if(showed && item.html)			newTop = _viewport.scrollTop;

		_viewport.scrollTop = newTop;	}
	link.clearSelect = function()			{	SELECT.removeAll(); }

		//set transmitted value of scroll
	link.setScroll = function(size)			{	_viewport.scrollTop = size; }
	link.setFocus = function()				{	_viewport.focus(); }
	link.setCurrent = function(item)		{ if(item) CURRENT.set(item);	}

	var EVENTS = {
		keyDown: function(e){
			var kc = e.keyCode;
			var result = true; //flag of make default algorithm

			if(!CURRENT.item){
				if(_tree.vector.length != 0){
					if(DISPLAY.items.length != 0)			CURRENT.set(DISPLAY.items[0]);
					else									CURRENT.set(_tree.vector[0]);
				}
			}

			if( (e.ctrlKey &&
				(kc == 90 || kc == 88 || kc == 67 || kc == 86
				|| kc == 83 || kc == 70 || (kc >= 37 && kc <= 40)))
				|| kc == 46 || kc == 13 ){
				if(typeof _functions.keyDown == 'function')		result = _functions.keyDown(e, CURRENT.item, link);
			}

			if( _tree.vector.length == 0 || ((kc == 86 && e.ctrlKey)) )	return;

			if(result){
				var top = _viewport.scrollTop;
				var bot = _viewport.scrollTop + _viewport.clientHeight;
	
				if(kc == 38 || kc == 40){
					var index = (kc == 38) ? (CURRENT.item.index - 1) : (CURRENT.item.index + 1);
					
					if(index < 0 || isNaN(index))					index = 0;
					if(index >= _tree.vector.length)				index = _tree.vector.length - 1;
	
					if(e.shiftKey){
						if(!CURRENT.shiftItem)						CURRENT.shiftItem = CURRENT.item;
						CURRENT.set(_tree.vector[index]);
						SELECT.removeAll();
						
						var first = (CURRENT.item.index > CURRENT.shiftItem.index) ? CURRENT.shiftItem.index : CURRENT.item.index;
						var last  = (CURRENT.item.index < CURRENT.shiftItem.index) ? CURRENT.shiftItem.index : CURRENT.item.index;
						for(var i = first; i <= last; i++){
							SELECT.add(_tree.vector[i]);
						}
	
					} else if(!e.ctrlKey) {
						CURRENT.set(_tree.vector[index]);
						SELECT.removeAll();
						SELECT.add(CURRENT.item);
					}
					
					if(SELECT.get().length == 1 && !e.ctrlKey)						EVENTS.singleClick(e, SELECT.get()[0]);
					if(!e.ctrlKey)													EVENTS.afterSelect(e);
					if(CURRENT.item.position < top)									_viewport.scrollTop = CURRENT.item.position - 10;
					if((CURRENT.item.position + _setting.height + 1) > bot)			_viewport.scrollTop = CURRENT.item.position + _setting.height - _viewport.clientHeight + 10;
				}
	
				if( (kc == 37 || kc == 39) && !e.ctrlKey ){
					if(kc == 37){
						if(CURRENT.item.expand){
							CURRENT.item.expand = false;
							DISPLAY.generate();
						} else if(CURRENT.item.parent != _tree.tree){
							CURRENT.set(CURRENT.item.parent);
							SELECT.removeAll();
							SELECT.add(CURRENT.item);
							if(CURRENT.item.position < top)							_viewport.scrollTop = CURRENT.item.position - 10;
						}
					} else if(!CURRENT.item.expand && CURRENT.item.children){
						CURRENT.item.expand = true;						
						DISPLAY.generate();
					}
				}
	
				if(kc == 13 && typeof _functions.dblClick == 'function')			_functions.dblClick(CURRENT.item);
				if(e.ctrlKey && kc == 65)											SELECT.addAll();
	
				if(kc == 36)														_viewport.scrollTop = 0;
				if(kc == 35)														_viewport.scrollTop = _canvas.clientHeight;
				if(kc == 33)														_viewport.scrollTop += -_viewport.clientHeight*0.7;
				if(kc == 34)														_viewport.scrollTop += _viewport.clientHeight*0.7;
			} 
			if(e.shiftKey && e.ctrlKey && kc == 192){
				console.log(CURRENT.item);
			}

			if(	kc == 13 || kc == 38 || kc == 39 || kc == 40
				|| kc == 37 || kc == 65 || kc == 33 || kc == 34
				|| kc == 35 || kc == 36 || kc == 67 || kc == 83
				|| kc == 90 || kc == 88 || kc == 86 || kc == 70
				|| kc == 46){
				tools.stopProp(e);
				return false;
			}
		},
		keyUp: function(e){
			var kc = e.keyCode;
			if(kc == 16 && CURRENT.shiftItem){
				CURRENT.shiftItem = undefined;
			}
		},
		blur: function(e){
			if(CURRENT.shiftItem){
				CURRENT.shiftItem = undefined;
			}
		},
		rightClick: function(e){
			if(typeof _functions.rightClick == 'function'){
				var item = tools.closest(e.target, 'tu-item');
				if(item){
					item = item.item;
					if(!item.select){
						SELECT.removeAll();
						SELECT.add(item);
					}
				}
				_functions.rightClick(e, item, SELECT.get());
				return false;
			}
		},
		dblClick: function(e){
			if(e.shiftKey || e.ctrlKey || e.which != 1 || tools.hasClass(e.target,'tu-expand') ) return;

			if(timer){
				clearTimeout(timer);
				timer = undefined;
			}

			var item = tools.closest(e.target, 'tu-item');	
			if(typeof _functions.dblClick == 'function' && item)
				_functions.dblClick(e, item.item);
			_viewport.focus();
		},
		singleClick: function(e, item){
			if(timer){
				clearTimeout(timer);
				timer = undefined;
			}
			if(typeof _functions.singleClick == 'function'){
				timer = setTimeout(function() {
					timer = null;
					_functions.singleClick(e, item);
				}, 500); 
			}
			_viewport.focus();
		},
		afterSelect: function(e){
			var selected = SELECT.get();
			if(typeof _functions.afterSelect == 'function')					_functions.afterSelect(e, selected);
		},
		expandDown: function(e){

			function getHeight(item){
				var height = _setting.height;
				if(item.children && item.expand){
					for(var i = 0; i < item.children.length; i++)
						height += getHeight(item.children[i]);
				}
				return height;
			}

			if(e.which != 1)	return; 
			var item = tools.closest( e.target, 'tu-item').item;
			if(e.ctrlKey){
				var status = !item.expand;
				item.parent.children.forEach(function(obj) {	if(obj.children)	obj.expand = status;	} );
			} else {
				item.expand = !item.expand;
				if(item.expand){
					var itemsHeight = getHeight(item);
					var itemPosition = item.position;

					if(_viewport.scrollTop + _viewport.offsetHeight < itemsHeight + itemPosition){
						if(_viewport.offsetHeight < itemsHeight)	_viewport.scrollTop = itemPosition;
						else										_viewport.scrollTop = itemPosition + itemsHeight - _viewport.offsetHeight + Math.round(_setting.height*0.5);
					}
				}
			}

			DISPLAY.generate();
			_viewport.focus();

			tools.stopProp(e);
			return false;
		}
	}
	var SET = {
		outline: function(options){
			_setting.outline = options.outline;
			if(_setting.outline){
				_viewport.className = 'tu-viewport tu-viewport-focused';
			} else {
				_viewport.className = 'tu-viewport';
			}
		}
	}

	var CREATE = {
		parent: function(options){
			parent = options.parent;
			CREATE.show({show: _setting.show});
		},
		show: function(options){
			_setting.show = options.show;

			if(_setting.show)								parent.appendChild(_viewport);
			else											fragment.appendChild(_viewport);
		},
		defaultExpand: function(options){
			if(options.defaultExpand)						_setting.defaultExpand = true;
			else											_setting.defaultExpand = false;
		},
		functions: function(options){
			if(options.functions.singleClick != undefined)	_functions.singleClick = options.functions.singleClick;
			if(options.functions.dblClick != undefined)		_functions.dblClick = options.functions.dblClick;
			if(options.functions.rightClick != undefined)	_functions.rightClick = options.functions.rightClick;
			if(options.functions.afterSelect != undefined)	_functions.afterSelect = options.functions.afterSelect;
			if(options.functions.keyDown != undefined)		_functions.keyDown = options.functions.keyDown;
			if(options.functions.drag != undefined)			_functions.drag = options.functions.drag;
			if(options.functions.drop != undefined)			_functions.drop = options.functions.drop;
		},
		viewport: function(){
			_viewport = tools.createHTML({tag: 'div', className: 'tu-viewport',	onscroll: DISPLAY.display, tabIndex: 0, 
											onmousedown: SELECT.down,
											ondblclick: EVENTS.dblClick,
											onkeydown: EVENTS.keyDown,
											onblur: EVENTS.blur,
											onkeyup: EVENTS.keyUp,
											oncontextmenu: EVENTS.rightClick,
											onclick: SELECT.click	});

			_viewport.ondragenter = DRAGDROP.enter;				_viewport.ondragleave = DRAGDROP.leave;
			_viewport.ondragover = DRAGDROP.over;				_viewport.ondrop  = DRAGDROP.drop;
			_viewport.ondragend = DRAGDROP.end;					window.addEventListener("resize", DISPLAY.display);

			_canvas = tools.createHTML({tag: 'div', className: 'tu-content', parent: _viewport});
		}
	}

	var DISPLAY = new function() {

		this.items; //showed items
		
		this.generate = function(){

			function createVector(items, level, visible, parent){
				for(var i = 0; i < items.length; i++){
					items[i].index = _tree.vector.length;
					items[i].position = _setting.height * items[i].index;
					items[i].level = level;
					items[i].parent = parent;
					items[i].html = undefined;

					var oldVisible = (visible && !items[i].hidden) ? true : false;
					var newVisible = (!oldVisible || !items[i].expand) ? false : true;

					if(items[i].current && CURRENT.item != items[i])	items[i].current = false;
					if(oldVisible)						_tree.vector.push(items[i]);
					if(items[i].select)					SELECT.items.push(items[i]);
					if(items[i].children)				createVector(items[i].children, level + 1, newVisible, items[i]);
				}
			}

			DISPLAY.items = [];
			SELECT.items = [];
			_tree.vector = [];
			_canvas.innerHTML = '';

			createVector(_tree.tree.children, 0, true, _tree.tree);
			_canvas.style.height = (_tree.vector.length + 1) * _setting.height + 'px';
			_canvas.style.lineHeight = _setting.height + 'px';

			DISPLAY.display();
		}

		this.display = function(){
			var items = []; //new showed items

			if(window.customDrag != undefined)				window.customDrag.coord = _canvas.getBoundingClientRect();
			
			var top = _viewport.scrollTop;
			var bot = _viewport.offsetHeight + top;

			if(_viewport.offsetHeight == 0)					return;
			if(top == bot)									return;


			for(var i = 0; i < _tree.vector.length; i++){
				if(_tree.vector[i].position <= bot && (_tree.vector[i].position + _setting.height) >= top )
					items.push(_tree.vector[i]);
			}
			for(var i = 0; i < items.length; i++){
				if(items[i].html == undefined)
					DISPLAY.showItem(items[i]);
			}
			for(var i = 0; i < DISPLAY.items.length; i++){
				if(!(DISPLAY.items[i].position <= bot && (DISPLAY.items[i].position + _setting.height) >= top) )
					DISPLAY.hideItem(DISPLAY.items[i]);				
			}

			DISPLAY.items = items;
		}

		this.showItem = function(item){
			if(item.html != undefined) 				DISPLAY.hideItem(item);

			item.html = tools.createHTML({			tag: 'div',		className: 'tu-item',		parent: _canvas,		style: ('height: ' + (_setting.height + 1) + 'px; top: ' + item.position + 'px;') });
			item.html.expand = tools.createHTML({	tag: 'div',		className: 'tu-expand',		parent: item.html});
			item.html.caption = tools.createHTML({	tag: 'span',	className: 'tu-caption ',	parent: item.html,		onmouseover: DISPLAY.captionOver,	onmouseout: DISPLAY.captionOut,		innerHTML: item.text,	style: ('padding-left:' + _setting.width + 'px') });
			item.html.item = item; 

			if(item.select){
				item.html.className += ' tu-select';
				if((item.drag !== false && _setting.defaultDrag) || item.drag){
					item.html.draggable = true;
					item.html.ondragstart = DRAGDROP.start;
				}
			}
			if((item.drag !== false && _setting.defaultDrag) || item.drag){
				item.html.caption.draggable = true;
				item.html.caption.ondragstart = DRAGDROP.start;

			}

			if(item.current)  item.html.className += ' tu-current';
			item.html.expand.style.marginLeft = item.level*_setting.width + 'px';

			if(item.children){
				if(item.children.length != 0){
					item.html.expand.onmousedown = EVENTS.expandDown;
					 
					if(item.expand){
						item.html.expand.className += ' tu-expand-open';
						item.html.caption.className += ((item.iconOpen) ? item.iconOpen : ( (item.icon) ? item.icon : _setting.defaultFolderOpen ) );
					} else {
						item.html.expand.className += ' tu-expand-close';
						item.html.caption.className += (item.icon) ? item.icon : _setting.defaultFolderClose;
					}
				} else	item.html.caption.className	+= (item.icon) ? item.icon : _setting.defaultFolderClose;
			} else		item.html.caption.className	+= (item.icon) ? item.icon : _setting.defaultTableIcon;
		}

		this.hideItem = function(item){
			tools.destroyHTML(item.html);
			item.html = undefined;
		}

		this.captionOver = function(e){
			var item = tools.closest( e.target, 'tu-item');
			if(item.clientWidth < ( e.target.clientWidth + _setting.width*(item.item.level + 1)))	e.target.title = item.caption.innerText;
		}
		this.captionOut = function(e){
			e.target.title = '';
		}
	}

	var SELECT = new function() {
		var self;
		this.items = [];

		this.add = function(item){
			if(!item.select){
				var i = 0;
				for(; i < SELECT.items.length; i++){
					if(SELECT.items[i].position > item.position)	break;
				}
				SELECT.items.splice(i, 0, item);
				item.select = true;
				if(item.html){
					item.html.className += ' tu-select';
					if((item.drag !== false && _setting.defaultDrag) || item.drag){
						item.html.draggable = true;
						item.html.ondragstart = DRAGDROP.start;
					}
				}
			}
		}
		this.addAll = function(){
			this.removeAll();
			for(var i = 0; i < _tree.vector.length; i++)
				this.add(_tree.vector[i]);
		}
		this.remove = function(item){
			if(item.select){
				for(var i = 0; i < SELECT.items.length; i++){
					if(SELECT.items[i] == item){
						SELECT.items.splice(i, 1);
						break;
					}
				}
				item.select = false;
				if(item.html){
					item.html.className = item.html.className.replace(/ tu-select/g, '') 
					item.html.draggable = false;
				}
			}
		}
		this.removeAll = function(){
			for(var i = 0; i < SELECT.items.length; i++){
				var item = SELECT.items[i];
				item.select = false;
				if(item.html){
					item.html.className = item.html.className.replace(/ tu-select/g, '') 
					item.html.draggable = false;
				}
			}
			SELECT.items = [];
		}
		this.get = function(top){
			var result = [];
			if(top){
				for(var i = 0; i < SELECT.items.length; i++){
					var parent = SELECT.items[i].parent;
					while(parent != _tree.tree){
						if(parent.select){
							break;
						}
						parent = parent.parent;
					}
					if(parent == _tree.tree){
						result.push(SELECT.items[i])
					}
				}
			} else {
				result = SELECT.items.concat();
			}
			return result;
		}

		this.click = function(e){
			if(e.which != 1)		return;

			var item = tools.closest(e.target, 'tu-item');
			var items = [];

			if(!e.ctrlKey) 			SELECT.removeAll();

			if(item){
				item = item.item;

				if(e.shiftKey && CURRENT.item){
					var f = (CURRENT.item.index > item.index) ? item.index : CURRENT.item.index;
					var l = (CURRENT.item.index < item.index) ? item.index : CURRENT.item.index; 

					for(f; f <= l; f++)
						items.push(_tree.vector[f]);

				} else {
					CURRENT.set(item);
					items = [item];
				}
	
				for(var i = 0; i < items.length; i++){
					if( items[i].select )
						SELECT.remove(items[i]);
					else
						SELECT.add(items[i]);
				}
			}
			
			if(!e.shiftKey && !e.ctrlKey)
				EVENTS.singleClick(e, item);
			
			EVENTS.afterSelect(e);
			_viewport.focus();
		}

		this.down = function(e){
			var dragging = tools.closest(e.target, 'tu-select') || tools.closest(e.target, 'tu-caption');
			var coords = _viewport.getBoundingClientRect();

			if(e.which != 1 || dragging)																				return;
			if(e.pageX - coords.left >= _viewport.clientWidth && e.pageX - coords.left <= _viewport.offsetWidth)		return;

			self = { event: e, padding: _canvas.getBoundingClientRect() };

			window.addEventListener("mousemove", move);
			window.addEventListener("mouseup", up);
		}
		function move(e){
			if((Math.abs(e.pageX - self.event.pageX) > 3 || Math.abs(e.pageY - self.event.pageY) > 3) && !self.moved){
				self.rectangle = tools.createHTML({tag: 'div', className: 'tu-rectangle', parent: _canvas});
				self.moved = true;
				tools.startBackdrop({cursor: 'default'});
			}
			if(self.moved){
				var fX = (e.pageX - self.padding.left);
				var lX = (self.event.pageX - self.padding.left);
				var fY = (e.pageY - self.padding.top);
				var lY = (self.event.pageY - self.padding.top);
				var max; var min;
				max = (fX > lX)? fX : lX;
				min = (fX > lX)? lX : fX;
				fX = min; lX = max;
				max = (fY > lY)? fY : lY;
				min = (fY > lY)? lY : fY;
				fY = min; lY = max;

				self.rectangle.style.cssText = 'left: ' + fX + 'px; width: ' + (lX - fX) + 'px; top: ' + fY + 'px; height: ' + (lY - fY) + 'px;';
			}
			_viewport.focus();
		}
		function up(e){
			if(self.moved){
				tools.endBackdrop();
				tools.destroyHTML(self.rectangle);

				if(!e.ctrlKey)			SELECT.removeAll();
				var newSelect = [];

				var fY = (e.pageY - self.padding.top);		var lY = (self.event.pageY - self.padding.top);
				var y1 = (fY > lY)? fY : lY;				var y2 = (fY < lY)? fY : lY;

				for(var i = 0; i < DISPLAY.items.length; i++){
					var y3 = DISPLAY.items[i].position;
					var y4 = y3 + _setting.height;

					if( (( y3 <= y1 && y2 <= y4 ) ||
						( y3 >= y1 && y2 >= y4 ) ||
						( y1 <= y4 && y1 >= y3 ) ||
						( y2 <= y4 && y2 >= y3 )) )
						newSelect.push(DISPLAY.items[i]);					
				}
				for(var i = 0; i < newSelect.length; i++){
					if(newSelect[i].select && e.ctrlKey)										SELECT.remove(newSelect[i]);
					else																		SELECT.add(newSelect[i]);
				}

				var item = tools.closest(self.event.target, 'tu-item');
				if(item)		CURRENT.set(item.item); 
			}

			self = undefined;
			EVENTS.afterSelect(e);
			_viewport.focus();
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		}
	}

	var SEARCH = new function() {
		var not_found;

		function setShow(item, hidden){
			item.hidden = hidden;
			if(item.children){
				for(var i = 0; i < item.children.length; i++)		setShow(item.children[i], hidden);
				if(hidden) item.expand = false;
			}
		}
		function showParent(item){
			var parent = item.parent;
			while(parent != _tree.tree){
				parent.hidden = false;
				parent.expand = true;
				parent = parent.parent;
			}
		}
		function saveExpand(item){
			if(item.children){
				item.originExpand = item.expand;			
				for(var i = 0; i < item.children.length; i++)		saveExpand(item.children[i]);
			}
		}
		function removeExpand(item){
			if(item.children){
				item.expand = item.originExpand;
				item.originExpand = undefined;
			
				for(var i = 0; i < item.children.length; i++)		removeExpand(item.children[i]);
			}
		}

		this.showItems = function(text){
			if(not_found){		tools.destroyHTML(not_found);		not_found = undefined; }

			if(text != undefined && text != ''){

				if(!_setting.searched){
					saveExpand(_tree.tree);
					_setting.searched = true;	
				}

				setShow(_tree.tree, true);
				var found = foundItems(_tree.tree.children, text);

				for(var i = 0; i < found.length; i++){
					setShow(found[i], false);
					showParent(found[i])
				}

				if(found.length == 1){
					var item = found[0];
					while(item.children){
						
						if(item.children.length == 1){
							item = item.children[0]
						} else if(item.children.length > 1){
							item = item.children[0]
							break
						} else 
							break;
					}
					showParent(item);
				}
				
				DISPLAY.generate();

				if(found.length == 0)	not_found = tools.createHTML({tag: 'div', innerHTML: ('Items with "' + text + '" not found!'), style: 'color: #444;', parent: _canvas });

			} else {
				if(_setting.searched){
					removeExpand(_tree.tree);								setShow(_tree.tree, false);
					_setting.searched = false;	
				
					for(var i = 0; i < SELECT.get().length; i++)	showParent(SELECT.get()[i]);
					
					DISPLAY.generate();

					if(SELECT.get()[0] != undefined)				link.showItem(SELECT.get()[0]);
				}
			}
		}
		this.findItems = function(text){	return foundAllItems(_tree.tree.children, text);		}

		function foundAllItems(children, text){
			var result = [];
			for(var i = 0; i < children.length; i++){
				if( children[i].getName().toLowerCase().indexOf(text.toLowerCase()) > -1)		result.push(children[i]);
				if( children[i].children )														result = result.concat(foundItems(children[i].children, text));
			}
			return result;
		}
		function foundItems(children, text){
			var result = [];
			for(var i = 0; i < children.length; i++){
				if( children[i].text.toLowerCase().indexOf(text.toLowerCase()) > -1)			result.push(children[i]);
				else if(children[i].children)													result = result.concat(foundItems(children[i].children, text));
			}
			return result;
		}
	}

	var CURRENT = new function() {
		this.item;
		this.shiftItem;

		this.set = function(item){
			if(item != this.item){
				if(this.item){
					this.item.current = false;
					if(this.item.html)		this.item.html.className = this.item.html.className.replace(/ tu-current/g, '');
				}
				this.item = item;
				this.item.current = true;
				if(this.item.html)			this.item.html.className += ' tu-current';
			}
		}
	}

	var DRAGDROP = new function() {
		var self;

		this.start = function(e) {

			function setUndrop(items){
				for(var i = 0; i < items.length; i++){
					items[i].undrop = true;
					if(items[i].expand && items[i].children)		setUndrop(items[i].children);
				}
			}
			function getOnlyLastItems(parent){
				var result = [];
				for(var i = 0; i < parent.children.length; i++){
					var item = parent.children[i];
					if(item.select && ((item.drag !== false && _setting.defaultDrag) || item.drag))				result.push(item);
					else if(item.expand && item.children)														result = result.concat(getOnlyLastItems(item))
				}
				return result;
			}
			function getAvatar(items){
				var avatar = '';
				for(var i = 0; i < items.length; i++){
					var backClass = ( items[i].icon ) ? items[i].icon : ( (items[i].children) ? _setting.defaultFolderClose : _setting.defaultTableIcon );
					avatar += '<div class="tu-drag-item ' + backClass + '">' + items[i].text + '</div>';
				}
				return avatar;
			}

			var item = tools.closest(e.target, 'tu-item').item;
			if(!item.select){
				SELECT.removeAll();
				SELECT.add(item);
				CURRENT.set(item);
			}

			var items = getOnlyLastItems(_tree.tree);
			setUndrop(items);

			var htmlAvatar	= tools.createHTML({tag: 'div', className: 'tu-avatar',		parent: _canvas, innerHTML: getAvatar(items)});
			var htmlDrop	= tools.createHTML({tag: 'div', className: 'tu-drop-close', parent: _canvas });

			if(typeof _functions.drag == 'function')			var text = _functions.drag(e, items, link);
			else												var text = 'null';
			
			if(!window.clipboardData)							e.dataTransfer.setDragImage(htmlAvatar, -5, -5);
			e.dataTransfer.effectAllowed = 'copy';				e.dataTransfer.setData('text', text);

			window.customDrag = {
				avatar: htmlAvatar,
				items: items,
				input: link,
				drop: htmlDrop
			};

		  	tools.stopProp(e);
		}

		this.over = function(e){
			if(window.customDrag){
				if(window.customDrag.output == undefined)		DRAGDROP.enter(e);

				var item;
				var type;
				var y = e.pageY - window.customDrag.coord.top;

				for(var i = 0; i < _tree.vector.length; i++){
					if((y >= _tree.vector[i].position) && (y < (_tree.vector[i].position + _setting.height))){
						item = _tree.vector[i];
						break;
					}
				}
				if(item){
					var dropHere, dropInto;					
					var ip = _tree.vector[i].position;
					var pi = _setting.height/4;

					if(item.parent.drop == undefined && !item.parent.undrop){
						if(_setting.defaultDrop)								dropHere = true;
						else													dropHere = false;
					} else if(item.parent.drop == true && !item.parent.undrop)	dropHere = true;
					else														dropHere = false;


					if(item.drop == undefined && !item.undrop){
						if(_setting.defaultDrop)								dropInto = true;
						else													dropInto = false;
					} else if(item.drop == true && !item.undrop)				dropInto = true;
					else														dropInto = false;

					if((ip <= y && (ip + pi) > y) && dropHere)																		type = 1;
					else if( ((((ip + pi*3) <= y && (ip + pi*4) > y) && !item.expand) || !item.children ) && dropHere  )			type = 3;
					else if((((ip + pi) <= y && (ip + pi*3) > y) || item.expand ) && dropInto )										type = 2;
					else 																											type = -1;


				} else {
					if(_tree.tree.drop)							type = 0;
					else										type = -1;
				}

				if(type != window.customDrag.type || item != window.customDrag.item ){
					window.customDrag.drop.style.cssText = '';
					if(window.customDrag.into) {
						window.customDrag.into.html.id = '';
						window.customDrag.into = undefined;
					}

					if(type == 0) {					window.customDrag.drop.style.cssText = 'left: ' + ( _setting.width ) + 'px; bottom: 18px; display: block'; 
					} else if(type == 1) {			window.customDrag.drop.style.cssText = 'left: ' + ((item.level + 1)*_setting.width - 4) + 'px; top: ' + (item.position - 1) + 'px; display: block'; 						
					} else if(type == 2) {			window.customDrag.into = item;		window.customDrag.into.html.id = 'tu-item-into';
					} else if(type == 3) {			window.customDrag.drop.style.cssText = 'left: ' + ((item.level + 1)*_setting.width - 4) + 'px; top: ' + (item.position + _setting.height - 1) + 'px; display: block'; 
					}
					window.customDrag.item = item;			window.customDrag.type = type;
				}
				if(window.customDrag.type == -1)			return true;
				else										return false;
			}
			return true;
		}

		this.enter = function(e){
			if(window.customDrag){
				if(window.customDrag.output == undefined){
					window.customDrag.coord = _canvas.getBoundingClientRect();
					window.customDrag.type = -1;
					window.customDrag.output = link;
					_canvas.appendChild(window.customDrag.drop);
					_viewport.focus();
				}
			}
		}

		this.leave = function(e){
			var output = tools.closest(document.elementFromPoint(e.pageX, e.pageY), 'tu-viewport');

			if(window.customDrag){
				if(output != _viewport){
					window.customDrag.output = undefined;
					window.customDrag.drop.style.display = 'none';
				}
			}
		}

		this.drop = function(e){

			if(e.preventDefault)	e.preventDefault();		tools.stopProp(e);

			if(window.customDrag){
				var input = window.customDrag.input;
				var output = window.customDrag.output;
				var parent;	
				var index;
				var items = window.customDrag.items;

				if(window.customDrag.type == 1 || window.customDrag.type == 3){
					parent = window.customDrag.item.parent;

					for(var i = 0; i < parent.children.length; i++){
						if(parent.children[i] == window.customDrag.item)			index = i;
					} 
					if(window.customDrag.type == 3)		index++;
				} else if(window.customDrag.type == 2) {
					parent = window.customDrag.item;
					index = parent.children.length;
				} else if(window.customDrag.type == 0) {
					parent = window.customDrag.output.getRoot();
					index = parent.children.length;
				}
				if(typeof _functions.drop == 'function' && window.customDrag != 1)	_functions.drop(e, input, output, items, parent, index);
			}
			DRAGDROP.end(e);
		}
	
		this.end = function(e){
			function unsetUndrop(items){
				for(var i = 0; i < items.length; i++){
					items[i].undrop = undefined;
					if(items[i].expand && items[i].children)	unsetUndrop(items[i].children);
				}	
			}

			if(window.customDrag){
		  		if(window.customDrag.avatar.parentNode)			tools.destroyHTML(window.customDrag.avatar);
		  		if(window.customDrag.drop.parentNode)			tools.destroyHTML(window.customDrag.drop);
		  		unsetUndrop(window.customDrag.items);

		  		if(window.customDrag.into)				window.customDrag.into.html.id = '';
		  		window.customDrag = undefined;
			}
		}
	}

	if(options)								link.create(options);
}
