function slider_lib(options){

	var _slider;

	var _setting;
	var _functions;

	var link = this;
	var fragment = document.createDocumentFragment();

	link.create = function(options){
		if(_setting)	link.remove();
		if(!options)	options = {};

		if(options.startRange === undefined)	options.startRange = 0;
		if(options.endRange === undefined)		options.endRange = 10;
		if(options.orientation === undefined)	options.orientation = 0;
		if(options.value === undefined)			options.value = 0;

		CREATE.slider();

		_setting = {};
		_functions = {};

		link.change(options);
	}

	link.change = function(options){
		if(!options)	options = {};

		if(options.parent !== undefined)		CHANGE.parent(options);
		if(options.orientation !== undefined)	CHANGE.orientation(options);

		if(options.functions !== undefined)		CHANGE.functions(options);

		if(options.value !== undefined)			_slider.value = options.value;
		if(options.startRange !== undefined)	_slider.startRange = options.startRange;
		if(options.endRange !== undefined)		_slider.endRange = options.endRange;

		SLIDE.normalize();
	}

	link.remove = function(){

	}

	var CREATE = {
		slider: function(){
			_slider = {};
			
			_slider.startRange = 0;
			_slider.endRange = 10;
			_slider.value = 0;

			_slider.outside = tools.createHTML({
				tag: 'div',
				parent: fragment
			});			
			_slider.subs = tools.createHTML({
				tag: 'div',
				className: 'sl-subs',
				parent: _slider.outside
			});
			_slider.arm = tools.createHTML({
				tag: 'div',
				className: 'sl-arm',
				onmousedown: SLIDE.down,
				parent: _slider.subs
			});
		}
	}

	var CHANGE = {
		parent: function(options){
			_setting.parent = options.parent;
			if(_setting.parent instanceof Node){
				_setting.parent.appendChild(_slider.outside);
			} else {
				fragment.appendChild(_slider.outside);
			}
		},
		orientation: function(options){
			_setting.orientation = options.orientation;
			if(_setting.orientation){
				_slider.outside.className = 'sl-outside-v';
			} else {
				_slider.outside.className = 'sl-outside-h';
			}
		},
		functions: function(options){
			if(options.functions.change !== undefined)		_functions.change = options.functions.change;
		}
	}

	var SLIDE = new function(){
		var s;

		this.down = function(e){
			s = {};
			s.e = e;
			s.v = _slider.value;
			if(_setting.orientation)	s.length = _slider.subs.offsetHeight;
			else						s.length = _slider.subs.offsetWidth;

			window.addEventListener('mousemove', move);
			window.addEventListener('mouseup', up);
		}

		function move(e){
			var difference = e.pageX - s.e.pageX;
			if(_setting.orientation) difference = e.pageY - s.e.pageY;

			_slider.value = Math.round(s.v + (difference/(s.length - 20))*(_slider.endRange - _slider.startRange));
			SLIDE.normalize();

			if(typeof _functions.change == 'function'){
				_functions.change(_slider.value);
			}
		}

		function up(e){
			window.removeEventListener('mousemove', move);
			window.removeEventListener('mouseup', up);
		}

		this.normalize = function(){
			if(typeof _slider.startRange !== 'number')	_slider.startRange = 0;
			if(typeof _slider.endRange !== 'number')	_slider.endRange = 10;
			if(_slider.startRange > _slider.endRange)	[_slider.startRange, _slider.endRange] = [slider.endRange, _slider.startRange];
			if(typeof _slider.value !== 'number')		_slider.value = 0;
			if(_slider.value < _slider.startRange)		_slider.value = _slider.startRange;
			if(_slider.value > _slider.endRange)		_slider.value = _slider.endRange;

			drow();
		}

		function drow(){
			var position = ((_slider.value - _slider.startRange)/(_slider.endRange - _slider.startRange))*100;
			if(_setting.orientation)	_slider.arm.style.cssText = "top: " + position + '%; left: 0';
			else						_slider.arm.style.cssText = "left: " + position + '%; top: 0';	 
		}
	}

	link.create(options);
}