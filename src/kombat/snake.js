export function snake_game(options){

	var _main;
	var _size;

	var _setting;
	var _functions;
	var _timer;
	var _fragment = document.createDocumentFragment();

	var self = this;

	var snake = {};

	this.create = function(options){

		if(_main)			self.remove();
		
		CREATE.main();

		_setting = {
			complexity: 1
		};
		_functions = {};
		_size = {
			dpi: 1,
			scale: 1
		}

		self.change(options);
	}

	this.change = function(options){
		if(!options)			options = {};
		if(options.parent)		SET.parent(options);
		if(options.lose)		SET.function(options);
		if(options.complexity)	SET.complexity(options);
	
		DISPLAY.create();
	}

	this.remove = function(){
		if(_main){

		}
	}
	this.stop = function(){
		DISPLAY.stop();
	}
	this.start = function(){
		DISPLAY.create();
	}

	var EVENTS = {
		keydown: function(e){
			kc = e.keyCode
			if(kc === 38 && snake.side !== 40){
				snake.nside = 38;
			} else if(kc === 39 && snake.side !== 37){
				snake.nside = 39;
			} else if(kc === 40 && snake.side !== 38){
				snake.nside = 40;
			} else if(kc === 37 && snake.side !== 39){
				snake.nside = 37;
			}
		},
		keyup: function(e){

		},
		blur: function(e){
			DISPLAY.stop();
		},
		focus: function(e){
			DISPLAY.start();
		}
	}

	var CREATE = {
		main: function(options){
			_main = {};
			_main.canvas = document.createElement('canvas');
			_main.canvas.className = 'game-canvas';
			_main.canvas.tabIndex = '1';
			_main.canvas.onkeydown = EVENTS.keydown;
			_main.canvas.onkeyup = EVENTS.keyup;
			_main.canvas.onblur = EVENTS.blur;
			_main.canvas.onfocus = EVENTS.focus;

			_main.ctx = _main.canvas.getContext("2d");
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
		function: function(options){
			_functions.lose = options.lose;
		},
		complexity: function(options){
			_setting.complexity = options.complexity;
		}
	}

	var DISPLAY = new function(){

		var frameRate = 5 * _setting.complexity;
		var tick = 1000 / frameRate;

		var s = {
			l: 0,
			t: 0
		};

		var sideDirection = {
			'38': [0,-1],
			'39': [1,0],
			'40': [0,1],
			'37': [-1,0]
		}

		this.stop = function(options){
			s.stop = true;
		}
		this.start = function(options){
			s.stop = false;
			DISPLAY.display();
		}
		this.lose = function(options){
			if(_function.lose)	_functions.lose();
		}
		var map;

		this.create = function(options){
			
			s.cols = 16;
			s.rows = 16;

			var side = [38,39,40,37];

			snake = {
				head: [
					Math.floor( Math.random() * s.cols ),
					Math.floor( Math.random() * s.rows )
				],
				side: side[ Math.floor(Math.random()*side.length)],
				body: []
			}

			map = [];
			for(var i=0; i < s.rows; i++){
				for(var j = 0; j < s.cols; j++){
					map.push({
						c: j,
						r: i,
						status: false
					})
				}
			}
			map[snake.head[1]*s.cols + snake.head[0]].status = true;

			snake.nside = snake.side;

			for(var i = 1; i < 4; i++){
				var point = fixPlace([
					snake.head[0] - sideDirection[snake.side][0]*i,
					snake.head[1] - sideDirection[snake.side][1]*i
				]);
				map[point[1]*s.cols + point[0]].status = true;
				snake.body.push(point);
			}

			var goal = map.filter(function(item){ return !item.status });
			goal = goal[ Math.floor(Math.random()*goal.length)]

			snake.goal = [ goal.c, goal.r ]

			s.blocksize = 30;

			s.width = s.cols*s.blocksize;
			s.height = s.rows*s.blocksize;

			_main.canvas.width = s.width;
			_main.canvas.height = s.height;

			_main.canvas.focus();
		}

		function fixPlace (point){
			if(point[0] == s.cols )	point[0] = 0;
			else if(point[0] < 0)	point[0] = s.cols - 1;

			if(point[1] == s.rows )	point[1] = 0;
			else if(point[1] < 0)	point[1] = s.rows - 1;
			return point;
		}


		this.display = function() {

			if(s.stop)		return;
			
			var c = _main.ctx;

			c.fillStyle = '#FFFFFF';
			c.fillRect( 
				0,
				0,
				s.width*_size.dpi,
				s.height*_size.dpi
			);

			MOVE();

			c.translate( 
				- _size.scale * s.l,
				- _size.scale * s.t
			);

			GIDES.map(c);
			GIDES.snake(c);

			c.translate( 
				_size.scale * s.l,
				_size.scale * s.t );

			setTimeout( DISPLAY.display, tick );
		}


		var GIDES = {
 			map: function(c){
				c.fillStyle = '#8ecc39';
				c.fillRect( 
					0,
					0,
					s.width*_size.dpi,
					s.height*_size.dpi
				);
				c.fillStyle = '#a7d948';
				for(var i = 0; i < s.cols; i++){
					for(var j = 0; j < s.rows; j++){
						if((i + j)%2){
							c.fillRect( 
								i*s.blocksize*_size.dpi,
								j*s.blocksize*_size.dpi,
								s.blocksize*_size.dpi,
								s.blocksize*_size.dpi
							);
						}
					}
				}
			},
			snake: function(c){
				c.fillStyle = 'blue';
				c.fillRect( 
					snake.head[0]*s.blocksize*_size.dpi,
					snake.head[1]*s.blocksize*_size.dpi,
					s.blocksize*_size.dpi,
					s.blocksize*_size.dpi
				);

				c.fillStyle = 'green';
				c.fillRect( 
					snake.goal[0]*s.blocksize*_size.dpi,
					snake.goal[1]*s.blocksize*_size.dpi,
					s.blocksize*_size.dpi,
					s.blocksize*_size.dpi
				);

				c.fillStyle = 'red';
				snake.body.forEach(function(item){
					c.fillRect( 
						item[0]*s.blocksize*_size.dpi,
						item[1]*s.blocksize*_size.dpi,
						s.blocksize*_size.dpi,
						s.blocksize*_size.dpi
					);
				});
			}
		}

		var MOVE = function(){
			var body = snake.head;
			snake.side = snake.nside;
			snake.head = fixPlace([
				snake.head[0] + sideDirection[snake.side][0],
				snake.head[1] + sideDirection[snake.side][1]
			]);

			if(map[snake.head[1]*s.cols + snake.head[0]].status) s.stop = true;

			map[snake.head[1]*s.cols + snake.head[0]].status = true;
			snake.body.unshift(body);
			
			if(snake.head[0] == snake.goal[0] && snake.head[1] == snake.goal[1]){

				var goal = map.filter(function(item){ return !item.status });
				goal = goal[ Math.floor(Math.random()*goal.length)]
				snake.goal = [ goal.c, goal.r ];

			} else {
				var point = snake.body.pop();
				map[point[1]*s.cols + point[0]].status = false;
			}
		}

		var DRAW = {

		}
	}


	self.create(options);
}