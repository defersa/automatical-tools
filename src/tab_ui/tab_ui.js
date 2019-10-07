//
//	Created by Makarov Aleksand
//

//	feature:

// 	with "direction: 0" headline is at the top, with "direction: 1" is headline at the bottom

//	Custom functions:

//	close - ARGUMENTS(item):  item - the item which will close. - RETURNS - need to close item (true - yes / false - no)
//	current - ARGUMENTS(prevItem, nextItem): prevItem - previous tab, nextItem - tab, which was clicked. - RETURNS - need to change item (true - yes / false - no)
//	newPage - ARGUMENTS(link): link - reference to the tree where the event occurred.
//	search - ARGUMENTS(items): items - items, which were found.
//  rightClick - ARGUMENTS(e, item): e - parameter of event, item - clicked item
// 	

function tab_ui(options){
	
	var _Headline;
	var _Body;

	var _parent;
	var _setting;
	var _functions;

	var link = this;
	var _fragment = document.createDocumentFragment();

	var svgClose = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="12px" viewBox="0 0 24 24" xml:space="preserve"><g class="tbu-cross"><path d="M 5.5,7 L 7,5.5 L 18.5,17 L 17,18.5 L 5.5,7 z" /><path d="M 5.5,17 L 7,18.5 L 18.5,7 L 17,5.5 L 5.5,17 z" /></g></svg>';
	var svgPlus = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 18 18" xml:space="preserve"><circle class="tau-svg-fill" transform="translate(9,9)" r="9" /><path class="tau-svg-item" d="M 3.5,9 L 3.5,8 Q 3.5,7.5 4,7.5 L 7.5,7.5 L 7.5,4 Q 7.5,3.5 8,3.5L 10,3.5 Q 10.5,3.5 10.5,4 L 10.5,7.5L 14,7.5 Q 14.5,7.5 14.5,8 L 14.5,10 Q 14.5,10.5 14,10.5 L 10.5,10.5L 10.5,14 Q 10.5,14.5 10,14.5 L 8,14.5 Q 7.5,14.5 7.5,14 L 7.5,10.5L 4,10.5 Q 3.5,10.5 3.5,10 z"/></svg>';
	var svgLoop = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 18 18" xml:space="preserve"><style type="text/css">.tbu-loop		.fill{fill: transparent; transition: .2s;} .tbu-loop:hover		.fill{fill: #8eafc1; transition: .2s;}.tbu-loop:active	.fill{fill: #1f5c7a; transition: .2s;} .tbu-loop			.loop {fill: #8eafc1; transition: .2s;}.tbu-loop:hover		.loop {fill: white; transition: .2s;}.tbu-loop:active	.loop {fill: white; transition: .2s;}.tbu-loop			.sup{fill: #edeef0; transition: .2s;} .tbu-loop:hover		.sup{fill: #8eafc1; transition: .2s;}.tbu-loop:active	.sup{fill: #1f5c7a; transition: .2s;} </style>	<circle class="fill" transform="translate(9,9)" r="9" />	<path class="loop" d="M 10,8 L 15,13 L 13,15 L 8,10 z" />	<circle class="loop" transform="translate(8,8)" r="5" />		<circle class="sup" transform="translate(8,8)" r="2.5" /></svg>';
	var svgLoopClose = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 18 18" xml:space="preserve"><style type="text/css">.tbu-loop		.fill{fill: #8eafc1; transition: .2s;} .tbu-loop:hover		.fill{fill: #1f5c7a; transition: .2s;}.tbu-loop:active	.fill{fill: #E73C3C; transition: .2s;} .cross {fill: white; }</style>	<circle class="fill" transform="translate(9,9)" r="9" />	<g class="cross">	<path d="M 4,6 L 12,14 L 14,12 L 6,4 z" />	<path d="M 4,12 L 12,4 L 14,6 L 6,14 z" /></g></svg>';

	link.create = function(options){
		if(!options)									options = {};
		if(_setting != undefined)						link.remove();

		if(options.parent == undefined)					options.parent = document.body;
		if(options.newPage == undefined)				options.newPage = true;
		if(options.searchTab == undefined)				options.searchTab = true;
		if(options.close == undefined)					options.close = true;
		if(options.show == undefined)					options.show = true;
		if(options.dragAndDrop == undefined)			options.dragAndDrop = true;
		if(options.direction == undefined)				options.direction = 0;
		if(options.width == undefined)					options.width = 150;

		_setting = {};
		_functions = {};		

		CREATE.main();
		CREATE.page();
		CREATE.search();

		link.change(options);
	}
	link.remove = function(){
		_parent.removeChild(_Body.main);
		_fragment = document.createDocumentFragment();

		_functions = undefined;
		_Headline = undefined;							_Body = undefined;
		_setting = undefined;							_parent = undefined;
	}
	link.change = function(options){
		if(!options)									options = {};

		if(options.parent !== undefined)				SET.parent(options);
		if(options.show !== undefined)					SET.show(options);
		if(options.newPage !== undefined)				SET.newPage(options);
		if(options.searchTab !== undefined)				SET.searchTab(options);
		if(options.functions !== undefined)				SET.functions(options);
		if(options.dragAndDrop !== undefined)			SET.dragdrop(options);
		if(options.direction !== undefined)				SET.direction(options);
		if(options.width !== undefined)					SET.width(options);
		if(options.tabs !== undefined)					link.addTabs(options.tabs);
		if(options.currnet !== undefined)				link.setCurrent(options.currnet);	
	}

	link.getCurrent = function(){
		return _setting.current;
	}
	link.setCurrent = function(tab){
		if(typeof tab == 'number')		tab = link.getTab(tab);
		if(tab == undefined)			return;
		if(tab.getHidden() )			return;
		tab = GET.tab(tab);
		SET.current(tab);
	}

	link.addTabs = function(tabs, index){
		var result = [];

		if(!Array.isArray(tabs))
			tabs = [tabs];
		if(index > _Headline.items.length)		index = _Headline.items.length;
		if(index == undefined)					index = _Headline.items.length;
		if(index < 0)							index = 0;

		for(var i = 0; i < tabs.length; i++){
			var tab = new TAB(tabs[i]);
			_Headline.html.insertBefore(tab.html, _Headline.html.children[index + i]);
			_Headline.items.splice(index + i, 0, tab);
			result.push(tab);
		}
		return result;
	}
	link.removeTabs = function(tabs){

		if(tabs == undefined)						tabs = _Headline.items.concat();
		if(!Array.isArray(tabs))					tabs = [tabs];

		for(var i = 0; i < tabs.length; i++){
			tab = GET.tab(tabs[i]);
			var index = GET.index(tab);

			if(tab == _setting.current){
				var new_index = -1;
				if(index != 0)
					new_index = index - 1;
				else if(_Headline.items.length != 1)
					new_index = index + 1;
				
				if(new_index != -1)
					SET.current(_Headline.items[new_index]);
				else {
					_setting.current = undefined;					
					tools.destroyHTML(tab.content);	
				}
			}

			tools.destroyHTML(tab.html);
			_Headline.items.splice(index, 1);
		}
	}
	link.moveTab = function(start, end){
		if(typeof start != 'number' || typeof end != 'number')	return;
		
		if(start < 0)									start = 0;
		if(end < 0)										end = 0;
		if(start >= _Headline.items.length)				start = _Headline.items.length - 1;
		if(end >= _Headline.items.length)				end = _Headline.items.length - 1;

		if( start > end )								_Headline.html.insertBefore(_Headline.items[start].html, _Headline.html.children[end]);
		else {
			if(_Headline.html.children.length > end)	_Headline.html.insertBefore(_Headline.items[start].html, _Headline.html.children[end + 1]);
			else										_Headline.html.appendChild(_Headline.items[start].html);
		}

		var buf = _Headline.items[start];

		if(start < end){
			_Headline.items.splice(end + 1, 0 , buf);
			_Headline.items.splice(start, 1);
		} else {
			_Headline.items.splice(end, 0 , buf);
			_Headline.items.splice(start + 1, 1);
		}
	}
	link.getIndex = function(tab){
		GET.index(tab);
	}
	link.getTab = function(index){
		if(index >= 0 && index < _Headline.items.length)
			return(_Headline.items[index]);
		return undefined;
	}
	link.getTabs = function(){			return _Headline.items.concat();	}
	link.getOptions = function(){		return tools.cloneObject(_setting); 	}

	function TAB(options){

		var inner = this;

		inner.html						= tools.createHTML({tag: 'div', onclick: EVENTS.click.tab, onmousedown: EVENTS.down.tab, oncontextmenu: EVENTS.rightClick, className: 'tbu-tab tbu-tab-inactive' });
		inner.content					= tools.createHTML({tag: 'div', className: 'tbu-default' });

		var icon						= tools.createHTML({tag: 'div', parent: inner.html});
		var docket						= tools.createHTML({tag: 'div', parent: inner.html, className: 'tbu-docket'});
		var close						= tools.createHTML({tag: 'div', parent: inner.html, onclick: EVENTS.click.close});
		var background					= '#fff';
		var width;
		var hidden;

		inner.html.tab = inner;
		var name = 'New tab';
		var title;

		inner.change = function(options){
			if(!options)							options = {};
			if(options.content != undefined){
				if(_setting.current == inner)		tools.destroyHTML(inner.content);
				inner.content 						= options.content;
				inner.content.style.cssText 			= 'right: 0; left: 0; top:0; bottom: 0; position: absolute'; 
				if(_setting.current == inner)		_Body.appendChild(inner.content);
				else								_fragment.appendChild(inner.content);
			}
			if(options.hidden !== undefined){
				hidden = options.hidden;
				if(options.hidden){
					if(inner == _setting.current){
						var index = GET.index(inner);
						var new_index = index + 1;
						var new_item;

						while(index != new_index){
							if(new_index == _Headline.items.length)	new_index = 0;
							if( !_Headline.items[new_index].getHidden() )
								new_item = _Headline.items[new_index];

							new_index++;
						}

						if(new_item){
							link.setCurrent(new_item);
						} else {
							_setting.current = undefined;	
							_fragment.appendChild(inner.content);
						}
					}
					inner.html.style.display = 'none';
				} else 								inner.html.style.display = '';
			}
			if(options.name != undefined)			name = options.name;
			if(options.title != undefined)			title = options.title;
			if(options.background != undefined)		background = options.background;
			if(options.width != undefined)			width = options.width;

			if(options.icon != undefined){
				if(options.icon) {					icon.style.backgroundImage = 'url(' + options.icon + ')';
													icon.className = 'tbu-icon';
				} else 								icon.className = '';
			}
			if(width != undefined)					inner.html.style.width = width + 'px';
			else 									inner.html.style.width = _setting.width + 'px';

			if(options.close !== undefined){
				if(options.close){					close.className = 'tbu-close';
													close.innerHTML = svgClose;
				} else	{							close.className = '';
													close.innerHTML = '';
				}
			}
			if(title == undefined)					title = name;

			inner.html.style.background = background;
			docket.innerHTML	= name;
			docket.title		= title;
			icon.title			= title;
		}
		inner.getName = function(){ return name; }
		inner.getBackground = function(){ return background; }
		inner.getHidden = function(){ return hidden; }

		inner.change(options);
	}

	var EVENTS = {
		click: {
			tab: function(e){
				var tab = tools.closest(e.target, 'tbu-tab').tab;
				if(tab !== _setting.current)
					SET.current(tab);
				else 
					_Headline.html.focus();
			},
			close: function(e){
				var tab = tools.closest(e.target, 'tbu-tab').tab;
				
				if(typeof _functions.close == 'function'){
					if(_functions.close(tab))
						link.removeTabs(tab);
				} else link.removeTabs(tab);
	
				tools.stopProp(e);
			},
			page: function(e){
				if(typeof _functions.newPage == 'function')
					_functions.newPage(link);
			},
			search: function(e){
				SEARCH.click(e);
			}
		},
		right: {
			tab: function(e){
				if(typeof _functions.rightClick == 'function'){
					var tab = tools.closest(e.target, 'tbu-tab');
					if(tab){
						tab = tab.tab
					}
					_functions.rightClick(e, tab);
					return false;
				}
			}
		},
		down: {
			tab: function(e){
				if(_setting.dragAndDrop){
					DRAGDROP.down(e);
				}
			}
		},
		keydown: function(e){
			if(document.activeElement != _Headline.html) 	return;
			var kc = e.keyCode;
			var index;
			if((kc == 37 || kc == 39) && _setting.current != undefined){
				for(var i = 0; i < _Headline.items.length; i++){
					if(_setting.current == _Headline.items[i])	index = i;
				}
				if(kc == 39){
					if(index == _Headline.items.length - 1)		index = 0;
					else								index++;
				}
				if(kc == 37){
					if(index == 0)						index = _Headline.items.length - 1;
					else								index--;
				}
				SET.current(_Headline.items[index]);
				tools.stopProp(e);						return false;
			}
		}
	}
	var SET = {
		parent: function(options){
			_parent = options.parent;
			if(_setting.show)
				_parent.appendChild(_Body.main);
		},
		width: function(options){
			if(options.width > 0 &&  options.width <= 500)	 _setting.width = options.width;
			for(var i = 0; i < _Headline.items.length; i++){
				_Headline.items[i].change();
			}
		},
		show: function(options){
			if(options.show)	_parent.appendChild(_Body.main);
			else				_fragment.appendChild(_Body.main);
			_setting.show = options.show;
		},
		direction: function(options){
			if(options.direction == 1)	_Body.main.className = 'tbu-main tbu-bot';
			else						_Body.main.className = 'tbu-main tbu-top';
		},
		current: function(tab){

			if(typeof _functions.currentBefore == 'function'){
				if(!_functions.currentBefore(_setting.current, tab))	 return;
			}
			if(_Headline.items.length == 0){
				_setting.current = undefined;
				return;
			}

			if(_setting.current)							_fragment.appendChild(_setting.current.content);
			for(var i = 0; i < _Headline.items.length; i++)	_Headline.items[i].html.className = 'tbu-tab tbu-tab-inactive';

			_setting.current = tab;
			tab.html.className = 'tbu-tab';
			_Body.html.appendChild(tab.content);

			tools.resize();
			_Headline.html.focus();

			if(typeof _functions.currentAfter == 'function'){
				_functions.currentAfter(_setting.current, tab)
			}
		},
		functions: function(options){
			if(options.functions.close !== undefined)				_functions.close = options.functions.close;
			if(options.functions.currentBefore !== undefined)		_functions.currentBefore = options.functions.currentBefore;
			if(options.functions.currentAfter !== undefined)		_functions.currentAfter = options.functions.currentAfter;
			if(options.functions.newPage !== undefined)				_functions.newPage = options.functions.newPage;
			if(options.functions.search !== undefined)				_functions.search = options.functions.search;
			if(options.functions.rightClick !== undefined)			_functions.rightClick = options.functions.rightClick;
		},
		dragdrop: function(options){
			if(options.dragAndDrop != _setting.dragAndDrop)			_setting.dragAndDrop = options.dragAndDrop;
		},
		newPage: function(options){
			if(_setting.newPage != options.newPage){
				if(options.newPage)				_Headline.page.html.style.display = 'block';
				else if(!options.newPage)		_Headline.page.html.style.display = 'none';
			}
		},
		searchTab: function(options){
			if(_setting.searchTab !== options.searchTab){
				if(options.searchTab)			_Headline.search.html.style.display = 'block';
				else if(!options.searchTab)		_Headline.search.html.style.display = 'none';
			}
		}
	}
	var GET = {
		tab: function(tab){
			if(typeof tab == 'number'){
				if(tab < 0 || tab >= _Headline.items.length)
					tab = _Headline.items.length - 1;
				tab = _Headline.items[tab];
			}
			return tab;
		},
		index: function(index){
			if(index instanceof TAB){
				for(var i = 0; i < _Headline.items.length; i++){
					if(_Headline.items[i] == index){
						index = i;
						break;
					}
				}
			}
			return index;
		}
	}
	var CREATE = {
		main: function(){
			_Body = {};
			_Body.main = tools.createHTML({tag: 'div', className: 'tbu-main'});
			_Body.html = tools.createHTML({
				tag: 'div',
				className: 'tbu-container',
				parent: _Body.main
			});

			_Headline = {};
			_Headline.items = [];
			_Headline.html = tools.createHTML({
				tag: 'div',
				className: 'tbu-header',
				parent: _Body.main,
				tabIndex: -1,
				onkeydown: EVENTS.keydown
			});
		},
		search: function(){
			_Headline.search = {};
			_Headline.search.html = tools.createHTML({
				tag: 'div',
				className: 'tbu-searchTab',
				parent: _Headline.html
			});
			_Headline.search.button = tools.createHTML({
				tag: 'div',
				className: 'tbu-loop',
				parent: _Headline.search.html,
				innerHTML: svgLoop,
				onclick: EVENTS.click.search,
				title: 'Search pages'
			});
		},
		page: function(){
			_Headline.page = {};
			_Headline.page.html = tools.createHTML({
				tag: 'div',
				className: 'tbu-pageTab',
				parent: _Headline.html,
				innerHTML: svgPlus,
				onclick: EVENTS.click.page,
				title: 'New page'
			});			
		}
	}
	var DRAGDROP = new function(){
		var self;

		this.down = function(e){
			var tab = tools.closest(e.target, 'tbu-tab').tab;
			self = {event: e, tab: tab};

			window.addEventListener("mousemove", move);
			window.addEventListener("mouseup", up);
		}

		function move(e){
			if(Math.abs(e.pageX - self.event.pageX) > 3) {
				SET.current(self.tab);
				self.moved = true;
			}
			if(self.moved){
				var tab = tools.closest(e.target, 'tbu-tab');				
				if(tab != undefined){
					tab = tab.tab;
					if(tab != self.tab)
						link.moveTab(GET.index(self.tab), GET.index(tab));
				}
			}
		}
		
		function up(e){
			self = undefined;	
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		}
	}
	var SEARCH = new function(){
		var found;

		this.click = function(e){
			found = [];
			_Headline.search.button.innerHTML = svgLoopClose;
			_Headline.search.button.onclick = close;

			_Headline.search.input = tools.createHTML({
				tag: 'input',
				parent: _Headline.search.html,
				onkeydown: keydown,
				className: 'tbu-searchInput'})
			_Headline.search.input.oninput = function(){ find(_Headline.search.input.value); };
			_Headline.search.input.focus();
		}

		function close(e){
			_Headline.search.button.innerHTML = svgLoop;
			_Headline.search.button.onclick = SEARCH.click;
			find('');
			tools.destroyHTML(_Headline.search.input);
			_Headline.html.focus();
		}

		function find(text){
			for(var i = 0; i < found.length; i++)				found[i].html.style.background = found[i].getBackground();
	
			found = [];

			for(var i = 0; i < _Headline.items.length; i++){
				if( _Headline.items[i].getName().toLowerCase().indexOf(text.toLowerCase()) > -1 && text != '')
					found.push(_Headline.items[i]);
			}
			for(var i = 0; i < found.length; i++)				found[i].html.style.background = '#fffedb';
			if(typeof _functions.search == 'function')			_functions.search(found);
		}
		
		function keydown(e){
			if(e.keyCode == 27){
				close(e);
				tools.stopProp(e);
				return false;
			}
			if(e.keyCode == 13 && found.length > 0){
				SET.current(found[0]);
				close(e);
				tools.stopProp(e);
				return false;
			}
		}
	}

	if(options) link.create(options);
}