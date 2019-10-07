//
// created by Makarov Aleksand 
//
// required parametrs - parent - must contain at least 1 html object
// branch with argument "separator = true" make node like unselectable line
// branch with argument "unselect = true" make node without able select
// 

function combobox_ui(options){
	var _list;

	var _functions;
	var _setting;
	var _fragment = document.createDocumentFragment();

	var banner;
	var panel;
	var caption;

	var link = this;

	var svgArrow = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="7px" height="4px" viewBox="0 0 7 4"><style>	.ar {fill: #000000;}</style><path class="ar" d="M 0,0 L 7,0 L 3.5,4"/></svg>';

	link.create = function(options){
		if(!options)						options = {};
		if(options.tree == undefined)		options.tree = [];
		if(options.minWidth == undefined)	options.minWidth = 150;
		if(options.minHeight == undefined)	options.minHeight = 450;
	
		banner = tools.createHTML({tag: 'div', className: 'cbb-main', onmousedown: EVENTS.down.banner, tabIndex: -1, onkeydown: EVENTS.key }); 
		panel = tools.createHTML({ tag: 'div', className: 'cbb-panel', parent: _fragment, onmousedown: EVENTS.down.panel});
		button = tools.createHTML({tag: 'div', className: 'cbb-arrow', parent: banner, innerHTML: svgArrow });
		caption = tools.createHTML({tag: 'div', className: 'cbb-caption', parent: banner});
	
		_list = [];
		_setting = {};
		_functions = {};

		link.change(options);
	}

	link.change = function(options){
		if(options.parent != undefined)		options.parent.appendChild(banner);
		if(options.functions)				SET.functions(options);

		if(options.maxHeight)				_setting.maxHeight = options.maxHeight;
		if(options.minWidth)				_setting.minWidth = options.minWidth;

		if(options.tree != undefined)		link.addItems(options.tree);
	}

	link.remove = function(){
		_list = undefined;			_functions = undefined;			_setting = undefined;
		panel = undefined;			banner = undefined;				caption = undefined;		
	}

	link.clearSelect = function(){ SELECT.setDefault();	}
	link.addItems = function(items, index){
		if(index < 0 || index > _list.length)		index = _list.length;
		if( !Array.isArray( items ) )				items = [items];

		for(var i = 0; i < items.length; i++){
			SET.add(items[i]);
		}
		SET.list();
		SELECT.setDefault();
	}
	link.removeItems = function(items){
		if(!items){
			items = _list.concat();
			SELECT.clear();
		}
		if(!Array.isArray(items))		items = [items];
		for(var i = items.length - 1; i >= 0; i--){
			if(typeof items[i] == 'number'){
				SET.remove(_list[items[i]])
			} else {
				SET.remove(items[i])
			}
		}
	}
	link.getItems = function(){	return _list.concat();	}
	link.getSelected = function(){ if(SELECT.item)	return SELECT.item; }
	link.setSelected = function(item){
		for(var i = 0; i < _list.length; i++){
			if(_list[i] == item){
				SELECT.swichSelect(_list[i]);
			}
		}
	}

	var EVENTS = {
		down: {
			item: function(e){
				var item = tools.closest(e.target, 'cbb-item');
				SELECT.swichSelect(item.node);
				EVENTS.down.document(e);
				banner.focus();
			},
			banner: function(e){
				if(panel.parentNode == _fragment){
					SET.list();
					SET.panel(banner.getBoundingClientRect(), true, false);
				} else EVENTS.down.document(e);
	
				banner.focus();
				tools.stopProp(e);
				window.addEventListener("mousedown", EVENTS.down.document);
				window.addEventListener("resize", EVENTS.down.document);
			},
			panel: function(e){
				tools.stopProp(e);
				banner.focus();
				return false;
			},
			document: function(e){
				window.removeEventListener("mousedown", EVENTS.down.document);
				window.removeEventListener("resize", EVENTS.down.document);
				_fragment.appendChild(panel);
			}
		},
		key: function(e){
			if(e.keyCode == 38 || e.keyCode == 37){
				for(var i = SELECT.item.index - 1; i >= 0; i--){
					if(_list[i].select){
						SELECT.swichSelect(_list[i]);
						break;
					}
				}
			}
			if(e.keyCode == 39 || e.keyCode == 40){
				for(var i = SELECT.item.index + 1; i < _list.length; i++){
					if(_list[i].select){
						SELECT.swichSelect(_list[i]);
						break;
					}
				}
			}
			if(e.keyCode == 13){
				if(panel.parentNode == _fragment)		EVENTS.down.banner(e);	
				else									EVENTS.down.document(e);
			}
			if(e.keyCode == 27){
				EVENTS.down.document(e);
			}
			
			if(e.keyCode == 38 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 27){
				tools.stopProp(e);
				return false;
			}
		}
	}
	var SET = {
		panel: function( coords, xr, yr){
			document.body.appendChild(panel);
			var y = 0, height = document.body.offsetHeight;
			panel.style.height = "";

			if(coords.right - coords.left > _setting.minWidth)	panel.style.width = (coords.right - coords.left) + 'px';
			else												panel.style.width = _setting.minWidth + 'px';


			if(coords.bottom + panel.offsetHeight < height )	y = coords.bottom;
			else if(coords.bottom - panel.offsetHeight > 0)		y = coords.top - panel.offsetHeight;
			else {
				if(height/2 > coords.bottom){
					y = coords.bottom;
					panel.style.height = (height - coords.bottom) + 'px';
				} else {
					y = 0;
					panel.style.height = coords.top + 'px';
				}
			}

			panel.style.left = coords.left + 'px';
			panel.style.top = y + 'px';
		},
		list: function(){
			for(var i = 0; i < _list.length; i++){
				panel.appendChild(_list[i].html);
				_list[i].index = i;
			}
		},
		functions: function(options){
			if(options.functions.currentChange !== undefined)	_functions.currentChange = options.functions.currentChange;
		},
		add: function(item, position){
			if(position == undefined)	position = _list.length;

			var node = {};
			_list.splice(position, 0, node);

			node.html = tools.createHTML({tag: 'div'});
			node.html.node = node;
			node.item = item;

			if(node.item.separator){			node.html.className = 'cbb-separator';				return;	}

			if(!node.item.unselect){
				node.select = true;
				node.html.className = 'cbb-item';
				node.html.onmousedown = EVENTS.down.item;
				node.html.onmouseover = EVENTS.over;
			} else {
				node.select = false;
				node.html.className = 'cbb-unselect';
			}

			var icon = tools.createHTML({tag: 'div', parent: node.html });
			var text = tools.createHTML({tag: 'div', className: 'cbb-text', parent: node.html, innerHTML: node.item.text });

			if(node.item.level)		icon.style.marginLeft = node.item.level*20 + 'px';
			if(node.item.icon)		icon.className += 'cbb-icon ' + node.item.icon;
			if(node.item.title)		node.html.title = node.item.title;
		},
		remove: function(item){
			for(var i = 0; i < _list.length; i++){
				if(_list[i] == item){
					tools.destroyHTML(item.html);
					_list.splice(i, 1);
					if(SELECT.item == item)	SELECT.setDefault();
					break;
				}
			}
			for(var i = 0; i < _list.length; i++){
				_list[i].index = i;
			}
		}
	}
	var CREATE = {
	}
	var SELECT = new function(){
		this.item;

		this.swichSelect = function(item){			
			if(SELECT.item)	SELECT.item.html.className = 'cbb-item';

			if( typeof _functions.currentChange == 'function')	_functions.currentChange( SELECT.item, item);

			SELECT.item = item;
			if(item){
				item.html.className = 'cbb-item cbb-select';
				var iconClasses = (item.item.icon) ? ( 'cbb-icon ' + item.item.icon ) :  '';
				caption.innerHTML = '<div class="' + iconClasses + '"></div><div class="cbb-text">' + item.item.text + '</div>'
			}
		}
		this.setDefault = function(){
			SELECT.swichSelect();
			for(var i = 0; i < _list.length; i++){
				if(_list[i].select){
					SELECT.swichSelect(_list[i]);
					break;
				}	
			}
		}
		this.clear = function(){
			caption.innerHTML = '';
		}
	}

	link.create(options)
}