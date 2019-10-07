//
//	Created by Makarov Aleksand
//

//	Feaches:

//	Custom functions:

function numberinput_ui(options){

	var _ni;

	var _setting;
	var _functions;

	var link = this;
	var _fragment = document.createDocumentFragment();

	link.create = function(options){
		
		if(!options)		options = {};
		if(_ni)				link.remove();

		// default value
		if(options.min == undefined)		options.min = 0;
		if(options.max == undefined)		options.max = 1/0;
		if(options.step == undefined)		options.step = 0.5;
		if(options.value == undefined)		options.value = 0;


		// create main object
		CREATE.ni();

		_setting = {};
		_functions = {};

		// apply initial values
		link.change(options);
	}

	link.change = function(options){

		if(options.parent !== undefined)				SET.parent(options);
		if(options.functions !== undefined)				SET.functions(options);

		if(options.min !== undefined)					_setting.min = options.min;
		if(options.max !== undefined)					_setting.max = options.max;
		if(options.step !== undefined)					_setting.step = options.step;
		if(options.value !== undefined)					_setting.value = options.value;

		CHANGE.normalize();
	}

	link.remove = function(options){
		_functions = undefined;
		_setting = undefined;


		_ni = undefined;
	}

	link.get = function(){
		return _setting.value;
	}

	var EVENTS = {
		
		button: {
			click: function(side){
				_setting.value += _setting.step*side;
				CHANGE.normalize();
			}
		},
		input: {
			input: function(e){

				var numbers = ['0','1','2','3','4','5','6','7','8','9','.'];
				var position = e.target.selectionStart;
				var text = _ni.html.input.value;
				var value = '';
	
				var len = text.length;
	
	
				for(var i = 0; i < text.length; i++){
					if( numbers.indexOf( text[i] ) != -1 ){
						value += text[i];
					}
				}
				value = value.replace(/\,/g,'.');
				value = value.replace(/\./,',');
				value = value.replace(/\./g,'');
				value = value.replace(/,/,'.');
	
				console.log(e);

				if(!(e.data == '.' && value[position - 1] == '.')){
					position = position - len + value.length;
				}
	
				_ni.html.input.value = value;
	
				e.target.setSelectionRange( position, position);
			},
			key: function(e){
				var kc = e.keyCode;
				if(kc == 27){
					CHANGE.normalize();

					tools.stopProp(e);
					return false;
				}
				if(kc == 13){
					_setting.value = parseFloat(_ni.html.input.value);
					CHANGE.normalize();

					tools.stopProp(e);
					return false;
				}
			},
			blur: function(e){
				_setting.value = parseFloat(_ni.html.input.value);
				CHANGE.normalize();
			}
		}
	}

	var CREATE = {
		ni: function(){
			_ni = {};

			_ni.html = {};
			_ni.html.main = tools.createHTML({
				tag: 'div',
				className: 'ni-main',
				parent: _fragment
			})
			_ni.html.input = tools.createHTML({
				tag: 'input',
				className: 'ni-input',
				parent: _ni.html.main
			});

			_ni.html.input.onkeydown = EVENTS.input.key;
			_ni.html.input.oninput = EVENTS.input.input;
			_ni.html.input.onblur = EVENTS.input.blur;

			_ni.html.arrows = {};
			_ni.html.arrows.t = tools.createHTML({
				tag: 'div',
				className: 'ni-arrow-t',
				parent: _ni.html.main,
				innerHTML: '▲',
				onclick: function(){	EVENTS.button.click(1);	}
			});
			_ni.html.arrows.b = tools.createHTML({
				tag: 'div',
				className: 'ni-arrow-b',
				parent: _ni.html.main,
				innerHTML: '▼',				
				onclick: function(){	EVENTS.button.click(-1);	}
			});
		}
	}
	var SET = {
		parent: function(options){
			_setting.parent = options.parent;

			if(options.parent instanceof Node)
				options.parent.appendChild(_ni.html.main);
			else
				_fragment.appendChild(_ni.html.main)
		}
	}
	var CHANGE = {
		normalize: function(){
			var value = _setting.value;
			if(value < _setting.min)	value = _setting.min;
			if(value > _setting.max)	value = _setting.max;

			value = Math.round(value/_setting.step)*_setting.step;
			_setting.value = value;
			_ni.html.input.value = value;
		},
		value: function(value){

		}
	}

	link.create(options);
}