function combobox_ui(options){

	var list;

	var functions;
	var setting;
	var fragment = document.createDocumentFragment();

	var banner;
	var panel;
	var caption;

	var link = this;
	var arrow = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="7px" height="4px" viewBox="0 0 7 4"><style>	.ar {fill: #000000;}</style><path class="ar" d="M 0,0 L 7,0 L 3.5,4"/></svg>';

	link.create = function(options){
		if(!options)						options = {};
		if(options.tree == undefined)		options.tree = [];
		if(options.minWidth == undefined)	options.minWidth = 150;
		if(options.minHeight == undefined)	options.minHeight = 450;
	
		banner = tools.createHTML({tag: 'div', className: 'cbb-main', onmousedown: events.downBanner, tabIndex: -1, onkeydown: events.key }); 
		panel = tools.createHTML({ tag: 'div', className: 'cbb-panel', parent: fragment, onmousedown: events.downPanel});
		button = tools.createHTML({tag: 'div', className: 'cbb-arrow', parent: banner, innerHTML: arrow });
		caption = tools.createHTML({tag: 'div', className: 'cbb-caption', parent: banner});
		list = [];							setting = {};
		functions = {};

		link.change(options);
	}

	link.change = function(options){
		if(options.parent != undefined)		options.parent.appendChild(banner);
		if(options.functions)				set.functions(options);

		if(options.maxHeight)				setting.maxHeight = options.maxHeight;
		if(options.minWidth)				setting.minWidth = options.minWidth;

		if(options.tree != undefined)		create.list(options.tree);
	}

	link.remove = function(){
		list = undefined;					panel = undefined;
		banner = undefined;					caption = undefined;
		functions = undefined;				setting = undefined;
	}

	link.clearSelect = function(){ select.setDefault();	}
	link.getSelected = function(){ if(select.item)	return select.item.tree; }
	link.setSelected = function(item){
		for(var i = 0; i < list.length; i++){
			if(list[i].tree == item){
				select.swichSelect(list[i]);
			}
		}
	}

	var events = {
		downItem: function(e){
			var item = tools.closest(e.target, 'cbb-item');
			select.swichSelect(item.item);
			events.downDestroy(e);
			banner.focus();
		},
		downBanner: function(e){
			if(panel.parentNode == fragment){
				set.list();
				set.panel(banner.getBoundingClientRect(), true, false);
			} else events.downDestroy(e);

			banner.focus();
			tools.stopProp(e);
			window.addEventListener("mousedown", events.downDestroy);
			window.addEventListener("resize", events.downDestroy);
		},
		downPanel: function(e){
			tools.stopProp(e);
			banner.focus();
			return false;
		},
		downDestroy: function(e){
			window.removeEventListener("mousedown", events.downDestroy);
			window.removeEventListener("resize", events.downDestroy);
			fragment.appendChild(panel);
		},
		key: function(e){
			if(e.keyCode == 38 || e.keyCode == 37){
				for(var i = select.item.index - 1; i >= 0; i--){
					if(list[i].select){
						select.swichSelect(list[i]);
						break;
					}
				}
			}
			if(e.keyCode == 39 || e.keyCode == 40){
				for(var i = select.item.index + 1; i < list.length; i++){
					if(list[i].select){
						select.swichSelect(list[i]);
						break;
					}
				}
			}
			if(e.keyCode == 13){
				if(panel.parentNode == fragment)		events.downBanner(e);	
				else									events.downDestroy(e);
			}
			if(e.keyCode == 27){
				events.downDestroy(e);
			}
			
			if(e.keyCode == 38 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 27){
				tools.stopProp(e);
				return false;
			}
		}
	}
	var set = {
		panel: function( coords, xr, yr){

			document.body.appendChild(panel);
			var y = 0, height = document.body.offsetHeight;

			if(coords.right - coords.left > setting.minWidth)	panel.style.width = (coords.right - coords.left) + 'px';
			else												panel.style.width = setting.minWidth + 'px';


			if(coords.bottom + panel.offsetHeight < height )	y = coords.bottom;
			else												y = coords.top - panel.offsetHeight;

			panel.style.left = coords.left + 'px';
			panel.style.top = y + 'px';
		},
		list: function(){
			for(var i = 0; i < list.length; i++){				panel.appendChild(list[i].html);				list[i].index = i;	}
		},
		functions: function(options){
			if(options.functions.currentChange !== undefined)	functions.currentChange = options.functions.currentChange;
		}
	}
	var create = {
		list: function(tree){
			for(var i = 0; i < tree.length; i++)				create.add(tree[i]);
			set.list();
			select.setDefault();
		},
		add: function(tree, position){
			if(position == undefined)	position = list.length;

			var node = {};
			list.splice(position, 0, node);

			node.html = tools.createHTML({tag: 'div'});
			node.html.item = node;
			node.tree = tree;

			if(node.tree.separator){			node.html.className = 'cbb-separator';				return;	}

			if(!node.tree.unselect){
				node.select = true;
				node.html.className = 'cbb-item';
				node.html.onmousedown = events.downItem;
				node.html.onmouseover = events.over;
			} else {
				node.select = false;
				node.html.className = 'cbb-unselect';
			}

			var icon = tools.createHTML({tag: 'div', parent: node.html });
			var text = tools.createHTML({tag: 'div', className: 'cbb-text', parent: node.html, innerHTML: node.tree.text });

			if(node.tree.level)		icon.style.marginLeft = node.tree.level*20 + 'px';
			if(node.tree.icon)		icon.className += 'cbb-icon ' + node.tree.icon;
			if(node.tree.title)		node.html.title = node.tree.title;
		}
	}
	var select = new function(){

		this.item;

		this.swichSelect = function(item){			
			if(select.item)	select.item.html.className = 'cbb-item';
			if(item)		item.html.className = 'cbb-item cbb-select';

			if( typeof functions.currentChange == 'function')	functions.currentChange( select.item, item);

			select.item = item;
			var iconClasses = (item.tree.icon) ? ( 'cbb-icon ' + item.tree.icon ) :  '';
			caption.innerHTML = '<div class="' + iconClasses + '"></div><div class="cbb-text">' + item.tree.text + '</div>'
		}
		this.setDefault = function(){
			for(var i = 0; i < list.length; i++){
				if(list[i].select){
					select.swichSelect(list[i]);
					break;
				}	
			}
		}
	}

	link.create(options)
}