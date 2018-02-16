function tab_ui(options){

	var self_parent;
	var self_header;
	var self_content;

	var setting;
	var tabs;
	var functions;

	var pageTab;
	var searchTab;

	var link = this;
	var fragment = document.createDocumentFragment();

	var close_button = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="12px" viewBox="0 0 24 24" xml:space="preserve"><style type="text/css">.tbu-close .cross{fill: #759db3;}.tbu-close:hover  .cross{fill: #E73C3C;}.tbu-close:active .cross{fill: #E10C0C;}</style><g class="cross"><path d="M 5.5,7 L 7,5.5 L 18.5,17 L 17,18.5 L 5.5,7 z" /><path d="M 5.5,17 L 7,18.5 L 18.5,7 L 17,5.5 L 5.5,17 z" /></g></svg>';
	var plus_button = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 18 18" xml:space="preserve"><style type="text/css">.tbu-pageTab	.fill{fill: transparent; transition: .2s;} .tbu-pageTab:hover	.fill{fill: #8eafc1; transition: .2s;}.tbu-pageTab:active	.fill{fill: #1f5c7a; transition: .2s;} .tbu-pageTab		.plus {fill: #8eafc1; transition: .2s;}.tbu-pageTab:hover	.plus {fill: white; transition: .2s;}.tbu-pageTab:active	.plus {fill: white; transition: .2s;}</style><circle class="fill" transform="translate(9,9)" r="9" /><path class="plus" d="M 3.5,9 L 3.5,8 Q 3.5,7.5 4,7.5 L 7.5,7.5 L 7.5,4 Q 7.5,3.5 8,3.5					L 10,3.5 Q 10.5,3.5 10.5,4 L 10.5,7.5					L 14,7.5 Q 14.5,7.5 14.5,8 L 14.5,10 Q 14.5,10.5 14,10.5 L 10.5,10.5					L 10.5,14 Q 10.5,14.5 10,14.5 L 8,14.5 Q 7.5,14.5 7.5,14 L 7.5,10.5					L 4,10.5 Q 3.5,10.5 3.5,10 z"/></svg>';
	var loop_button = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 18 18" xml:space="preserve"><style type="text/css">.tbu-loop		.fill{fill: transparent; transition: .2s;} .tbu-loop:hover		.fill{fill: #8eafc1; transition: .2s;}.tbu-loop:active	.fill{fill: #1f5c7a; transition: .2s;} .tbu-loop			.loop {fill: #8eafc1; transition: .2s;}.tbu-loop:hover		.loop {fill: white; transition: .2s;}.tbu-loop:active	.loop {fill: white; transition: .2s;}.tbu-loop			.sup{fill: #edeef0; transition: .2s;} .tbu-loop:hover		.sup{fill: #8eafc1; transition: .2s;}.tbu-loop:active	.sup{fill: #1f5c7a; transition: .2s;} </style>	<circle class="fill" transform="translate(9,9)" r="9" />	<path class="loop" d="M 10,8 L 15,13 L 13,15 L 8,10 z" />	<circle class="loop" transform="translate(8,8)" r="5" />		<circle class="sup" transform="translate(8,8)" r="2.5" /></svg>';
	var loop_close = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 18 18" xml:space="preserve"><style type="text/css">.tbu-loop		.fill{fill: #8eafc1; transition: .2s;} .tbu-loop:hover		.fill{fill: #1f5c7a; transition: .2s;}.tbu-loop:active	.fill{fill: #E73C3C; transition: .2s;} .cross {fill: white; }</style>	<circle class="fill" transform="translate(9,9)" r="9" />	<g class="cross">	<path d="M 4,6 L 12,14 L 14,12 L 6,4 z" />	<path d="M 4,12 L 12,4 L 14,6 L 6,14 z" /></g></svg>';

	this.create = function(options){
		if(setting != undefined)					link.remove();

		if(options.parent == undefined)					options.parent = document.body;
		if(options.newPage == undefined)				options.newPage = true;
		if(options.searchTab == undefined)				options.searchTab = true;
		if(options.close == undefined)					options.close = true;
		if(options.show == undefined)					options.show = true;
		if(options.dragAndDrop == undefined)			options.dragAndDrop = true;

		setting = {};		functions = {};			tabs = [];

		self_header		= tools.createHTML({tag: 'div', className: 'tbu-header', tabIndex: 0, onkeydown: events.keydown });
		self_content	= tools.createHTML({tag: 'div', className: 'tbu-container'});

		self_create.newPage();
		self_create.search();

		link.change(options);
	}
	this.remove = function(){
		self_parent.removeChild(self_header);
		self_parent.removeChild(self_content);

		tabs = undefined;								functions = undefined;
		self_header = undefined;						self_parent = undefined;
		setting = undefined;							self_content = undefined;
		pageTab = undefined;							searchTab = undefined;
		fragment = document.createDocumentFragment();
	}
	this.change = function(options){
		if(options.parent != undefined)					set.parent(options);
		if(options.show != undefined)					set.show(options);
		if(options.newPage != undefined)				set.newPage(options);
		if(options.searchTab != undefined)				set.searchTab(options);
		if(options.functions != undefined)				set.functions(options);
		if(options.dragAndDrop != undefined)			set.drag_drop(options);
		if(options.tabs != undefined)					link.addTabs(options.tabs);
	}
	this.setCurrent = function(tab){
		tab = set.get_tab(tab);
		set.active(tab);
	}
	this.addTabs = function(input_tabs, index){

		var result = [];

		if(!Array.isArray(input_tabs))								input_tabs = [input_tabs];
		if(index == undefined || index < 0 || index > tabs.length)	index = tabs.length;

		for(var i = 0; i < input_tabs.length; i++){
			var tab = new cTab(input_tabs[i]);
			self_header.insertBefore(tab.html, self_header.children[index + i]);
			tabs.splice(index + i, 0, tab);
			result.push(tab);
		}
		return result;
	}
	this.removeTabs = function(input_tabs){

		if(input_tabs == undefined)						input_tabs = tabs.concat();
		if(!Array.isArray(input_tabs))					input_tabs = [input_tabs];

		for(var i = 0; i < input_tabs.length; i++){
			tab = set.get_tab(input_tabs[i]);

			var index = 0;
			for(var j  = 0; j < tabs.length; j++){
				if(tabs[j] == tab)						index = j;
			}

			if(tab == setting.active_tab){
				var new_index = -1;
				if(index != 0)							new_index = index - 1;
				else if(tabs.length != 1)				new_index = index + 1;
				
				if(new_index != -1)						set.active(tabs[new_index]);
				else									tools.destroyHTML(tab.content);	
			}

			tools.destroyHTML(tab.html);
			tabs.splice(index, 1);
		}
	}
	this.move = function(start, end){
		if(typeof start != 'number' || typeof end != 'number')	return;
		
		if(start < 0)									start = 0;
		if(end < 0)										end = 0;
		if(start >= tabs.length)						start = tabs.length - 1;
		if(end >= tabs.length)							end = tabs.length - 1;

		if( start > end )								self_header.insertBefore(tabs[start].html, self_header.children[end]);
		else {
			if(self_header.children.length > end)		self_header.insertBefore(tabs[start].html, self_header.children[end + 1]);
			else										self_header.appendChild(tabs[start].html);
		}

		var buf = tabs[start];

		if(start < end){
			tabs.splice(end + 1, 0 , buf);
			tabs.splice(start, 1);
		} else {
			tabs.splice(end, 0 , buf);
			tabs.splice(start + 1, 1);
		}
	}
	this.getTab = function(index){
		if(tabs.length > 0){
			if(index != undefined){
				if(index < 0 || index >= tabs.length) index = tabs.length - 1;
				return(tabs[index])
			} else return setting.active_tab;
		} else console.warn('there are not tabs!');	
	}
	this.getTabs = function(){	return tabs.concat();	}
	this.getOptions = function(){		return tools.cloneObject(setting); 	}

	function cTab(options){

		var iTab = this;

		iTab.html						= tools.createHTML({tag: 'div', onclick: events.tabClick, onmousedown: drag_and_drop.mdown, oncontextmenu: events.rightClick, className: 'tbu-tab tbu-tab-nactive' });
		iTab.content					= tools.createHTML({tag: 'div', className: 'tbu-default' });

		var icon						= tools.createHTML({tag: 'div', parent: iTab.html});
		var docket						= tools.createHTML({tag: 'div', parent: iTab.html, className: 'tbu-docket'});
		var close						= tools.createHTML({tag: 'div', parent: iTab.html, onclick: events.closeClick});
		var background					= '#fff';

		iTab.html.tab = iTab;
		var name = 'New tab';
		var title;

		iTab.change = function(options){
			if(options.content != undefined){
				if(setting.active_tab == iTab)		tools.destroyHTML(iTab.content);
				iTab.content 						= options.content;
				iTab.content.style.cssText 			= 'right: 0; left: 0; top:0; bottom: 0; position: absolute'; 
				if(setting.active_tab == iTab)		self_content.appendChild(iTab.content);
			}
			if(options.name != undefined)			name = options.name;
			if(options.title != undefined)			title = options.title;
			if(options.background != undefined)		background = options.background;

			if(options.icon != undefined){
				if(options.icon) {					icon.style.backgroundImage = 'url(' + options.icon + ')';
													icon.className = 'tbu-icon';
				} else 								icon.className = '';
			}
			if(options.close != undefined){
				if(options.close){					close.className = 'tbu-close';
													close.innerHTML = close_button;
				} else	{							close.className = '';
													close.innerHTML = '';
				}
			}
			if(title == undefined)					title = name;

			docket.innerHTML	= name;				iTab.html.style.background = background;
			docket.title		= title;			icon.title			= title;
		}
		iTab.getName = function(){ return name;}
		iTab.getBackground = function(){ return background;}

		iTab.change(options);
	}

	var events = {
		tabClick: function(e) {
			var tab = tools.closest(e.target, 'tbu-tab').tab;
			set.active(tab);
		},
		closeClick: function(e) {
			var tab = tools.closest(e.target, 'tbu-tab').tab;
			
			if(typeof functions.remove == 'function'){
				if(functions.remove(tab))
					link.removeTabs(tab);
			} else link.removeTabs(tab);

			tools.stopProp(e);
		},
		rightClick: function(e){
			if(typeof functions.rightClick == 'function'){
				var tab = tools.closest(e.target, 'tbu-tab');
				if(tab){
					tab = tab.tab
				}
				functions.rightClick(e, tab);
				return false;
			}
		},
		keydown: function(e){
			if(document.activeElement != self_header) 	return;
			var kc = e.keyCode;
			var index;
			if((kc == 37 || kc == 39) && setting.active_tab != undefined){
				for(var i = 0; i < tabs.length; i++){
					if(setting.active_tab == tabs[i])	index = i;
				}
				if(kc == 39){
					if(index == tabs.length - 1)		index = 0;
					else								index++;
				}
				if(kc == 37){
					if(index == 0)						index = tabs.length - 1;
					else								index--;
				}
				set.active(tabs[index]);
				tools.stopProp(e);						return false;
			}

		},
		newPageClick: function(e) {
			if(typeof functions.newPage == 'function')		functions.newPage(link);
		}
	}
	var set = {
		parent: function(options){
			self_parent = options.parent;
			if(setting.show){
				self_parent.appendChild(self_content);
				self_parent.appendChild(self_header);
			}
		},
		show: function(options){
			if(options.show){
				self_parent.appendChild(self_content);
				self_parent.appendChild(self_header);				
			} else {
				fragment.appendChild(self_content);
				fragment.appendChild(self_header);	
			}
			setting.show = options.show;
		},
		active: function(tab){

			if(typeof functions.active == 'function'){
				if(!functions.active(setting.active_tab, tab)) return;
			}

			if(setting.active_tab)					fragment.appendChild(setting.active_tab.content);
			for(var i = 0; i < tabs.length; i++)	tabs[i].html.className = 'tbu-tab tbu-tab-nactive';

			setting.active_tab = tab;

			tab.html.className = 'tbu-tab tbu-tab-active';
			self_content.appendChild(tab.content);
			var event = new CustomEvent("resize", {bubbles: true, cancelable: true});		
			window.dispatchEvent(event);
		},
		functions: function(options){
			if(options.functions.remove != undefined)				functions.remove = options.functions.remove;
			if(options.functions.active != undefined)				functions.active = options.functions.active;
			if(options.functions.move != undefined)					functions.move = options.functions.move;
			if(options.functions.newPage != undefined)				functions.newPage = options.functions.newPage;
			if(options.functions.search != undefined)				functions.search = options.functions.search;
			if(options.functions.rightClick != undefined)			functions.rightClick = options.functions.rightClick;
		},
		drag_drop: function(options){
			if(options.dragAndDrop != setting.dragAndDrop)		setting.dragAndDrop = options.dragAndDrop;
		},
		newPage: function(options){
			if(setting.newPage != options.newPage){
				if(options.newPage)				pageTab.style.display = 'block';
				else if(!options.newPage)		pageTab.style.display = 'none';
			}
		},
		searchTab: function(options){
			if(setting.searchTab != options.searchTab){
				if(options.searchTab)			searchTab.style.display = 'block';
				else if(!options.searchTab)		searchTab.style.display = 'none';
			}
		},
		get_tab: function(tab){
			if(typeof tab == 'number'){
				if(tab < 0 || tab >= tabs.length)
					tab = tabs.length - 1;
				tab = tabs[tab];
			}
			return tab;
		},
		get_index: function(index){
			if(index instanceof cTab){
				for(var i = 0; i < tabs.length; i++)
					if(tabs[i] == index){
						index = i;
						break;
					}
			}
			return index;
		}
	}
	var self_create = {
		search: function(){
			searchTab 			= tools.createHTML({tag: 'div', className: 'tbu-searchTab', parent: self_header});
			searchTab.button	= tools.createHTML({tag: 'div', className: 'tbu-loop', parent: searchTab, innerHTML: loop_button, onclick: search.mclick, title: 'Search pages'});
		},
		newPage: function(){
			pageTab 			= tools.createHTML({tag: 'div', className: 'tbu-pageTab', parent: self_header, onclick: events.newPageClick, innerHTML: plus_button, title: 'New page'});			
		}
	}
	var drag_and_drop = new function(){
		var self;

		this.mdown = function(e){
			if(setting.dragAndDrop){
				var tab = tools.closest(e.target, 'tbu-tab').tab;
				self = {event: e, tab: tab};

				window.addEventListener("mousemove", mmove);
				window.addEventListener("mouseup", mup);
			}
		}

		function mmove(e){
			if(Math.abs(e.pageX - self.event.pageX) > 3) {
				set.active(self.tab);
				self.moved = true;
			}
			if(self.moved){
				var tab = tools.closest(e.target, 'tbu-tab');				
				if(tab != undefined){
					tab = tab.tab;
					if(tab != self.tab)
						link.move(set.get_index(self.tab),set.get_index(tab));
				}
			}
		}
		
		function mup(e){
			self = undefined;	
			window.removeEventListener("mousemove", mmove);
			window.removeEventListener("mouseup", mup);
		}
	}
	var search = new function(){
		var found;

		this.mclick = function(e){
			found = [];
			searchTab.button.innerHTML = loop_close;
			searchTab.button.onclick = xclick;
			searchTab.input = tools.createHTML({tag: 'input', parent: searchTab, className: 'tbu-searchInput'})
			searchTab.input.oninput = function(){ find(searchTab.input.value); };
		}

		function xclick(e){
			searchTab.button.innerHTML = loop_button;
			searchTab.button.onclick = search.mclick;
			find('');
			tools.destroyHTML(searchTab.input);
		}

		function find(text){
			for(var i = 0; i < found.length; i++)				found[i].html.style.background = found[i].getBackground();
	
			found = [];

			for(var i = 0; i < tabs.length; i++){
				if( tabs[i].getName().toLowerCase().indexOf(text.toLowerCase()) > -1 && text != '')
					found.push(tabs[i]);
			}
			for(var i = 0; i < found.length; i++)				found[i].html.style.background = '#fffedb';
			if(typeof functions.search == 'function')			functions.search(found);
		}
	}

	if(options) link.create(options);
}