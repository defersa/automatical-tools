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
	var _timer;
	var _fragment = document.createDocumentFragment();

	link.create = function(options){
		
		if(!options)		options = {};
		if(_ni)				link.remove();

		// default value
		if(options.min == undefined)		options.min = 0;
		if(options.max == undefined)		options.max = 1/0;
		if(options.step == undefined)		options.step = 1;
		if(options.value == undefined)		options.value = 0;
		if(options.value == undefined)		options.value = 0;
		if(options.ratio == undefined)		options.ratio = false;

		if(options.style == undefined)		options.style = 0;


		// create main object
		CREATE.ni();

		_setting = {};
		_functions = {};

		// apply initial values
		link.change(options);
	}

	link.change = function(options){
		if(!options)									options = {};

		if(options.parent !== undefined)				SET.parent(options);
		if(options.functions !== undefined)				SET.functions(options);
		if(options.style !== undefined)					SET.style(options);

		if(options.min !== undefined)					_setting.min = options.min;
		if(options.max !== undefined)					_setting.max = options.max;
		if(options.step !== undefined)					_setting.step = options.step;
		if(options.ratio !== undefined)					_setting.ratio = options.ratio;
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
				_setting.value += _setting.step * side;
				CHANGE.normalize();
			},
			down: function(side){
				var pressOnButton = function(side){
					EVENTS.button.click(side);
					_timer = setTimeout(function(){ pressOnButton(side) }, 50);
				}

				EVENTS.button.click(side);
				_timer = setTimeout(function(){ pressOnButton(side) }, 400);
				window.addEventListener("mouseup", EVENTS.button.up);
			},
			up: function(){
				clearTimeout(_timer);
				_timer = null;

				window.removeEventListener("mouseup", EVENTS.button.up);
			}
		},

		input: {
			input: function(e){

				var numbers = ['0','1','2','3','4','5','6','7','8','9'];
				var position = e.target.selectionStart;
				var text = _ni.html.input.value;
				var negativ = (text[0] == '-' && _setting.min < 0) ? true : false; 
				var value = negativ ? '-' : '';
	
				var len = text.length;

				if(_setting.ratio){
					numbers.push('.');
				}
	
	
				for(var i = 0; i < text.length; i++){
					if( numbers.indexOf( text[i] ) != -1 ){
						value += text[i];
					}
				}

				if(value == '.'){
					value = '0.';
				}

				value = value.replace(/\,/g,'.');
				value = value.replace(/\./,',');
				value = value.replace(/\./g,'');
				value = value.replace(/,/,'.');


				if(!(e.data == '.' && value[position - 1] == '.')){
					position = position - len + value.length;
				}
				var dot = (value[value.length - 1] == '.') ? true : false;
				var min = (value[0] == '-' && value.length == 1) ? true : false;
	
				_setting.value = parseFloat(value || 0);
				CHANGE.normalize();

				e.target.setSelectionRange( position, position);
				if(dot){
					e.target.value += '.';
					e.target.setSelectionRange( position + 1, position + 1);
				}
				if(min){
					e.target.value = '-';
				}
				if(value == ''){
					e.target.value = '';	
				}
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

				if(kc == 40){
					EVENTS.button.click(-1);

					tools.stopProp(e);
					return false;		
				}
				if(kc == 38){
					EVENTS.button.click(1);

					tools.stopProp(e);
					return false;		
				}
			},
			blur: function(e){
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
				innerHTML: '<div class="ni-arrow-t-inner"></div>',
				onmousedown: function(){	EVENTS.button.down(1);	}
			});

			_ni.html.arrows.b = tools.createHTML({
				tag: 'div',
				className: 'ni-arrow-b',
				parent: _ni.html.main,
				innerHTML: '<div class="ni-arrow-b-inner"></div>',
				onmousedown: function(){	EVENTS.button.down(-1);	}
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
		},
		style: function(options){
			if(options.style === 0){
				_ni.html.main.className = 'ni-main ni-style-0';
			} else if(options.style == 1){
				_ni.html.main.className = 'ni-main ni-style-1';
			} else if(options.style == 2){
				_ni.html.main.className = 'ni-main ni-style-2';
			}
		}
	}
	var CHANGE = {
		normalize: function(){
			var value = _setting.value;

			if(isNaN(value))			value = ( 0 > _setting.min) ? 0 : _setting.min;
			if(value < _setting.min)	value = _setting.min;
			if(value > _setting.max)	value = _setting.max;

			_setting.value = value;
			_ni.html.input.value = value;
		},
		value: function(value){

		}
	}

	link.create(options);
}