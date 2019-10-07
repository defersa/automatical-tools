function makar_kombat(options){

	var _main;
	var _size;

	var _setting;
	var _function;
	var _timer;
	var _fragment = document.createDocumentFragment();

	var self = this;

	this.create = function(options){

		if(_main)			self.remove();
		if(options.width == undefined)			options.width = 848;
		if(options.height == undefined)			options.height = 480;

		CREATE.main();
		CREATE.size();

		_setting = {
			keyMap: []
		};

		self.change(options);
	}

	this.change = function(options){
		if(!options)		options = {};

			console.log(options);
		if(options.parent !== undefined)		SET.parent(options);
		if(options.width || options.height)		SET.size(options);
		
		DISPLAY.start();

	}

	this.remove = function(){
		if(_main){

		}
	}

	var EVENTS = {
		keydown: function(e){
			_setting.keyMap[e.keyCode] = true;
		},
		keyup: function(e){
			_setting.keyMap[e.keyCode] = false;
		}
	}

	var CREATE = {
		main: function(options){
			_main = {};
			_main.canvas = tools.createHTML({
				tag: 'canvas',
				className: 'game-canvas',
				tabIndex: '1',
				onkeydown: EVENTS.keydown,
				onkeyup: EVENTS.keyup,
			})
			_main.ctx = _main.canvas.getContext("2d");
		},
		size: function(options){
			_size = {};

			_size.dpi = 1;
			_size.scale = 1;
		},
		hood: function(){
			_main.hood = {};
		}
	}
	var SET = {
		parent: function(options){
			_setting.parent = options.parent;

			if(options.parent instanceof Node)
				options.parent.appendChild(_main.canvas);
			else
				_fragment.appendChild(_main.canvas)
		},
		size: function(options){
			if(options.width){
				_setting.width = options.width;
				_main.canvas.width = options.width;
				_main.canvas.style.width = options.width + 'px';
			}
			if(options.height){
				_setting.height = options.height;
				_main.canvas.height = options.height;
				_main.canvas.style.height = options.height + 'px';
			}
		}
	}

	var DISPLAY = new function(){

		var frameRate = 60;
		var tick = 1000 / frameRate;

		var s = {};

		var nav;

		var enemis = [];
		var hero;

		this.start = function(options){
			
			s.l = -100;
			s.t = 0;

			s.width = _setting.width;
			s.height = _setting.height;

			hero = new HERO();
			window.hero = hero;

			for(var i = 0; i < 3; i++){
				var enemy = new ENEMY();

				enemy.position.set( [
					Math.round(400*Math.random()) + 100,
					Math.round(100*Math.random()),
					0 
					] );

				enemis.push( enemy );
			}

			nav = {};
			nav.height = 100;
			nav.width = 1000;

			DISPLAY.display();
		}


		this.display = function() {
			var c = _main.ctx;

			c.fillStyle = '#FFFFFF';
			c.fillRect( 
				0,
				0,
				_setting.width*_size.dpi,
				_setting.height*_size.dpi
			);


			MOVEVIEWPORT();


			c.translate( 
				- _size.scale * s.l,
				- _size.scale * s.t
			);

			
			GIDES.h(c);
			GIDES.v(c);

			ACTION();

			HAPPINING();

			DRAW.char(c, hero, '#000000');

			enemis.forEach(function(item){
				DRAW.char(c, item, '#FF0000');				
			})



			c.translate( 
				_size.scale * s.l,
				_size.scale * s.t );

			_timer = (s.stop) ? null : setTimeout( DISPLAY.display, tick );
		}

		var MOVEVIEWPORT = function(){
			var position = hero.position.get();
			if(position[0] - s.l < 100)					s.l = position[0] - 100;
			if(s.l + s.width - position[0] < 100)		s.l = position[0] - s.width + 100;
		}

		var ACTION = function(){
			// controls

			var speed = 2;

			var zv = 0;

			var position = hero.position.get();
		
			if(_setting.keyMap[38])			position[1] += speed;
			if(_setting.keyMap[40])			position[1] +=-speed;
			if(_setting.keyMap[37])			position[0] +=-speed;
			if(_setting.keyMap[39])			position[0] += speed;
			
			if(_setting.keyMap[16])			zv += 15;
			
			if(_setting.keyMap[27])			s.stop = true;

			if(!position[2] && zv)			hero.speed.set(zv);

			hero.position.set(position);
		}

		var HAPPINING = function(){
			var zv = hero.speed.get();

			var g = 1;

			var position = hero.position.get();
			zv += -g;
			position[2] += zv;

			hero.speed.set(zv);
			hero.position.set(position);
		}

		var GIDES = {
 			v: function(c){
 				fline = (Math.floor(s.l/50) + 1)*50;
			
 				c.lineWidth = 0.2*_size.scale;
				c.strokeStyle = '#222222';
				c.fillStyle = '#777777';
	
				c.textAlign = "left";
				c.textBaseline = "top";
				c.font = 4*_size.scale + 'px sans-serif';
	
				c.beginPath();
				while(fline < s.l + s.width){
					c.fillText(
						fline,
						_size.scale * (fline + 2),
						_size.scale * (s.t));
					c.moveTo(
						_size.scale * (fline),
						_size.scale * (s.t) );	
					c.lineTo(
						_size.scale * (fline),
						_size.scale * (s.height + s.t) );
					fline += 50;
				}
				c.stroke();
				c.closePath();
			},
			h: function(c){
				fline = (Math.floor(s.t/50) + 1)*50;

 				c.lineWidth = 0.2*_size.scale;
				c.strokeStyle = '#222222';
				c.fillStyle = '#777777';
	
				c.textAlign = "left";
				c.textBaseline = "top";
				c.font = 4*_size.scale + 'px sans-serif';
				
				c.beginPath();
				while(fline < s.t + s.height){
					c.fillText(
						fline,
						_size.scale * (s.l),
						_size.scale * (fline + 2));
					c.moveTo(
						_size.scale * (s.l),
						_size.scale * (fline) );	
					c.lineTo(
						_size.scale * (s.width + s.l),
						_size.scale * (fline) );
					fline += 50;
				}
				c.stroke();
				c.closePath();
			}
		}

		var DRAW = {

			char: function(c, char, color){

				var position = char.position.get();

				position[1] = 400 - position[1]; 

				c.lineWidth = 1*_size.scale;
	
				c.fillStyle = color;
				c.strokeStyle = color;
	
				c.beginPath();
	
				c.arc(
					_size.scale * ( position[0] ),
					_size.scale * ( position[1] - position[2] ),
					_size.scale * (10), 0, Math.PI*2);
				c.stroke();
				c.closePath();
			}

		}
	}

	var NAVIGATION = function(){
		var s
	}

	var CHARACTER = function(){

		var char = this;

		char.hp = 100;
		char.mp = 100;

		char.side = 0;

		char.zv = 0;

		char.x = 0;
		char.y = 0; 
		char.z = 0;

		/* VISUAL */

		char.frame;
		char.status;

		/*

		upStart
		up
		upDown
		move
		attack
		hold
		block
		
		*/

		this.position = {
			get: function(){
				return [char.x, char.y, char.z];
			},
			set: function(position){
				if(position[0] > char.x)				char.side = 0;
				else if(position[0] < char.x)			char.side = 1;

				if(position[1] > 100)					position[1] = 100;
				if(position[1] < 0)						position[1] = 0;
				if(position[2] < 0)						position[2] = 0;
				if(position[2] == 0 && char.zv < 0)		char.zv = 0;
				[char.x, char.y, char.z] = position;
			}
		}
		this.speed = {
			get: function(){
				return char.zv;
			},
			set: function(speed){
				char.zv = speed;
			}
		}

		this.change = function(hp, mp){
			char.hp += hp;
			char.mp += mp;

			char.normalize()	
		}

		this.normalize = function(){
			if(char.hp > 100)	char.hp = 100;
			if(char.hp < 0)		char.hp = 0;
			if(char.mp > 100)	char.mp = 100;
			if(char.mp < 0)		char.mp = 0;
		}
	}

	var HERO = function(){

		this.action = {
			move: {
				times: 2,
				frames: [
					,

				]
			},
			hold: {
				times: 2,
				frames: [
					,

				]
			},
			jump: {
				times: 1,
				frames: [

				]
			},
			down: {
				times: 1,
				frames: [

				]
			},
			land: {
				times: 1,
				frames: [

				]
			},
			attack: {
				times: 3,
				frames: [
					,
					,

				]
			},
			attackInJump: {
				times: 1,
				frames: [

				]
			},
			attackTop: {
				times: 3,
				frames: [
					,
					,
				]
			}
		}

		this.__proto__ = new CHARACTER;
	}

	var ENEMY = function(){

		this.__proto__ = new CHARACTER;
	}

	self.create(options);
}