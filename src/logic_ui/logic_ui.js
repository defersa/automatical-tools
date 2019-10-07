function logic_ui(options){

	var _main;

	var _logic;
	var _canvas;

	var size;
	var setting;
	var functions;

	var delay = 5;
	var leng = 4;
	var timer;

	//temp variable;
	var defWidth = 100;
	var defHeight = 26;
	var defType = "AND";

	var svgPlus = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 32 32" xml:space="preserve"><path class="log-s-fill" d="M 7,14.25 L 27,14.25 L 27,19.75 L 7,19.75 z" /><path class="log-s-fill" d="M 14.25,7 L 14.25,27 L 19.75,27 L 19.75,7 z" /></svg>';
	var svgMinus = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 32 32" xml:space="preserve"><path class="log-s-fill" d="M 7,14.25 L 27,14.25 L 27,19.75 L 7,19.75 z" /></svg>';
	var svgCenter = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 32 32" xml:space="preserve"><circle class="log-s-back" transform="translate(16,16)" stroke-width="2" r="11" /><circle class="log-s-fill" transform="translate(16,16)" r="7" /><path class="log-s-fill" d="M 0,15 L 6,15 L 6,17 L 0,17 z" /><path class="log-s-fill" d="M 15,0 L 15,6 L 17,6 L 17,0 z" /><path class="log-s-fill" d="M 32,15 L 26,15 L 26,17 L 32,17 z" /><path class="log-s-fill" d="M 15,32 L 15,26 L 17,26 L 17,32 z" /></svg>';
	var svgSwap = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve"><path class="log-s-fill" d="M 3,10 L 15,2 L 15,7 L 27,7 L 27,13 L 15,13 L 15,18 z" /><path class="log-s-fill" d="M 29,22 L 17,30 L 17,25 L 5,25 L 5,19 L 17,19 L 17,14 z" /></svg>';
	var svgMax = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 32 32" xml:space="preserve"><path class="log-s-fill"  d="M28,2h-6c-1.104,0-2,0.896-2,2s0.896,2,2,2h1.2l-4.6,4.601C18.28,10.921,18,11.344,18,12c0,1.094,0.859,2,2,2  c0.641,0,1.049-0.248,1.4-0.6L26,8.8V10c0,1.104,0.896,2,2,2s2-0.896,2-2V4C30,2.896,29.104,2,28,2z M12,18  c-0.641,0-1.049,0.248-1.4,0.6L6,23.2V22c0-1.104-0.896-2-2-2s-2,0.896-2,2v6c0,1.104,0.896,2,2,2h6c1.104,0,2-0.896,2-2  s-0.896-2-2-2H8.8l4.6-4.601C13.72,21.079,14,20.656,14,20C14,18.906,13.141,18,12,18z"/></svg>';

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

		if(options.parent == undefined)			options.parent = null;
		if(options.orientation == undefined)	options.orientation = 0;
		if(options.variableWidth == undefined)	options.variableWidth = 150;
		if(options.tree == undefined)			options.tree = [];

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
		if(!options)							options = {};

		if(options.parent !== undefined)		change.parent(options);
		if(options.functions !== undefined)		change.functions(options);

		if(options.navigation !== undefined)	change.navigation(options);
		if(options.controls !== undefined)		change.controls(options);

		if(options.orientation !== undefined)	setting.orientation = options.orientation;
		if(options.scale !== undefined)			size.scale = options.scale;
		if(options.dpi !== undefined)			size.dpi = options.dpi;
		if(options.variableWidth !== undefined)	size.variableWidth = options.variableWidth;

		if(options.tree !== undefined)			build.setLogic(options.tree);

		build.rebuild();
	}
	link.remove = function(options){
		tools.destroyHTML(_main.html);
		_main = undefined;
		_canvas = undefined;
		_logic = undefined;
		size = undefined;
		setting = undefined;
		functions = undefined;
		window.removeEventListener('resize', display.generate);
	}

	link.setTree = function(tree){
		build.setLogic(tree);
		build.rebuild();
	}
	link.getTree = function(){
		function getTree(item){
			var node = {text: item.text, not: item.not, type: item.type, customText: item.customText }
			if(item.children){
				node.children = [];
				for(var j = 0; j < item.children.length; j++){
					node.children.push(getTree(item.children[j]));
				}
			}
			return node;
		}
		var result = [];
		for(var i = 0; i < _logic.ahead.children.length; i++){
			result.push(getTree(_logic.ahead.children[i]));
		}
		return result;
	}
	link.getSelected = function(){
		return select.items.concat();
	}
	link.clearSelect = function(){
		select.removeAll();
	}
	link.test = function(){
		 return _main;
	}

	link.showAll = function(){		actions.showAll();	}
	link.center = function(){		actions.center();	}
	link.addPrev = function(){		actions.addPrev();	}
	link.addNext = function(){		actions.addNext();	}
	link.removeItem = function(){	return actions.remove(); }
	link.changeType = function(){	actions.change();	}
	link.not = function(){			actions.not();		}
	link.removeItems = function(items){
		if(!Array.isArray(items))	items = [items];
		for(var i = 0; i < items.length; i++)
			change.tree.removeAll(items[i]);
		build.rebuild();
		return items;
	}

	var actions = {
		showAll: function(){
			if(!_logic.tails.last()) return;
			var height = _logic.tails.last().top + 40;
			if(setting.orientation)		var width = display.s.lp[0] + _logic.width[0] + 40;
			else						var width = display.s.lp.last() + _logic.width.last() + 40;

			var dh = Math.floor((display.s.h*size.dpi*10)/height)/10;
			var dw = Math.floor((display.s.w*size.dpi*10)/width)/10;

			if(dh < dw)		scroll.scale(dh - size.scale);
			else			scroll.scale(dw - size.scale);

			actions.center();
		},
		center: function(){
			if(!_logic.tails.last()) return;
			display.s.l = - ((setting.orientation) ? (display.s.lp[0] + _logic.width[0]) : (display.s.lp.last() + _logic.width.last()))/2 + display.s.vw/2;
			display.s.t = - (_logic.tails.last().top)/2 + display.s.vh/2;
			display.canvas();
		},
		addPrev: function(e){
			var items = select.items.concat();
			select.removeAll();

			for(var i = 0; i < items.length; i++)
				select.add(change.tree.addPrev(items[i]));
			build.rebuild();
		},
		addNext: function(e){
			var parents = [];
			for(var i = 0; i < select.items.length; i++){
				if(!parents.has(select.items[i].parent)) parents.push(select.items[i].parent);
			}
			for(var i = 0; i < parents.length; i++)				change.tree.addNext(parents[i]);
			build.rebuild();
		},
		removeAll: function(e){
			var items = select.items.concat();
			select.removeAll();
			
			if(items[0] == _logic.ahead[0])						items = _logic.ahead[0].children.concat(); 
			for(var i = 0; i < items.length; i++)				change.tree.removeAll(items[i]);
			build.rebuild();
			return items;
		},
		remove: function(e){
			var items = select.items.concat();
			for(var i = 0; i < items.length; i++)				change.tree.remove(items[i])
			build.rebuild();
			return items;
		},
		change: function(e){
			for(var i = 0; i < select.items.length; i++)		change.tree.change(select.items[i])
			build.rebuild();
		},
		not: function(e){
			for(var i = 0; i < select.items.length; i++)		change.tree.not(select.items[i])
			build.rebuild();
		}
	}

	var events = {
		move: {
			canvas: function(e){
				var node = get.branchByCoord(e);
				var title = get.branchForTitle(e) || {};
				var corn = get.corn(e);

				if(title.title)			_canvas.html.title = title.title;
				else					_canvas.html.title = '';

				if(corn)				_canvas.html.style.cursor = 'e-resize';
				else					_canvas.html.style.cursor = '';

				if(node && !corn)		_canvas.html.draggable = true;
				else					_canvas.html.draggable = false;
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
					actions.center();
				},
				swap: function(){
					setting.orientation = !setting.orientation;
					build.rebuild();
				},
				max: function(){
					actions.showAll();
				}
			},
			controls: {
				addNext:	function(e){			actions.addNext();		},
				addPrev:	function(e){			if( tools.closest( e.target, 'log-n-but') )			actions.addPrev();		},
				removeAll:	function(e){			if( tools.closest( e.target, 'log-n-but') )			actions.removeAll();	},
				remove:		function(e){			if( tools.closest( e.target, 'log-n-but') )			actions.remove();		},
				change:		function(e){			if( tools.closest( e.target, 'log-n-but') )			actions.change();		},
				not:		function(e){			if( tools.closest( e.target, 'log-n-but') )			actions.not();			}
			}
		},
		dbl: {
			canvas: function(e){
				var node = get.branchByCoord(e);
				if(typeof functions.dbl == 'function')	functions.dbl(e, link, node);
			}
		},
		oncontext: {
			canvas: function(e){
				var node = get.branchByCoord(e);
				if(typeof functions.right == 'function'){
					if(!select.items.has(node)){
						select.removeAll();
						select.add(node);
					}
					functions.right(e, link, node);
					tools.stopProp(e);
					return false;
				}
			}
		},
		down: { 
			canvas: function(e){
				if(e.which != 1) return;
				var node = get.branchByCoord(e);
				var corn = get.corn(e);

				if(corn){
					resize.down(e);
					return;
				}

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
				if(kc == 192 && e.ctrlKey && e.shiftKey){
					console.log(link.test());
				}
				if(kc == 46 || kc == 192 || kc == 187){
					tools.stopProp(e);
					return false;
				}
			}
		}
	}

	var get = {
		branchForTitle: function(e){
			var x = (e.pageX - _canvas.coords.left)*(size.dpi/size.scale) - display.s.l;
			var y = (e.pageY - _canvas.coords.top )*(size.dpi/size.scale) - display.s.t;

			if(display.s.lp[0] <= x && display.s.lp[0] + _logic.width[0] >= x){
				for(var i = 0; i < _logic.tails.length; i++){
					if(	_logic.tails[i].top - defHeight/2 <= y &&
						_logic.tails[i].top + defHeight/2 >= y )
						return _logic.tails[i];
				}
			}
			var result;
			function findBrunch(node){
				if(	node.type &&
					node.top + defHeight/2 <= y &&
					node.bottom >= y &&
					display.s.lp[node.lvl] <= x &&
					display.s.lp[node.lvl] + _logic.width[node.lvl] >= x)
					result = node;
				if(node.children){
					for(var i = 0; i < node.children.length; i++)
						findBrunch(node.children[i]);
				}
			}
			for(var i = 0; i < _logic.ahead.children.length; i++)
				findBrunch(_logic.ahead.children[i]);

			return result;
		},
		branchByCoord: function(e){
			var x = (e.pageX - _canvas.coords.left)*(size.dpi/size.scale) - display.s.l;
			var y = (e.pageY - _canvas.coords.top )*(size.dpi/size.scale) - display.s.t;

			var result;

			function findBrunch(node){
				if(	node.top - defHeight/2 <= y &&
					node.top + defHeight/2 >= y &&
					display.s.lp[node.lvl] <= x &&
					display.s.lp[node.lvl] + _logic.width[node.lvl] >= x)
					result = node;
				if(node.children){
					for(var i = 0; i < node.children.length; i++)
						findBrunch(node.children[i]);
				}
			}
			for(var i = 0; i < _logic.ahead.children.length; i++)
				findBrunch(_logic.ahead.children[i]);

			return result;
		},
		corn: function(e){
			var result = false;
			var x = (e.pageX - _canvas.coords.left)*(size.dpi/size.scale) - display.s.l;
			var y = (e.pageY - _canvas.coords.top )*(size.dpi/size.scale) - display.s.t;
			for(var i = 0; i < _logic.tails.length; i++){

				if(	_logic.tails[i].top - defHeight/2 < y && 
					_logic.tails[i].top + defHeight/2 > y &&
					(display.s.lp[0] + _logic.width[0] - 4) < x &&
					(display.s.lp[0] + _logic.width[0] + 4) > x ){
					result = true;
					break;
				}
			}
			return result;
		}
	}

	var create = {
		main: function(){
			_main = { navigation: { }, controls: { }, display: display, select: select };
			_main.html = tools.createHTML({		tag: 'div',
												tabIndex: 0,
												onkeydown: events.keydown.main,
												className: 'log-main' });
		},
		canvas: function(){
			_canvas = _main._canvas = {};
			_canvas.html = tools.createHTML({	tag: 'canvas',
												parent: _main.html,
												className: 'log-canvas',
												onwheel: events.wheel.canvas,
												onmousemove: events.move.canvas,
												onmousedown: events.down.canvas,
												ondblclick: events.dbl.canvas,
												oncontextmenu: events.oncontext.canvas	});

			_canvas.html.ondragstart = dragdrop.start;
			_canvas.html.ondragover = dragdrop.over;
			_canvas.html.ondrop  = dragdrop.drop;
			_canvas.html.ondragend = dragdrop.end;
			_canvas.ctx = _canvas.html.getContext("2d");
		},
		edit: function(){
			
			_main.navigation.html = tools.createHTML({ tag: 'div',
												parent: _main.html,
												style: 'right: 10px; height: 150px',
												className: 'log-panel'});
			_main.navigation.center = tools.createHTML({ tag: 'div',
												className: 'log-n-but',
												onclick: events.click.navigation.center,
												style: 'top: 0',
												innerHTML: '<div class="log-svg">' + svgCenter + '</div>',
												parent: _main.navigation.html });
			_main.navigation.max = tools.createHTML({ tag: 'div',
												className: 'log-n-but',
												onclick: events.click.navigation.max,
												style: 'top: 30px',
												innerHTML: '<div class="log-svg">' + svgMax + '</div>',
												parent: _main.navigation.html });
			_main.navigation.plus = tools.createHTML({ tag: 'div',
												style: 'top: 60px',
												className: 'log-n-but',
												onclick: events.click.navigation.plus,
												innerHTML:  '<div class="log-svg">' + svgPlus + '</div>',
												parent: _main.navigation.html });
			_main.navigation.minus = tools.createHTML({ tag: 'div',
												className: 'log-n-but',
												onclick: events.click.navigation.minus,
												style: 'top: 90px',
												innerHTML: '<div class="log-svg">' + svgMinus + '</div>',
												parent: _main.navigation.html });
			_main.navigation.swap = tools.createHTML({ tag: 'div',
												className: 'log-n-but',
												onclick: events.click.navigation.swap,
												style: 'top: 120px',
												innerHTML: '<div class="log-svg">' + svgSwap + '</div>',
												parent: _main.navigation.html });

			_main.controls.html  = tools.createHTML({ tag: 'div',
												parent: _main.html,
												style: 'right: 50px; height: 90px; width: 60px',
												className: 'log-panel'});
			_main.controls.change = tools.createHTML({ tag: 'div',
												style: 'bottom: 0;',
												onclick: events.click.controls.change,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgChange + '</div>',
												parent: _main.controls.html });
			_main.controls.not = tools.createHTML({ tag: 'div',
												style: 'bottom: 0; left: 30px',
												onclick: events.click.controls.not,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgNot + '</div>',
												parent: _main.controls.html });
			_main.controls.addNext = tools.createHTML({ tag: 'div',
												style: 'bottom: 30px; left: 0',
												onclick: events.click.controls.addNext,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgAddNext + '</div>',
												parent: _main.controls.html });
			_main.controls.addPrev = tools.createHTML({ tag: 'div',
												style: 'bottom: 30px; left: 30px',
												onclick: events.click.controls.addPrev,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgAddPrev + '</div>',
												parent: _main.controls.html });
			_main.controls.remove = tools.createHTML({ tag: 'div',
												style: 'bottom: 60px; left: 0',
												onclick: events.click.controls.remove,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgRemove + '</div>',
												parent: _main.controls.html });
			_main.controls.removeAll = tools.createHTML({ tag: 'div',
												style: 'bottom: 60px; left: 30px',
												onclick: events.click.controls.removeAll,
												className: 'log-n-but-inactive',
												innerHTML:  '<div class="log-svg">' + svgRemoveAll + '</div>',
												parent: _main.controls.html });
		},
		logic: function(){
			_logic = _main._logic = {};
			_logic.tails = [];
			_logic.width = [size.variableWidth];
			_logic.ahead = { head: true, type: 1, children: []};
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
				var node = { type: 1, text: defType, children: [], parent: item };
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
			}, 
			clone: function(items){
				function clone(item, parent){
					var node = { text: item.text, not: item.not, type: item.type, customText: item.customText };
					if(parent)	node.parent = parent;
					if(item.children){
						node.children = [];
						for(var i = 0; i < item.children.length; i++){
							node.children.push(clone(item.children[i], node));
						}
					}
					return node;
				}

				var result = [];
				if(!Array.isArray(items))	items = [items];
				for(var i = 0; i < items.length; i++){
					result.push(clone(items[i]));
				}
				return result;
			}
		},
		functions: function(options){
			if(options.functions.click !== undefined)		functions.click = options.functions.click;
			if(options.functions.dbl !== undefined)			functions.dbl = options.functions.dbl;
			if(options.functions.right !== undefined)		functions.right = options.functions.right;
		},
		controls: function(options){
			if(options.controls)	_main.controls.html.style.display = 'block';
			else					_main.controls.html.style.display = 'none';
		},
		navigation: function(options){
			if(options.navigation)	_main.navigation.html.style.display = 'block';
			else					_main.navigation.html.style.display = 'none';
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
			node.customText = tree.customText;
			node.not = tree.not;
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
			var result = 0;
			if(tree.children){
				var max = 0;
				for(var i = 0; i < tree.children.length; i++){
					var topical = build.getDepthMod(tree.children[i]);
					if(topical > max)		max = topical;
				}
				result += max + 1;
			} else if(tree.type) {
				result += 1;
			}
			return result;
		}

		this.rebuild = function(){
			_logic.tails = [];
			_logic.linkLength = [];
			_logic.height = 0;

			for(var i = 0; i < _logic.ahead.children.length; i++){
				buildBranch( _logic.ahead.children[i] );
			}

			display.s.lp = [0];

			var lvl = build.getDepthMod(_logic.ahead);
			for(var i = 1; i < lvl; i++){
				_logic.width[i] = defWidth;
				if(setting.orientation)		display.s.lp.splice(0, 0 , display.s.lp[0] + defWidth + 12 + ((_logic.linkLength[lvl - i - 1] > 3) ? (Math.round(_logic.linkLength[lvl - i - 1]/2)*4) : 0))
				else						display.s.lp[i] = display.s.lp[i - 1] + _logic.width[i - 1] + 12 + ((_logic.linkLength[i - 1] > 3) ? (Math.round(_logic.linkLength[i - 1]/2)*4) : 0);
			}

			display.generate();
		}

		function buildBranch(node){
			var positions = 0;
			var bottomCorner;
			if(node.children){
				node.lvl = build.getDepthMod(node);
				for(var i = 0; i < node.children.length; i++){
					bottomCorner = buildBranch(node.children[i])
					positions += bottomCorner;
				}
				positions = positions/node.children.length;
				if(_logic.linkLength[node.lvl - 1] === undefined)				_logic.linkLength[node.lvl - 1] = 0;
				if(_logic.linkLength[node.lvl - 1] < node.children.length)		_logic.linkLength[node.lvl - 1] = node.children.length;
			} else {
				node.lvl = 1;

				_logic.height += ((node.parent.children[0] == node) ? 10 : 0);
				positions = _logic.height;
				bottomCorner = positions + defHeight;
				_logic.height += defHeight + ((node.parent.children.last() == node) ? 14 : 4);

				node.i = _logic.tails.length;
				_logic.tails.push(node);
			}

			if(node.type){
				node.displayedText = node.text;
				node.displayedCustomText = undefined;
				node.title = undefined;
				if(node.customText){
					_canvas.ctx.font = 10 + 'px sans-serif';
					node.displayedCustomText = cutText( node.customText, (defWidth - 12), Math.floor((bottomCorner - positions)/12), node );
				}
			} else {
				_canvas.ctx.font = 13 + 'px sans-serif';
				node.lvl = 0;
				node.displayedText = cutText( node.text, (_logic.width[0] - ((node.not) ? 34 : 4) ), 1, node )[0];
			}

			node.bottom = bottomCorner;
			node.top = positions;
			return positions;
		}
		function cutText(text, width, rows, tree){
			var textArray = [];
			tree.title = text;

			var fullWidth = _canvas.ctx.measureText(text).width;
			var aboutLength = (text.length) ? Math.floor( width / (fullWidth / text.length) ) : 0;

			for(var i = 0; i < rows; i++){
				var newLength = aboutLength;
				if(newLength < text.length){
					var bit = _canvas.ctx.measureText(text.substring(0, newLength)).width;
					while(bit > width){
						newLength--;
						bit = _canvas.ctx.measureText(text.substring(0, newLength)).width;
					}
					textArray.push( text.substring(0, newLength) );
					text = text.substring(newLength, text.length);
				} else {
					textArray.push( text );
					text = '';
					break;
				}
			}
			if(text.length > 0 && textArray.length > 0){
				textArray[textArray.length - 1] = textArray.last().substring(0, textArray.last().length - 2) + '...';
			} else {
				tree.title = undefined;
			}

			return textArray;
		}
	}

	var display = new function(){
		var s = this.s = {l: 50, t: 50 };

		this.generate = function(){

			var height = _main.html.clientHeight; //viewport height
			var width  = _main.html.clientWidth;  //veiwport width

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

			function drowNode(node, parent, index){

				c.fillStyle = "#999999";
				if(node.select){
					c.shadowBlur = 10;
					c.fillStyle = '#135ea8';
				}
			
				c.fillRect(
						size.scale * (s.l + s.lp[node.lvl]),
						size.scale * (s.t + node.top - defHeight/2),
						size.scale * _logic.width[node.lvl],
						size.scale * defHeight );

				c.shadowBlur = 0;
				c.font = size.scale * 13 + 'px sans-serif';
				c.textAlign = "center";
				c.textBaseline = "middle";

				if(node.text == 'AND')		c.fillStyle = '#cce5fe';
				else if(node.text =='OR')	c.fillStyle = '#e3fbb3';
				else						c.fillStyle = '#FFFFFF';

				var width = (node.not) ? (_logic.width[node.lvl] - 30) : (_logic.width[node.lvl]);
				var left = (setting.orientation && node.not) ? (s.l + s.lp[node.lvl] + 31) : (s.l + s.lp[node.lvl] + 1);
				var nleft = (setting.orientation && node.not) ? (s.l + s.lp[node.lvl] + 1) : (s.l + s.lp[node.lvl] + _logic.width[node.lvl] - 30);

				c.fillRect(
						size.scale * (left),
						size.scale * (s.t + node.top - defHeight/2 + 1 ),
						size.scale * (width - 2),
						size.scale * (defHeight - 2) );
				c.fillStyle = '#000000';
				c.fillText(
						node.displayedText,
						size.scale * (left + width/2),
						size.scale * (s.t + node.top));

				c.font = size.scale * 11 + 'px sans-serif';

				if(node.not){
					c.fillStyle = '#ffd8df';
					c.fillRect(
						size.scale * (nleft ),
						size.scale * (s.t + node.top - defHeight/2 + 1 ),
						size.scale * (29),
						size.scale * (defHeight - 2) );
					c.fillStyle = '#000000';
					c.fillText(
						"NOT",
						size.scale * (nleft + 15 ),
						size.scale * (s.t + node.top));
				}

				if(parent != undefined){
					drawLine(c, node, parent, index);
				}
		
				if(node.displayedCustomText){
					c.fillStyle = '#888888';
					c.font = (size.scale * 10) + 'px sans-serif';
					node.displayedCustomText.forEach( function(item, i){
						c.fillText(
							item,
							size.scale * (s.l + display.s.lp[node.lvl] + _logic.width[node.lvl]/2),
							size.scale * (s.t + node.top + defHeight/2 + 12*i + 7));
					});
				}

				if(node.children){
					for(var i = 0; i < node.children.length; i++){			
						drowNode(node.children[i], node, i );
					}
				}
			}

			for(var i = 0; i < _logic.ahead.children.length; i++){
				drowNode(_logic.ahead.children[i]);
			}
		}

		function drawLine(c, node, parent, index){
			if(parent.select)		c.strokeStyle = '#135ea8';
			else					c.strokeStyle = '#AAAAAA';
			c.beginPath();

			if(setting.orientation){
				if(parent.children.length > 1 && index == 0){
					c.moveTo(
						size.scale * (s.l + s.lp[node.lvl] - 2),
						size.scale * (s.t + node.top + 0.5) );	
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] + _logic.width[parent.lvl] - 2),
						size.scale * (s.t + node.top + 0.5) );
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] + _logic.width[parent.lvl] - 2),
						size.scale * (s.t + parent.top - defHeight/2 - 2) );

				} else if(parent.children.length > 1 && index == parent.children.length - 1){
					c.moveTo(
						size.scale * (s.l + s.lp[node.lvl] - 2),
						size.scale * (s.t + node.top + 0.5) );	
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] + _logic.width[parent.lvl] - 2),
						size.scale * (s.t + node.top + 0.5) );
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] + _logic.width[parent.lvl] - 2),
						size.scale * (s.t + parent.top + defHeight/2 + 2) );

				} else if(parent.children.length == 1){
					c.moveTo(
						size.scale * (s.l + s.lp[node.lvl] - 2),
						size.scale * (s.t + node.top + 0.5) );	
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl]  + _logic.width[parent.lvl] + 2),
						size.scale * (s.t + node.top + 0.5) );
				} else {
					var length = (parent.children.length > 1) ? (parent.children.length - 2) : (parent.children.length);
					if(defHeight/length > 4)			var paralY = ((defHeight + 1)*index)/(length + 1) - defHeight/2;
					else								var paralY = - 4*(length/2 - index) - 1.5;	
					if(parent.top > node.top)			var paralX = index;
					else								var paralX = length - index + 1;
					c.moveTo(
						size.scale * (s.l + s.lp[node.lvl] - 2),
						size.scale * (s.t + node.top + 0.5) );	
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] + _logic.width[parent.lvl] + 5 + 4 * paralX),
						size.scale * (s.t + node.top + 0.5) );
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] + _logic.width[parent.lvl] + 5 + 4 * paralX),
						size.scale * (s.t + parent.top + paralY) );					
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] + _logic.width[parent.lvl] + 2) ,
						size.scale * (s.t + parent.top + paralY) );
				}
			} else {
				if(parent.children.length > 1 && index == 0){
					c.moveTo(
						size.scale * (s.l + s.lp[node.lvl] + _logic.width[node.lvl] + 2),
						size.scale * (s.t + node.top + 0.5) );	
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] + 2),
						size.scale * (s.t + node.top + 0.5) );
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] + 2),
						size.scale * (s.t + parent.top - defHeight/2 - 2) );

				} else if(parent.children.length > 1 && index == parent.children.length - 1){
					c.moveTo(
						size.scale * (s.l + s.lp[node.lvl] + _logic.width[node.lvl] + 2),
						size.scale * (s.t + node.top + 0.5) );	
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] + 2),
						size.scale * (s.t + node.top + 0.5) );
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] + 2),
						size.scale * (s.t + parent.top + defHeight/2 + 2) );

				} else if(parent.children.length == 1){
					c.moveTo(
						size.scale * (s.l + s.lp[node.lvl] + _logic.width[node.lvl]+ 2),
						size.scale * (s.t + node.top + 0.5) );	
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] - 2),
						size.scale * (s.t + node.top + 0.5) );
				} else {
					var length = (parent.children.length > 1) ? (parent.children.length - 2) : (parent.children.length);
					if(defHeight/length > 4)			var paralY = ((defHeight + 1)*index)/(length + 1) - defHeight/2;
					else								var paralY = - 4*(length/2 - index) - 1.5;	
					if(parent.top + paralY > node.top)	var paralX = 4*index;
					else								var paralX = 4*(length - index + 1);
					c.moveTo(
						size.scale * (s.l + s.lp[node.lvl] + _logic.width[node.lvl] + 2),
						size.scale * (s.t + node.top + 0.5) );	
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] - 5 - paralX),
						size.scale * (s.t + node.top + 0.5) );
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] - 5 - paralX),
						size.scale * (s.t + parent.top + paralY) );					
					c.lineTo(
						size.scale * (s.l + s.lp[parent.lvl] - 2) ,
						size.scale * (s.t + parent.top + paralY) );
				}
			}
			c.stroke();
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
			if(!s.move){
				select.removeAll();
				if(typeof functions.click == 'function')	functions.click(e, link);
			}

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

		this.auto = function(){

			display.s.l += leng*s.ls;
			display.s.t += leng*s.ts;
			display.canvas();

			timer = setTimeout(scroll.auto,  delay*2);
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
			if(timer){
				clearTimeout(timer);
				timer = null;
			}

			var node = get.branchByCoord(e);
			if(node == s.node){

				if(e.shiftKey && select.shift){
					node = getLastLevel(node);
					var start = (node.i > select.shift.i) ? select.shift.i : node.i;
					var end = (node.i > select.shift.i) ? node.i : select.shift.i;
					select.removeAll();
					for(var i = start; i <= end; i++) select.add(_logic.tails[i]);
				} else {
					select.shift = getLastLevel(node); 
					if(e.ctrlKey){
						if(node.select)	select.remove(node);
						else			select.add(node);
					} else {
						select.removeAll();
						select.add(node);
					}
				}
				display.canvas();
				if(typeof functions.click == 'function')	functions.click(e, link, node);
			}
			this.s = s = { };
			window.removeEventListener('mouseup', up);
		}
		function getLastLevel(node){
			var lastNode = node;
			while( lastNode.children ){
				lastNode = lastNode.children[0];
			}
			return lastNode;
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
			
    		if(window.clipboardData){
    			var image = new Image();
    			image.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
				e.dataTransfer.setDragImage( image, -5, -5);
    		} else {
				e.dataTransfer.setDragImage( avatar, -5, -5);
    		}

		  	e.dataTransfer.effectAllowed = 'copy';
		  	e.dataTransfer.setData('text', text);

		  	window.customDragLogic = {avatar: avatar, input: link, log: true, items: select.items.concat() };

		  	display.canvas();
		  	tools.stopProp(e);
		}

		this.over = function(e){
			var node = get.branchByCoord(e);

			if( (_canvas.coords.left <= e.pageX && _canvas.coords.left + 10 >= e.pageX) ||
				(_canvas.coords.right >= e.pageX && _canvas.coords.right - 10 <= e.pageX) ||
				(_canvas.coords.top <= e.pageY && _canvas.coords.top + 10 >= e.pageY) ||
				(_canvas.coords.bottom >= e.pageY && _canvas.coords.bottom - 10 <= e.pageY)
			){
				if(_canvas.coords.left <= e.pageX && _canvas.coords.left + 10 >= e.pageX)			scroll.s.ls = +1;
				else if(_canvas.coords.right >= e.pageX && _canvas.coords.right - 10 <= e.pageX)	scroll.s.ls = -1;
				else																				scroll.s.ls = 0;

				if(_canvas.coords.top <= e.pageY && _canvas.coords.top + 10 >= e.pageY)				scroll.s.ts = +1;
				else if(_canvas.coords.bottom >= e.pageY && _canvas.coords.bottom - 10 <= e.pageY)	scroll.s.ts = -1;
				else																				scroll.s.ts = 0;

				if(!timer){
					scroll.auto();
				}
			} else {
				if(timer){
					clearTimeout(timer);
					timer = null;
				}
			}

			if(node){
				if(node.undrop)						return true;
				else								return false;
			} else									return false;
		}

		this.drop = function(e){

			if(e.preventDefault)	e.preventDefault();
			tools.stopProp(e);

			var branch = get.branchByCoord(e);
			if(!branch) branch = _logic.ahead;
			select.removeAll();

			if(window.customDragLogic){
				if(e.ctrlKey){
					var items = change.tree.clone(window.customDragLogic.items);
				} else {
					var items = window.customDragLogic.input.removeItems(window.customDragLogic.items);
				}
			} else {
				var items = JSON.parse( e.dataTransfer.getData('text') );
			}

			if(!branch.type){
				var nBranch = {type: 1, text: defType, parent: branch.parent, children: [branch]};
				for(var i = 0; i < branch.parent.children.length; i++){
					if(branch.parent.children[i] == branch){
						branch.parent.children.splice(i, 1, nBranch);
					}
				}
				branch = nBranch;
			}
			if(!branch.children)	branch.children = [];
			for(var i = 0; i < items.length; i++){
				items[i].parent = branch;
				branch.children.push(items[i]);
				select.add(items[i]);
			}

			dragdrop.end();
			build.rebuild();
		}
	
		this.end = function(e){
			function unsetUndrop(items){
				for(var i = 0; i < items.length; i++){
					items[i].undrop = undefined;
					if(items[i].children)						unsetUndrop(items[i].children);
				}	
			}

			if(window.customDragLogic){
		  		if(window.customDragLogic.avatar.parentNode)	tools.destroyHTML(window.customDragLogic.avatar);
		  		unsetUndrop(window.customDragLogic.items);

		  		window.customDragLogic = undefined;
			}
		}
	}

	var resize = new function(){
		var s;
		this.down = function(e){
			var html = tools.createHTML({tag: 'div', className: 'log-resize', parent: _main.html})
			s = {e: e, h: html}

			_canvas.html.draggable = false;
			window.addEventListener('mousemove', move);
			window.addEventListener('mouseup', up);
			move(e);
		}
		function move(e){
			s.h.style.left = (e.pageX - _canvas.coords.left) + 'px';
		}
		function up(e){

			_logic.width[0] = Math.round(_logic.width[0] + (e.pageX - s.e.pageX)*(size.dpi/size.scale) );
			if(_logic.width[0] < 60)			_logic.width[0] = 60;
			else if( _logic.width[0] > 500)		_logic.width[0] = 500;
			build.rebuild();

			tools.destroyHTML(s.h);
			s = undefined;

			window.removeEventListener('mousemove', move);
			window.removeEventListener('mouseup', up);
		}
	}

	link.create(options);
}