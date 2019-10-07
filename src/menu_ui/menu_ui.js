function menu_ui(options){

	var _main;
	
	var _setting;
	var _functions;
	var _parent;
	var _fragment = document.createDocumentFragment();
	
	var link = this;

	//sources 
	var arrow = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="4px" height="7px" viewBox="0 0 4 7"><path fill=" #000000" d="M 0,0 L 4,3.5 L 0,7"/></svg>';

	link.create = function(options){
		if(!options)			options = {};

		if(options.parent == undefined)		options.parent = document.body;
		if(options.x === undefined)			options.x = 0;
		if(options.y === undefined)			options.y = 0;
		if(options.show === undefined)		options.show = false;

		_setting = {};
		_functions = {};
		CREATE.main();

		link.change(options);
	}

	link.remove = function(options){
		_main = undefined;
		_setting = undefined;
		_functions = undefined;
		_fragment = undefined;
	}

	link.change = function(options){
		if(!options)			options = {};

		if(options.parent !== undefined)							CHANGE.parent(options);
		if(options.x !== undefined || options.y !== undefined)		CHANGE.coords(options);
		if(options.tree !== undefined)								CHANGE.items(options);

		if(options.close !== undefined)								CHANGE.functions(options)
	
		if(options.show)											CHANGE.show(options);
	}

	link.get = function(){
		return _main.items;
	}

	var EVENTS = {
		click: {
			panel: function(e){
				var item = tools.closest( e.target, 'mui-item');
				if(item)	item = item.item;
				else		item = {};

				_main.html.focus();

				if(item.func){
					if(!item.func(item)){
						if(_setting.fClose)		_setting.fClose();
						CHANGE.show({ show: false });
					}
				}
			},
			outside: function(e){
				if( !tools.closest( e.target, 'mui-panel') ) {
					CHANGE.show({ show: false });
				}
			}
		},

		key: function(e){
			var kc = e.keyCode;

			function findBranch(panel){
				if(panel.current){
					if(panel.openPanel)				return findBranch(panel.openPanel);
					else							return panel;
				} else 								return panel;
			}

			var cPanel = findBranch(_main.panel);
			var cBranch;

			if(cPanel.current){
				if(kc == 37){
					if(cPanel.parent){
						CURRENT.clear(cPanel);
						DISPLAY.close(cPanel);	
					}
				}
				if(kc == 40){
					var index;
					for(var i = 0; i < cPanel.items.length; i++){
						if(cPanel.items[i] == cPanel.current)
							index = i;
					}
					do {
						index++;
						if(index == cPanel.items.length)
							index = 0;
						cBranch = cPanel.items[index];
					} while (!tools.hasClass(cBranch.html.visual, 'mui-item') )
					CURRENT.clear(cPanel);
					CURRENT.set(cPanel, cBranch);
				}
				if(kc == 38){				
					var index;
					for(var i = 0; i < cPanel.items.length; i++){
						if(cPanel.items[i] == cPanel.current)
							index = i;
					}
					do {
						index--;
						if(index == -1)
							index = cPanel.items.length - 1;
						cBranch = cPanel.items[index];
					} while (!tools.hasClass(cBranch.html.visual, 'mui-item') )
					CURRENT.clear(cPanel);
					CURRENT.set(cPanel, cBranch);
				}
				if(kc == 39){
					if(cPanel.current.panel){
						DISPLAY.open(cPanel, cPanel.current);
						for(var i = 0; i < cPanel.current.panel.items.length; i++){
							if(tools.hasClass(cPanel.current.panel.items[i].html.visual, 'mui-item') ){
								cBranch = cPanel.current.panel.items[i];
								break;
							}
						}
						if(cBranch)				CURRENT.set(cBranch);
					}
				}
				if(kc == 13){
					if(cPanel.current.panel){
						DISPLAY.open(cPanel, cPanel.current);
						for(var i = 0; i < cPanel.current.panel.items.length; i++){
							if(tools.hasClass(cPanel.current.panel.items[i].html.visual, 'mui-item') ){
								cBranch = cPanel.current.panel.items[i];
								break;
							}
						}
						if(cBranch)				CURRENT.set(cBranch);
					} else if(cPanel.current.func){
						if(!cPanel.current.func(cPanel.current)){
							if(_setting.fClose)		_setting.fClose();
							CHANGE.show({ show: false });
						}
					}
				}
			} else {
				for(var i = 0; i < cPanel.items.length; i++){
					if(tools.hasClass(cPanel.items[i].html.visual, 'mui-item')){		cBranch = cPanel.items[i];		break;	}
				}
				if(kc == 37){
					if(cPanel.parent){
						CURRENT.clear(cPanel);
						DISPLAY.close(cPanel);	
					}
				}
				if((kc == 38 || kc == 40) && cBranch)		CURRENT.set(cPanel, cBranch);
			}


		}
	}

	var CREATE = {
		main: function(){
			_main = {};
			_main.items = [];
			_main.html = tools.createHTML({
				tag: 'div',
				tabIndex: -1,
				onkeydown: EVENTS.key,
				className: 'mui-main'
			});
		}
	}

	var CHANGE = {
		coords: function(options){
			if(!_setting.coords)			_setting.coords = {};
			if(options.x !== undefined)		_setting.coords.left = options.x;
			if(options.x !== undefined)		_setting.coords.right = options.x;
			if(options.y !== undefined)		_setting.coords.top = options.y;
			if(options.y !== undefined)		_setting.coords.bottom = options.y;
		},
		functions: function(options){
			if(options.close !== undefined)	_functions.close = options.close;
		},
		items: function(options){
			_main.html.innerHTML = '';
			_main.items = options.tree;
			_main.panel = DISPLAY.panel(_main.items, _main.html);
		},
		parent: function(options){
			_parent = options.parent
			if(_parent)			_parent.appendChild(_main.html);
			else				_fragment.appendChild(_main.html);
		},
		show: function(options){
			_setting.show = options.show;
			if(_setting.show){
				_parent.appendChild(_main.html);
				_main.html.focus();
				window.addEventListener("mousedown", EVENTS.click.outside);
				DISPLAY.show( _main.panel, _setting.coords, true, false);
			} else {
				_fragment.appendChild(_main.html);
			}
		},
		hide: function(){
			window.removeEventListener("mousedown", EVENTS.click.outside);
			CHANGE.show({ show: false });
		}
	}

	var DISPLAY = {
		show: function(panel, coords, xr, yr){
			panel = panel.html;
			panel.style.display = 'block';
			var w = document.body.offsetWidth;
			var h = document.body.offsetHeight;
			var x = 0, y = 0;
	
			if(xr){
				if(coords.right + panel.offsetWidth < w )		x = coords.left;
				else											x = coords.right - panel.offsetWidth;
			} else {
				if(coords.right + panel.offsetWidth < w )		x = coords.right;
				else											x = coords.left - panel.offsetWidth;
			}
	
			if(yr){
				if(coords.bottom + panel.offsetHeight < h )		y = coords.top;
				else											y = coords.bottom - panel.offsetHeight;
			} else {
				if(coords.bottom + panel.offsetHeight < h )		y = coords.bottom;
				else											y = coords.top - panel.offsetHeight;
			}
	
			panel.style.left = x + 'px';
			panel.style.top = y + 'px';
		},
		panel: function(items){
			var panel = {};
			panel.items = items;
			panel.type = 'panel';
			panel.html = tools.createHTML({
				tag: 'div',
				parent: _main.html,
				className: 'mui-panel',
				onclick: EVENTS.click.panel
			});

			for(var i = 0; i < items.length; i++){
				var item = items[i];
				item.html = {};

				item.html.visual = tools.createHTML({tag: 'div', parent: panel.html });
				item.html.icon = tools.createHTML({tag: 'div', parent: item.html.visual });
				item.html.name = tools.createHTML({tag: 'span', parent: item.html.visual });
				item.html.addit = tools.createHTML({tag: 'div', parent: item.html.visual });
				item.html.visual.item = item;

				item.change = (function(item){
					return function(){
						item.html.visual.className = 'mui-item';
						item.html.icon.className = 'mui-icon';
						item.html.name.className = 'mui-name';
						item.html.addit.className = 'mui-child';

						if(item.separator)						item.html.visual.className = 'mui-separator';
						if(item.text)							item.html.name.innerHTML = item.text;
						if(item.disabled)						item.html.visual.className = 'mui-disable';
						if(item.current)						item.html.visual.className += ' mui-current';
						if(item.check)							item.html.icon.className += ' mui-check ';
						if(item.icon)							item.html.icon.className += ' ' + item.icon;
						if(item.children)						item.panel = DISPLAY.panel(item.children, panel);
						if(item.children)						item.html.addit.innerHTML = arrow;
						else if(item.text2 != undefined)		item.html.addit.innerHTML = item.text2;
						else 									item.html.addit.innerHTML = '';
					}
				})(item);
				item.change();
			}
			panel.html.onmouseover = function(){
				return function(e){
					var item = tools.closest(e.target, 'mui-item');
					if(item)	item = item.item;
					if(item !== panel.current){
						CURRENT.clear(panel);
						CURRENT.set(panel, item);
					}
					if(!item)
						item = {};
					if(panel.openPanel != undefined && panel.openPanel != item.panel){
						var path = panel.openPanel;
						while(path != undefined){
							var nextPath = path.openPanel;
							CURRENT.clear(path);
							DISPLAY.close(path);
							path = nextPath;
						}
					}
					if(item.panel != undefined)
						DISPLAY.open(panel, item);
				}
			}(panel);
			return panel;
		},
		close: function(panel){
			panel.html.style.display = 'none';
			panel.parent.openPanel = undefined;
		},
		open: function(panel, item){
			panel.openPanel = item.panel;
			item.panel.parent = panel;
			DISPLAY.show(item.panel, item.html.visual.getBoundingClientRect(), false, true);
		}
	}

	var CURRENT = new function(){
		this.clear = function(panel){
			if(!panel.current)	return;
			panel.current.html.visual.className = 'mui-item';
			panel.current.current = false;
			panel.current = undefined;
		}
		this.set = function(panel, item){
			if(!item)			return;
			panel.current = item;
			panel.current.current = true;
			panel.current.html.visual.className = 'mui-item mui-current';

		}
	}

	link.create(options);
}