function table_ui(options){

	var link = this;

	var main; //inner object with links
	var parent; //outer container for table
	var container; //inner container for table
	var functions; //custom functions
	var setting; //options and settings

	var _Table, _Corner, _Side, _Top; //objects for storage main components
	var size;	//default value for text size, font, height and width rows and cols, 

	var defaultBack = { sort: ['#000', '#00a8a8', '#ff5757', '#b3b300'], 
						headers: [['#adadad','#cfcfcf','#F1F1F1'],['#d1e1f2','#e2f0ff','#F1F1F1']],
						table: [['#DCDCDC','#C5D8DC','#DCCBD0','#DCD9CB'],['#E8E8E8','#D0E4E8','#E8D7DB','#E8E5D7'],['#ffffff','#e5fbff','#ffecf1','#fffcec']] };

	link.create = function(options){
		if(setting)								link.remove();

		if(options.parent == undefined)			options.parent = document.body;
		if(options.showType == undefined)		options.showType = [true, true, true, true ];
		if(options.hideRow == undefined)		options.hideRow = false;
		if(options.hideCol == undefined)		options.hideCol = false;
		if(options.hideZero == undefined)		options.hideZero = false;
		if(options.showZero == undefined)		options.showZero = false;
		if(options.showPercent == undefined)	options.showPercent = true;
		if(options.separator == undefined)		options.separator = '.';
		if(options.round == undefined)			options.round = [ 3, 3, 3];
		if(options.orientation == undefined)	options.orientation = false;
		if(options.size == undefined)			options.size = { };
		if(options.sort == undefined)			options.sort = false;
		if(options.sharpOverflow == undefined)	options.sharpOverflow = true;


		main = {	html: creating.parent(),	_Corner: creating.corner(),		_Table: creating.table(),	_Side: creating.side(),	_Top: creating.top() };
		size = {	corner: { w: [], h: [] },	table: { w: [], h: [] },  w: 50, h: 20, ttext: 13, font: 'sans-serif', dpi: 1, scale: 1 };
		functions = {};							setting = { showType: [true, true, true], size: size };

		window.addEventListener("resize", display.generate);

		link.change(options);
	}
	link.remove = function(){
		window.removeEventListener("resize", display.generate);
		setting = undefined;					tools.destroyHTML(container);
		_Table = undefined;						_Side = undefined;
		_Top = undefined;						_Corner = undefined;
		sort.top = {};							sort.side = {};
		select.table = [];						select.side = [];					select.top = [];
	}
	link.change = function(options){
		if( typeof options != 'object')			options = {};

		if( options.sort != undefined)			setting.sort = options.sort;
		if( options.hideCol != undefined)		setting.hideCol = options.hideCol;
		if( options.hideRow != undefined)		setting.hideRow = options.hideRow;
		if( options.hideZero != undefined)		setting.hideZero = options.hideZero;
		if( options.showZero != undefined)		setting.showZero = options.showZero;
		if( options.showPercent != undefined)	setting.showPercent = options.showPercent;
		if( options.separator != undefined)		setting.separator = options.separator;
		if( options.orientation != undefined)	setting.orientation = options.orientation;
		if( options.sharpOverflow != undefined)	setting.sharpOverflow = options.sharpOverflow;

		if( options.parent != undefined)		set.parent(options);
		if( options.showType != undefined)		set.showType(options);
		if( options.round != undefined)			set.round(options);
		if( options.functions != undefined)		set.functions(options);
		if( options.size != undefined)			set.size(options);

		if( options.table != undefined)			create.setTable( options.table.top, options.table.side, options.table.table);

		remake.reBuild();
	}
	link.setTable = function(top, side, table){	create.setTable(top, side, table);	remake.reBuild();	}

	link.xlsxExport = function(options){		return exp.xlsxExport(options);		}
	link.htmlExport = function(options){		return exp.htmlExport(options);		}
	link.setSort = function(options){			sort.sortAll(options);				}
	link.getSort = function(){					return sort.getSort();				}
	link.getSetting = function(){				return tools.cloneObject(setting);	}
	link.focus = function(){					main.html.focus();					}
	link.getTop = function(){
		return _Top.branches.concat();
	}
	link.getSide = function(){
		return _Side.branches.concat();
	}
	link.getSelected = function(){
		var cells = [];
		select.table.forEach(function(item){ cells.push(item.obj);});
		return cells;
	}
	link.clearAll = function(){
		select.clearAll();
		display.all();
		if(functions.afterSelect)	functions.afterSelect(link);
	}	
	link.selectAll = function(){
		select.selectAll();
		display.all();
		if(functions.afterSelect)	functions.afterSelect(link);
	}

	var creating = {
		parent: function() {
			container = tools.createHTML({ tag: 'div', className: 'tau-parent', tabIndex: 0, onkeydown: events.key.down, onkeyup: events.key.up, onblur: events.key.blur, oncontextmenu: events.context  });
			return container;
		},
		corner: function() {
			_Corner = { html: tools.createHTML({ tag: 'div', className: 'tau-corner', parent: container, onmousemove: events.move.corn, onmousedown: events.down.corn }) };
			return _Corner;
		},
		table: function() {
			_Table = {cells: [], visual: [], r: 0, c: 0, html: tools.createHTML({ tag: 'canvas', className: 'tau-table', parent: container, 
																					onmousedown: events.down.table,
																					onmousemove: events.move.table,
																					onmouseout: events.out.table,
																					onwheel: scroll.wheelVertical })};
			_Table.ctx = _Table.html.getContext("2d");
			return _Table;
		},
		side: function(){
			_Side = {tree: { children: []}, branches: [], dw: [], visual: [], r: 0, c: 0, html: tools.createHTML({ tag: 'canvas', className: 'tau-side', parent: container, 
																					ondblclick: events.dbl.side, 
																					onmousedown: events.down.side, 
																					onmousemove: events.move.side,
																					onwheel: scroll.wheelVertical })};
			_Side.ctx = _Side.html.getContext("2d");
			return _Side;
		},
		top: function(){
			_Top = {tree: {children: []}, branches: [],  dh: [], visual: [], r: 0, c: 0, html: tools.createHTML({ tag: 'canvas', className: 'tau-top', parent: container, 
																					ondblclick: events.dbl.top,
																					onmousedown: events.down.top,
																					onmousemove: events.move.top,
																					onwheel: scroll.wheelHorizontal })};
			_Top.ctx = _Top.html.getContext("2d");
			return _Top;
		}
	}
	var set = {
		parent: function(options) {
			setting.parent = options.parent;
			setting.parent.appendChild(main.html);
		},
		showType: function(options) {
			if(Array.isArray(options.showType[0])){
				for(var i = 0; i < options.showType.length; i++)		setting.showType[options.showType[i][0]] = (options.showType[i][1]) ? true : false;
			} else {
				for(var i = 0; i < 3; i++)								setting.showType[i] = (options.showType[i]) ? true : false;
			}
		},
		round: function(options){
			if(!Array.isArray(setting.round)) setting.round = [];
			for(var i = 0; i < 3; i++){
				if(typeof options.round[i] == 'number')					setting.round[i] = options.round[i];
				else if(typeof options.round[i] == 'string')			setting.round[i] = parseInt( options.round[i] );
			}
			create.autoSize();
		},
		functions: function(options){
			if( typeof options.functions.rightClick == 'function' )		functions.rightClick = options.functions.rightClick;
			if( typeof options.functions.afterSelect == 'function' )	functions.afterSelect = options.functions.afterSelect;
			if( typeof options.functions.keyDown == 'function' )		functions.keyDown = options.functions.keyDown;
		},
		size: function(options){
			if(options.size.corner){
				if(options.size.corner.w)	size.corner.w = options.size.corner.w.concat();
				if(options.size.corner.h)	size.corner.h = options.size.corner.h.concat();
			}
			if(options.size.table){
				if(options.size.table.w)	size.table.w = options.size.table.w.concat();
				if(options.size.table.h)	size.table.h = options.size.table.h.concat();				
			}
			if(options.size.dpi)			size.dpi = options.size.dpi;
			if(options.size.w)				size.w = options.size.w;
			if(options.size.h)				size.h = options.size.h;
			if(options.size.text)			size.ttext = options.size.text;
			if(options.size.scale)			set.scale(options);
			if(options.size.font)			size.font = options.size.font;
			size.text = Math.round(size.ttext*size.scale);
			_Table.ctx.font = size.text + "px " + size.font;
			size.dot				= _Table.ctx.measureText('.').width;
			size.numeral			= _Table.ctx.measureText('0').width;
			size.percent			= _Table.ctx.measureText('%').width;
			size.sharp				= _Table.ctx.measureText('#').width;
			size.minh = size.text + 4;
			size.minw = Math.floor(_Table.ctx.measureText('Abcd').width) + 6;
		},
		scale: function(options){
			var _scale = options.size.scale;

			_Top.branches.forEach(	function(item){ item.dw = Math.round(item.dw * ( _scale / size.scale )); } );
			_Side.branches.forEach(	function(item){ item.dh = Math.round(item.dh * ( _scale / size.scale )); } );

			for(var i = 0; i < _Top.dh.length; i++){	_Top.dh[i]  = Math.round(_Top.dh[i]  * ( _scale / size.scale ));}
			for(var i = 0; i < _Side.dw.length; i++){	_Side.dw[i] = Math.round(_Side.dw[i] * ( _scale / size.scale ));}
		
			if(Array.isArray(_Top.d) && Array.isArray(_Side.w) ){
				for(var i = 0; i < _Top.d.length; i++){		_Top.d[i]  = Math.round(_Top.d[i]  * ( _scale / size.scale ));}
				for(var i = 0; i < _Side.w.length; i++){	_Side.w[i] = Math.round(_Side.w[i] * ( _scale / size.scale ));}
			}
		
			size.corner.w.forEach(	function(item){ item = Math.round(item * ( _scale / size.scale )); } );
			size.corner.h.forEach(	function(item){ item = Math.round(item * ( _scale / size.scale )); } );

			size.table.w.forEach(	function(item){ item = Math.round(item * ( _scale / size.scale )); } );
			size.table.h.forEach(	function(item){ item = Math.round(item * ( _scale / size.scale )); } );

			size.scale = _scale;
		}
	}
	var get = {
		cell: {
			side: function(e){
				var x = get.dpiM(e.pageX - _Side.coords.left);
				var y = get.dpiM(e.pageY - _Side.coords.top) + display.s.t;

				for(var ni = 0; ni < display.s.rows.length; ni++){
					var i = display.s.rows[ni];
					for(var j = 0; j < _Side.c; j++){

						var t = display.s.tp[_Side.visual[i][j].i[0] ];
						var b = display.s.tp[ _Side.visual[i][j].i.last() + 1 ];
						var l = _Side.lp[ _Side.visual[i][j].j[0] ];
						var r = _Side.lp[ _Side.visual[i][j].j.last() + 1 ];

						if( b - 3 <= y && y <= b + 1 && r - 3 <= x && x <= r + 1 )		return [_Side.visual[i][j], 1, 1];
						if( b - 3 <= y && y <= b + 1 && x < r && x > l )				return [_Side.visual[i][j], 1, 0];
						if( r - 3 <= x && x <= r + 1 && y < b && y > t )				return [_Side.visual[i][j], 0, 1];
						if( t <= y && b >= y && l <= x && r >= x )						return [_Side.visual[i][j], 0, 0];

					}
				}
				return ;
			},
			top: function(e){
				var x = get.dpiM(e.pageX - _Top.coords.left) + display.s.l;
				var y = get.dpiM(e.pageY - _Top.coords.top);

				for(var ni = 0; ni < display.s.cols.length; ni++){
					var i = display.s.cols[ni];
					for(var j = 0; j < _Top.r; j++){

						var t = _Top.tp[ _Top.visual[j][i].i[0] ];
						var b = _Top.tp[ _Top.visual[j][i].i.last() + 1 ];
						var l = display.s.lp[ _Top.visual[j][i].j[0] ];
						var r = display.s.lp[ _Top.visual[j][i].j.last() + 1 ];

						if( b - 3 <= y && y <= b + 1 && r - 3 <= x && x <= r + 1 )		return [_Top.visual[j][i], 1, 1];
						if( b - 3 <= y && y <= b + 1 && x < r && x > l )				return [_Top.visual[j][i], 1, 0];
						if( r - 3 <= x && x <= r + 1 && y < b && y > t )				return [_Top.visual[j][i], 0, 1];
						if( t <= y && b >= y && l <= x && r >= x )						return [_Top.visual[j][i], 0, 0];
					}
				}
				return ;
			},
			table: function(e){
				var x = get.dpiM(e.pageX - _Table.coords.left) + display.s.l;
				var y = get.dpiM(e.pageY - _Table.coords.top) + display.s.t;

				for(var i = 0; i < display.s.rows.length; i++){
					for(var j = 0; j < display.s.cols.length; j++){

						var t = display.s.tp[ display.s.rows[i] ];
						var b = display.s.tp[ display.s.rows[i] + 1 ];
						var l = display.s.lp[ display.s.cols[j] ];
						var r = display.s.lp[ display.s.cols[j] + 1 ];

						if( t <= y && b >= y && l <= x && r >= x )						return _Table.cells[ display.s.rows[i]][ display.s.cols[j]];
					}
				}
				return ;
			}
		},
		position: {
			side: function(e){
				var x = get.dpiM(e.pageX - _Side.coords.left);
				var y = get.dpiM(e.pageY - _Side.coords.top) + display.s.t;
				var p = {i: 0, j: 0};
				for(var i = 0; i < _Side.c; i++){		if( _Side.lp[i] <= x)										p.j = i;	}
				display.s.rows.forEach(	function(i){	if( display.s.tp[i] <= y && _Side.branches[i].visible)		p.i = i;	});
				return p;				
			},
			top: function(e){
				var x = get.dpiM(e.pageX - _Top.coords.left) + display.s.l;
				var y = get.dpiM(e.pageY - _Top.coords.top);
				var p = {i: 0, j: 0};
				display.s.cols.forEach(	function(i){	if( display.s.lp[i] <= x  && _Top.branches[i].visible)		p.j = i;	});
				for(var i = 0; i < _Top.r; i++){		if( _Top.tp[i] <= y )										p.i = i;	}
				return p;

			},
			table: function(e){
				var x = get.dpiM(e.pageX - _Table.coords.left) + display.s.l;
				var y = get.dpiM(e.pageY - _Table.coords.top) + display.s.t;
				var p = {i: 0, j: 0};
				display.s.cols.forEach(	function(i){	if( display.s.lp[i] <= x)	p.j = i;	});
				display.s.rows.forEach(	function(i){	if( display.s.tp[i] <= y)	p.i = i;	});
				return p;
			}
		},
		sortedPosition: {
			table: function(p1, p2){
				var p = {};				
				p.l = (p1.j > p2.j) ? p2.j : p1.j;
				p.t = (p1.i > p2.i) ? p2.i : p1.i;
				p.r = (p1.j < p2.j) ? p2.j : p1.j;
				p.b = (p1.i < p2.i) ? p2.i : p1.i;
				return p;
			},
			side: function(p1, p2){
				var p = {r: _Side.c - 1};
				p.l = (p2.j > p1.i) ? p1.i : p2.j;
				var st = _Side.visual[p1.i][p.l];
				var ed = _Side.visual[p2.i][p.l];
				p.t = (st.i[0] > ed.i[0]) ? ed.i[0] : st.i[0],
				p.b = (st.i.last() < ed.i.last()) ? ed.i.last() : st.i.last();
				return p;
			},
			top: function(p1, p2){
				var p = {b: _Top.r - 1};
				p.t = (p1.i > p2.i) ? p2.i : p1.i;
				var st = _Top.visual[p.t][p1.j];
				var ed = _Top.visual[p.t][p2.j];
				p.l = (st.j[0] > ed.j[0]) ? ed.j[0] : st.j[0],
				p.r = (st.j.last() < ed.j.last()) ? ed.j.last() : st.j.last();
				return p;
			}
		},
		screenCoord: {
			side: function(y, x){
				var result = [];
				result[0] = get.dpiD(y - display.s.t + display.s.y);
				result[1] = get.dpiD(x);
				return result;
			},
			top: function(y, x){
				var result = [];
				result[0] = get.dpiD(y);
				result[1] = get.dpiD(x - display.s.l + display.s.x);
				return result; 
			},
			table: function(y, x){
				var result = [];
				result[0] = get.dpiD(y - display.s.t + display.s.y);
				result[1] = get.dpiD(x - display.s.l + display.s.x);
				return result; 
			}
		},
		dpiM: function(v){	return Math.round(v*size.dpi);	},
		dpiD: function(v){	return Math.round(v/size.dpi);	}
	}
	var events = {
		move: {
			side: function(e){

				var cell = get.cell.side(e);

				if(cell != undefined){
					if(cell[1] == 1 && cell[2] == 1)		_Side.html.style.cursor = 'se-resize';
					else if(cell[1] == 1 && cell[2] == 0)	_Side.html.style.cursor = 'n-resize';
					else if(cell[1] == 0 && cell[2] == 1)	_Side.html.style.cursor = 'e-resize';
					else									_Side.html.style.cursor = 'default';
	
					if(cell[1] == 0 && cell[2] == 0 && cell[0].tooltip)	_Side.html.title = cell[0].obj.text;
					else												_Side.html.title = '';
				} else {
					_Side.html.title = '';
					_Side.html.style.cursor = 'default';
				}
			},
			top: function(e){

				var cell = get.cell.top(e);

				if(cell != undefined){
					if(cell[1] == 1 && cell[2] == 1)		_Top.html.style.cursor = 'se-resize';
					else if(cell[1] == 1 && cell[2] == 0)	_Top.html.style.cursor = 'n-resize';
					else if(cell[1] == 0 && cell[2] == 1)	_Top.html.style.cursor = 'e-resize';
					else									_Top.html.style.cursor = 'default';
	
					if(cell[1] == 0 && cell[2] == 0 && cell[0].tooltip)	_Top.html.title = cell[0].obj.text;
					else												_Top.html.title = '';
				} else {
					_Top.html.title = '';
					_Top.html.style.cursor = 'default';
				}
			},
			corn: function(e){
				var x = get.dpiM(e.pageX - _Side.coords.left);
				var y = get.dpiM(e.pageY - _Top.coords.top);
				var s = display.s;
	
				if( s.y - 3 <= y && y <= s.y + 1 && s.x - 3 <= x && x <= s.x + 1 || e.ctrlKey){			_Corner.html.style.cursor = 'se-resize';	return;	}
				if( s.y - 3 <= y && y <= s.y + 1 && x < s.x && x > 0 || e.ctrlKey){						_Corner.html.style.cursor = 'n-resize';		return;	}
				if( s.x - 3 <= x && x <= s.x + 1 && y < s.y && y > 0 || e.ctrlKey){						_Corner.html.style.cursor = 'e-resize';		return;	}
	
				_Corner.html.style.cursor = 'default';			return;
			},
			table: function(e){
				var x = get.dpiM(e.pageX - _Table.coords.left);
				var y = get.dpiM(e.pageY - _Table.coords.top);
				if( display.s.vw < x && x < display.s.vw + 18 && y > display.s.vh - 18 && y < display.s.vh && !display.s.corn.b){		display.s.corn.b = true;	display.table();	return false; };
				if( display.s.vw < x && x < display.s.vw + 18 && y < 18  && !display.s.corn.t){											display.s.corn.t = true;	display.table();	return false; };
				if( !(display.s.vw < x && x < display.s.vw + 18 && y > display.s.vh - 18 && y < display.s.vh) && display.s.corn.b){		display.s.corn.b = false;	display.table();	return false; };
				if( !(display.s.vw < x && x < display.s.vw + 18 && y < 18)  && display.s.corn.t){										display.s.corn.t = false;	display.table();	return false; };

				if( display.s.vh < y && y < display.s.vh + 18 && x > display.s.vw - 18 && x < display.s.vw && !display.s.corn.r){		display.s.corn.r = true;	display.table();	return false; };
				if( display.s.vh < y && y < display.s.vh + 18 && x < 18  && !display.s.corn.l){											display.s.corn.l = true;	display.table();	return false; };
				if( !(display.s.vh < y && y < display.s.vh + 18 && x > display.s.vw - 18 && x < display.s.vw) && display.s.corn.r){		display.s.corn.r = false;	display.table();	return false; };
				if( !(display.s.vh < y && y < display.s.vh + 18 && x < 18)  && display.s.corn.l){										display.s.corn.l = false;	display.table();	return false; };
			}
		},
		down: {
			corn: function(e){
				if(e.which != 1) return;

				var x = get.dpiM(e.pageX - _Side.coords.left);
				var y = get.dpiM(e.pageY - _Top.coords.top);
				var s = display.s;
	
				if( s.y - 3 <= y && y <= s.y + 1 && s.x - 3 <= x && x <= s.x + 1  || e.ctrlKey){		resize.corner.down( e, 1, 1);	return;	}
				if( s.y - 3 <= y && y <= s.y + 1 && x < s.x && x > 0 || e.ctrlKey){						resize.corner.down( e, 1, 0);	return;	}
				if( s.x - 3 <= x && x <= s.x + 1 && y < s.y && y > 0 || e.ctrlKey){						resize.corner.down( e, 0, 1);	return;	}
	
				if(select.table.length != 0)			link.clearAll();
				else if(_Table.c != 0 && _Table.r != 0)	link.selectAll();								

				console.log(main);
			},
			table: function(e){
				if(e.which != 1) return;
				var x = get.dpiM(e.pageX - _Table.coords.left);
				var y = get.dpiM(e.pageY - _Table.coords.top);
				var cell = get.cell.table(e);
	
				if( display.s.vw > x && display.s.vh < y && e.which == 1){				scroll.hdown(e, _Table.coords);	return;	}
				if( display.s.vh > y && display.s.vw < x && e.which == 1){				scroll.vdown(e, _Table.coords);	return;	}
	
				if(cell)	select.cTable.down(e);	
				else		link.clearAll();
	
				return;
			},
			side: function(e){
				if(e.which != 1) return;

				var cell = get.cell.side(e);

				if(cell){
					if(cell[1] || cell[2]){
						resize.side.down(e, cell[0], cell[1], cell[2]);
						return;
					}
				}

				if(cell)	select.cSide.down(e);	
				else 		link.clearAll();

				return;
			},
			top: function(e){
				if(e.which != 1) return;

				var cell = get.cell.top(e);

				if(cell){
					if(cell[1] || cell[2]){
						resize.top.down(e, cell[0], cell[1], cell[2]);
						return;
					}
				}

				if(cell)	select.cTop.down(e);	
				else 		link.clearAll();

				return;
			}
		},
		dbl: {
			side: function(e){
				var cell = get.cell.side(e);
				if(cell){
					if(cell[2])		resize.dbl.sideWidth(cell[0]);
					if(cell[1])		resize.dbl.sideHeight(cell[0]);
				}
			},
			top: function(e){				
				var cell = get.cell.top(e);
				if(cell){
					if(cell[2])		resize.dbl.topWidth(cell[0]);
					if(cell[1])		resize.dbl.topHeight(cell[0]);
				}
			}	
		},
		context: function(e){
			if(functions.rightClick){
				var options;

				if(e.target == _Table.html){

					var cell = get.cell.table(e);
					if(cell){
						if(!cell.select) select.selectTable(cell.i[0], cell.i[0], cell.j[0], cell.j[0], false);
						options = {cell: cell, i: cell.i, j: cell.j, area: 'table' };
					} else	options = {cell: null, i: null, j: null, area: 'table' };

				} else if(e.target == _Side.html){

					var cell = get.cell.side(e);

					if(cell){
						cell = cell[0];
						var types = [];

						if(cell.types){
							if(!(cell.types[0] && setting.showType[0]) && cell.floatType)				types.push(0);
							cell.types.forEach(function(item, i){ 	if(item && setting.showType[i])		types.push(i); });
						}
						if(!cell.select)	select.selectSide( cell.i[0], cell.i.last(), cell.j[0], _Side.c - 1, false);

						options = {cell: cell, i:  cell.i, j:  cell.j, area: 'side', displayed: types, position: cell.index };
					} else {
						options = {cell: null, i:  null, j:  null, area: 'side' };
					}					

				} else if(e.target == _Top.html){

					var cell = get.cell.top(e);

					if(cell){
						cell = cell[0];
						var types = [];

						if(cell.types){
							if(!(cell.types[0] && setting.showType[0]) && cell.floatType)				types.push(0);
							cell.types.forEach(function(item, i){ 	if(item && setting.showType[i])		types.push(i); });
						}
						if(!cell.select)	select.selectTop( cell.i[0], _Top.r - 1, cell.j[0], cell.j.last(), false);

						options = {cell: cell, i:  cell.i, j:  cell.j, area: 'top', displayed: types, position: cell.index };
					} else {
						options = {cell: null, i:  null, j:  null, area: 'top' };
					}

				} else {	options = {area: 'corner'};		}

				display.all();
				functions.rightClick(e, options);
				tools.stopProp(e);
				return false;
			}
		},
		key: {
			down: function(e){
				var kc = e.keyCode;
				if( kc == 38 || kc == 39 || kc == 40 || kc == 37 || kc == 65 || kc == 33 || kc == 34 || kc == 35 || kc == 36 || kc == 67 || kc == 83 ) tools.stopProp(e);

				if(e.shiftKey && select.shift1st){		select.shift = true;		display.all();	}

				if( kc == 38 || kc == 39 || kc == 40 || kc == 37 ){
					if(kc == 38){
						if(e.shiftKey)		events.key.select( 0,-1);
						else				display.s.t -= 30;
					}
					if(kc == 40){
						if(e.shiftKey)		events.key.select( 0, 1);
						else				display.s.t += 30;
					}
					if(kc == 39){
						if(e.shiftKey)		events.key.select( 1, 0);
						else				display.s.l += 30;
					}
					if(kc == 37){
						if(e.shiftKey)		events.key.select(-1, 0);
						else				display.s.l -= 30;
					}
					display.all();
					tools.stopProp(e);		return false;
				}				
				if(kc == 65 && e.ctrlKey){				select.selectAll(); 		display.all();			return false; }
				if(kc == 33 || kc == 34 || kc == 35 || kc == 36){
					if(kc == 33){	display.s.t -= Math.round(display.s.vh*0.8);	}
					if(kc == 34){	display.s.t += Math.round(display.s.vh*0.8);	}
					if(kc == 35){	display.s.t = display.s.tp.last();	}
					if(kc == 36){	display.s.t = 0;	}
					display.all();
					tools.stopProp(e);
					return false;
				}
				if( e.ctrlKey && ( kc == 67 || kc == 83) ){
					if(functions.keyDown)				functions.keyDown(e, link);		
					tools.stopProp(e);		
					return false;
				}
			},
			up: function(e){	if(!e.shiftKey && select.shift1st){		select.shift = false;		display.table();	}},
			blur: function(e){	if( select.shift1st){					select.shift = false;		display.table(); 	}},
			select: function(h, v){
				if(h == -1 && select.shift2nd.j != 0)						select.shift2nd.j -= 1;
				else if(h == 1 && select.shift2nd.j != _Table.c - 1)		select.shift2nd.j += 1;
				if(v == -1 && select.shift2nd.i != 0)						select.shift2nd.i -= 1;
				else if(v == 1 && select.shift2nd.i != _Table.r - 1)		select.shift2nd.i += 1;

				if(display.s.lp[select.shift2nd.j + 1] > display.s.l + display.s.vw)	display.s.l = display.s.lp[select.shift2nd.j + 1] - display.s.vw + 10;
				else if(display.s.lp[select.shift2nd.j] < display.s.l )					display.s.l = display.s.lp[select.shift2nd.j] - 10;

				if(display.s.tp[select.shift2nd.i + 1] > display.s.t + display.s.vh)	display.s.t = display.s.tp[select.shift2nd.i + 1] - display.s.vh + 10;
				else if(display.s.tp[select.shift2nd.i] < display.s.t )					display.s.t = display.s.tp[select.shift2nd.i] - 10;

				var p = get.sortedPosition.table(select.shift1st, select.shift2nd);
				select.selectTable(  p.t,  p.b,  p.l,  p.r,  false );
			}
		},
		out: {
			table: function(e){
				display.s.corn = {};
				display.table();
			}
		}
	}
	var exp = {
		xlsxExport: function(options){
			if(typeof options != 'object')					options = {};
			var result = { row: [], col: []};	
			var fi = _Table.r, li = 0, fj = _Table.r, lj = 0, ci = 0, cj = 0;
			if(options.select){
				for(var i = 0; i < select.table.length; i++){
					if( select.table[i].i[0] < fi )			fi = select.table[i].i[0];
					if( select.table[i].i[0] > li )			li = select.table[i].i[0];
					if( select.table[i].j[0] < fj )			fj = select.table[i].j[0];
					if( select.table[i].j[0] > lj )			lj = select.table[i].j[0];
				}
				if(select.table.length == 0){				fi = 0;		fj = 0;	}
				if(select.side.length != 0){				cj = _Side.c;
					for(var i = 0; i < select.side.length; i++){	if(select.side[i].j.last() < cj)	cj = select.side[i].j.last();	}		}
				if(select.top.length != 0){					ci = _Top.r;
					for(var i = 0; i < select.top.length; i++){		if(select.top[i].i.last() < ci)		ci = select.top[i].i.last();	}		}
			} else {
				fi = 0; li = _Table.r - 1;
				fj = 0; lj = _Table.c - 1;
			}
			for(var i = cj; i < _Side.c; i++)	result.col.push(_Side.w[i]);
			for(var i = ci; i < _Top.r; i++)	result.row.push(_Top.h[i]);
			for(var i = fj; i <= lj; i++)		{ if(_Top.branches[i].visible) result.col.push(_Top.branches[i].width); }
			for(var i = fi; i <= li; i++)		{ if(_Side.branches[i].visible) for(var j = 0; j < _Side.branches[i].rcount; j++) result.row.push(Math.round(_Side.branches[i].height)/_Side.branches[i].rcount); } 
	
			var rows = [[]];
			rows.last().push({ type: 'corner', rowspan: (_Top.r - ci), colspan: (_Side.c - cj), j: 0 });
	
			for(var i = 0; i < _Top.r; i++){	for(var j = 0; j < _Top.c; j++)	 _Top.visual[i][j].export = true;	}
			for(var i = ci; i < _Top.r; i++){
				var nj = _Side.c - cj;
				for(var j = fj; j <= lj; j++){
					if(!_Top.branches[j].visible)	continue;
					var cell = _Top.visual[i][j];
	
					if( cell.export && !options.split){
						var colSpan = 0;
						cell.j.forEach(function(item){  if(_Top.branches[item].visible) colSpan++;  });
						rows.last().push({ type: 'header', text: cell.obj.text, colspan: colSpan, rowspan: (cell.i.last() - i + 1), j: nj})
						cell.export = false;
					} else if(options.split){	rows.last().push({ type: 'header', text: cell.obj.text, colspan: 1, rowspan: 1, j: nj})}
					nj++;
				}
				rows.push([]);
			}
			for(var i = 0; i < _Side.r; i++){	for(var j = 0; j < _Side.c; j++)	 _Side.visual[i][j].export = true;	}
	
			for(var i = fi; i <= li; i++){
				if( !_Side.branches[i].visible )				continue;	
				if(!options.split){
					for(var j = cj; j < _Side.c; j++){
						var cell = _Side.visual[i][j];
						if(cell.export){
							var rowSpan = 0;
							cell.i.forEach(function(item){ if(_Side.branches[item].visible)	rowSpan += _Side.branches[item].rcount; });
	
							if(cell.j.last() == _Side.c - 1)	rows.last().push({ rowspan: rowSpan, colspan: (cell.j.last() - j + 1), j: (j - cj), text: cell.obj.text, type: 'header left' });
							else if(!setting.orientation)		rows.last().push({ rowspan: rowSpan, colspan: (cell.j.last() - j + 1), j: (j - cj), text: cell.obj.text, type: 'header vert' });
							else								rows.last().push({ rowspan: rowSpan, colspan: (cell.j.last() - j + 1), j: (j - cj), text: cell.obj.text, type: 'header' });						
							cell.export = false;
						}
					}
				}
				var rowc = _Side.branches[i].rcount;
	
				for(var k = 0; k < rowc; k++){
					if(options.split){		for(var j = cj; j < _Side.c; j++)		rows.last().push({ rowspan: 1, colspan: 1, j: (j - cj), text: _Side.visual[i][j].obj.text, type: 'header' });	}
					var nj = _Side.c - cj;
	
					for(var j = fj; j <= lj; j++){
						if(!_Top.branches[j].visible)								continue;
						if(_Table.cells[i][j].visual[k]){

							var sep = (_Side.branches[i].obj.type == undefined || _Top.branches[j].obj.type == undefined);
							var item = _Table.cells[i][j].visual[k];
							var text = _Table.cells[i][j].obj[( item.type == 3) ? 0 : item.type];
							var type = item.type, round;

							if(type == 0 && _Table.cells[i][j].round == 2){				type = 5;	round = setting.round[2];
							} else if(type == 3 && _Table.cells[i][j].round == 2){		type = 6;	round = setting.round[2];							
							} else if(type != 0 && type != 3)							round = setting.round[1];
							else 														round = setting.round[0];

							if(text === null)							text = (setting.showZero && !sep) ? 0 : ' '; 
							else if(text === 0 && setting.hideZero)		text = ' ';
							else if(isNaN(text) || text == 'NaN' )		text = ' ';
							else										text = tools.roundPlus(text, round);

							rows.last().push({ j: nj, type: type, text: text});

						} else rows.last().push({ j: nj, type: 0, text: ' '});
						nj++;
					}
					rows.push([]);
				}
			}
			rows.length = rows.length - 1;
			result.array = rows;
	
			result.round_types = [setting.round[0],setting.round[1],setting.round[1],setting.round[0], 0, setting.round[2], setting.round[2]];
			result.units_types = (setting.showPercent) ? ['','%','%', ''] : ['','','',''];
	
			return result;
		},
		htmlExport: function(options){
			if(typeof options != 'object')					options = {};
			if(select.table.length == 0)					options.select = false;

			var html = '<!DOCTYPE HTML><html><head><style> th { background: #F1F1F1; }</style></head><body>';

			var fi = _Table.r, li = 0, fj = _Table.r, lj = 0, ci = 0, cj = 0;
			if(options.select){
				for(var i = 0; i < select.table.length; i++){
					if( select.table[i].i[0] < fi )			fi = select.table[i].i[0];
					if( select.table[i].i[0] > li )			li = select.table[i].i[0];
					if( select.table[i].j[0] < fj )			fj = select.table[i].j[0];
					if( select.table[i].j[0] > lj )			lj = select.table[i].j[0];
				}
				if(select.table.length == 0){	fi = 0; fj = 0;	}
				if(options.side && select.side.length != 0){
					cj = _Side.c;
					for(var i = 0; i < select.side.length; i++){	if(select.side[i].j.last() < cj)	cj = select.side[i].j.last();	}
				}
				if(options.top && select.top.length != 0){
					ci = _Top.r;
					for(var i = 0; i < select.top.length; i++){		if(select.top[i].i.last() < ci)		ci = select.top[i].i.last();	}
				}
			} else {
				fi = 0; li = _Table.r - 1;
				fj = 0; lj = _Table.c - 1;
			}

			html += '<table border="1" padding="1px" style="vertical-align: middle; font-family: Verdana, serif; font-size: 11px; border-collapse: collapse; text-align: center; "><tbody>    ';

			if(options.top){
				var corner = false;
				html += '<tr>'; 
				if(options.side){
					html += '<th' + ( (options.color) ? ' style="background:#F1F1F1;"' : '' )
							+ ( (_Top.r - ci > 1 ) ? (' rowspan="' + (_Top.r - ci) + '"') : '' )
							+ ( (_Side.c - cj > 1 ) ? (' colspan="' + (_Side.c - cj) + '" />') : ' />' );
				}

				for(var i = 0; i < _Top.r; i++){	for(var j = 0; j < _Top.c; j++)	 _Top.visual[i][j].export = true;	}

				for(var i = ci; i < _Top.r; i++){
					for(var j = fj; j <= lj; j++){
						if(!_Top.branches[j].visible)	continue;
						var cell = _Top.visual[i][j];

						if( cell.export && !options.split){
							var colSpan = 0;
							cell.j.forEach(function(item){  if(_Top.branches[item].visible) colSpan++;  });

							html += '<th' + ( (options.color) ? ' style="background:#F1F1F1;"' : '' )
								+ ( ((cell.i.last() - i + 1) > 1 ) ? (' rowspan="' + (cell.i.last() - i + 1) + '"') : '' )
								+ ( (colSpan > 1 ) ? (' colspan="' + (colSpan) + '">') : '>' )
								+ cell.obj.text + '</th>';
							cell.export = false;
						} else if(options.split){	html += '<th' + ( (options.color) ? ' style="background:#F1F1F1;">' : '>' )	+ cell.obj.text + '</th>';		}
					}
					html += '</tr><tr>';
				}
			}
			html = html.substring(0, html.length - 4);
			if(options.side){ select.side.forEach(function(item){ item.export = true; });	}
			for(var i = 0; i < _Side.r; i++){	for(var j = 0; j < _Side.c; j++)	 _Side.visual[i][j].export = true;	}


			html += '<tr>';
			for(var i = fi; i <= li; i++){
				if( !_Side.branches[i].visible ) continue;

				if(options.side && !options.split){
					for(var j = cj; j < _Side.c; j++){
						var cell = _Side.visual[i][j];
						if(cell.export){
							var rowSpan = 0;
							cell.i.forEach(function(item){ if(_Side.branches[item].visible) rowSpan += _Side.branches[item].rcount; });

							html += '<th' + ( (options.color) ? ' style="background:#F1F1F1;"' : '' )
								+ ( (rowSpan > 1 ) ? (' rowspan="' + (rowSpan) + '"') : '' )
								+ ( ((cell.j.last() - j + 1) > 1 ) ? (' colspan="' + (cell.j.last() - j + 1) + '">') : '>' )
								+ cell.obj.text + '</th>';
							cell.export = false;
						}
					}
				}

				var rows = _Side.branches[i].rcount;

				for(var k = 0; k < rows; k++){
					if(options.side && options.split){
						for(var j = cj; j < _Side.c; j++)		html += '<th' + ( (options.color) ? ' style="background:#F1F1F1;">' : '>' ) + _Side.visual[i][j].obj.text + '</th>';
					}
					for(var j = fj; j <= lj; j++){
						if(_Table.cells[i][j].visual[k]){

							var sep = (_Side.branches[i].obj.type == undefined || _Top.branches[j].obj.type == undefined);
							var item = _Table.cells[i][j].visual[k];
							var text = _Table.cells[i][j].obj[( item.type == 3) ? 0 : item.type];
							var type = item.type, round;

							if(type == 0 && _Table.cells[i][j].round == 2){				type = 5;	round = setting.round[2];
							} else if(type == 3 && _Table.cells[i][j].round == 2){		type = 6;	round = setting.round[2];							
							} else if(type != 0 && type != 3)							round = setting.round[1];
							else 														round = setting.round[0];

							if(text === null)							text = (setting.showZero && !sep) ? 0 : ' '; 
							else if(text === 0 && setting.hideZero)		text = ' ';
							else if(isNaN(text))						text = ' ';
							else										text = tools.roundPlus(text, round);
							
							if((type == 1 || type == 2) && setting.showPercent && text != ' ')	text += '%'; 

							html += '<td' + ( (options.color) ? (' style="background:' + defaultBack.table[2][type] + '">') : '>' ) + text + '</td>';

						} else html += '<td></td>';
					}
					html += '</tr><tr>';
				}
			}
			html = html.substring(0, html.length - 4);
			html += '</tbody></table></body></html>';
			return html;
		}
	}

	var create = new function(){

		this.setTable = function(top, side, table){

			removeTable();

			if(top == undefined || side == undefined || table == undefined) return;

			setBranches(top, _Top.tree);
			setBranches(side, _Side.tree);
			_Top.branches = create.getSignBranches(_Top.tree)
			_Side.branches = create.getSignBranches(_Side.tree);

			_Top.r	= create.getDepth(_Top.tree) - 1;
			_Side.c	= create.getDepth(_Side.tree) - 1;
			_Top.c	= _Table.c = _Top.branches.length;
			_Side.r	= _Table.r = _Side.branches.length;

			_Top.branches.forEach(function(item, i){item.index = i;});
			_Side.branches.forEach(function(item, i){item.index = i;});

			normalizeIntupTable(table);
			setTable(table);

			setSize();
			create.autoSize();
		}
		function removeTable(){
			_Side.branches.forEach(function(item, i) { size.table.h[i] = item.dh; });
			_Top.branches.forEach(function(item, i) { size.table.w[i] = item.dw; });

			if(_Side.dw.length < size.corner.w.length ){	for(var i = 1; i <= _Side.dw.length; i++ ) 	size.corner.w[size.corner.w.length - i] = _Side.dw[_Side.dw.length - i] 
			} else 	size.corner.w = _Side.dw;
			if(_Top.dh.length < size.corner.h.length ){		for(var i = 1; i <= _Top.dh.length; i++ )	size.corner.h[size.corner.h.length - i] = _Top.dh[_Top.dh.length - i]
			} else	size.corner.h = _Top.dh;

			_Side.tree.children = [];	_Top.tree.children = [];
			_Top.c = _Top.r = _Table.c = _Table.r = _Side.c = _Side.r = 0;
			select.table = [];			select.side = [];			select.top = [];
			sort.side = {};				sort.top = {};
		}
		function setSize(){
			_Top.dh = [];				_Side.dw = [];

			_Top.branches.forEach(  function(item, i){ item.dw = (typeof size.table.w[i] == 'number') ? size.table.w[i] : size.w } );
			_Side.branches.forEach( function(item, i){ item.dh = (typeof size.table.h[i] == 'number') ? size.table.h[i] : size.h } );

			for(var i = 1; i <= _Side.c; i++ ){
				if( size.corner.w.length - i >= 0)			_Side.dw[_Side.c - i] = size.corner.w[size.corner.w.length - i];
				else										_Side.dw[_Side.c - i] = size.w;
			}
			for(var i = 1; i <= _Top.r; i++ ){
				if( size.corner.h.length - i >= 0)			_Top.dh[_Top.r - i] = size.corner.h[size.corner.h.length - i];
				else										_Top.dh[_Top.r - i] = size.h;
			}
		}

		this.autoSize = function(){
			var more = (setting.round[2] > setting.round[0]) ? 2 : 0;
			_Top.branches.forEach(function(item, j){
				var width = item.dw, symbol = 0;
				for(var i = 0; i < _Table.r; i++){
					_Table.cells[i][j].base = ((_Side.branches[i].obj.base || _Top.branches[j].obj.base) && !(_Side.branches[i].obj.type == undefined || _Top.branches[j].obj.type == undefined)) ? 1 : 0;

					_Table.cells[i][j].obj.forEach( function(cell, k){
						var percent = (setting.showPercent && (k == 1 || k == 2));
						var round;

						var rSide = (_Side.branches[i].obj.type == 3 || _Side.branches[i].obj.type == 8) ? 2 : 0;
						var rTop = (_Top.branches[j].obj.type == 3 || _Top.branches[j].obj.type == 8) ? 2 : 0;

						if(k == 0)		round = (rSide != rTop) ? more : rSide;
						else 			round = 1;


						var ns = (tools.roundPlus(cell, setting.round[round]) + ((percent) ? '%%' : '') ).replace('.', '').length;
						if(symbol < ns)	symbol = ns;
						if(k == 0)		_Table.cells[i][j].round = round;
					});
				}
				if(symbol*size.numeral + size.dot + 8 > width )		width = symbol*size.numeral + size.dot + 8;
				item.dw = Math.round(width);
			});
		}

		this.getDepth = function(tree){
			var result = 1;
			if(tree.children){
				var max = 0;
				for(var i = 0; i < tree.children.length; i++){
					var topical = create.getDepth(tree.children[i]);
					if(topical > max)		max = topical;
				}
				result += max;
			}
			return result;
		}
		this.getSignBranches = function(tree){
			var result = [];
			if(tree.children){
				for(var i = 0; i < tree.children.length; i++) 		result = result.concat(create.getSignBranches(tree.children[i]));
			} else result.push(tree);
			return result;
		}
		function setBranches(items, parent){
			if(!Array.isArray(items))			items = [items];
			if(parent.children == undefined)	parent.children = [];

			for(var i = 0; i < items.length; i++){
				var branch = {visible: true, obj: items[i], parent: parent, base: items[i].base,  unsort: items[i].unsort};
				if(items[i].type == undefined)	branch.aShow = items[i].aShow;
				parent.children.push(branch);

				if(items[i].children != undefined)	setBranches(items[i].children, branch);
			}
		}
		function normalizeIntupTable(table){
			for(var i = 0; i < _Table.r; i++){
				if(!Array.isArray(table[i]))		table[i] = [];
				for(var j = 0; j < _Table.c; j++){
					if(!Array.isArray(table[i][j]))	table[i][j] = [null];
				}
			}
		}		
		function setTable(table){
			_Table.cells = [];

			for(var i = 0; i < _Table.r; i++){
				_Table.cells[i] = [];
				_Side.branches[i].types = [];
				_Side.branches[i].empty = true;

				for(var j = 0; j < _Table.c; j++){					
					_Table.cells[i][j] = { obj: table[i][j] };
			
					for(var k = 0; k < table[i][j].length; k++){
						if(typeof table[i][j][k] == 'number' && table[i][j][k] != 0 && !(!_Side.branches[i].base && _Top.branches[j].base))		_Side.branches[i].empty = false;
						if(!_Side.branches[i].types[k])																							_Side.branches[i].types[k] = true;
					}
				}
			}
			for(var i = 0; i < _Table.c; i++){
				_Top.branches[i].types = [];
				_Top.branches[i].empty = true;

				for(var j = 0; j < _Table.r; j++){

					for(var k = 0; k < table[j][i].length; k++){
						if(typeof table[j][i][k] == 'number' && table[j][i][k] != 0 && !(!_Top.branches[i].base && _Side.branches[j].base))		_Top.branches[i].empty = false;
						if(!_Top.branches[i].types[k])																							_Top.branches[i].types[k] = true;
					}
				}
			}
		}
	}
	var remake = new function(){
		this.reBuild = function(){

			_Side.visual = [];
			_Side.tree.children.forEach( function(item){ reBuildSide(item, 0); } );

			_Top.visual = [];
			for(var i = 0; i < _Top.r; i++) _Top.visual[i] = [];
			_Top.tree.children.forEach( function(item){ reBuildTop(item, 0); } );

			_Top.branches = create.getSignBranches(_Top.tree)
			_Side.branches = create.getSignBranches(_Side.tree);

			remake.reDrow();
		}
		function reBuildSide(item, level){
			var newLevel;
			item.i = [];			item.j = [];

			if(item.children){
				newLevel = _Side.c - create.getDepth(item) + 1;
				item.children.forEach( function(branch){item.i = item.i.concat(reBuildSide(branch, newLevel));} );
			} else {
				newLevel = _Side.c;
				item.i[0] = _Side.visual.length;
				_Side.visual.push([]);
			}

			for(;level < newLevel; level++){
				item.i.forEach( function(index) { _Side.visual[index][level] = item; });
				item.j.push(level);
			}
			return item.i;
		}
		function reBuildTop(item, level){
			var newLevel;
			item.i = [];			item.j = [];

			if(item.children){
				newLevel = _Top.r - create.getDepth(item) + 1;
				item.children.forEach( function(branch){item.j = item.j.concat(reBuildTop(branch, newLevel));} );
			} else {
				newLevel = _Top.r;
				item.j[0] = _Top.visual[_Top.r - 1].length;
			}

			for(;level < newLevel;level++){
				item.j.forEach( function(index){ _Top.visual[level][index] = item; });
				item.i.push(level);
			}
			return item.j;
		}

		this.reDrow = function(){
			hideBranch(_Side.tree);		hideBranch(_Top.tree);
			_Side.tree.visible = true;	_Top.tree.visible = true;

			_Side.branches.forEach( function(item){ if( ( !(setting.hideRow && item.empty ) || item.aShow || item.obj.type == undefined ) && !(item.aShow === false)) showBranch(item);  } );
			_Top.branches.forEach(  function(item){ if( ( !(setting.hideCol && item.empty ) || item.aShow || item.obj.type == undefined ) && !(item.aShow === false)) showBranch(item);  } );

			_Side.branches.forEach( function(item){ setHeight(item); } );
			_Top.branches.forEach(  function(item){ setWidth(item); } );

			setCoords();			
			setTable();

			setBoldLine(_Side.branches, _Side.tree);
			setBoldLine(_Top.branches, _Top.tree);

			display.generate();
		}
		function hideBranch(tree){
			tree.visible = false;
			if(tree.children)			tree.children.forEach( function(item){ hideBranch(item); });
		}
		function showBranch(tree){
			while(tree){
				tree.visible = true;
				tree = tree.parent;
			}
		}
		function setTable(){
			for(var i = 0; i < _Table.r; i++){
				for(var j = 0; j < _Table.c; j++){
					var cell = _Table.cells[i][j];
					cell.i = [i];	cell.j = [j];

					if(!_Side.branches[i].visible || !_Top.branches[j].visible) continue;

					cell.visual = [];
					var sep = (_Side.branches[i].obj.type == undefined || _Top.branches[j].obj.type == undefined);
					cell.obj.forEach( function(item, type){ 
						if(setting.showType[type]){

							var text, percent = (setting.showPercent && (type == 1 || type == 2)), round, width = _Top.branches[j].width - 6;
							if(type == 0)		round = setting.round[cell.round];
							else				round = setting.round[1];

							if(item === null)							text = (setting.showZero & !sep) ? '0' : ' '; 
							else if(item === 0 && setting.hideZero)		text = ' ';
							else										text = tools.roundPlus(item, round) + '';

							if(((text.length - 1)*size.numeral + size.dot) < width ){			width -= ((text.length - 1)*size.numeral + size.dot);
							} else {	width = 0;						text = text.substring(0, Math.floor((width - size.dot)/size.numeral + 1));	}

							if(percent && text != ' ' && width >= size.percent)	text = text + '%';
							else if(percent && text != ' ' )			width = 0;

							if(width == 0 && setting.sharpOverflow){
								text = '';
								for(var s = 0, end = Math.round((_Top.branches[j].width - 6)/size.sharp); s < end; s++ )	text += '#';
							}

							cell.visual.push({text: text.replace(/\./g, setting.separator), type: ((type == 0 && cell.base) ? 3 : type) } );
						} 
					} );
					if(!cell.visual.length){

						_Side.branches[i].floatType = true;			_Top.branches[j].floatType = true;

						var text = cell.obj[0], width = _Top.branches[j].width - 6, round = setting.round[cell.round];

						if(text === null)							text = (setting.showZero & !sep) ? '0' : ' '; 
						else if(text === 0 && setting.hideZero)		text = ' ';
						else										text = tools.roundPlus(text, round) + '';	

						if(((text.length - 1)*size.numeral + size.dot) > width ){
							if(setting.sharpOverflow){
								text = ''
								for(var s = 0, end = Math.round((_Top.branches[j].width - 8)/size.sharp); s < end; s++ )	text += '#';
							} else		text = text.substring(0, Math.floor((width - size.dot)/size.numeral + 1));
						}
						cell.visual.push({text: text.replace(/\./g, setting.separator), type: ((cell.base) ? 3 : 0) } );
					}
					cell.height = ((_Side.branches[i].h - 1 )/cell.visual.length);
				}
			}
		}

		function setHeight(item){
			if(item.visible){
				item.rcount = 0;
				for(var i = 0; i < 3; i++)	if(setting.showType[i] && item.types[i])	item.rcount++;
				if(!item.rcount)			item.rcount = 1;

				if(item.dh >= item.rcount*size.minh)		item.h = item.dh;
				else										item.h = item.rcount*size.minh;

			} else											item.h = 0;
		}
		function setWidth(item){
			if(item.visible){
				if(item.dw > size.minw)						item.w = item.dw;
				else										item.w = size.minw;
			} else 											item.w = 0;
		}

		function setCoords(){
			display.s.lp = [0]; //left position
			_Top.branches.forEach( function(item, i){ display.s.lp.push( display.s.lp[i] + item.w ); } );

			display.s.tp = [0];	//top position
			_Side.branches.forEach( function(item, i){ display.s.tp.push( display.s.tp[i] + item.h ); } );

			_Side.w = [],	_Top.h = [];
			_Side.dw.forEach(function(item, i){	if(item < size.minw) _Side.w[i] = size.minw; else _Side.w[i] = item; });
			_Top.dh.forEach(function(item, i){	if(item < size.minh) _Top.h[i] = size.minh; else _Top.h[i] = item; });

			_Side.lp = [0],	_Top.tp = [0];
			_Side.w.forEach( function(item, i){ _Side.lp.push( _Side.lp[i] + item ); } );
			_Top.h.forEach( function(item, i){ _Top.tp.push( _Top.tp[i] + item ); } );
			_Table.ctx.font = size.text + "px " + size.font;
			setCoordsSide(_Side.tree);			setCoordsTop(_Top.tree);
		}
		function setCoordsSide(tree){
			if(tree.i || tree.j){
				tree.height = 0;
				tree.i.forEach(function(i){tree.height += _Side.branches[i].h;});
				tree.width = 0;
				tree.j.forEach(function(i){tree.width += _Side.w[i];});
				if(!setting.orientation)	cutText(tree.obj.text, tree.height - 5, tree.width - 4, tree);
				else						cutText(tree.obj.text, tree.width - 5, tree.height - 4, tree);
			}
			if(tree.children){		for(var i = 0; i < tree.children.length; i++) setCoordsSide(tree.children[i]);
			} else	{
				if(tree == sort.side.cell)	cutText(tree.obj.text, tree.width - 15, tree.height - 4, tree); 
				else						cutText(tree.obj.text, tree.width - 5, tree.height - 4, tree);
			}
		}
		function setCoordsTop(tree){
			if(tree.i || tree.j){
				tree.height = 0;
				tree.i.forEach(function(i){tree.height += _Top.h[i]; });
				tree.width = 0;
				tree.j.forEach(function(i){tree.width += _Top.branches[i].w; });
				cutText(tree.obj.text, tree.width - 5, tree.height - 4, tree);
			}
			if(tree.children){ for(var i = 0; i < tree.children.length; i++)	setCoordsTop(tree.children[i]); }
			else if(tree == sort.top.cell)										cutText(tree.obj.text, tree.width - 15, tree.height - 4, tree);
		}
		function cutText(text, width, height, tree){
			if(width < 10 || height < size.text) return [{text:'', width: 0}]
			var row = Math.floor(height/size.text), textArray = [], tooltip = false;
			var fullWidth = _Table.ctx.measureText(text).width;
			var exemplaryLength = (text.length) ? Math.floor( width / (fullWidth / text.length) ) : 0;

			for(var i = 0; i < row; i++){
				var newLength = exemplaryLength;
				if(newLength < text.length){
					var bit = _Table.ctx.measureText(text.substring(0, newLength)).width;
					while(bit > width){
						newLength--;
						bit = _Table.ctx.measureText(text.substring(0, newLength)).width;
					}
					textArray.push( {text: text.substring(0, newLength)} );
					text = text.substring(newLength, text.length);
				} else {
					textArray.push({text: text});
					text = '';
					break;
				}
			}
			if(text.length > 0){
				tooltip = true;
				textArray.last().text = textArray.last().text.substring(0, textArray.last().text.length - 2) + '...';
			} else if(textArray.length == 1)	textArray[0].width = Math.round(fullWidth/2) + 2;

			var bit = Math.round((height - size.text*textArray.length)/2);
			var half = size.text/2;
			textArray.forEach(function(item, i){ item.position = bit + Math.round(half*(1 + i*2)) + 1; });

			tree.textArray = textArray;
			tree.tooltip = tooltip;
		}
		function setBoldLine(branches, tree){
			branches.forEach(function(item){				item.line = false;			});
			for(var i = 0; i < branches.length - 1; i++){	if(branches[i].parent != branches[i + 1].parent || branches[i].parent == tree)		branches[i].line = true;			}
			if(branches.length != 0)	branches.last().line = true;
		}
	}
	var display = new function(){

		var s = this.s = { l: 0, t: 0, corn: {} }; //s - self, l - left (viewport left coord), t - top (viewport top coord), vh - viewport height, vw - viewport width, corn - active state of the control 

		this.generate = function(){

			var x = (((_Side.w.length) ? _Side.lp.last() : 100)/size.dpi);
			var y = (((_Top.h.length) ? _Top.tp.last() : 100)/size.dpi);

			var height = (container.clientHeight - y); //viewport height
			var width  = (container.clientWidth - x);//veiwport width

			s.vh = height*size.dpi;
			s.vw = width*size.dpi;

			if( (height < 0) || (width < 0) )	return;

			_Table.html.width = _Top.html.width = s.vw;
			_Table.html.height = _Side.html.height = s.vh;
			_Table.html.style.width = _Top.html.style.width = width + 'px';
			_Table.html.style.height = _Side.html.style.height = height + 'px';

			_Top.html.height = s.y = y*size.dpi;		_Corner.html.style.height = (y - 1) + 'px';
			_Side.html.width = s.x = x*size.dpi;		_Corner.html.style.width = (x - 1) + 'px';

			s.vh += -18;
			s.vw += -18;

			if(s.l > (s.lp.last() - s.vw))	s.l = (s.lp.last() - s.vw > 0) ? (s.lp.last() - s.vw) : 0 ;
			if(s.t > (s.tp.last() - s.vh))	s.t = (s.tp.last() - s.vh > 0) ? (s.tp.last() - s.vh) : 0 ;

			_Table.coords = _Table.html.getBoundingClientRect();
			_Side.coords = _Side.html.getBoundingClientRect();
			_Top.coords = _Top.html.getBoundingClientRect();

			display.all();
		}

		this.table = function(){
			if( s.t > (s.tp.last() - s.vh)) s.t = s.tp.last() - s.vh;				if( s.t < 0) s.t = 0;
			if( s.l > (s.lp.last() - s.vw)) s.l = s.lp.last() - s.vw;				if( s.l < 0) s.l = 0;

			var c = _Table.ctx;

			c.fillStyle = '#FFF';			c.fillRect(0, 0, s.vw + 18, s.vh + 18);	// clear canvas
			c.fillStyle = '#AAA';			c.fillRect(0, 0, ((s.vw > s.lp.last()) ? s.lp.last() : s.vw), ((s.vh > s.tp.last()) ? s.tp.last() : s.vh)); // set background borders

			var height	= (s.vh > s.tp.last()) ? s.tp.last() : s.vh ;
			var width	= (s.vw > s.lp.last()) ? s.lp.last() : s.vw ;

			c.textBaseline = "top";
			c.textAlign = "right";
			c.font = size.text + "px " + size.font;

			s.cols = [];					s.rows = [];
			for(var i = 0; i < _Table.c; i++){	if((s.lp[i] >= s.l && s.lp[i] <= (s.l + s.vw)) || (s.lp[i + 1] >= s.l && s.lp[i + 1] <= (s.l + s.vw)) || (s.lp[i] <= s.l && s.lp[i + 1] >= s.l + s.vw))	s.cols.push(i);	}
			for(var i = 0; i < _Table.r; i++){	if((s.tp[i] >= s.t && s.tp[i] <= (s.t + s.vh)) || (s.tp[i + 1] >= s.t && s.tp[i + 1] <= (s.t + s.vh)) || (s.tp[i] <= s.t && s.tp[i + 1] >= s.t + s.vh))	s.rows.push(i); }

			s.rows.forEach(function(i){
				s.cols.forEach(function(j){
					if(!_Top.branches[j].visible || !_Side.branches[i].visible)		return;
					var back = 2, cell = _Table.cells[i][j];
					if(select.shift && i == select.shift1st.i && j == select.shift1st.j){
						c.fillStyle = '#465360';
						c.fillRect( (s.lp[j] - s.l - 1), (s.tp[i] - s.t - 1), _Top.branches[j].w + 1, _Side.branches[i].h + 1);
					}

					if(_Table.cells[i][j].hover)		back = 0;
					else if(_Table.cells[i][j].select)	back = 1;
					else 								back = 2;
					
					for(var k = 0; k < cell.visual.length; k++){
						c.fillStyle = defaultBack.table[back][cell.visual[k].type];
						c.fillRect( (s.lp[j] - s.l), (s.tp[i] - s.t + cell.height*k), _Top.branches[j].w - 1, cell.height);
						c.fillStyle = '#000';
						c.fillText(cell.visual[k].text, (s.lp[j + 1] - s.l - 4), (s.tp[i] - s.t + cell.height*k + 3 ));
					}
				});
			});
			c.fillStyle = '#555';

			s.rows.forEach(function(i){			
				if(!_Side.branches[i].visible)		drawDashLine(c, '#555', '#fff', 0, s.tp[i + 1] - 0.5 - s.t, (s.vw > s.lp.last()) ? s.lp.last() : s.vw, s.tp[i + 1] - 0.5 - s.t);	
				else if(_Side.branches[i].line)		c.fillRect(0, s.tp[i + 1] - 1 - s.t, ((s.vw > s.lp.last()) ? s.lp.last() : s.vw), 1);			});
			s.cols.forEach(function(i){
				if(!_Top.branches[i].visible)		drawDashLine(c, '#555', '#fff', s.lp[i + 1] - 0.5 - s.l, 0, s.lp[i + 1] - 0.5 - s.l, (s.vh > s.tp.last()) ? s.tp.last() : s.vh);
				else if(_Top.branches[i].line)		c.fillRect(s.lp[i + 1] - 1 - s.l, 0, 1, ((s.vh > s.tp.last()) ? s.tp.last() : s.vh)); 			});

			c.fillStyle = '#F1F1F1';				c.fillRect(0, s.vh, s.vw + 18, 18);	c.fillRect(s.vw, 0, 18, s.vh);
			c.fillStyle = '#aaa'

			if(s.lp.last() > s.vw){
				scroll.h.w = ((( s.vw - 36 )*( s.vw ))/s.lp.last() > 20) ? (( s.vw - 36 )*( s.vw ))/s.lp.last() : 20;
				scroll.h.l = ((( s.vw - 36 - scroll.h.w)*( s.l ))/(s.lp.last() - s.vw )) + 18;
				scroll.h.t = s.vh;

				c.fillRect( scroll.h.l + 2, scroll.h.t + 2, scroll.h.w - 4, 14);

				if(s.corn.l){	c.fillStyle = '#bbb';	c.fillRect( 0, s.vh, 18, 18);	}
				if(s.corn.r){	c.fillStyle = '#bbb';	c.fillRect( s.vw - 18, s.vh, 18, 18);	}

				c.fillStyle = '#333';
			} else scroll.h = {};

			drawCircuit(c, null, [ [ 11, s.vh + 5], [ 7, s.vh + 9], [ 11, s.vh + 13] ]);
			drawCircuit(c, null, [ [ s.vw - 11, s.vh + 5], [ s.vw - 7, s.vh + 9], [ s.vw - 11, s.vh + 13] ]);

			c.fillStyle = '#aaa';
			if(s.tp.last() > s.vh){
				scroll.v.h = ((( s.vh - 36 )*( s.vh ))/s.tp.last() > 20) ? (( s.vh - 36 )*( s.vh ))/s.tp.last() : 20;
				scroll.v.t = ((( s.vh - 36 - scroll.v.h)*( s.t ))/(s.tp.last() - s.vh )) + 18;
				scroll.v.l = s.vw;
				
				c.fillRect( scroll.v.l + 2, scroll.v.t + 2, 14, scroll.v.h - 4);

				if(s.corn.t){	c.fillStyle = '#bbb';	c.fillRect( s.vw, 0, 18, 18);	}
				if(s.corn.b){	c.fillStyle = '#bbb';	c.fillRect( s.vw, s.vh - 18, 18, 18);	}

				c.fillStyle = '#333';
			} else scroll.v = {};

			drawCircuit(c, null, [ [ s.vw + 5, 11], [ s.vw + 9, 7], [ s.vw + 13, 11] ]);
			drawCircuit(c, null, [ [ s.vw + 5, s.vh - 11], [ s.vw + 9, s.vh - 7], [ s.vw + 13, s.vh - 11] ]);

			c.fillStyle = '#aaa';				c.fillRect( 0, s.vh - 1, s.vw, 1 );	c.fillRect( s.vw - 1, 0, 1, s.vh );
		}

		this.top = function(){
			var c = _Top.ctx;
			var back = (select.click == _Top) ? defaultBack.headers[0] : defaultBack.headers[1];

			c.fillStyle = '#f1f1f1';			c.fillRect(0, 0, s.vw, s.y); // clear canvas
			c.fillStyle = '#555';				c.fillRect(0, 0, ((s.vw > s.lp.last()) ? s.lp.last() : s.vw), _Top.tp.last()); // set background borders

			s.cols.forEach( function(j){		for(var i = 0; i < _Top.r; i++)		_Top.visual[i][j].displayed = false;	});

			c.textBaseline = "middle";
			c.textAlign = "center";
			c.font = size.text + "px " + size.font;

			s.cols.forEach( function(j){		for(var i = 0; i < _Top.r; i++) { 
				var cell = _Top.visual[i][j];
				if(cell.displayed) continue;
				if(!cell.visible){
					drawDashLine(c, '#000', '#f1f1f1', s.lp[cell.j.last() + 1] - 0.5 - s.l, _Top.tp[cell.i[0]], s.lp[cell.j.last() + 1] - 0.5 - s.l, _Top.tp[cell.i.last() + 1]  );
					continue;
				}
				cell.displayed = true;

				if(cell.hover)			c.fillStyle = back[0];
				else if(cell.select)	c.fillStyle = back[1];
				else					c.fillStyle = back[2];

				c.fillRect( (s.lp[cell.j[0]] - s.l), _Top.tp[cell.i[0]], cell.width - 1, cell.height - 1 );
				c.fillStyle = '#000';	

				if(s.lp[cell.j[0]] + cell.width/2 - cell.textArray[0].width < s.l){
					if((s.lp[cell.j[0]] + cell.width - cell.textArray[0].width*2) > s.l )	c.fillText(cell.textArray[0].text, (cell.textArray[0].width), _Top.tp[cell.i[0]] + cell.textArray[0].position);
					else																	c.fillText(cell.textArray[0].text, (s.lp[cell.j[0]] + cell.width - s.l - cell.textArray[0].width), _Top.tp[cell.i[0]] + cell.textArray[0].position);
				} else if((s.lp[cell.j[0]] + cell.width/2 + cell.textArray[0].width) > (s.l + s.vw)){
					if((s.lp[cell.j[0]] + cell.textArray[0].width*2) > (s.l + s.vw))		c.fillText(cell.textArray[0].text, (s.lp[cell.j[0]] - s.l + cell.textArray[0].width), _Top.tp[cell.i[0]] + cell.textArray[0].position);
					else																	c.fillText(cell.textArray[0].text, (s.vw - cell.textArray[0].width), _Top.tp[cell.i[0]] + cell.textArray[0].position);
				} else	{
					if(cell != sort.top.cell){	cell.textArray.forEach( function(item){ 	c.fillText(item.text,((s.lp[cell.j[0]] - s.l) + cell.width/2), _Top.tp[cell.i[0]] + item.position); } );
					} else {					cell.textArray.forEach( function(item){		c.fillText(item.text,((s.lp[cell.j[0]] - s.l) + cell.width/2 - 5), _Top.tp[cell.i[0]] + item.position); } );

						var y = _Top.tp[cell.i[0]] + Math.round(cell.height/2),	x = s.lp[cell.j.last() + 1] - s.l - 6;

						if(sort.top.direction)		drawCircuit(c, defaultBack.sort[(sort.top.type == 0 && cell.base) ? 3 : sort.top.type], [ [ x - 4, y - 3], [ x, y + 3], [ x + 4, y - 3] ]);
						else						drawCircuit(c, defaultBack.sort[(sort.top.type == 0 && cell.base) ? 3 : sort.top.type], [ [ x - 4, y + 3], [ x, y - 3], [ x + 4, y + 3] ]);
					}
				}
			}});
			c.fillStyle = '#f1f1f1';			c.fillRect( s.vw, 0, 18, s.y );
			c.fillStyle = '#aaa';				c.fillRect( s.vw - 1, 0, 1, s.y );
		}

		this.side = function(){
			var c = _Side.ctx;
			var back = (select.click == _Side) ? defaultBack.headers[0] : defaultBack.headers[1];

			c.fillStyle = '#f1f1f1';			c.fillRect(0, 0, s.x, s.vh); // clear canvas
			c.fillStyle = '#555';				c.fillRect(0, 0, _Side.lp.last(), ((s.vh > s.tp.last()) ? s.tp.last() : s.vh) ); // set background borders

			s.rows.forEach( function(j){		for(var i = 0; i < _Side.c; i++)			_Side.visual[j][i].displayed = false;	});
			c.textBaseline = "middle";
			c.textAlign = "left";
			c.font = size.text + "px " + size.font;

			s.rows.forEach( function(i){		for(var j = 0; j < _Side.c; j++) {
				var cell = _Side.visual[i][j];
				if(cell.displayed) continue;
				if(!cell.visible){
					drawDashLine(c, '#000', '#f1f1f1', _Side.lp[cell.j[0]], s.tp[cell.i.last() + 1] - 0.5 - s.t, _Side.lp[cell.j.last() + 1], s.tp[cell.i.last() + 1] - 0.5 - s.t );
					continue;
				}
				cell.displayed = true;

				if(cell.hover)			c.fillStyle = back[0];
				else if(cell.select)	c.fillStyle = back[1];
				else					c.fillStyle = back[2];

				c.fillRect( (_Side.lp[cell.j[0]]), (s.tp[cell.i[0]] - s.t), cell.width - 1, cell.height - 1 );
				c.fillStyle = '#000';	
				if(cell.j.last() + 1 == _Side.c){
					cell.textArray.forEach( function(item){ c.fillText(item.text, _Side.lp[cell.j[0]] + 2, (s.tp[cell.i[0]] - s.t) + item.position); } );
					if(cell == sort.side.cell){
						var x = _Side.lp[cell.j.last() + 1] - 9, y = s.tp[cell.i[0]] + Math.round(cell.height/2) - s.t;

						if(sort.side.direction)		drawCircuit(c, defaultBack.sort[type = (sort.side.type == 0 && cell.base) ? 3 : sort.side.type], [ [ x, y - 5], [ x + 6, y], [ x, y + 5] ]);
						else						drawCircuit(c, defaultBack.sort[type = (sort.side.type == 0 && cell.base) ? 3 : sort.side.type], [ [ x + 6, y - 5], [ x, y], [ x + 6, y + 5] ]);
					}
				}
			}});

			s.rows.forEach( function(j){			for(var i = 0; i < _Side.c; i++){	if(_Side.visual[j][i].j.last() != (_Side.c - 1) ) _Side.visual[j][i].displayed = false;	}});
			c.fillStyle = '#000';					c.textAlign = "center";
		
			if(!setting.orientation){
				c.rotate(Math.PI*3/2);
				s.rows.forEach( function(i){ 		for(var j = 0; j < _Side.c-1; j++) {
					var cell = _Side.visual[i][j];
					if(!cell.visible || cell.displayed) continue;
					else cell.displayed = true;	

					if(s.tp[cell.i[0]] + cell.height/2 - cell.textArray[0].width < s.t){
						if((s.tp[cell.i[0]] + cell.height - cell.textArray[0].width*2) > s.t )	cell.textArray.forEach( function(item){ c.fillText(item.text, -(cell.textArray[0].width), (_Side.lp[cell.j[0]] + 2  + item.position)); } );	
						else																	cell.textArray.forEach( function(item){ c.fillText(item.text, -(s.tp[cell.i[0]] - s.t + cell.height - cell.textArray[0].width), (_Side.lp[cell.j[0]] + 2  + item.position)); } );
					} else if((s.tp[cell.i[0]] + cell.height/2 + cell.textArray[0].width) > (s.t + s.vh)){
						if((s.tp[cell.i[0]] + cell.textArray[0].width*2) > (s.t + s.vh))		cell.textArray.forEach( function(item){ c.fillText(item.text, -(s.tp[cell.i[0]] - s.t + cell.textArray[0].width), (_Side.lp[cell.j[0]] + 2  + item.position)); } );
						else																	cell.textArray.forEach( function(item){ c.fillText(item.text, -(s.vh - cell.textArray[0].width), (_Side.lp[cell.j[0]] + 2  + item.position)); } );
					} else																		cell.textArray.forEach( function(item){ c.fillText(item.text, -(s.tp[cell.i[0]] - s.t + cell.height/2), (_Side.lp[cell.j[0]] + 2  + item.position)); } );	
				}});
				c.rotate(Math.PI*1/2);
			} else {
				s.rows.forEach( function(i){ 		for(var j = 0; j < _Side.c-1; j++) {
					var cell = _Side.visual[i][j];
					if(!cell.visible || cell.displayed) continue;
					else cell.displayed = true;

					if((cell.height - size.text*cell.textArray.length)/2 + display.s.tp[cell.i[0]] - 2 < s.t){
						if(display.s.tp[cell.i[0]] + cell.height  - size.text*cell.textArray.length - 2 > s.t )	cell.textArray.forEach( function(item, k){ c.fillText(item.text, cell.width/2 + _Side.lp[cell.j[0]], (k + 0.5)*size.text + 2 ); } );	
						else																						cell.textArray.forEach( function(item, k){ c.fillText(item.text, cell.width/2 + _Side.lp[cell.j[0]], display.s.tp[cell.i[0]] + cell.height  - size.text*cell.textArray.length - 2 + (k + 0.5)*size.text - display.s.t - 2 ); } );
					} else if((cell.height + size.text*cell.textArray.length)/2 + display.s.tp[cell.i[0]] + 2 > (s.t + s.vh)){
						if(display.s.tp[cell.i[0]] + size.text*cell.textArray.length + 2 > (s.t + s.vh))			cell.textArray.forEach( function(item, k){ c.fillText(item.text, cell.width/2 + _Side.lp[cell.j[0]], display.s.tp[cell.i[0]] - display.s.t + (k + 0.5)*size.text + 2 ); } );	
						else																						cell.textArray.forEach( function(item, k){ c.fillText(item.text, cell.width/2 + _Side.lp[cell.j[0]], s.vh - size.text*cell.textArray.length + (k + 0.5)*size.text - 2 ); } );	
					} else																							cell.textArray.forEach( function(item, k){ c.fillText(item.text, cell.width/2 + _Side.lp[cell.j[0]], (cell.height - size.text*cell.textArray.length)/2 + display.s.tp[cell.i[0]] - 2 + (k + 0.5)*size.text - display.s.t ); } );	
				}});
			}
			c.fillStyle = '#f1f1f1';		c.fillRect( 0, s.vh, s.x, 18 );
			c.fillStyle = '#aaa';			c.fillRect( 0, s.vh - 1, s.x, 1 );
		}

		this.all = function(){				display.table();			display.top();			display.side();		}

		function drawDashLine(c, color, background, x1, y1, x2, y2){
			c.beginPath();
			c.setLineDash([])
			c.strokeStyle = background;
			c.moveTo(x1, y1);			c.lineTo(x2, y2);			c.stroke();
			c.setLineDash([4, 2])
			c.strokeStyle = color;
			c.moveTo(x1, y1);			c.lineTo(x2, y2);			c.stroke();		}
		function drawCircuit(c, color, path){
			c.beginPath();
			if(color)	c.fillStyle = color;
			c.moveTo( path[0][0], path[0][1]);
			for(var i = 1; i < path.length; i++)	c.lineTo( path[i][0] , path[i][1]);
			c.fill();		}
	}
	var scroll = new function(){
		this.v = {}; //vertical
		this.h = {}; //horizontal
		var s;
		var timer;

		this.hdown = function(e, coord){
			var x = get.dpiM(e.pageX - coord.left);
			var y = get.dpiM(e.pageY - coord.top);

			if( x > scroll.h.l && x < (scroll.h.l + scroll.h.w) && (scroll.h.t - 2) < y  ){
				s = {e: e, ne: e, c: coord, l: display.s.l};
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", hup);
				hredrow();
				return false;
			}
			if( x < 18 && y > display.s.vh){					scroll.onScroll(300,-1, 0);	window.addEventListener("mouseup", scroll.offScroll); return; }
			if( x > (display.s.vw - 18) && y > display.s.vh){	scroll.onScroll(300, 1, 0);	window.addEventListener("mouseup", scroll.offScroll); return; }

			if( x < scroll.h.l)	scroll.pageScroll(-1, 0 );
			else				scroll.pageScroll( 1, 0 );
		}
		function move(e){		s.ne = e;		}
		function hredrow(){ // horizontal redrow 
			display.s.l = Math.round(s.l + (((get.dpiM(s.ne.pageX - s.e.pageX))/(display.s.vw - 36)) * display.s.lp.last()));
			display.table();
			display.top();
			timer = setTimeout(hredrow, 5);
		}
		function hup(e){
			clearTimeout(timer);		timer = null;
			s = undefined;
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", hup);			
		}

		this.vdown = function(e, coord){
			var x = get.dpiM(e.pageX - coord.left);
			var y = get.dpiM(e.pageY - coord.top);

			if( x > (scroll.v.l - 2) && scroll.v.t < y && (scroll.v.t + scroll.v.h) > y ){
				s = {e: e, ne: e, c: coord, t: display.s.t};
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", vup);
				vredrow();
				return false;
			}

			if( y < 18 && x > display.s.vw){					scroll.onScroll(300, 0,-1);	window.addEventListener("mouseup", scroll.offScroll); return; }
			if( y > (display.s.vh - 18) && x > display.s.vw){	scroll.onScroll(300, 0, 1);	window.addEventListener("mouseup", scroll.offScroll); return; }

			if( y < scroll.v.t)	scroll.pageScroll( 0,-1 );
			else				scroll.pageScroll( 0, 1 );
		}
		function vredrow(e){
			display.s.t = Math.round(s.t + (((get.dpiM(s.ne.pageY - s.e.pageY))/(display.s.vh - 36)) * display.s.tp.last()));
			display.table();
			display.side();
			timer = setTimeout(vredrow, 5);
		}
		function vup(e){
			clearTimeout(timer);		timer = null;
			s = undefined;
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", vup);			
		}

		this.wheelVertical = function(e){
			if(e.ctrlKey)		return;

			var delta = (e.deltaY || -e.wheelDelta)/2;
			clearTimeout(timer);		timer = null;

			if(delta > 0)	wheelScroll( 1, 0, 3);
			else			wheelScroll(-1, 0, 3);
			tools.stopProp(e); return false;
		}
		this.wheelHorizontal = function(e){
			if(e.ctrlKey)		return;

			var delta = (e.deltaY || -e.wheelDelta)/2;
			clearTimeout(timer);		timer = null;

			if(delta > 0)	wheelScroll( 0, 1, 3);
			else			wheelScroll( 0,-1, 3);
			tools.stopProp(e); return false;
		}
		function wheelScroll(v, h, times){

			if(v)	display.s.t += v*50;
			if(h)	display.s.l += h*50;
			display.table();
			if(v)	display.side();
			if(h)	display.top();

			if(times) timer = setTimeout(wheelScroll, 5, v, h, times - 1);
		}

		this.onScroll = function(time, h, v){

			display.s.l += h*20;
			display.s.t += v*20; 
			display.table(); 
			if(h) display.top();
			if(v) display.side();

			timer = setTimeout( scroll.onScroll, time, 5, h, v);
		}
		this.pageScroll = function(h, v){
			var hbit = Math.round(display.s.vw/10);
			var vbit = Math.round(display.s.vh/10);
			for(var i = 0; i < 9; i++){
				setTimeout(function(){ 
					display.s.l += h*hbit;
					display.s.t += v*vbit; 
					display.table(); 
					if(h) display.top();
					if(v) display.side();
				}, 20*i); };			
		}
		this.offScroll = function(){
			clearTimeout(timer);		timer = null;
			window.removeEventListener("mouseup", scroll.offScroll);
		}
	}
	var select = new function(){
		var side = this.side = [];
		var top = this.top = [];
		var table = this.table = [];
		var timer = [];
		var s = this.s = {};

		this.shift1st;
		this.shift2nd;
		this.click;

		this.cTable = new function(){
			this.down = function(e){
				s = {e: e };
				if(e.shiftKey && select.shift1st)	s.start = select.shift1st;
				else 								s.start = get.position.table(e);

				if(!e.ctrlKey)				select.clearAll();
				
				select.click = _Table;
				hover();
	
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", up);
			}
			function hover(){
				hscroll(s.e);
				vscroll(s.e);

				s.end = get.position.table(s.e);
				var p = get.sortedPosition.table(s.start, s.end);

				select.hover.table(  p.l,  p.r,  p.t,  p.b);
				select.hover.side(_Side.c - 1, _Side.c - 1,  p.t,  p.b );
				select.hover.top(  p.l,  p.r, _Top.r - 1, _Top.r - 1 );

				display.all();
				timer = setTimeout(hover, 5);
			}
			function up(e){
				clearTimeout(timer);			timer = undefined;

				select.shift1st = s.start;		select.shift2nd = s.end;
				var p = get.sortedPosition.table(s.start, s.end);

				select.selectTable(  p.t,  p.b,  p.l,  p.r, true);
				display.all();
				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup", up);
			}
		}
		this.cSide = new function(){
			this.down = function(e){
				s = {e: e, start: get.position.side(e) };
				s.sort = (_Side.visual[s.start.i][s.start.j].select && select.side.length == 1 && select.click == _Side) ? true : false;
				
				if(!e.ctrlKey)				select.clearAll();
				
				select.click = _Side;
				hover();
	
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", up);
			}
			function hover(){
				hscroll(s.e);
				s.end = get.position.side(s.e);
				var p = get.sortedPosition.side( s.start, s.end);

				select.hover.table(  0, _Table.c - 1,  p.t, p.b);
				select.hover.side(  p.l,  p.r,  p.t, p.b );
				select.hover.top(0, _Table.c - 1, _Top.r - 1, _Top.r - 1 );
				display.all();

				timer = setTimeout(hover, 5);			
			}
			function up(e){
				clearTimeout(timer);
				timer = undefined;
				var p = get.sortedPosition.side( s.start, s.end);
	
				select.shift1st = { i: p.t, j: 0 };
				select.shift2nd = { i: p.b, j: _Table.c - 1};

				select.selectSide(  p.t,  p.b,  p.l,  p.r,  e.ctrlKey);

				if(s.start.i == s.end.i && s.start.j == s.end.j && s.start.j == (_Side.c - 1) && setting.sort && s.sort )
					sort.sdown(_Side.visual[s.start.i][s.start.j], e);
				else
					display.all(); 
				
				s = {};
				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup", up);
			}
		}
		this.cTop = new function(){
			this.down = function(e){
				s = {e: e, start: get.position.top(e) };
				s.sort = (_Top.visual[s.start.i][s.start.j].select && select.top.length == 1 && select.click == _Top) ? true : false;
			
				if(!e.ctrlKey)				select.clearAll();

				select.click = _Top;
				hover();
	
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", up);
			}
			function hover(){
				vscroll(s.e);
				s.end = get.position.top(s.e);
				var p = get.sortedPosition.top(s.start, s.end);

				select.hover.table(  p.l,  p.r, 0, _Table.r - 1);
				select.hover.top(  p.l,  p.r,  p.t,  p.b);	
				select.hover.side(_Side.c - 1, _Side.c - 1,  0, _Table.r - 1 );
				display.all();

				timer = setTimeout(hover, 5);
			}
			function up(e){
				clearTimeout(timer);
				timer = undefined;
				var p = get.sortedPosition.top(s.start, s.end);

				select.shift1st = [0, p.l];
				select.shift2nd = [_Table.r - 1, p.r];
	
				select.selectTop(  p.t,  p.b,  p.l,  p.r, e.ctrlKey );

				if(s.start.j == s.end.j && s.start.i == s.end.i && s.start.i == (_Top.r - 1) && setting.sort && s.sort )
					sort.tdown(_Top.visual[s.start.i][s.start.j], e);			
				else
					display.all();
				s = {};

				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup", up);
			}
		}
		function move(e){ s.e = e; };

		function vscroll(e){
			if(_Table.coords.left <= e.pageX && (_Table.coords.left + 10) > e.pageX)			display.s.l += -10;
			else if(_Table.coords.left > e.pageX)												display.s.l += -20;

			if(_Table.coords.right - 18 >= e.pageX && (_Table.coords.right - 28) < e.pageX)		display.s.l += 10;
			else if(_Table.coords.right - 18 < e.pageX)											display.s.l += 20;
		}
		function hscroll(e){
			if(_Table.coords.top <= e.pageY && (_Table.coords.top + 10) > e.pageY)				display.s.t += -10;
			else if(_Table.coords.top > e.pageY)												display.s.t += -20;

			if(_Table.coords.bottom - 18 >= e.pageY && (_Table.coords.bottom - 28) < e.pageY)	display.s.t += 10;
			else if(_Table.coords.bottom - 18 < e.pageY)										display.s.t += 20;
		}
		
		this.hover = new function(){
			var table = [];
			var top = [];
			var side = [];

			this.table = function(l, r, t, b){
				table.forEach(function(item){item.hover = undefined; });			table = [];	
				for(var i = t; i <= b; i++ ){
					for(var j = l; j <= r; j++){
						_Table.cells[i][j].hover = true;
						table.push(_Table.cells[i][j]);
					}
				}
			}
			this.side = function(l, r, t, b){
				side.forEach(function(item){item.hover = undefined; });				side = [];	
				for(var i = t; i <= b; i++ ){
					for(var j = l; j <= r; j++){
						_Side.visual[i][j].hover = true;
						side.push(_Side.visual[i][j]);
					}
				}
			}
			this.top = function(l, r, t, b){
				top.forEach(function(item){item.hover = undefined; });				top = [];	
				for(var i = t; i <= b; i++ ){
					for(var j = l; j <= r; j++){
						_Top.visual[i][j].hover = true;
						top.push(_Top.visual[i][j]);
					}
				}
			}
			this.clear = function(){
				table.forEach(function(item){item.hover = undefined; });
				top.forEach(function(item){item.hover = undefined; });
				side.forEach(function(item){item.hover = undefined; });
			}
		}
		this.select = new function(){
			this.table = function(l, r, t, b){
				for(var i = t; i <= b; i++ ){
					for(var j = l; j <= r; j++){
						if(_Top.branches[j].visible && _Side.branches[i].visible){
							if(_Table.cells[i][j].select){
								_Table.cells[i][j].select = false;
								for(var k = select.table.length - 1; k >= 0; k--){
									if( _Table.cells[i][j] == select.table[k]) select.table.splice(k, 1);
								}
							} else {
								_Table.cells[i][j].select = true;
								select.table.push(_Table.cells[i][j]);
							}
						}
					}
				}
			}
			this.clearHeaders = function(){
				select.side.forEach(function(item){ item.select = false; });		select.side = [];
				select.top.forEach(function(item){ item.select = false; });			select.top = [];				
			}
			this.headers = function(){
				select.table.forEach(function(item){
					var i = item.i[0]; var j = item.j[0];
					if(!_Side.branches[i].select){	_Side.branches[i].select = true; select.side.push(_Side.branches[i]); };
					if(!_Top.branches[j].select){	_Top.branches[j].select = true; select.top.push(_Top.branches[j]); }
				})
			}
			this.header = function(l, r, t, b, area, array){	
				for(var i = t; i <= b; i++ ){
					for(var j = l; j <= r; j++){
						area.visual[i][j].select = true;
						array.push(area.visual[i][j]);
					}
				}
			}
		}

		this.selectTable = function( t, b, l, r, ctrl){
			select.click = _Table;

			if(!ctrl) select.clearAll();
			select.select.clearHeaders();
			select.select.table(l, r, t, b);
			select.select.headers();
			select.hover.clear()

			if(functions.afterSelect)		functions.afterSelect(link);
		}
		this.selectSide = function( t, b, l, r, ctrl){
			select.click = _Side;

			if(!ctrl)	select.clearAll();
			select.select.clearHeaders();
			select.hover.clear();

			select.select.table(0, _Table.c - 1, t, b);

			if(ctrl)
				select.select.headers();
			else {
				select.select.header(l, r, t, b, _Side, select.side );
				select.select.header(0, _Table.c - 1, _Top.r - 1, _Top.r - 1, _Top, select.top );
			}

			if(functions.afterSelect)		functions.afterSelect(link);
		}		
		this.selectTop = function( t, b, l, r, ctrl){
			select.click = _Top;

			if(!ctrl) select.clearAll();
			select.select.clearHeaders();
			select.hover.clear();

			select.select.table( l, r, 0, _Table.r - 1);

			if(ctrl)
				select.select.headers();
			else {
				select.select.header(_Side.c - 1, _Side.c - 1,  0, _Table.r - 1, _Side, select.side );
				select.select.header(l, r, t, b, _Top, select.top );				
			}

			if(functions.afterSelect)		functions.afterSelect(link);				
		}

		this.selectAll = function(){
			for(var i = 0; i < _Table.r; i++){	for(var j = 0; j < _Table.c; j++)	{if(!_Table.cells[i][j].select){	_Table.cells[i][j].select = true;	select.table.push(_Table.cells[i][j]); }}};
			for(var i = 0; i < _Top.r; i++){	for(var j = 0; j < _Top.c; j++)		{if(!_Top.visual[i][j].select){		_Top.visual[i][j].select = true; 	select.top.push(_Top.visual[i][j]); }}};
			for(var i = 0; i < _Side.r; i++){	for(var j = 0; j < _Side.c; j++)	{if(!_Side.visual[i][j].select){	_Side.visual[i][j].select = true;	select.side.push(_Side.visual[i][j]); }}};
		
			select.shift1st = _Table.cells[0][0];
			select.shift2nd = _Table.cells[_Table.r - 1][_Table.c - 1];
		}
		this.clearAll = function(){
			select.table.forEach(function(item){ item.select = false; });		select.table = [];
			select.side.forEach(function(item){ item.select = false; });		select.side = [];
			select.top.forEach(function(item){ item.select = false; });			select.top = [];
		}
	}
	var resize = new function(){
		var s = this.s = {};

		this.side = {
			down: function(e, cell, v, h){
				var sCoords = get.screenCoord.side(display.s.tp[cell.i[0]], _Side.lp[cell.j[0]]);
				var html = tools.createHTML({tag: 'div',
											parent: container,
											className: 'tau-resize',
											style: ('left: ' + sCoords[1] + 'px; top: ' + sCoords[0] + 'px; width: ' + (get.dpiD(cell.width) - 1) + 'px; height: ' + (get.dpiD(cell.height) - 1) + 'px;') });
	
				s = {v: v, h: h, cell: cell, html: html, e: e };
	
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", resize.side.up);
			},
			up: function(e){
				tools.destroyHTML(s.html);
				if(s.v && s.move){
					if(s.cell.select && (s.cell.j.last() + 1 == _Side.c))	resize.side.select( s.cell.height + differenceHeight(e, s.e));
					else 													resize.side.height( s.cell.i, s.cell.height + differenceHeight(e, s.e), s.cell.height );
				}
				if(s.h && s.move)											resize.side.width( s.cell.j, s.cell.width + differenceWidth(e, s.e), s.cell.width );

				s = {};
				remake.reDrow();
				tools.endBackdrop();
	
				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup",  resize.side.up);
				return;
			},
			width:	function(columns, width, oldWidth){	columns.forEach(function(i){ _Side.dw[i] = minWidth(_Side.dw[i]*width/oldWidth);});		},
			height:	function(rows, height, oldHeight){	rows.forEach(function(i){ if(_Side.branches[i].visible) _Side.branches[i].dh = minHeight( _Side.branches[i].height*height/oldHeight );});	},
			select:	function(height){					_Side.branches.forEach( function(item){ if(item.select) item.dh =  minHeight( height ); })},
		}

		this.top = {
			down: function(e, cell, v, h){
				var sCoords = get.screenCoord.top( _Top.tp[cell.i[0]], display.s.lp[cell.j[0]]);
				var html = tools.createHTML({tag: 'div',
											parent: container,
											className: 'tau-resize',
											style: ('left: ' + sCoords[1] + 'px; top: ' + sCoords[0] + 'px; width: ' + get.dpiD(cell.width - 1) + 'px; height: ' + get.dpiD(cell.height - 1) + 'px;') });
	
				s = {v: v, h: h, cell: cell, html: html, e: e};
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", resize.top.up);
			},
			up: function(e){
				tools.destroyHTML(s.html);
				if(s.h && s.move){
					if(s.cell.select && (s.cell.i.last() + 1 == _Top.r))	resize.top.select( s.cell.width + differenceWidth(e, s.e), s.cell.width);
					else													resize.top.width( s.cell.j, s.cell.width + differenceWidth(e, s.e), s.cell.width, s.cell.width);
				}
				if(s.v && s.move)											resize.top.height( s.cell.i, s.cell.height + differenceHeight(e, s.e) , s.cell.height);
				s = {};
				remake.reDrow();
				tools.endBackdrop();
	
				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup", resize.top.up);
				return;
			},
			width:	function(columns, width, oldWidth){	columns.forEach(function(i){ if(_Top.branches[i].visible) _Top.branches[i].dw = minWidth(_Top.branches[i].width*width/oldWidth);});		},
			height:	function(rows, height, oldHeight){	rows.forEach(function(i){ _Top.dh[i] = minHeight(_Top.dh[i]*height/oldHeight);});			},
			select:	function(width){					_Top.branches.forEach( function(item){ if(item.select) item.dw = minWidth(width); })}
		}

		this.corner = {
			down: function(e, v, h){
				var html = tools.createHTML({tag: 'div', parent: container, className: 'tau-resize', style: ('left: 0; top: 0; width: ' + (display.s.x - 1) + 'px; height: ' + (display.s.y - 1) + 'px;') });
	
				s = { v: v, h: h, html: html, e: e, cell: {width: (display.s.x - 1), height: (display.s.y - 1) }};
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", resize.corner.up);
			},
			up: function(e){

				var row = [], col = [];
				for(var i = 0; i < _Side.c; i++)	row[i] = i;
				for(var i = 0; i < _Top.r; i++)		col[i] = i;
	
				if(s.h) 		resize.side.width( row, get.dpiM(e.pageX - _Side.coords.left), _Side.lp.last());
				if(s.v) 		resize.top.height( row, get.dpiM(e.pageY - _Top.coords.top), _Top.tp.last());

				tools.destroyHTML(s.html);
				s = {};
				remake.reDrow();
				tools.endBackdrop();
	
				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup", resize.corner.up);
			}
		}

		this.dbl = {
			sideWidth: function(cell){
				if((cell.j.last() + 1) != _Side.c && setting.orientation){
					resize.side.width(cell.j, resize.dbl.getHeight(cell.obj.text, cell.height - 5), cell.width);
				} else {
					resize.side.width(cell.j, resize.dbl.getWidth(cell.obj.text, cell.height - 4), cell.width);
				}
				remake.reDrow();
			},
			sideHeight: function(cell){
				if((cell.j.last() + 1) != _Side.c && setting.orientation){
					resize.side.height(cell.i, resize.dbl.getWidth(cell.obj.text, cell.width - 4) + 1, cell.height);
				} else {
					resize.side.height(cell.i, resize.dbl.getHeight(cell.obj.text, cell.width - 5), cell.height);
				}
				remake.reDrow();
			},
			topWidth: function(cell){

				var aj = [];
				var cells = [];

				if(cell.select){
					cells = select.top;
					_Top.branches.forEach( function(item, i){	if(item.select) aj.push(i);	} );
				} else {
					cells.push(cell);
					aj = cell.j;
				}

				aj.forEach( function(j){
					var symbol = 0;
					for(var i = 0; i < _Table.r; i++){
						_Table.cells[i][j].obj.forEach( function(cell, k){
							var percent = (setting.showPercent && (k == 1 || k == 2)), round = (_Side.branches[i].obj.type == 3 || _Side.branches[i].obj.type == 8) ? setting.round[2] : setting.round[0];
							if(k != 0)		round = setting.round[1];
	
							var ns = (tools.roundPlus(cell, round) + ((percent) ? '%%' : '') ).replace('.', '').length;
							if(symbol < ns)	symbol = ns;
						});
					}
					_Top.branches[j].width = _Top.branches[j].dw = Math.round(symbol*size.numeral + size.dot + 8);
				} );

				cells.forEach( function(item){
					var width = 0;
					item.j.forEach( function(j){ width += _Top.branches[j].dw; } );
					var textWidth = resize.dbl.getWidth(item.obj.text, item.height - 4);

					if(textWidth > width)	resize.top.width(item.j, textWidth, width);
				} );

				remake.reDrow();
			},
			topHeight: function(cell){
				resize.top.height(cell.i, resize.dbl.getHeight(cell.obj.text, cell.width - 5), cell.height);
				remake.reDrow();
			},
			getHeight: function(text, width){
				var fullWidth = _Table.ctx.measureText(text).width;

				var length = (text.length) ? Math.floor( width / (fullWidth / text.length) ) : 0;

				var row = 0;
				while(text.length > 0){
					var nlength = length;
					var bit = _Table.ctx.measureText(text.substring(0, nlength)).width;
					while(bit > width){
						nlength--;
						bit = _Table.ctx.measureText(text.substring(0, nlength)).width;
					}
					row++;
					text = text.substring(nlength, text.length);
				}
				return row*size.text + 4;
			},
			getWidth: function(text, height){
				var fullWidth = _Table.ctx.measureText(text).width;
				var row = Math.floor(height/size.text);
				var length = (row && text) ? (Math.floor(text.length/row) + 1) : 0;

				var width = 0;
				while(text.length > 0){
					var bit = _Table.ctx.measureText(text.substring(0, length)).width;
					if(bit > width)	width = Math.floor(bit) + 1;
					text = text.substring(length, text.length);
				}
				return width + 5;
			}
		}

		function move(e){
			if((Math.abs( s.e.pageX - e.pageX) > 3 || Math.abs( s.e.pageY - e.pageY) > 3) && !s.move){
				if(s.v && s.h)	s.cursor = 'se-resize';
				else if(s.v)	s.cursor = 'n-resize';
				else if(s.h)	s.cursor = 'e-resize';

				s.move = true;
				s.html.style.display = 'block';
				tools.startBackdrop({cursor: s.cursor});
			}
			if(s.move){
				if(s.h)		s.html.style.width	= minWidth(get.dpiD(s.cell.width) + e.pageX - s.e.pageX) + 'px';
				if(s.v)		s.html.style.height	= minHeight(get.dpiD(s.cell.height) + e.pageY - s.e.pageY) + 'px';
			}
		}
		function differenceHeight(e, ne){	return get.dpiM(e.pageY - ne.pageY);	}
		function differenceWidth(e, ne){	return get.dpiM(e.pageX - ne.pageX);	}
		function minWidth(value){			return (value < get.dpiD(size.minw)) ? get.dpiD(size.minw) : Math.round(value);	}
		function minHeight(value){			return (value < get.dpiD(size.minh)) ? get.dpiD(size.minh) : Math.round(value);	}
	}
	var sort = new function(){
		this.side = {};
		this.top = {};

		this.sortAll = function(options){
			if(options.side){
				var cell;
				if(options.side.index >= _Side.branches.length)		options.side.index = _Side.branches.length - 1;
				_Side.branches.forEach(function(item){	if(item.index == options.side.index) cell = item; });
				if(options.side.type == undefined){
					if(!(cell.types[0] && setting.showType[0]) && cell.floatType)	options.side.type = 0;
					else{ for(var i = 0; i < cell.types.length; i++){ if(cell.types[i] && setting.showType[i]){ options.side.type = i; break; } } }
				}

				if(options.side.direction){
					sort.side = {cell: cell, type: options.side.type, direction: true };
					sideSort(increase);
				} else {
					sort.side = {cell: cell, type: options.side.type, direction: false };
					sideSort(dencrease);
				}
			} else {
				sideDefault();
				sort.side = {};
			}
			if(options.top){
				var cell;
				if(options.top.index >= _Top.branches.length)	options.top.index = _Top.branches.length - 1;
				_Top.branches.forEach(function(item){	if(item.index == options.top.index) cell = item; });
				if(options.top.type == undefined){
					if(!(cell.types[0] && setting.showType[0]) && cell.floatType)	options.top.type = 0;
					else{ for(var i = 0; i < cell.types.length; i++){ if(cell.types[i] && setting.showType[i]){ options.top.type = i; break; } } }
				}

				if(options.top.direction){
					sort.top = {cell: cell, type: options.top.type, direction: true };
					topSort(increase);
				} else {
					sort.top = {cell: cell, type: options.top.type, direction: false };
					topSort(dencrease);
				}
			} else {
				topDefault();
				sort.top = {};
			}
			remake.reBuild();
		}
		this.getSort = function(){
			var result = {};
			if(sort.side.cell != undefined)			result.side = { index: sort.side.cell.index, direction: sort.side.direction, type: sort.side.type };
			if(sort.top.cell != undefined)			result.top = { index: sort.top.cell.index, direction: sort.top.direction, type: sort.top.type };
			return result;
		}

		this.sdown = function(cell, e){
			var types = [], type;
			if(!(cell.types[0] && setting.showType[0]) && cell.floatType)			types.push(0);
			cell.types.forEach(function(item, i){ 	if(item && setting.showType[i])	types.push(i); });

			var bite = cell.height/types.length, top = _Side.coords.top + display.s.tp[cell.i[0]] - display.s.t;
			for(var i = 0; i < types.length; i++){	if( top + bite*i < e.pageY && top + bite*(i + 1) > e.pageY)		type = types[i];	}
		
			if(type != sort.side.type || cell != sort.side.cell ){
				sort.side = {cell: cell, type: type, direction: true };
				sideSort(increase);
			} else if(sort.side.direction === true){
				sort.side.direction = false;
				sideSort(dencrease);
			} else if(sort.side.direction === false){
				sideDefault();
				sort.side = {};
			}
			remake.reBuild();
		}
		function sideSort(compare){
			for(var j = 0; j < _Table.c - 1; j++){
				var p = j, parent = _Top.branches[j].parent, buf; //p - new position, paretn - current parent, buf - variable for reshuffle items
				if(_Top.branches[j].unsort || (_Top.branches[j].base && !sort.side.cell.base && sort.side.type == 0 ) )		continue;

				for(var k = j + 1; k < _Table.c; k++){
					if(parent != _Top.branches[k].parent) break;
					if(_Top.branches[k].unsort || (_Top.branches[k].base && !sort.side.cell.base && sort.side.type == 0 ) ) continue;

					if(compare( _Table.cells[sort.side.cell.i[0]][p].obj[sort.side.type], _Table.cells[sort.side.cell.i[0]][k].obj[sort.side.type], _Top.branches[p].index, _Top.branches[k].index))	p = k;
				}
				var pi, pj;
				parent.children.forEach(function(item, i){ if(item == _Top.branches[j]) pi = i; if(item == _Top.branches[p]) pj = i; });

				buf = parent.children[pi];				parent.children[pi] = parent.children[pj];				parent.children[pj] = buf;
				buf = _Top.branches[j];					_Top.branches[j] = _Top.branches[p];					_Top.branches[p] = buf;
				for(var i = 0; i < _Table.r; i++){
					buf = _Table.cells[i][j];			_Table.cells[i][j] = _Table.cells[i][p];				_Table.cells[i][p] = buf;
				}
			}
		}
		function sideDefault(){
			for(var j = 0; j < _Table.c - 1; j++){
				var p = j, parent = _Top.branches[j].parent, buf; //p - new position, paretn - current parent, buf - variable for reshuffle items

				for(var k = j + 1; k < _Table.c; k++){
					if(_Top.branches[k].index == j){	p = k;	break;}
				}
				var pi, pj;
				parent.children.forEach(function(item, i){ if(item == _Top.branches[j]) pi = i; if(item == _Top.branches[p]) pj = i; });

				buf = parent.children[pi];				parent.children[pi] = parent.children[pj];				parent.children[pj] = buf;
				buf = _Top.branches[j];					_Top.branches[j] = _Top.branches[p];					_Top.branches[p] = buf;
				for(var i = 0; i < _Table.r; i++){
					buf = _Table.cells[i][j];			_Table.cells[i][j] = _Table.cells[i][p];				_Table.cells[i][p] = buf;
				}
			}
		}

		this.tdown = function(cell, e){
			var types = [], type;
			if(!(cell.types[0] && setting.showType[0]) && cell.floatType)			types.push(0);
			cell.types.forEach(function(item, i){ 	if(item && setting.showType[i])	types.push(i); });

			var bite = cell.width/types.length, left = _Top.coords.left + display.s.lp[cell.j[0]] - display.s.l;
			for(var i = 0; i < types.length; i++){	if( left + bite*i < e.pageX && left + bite*(i + 1) > e.pageX)		type = types[i];	}
		
			if(type != sort.top.type || cell != sort.top.cell ){
				sort.top = {cell: cell, type: type, direction: true };
				topSort(increase);
			} else if(sort.top.direction === true){
				sort.top.direction = false;
				topSort(dencrease);
			} else if(sort.top.direction === false){
				topDefault();
				sort.top = {};
			}
			remake.reBuild();
		}
		function topSort(compare){
			for(var j = 0; j < _Table.r - 1; j++){
				var p = j, parent = _Side.branches[j].parent, buf; //p - new position, paretn - current parent, buf - variable for reshuffle items
				if(_Side.branches[j].unsort || (_Side.branches[j].base && !sort.top.cell.base && sort.top.type == 0 ) )		continue;

				for(var k = j + 1; k < _Table.r; k++){
					if(parent != _Side.branches[k].parent) break;
					if(_Side.branches[k].unsort || (_Side.branches[k].base && !sort.top.cell.base && sort.top.type == 0 ) )	continue;

					if(compare( _Table.cells[p][sort.top.cell.j[0]].obj[sort.top.type], _Table.cells[k][sort.top.cell.j[0]].obj[sort.top.type], _Side.branches[p].index, _Side.branches[k].index))	p = k;
				}
				var pi, pj;
				parent.children.forEach(function(item, i){ if(item == _Side.branches[j]) pi = i; if(item == _Side.branches[p]) pj = i; });

				buf = parent.children[pi];				parent.children[pi] = parent.children[pj];				parent.children[pj] = buf;
				buf = _Side.branches[j];				_Side.branches[j] = _Side.branches[p];					_Side.branches[p] = buf;
				buf = _Table.cells[j];					_Table.cells[j] = _Table.cells[p];						_Table.cells[p] = buf;
			}
		}
		function topDefault(){
			for(var j = 0; j < _Table.r - 1; j++){
				var p = j, parent = _Side.branches[j].parent, buf; //p - new position, paretn - current parent, buf - variable for reshuffle items

				for(var k = j + 1; k < _Table.r; k++){		if(_Side.branches[k].index == j){	p = k;	break;	}				}
				var pi, pj;
				parent.children.forEach(function(item, i){ if(item == _Side.branches[j]) pi = i; if(item == _Side.branches[p]) pj = i; });

				buf = parent.children[pi];				parent.children[pi] = parent.children[pj];				parent.children[pj] = buf;
				buf = _Side.branches[j];				_Side.branches[j] = _Side.branches[p];					_Side.branches[p] = buf;
				buf = _Table.cells[j];					_Table.cells[j] = _Table.cells[p];						_Table.cells[p] = buf;
			}
		}

		function increase(a, b, f, l){
			if(a != undefined){	if(a != undefined) a = a; else a = 0; }			else return false;
			if(b != undefined){	if(b != undefined) b = b; else b = 0; }			else return false;
			if(a < b)		return true;
			else if(a == b){
				if(f > l)	return true;
				else		return false;
			} else			return false;
		}		
		function dencrease(a, b, f, l){
			if(a != undefined){	if(a != undefined) a = a; else a = 0; }			else return false;
			if(b != undefined){	if(b != undefined) b = b; else b = 0; }			else return false;
			if(a > b)		return true;
			else if(a == b){
				if(f > l)	return true;
				else		return false;
			} else 			return false;
		}
	}

	if(options)		link.create(options);
}