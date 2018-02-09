function menu_ui(options){
	
	var main = tools.createHTML({tag: 'div', parent: document.body, className: 'mui-main', tabIndex: -1, onkeydown: keydown});
	var arr = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="4px" height="7px" viewBox="0 0 4 7"><style>	.ar {fill: #000000;}</style><path class="ar" d="M 0,0 L 4,3.5 L 0,7"/></svg>';
	
	window.addEventListener("mousedown", destroy);
	main.panel = createPanel(options.tree);
	main.close = options.close;
	main.focus();

	if(options.rect)			setCoord( main.panel, options.rect, true, false);
	else						setCoord( main.panel, {left: options.x, right: options.x, top: options.y, bottom: options.y }, true, false);


	function createPanel(items, parent){
		
		var panel = tools.createHTML({tag: 'div', parent: main, className: 'mui-panel', onclick: click});
		for(var i = 0; i < items.length; i++){
			
			if(items[i] == undefined){
				var visual = tools.createHTML({tag: 'div', parent: panel, className: 'mui-separator'});
				continue;
			}

			var visual = tools.createHTML({tag: 'div', parent: panel, className: 'mui-item'});
			var icon = tools.createHTML({tag: 'div', parent: visual, className: 'mui-icon '});
			var name = tools.createHTML({tag: 'span', parent: visual, className: 'mui-name', innerHTML: items[i].text});

			if(items[i].func)							visual.func = items[i].func;
			if(items[i].disabled)						visual.className = 'mui-disable';
			if(items[i].check)							icon.className += ' mui-check ';
			if(items[i].icon)							icon.className += items[i].icon;
			if(items[i].children)						visual.panel = createPanel(items[i].children, panel);
			if(items[i].children)						tools.createHTML({tag: 'div', parent: visual, className: 'mui-child', innerHTML: arr});
			else if(items[i].text2 != undefined)		tools.createHTML({tag: 'div', parent: visual, className: 'mui-child', innerHTML: items[i].text2});
		}

		panel.parentPanel = parent;
		panel.onmouseover = setMouseOver(panel);
		return panel;
	}

	function close(){
		window.removeEventListener("mousedown", destroy);
		tools.destroyHTML( main );
	}

	function destroy(e){
		var item = tools.closest(e.target, 'mui-main');
		if(!item)	close();
	}

	function click(e){
		main.focus();

		var item = tools.closest(e.target, 'mui-item');
		if(item){
			if(item.func){
				item.func();
				if(main.close) main.close();
				close();
			}
		}
	}

	function setMouseOver(panel){
		return function(e){
			var item = tools.closest( e.target, 'mui-item');
			if(item !== panel.selected || !panel.selected){
				unselect(panel);
				if(item != undefined)		select(item);
				else						item = {};
			}			
			if(panel.panel != undefined && panel.panel != item ){
				var path = panel.panel;
				while(path != undefined){
					unselect(path.panel);
					var nextPath = path.panel.panel;
					closePanel(path)
					path = nextPath;
				}
			}
			if(item.panel != undefined)		openPanel(item);
			else							panel.panel = undefined;
		}
	}

	/*-- tools for select --*/
	function select(branch){
		if(branch.parentNode.selected != branch){
			branch.parentNode.selected = branch;
			branch.selected = true;
			branch.className = 'mui-item mui-selected';
		}
	}
	function unselect(panel){
		if(panel.selected){
			panel.selected.selected = false;
			panel.selected.className = 'mui-item';
			panel.selected = undefined;
		}
	}

	/*-- tools for visible --*/
	function openPanel(branch){
		branch.open = true;
		branch.parentNode.panel = branch;
		setCoord(branch.panel, branch.getBoundingClientRect(), false, true);
	}
	function closePanel(branch){
		branch.open = false;
		branch.parentNode.panel = undefined;
		branch.panel.style.display = 'none';
	}

	/*-- function for set coord of the panel --*/
	function setCoord(panel, coords, xr, yr){
		panel.style.display = 'block';
		var width = document.body.offsetWidth;
		var height = document.body.offsetHeight;
		var x = 0, y = 0;

		if(xr){
			if(coords.right + panel.offsetWidth < width )		x = coords.left;
			else												x = coords.right - panel.offsetWidth;
		} else {
			if(coords.right + panel.offsetWidth < width )		x = coords.right;
			else												x = coords.left - panel.offsetWidth;
		}

		if(yr){
			if(coords.bottom + panel.offsetHeight < height )	y = coords.top;
			else												y = coords.bottom - panel.offsetHeight;
		} else {
			if(coords.bottom + panel.offsetHeight < height )	y = coords.bottom;
			else												y = coords.top - panel.offsetHeight;
		}

		panel.style.left = x + 'px';
		panel.style.top = y + 'px';
	}

	/*-- keydown event's function --*/
	function keydown(e){

		var kc = e.keyCode;

		function findBranch(panel){
			if(panel.selected){
				if(panel.selected.open)		return findBranch(panel.selected.panel);
				else						return panel.selected;
			} else 							return panel;
		}

		var branch = findBranch(main.panel);
		var newBranch;

		if( tools.hasClass(branch, 'mui-panel') ){
			for(var i = 0; i < branch.children.length; i++){
				if(tools.hasClass(branch.children[i], 'mui-item')){		newBranch = branch.children[i];		break;	}
			}
			if(kc == 37){
				if(branch.parentPanel){
					unselect(branch);
					closePanel(branch.parentPanel.selected);	
				}
			}
			if(kc == 38 || kc == 40)		select(newBranch);
		} else {
			if(kc == 37){
				if(branch.parentNode.parentPanel){
					unselect(branch.parentNode);
					closePanel(branch.parentNode.parentPanel.selected);	
				}
			}
			if(kc == 40){
				newBranch = {};
				var index;
				for(var i = 0; i < branch.parentNode.children.length; i++){
					if(branch.parentNode.children[i] == branch)			index = i;
				}
				while(!tools.hasClass(newBranch, 'mui-item') ){
					index++;
					if(index == branch.parentNode.children.length)		index = 0;
					newBranch = branch.parentNode.children[index];
				}
				unselect(branch.parentNode);
				select(newBranch);
			}
			if(kc == 38){
				newBranch = {};
				var index;
				for(var i = 0; i < branch.parentNode.children.length; i++){
					if(branch.parentNode.children[i] == branch)			index = i;
				}
				while(!tools.hasClass(newBranch, 'mui-item') ){
					index--;
					if(index == -1)										index = branch.parentNode.children.length - 1;
					newBranch = branch.parentNode.children[index];
				}
				unselect(branch.parentNode);
				select(newBranch);
			}
			if(kc == 39){
				if(branch.panel){
					openPanel(branch);
					for(var i = 0; i < branch.panel.children.length; i++){
						if(tools.hasClass(branch.panel.children[i], 'mui-item') ){		newBranch = branch.panel.children[i];		break; }
					}
					if(newBranch)				select(newBranch)	
				}
			}
			if(kc == 13){
				if(branch.panel){
					openPanel(branch);
					for(var i = 0; i < branch.panel.children.length; i++){
						if(tools.hasClass(branch.panel.children[i], 'mui-item') ){		newBranch = branch.panel.children[i];		break; }
					}
					if(newBranch)				select(newBranch);
				} else if(branch.func){
					branch.func();
					if(main.close)				main.close();
					close();
				}
			}
		}
		if( kc == 27 )							close();
	}
}