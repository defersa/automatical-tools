function dash_ui(options){

	var link = this;
	var setting;
	var functions;

	var container;
	var backplate;
	var canvas;
	
	var overhang;
	var vector; 

	link.create = function (options){ 
		if(options.parent == undefined)		options.parent = document.body;
		if(options.width == undefined)		options.width = 1280;
		if(options.height == undefined)		options.height = 768;
		if(options.scale == undefined)		options.scale = 1;

		container = tools.createHTML({ tag: 'div', className: 'pu-container', oncontextmenu: events.context});
		backplate = tools.createHTML({ tag: 'div', className: 'pu-backplate', parent: container});
		canvas = tools.createHTML({ tag: 'div', className: 'pu-canvas', parent: backplate, onmousedown: events.mouseDown.canvas });

		vector = [];

		setting = {};
		functions = {};


		window.addEventListener("resize", set.position);

		link.change(options);
	}
	link.change = function (options){
		if(!options)	options = {};
		if(options.width != undefined)		setting.width = options.width;
		if(options.height != undefined)		setting.height= options.height;
		if(options.scale != undefined)		setting.scale = options.scale;

		if(options.parent != undefined)		set.parent(options);
		if(options.functions != undefined)	set.functions(options);
		if(options.items != undefined)		link.addItems(options.items);
	
		set.position();
	}
	link.remove = function (options){
		setting = undefined;
		vector = undefined;
		canvas = undefined;
		backplate = undefined;
		functions = undefined;
		container = undefined;
		tools.destroyHTML(container);

		window.removeEventListener("resize", set.position);
	}
	link.addItems = function(items){
		for(var i = 0; i < items.length; i++){
			vector.push(create.panel(items[i]));
		}
		set.position();
	}
	link.getSelect = function(){
		var result = [];
		select.items.forEach(function(item){
			result.push(item.obj);
		});
		return result;
	}
	link.getItems = function(){
		var result = [];
		vector.forEach(function(item){
			result.push(item.obj);
		});
		return result;		
	}
	link.removeItems = function(items){
		items.forEach(function(item){
			var origin;
			var index;
			vector.forEach(function(itm, indx){
				if(itm.obj == item){	origin = itm; index = indx;	}
			});
			if(origin != undefined){
				if(origin.select)	select.remove(origin);
				tools.destroyHTML(origin.bord);
				vector.splice(index, 1);
			}
		});
	}

	var set = {
		parent: function(options){
			options.parent.appendChild(container);
			setting.parent = parent;
		},
		functions: function(options){
			if(options.functions.rightClick != undefined)	functions.rightClick = options.functions.rightClick;
		},
		position: function(){

			set.rectangles();

			var cHeight = container.offsetHeight;
			var cWidth = container.offsetWidth;

			var l = (overhang.l*setting.scale < 30) ? 30 : overhang.l*setting.scale;
			var r = (overhang.r*setting.scale < 30) ? 30 : overhang.r*setting.scale;
			var t = (overhang.t*setting.scale < 30) ? 30 : overhang.t*setting.scale;
			var b = (overhang.b*setting.scale < 30) ? 30 : overhang.b*setting.scale;

			var width = setting.width*setting.scale + l + r;
			var height = setting.height*setting.scale + t + b;
			var left = l;
			var top = t;

			if( width < cWidth){
				left = Math.round((cWidth - setting.width*setting.scale)/2);
				width = cWidth - 1;
			}
			if( height < cHeight){
				top = Math.round((cHeight - setting.height*setting.scale)/2);
				height = cHeight - 1;
			}

			backplate.style.cssText = 'width: ' + width + 'px; '
									+ 'height: ' + height + 'px;';

			canvas.style.cssText	= 'width: ' + setting.width*setting.scale + 'px; '
									+ 'height: ' + setting.height*setting.scale + 'px; '
									+ 'left: ' + left + 'px; '
									+ 'top: ' + top + 'px;';
		},
		rectangles: function(){

			overhang = {l: 0, r: 0, t: 0, b: 0 }
			for(var i = 0; i < vector.length; i++){
				var item = vector[i];
				item.obj.left = Math.round(item.obj.left);
				item.obj.top = Math.round(item.obj.top);
				item.obj.height = Math.round(item.obj.height);
				item.obj.width = Math.round(item.obj.width);

				item.bord.style.cssText = 'left: ' + (item.obj.left*setting.scale - 5)
										+ 'px; top: ' + (item.obj.top*setting.scale - 5)
										+ 'px; width: ' + (item.obj.width*setting.scale + 10)
										+ 'px; height: ' + (item.obj.height*setting.scale + 10)
										+ 'px; z-index: '+ (item.obj.zindex);

				var left	= -item.obj.left + 5;
				var top		= -item.obj.top + 5;
				var right	= item.obj.left + item.obj.width - setting.width + 5;
				var bottom	= item.obj.top + item.obj.height - setting.height + 5;
				if(left > overhang.l)		overhang.l = left;
				if(top > overhang.t)		overhang.t = top;
				if(right > overhang.r)		overhang.r = right;
				if(bottom > overhang.b)		overhang.b = bottom;
			}
		}
	}
	var events = {
		mouseDown: {
			canvas: function(e){
				var item = tools.closest(e.target, 'pu-border');
				if(!item && !e.ctrlKey){
					select.removeAll();
					select.down(e);
				}
			},
			rectangle: function(e){
				var item = tools.closest(e.target, 'pu-border').item;

				if(!e.ctrlKey && !item.select)	select.removeAll();

				if(e.ctrlKey && item.select)	select.remove(item);
				else							select.add(item);

				var rect = tools.closest(e.target, 'pu-rectangle');
				var res = tools.closest(e.target, 'pu-resize');
				if(!rect && select.items.length > 0 && !res)	position.down(e);
			}
		},
		context: function(e){
			item = tools.closest(e.target, 'pu-border');
			if (item) item = item.item.obj;
			if(typeof functions.rightClick == 'function'){
				var result = functions.rightClick(link, item);
				if(result){
					tools.stopProp(e);
					return false;
				}
			}
		}
	}
	var create = {
		panel: function(options){
			var item = {};

			item.bord = tools.createHTML({parent: canvas, tag: 'div', className: 'pu-border', onmousedown: events.mouseDown.rectangle });
			item.html = tools.createHTML({parent: item.bord, tag: 'div', className: 'pu-rectangle'});


			item.bord.item = item;
			item.obj = options;

			if(item.obj.width < 0 || item.obj.width == undefined)			item.obj.width = 200;
			if(item.obj.height < 0 || item.obj.height == undefined)			item.obj.height = 100;
			if(item.obj.minWidth < 0 || item.obj.minWidth == undefined)		item.obj.minWidth = 50;
			if(item.obj.minHeight < 0 || item.obj.minHeight == undefined)	item.obj.minHeight = 50;
			if(item.obj.left < 0 || item.obj.left == undefined)				item.obj.left = 0;
			if(item.obj.top < 0 || item.obj.top == undefined)				item.obj.top = 0;
			if(item.obj.zindex == undefined)								item.obj.zindex = 0;

			if(options.content != undefined){
				item.html.innerHTML = '';
				item.html.appendChild(options.content);
			}
			return item;
		}
	}

	var position = new function(){
		var s;

		this.down = function(e){
			var positions = [];
			select.items.forEach(function(item){
				positions.push([item.obj.top, item.obj.left]);
			});

			s = {e: e, p: positions};
			tools.startBackdrop({cursor: 'move'});
			window.addEventListener("mousemove", move);
			window.addEventListener("mouseup", up);
		}

		function move(e){
			var y = (e.pageY - s.e.pageY)/setting.scale;
			var x = (e.pageX - s.e.pageX)/setting.scale;


			select.items.forEach(function(item, i){
				item.obj.top = s.p[i][0] + y;
				item.obj.left = s.p[i][1] + x;
			});
			set.rectangles();
		}

		function up(e){
			set.position();
			tools.endBackdrop();
			s = undefined;
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		}
	}
	var resize = new function(){
		var s;

		this.down = function(e, v, h, cursor){
			var objects = [];
			select.items.forEach(function(item){
				var object = {	l: item.obj.left*setting.scale,
								t: item.obj.top*setting.scale,
								w: item.obj.width*setting.scale,
								h: item.obj.height*setting.scale,
								original: item };
				object.html = tools.createHTML({tag: 'div', className: 'pu-rectangle-resize', parent: canvas})
				objects.push(object);
			});
			s = {e: e, h: h, v: v, o: objects };
			tools.startBackdrop({cursor: cursor});
			window.addEventListener("mousemove", move);
			window.addEventListener("mouseup", up);
			move(e);
		}

		function move(e){
			var x = (e.pageX - s.e.pageX);
			var y = (e.pageY - s.e.pageY);
			s.o.forEach(function(itm){
				var h = itm.h;
				var w = itm.w;
				var l = itm.l;
				var t = itm.t;

				if(s.h == 1)	w += x;
				if(s.h ==-1){
					w -= x;
					l += x;
				}
				if(s.v == 1)	h += y;
				if(s.v ==-1){
					h -= y;
					t += y;
				}
				itm.html.style.cssText = 'left: ' + l + 'px; top: ' + t + 'px; width: ' + w + 'px; height: ' + h + 'px;';
			});
		}

		function up(e){

			tools.endBackdrop();
			s.o.forEach(function(itm){		tools.destroyHTML(itm.html);	})
			var x = (e.pageX - s.e.pageX)/setting.scale;
			var y = (e.pageY - s.e.pageY)/setting.scale;

			select.items.forEach(function(itm){

				if(s.h == 1)	itm.obj.width += x;
				if(s.h ==-1){
					itm.obj.width -= x;
					itm.obj.left += x;
				}
				if(s.v == 1)	itm.obj.height += y;
				if(s.v ==-1){
					itm.obj.height -= y;
					itm.obj.top += y;
				}
				if(itm.obj.width < itm.obj.minWidth)	itm.obj.width = itm.obj.minWidth;
				if(itm.obj.height < itm.obj.minHeight)	itm.obj.height = itm.obj.minHeight;
			});

			set.rectangles();
			s = undefined;
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		}
	}
	var select = new function(){
		var items = this.items = [];
		var s;

		this.add = function(item){
			if(!item.select)	add(item);

		}
		this.remove = function(item){
			select.items.forEach(function(itm, indx, arry){ if(itm == item){
				remove(itm);
				arry.splice(indx, 1); 
					}});
		}
		this.removeAll = function(){
			select.items.forEach( function(itm){	remove(itm);	});
			items = select.items = [];
		}
		function add(item){
				select.items.push(item);
				item.select = true;
				item.bord.className = 'pu-border pu-select';
				item.support = [];

				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', className: 'pu-move', style: 'left: 0; top: 0; bottom: 0; width: 10px;'}));
				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', className: 'pu-move', style: 'right: 0; top: 0; bottom: 0; width: 10px;'}));

				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', className: 'pu-move', style: 'right: 0; left: 0; top: 0; height: 10px;'}));
				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', className: 'pu-move', style: 'right: 0; left: 0; bottom: 0; height: 10px;'}));

				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', onmousedown: function(e){ resize.down(e,-1,-1, 'se-resize')}, className: 'pu-resize', style: 'cursor: se-resize; left: 0; top: 0; '}));
				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', onmousedown: function(e){ resize.down(e,-1, 0, 'n-resize')}, className: 'pu-resize', style: 'cursor: n-resize; left: Calc(50% - 4px); top: 0; '}));

				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', onmousedown: function(e){ resize.down(e,-1, 1, 'sw-resize')}, className: 'pu-resize', style: 'cursor: sw-resize; right: 0; top: 0; '}));
				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', onmousedown: function(e){ resize.down(e, 0, 1, 'e-resize')}, className: 'pu-resize', style: 'cursor: e-resize; right: 0; top: Calc(50% - 4px); '}));

				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', onmousedown: function(e){ resize.down(e, 1, 1, 'se-resize')}, className: 'pu-resize', style: 'cursor: se-resize; right: 0; bottom: 0; '}));
				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', onmousedown: function(e){ resize.down(e, 1, 0, 'n-resize')}, className: 'pu-resize', style: 'cursor: n-resize; left: Calc(50% - 4px); bottom: 0; '}));

				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', onmousedown: function(e){ resize.down(e, 1,-1, 'sw-resize')}, className: 'pu-resize', style: 'cursor: sw-resize; left: 0; bottom: 0; '}));
				item.support.push(tools.createHTML({parent: item.bord, tag: 'div', onmousedown: function(e){ resize.down(e, 0,-1, 'e-resize')}, className: 'pu-resize', style: 'cursor: e-resize; left: 0; top: Calc(50% - 4px); '}));
		}
		function remove(item){
			item.select = false;
			item.bord.className = 'pu-border';
			item.support.forEach(function(itm){	tools.destroyHTML(itm); });
			item.support = undefined;
		}

		this.down = function(e){
			var coord = canvas.getBoundingClientRect();
			var html = tools.createHTML({tag: 'div', className: 'pu-rectangle-select', parent: canvas });
			var x = 
			s = {html: html, c: coord, e: e };

			window.addEventListener("mousemove", move);
			window.addEventListener("mouseup", up);
		}
		function move(e){
			if((Math.abs(e.pageX - s.e.pageX) > 3 || Math.abs(e.pageY - s.e.pageY) > 3) && !s.moved){
				s.m = true;
			}
			if(s.m){
				var fX = (e.pageX - s.c.left);
				var lX = (s.e.pageX - s.c.left);
				var fY = (e.pageY - s.c.top);
				var lY = (s.e.pageY - s.c.top);

				var max; var min;
				max = (fX > lX)? fX : lX;				min = (fX > lX)? lX : fX;
				fX = min; lX = max;
				max = (fY > lY)? fY : lY;				min = (fY > lY)? lY : fY;
				fY = min; lY = max;

				s.fX = fX/setting.scale;				s.lX = lX/setting.scale;
				s.fY = fY/setting.scale;				s.lY = lY/setting.scale;

				s.html.style.cssText = 'left: ' + fX + 'px; width: ' + (lX - fX) + 'px; top: ' + fY + 'px; height: ' + (lY - fY) + 'px; display: block;';
			}
		}
		function up(e){

			vector.forEach(function(itm){
				if( s.fX <= itm.obj.left && s.lX >= (itm.obj.left + itm.obj.width) && s.fY <= itm.obj.top && s.lY >= (itm.obj.top + itm.obj.height)){
					select.add(itm);
				}
			});

			tools.destroyHTML(s.html);

			s = undefined;
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		}
	}

	link.create( (!options) ? {} : options );
}