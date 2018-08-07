function tree_ui(options){

	var parent; //outer container
	var tree;	//topmost level of tree
	var vector; //list of items with expand
	var timer;

	var substrate; //background container
	var viewport; //viewport container

	var setting;
	var functions;

	var link = this;
	var fragment = document.createDocumentFragment();

	link.create = function(options){
		if(tree)				link.remove();

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

		changing.viewport();

		setting = {};	functions = {};
		tree = {children: []};			vector = [];

		link.change(options);
	}
	link.remove = function(){
		tools.destroyHTML(viewport);
		parent = undefined;			tree = undefined;
		vector = undefined;			setting = undefined;
		functions = undefined;		window.removeEventListener("resize", display.display);

		viewport = undefined;		substrate = undefined;
	}
	link.change = function(options){
		if(!options)									options = {};

		if(options.parent != undefined)					changing.parent(options);
		if(options.functions != undefined)				changing.functions(options);
		if(options.show != undefined)					changing.show(options);
		if(options.defaultExpand != undefined)			changing.defaultExpand(options);

		if(options.height != undefined)					setting.height = options.height;
		if(options.width != undefined)					setting.width = options.width;
		if(options.defaultFolderOpen != undefined)		setting.defaultFolderOpen = options.defaultFolderOpen;
		if(options.defaultFolderClose != undefined)		setting.defaultFolderClose = options.defaultFolderClose;
		if(options.defaultTableIcon != undefined)		setting.defaultTableIcon = options.defaultTableIcon;

		if(options.defaultDrop != undefined)			setting.defaultDrop = options.defaultDrop;
		if(options.defaultDrag != undefined)			setting.defaultDrag = options.defaultDrag;
		if(options.rootDrop != undefined)				tree.drop = options.rootDrop;

		if(options.items != undefined)					link.addItems(options.items);

		display.generate();
	}
	link.getTree = function()				{	return tree;	}
	link.getSelected = function()			{	return select.getSorted(tree);	}
	link.getItems = function()				{	return tree.children;	}
	link.getFoundItems = function(text) 	{	return search.findItems(text);	}
	link.showFoundItems = function(text)	{	search.showItems(text);	}
	link.clearSelect = function()			{	select.removeAll(); }
	link.showItem = function(item, place, showed)	{
		if( !(item instanceof cItem) )	return;

		var parent = item.parent;
		while(parent != tree){
			parent.changeExpand(true);
			parent = parent.parent;
		}
		var newTop = item.position - 10;

		if(place == 1)					newTop += - Math.round(viewport.clientHeight/2) + 10;
		else if(place == 2)				newTop += - viewport.clientHeight + 40;

		if(showed && item.html)			newTop = viewport.scrollTop;

		viewport.scrollTop = newTop;	}
	link.addItems = function(objects, parent, position){
		if(!Array.isArray(objects))															objects = [objects];
		if(parent == undefined)																parent = tree;
		if(parent.children == undefined)													parent.children = [];
		if(parent.expand == undefined)														parent.expand = setting.defaultExpand;
		if(position == undefined || position < 0 || position > parent.children.length)		position = parent.children.length;

		var result = [];

		for(var i = 0; i < objects.length; i++){
			var item = new cItem(objects[i], parent);
			parent.children.splice( (i + position), 0, item);
			result.push(item);
		}
		display.generate();

		return result;	}
	link.moveItems = function(orders){
		if(!Array.isArray(orders))		orders = [orders];

		for(var i = 0, index; i < orders.length; i++){
			var ord = orders[i];

			if(!ord.item)															continue;
			if(!ord.parent)															ord.parent = tree;
			if(ord.index == undefined || ord.parent.children.length < ord.index)	ord.index = ord.parent.children.length;	

			var parent = ord.item.parent;
			for(var i = 0; i < parent.children.length; i++){
				if(parent.children[i] == ord.item)									index = i;
			}
			parent.children.splice(index, 1);
			ord.parent.children.splice(ord.index, 0, ord.item);
			ord.item.parent = ord.parent;
		}

		display.generate();		}
	link.removeItems = function(items){
		if(items == undefined)										items = tree.children;
		if(!Array.isArray(items))									items = [items];
		items = items.concat();

		for(var i = items.length - 1, index; i >= 0; i--){
			select.remove(items[i]);			
			for(var j = 0; j < items[i].parent.children.length; j++){
				if(items[i].parent.children[j] == items[i])			index = j;
			}
			items[i].parent.children.splice(index, 1);
			if(items[i] == current.item)							current.item = undefined;
		}

		display.generate();	}

	link.focus = function()					{	viewport.focus(); }
	link.getScroll = function()				{	return viewport.scrollTop; }
	link.setScroll = function(size)			{	viewport.scrollTop = size; }

	function cItem(item, parent){ //class Item
		var iitem			= this; //inner Item

		iitem.parent = parent;				iitem.select = false;
		var text;

		iitem.drop;
		iitem.drag;
		iitem.icon;
		iitem.iconOpen;

		iitem.obj = item;
		this.show = true;

		if(item.children != undefined){
			iitem.children = [];
			for(var i = 0; i < item.children.length; i++)
				iitem.children[i] = new cItem(item.children[i], iitem);

			iitem.expand = ((item.expand) ? (item.expand) : (setting.defaultExpand));
			item.expand = undefined;
		}

		iitem.change = function(options){

			if(options.data != undefined)					iitem.data = options.data;
			if(options.text != undefined)					text = options.text;
			if(options.icon != undefined)					iitem.icon = options.icon;
			if(options.iconOpen != undefined)				iitem.iconOpen = options.iconOpen;
			if(options.expand != undefined)					iitem.changeExpand(options.expand);

			if(options.drag != undefined)					iitem.drag = (options.drag) ? true : false;
			if(options.drop != undefined)					iitem.drop = (options.drop) ? true : false;

			if(options.current)								current.set(iitem);

			if(options.select == true)						select.add(iitem);
			else if(options.select == false)				select.remove(iitem);

			if(iitem.html != undefined && this.show)		display.showItem(iitem, true);
		}

		iitem.changeExpand = function(boolean){
			if(iitem.children){
				if(boolean != iitem.expand){
					iitem.expand = boolean;
					display.generate();

					if(current.item){
						if(!current.item.index)				current.set(iitem);
					}
				}
			}
		}

		iitem.getName = function(){return text;}

		iitem.change(item);
	}

	var events = {
		keyDown: function(e){
			var kc = e.keyCode;
			var result = true; //flag of make default algorithm


			if(vector.length == 0)	return;
			if(!current.item){
				if(vector.length != 0){
					if(display.items.length != 0)			current.set(display.items[0]);
					else									current.set(vector[0]);
				} else return;
			}

			if( (e.ctrlKey && (kc == 90 || kc == 88 || kc == 67 || kc == 86 || kc == 83 || kc == 70 || (kc >= 37 && kc <= 40))) || kc == 46 || kc == 13 ){
				if(typeof functions.keyDown == 'function')	result = functions.keyDown(e, current.item, link);
			}

			if(result){
				var top = viewport.scrollTop;
				var bot = viewport.scrollTop + viewport.clientHeight;
	
				if(kc == 38 || kc == 40){
					var new_index = (kc == 38) ? (current.item.index - 1) : (current.item.index + 1);
					
					if(new_index < 0 || isNaN(new_index))		new_index = 0;
					if(new_index >= vector.length)				new_index = vector.length - 1;
	
					if(e.shiftKey){
						if(!current.shiftItem)					current.shiftItem = current.item;
						current.set(vector[new_index]);			select.removeAll();
						
						var first = (current.item.index > current.shiftItem.index) ? current.shiftItem.index : current.item.index;
						var last  = (current.item.index < current.shiftItem.index) ? current.shiftItem.index : current.item.index;
						for(var i = first; i <= last; i++)		select.add(vector[i]);
	
					} else if(!e.ctrlKey) {
						current.set(vector[new_index]);
						select.removeAll();
						select.add(current.item);
					}
					
					if(select.items.length == 1 && !e.ctrlKey)							events.singleClick(e, select.items[0]);
					if(select.items.length > 1 && !e.ctrlKey)							events.customSelect(e);
					if(current.item.position < top)										viewport.scrollTop = current.item.position - 10;
					if( (current.item.position + setting.height + 1) > bot)		viewport.scrollTop = current.item.position + setting.height - viewport.clientHeight + 10;
				}
	
				if( (kc == 37 || kc == 39) && !e.ctrlKey ){
					if(kc == 37){
						if(current.item.expand)					current.item.changeExpand(false);
						else if(current.item.parent != tree){
							current.set(current.item.parent);
							select.removeAll();					select.add(current.item);
							if(current.item.position < top)		viewport.scrollTop = current.item.position - 10;
						}
					} else if(current.item.expand === false)	current.item.changeExpand(true);
				}
	
				if(kc == 13 && typeof functions.doubleClick == 'function')				functions.doubleClick(current.item);
				if(e.ctrlKey && kc == 65)						select.addAll();
	
				if(kc == 36)									viewport.scrollTop = 0;
				if(kc == 35)									viewport.scrollTop = substrate.clientHeight;
				if(kc == 33)									viewport.scrollTop += -viewport.clientHeight*0.7;
				if(kc == 34)									viewport.scrollTop += viewport.clientHeight*0.7;
			}

			if(kc == 13 || kc == 38 || kc == 39 || kc == 40 || kc == 37 || kc == 65 || kc == 33 || kc == 34 || kc == 35 || kc == 36 || kc == 67 || kc == 83 || kc == 90 || kc == 88  || kc == 86 || kc == 70 || kc == 46){
				tools.stopProp(e);							return false;
			}
		},
		keyUp: function(e){
			var kc = e.keyCode;

			if(kc == 16 && current.shiftItem){
				current.shiftItem = undefined;
			}
		},
		blur: function(e){
			if(current.shiftItem){
				current.shiftItem = undefined;
			}
		},
		rightClick: function(e){
			if(typeof functions.rightClick == 'function'){
				var item = tools.closest(e.target, 'tu-item');
				if(item){
					item = item.item
					if(!item.select){
						select.removeAll();
						select.add(item);
					}
				}
				functions.rightClick(e, item, select.items);
				return false;
			}
		},
		doubleClick: function(e){
			if(e.shiftKey || e.ctrlKey || e.which != 1) return;

			if(timer){
				clearTimeout(timer);								timer = undefined;
			}

			var item = tools.closest(e.target, 'tu-item');	
			if(typeof functions.doubleClick == 'function' && item)	functions.doubleClick(item.item, e);
			viewport.focus();
		},
		singleClick: function(e, item){
			if(timer){
				clearTimeout(timer);								timer = undefined;
			}
			if(typeof functions.singleClick == 'function'){
				timer = setTimeout(function() {
					timer = null;
					functions.singleClick(item, e);
				}, 500); 
			}
			viewport.focus();
		},
		customSelect: function(e){
			var array = select.getSorted(tree);
			if(typeof functions.customSelect == 'function')			functions.customSelect(e, array);
		},
		expandDown: function(e){

			function getHeight(item){
				var cHeight = setting.height;
				if(item.children && item.expand){
					for(var i = 0; i < item.children.length; i++)				cHeight += getHeight(item.children[i]);
				}
				return cHeight;
			}

			if(e.which != 1) return; 
			var item = tools.closest(e.target, 'tu-item').item;
			if(e.ctrlKey){
				var status = !item.expand;
				item.parent.children.forEach(function(i) {	if(i.children)	i.changeExpand(status);	} );
			} else {
				item.changeExpand(!item.expand);
				if(item.expand){
					var itemsHeight = getHeight(item);
					var itemPosition = item.position;

					if(viewport.scrollTop + viewport.offsetHeight < itemsHeight + itemPosition){
						if(viewport.offsetHeight < itemsHeight)		viewport.scrollTop = itemPosition;
						else										viewport.scrollTop = itemPosition + itemsHeight - viewport.offsetHeight + Math.round(setting.height*0.5);
					}
				}
			} 				

			viewport.focus();
			return false;
		}
	}

	var changing = {
		parent: function(options){
			parent = options.parent;
			changing.show({show: setting.show});
		},
		show: function(options){
			setting.show = options.show;

			if(setting.show)								parent.appendChild(viewport);
			else											fragment.appendChild(viewport);
		},
		defaultExpand: function(options){
			if(options.defaultExpand)						setting.defaultExpand = true;
			else											setting.defaultExpand = false;
		},
		functions: function(options){
			if(options.functions.singleClick != undefined)	functions.singleClick = options.functions.singleClick;
			if(options.functions.doubleClick != undefined)	functions.doubleClick = options.functions.doubleClick;
			if(options.functions.rightClick != undefined)	functions.rightClick = options.functions.rightClick;
			if(options.functions.customSelect != undefined)	functions.customSelect = options.functions.customSelect;
			if(options.functions.keyDown != undefined)		functions.keyDown = options.functions.keyDown;
			if(options.functions.drag != undefined)			functions.drag = options.functions.drag;
			if(options.functions.drop != undefined)			functions.drop = options.functions.drop;
		},
		viewport: function(){
			viewport = tools.createHTML({tag: 'div', className: 'tu-viewport',	onscroll: display.display, tabIndex: 0, 
											onmousedown: select.sMouseDown,
											ondblclick: events.doubleClick,
											onkeydown: events.keyDown,
											onblur: events.blur,
											onkeyup: events.keyUp,
											oncontextmenu: events.rightClick,
											onclick: select.sOnClick	});

			viewport.ondragover = dragdrop.over;				viewport.ondragleave = dragdrop.leave;
			viewport.ondragenter = dragdrop.enter;				viewport.ondrop  = dragdrop.drop;
			viewport.ondragend = dragdrop.end;					window.addEventListener("resize", display.display);

			substrate = tools.createHTML({tag: 'div', className: 'tu-content', parent: viewport});
		}
	}

	var display = new function() {

		this.items; //showed items
		
		this.generate = function(){

			function createVector(items, level, index){
				for(var i = 0; i < items.length; i++){
					if(items[i].show){
						items[i].position = setting.height * index;
						items[i].index = index;
						items[i].level = level;
						items[i].html = undefined;
	
						vector.push(items[i]);
						index++;
	
						if(items[i].expand)					index = createVector(items[i].children, level + 1, index);
					}
				}
				return index;
			}
			for(var i = 0; i < vector.length; i++)			vector[i].index = undefined;

			vector = [];									display.items = [];
			substrate.style.height = (createVector(tree.children, 0, 0) + 1) * setting.height + 'px';
			substrate.style.lineHeight = setting.height + 'px';
			substrate.innerHTML = '';					display.display();
		}

		this.display = function(){
			var nItems = []; //new showed items

			if(window.customDrag != undefined)				window.customDrag.coord = substrate.getBoundingClientRect();
			
			if(viewport.offsetHeight == 0)				return;
			var top = viewport.scrollTop;
			var bot = viewport.offsetHeight + top;
			if(top == bot)									return;


			for(var i = 0; i < vector.length; i++){
				if(vector[i].position <= bot && (vector[i].position + setting.height) >= top )					nItems.push(vector[i]);
			}
			for(var i = 0; i < nItems.length; i++){
				if(nItems[i].html == undefined)																		display.showItem(nItems[i]);
			}
			for(var i = 0; i < display.items.length; i++){
				if(!(display.items[i].position <= bot && (display.items[i].position + setting.height) >= top) )	display.hideItem(display.items[i]);				
			}

			display.items = nItems;
		}

		this.showItem = function(item){
			if(item.html != undefined) 			display.hideItem(item);

			item.html = tools.createHTML({tag: 'div', className: 'tu-item', parent: substrate, style: ('height: ' + (setting.height + 1) + 'px; top: ' + item.position + 'px;') });
			item.html.item = item; 

			item.html.expand = tools.createHTML({tag: 'div', className: 'tu-expand', parent: item.html});
			item.html.caption = tools.createHTML({tag: 'span', className: 'tu-caption ', parent: item.html, onmouseover: display.captionOver, onmouseout: display.captionOut, innerHTML: item.getName(), style: ('padding-left:' + setting.width + 'px') });

			if(item.select){
				item.html.className += ' tu-select';
				if((item.drag !== false && setting.defaultDrag) || item.drag)	{item.html.draggable = true;	item.html.ondragstart = dragdrop.start;}
			}
			if((item.drag !== false && setting.defaultDrag) || item.drag){		item.html.caption.draggable = true;	item.html.caption.ondragstart = dragdrop.start; }
			if(item.current)  item.html.className += ' tu-current';


			item.html.expand.style.marginLeft = item.level*setting.width + 'px';
			if(item.children){
				if(item.children.length != 0){
					item.html.expand.onmousedown = events.expandDown;
					 
					if(item.expand){
						item.html.expand.className += ' tu-expand-open';
						item.html.caption.className += ((item.iconOpen) ? item.iconOpen : ( (item.icon) ? item.icon : setting.defaultFolderOpen ) );
					} else {
						item.html.expand.className += ' tu-expand-close';
						item.html.caption.className += (item.icon) ? item.icon : setting.defaultFolderClose;
					}
				} else {
					item.html.caption.className += (item.icon) ? item.icon : setting.defaultFolderClose;
				}
			} else {
				item.html.caption.className		+= (item.icon) ? item.icon : setting.defaultTableIcon;
			}
		}

		this.hideItem = function(item){
			tools.destroyHTML(item.html);
			item.html = undefined;
		}

		this.captionOver = function(e){
			var item = tools.closest( e.target, 'tu-item');
			if(item.clientWidth < ( e.target.clientWidth + setting.width*(item.item.level + 1)))	e.target.title = item.caption.innerText;
		}
		this.captionOut = function(e){
			e.target.title = '';
		}
	}

	var select = new function() {
		var self;
		this.items = [];

		this.add = function(item){
			if(item.select != true){
				item.select = true;
				this.items.push(item);
				if(item.html != undefined){
					item.html.className += ' tu-select';
					if((item.drag !== false && setting.defaultDrag) || item.drag)	{item.html.draggable = true;	item.html.ondragstart = dragdrop.start;}
				}
			}
		}
		this.remove = function(item){
			if(item.select == true){
				item.select = false;
				for(var i = 0; i < this.items.length; i++){
					if(this.items[i] == item)		this.items.splice(i,1);
				}
				if(item.html != undefined){			
					item.html.className = item.html.className.replace(/ tu-select/g, '') 
					item.html.draggable = false;
				}
			}
		}
		this.removeAll = function(){
			for(var i = 0; i < this.items.length; i++){
				var item = this.items[i];			item.select = false;
				if(item.html != undefined){			
					item.html.className = item.html.className.replace(/ tu-select/g, '') 
					item.html.draggable = false;
				}
			}
			this.items = [];
		}
		this.addAll = function(){
			this.removeAll();
			for(var i = 0; i < vector.length; i++)	this.add(vector[i]);
		}

		this.sOnClick = function(e){

			if(e.which != 1)						return; 

			var item = tools.closest(e.target, 'tu-item');
			var items = [];

			if(!e.ctrlKey) 							select.removeAll();

			if(item){
				item = item.item;

				if(e.shiftKey && current.item){
					var first = (current.item.index > item.index)? item.index : current.item.index;
					var last = (current.item.index < item.index)? item.index : current.item.index; 

					for(first; first <= last; first++)	items.push(vector[first]);

				} else {
					current.set(item);
					items = [item];
				}
	
				for(var i = 0; i < items.length; i++){
					if( items[i].select )				select.remove(items[i]);
					else								select.add(items[i]);
				}
			}
			if(!e.shiftKey && !e.ctrlKey)				events.singleClick(e, e, item);
			if(select.items.length > 1)					events.customSelect(e);
			viewport.focus();
		}

		this.sMouseDown = function(e){
			var dragging = tools.closest(e.target, 'tu-select') || tools.closest(e.target, 'tu-caption');
			var coords = viewport.getBoundingClientRect();

			if(e.which != 1 || dragging)																			return;
			if(e.pageX - coords.left >= viewport.clientWidth && e.pageX - coords.left <= viewport.offsetWidth)		return;

			self = {event: e, padding: substrate.getBoundingClientRect() };

			window.addEventListener("mousemove", sMouseMove);
			window.addEventListener("mouseup", sMouseUp);
		}
		function sMouseMove(e){
			if((Math.abs(e.pageX - self.event.pageX) > 3 || Math.abs(e.pageY - self.event.pageY) > 3) && !self.moved){
				self.rectangle = tools.createHTML({tag: 'div', className: 'tu-rectangle', parent: substrate});
				tools.startBackdrop({cursor: 'default'});
				self.moved = true;
			}
			if(self.moved){
				var fX = (e.pageX - self.padding.left);
				var lX = (self.event.pageX - self.padding.left);
				var fY = (e.pageY - self.padding.top);
				var lY = (self.event.pageY - self.padding.top);

				var max; var min;
				max = (fX > lX)? fX : lX;				min = (fX > lX)? lX : fX;
				fX = min; lX = max;
				max = (fY > lY)? fY : lY;				min = (fY > lY)? lY : fY;
				fY = min; lY = max;

				self.rectangle.style.cssText = 'left: ' + fX + 'px; width: ' + (lX - fX) + 'px; top: ' + fY + 'px; height: ' + (lY - fY) + 'px;';
			}
			viewport.focus();
		}
		function sMouseUp(e){
			if(self.moved){
				tools.endBackdrop();
				tools.destroyHTML(self.rectangle);

				if(!e.ctrlKey)			select.removeAll();
				var newSelect = [];

				var fY = (e.pageY - self.padding.top);		var lY = (self.event.pageY - self.padding.top);
				var y1 = (fY > lY)? fY : lY;				var y2 = (fY < lY)? fY : lY;

				for(var i = 0; i < display.items.length; i++){
					var y3 = display.items[i].position;
					var y4 = y3 + setting.height;

					if( (( y3 <= y1 && y2 <= y4 ) || ( y3 >= y1 && y2 >= y4 ) || ( y1 <= y4 && y1 >= y3 ) || ( y2 <= y4 && y2 >= y3 )) )
						newSelect.push(display.items[i]);					
				}
				for(var i = 0; i < newSelect.length; i++){
					if(newSelect[i].select && e.ctrlKey)										select.remove(newSelect[i]);
					else																		select.add(newSelect[i]);
				}

				var item = tools.closest(self.event.target, 'tu-item');
				if(item)		current.set(item.item); 
			}

			self = undefined;
			if(select.items.length > 1)					events.customSelect(e);
			viewport.focus();
			window.removeEventListener("mousemove", sMouseMove);
			window.removeEventListener("mouseup", sMouseUp);
		}

		this.getSorted = function(item){
			var result = [];
			if(item.select)										result.push(item);
			if(item.children){
				for(var i = 0; i < item.children.length; i++)	result = result.concat(select.getSorted(item.children[i]));
			}
			return result;
		}
	}

	var search = new function() {

		function setShow(item, show){
			item.show = show;
			if(item.children){
				for(var i = 0; i < item.children.length; i++)		setShow(item.children[i], show);
				if(!show) item.expand = false;
			}
		}
		function showParent(item){
			var parent = item.parent;
			while(parent != tree){
				parent.show = true;
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
			if(setting.nf){		tools.destroyHTML(setting.nf);		setting.nf = undefined; }

			if(text != undefined && text != ''){

				if(!setting.searched){
					saveExpand(tree);
					setting.searched = true;	
				}

				setShow(tree, false);
				var found = foundItems(tree.children, text);

				for(var i = 0; i < found.length; i++){
					setShow(found[i], true);
					showParent(found[i])
				}				
				display.generate();

				if(found.length == 0)	setting.nf = tools.createHTML({tag: 'div', innerHTML: ('Items with "' + text + '" not found!'), style: 'color: #444;',parent: substrate });

			} else {
				if(setting.searched){
					removeExpand(tree);								setShow(tree, true);
					setting.searched = false;	
				
					for(var i = 0; i < select.items.length; i++)	showParent(select.items[i]);
					
					display.generate();

					if(select.items[0] != undefined)				link.showItem(select.items[0]);
				}
			}
		}
		this.findItems = function(text){	return foundAllItems(tree.children, text);		}

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
				if( children[i].getName().toLowerCase().indexOf(text.toLowerCase()) > -1)		result.push(children[i]);
				else if(children[i].children)													result = result.concat(foundItems(children[i].children, text));
			}
			return result;
		}
	}

	var current = new function() {
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

	var dragdrop = new function() {
		var self;

		this.start = function(e) {

			function setUndrop(items){
				for(var i = 0; i < items.length; i++){
					items[i].undrop = true;
					if(items[i].expand)				setUndrop(items[i].children);
				}
			}
			function getOnlyLastItems(parent){
				var result = [];
				for(var i = 0; i < parent.children.length; i++){
					var item = parent.children[i];
					if(item.select && ((item.drag !== false && setting.defaultDrag) || item.drag))				result.push(item);
					else if(item.expand)																			result = result.concat(getOnlyLastItems(item))
				}
				return result;
			}
			function getAvatar(items){
				var avatar = '';
				for(var i = 0; i < items.length; i++){
					var backClass = ( items[i].icon ) ? items[i].icon : ( (items[i].children)? setting.defaultFolderClose : setting.defaultTableIcon );
					avatar += '<div class="tu-drag-item ' + backClass + '">' + items[i].getName() + '</div>';
				}
				return avatar;
			}

			var item = tools.closest(e.target, 'tu-item').item;
			if(!item.select){
				select.removeAll();
				select.add(item);								current.set(item);
			}

			var items = getOnlyLastItems(tree);					setUndrop(items);
			var htmlAvatar = tools.createHTML({tag: 'div', className: 'tu-avatar', parent: substrate, innerHTML: getAvatar(items)});
			var htmlDrop = tools.createHTML({tag: 'div', className: 'tu-drop-close', parent: substrate});

			if(typeof functions.drag == 'function')				var text = functions.drag(e, items, link);
			else												var text = 'null';
			
			if(e.dataTransfer.setDragImage != undefined)		e.dataTransfer.setDragImage(htmlAvatar, -5, -5);
		  	e.dataTransfer.effectAllowed = 'copy';				e.dataTransfer.setData('text', text);

		  	window.customDrag = {avatar: htmlAvatar, items: items, input: link, drop: htmlDrop};

		  	tools.stopProp(e);
		}

		this.over = function(e){
			if(window.customDrag){
				if(window.customDrag.output == undefined)		dragdrop.enter(e);

				var item;										var type;
				var y = e.pageY - window.customDrag.coord.top;

				for(var i = 0; i < vector.length; i++){
					if((y >= vector[i].position) && (y < (vector[i].position + setting.height))){
						item = vector[i];
						break;
					}
				}
				if(item){
					var dropHere, dropInto;					
					var ip = vector[i].position;				var pi = setting.height/4;

					if(item.parent.drop == undefined && !item.parent.undrop){
						if(setting.defaultDrop)							dropHere = true;
						else													dropHere = false;
					} else if(item.parent.drop == true && !item.parent.undrop)	dropHere = true;
					else														dropHere = false;


					if(item.drop == undefined && !item.undrop){
						if(setting.defaultDrop)							dropInto = true;
						else													dropInto = false;
					} else if(item.drop == true && !item.undrop)				dropInto = true;
					else														dropInto = false;

					if((ip <= y && (ip + pi) > y) && dropHere)	type = 1;
					else if( ((((ip + pi*3) <= y && (ip + pi*4) > y) && !item.expand) || !item.children ) && dropHere  )					type = 3;
					else if((((ip + pi) <= y && (ip + pi*3) > y) || item.expand ) && dropInto )												type = 2;
					else 										type = -1;

				} else {
					if(tree.drop)								type = 0;
					else										type = -1;
				}

				if(type != window.customDrag.type || item != window.customDrag.item ){
					if(window.customDrag.into) {			window.customDrag.into.html.id = '';		window.customDrag.into = undefined; }
					window.customDrag.drop.style.cssText = '';

					if(type == 0) {
						window.customDrag.drop.style.cssText = 'left: ' + ( setting.width ) + 'px; bottom: 18px; display: block'; 
					} else if(type == 1) {
						window.customDrag.drop.style.cssText = 'left: ' + ((item.level + 1)*setting.width - 4) + 'px; top: ' + (item.position - 1) + 'px; display: block'; 						
					} else if(type == 2) {
						window.customDrag.into = item;		window.customDrag.into.html.id = 'tu-item-into';
					} else if(type == 3) {
						window.customDrag.drop.style.cssText = 'left: ' + ((item.level + 1)*setting.width - 4) + 'px; top: ' + (item.position + setting.height - 1) + 'px; display: block'; 
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
					window.customDrag.coord = substrate.getBoundingClientRect();
					window.customDrag.type = -1;
					window.customDrag.output = link;
					substrate.appendChild(window.customDrag.drop);
					viewport.focus();
				}
			}
		}

		this.leave = function(e){
			var output = tools.closest(document.elementFromPoint(e.pageX, e.pageY), 'tu-viewport');

			if(window.customDrag){
				if(output != viewport){
					window.customDrag.output = undefined;
					window.customDrag.drop.style.display = 'none';
				}
			}
		}

		this.drop = function(e){

			if(e.preventDefault)	e.preventDefault();		tools.stopProp(e);

			if(window.customDrag){
				var input = window.customDrag.input;		var output = window.customDrag.output;
				var parent;			var index;				var items = window.customDrag.items;

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
					parent = window.customDrag.output.getTree();
					index = parent.children.length;
				}
				if(typeof functions.drop == 'function' && window.customDrag != 1)	functions.drop(e, input, output, items, parent, index);
			}
			dragdrop.end(e);
		}
	
		this.end = function(e){
			function unsetUndrop(items){
				for(var i = 0; i < items.length; i++){
					items[i].undrop = undefined;
					if(items[i].expand)					unsetUndrop(items[i].children);
				}	
			}

			if(window.customDrag){
		  		if(window.customDrag.avatar.parentNode)		tools.destroyHTML(window.customDrag.avatar);
		  		if(window.customDrag.drop.parentNode)		tools.destroyHTML(window.customDrag.drop);
		  		unsetUndrop(window.customDrag.items);

		  		if(window.customDrag.into)				window.customDrag.into.html.id = '';
		  		window.customDrag = undefined;
			}
		}
	}

	if(options)								link.create(options);
}
