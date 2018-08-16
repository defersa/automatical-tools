function logic_ui(options){

	var _main;

	var _logic;
	var _canvas;
	var _edit;

	var size;
	var setting;
	var functions;

	var link = this;
	var fragment = document.createDocumentFragment();

	link.create = function(options){
		if(!options)						options = {};
		if(_logic)							link.remove();

		if(options.parent == undefined)		options.parent = null;

		functions = {};
		setting = {};
		size = { dpi: 1 };

		create.main();
		create.canvas();
		create.edit();
		create.logic();

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
		down: {
			canvas: function(e){

			}
		}	
	}

	var get = {

	}
	var set = {

	}


	var create = {
		main: function(){
			_main = {};
			_main.html = tools.createHTML({		tag: 'div',
												className: 'log-main' });
		},
		canvas: function(){
			_canvas = _main._canvas = {};
			_canvas.html = tools.createHTML({	tag: 'canvas',
												parent: _main.html,
												className: 'log-canvas',
												mousedown: events.down.canvas });
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
			_logic.ahead = [];
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
		}
	}

	var build = new function(){

		this.setLogic = function(tree){
			if(!Array.isArray(tree))		tree = [tree];

			for(var i = 0; i < tree.length; i++){
				_logic.ahead.push( setBranch(tree[i]) );
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
			var lvls = 0;
			for(var i = 0; i < _logic.ahead.length; i++){
				if( lvls < build.getDepthMod(_logic.ahead[i]) ) lvls = build.getDepthMod(_logic.ahead[i]);
			}
			_logic.lvls = lvls = lvls - 1;
			_logic.tails = [];

			for(var i = 0; i < _logic.ahead.length; i++){
				buildBranch( _logic.ahead[i], lvls);
			}

			display.s.lp = [];
			display.s.tp = [];

			for(var i = 0; i < lvls; i++){
				display.s.lp[i] = 200*i;
			}
			for(var i = 0; i < _logic.tails.length; i++){
				display.s.tp[i] = 100*i;
			}
		}

		function buildBranch(node, lvl){
			var positions = [];
			if(node.children){				
				node.lvl = lvl;
				for(var i = 0; i < node.children.length; i++){
					positions = positions.concat( buildBranch(node.children[i], lvl - 1) );
				}
			} else {
				if(node.type){
					node.lvl = lvl;
				} else {
					node.lvl = 0;
				}
				positions.push(_logic.tails.length)
				_logic.tails.push(node);
			}
			node.i = positions;
			return positions;
		}
	
	}

	var display = new function(){
		this.s = {l: 0, t:0 };

		this.generate = function(){

			var height = _canvas.html.clientHeight - y; //viewport height
			var width  = _canvas.html.clientWidth - x;//veiwport width

			s.vh = height*size.dpi;
			s.vw = width*size.dpi;

			if( (height < 0) || (width < 0) )	return;

			_canvas.html.width = s.vw;
			_canvas.html.height =  s.vh;
			_canvas.html.style.width = width + 'px';
			_canvas.html.style.height = height + 'px';

			_canvas.coords = _canvas.html.getBoundingClientRect();

			display.canvas();
		}

		this.canvas = function(){
			var c = _canvas.ctx;

			function drowNode(node){
				s
			}

		}
	}

	var select = new function(){
	
	}

	link.create(options);
}