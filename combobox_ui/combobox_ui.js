function combobox_ui(options){

	var list;

	var functions;
	var setting;

	var banner;
	var panel;

	var caption;

	var link = this;
	var arrow = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="7px" height="4px" viewBox="0 0 7 4"><style>	.ar {fill: #000000;}</style><path class="ar" d="M 0,0 L 7,0 L 3.5,4"/></svg>';


	link.create = function(options){
		if(!options)						options = {};
		if(options.tree == undefined)		options.tree = [];
	
		banner = tools.createHTML({tag: 'div', className: 'cbb-main', onclick: events.clickBanner, tabIndex: -1, onkeydown: events.key }); 
		panel = tools.createHTML({ tag: 'div', className: 'cbb-panel', parent: document.body, onclick: events.clickPanel});
		button = tools.createHTML({tag: 'div', className: 'cbb-arrow', parent: banner, innerHTML: arrow });
		caption = tools.createHTML({tag: 'div', className: 'cbb-caption', parent: banner});
		list = [];

		link.change(options);
	}

	link.change = function(options){
		if(options.parent != undefined)		options.parent.appendChild(banner);
		if(options.tree != undefined)		create.list(options.tree);
	}

	link.remove = function(){
		list = undefined;
		panel = undefined;
		banner = undefined;
		caption = undefined;
		functions = undefined;
		setting = undefined;
	}

	link.getSelected = function(){ if(select.item)	return select.item.tree; }
	link.clearSelect = function(){ select.setDefault();	}

	var events = {
		over: function(e){
			var item = tools.closest(e.target, 'cbb-item');
			if(item)	select.swichHover(item.item);

		},
		clickItem: function(e){
			var item = tools.closest(e.target, 'cbb-item');
			select.swichSelect(item.item);
			events.clickDestroy(e);
			banner.focus();
		},
		clickBanner: function(e){
			if(panel.style.display != 'block'){
				set.list();
				set.panel(banner.getBoundingClientRect(), true, false);
			} else events.clickDestroy(e);

			banner.focus();
			tools.stopProp(e);
			window.addEventListener("click", events.clickDestroy);
		},
		clickPanel: function(e){
			tools.stopProp(e);
			banner.focus();
			return false;
		},
		clickDestroy: function(e){
			window.removeEventListener("click", events.clickDestroy);
			panel.style.display = '';
			select.swichHover(select.item);
		},
		key: function(e){
			if(select.hover == undefined)	return;

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
				if(panel.style.display != 'block')		events.clickBanner(e);	
				else									events.clickDestroy(e);
			}
			if(e.keyCode == 27){
				events.clickDestroy(e);
			}
			
			if(e.keyCode == 38 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 27){
				tools.stopProp(e);
				return false;
			}
		}
	}
	var set = {
		panel: function( coords, xr, yr){
			panel.style.display = 'block';
			var width = document.body.offsetWidth;
			var height = document.body.offsetHeight;
			var x = 0, y = 0;
			
			if(coords.right > panel.offsetWidth )				x = coords.right - panel.offsetWidth;
			else												x = coords.left;
	
			if(coords.bottom + panel.offsetHeight < height )	y = coords.bottom;
			else												y = coords.top - panel.offsetHeight;
				
			panel.style.left = x + 'px';
			panel.style.top = y + 'px';
		},
		list: function(){
			for(var i = 0; i < list.length; i++){
				panel.appendChild(list[i].html);
				list[i].index = i;
			}
		}
	}

	var create = {
		list: function(tree){
			for(var i = 0; i < tree.length; i++)					create.add(tree[i]);
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

			if(node.tree.separator){			node.html.className = 'cbb-separator';				return;		}

			if(!node.tree.unselect){
				node.select = true;
				node.html.className = 'cbb-item';
				node.html.onclick = events.clickItem;
				node.html.onmouseover = events.over;
			} else {
				node.select = false;
				node.html.className = 'cbb-unselect';
			}

			var icon = tools.createHTML({tag: 'div', className: 'cbb-icon', parent: node.html });
			var text = tools.createHTML({tag: 'div', className: 'cbb-text', parent: node.html, innerHTML: node.tree.text });

			if(node.tree.icon)		icon.className += ' ' + node.tree.icon;
		}
	}

	var select = new function(){

		this.item;
		this.hover;

		this.swichHover = function(item){
			if(select.hover != item){
				if(select.hover != undefined)	select.hover.html.className = 'cbb-item';
				if(item != undefined)			item.html.className = 'cbb-item cbb-select';
				select.hover = item;
			}
		}
		this.swichSelect = function(item){
			select.swichHover(item);
			select.item = item;
			var iconClasses = 'cbb-icon' + ( (item.tree.icon) ? ( ' ' + item.tree.icon ) :  '');
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