function logic_ui(options){

	var _main;

	var _logic;
	var _canvas;
	var _edit;

	var size;
	var setting;
	var functions;

	var delay = 5;

	//temp variable;
	var defWidth = 60;
	var defHeight = 30;
	var defType = "OR";

	var svgPlus = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 32 32" xml:space="preserve"><path class="log-s-fill" d="M 7,14.25 L 27,14.25 L 27,19.75 L 7,19.75 z" /><path class="log-s-fill" d="M 14.25,7 L 14.25,27 L 19.75,27 L 19.75,7 z" /></svg>';
	var svgMinus = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 32 32" xml:space="preserve"><path class="log-s-fill" d="M 7,14.25 L 27,14.25 L 27,19.75 L 7,19.75 z" /></svg>';
	var svgCenter = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 32 32" xml:space="preserve"><circle class="log-s-back" transform="translate(16,16)" stroke-width="2" r="11" /><circle class="log-s-fill" transform="translate(16,16)" r="7" /><path class="log-s-fill" d="M 0,15 L 6,15 L 6,17 L 0,17 z" /><path class="log-s-fill" d="M 15,0 L 15,6 L 17,6 L 17,0 z" /><path class="log-s-fill" d="M 32,15 L 26,15 L 26,17 L 32,17 z" /><path class="log-s-fill" d="M 15,32 L 15,26 L 17,26 L 17,32 z" /></svg>';
	var svgSwap = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve"><path class="log-s-fill" d="M 3,10 L 15,2 L 15,7 L 27,7 L 27,13 L 15,13 L 15,18 z" /><path class="log-s-fill" d="M 29,22 L 17,30 L 17,25 L 5,25 L 5,19 L 17,19 L 17,14 z" /></svg>';

	var svgChange = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 459 459" style="enable-background:new 0 0 459 459;" xml:space="preserve"><circle class="log-s-color" transform="translate(229.5,229.5)" r="90" /><path class="log-s-fill" d="M0,229.5c0,56.1,22.95,107.1,61.2,142.8L0,433.5h153v-153l-56.1,56.1C68.85,311.1,51,272.85,51,229.5	c0-66.3,43.35-122.4,102-145.35v-51C66.3,56.1,0,135.15,0,229.5z M459,25.5H306v153l56.1-56.1	c28.051,25.5,45.9,63.75,45.9,107.1c0,66.3-43.35,122.4-102,145.35V428.4c86.7-22.95,153-102,153-196.351	c0-56.1-22.95-107.1-61.2-142.8L459,25.5z"/></svg>';
	var svgNot = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 459 459" style="enable-background:new 0 0 459 459;" xml:space="preserve"><path class="log-s-fill" d="M0,229.5c0,56.1,22.95,107.1,61.2,142.8L0,433.5h153v-153l-56.1,56.1C68.85,311.1,51,272.85,51,229.5	c0-66.3,43.35-122.4,102-145.35v-51C66.3,56.1,0,135.15,0,229.5z M459,25.5H306v153l56.1-56.1	c28.051,25.5,45.9,63.75,45.9,107.1c0,66.3-43.35,122.4-102,145.35V428.4c86.7-22.95,153-102,153-196.351	c0-56.1-22.95-107.1-61.2-142.8L459,25.5z"/><path class="log-s-color" d=" M204,255h51V102h-51V255z M204,357h51v-51h-51V357z "/></svg>';

	var svgAddPrev = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve"><path class="log-s-fill" d="M 3,3 L 13,3 L 13,13 L 3,13 L 5,11 L 11,11 L 11,5 L 5,5 L 5,11 L 3,13  z" /><path class="log-s-fill" d="M 21,21 L 31,21 L 31,11 L 21,11 L 23,13 L 29,13 L 29,19 L 23,19 L 23,13 L 21,11  z" /><path class="log-s-plus" d="M 1,23 L 13,23 L 13,27 L 1,27 z" /><path class="log-s-plus" d="M 5,19 L 9,19 L 9,31 L 5,31 z" /><path class="log-s-fill" d="M 14,7.5  L 17.5,7.5  L 17.5,14.5 L 19,14.5 L 19,15.5 L 16.5,15.5 L 16.5,8.5  L 14,8.5 z" /><path class="log-s-fill" d="M 14,25.5 L 17.5,25.5 L 17.5,17.5 L 19,17.5 L 19,16.5 L 16.5,16.5 L 16.5,24.5 L 14,24.5 z" /></svg>';
	var svgAddNext = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve"><path class="log-s-fill" d="M 3,3 L 13,3 L 13,13 L 3,13 L 5,11 L 11,11 L 11,5 L 5,5 L 5,11 L 3,13  z" /><path class="log-s-fill" d="M 3,29 L 13,29 L 13,19 L 3,19 L 5,21 L 11,21 L 11,27 L 5,27 L 5,21 L 3,19  z" /><path class="log-s-plus" d="M 19,13 L 31,13 L 31,17 L 19,17 z" /><path class="log-s-plus" d="M 23,9 L 27,9 L 27,21 L 23,21 z" /><path class="log-s-fill" d="M 14,7.5  L 16.5,7.5  L 16.5,13.5 L 18,13.5 L 18,14.5 L 15.5,14.5 L 15.5,8.5  L 14,8.5 z" /><path class="log-s-fill" d="M 14,24.5 L 16.5,24.5 L 16.5,16.5 L 18,16.5 L 18,15.5 L 15.5,15.5 L 15.5,23.5 L 14,23.5 z" /></svg>';
	var svgRemove = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve"><path class="log-s-fill" d="M 3,3 L 13,3 L 13,13 L 3,13 L 5,11 L 11,11 L 11,5 L 5,5 L 5,11 L 3,13  z" /><path class="log-s-fill" d="M 3,29 L 13,29 L 13,19 L 3,19 L 5,21 L 11,21 L 11,27 L 5,27 L 5,21 L 3,19  z" /><path class="log-s-remove" d="M 18,12 L 28,22 L 30,20 L 20,10 z" /><path class="log-s-remove" d="M 30,12 L 20,22 L 18,20 L 28,10 z" /><path class="log-s-fill" d="M 14,7.5  L 16.5,7.5  L 16.5,14.5 L 19,14.5 L 19,15.5 L 15.5,15.5 L 15.5,8.5  L 14,8.5 z" /><path class="log-s-fill" d="M 14,24.5 L 16.5,24.5 L 16.5,17.5 L 19,17.5 L 19,16.5 L 15.5,16.5 L 15.5,23.5 L 14,23.5 z" /></svg>';
	var svgRemoveAll = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve"><path class="log-s-remove" d="M 4,2 L 14,12 L 12,14 L 2,4 z" /><path class="log-s-remove" d="M 4,14 L 14,4 L 12,2 L 2,12 z" /><path class="log-s-remove" d="M 4,18 L 14,28 L 12,30 L 2,20 z" /><path class="log-s-remove" d="M 4,30 L 14,20 L 12,18 L 2,28 z" /><path class="log-s-remove" d="M 18,12 L 28,22 L 30,20 L 20,10 z" /><path class="log-s-remove" d="M 30,12 L 20,22 L 18,20 L 28,10 z" /><path class="log-s-fill" d="M 12,7.5  L 16.5,7.5  L 16.5,14.5 L 19,14.5 L 19,15.5 L 15.5,15.5 L 15.5,8.5  L 12,8.5 z" /><path class="log-s-fill" d="M 12,24.5 L 16.5,24.5 L 16.5,17.5 L 19,17.5 L 19,16.5 L 15.5,16.5 L 15.5,23.5 L 12,23.5 z" /></svg>';

	var link = this;
	var fragment = document.createDocumentFragment();

	link.create = function(options){
		if(!options)						options = {};
		if(_logic)							link.remove();

		if(options.parent == undefined)		options.parent = null;

		functions = {};
		setting = {};
		size = { dpi: 1, scale: 1 };

		create.main();
		create.canvas();
		create.edit();
		create.logic();

		window.addEventListener('resize', display.generate);

		link.change(options);	
	}
	link.change = function(options){
		if(!options)						options = {};

		if(options.parent !== undefined)	change.parent(options);
		if(options.tree !== undefined)		build.setLogic(options.tree);

		build.rebuild();
	}
	link.remove = function(options){
	}

	link.test = function(){
		 return _main;
	}


	var events = {
		move: {
			canvas: function(e){
				var node = get.branchByCoord(e);
				if(node){
										_canvas.html.draggable = true;
				} else					_canvas.html.draggable = false;
			}
		},
		click: {
			navigation: {
				plus: function(){
					scroll.scale(0.2);
					display.canvas();
				},
				minus: function(){
					scroll.scale(-0.2);
					display.canvas();
				},
				center: function(){
					display.s.l = - (display.s.lp[0] + display.s.lp.last())/2 + display.s.vw/2;
					display.s.t = - (display.s.tp[0] + display.s.tp.last())/2 + display.s.vh/2;
					display.canvas();
				},
				swap: function(){

				}
			},
			controls: {
				addPrev: function(e){
					if( tools.closest( e.target, 'log-n-but') ){
						var items = select.items.concat();
						select.removeAll();

						for(var i = 0; i < items.length; i++)
							select.add(change.tree.addPrev(items[i]));
						build.rebuild();
					}
				},
				addNext: function(e){
					var parents = [];
					for(var i = 0; i < select.items.length; i++){
						if(!parents.has(select.items[i].parent)) parents.push(select.items[i].parent);
					}
					for(var i = 0; i < parents.length; i++){
							change.tree.addNext(parents[i]);
					}
					build.rebuild();
				},
				removeAll: function(e){
					if( tools.closest( e.target, 'log-n-but') ){
						var items = select.items.concat();
						select.removeAll();
						
						if(items[0] == _logic.ahead[0])	items = _logic.ahead[0].children.concat(); 
	
						for(var i = 0; i < items.length; i++){
							change.tree.removeAll(items[i]);
						}
						build.rebuild();
					}
				},
				remove: function(e){
					if( tools.closest( e.target, 'log-n-but') ){
						var items = select.items.concat();
						for(var i = 0; i < items.length; i++)
							change.tree.remove(items[i])
						build.rebuild();
					}	
				},
				change: function(e){
					if( tools.closest( e.target, 'log-n-but') ){
						for(var i = 0; i < select.items.length; i++)
							change.tree.change(select.items[i])
						build.rebuild();
					}		
				},
				not: function(e){
					if( tools.closest( e.target, 'log-n-but') ){
						for(var i = 0; i < select.items.length; i++)
							change.tree.not(select.items[i])
						build.rebuild();
					}		
				}
			}
		},
		down: {
			canvas: function(e){
				var node = get.branchByCoord(e);
				if(node)	dragdrop.down(e, node);
				else		scroll.down(e);
			}
		},
		wheel: {
			canvas: function(e){
				scroll.wheel(e);
			}
		},
		keydown: {
			main: function(e){
				var kc = e.keyCode;

				if(kc == 46 && select.items.length != 0){
					var items = select.items.concat();
					select.removeAll();
					
					if(items[0] == _logic.ahead[0])	items = _logic.ahead[0].children.concat(); 

					for(var i = 0; i < items.length; i++){
						change.tree.removeAll(items[i]);
					}
					build.rebuild();
				}
				if(kc == 192){
					for(var i = 0; i < select.items.length; i++)
						change.tree.change(select.items[i])
					build.rebuild();
				}
				if(kc == 187){
					var parents = [];
					for(var i = 0; i < select.items.length; i++){
						if(!parents.has(select.items[i].parent)) parents.push(select.items[i].parent);
					}
					for(var i = 0; i < parents.length; i++){
							change.tree.addNext(parents[i]);
					}
					build.rebuild();
				}
			}
		}
	}

	var get = {
		branchByCoord: function(e){
			var x = (e.pageX - _canvas.coords.left)*(size.dpi/size.scale) - display.s.l;
			var y = (e.pageY - _canvas.coords.top )*(size.dpi/size.scale) - display.s.t;

			var result;

			function findBrunch(node){
				if(	node.top - defHeight/2 <= y &&
					node.top + defHeight/2 >= y &&
					display.s.lp[node.lvl] <= x &&
					display.s.lp[node.lvl] + defWidth >= x)
					result = node;
				if(node.children){
					for(var i = 0; i < node.children.length; i++)
						findBrunch(node.children[i]);
				}
			}
			for(var i = 0; i < _logic.ahead.children.length; i++)
				findBrunch(_logic.ahead.children[i]);

			return result;
		}
	}
	var set = {
	}

	var create = {
		main: function(){
			_main = { navigation: { }, controls: { } };
			_main.html = tools.createHTML({		tag: 'div',
												tabIndex: 0,
												onkeydown: events.keydown.main,
												className: 'log-main' });

			_main.navigation.html = tools.createHTML({ tag: 'div',
												parent: _main.html,
												style: 'right: 10px; height: 123px',
												className: 'log-panel'});
			_main.navigation.plus = tools.createHTML({ tag: 'div',
												style: 'top: 31px',
												className: 'log-n-but',
												onclick: events.click.navigation.plus,
												innerHTML:  '<div class="log-svg">' + svgPlus + '</div>',
												parent: _main.navigation.html });
			_main.navigation.center = tools.createHTML({ tag: 'div',
												className: 'log-n-but',
												onclick: events.click.navigation.center,
												style: 'top: 0',
												innerHTML: '<div class="log-svg">' + svgCenter + '</div>',
												parent: _main.navigation.html });
			_main.navigation.minus = tools.createHTML({ tag: 'div',
												className: 'log-n-but',
												onclick: events.click.navigation.minus,
												style: 'top: 62px',
												innerHTML: '<div class="log-svg">' + svgMinus + '</div>',
												parent: _main.navigation.html });
			_main.navigation.swap = tools.createHTML({ tag: 'div',
												className: 'log-n-but',
												style: 'top: 93px',
												innerHTML: '<div class="log-svg">' + svgSwap + '</div>',
												parent: _main.navigation.html });

			_main.controls.html  = tools.createHTML({ tag: 'div',
												parent: _main.html,
												style: 'right: 50px; height: 92px; width: 61px',
												className: 'log-panel'});
			_main.controls.change = tools.createHTML({ tag: 'div',
												style: 'bottom: 0;',
												onclick: events.click.controls.change,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgChange + '</div>',
												parent: _main.controls.html });
			_main.controls.not = tools.createHTML({ tag: 'div',
												style: 'bottom: 0; left: 31px',
												onclick: events.click.controls.not,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgNot + '</div>',
												parent: _main.controls.html });
			_main.controls.addNext = tools.createHTML({ tag: 'div',
												style: 'bottom: 31px; left: 0',
												onclick: events.click.controls.addNext,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgAddNext + '</div>',
												parent: _main.controls.html });
			_main.controls.addPrev = tools.createHTML({ tag: 'div',
												style: 'bottom: 31px; left: 31px',
												onclick: events.click.controls.addPrev,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgAddPrev + '</div>',
												parent: _main.controls.html });
			_main.controls.remove = tools.createHTML({ tag: 'div',
												style: 'bottom: 62px; left: 0',
												onclick: events.click.controls.remove,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgRemove + '</div>',
												parent: _main.controls.html });
			_main.controls.removeAll = tools.createHTML({ tag: 'div',
												style: 'bottom: 62px; left: 31px',
												onclick: events.click.controls.removeAll,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgRemoveAll + '</div>',
												parent: _main.controls.html });
		},
		canvas: function(){
			_canvas = _main._canvas = {};
			_canvas.html = tools.createHTML({	tag: 'canvas',
												parent: _main.html,
												className: 'log-canvas',
												onwheel: events.wheel.canvas,
												onmousemove: events.move.canvas,
												onmousedown: events.down.canvas });

			_canvas.html.ondragstart = dragdrop.start;
			_canvas.html.ondragover = dragdrop.over;
			_canvas.html.ondrop  = dragdrop.drop;
			_canvas.html.ondragend = dragdrop.end;
			_canvas.ctx = _canvas.html.getContext("2d");
		},
		edit: function(){
			_edit = _main._edit = {};
			_edit.html = tools.createHTML({		tag: 'div',
												parent: _main.html,
												className: 'log-edit' });
		},
		logic: function(){
			_logic = _main._logic = {};
			_logic.tails = [];
			_logic.ahead = { head: true, children: []};
		}
	}

	var change = {
		parent: function(options){
			setting.parent = options.parent;
			if(setting.parent){
				setting.parent.appendChild(_main.html);
			} else {
				fragment.appendChild(_main.html);
			}
		},
		tree: {
			addPrev: function(item){
				if(item.type){
					var result = {type: 1, text: defType, parent: item};
					item.children.push(result);
					return result;
				} else {
					var result = {type: 1, text: defType, parent: item.parent};
					item.parent.children.push(result);
					return result;
				}	
			},
			addNext: function(item){
				var node = { type: 1, text: 'AND', children: [], parent: item };
				var index = 0;
				for(var j = item.children.length - 1; j >= 0; j--){
					if(item.children[j].select){
						index = j;
						node.children.splice(0, 0, item.children[j]);
						item.children[j].parent = node;
						item.children.splice(j, 1);
					}
				}
				item.children.splice(index, 0, node);
				select.add(node);
			},
			removeAll: function(item){
				for(var j = 0; j < item.parent.children.length; j++ ){
					if(item.parent.children[j] == item){
						item.parent.children.splice(j, 1);
						if(!item.parent.children.length && !item.parent.head)	item.parent.children = undefined;
						break;
					}
				}
			},
			remove: function(item){
				select.remove(item);
				var index;
				for(var i = 0; i < item.parent.children.length; i++){
					if(item.parent.children[i] == item) index = i;
				}
				item.parent.children.splice(index, 1);
				if(item.children){
					for(var j = 0; j < item.children.length; j++){
						item.children[j].parent = item.parent;
						item.parent.children.splice(index + j, 0, item.children[j] );
						select.add(item.children[j] );
					}
				}
			},
			change: function(item){
				if(item.type){
					if(item.text == 'OR')	item.text = 'AND';
					else					item.text = 'OR';
				}
			},
			not: function(item){
				if(item.not){
					item.not = false;
				} else {
					item.not = true;
				}
			}
		}
	}

	var build = new function(){

		this.setLogic = function(tree){
			if(!Array.isArray(tree))		tree = [tree];

			create.logic();

			for(var i = 0; i < tree.length; i++){
				_logic.ahead.children.push( setBranch(tree[i], _logic.ahead) );
			}
		}
		function setBranch(tree, parent){
			var node = {};

			node.type = tree.type;
			node.text = tree.text;
			node.parent = parent;

			if(tree.children){
				node.children = [];

				for(var j = 0; j < tree.children.length; j++){
					node.children.push( setBranch(tree.children[j], node) );
				}
			}

			return node;
		}


		this.getDepthMod = function(tree){
			var result = 1;
			if(tree.children){
				var max = 0;
				for(var i = 0; i < tree.children.length; i++){
					var topical = build.getDepthMod(tree.children[i]);
					if(topical > max)		max = topical;
				}
				result += max;
			} else if(tree.type) {
				result += 1;
			}
			return result;
		}

		this.rebuild = function(){
			var lvls = _logic.lvls = build.getDepthMod(_logic.ahead) - 2;

			_logic.tails = [];

			for(var i = 0; i < _logic.ahead.children.length; i++){
				buildBranch( _logic.ahead.children[i], lvls);
			}

			display.s.lp = [];
			display.s.tp = [];

			for(var i = 0; i <= lvls; i++){
				display.s.lp[i] = 100*i;
			}
			for(var i = 0; i <= _logic.tails.length; i++){
				display.s.tp[i] = 50*i;
			}

			display.generate();
		}

		function buildBranch(node, lvl){
			var positions = 0;
			if(node.children){				
				node.lvl = lvl;
				for(var i = 0; i < node.children.length; i++){
					positions += buildBranch(node.children[i], lvl - 1);
				}
				positions = positions/node.children.length;
			} else {
				if(node.type){
					node.lvl = lvl;
				} else {
					node.lvl = 0;
				}

				node.i = _logic.tails.length;
				positions = node.i*50;
				_logic.tails.push(node);
			}
			node.top = positions;
			return positions;
		}	
	}

	var display = new function(){
		var s = this.s = {l: 50, t: 50 };

		this.generate = function(){

			var height = _main.html.clientHeight; //viewport height
			var width  = _main.html.clientWidth;//veiwport width

			s.h = height*size.dpi;
			s.w = width*size.dpi;

			if( (height < 0) || (width < 0) )	return;

			_canvas.html.width = s.w;
			_canvas.html.height =  s.h;
			_canvas.html.style.width = width + 'px';
			_canvas.html.style.height = height + 'px';

			s.vh = height*size.dpi/size.scale;
			s.vw = width*size.dpi/size.scale;

			_canvas.coords = _canvas.html.getBoundingClientRect();

			display.canvas();
		}

		this.canvas = function(){

			display.menu();

			var c = _canvas.ctx;

			c.fillStyle = '#FFFFFF';
			c.fillRect( 0, 0, s.w, s.h );
			c.shadowColor = "#8dc0f2";			
			c.shadowOffsetX = 0;
			c.shadowOffsetY = 0;

			function drowNode(node, parent, parallaxX, parallaxY){

				c.fillStyle = "#666666";
				if(node.select){
					c.shadowBlur = 10;
					c.fillStyle = '#358fe8';
				}
			
				c.fillRect(
						size.scale * (s.l + s.lp[node.lvl]),
						size.scale * (s.t + node.top - defHeight/2),
						size.scale * defWidth,
						size.scale * defHeight );

				c.shadowBlur = 0;				

				if(node.text == 'AND')		c.fillStyle = '#d0e8a0';
				else if(node.text =='OR')	c.fillStyle = '#add1f6';
				else						c.fillStyle = '#FFFFFF';
				c.fillRect(
						size.scale * (s.l + s.lp[node.lvl] + 1 ),
						size.scale * (s.t + node.top - defHeight/2 + 1 ),
						size.scale * (defWidth - 2),
						size.scale * (defHeight - 2) );
				if(node.not){
					c.fillStyle = '#ff3b3b';
					c.fillRect(
						size.scale * (s.l + s.lp[node.lvl] + defWidth - 3 ),
						size.scale * (s.t + node.top - defHeight/2 + 1 ),
						size.scale * (2),
						size.scale * (defHeight - 2) );
				}

				if(parent != undefined){
					c.strokeStyle = '#777777';
					if(parent.select)		c.strokeStyle = '#358fe8';

					c.beginPath();
					c.moveTo(
						size.scale * (s.l + s.lp[node.lvl] + 62.5),
						size.scale * (s.t + node.top + 0.5) );
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] - 24.5 - 3 * parallaxX) ,
						size.scale * (s.t + node.top + 0.5) );
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] - 24.5 - 3 * parallaxX),
						size.scale * (s.t + parent.top + 3 * parallaxY + 0.5) );					
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] - 2) ,
						size.scale * (s.t + parent.top + 3 * parallaxY + 0.5) );
					c.stroke();
				}

				c.fillStyle = '#000000';
				c.font = size.scale * 13 + 'px sans-serif';
				c.textAlign = "center";
				c.textBaseline = "middle";
				c.fillText(
						node.text,
						size.scale * (s.l + s.lp[node.lvl] + 30),
						size.scale * (s.t + node.top));

				if(node.children){
					for(var i = 0; i < node.children.length; i++){
						if(node.top > node.children[i].top)		var paralX = i;
						else									var paralX = node.children.length - i - 1;
			
						drowNode(node.children[i], node, paralX, i - (node.children.length - 1)/2 );
					}
				}
			}

			for(var i = 0; i < _logic.ahead.children.length; i++){
				drowNode(_logic.ahead.children[i]);
			}

		}

		this.menu = function(){
			if(select.items.length){
				if(select.items[0].not)					_main.controls.not.className = 'log-n-but log-n-not';
				else									_main.controls.not.className = 'log-n-but';

				if(select.items[0].text == "OR")		_main.controls.change.className = 'log-n-but log-n-green';
				else if(select.items[0].text == "AND")	_main.controls.change.className = 'log-n-but log-n-blue';
				else									_main.controls.change.className = 'log-n-but-inactive';

				_main.controls.addNext.className = 'log-n-but';
				_main.controls.addPrev.className = 'log-n-but';
				_main.controls.remove.className = 'log-n-but';
				_main.controls.removeAll.className = 'log-n-but';
			} else {
				_main.controls.change.className = 'log-n-but-inactive';
				_main.controls.not.className = 'log-n-but-inactive';
				_main.controls.addNext.className = 'log-n-but-inactive';
				_main.controls.addPrev.className = 'log-n-but-inactive';
				_main.controls.remove.className = 'log-n-but-inactive';
				_main.controls.removeAll.className = 'log-n-but-inactive';
			}
		}
	}

	var scroll = new function(){
		var s = this.s = {};
		var timer;

		this.down = function(e){
			s = this.s = {
				e: e,
				x: e.pageX,
				y: e.pageY,
				l: display.s.l,
				t: display.s.t,
				redrow: true,
				move: false
			}
			redrow();

			window.addEventListener("mousemove", move);
			window.addEventListener("mouseup", up);

		}

		function move(e){
			if(	!s.move && (
				Math.abs(e.pageX - s.e.pageX) > 3 ||
				Math.abs(e.pageY - s.e.pageY) > 3 ) ){
				s.move = true;
			}
			s.e = e;
			s.redrow = true;
		}

		function redrow(){
			if(s.redrow){
				display.s.l = s.l - (s.x - s.e.pageX)*(size.dpi/size.scale);
				display.s.t = s.t - (s.y - s.e.pageY)*(size.dpi/size.scale);
				display.canvas();
				s.redrow = false;
			}
			timer = setTimeout(redrow, delay);
		}

		function up(e){
			clearTimeout(timer);		timer = null;
			if(!s.move)					select.removeAll();

			display.canvas();

			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		}

		this.scale = function(des){
			if(size.scale + des < 0.2) 	return;
			display.s.l += -display.s.vw/2;
			display.s.t += -display.s.vh/2;

			display.s.vw = display.s.vw*(size.scale/(size.scale + des));
			display.s.vh = display.s.vh*(size.scale/(size.scale + des));

			display.s.l += +display.s.vw/2;
			display.s.t += +display.s.vh/2;

			size.scale += des;
		}

		this.wheel = function(e){
			var delta = (e.deltaY || -e.wheelDelta)/2;

			if(delta > 0){
				scroll.scale(-0.1);
			} else if(delta < 0) {
				scroll.scale(0.1);
			}

			display.canvas();
			tools.stopProp(e);
			return false;
		}
	}

	var select = new function(){
		var items = this.items = [];

		this.add = function(node){

			function addSel(node){
				if(node.select){
					for(var i = 0; i < items.length; i++){
						if(node == items[i]){
							items.splice(i, 1);
							break;
						}
					}
				}
				node.select = true;
				if(node.children){
					node.children.forEach(function(item){ addSel(item); });
				}
			}

			if(!node.select){
				node.select = true;
				items.push(node);
				if(node.children){
					node.children.forEach(function(item){ addSel(item); });
				}
			}
		}
		this.remove = function(node){

			function downSelect(node){
				node.select = false;
				if(node.children){
					node.children.forEach(function(item){ downSelect(item); });
				}
			}
			function upSelect(node){
				if(node.select){
					for(var i = 0; i < items.length; i++){
						if(node == items[i]){
							items.splice(i, 1);
							break;
						}
					}
					for(var i = 0; i < node.children.length; i++){
						if(node.children[i].select)	items.push(node.children[i]);
					}
					node.select = false;
					if(node.parent)	upSelect(node.parent);
				}				
			}


			if(node.select){
				for(var i = 0; i < items.length; i++){
					if(node == items[i]){
						items.splice(i, 1);
						break;
					}
				}
				node.select = false;
				if(node.children){
					node.children.forEach(function(item){ downSelect(item); });
				}
				if(node.parent)		upSelect(node.parent);
			}
		}
		this.removeAll = function(node){
			for(var i = items.length - 1; i >= 0 ; i--)
				select.remove(items[i]);
		}
	}

	var dragdrop = new function(){
		var s = this.s = {};

		this.down = function(e, node){
			this.s = s = { node: node, e: e}
			window.addEventListener('mouseup', up);
		}
		function up(e){
			var node = get.branchByCoord(e);
			if(node == s.node){
				if(e.ctrlKey){
					if(node.select)	select.remove(node);
					else			select.add(node);
				} else {
					select.removeAll();
					select.add(node);
				}
				display.canvas();		
			}
			this.s = s = { };
			window.removeEventListener('mouseup', up);
		}
	
		this.start = function(e) {
			function setUndrop(items){
				for(var i = 0; i < items.length; i++){
					items[i].undrop = true;
					if(items[i].children)		setUndrop(items[i].children);
				}
			}
			var branch = get.branchByCoord(e);
			if(!branch.select){
				select.removeAll();
				select.add(branch);
			}

			setUndrop(select.items);
			var avatar = tools.createHTML({tag: 'div', className: 'log-avatar', parent: _main.html, innerHTML: select.items[0].text });

			if(typeof functions.drag == 'function')				var text = functions.drag(e, items, link);
			else												var text = 'null';
			
			if(e.dataTransfer.setDragImage != undefined)		e.dataTransfer.setDragImage(avatar, -5, -5);
		  	e.dataTransfer.effectAllowed = 'copy';				e.dataTransfer.setData('text', text);

		  	window.customDrag = {avatar: avatar, input: link, log: true, items: select.items.concat() };

		  	display.canvas();
		  	tools.stopProp(e);
		}

		this.over = function(e){
			if(window.customDrag){
				var node = get.branchByCoord(e);

				if(node){
					if(node.undrop || !node.type)		return true;
					else								return false;
				} else									return false;
			}
			return true;
		}

		this.enter = function(e){
			if(window.customDrag){

			}
		}

		this.leave = function(e){
			if(window.customDrag){
				
			}
		}

		this.drop = function(e){

			if(e.preventDefault)	e.preventDefault();		tools.stopProp(e);

			if(window.customDrag){
				var brach = get.branchByCoord(e);
				if(!brach) brach = _logic.ahead;
				if(brach == undefined){}
				var items;

				if(window.customDrag.log){
					var items = window.customDrag.items;
					for(var i = 0; i < items.length; i++){
						change.tree.removeAll(items[i]);
					}
				} else {
					items = JSON.parse( e.dataTransfer.getData('text') );
				}

				if(!brach.children)	brach.children = [];
				for(var i = 0; i < items.length; i++){
					items[i].parent = brach;
					brach.children.push(items[i]);
				}
			}
			dragdrop.end();
			build.rebuild();
		}
	
		this.end = function(e){
			function unsetUndrop(items){
				for(var i = 0; i < items.length; i++){
					items[i].undrop = undefined;
					if(items[i].children)					unsetUndrop(items[i].children);
				}	
			}

			if(window.customDrag){
		  		if(window.customDrag.avatar.parentNode)		tools.destroyHTML(window.customDrag.avatar);
		  		unsetUndrop(window.customDrag.items);

		  		window.customDrag = undefined;
			}
		}
	}

	link.create(options);
}