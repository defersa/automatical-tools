function logic_ui(options){

	var _main;

	var _logic;
	var _canvas;
	var _edit;

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

		create.main();
		create.canvas();
		create.edit();

		link.change(options);	
	}
	link.change = function(options){
		if(!options)						options = {};

		if(options.parent !== undefined)	change.parent(options);
	}
	link.remove = function(options){
	}

	link.test = function(){
		console.log(_main);
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
			_logic.variable = [];
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

	var display = new function(){
		var s = {l: 0, t:0 };

		this.canvas = function(){

		}

	}

	var select = new function(){
	
	}

	link.create(options);
}