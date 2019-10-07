function table_ui(options){

	var link = this;

	var main; // inner object with links
	var parent; // outer container for table
	var container; // inner container for table
	var functions; // custom functions
	var setting; // options and settings

	var _Table, _Corner, _Side, _Top; // objects for storage main components
	var size;	// default value for text size, font, height and width rows and cols, 

	var _colors = { 
		alter: {
			a: ['#000000', '#b10000', '#007300'],
			b: ['', '#FFC7CE', '#C6EFCE'],
			t: ['#000000', '#b10000', '#005ebb']
		},
		table: [
			['#ffffff','#e5fbff','#fff1fb','#ffffd8' ],
			['#ffffff','#ffffff','#ffffff','#ffffd8' ]
		],
		sort: [
			'#000000', '#00a8a8', '#ff5757', '#b3b300'
		],
		header: '#F1F1F1'
	}

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
		if(options.round == undefined)			options.round = [ 3, 3, 3 ];
		if(options.orientation == undefined)	options.orientation = false;
		if(options.size == undefined)			options.size = { };
		if(options.sort == undefined)			options.sort = false;
		if(options.dashHidden == undefined)		options.dashHidden = true;
		if(options.sharpOverflow == undefined)	options.sharpOverflow = true;


		main = {
			html: CREATE.parent(),
			_Corner: CREATE.corner(),
			_Table: CREATE.table(),
			_Side: CREATE.side(),
			_Top: CREATE.top(),
			select: SELECT, 
			display: DISPLAY,
			sort: SORT,
			scroll: SCROLL
		};

		size = {
			corner: {
				w: [],
				h: []
			},
			table: { w: [], h: [] }, 
			w: 50,
			h: 20,
			text: 13,
			font: 'sans-serif',
			dpi: 1,
			scale: 1
		};
		
		functions = {};
		
		setting = {
			showType: [true, true, true],
			size: size
		};

		window.addEventListener("resize", DISPLAY.generate);

		link.change(options);
	}
	link.remove = function(){
		window.removeEventListener("resize", DISPLAY.generate);
		setting = undefined;					tools.destroyHTML(container);
		_Table = undefined;						_Side = undefined;
		_Top = undefined;						_Corner = undefined;
		SORT.top = {};
		SORT.side = {};
		SELECT.table = [];						SELECT.side = [];					SELECT.top = [];
	}
	link.change = function(options){
		if( typeof options != 'object')			options = {};

		if( options.sort !== undefined)				setting.sort = options.sort;
		if( options.hideCol !== undefined)			setting.hideCol = options.hideCol;
		if( options.hideRow !== undefined)			setting.hideRow = options.hideRow;
		if( options.hideZero !== undefined)			setting.hideZero = options.hideZero;
		if( options.showZero !== undefined)			setting.showZero = options.showZero;
		if( options.showPercent !== undefined)		setting.showPercent = options.showPercent;
		if( options.separator !== undefined)		setting.separator = options.separator;
		if( options.orientation !== undefined)		setting.orientation = options.orientation;
		if( options.sharpOverflow !== undefined)	setting.sharpOverflow = options.sharpOverflow;
		if( options.dashHidden !== undefined)		setting.dashHidden = options.dashHidden;
		if( options.whiteBackground !== undefined)	setting.whiteBackground = options.whiteBackground;

		if( options.parent !== undefined)			SET.parent(options);
		if( options.showType !== undefined)			SET.showType(options);
		if( options.round !== undefined)			SET.round(options);
		if( options.functions !== undefined)		SET.functions(options);
		if( options.size !== undefined)				SET.size(options);
		if( options.scroll !== undefined)			SET.scroll(options);

		if( options.table !== undefined)			BUILD.setTable( options.table.top, options.table.side, options.table.table);

		REMAKE.reBuild();
	}

	link.setTable = function(top, side, table){	BUILD.setTable(top, side, table);	REMAKE.reBuild();	}
	link.setSort = function(options){			SORT.setSort(options);								}
	link.setSelect = function(obj){
		SELECT.clearAll();

		if(obj.side != undefined){
			SELECT.click = _Side;
			for(var i = 0; i < obj.side.length; i++){
				SELECT.tree.down(obj.side[i], SELECT.add.side, true);
			}
			for(var i = 0; i < _Side.branches.length; i++){
				if(!_Side.branches[i].select)		continue;
				for(var j = 0; j < _Table.c; j++){
					SELECT.add.table(_Table.cells[i][j]);
				}
			}
		}
		if(obj.top != undefined){
			SELECT.click = _Top;
			for(var i = 0; i < obj.top.length; i++){
				SELECT.tree.down(obj.top[i], SELECT.add.top, true);
			}
			for(var j = 0; j < _Top.branches.length; j++){
				if(!_Top.branches[j].select)		continue;
				for(var i = 0; i < _Table.r; i++){
					SELECT.add.table(_Table.cells[i][j]);
				}
			}
		}
		if(obj.side != undefined){
			if(obj.side.length > 0){
				for(var i = 0; i < _Top.branches.length; i++){
					SELECT.add.top(_Top.branches[i]);
				}
			}
		}
		if(obj.top != undefined){
			if(obj.top.length > 0){
				for(var i = 0; i < _Side.branches.length; i++){
					SELECT.add.side(_Side.branches[i]);
				}
			}			
		}
		if(obj.top != undefined && obj.side != undefined) SELECT.click = _Table;
		DISPLAY.all();		}
	link.setFocus = function(){					main.html.focus();					}
	link.setAlter = function(input){
		if(!input)	return;
		if(!Array.isArray(input))
			input = [input];
		ALTER.adds(input);
		BUILD.autoSize();
		link.change();
		DISPLAY.table();		}

	link.getSetting = function(){
		var p = setting.parent;
		setting.parent = undefined;
		var result = tools.cloneObject(setting);
		setting.parent = p;
		result.scroll = { x: DISPLAY.s.l, y: DISPLAY.s.t };
		return result;		}
	link.getExport = function(options){			return EXPORT(options); 			}
	link.getTop = function(root){				return (root) ? _Top.tree.children.concat() : _Top.branches.concat();		}
	link.getSide = function(root){				return (root) ? _Side.tree.children.concat() : _Side.branches.concat();		}
	link.getSort = function(){					return SORT.getSort();				}
	link.getCorner = function(){				return _Corner.cont;				}
//	link.getSetting = function(){				return tools.cloneObject(setting);	}
	link.getAlter = function(){					return ALTER.get();					}
	link.getCells = function(withRound){
		var result = [];
		for(var i = 0; i < _Table.cells.length; i++){
			result[i] = [];
			for(var j = 0; j < _Table.cells[i].length; j++){
				if(withRound){
					result[i][j] = [];
					for(var k = 0; k < _Table.cells[i][j].obj.length; k++){

						var round;

						if(k == 0)			round = setting.round[_Table.cells[i][j].round];
						else				round = setting.round[1];

						result[i][j].push( tools.roundPlus(_Table.cells[i][j].obj[k] || 0 , round) );
					}
				} else {
					result[i][j] = _Table.cells[i][j].obj;
				}
			}
		}
		return result;		}
	link.getSelected = function(){
		var result = { table: SELECT.table.concat(), side: SELECT.side.concat(), top: SELECT.top.concat() };
		return result;			}

	link.clearAll = function(){
		SELECT.clearAll();
		DISPLAY.all();
		if(functions.afterSelect)	functions.afterSelect(link);		}
	link.selectAll = function(){
		SELECT.selectAll();
		SELECT.click = _Table;
		DISPLAY.all();
		if(functions.afterSelect)	functions.afterSelect(link);		}
	link.autoSize = function(){
		BUILD.autoSize();
		link.change();
	}

	link.removeAlter = function(input){
		if(!Array.isArray(input)){
			if(typeof input == 'object')	input = [input];
			else							input = ALTER.items.concat();
		}
		for(var i = 0; i < input.length; i++){
			ALTER.remove(input[i]);
		}
		DISPLAY.table();		}

	link.test = function(){
		var tscroll = function(){
			DISPLAY.s.l += 10;
			DISPLAY.all();
			if(DISPLAY.s.l == (DISPLAY.s.lp.last() - DISPLAY.s.vs.w))		return;
			else															setTimeout(tscroll, 1000/60);
		}
		tscroll();
	}


	var EXPORT = function(options){
		var innerFunctions = {
			getSize: function(options){
				var rRow = [];
				var rCol = [];
	
				for(var i = 0; i < _Side.c; i++){
					rCol.push( _Side.w[i] );
				}

				for(var i = 0; i < _Table.c; i++){
					if(_Top.branches[i].visible)
						rCol.push( _Top.branches[i].width );
				}

				for(var i = 0; i < _Top.r; i++){
					rRow.push( _Top.h[i] );
				}

				for(var i = 0; i < _Table.r; i++){
					if(!_Side.branches[i].visible)		continue;
					for(var j = 0; j < _Side.branches[i].rcount; j++ ){
						rRow.push( _Side.branches[i].height / _Side.branches[i].rcount );		
					}
				}
				return { row: rRow, col: rCol };
			},
			getTable: function(options){
				var rTable = [];
	
				for(var i = 0; i < _Top.r; i++){
					var row = rTable[rTable.push([]) - 1];
					for(var j = 0; j < _Side.c; j++){
						row.push({ type: 'corn', text: '' });
					}
					for(var j = 0; j < _Top.c; j++){
						if(_Top.branches[j].visible)
							row.push({	type: 'thead',
										code: ('t' + _Top.visual[i][j].i[0] + '-' + _Top.visual[i][j].j[0]), 
										text: _Top.visual[i][j].obj.text,
										s: (_Top.visual[i][j].obj.type == undefined) ? true : false });
					}
				}
	
				for(var i = 0; i < _Table.r; i++){
					if(!_Side.branches[i].visible)			continue;

					for(var k = 0; k < _Side.branches[i].rcount; k++){
						var row = rTable[rTable.push([]) - 1];
						for(var j = 0; j < _Side.c; j++){
							row.push({	type: 'shead',
										text: _Side.visual[i][j].obj.text,
										code: ('s' + _Side.visual[i][j].i[0] + '-' + _Side.visual[i][j].j[0]), 
										s: (_Side.visual[i][j].obj.type == undefined) ? true : false });
						}
						row[0].i = i;
						for(var j = 0; j < _Table.c; j++){

							if(!_Top.branches[j].visible)	continue;

							var cell = _Table.cells[i][j];
							// default value
							var type = 0;
							var text = ' ';

							// sign
							var alter = undefined;

							// set default style for cell -- object style initialization
							var style = {
								background: _colors.table[0][0],
								round: 0,
								percent: 0,
								color: _colors.alter.t[0]
							};
	
							if(cell.visual[k]){
								var sep = (_Side.branches[i].obj.type == undefined || _Top.branches[j].obj.type == undefined);

								type = cell.visual[k].type;
								text = cell.obj[( type == 3) ? 0 : type];


								// set background for cell
								style.background = _colors.table[setting.whiteBackground ? 1 : 0][ cell.visual[k].type];
	
								// set round for cell
								if((type == 0 || type == 3)	&& cell.round == 2)
									style.round = setting.round[2];				
								else if(type != 0 && type != 3)
									style.round = setting.round[1];
								else
									style.round = setting.round[0];

								// set percent for cell
								if((type == 1 || type == 2)	&& setting.showPercent)
									style.percent = true;
		

								if(text === null)							text = (setting.showZero && !sep) ? 0 : ''; 
								else if(text === 0 && setting.hideZero)		text = '';
								else if(isNaN(text) || text == 'NaN' )		text = '';
								else										text = tools.roundPlus(text, style.round);
							}


							if(cell.alter){
								if(cell.alter.b)	style.background = _colors.alter.b[cell.alter.b];
								if(cell.alter.t)	style.color = _colors.alter.t[cell.alter.t];

								if( ( cell.alter.n || cell.alter.a ) && !k){
									alter = {
										n: cell.alter.n,
										a: ((cell.alter.a) ? cell.alter.a : 0)
									}
								}
							}				
	
							row.push({
								text: text,
								style: style,
								alter: alter
							});
						}
					}
				}
				options.r = rTable.length - _Top.r;				/*count of rows without top headers*/
				return rTable;
			},
			cutTop: function(eObj){
				for(var i = _Top.r - 1; i >= 0; i--){
					eObj.table.splice(i, 1);
					eObj.row.splice(i, 1);
				}
			},
			cutSide: function(eObj){
				for(var i = 0; i < eObj.table.length; i++){
					eObj.table[i][_Side.c].i = eObj.table[i][0].i;
				}
				for(var i = _Side.c - 1; i >= 0; i--){
					eObj.col.splice(i, 1);
					for(var j = 0; j < eObj.table.length; j++){
						eObj.table[j].splice(i, 1)
					}
				}
			},
			cutSelect: function(eObj, options){
				var cols = [];
				var rows = [];
	
				for(var i = 0; i < SELECT.table.length; i++){
					if( rows.indexOf(SELECT.table[i].i[0]) == -1 )	rows.push(SELECT.table[i].i[0]);
					if( cols.indexOf(SELECT.table[i].j[0]) == -1 )	cols.push(SELECT.table[i].j[0]);
				}
	
				var c = 0, r = 0;
				for(var i = 0; i < _Side.branches.length; i++){
					if(_Side.branches[i].visible) r += _Side.branches[i].rcount;
				}
				for(var i = 0; i < _Top.branches.length; i++){
					if(_Top.branches[i].visible) c++;
				}
				
				var sc = ((eObj.table[0]) ? eObj.table[0].length : 0) - c; 
				var tr = eObj.table.length - r;
	
				for(var i = r - 1; i >= 0; i--){
					if( rows.indexOf(eObj.table[i + tr][0].i) == -1 ){
						eObj.table.splice(i + tr, 1);
						eObj.row.splice(i + tr, 1);
					}
				}
				for(var i = c - 1; i >= 0; i--){
					if( cols.indexOf(i) == -1){
						for(var j = 0; j < eObj.table.length; j++){
							eObj.table[j].splice(i + sc, 1);
						}
						eObj.col.splice(i + sc, 1);
					}
				}
				if(!options.fullHeader){
					
					var sl = sc;
					var tl = tr;
					for(var i = 0; i < SELECT.side.length; i++){	if(SELECT.side[i].j.last() < sl)	sl = SELECT.side[i].j.last();	}
					for(var i = 0; i < SELECT.top.length; i++){		if(SELECT.top[i].i.last() < tl)		tl = SELECT.top[i].i.last();	}
				
					for(var i = tl - 1; i >= 0; i--){
						eObj.table.splice(i, 1);
						eObj.row.splice(i, 1);
					}
					for(var i = sl - 1; i >= 0; i--){
						for(var j = 0; j < eObj.table.length; j++){
							eObj.table[j].splice(i, 1)
						}
						eObj.col.splice(i, 1)
					}
				}
			},
			mergeTable: function(table){
				for(var i = 0; i < table.length; i++){
					for(var j = table[i].length - 1; j > 0; j--){
						if((table[i][j].type == 'shead' || table[i][j].type == 'thead' || table[i][j].type == 'corn') && table[i][j].code == table[i][j - 1].code){
							var f = (table[i][j].cols != undefined) ? table[i][j].cols : 1;
							table[i][j - 1].cols = 1 + f;
							table[i][j] = undefined;
						}
					}
				}
				for(var i = table.length - 1; i > 0; i--){
					for(var j = 0; j < table[i].length; j++){
						if(!table[i][j] || !table[i - 1][j])	continue;
						if((table[i][j].type == 'shead' || table[i][j].type == 'thead' || table[i][j].type == 'corn') && table[i][j].code == table[i - 1][j].code){
							var f = (table[i][j].rows != undefined) ? table[i][j].rows : 1;
							table[i - 1][j].rows = 1 + f;
							table[i][j] = undefined;
						}
					}
				}
			},		
			removeRepeat: function(table){
				for(var i = 0; i < table.length; i++){
					for(var j = table[i].length - 1; j > 0; j--){
						if((table[i][j].type == 'shead' || table[i][j].type == 'thead' || table[i][j].type == 'corn') && table[i][j].code == table[i][j - 1].code && table[i][j].code != null){
							table[i][j].text = '';
							table[i][j].code = null;
						}
					}
				}
				for(var i = table.length - 1; i > 0; i--){
					for(var j = 0; j < table[i].length; j++){
						if(!table[i][j] || !table[i - 1][j])	continue;
						if((table[i][j].type == 'shead' || table[i][j].type == 'thead' || table[i][j].type == 'corn') && table[i][j].code == table[i - 1][j].code && table[i][j].code != null){
							table[i][j].text = '';
							table[i][j].code = null;
						}
					}
				}
			},
			removeEmpty: function(eObj){
				var table = eObj.table;
				var col = eObj.col;
				var row = eObj.row;

				for(var i = table.length - 1; i > 0; i--){
					var empty = true;
					for(var j = 0; j < table[i].length; j++){
						if(table[i][j] !== undefined){
							empty = false;
							break;
						}
					}
					if(empty){
						for(var j = 0; j < table[i - 1].length; j++){
							for(var s = i - 1; s >= 0; s--){
								if( table[s][j] !== undefined){
									table[s][j].rows += -1; 
									break;
								}
							}
						}
						table.splice(i, 1);
						if(row){
							row[i] += row[i - 1];
							row.splice(i - 1, 1);
						}
					}
				}				
				if(table.length != 0){
					for(var i = table[0].length - 1; i > 0; i--){
						var empty = true;
						for(var j = 0; j < table.length; j++){
							if(table[j][i] !== undefined){
								empty = false;
								break;
							}
						}
						if(empty){
							for(var j = 0; j < table.length; j++){
								for(var s = i - 1; s >= 0; s--){
									if(table[j][s] !== undefined){
										table[j][s].cols += -1; 
										break;
									}
								}
							}
							for(var j = 0; j < table.length; j++){
								table[j].splice(i, 1);
							}
							if(col){
								col[i] += col[i - 1];
								col.splice(i - 1, 1);
							}
						}
					}
				}
			},
			setLast: function(table){
				for(var i = 0; i < table.length; i++){
					for(var j = table[i].length - 1; j >= 0; j--){
						if(table[i][j] == undefined)	continue;
						if(table[i][j].type == 'shead'){
							table[i][j].l = true;
							break;
						}
					}
				}
			},
			separateSplitter: function(table){
				for(var i = 0; i < table.length; i++){
					for(var j = 0; j < table[i].length; j++){
						if(table[i][j] == undefined)	continue
						if(table[i][j].s == true && table[i][j].cols > 1 && table[i][j].type == 'shead'){
							table[i][j + table[i][j].cols - 1] = {text: table[i][j].text, type: 'shead'}
							table[i][j].text = '';

							if(table[i][j].cols != 2)	table[i][j].cols--;
							else						table[i][j].cols = undefined;
						}
						if(table[i][j].s == true && table[i][j].rows > 1 && table[i][j].type == 'thead'){
							table[i + table[i][j].rows - 1][j] = {text: table[i][j].text, type: 'thead'}
							table[i][j].text = '';

							if(table[i][j].rows != 2)	table[i][j].rows--;
							else						table[i][j].rows = undefined;
						}
					}
				}
			},
			collectStyles: function(table){
				var styles = [];
				for(var i = 0; i < table.length; i++){
					for(var j = 0; j < table[i].length; j++){
						var cell = table[i][j];
						if(!cell)		continue;
						if(!cell.style)	continue;

						var index = -1;
						for(var k = 0; k < styles.length; k++){
							if(	styles[k].background == cell.style.background
								&& styles[k].color == cell.style.color
								&& styles[k].round == cell.style.round
								&& styles[k].percent == cell.style.percent	){
								index = k;
								break;
							}
						}

						if(index == -1){
							index = styles.length;
							styles.push( cell.style );
						}

						cell.type = index;
						cell.style = undefined;
					}
				}
				return styles;
			},
			autoSize: function(eObj){
				var row = eObj.row;
				var col = eObj.col;
				var t = eObj.table;

				_Table.ctx.font = size.text + "px tunga, calibri, garamond, serif";


				for(var i = 0; i < t.length; i++){
					for(var j = 0; j < t[i].length; j++){
						var cell = t[i][j];
						if(!cell)		continue;
						if(!cell.style)	continue;
						
						var altWidth = 0;
						if(cell.alter){
							if(cell.alter.n)		altWidth = _Table.ctx.measureText(cell.alter.n).width + 4; 
						}
	
						width = size.numeral * (Math.round(cell.text).toString().length + cell.style.round) + 8 + altWidth;
						if(col[j] < width)		col[j] = width;
						
						
					}
				}
			},
			validation: function(eObj){


				if(!eObj.row.length)		eObj.row[0] = 20;
				if(!eObj.col.length)		eObj.col[0] = 100;

				if(!eObj.table.length)		eObj.table = [[{ type: 'corn' }]];
			}

		}

		if(typeof options != 'object')			options = {};
		if(SELECT.table.length == 0)			options.select = false;

		var exportObject	= innerFunctions.getSize(options);
		exportObject.table	= innerFunctions.getTable(options);

		if(!options.top)				innerFunctions.cutTop(exportObject);					// true - with top headers, false - without
		if(!options.side)				innerFunctions.cutSide(exportObject);					// true - with side headers, false - without
		if(options.select)				innerFunctions.cutSelect(exportObject, options);		// true - cut all table except selected cells

		if(!options.split)				innerFunctions.mergeTable(exportObject.table);			// true - separete merged cells
		if(options.repeat)				innerFunctions.removeRepeat(exportObject.table);		// true - remove in separeted cells text
		if(options.separateSplitter)	innerFunctions.separateSplitter(exportObject.table);	// true - separete all splitters to 2 cells

		innerFunctions.removeEmpty(exportObject);
		innerFunctions.setLast(exportObject.table);

		innerFunctions.autoSize(exportObject);
		innerFunctions.validation(exportObject);

		exportObject.styles = innerFunctions.collectStyles(exportObject.table);
		exportObject.orientation = setting.orientation;
		exportObject.separator = setting.separator;

		return exportObject;
	}

	var CREATE = {
		parent: function() {
			container = tools.createHTML({
				tag: 'div',
				className: 'tau-parent',
				tabIndex: 0,
				onkeydown: EVENTS.key.down,
				onkeyup: EVENTS.key.up,
				ondragover: EVENTS.dd.over,
				onblur: EVENTS.key.blur,
				oncontextmenu: EVENTS.context
			});
			return container;
		},
		corner: function() {
			_Corner = {};
			_Corner.html = tools.createHTML({
				tag: 'div',
				className: 'tau-corner',
				parent: container,
				onmousemove: EVENTS.move.corn,
				onclick: EVENTS.click.corner,
				ondblclick: EVENTS.dbl.corner,
				ondrop: EVENTS.dd.drop.corner,
				onmousedown: EVENTS.down.corn
			});
			_Corner.sort = tools.createHTML({  tag: 'div', className: 'tau-corner-content', parent: _Corner.html });
			_Corner.cont = tools.createHTML({  tag: 'div', className: 'tau-corner-content', parent: _Corner.html });
			return _Corner;
		},
		table: function() {
			_Table = {
				cells: [],
				visual: [],
				r: 0,
				c: 0,
				html: tools.createHTML({
					tag: 'canvas',
					className: 'tau-table',
					parent: container, 
					onmousedown: EVENTS.down.table,
					onmousemove: EVENTS.move.table,
					onmouseout: EVENTS.out.table,
					ondblclick: EVENTS.dbl.table,
					ondrop: EVENTS.dd.drop.table,
					onclick: EVENTS.click.table,
					onwheel: SCROLL.wheelVertical
				})
			};
			_Table.ctx = _Table.html.getContext("2d");
			return _Table;
		},
		side: function(){
			_Side = {
				tree: { children: []},
				branches: [],
				dw: [],
				visual: [],
				r: 0,
				c: 0,
				html: tools.createHTML({
					tag: 'canvas',
					className: 'tau-side',
					parent: container, 
					ondblclick: EVENTS.dbl.side, 
					onmousedown: EVENTS.down.side, 
					onmousemove: EVENTS.move.side,
					ondrop: EVENTS.dd.drop.side,
					onclick: EVENTS.click.side,
					onwheel: SCROLL.wheelVertical
				})
			};
			_Side.ctx = _Side.html.getContext("2d");
			return _Side;
		},
		top: function(){
			_Top = {
				tree: {children: []},
				branches: [],
				dh: [],
				visual: [],
				r: 0,
				c: 0,
				html: tools.createHTML({
					tag: 'canvas',
					className: 'tau-top',
					parent: container, 
					ondblclick: EVENTS.dbl.top,
					onmousedown: EVENTS.down.top,
					onmousemove: EVENTS.move.top,
					ondrop: EVENTS.dd.drop.top,
					onclick: EVENTS.click.top,
					onwheel: SCROLL.wheelHorizontal
				})
			};
			_Top.ctx = _Top.html.getContext("2d");
			return _Top;
		}
	}
	var SET = {
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
			BUILD.autoSize();
		},
		functions: function(options){
			if( typeof options.functions.rightClick == 'function' )		functions.rightClick = options.functions.rightClick;
			if( typeof options.functions.afterSelect == 'function' )	functions.afterSelect = options.functions.afterSelect;
			if( typeof options.functions.keyDown == 'function' )		functions.keyDown = options.functions.keyDown;
			if( options.functions.drop !== undefined )					functions.drop = options.functions.drop;
			if( options.functions.dbl !== undefined )					functions.dbl = options.functions.dbl;
			if( options.functions.click !== undefined )					functions.click = options.functions.click;
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
			if(options.size.text)			size.text = options.size.text;
			if(options.size.scale)			size.scale = options.size.scale;
			if(options.size.font)			size.font = options.size.font;

			_Table.ctx.font = size.text + "px " + size.font;
			
			size.dot				= _Table.ctx.measureText('.').width;
			size.numeral			= _Table.ctx.measureText('0000').width/4;
			size.percent			= _Table.ctx.measureText('%%%%').width/4;
			size.sharp				= _Table.ctx.measureText('####').width/4;
			size.minh = size.text + 4;
			size.minw = Math.floor(_Table.ctx.measureText('Abcdef').width) + 8;
		},
		scroll: function(options){
			if(options.SCROLL.x >= 0 && typeof options.SCROLL.x == 'number')	DISPLAY.s.l = options.SCROLL.x;
			if(options.SCROLL.y >= 0 && typeof options.SCROLL.y == 'number')	DISPLAY.s.t = options.SCROLL.y;
			if(options.SCROLL.x == -1)											DISPLAY.s.l = DISPLAY.s.lp.last();
			if(options.SCROLL.y == -1)											DISPLAY.s.t = DISPLAY.s.tp.last();
		}
	}
	var GET = {
		cell: {
			side: function(e){
				var x = GET.dpiM(e.pageX - _Side.coords.left);
				var y = GET.dpiM(e.pageY - _Side.coords.top) + DISPLAY.s.t;

				for(var ni = 0; ni < DISPLAY.s.rows.length; ni++){
					var i = DISPLAY.s.rows[ni];
					for(var j = 0; j < _Side.c; j++){

						var t = DISPLAY.s.tp[_Side.visual[i][j].i[0] ];
						var b = DISPLAY.s.tp[ _Side.visual[i][j].i.last() + 1 ];
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
				var x = GET.dpiM(e.pageX - _Top.coords.left) + DISPLAY.s.l;
				var y = GET.dpiM(e.pageY - _Top.coords.top);

				for(var ni = 0; ni < DISPLAY.s.cols.length; ni++){
					var i = DISPLAY.s.cols[ni];
					for(var j = 0; j < _Top.r; j++){

						var t = _Top.tp[ _Top.visual[j][i].i[0] ];
						var b = _Top.tp[ _Top.visual[j][i].i.last() + 1 ];
						var l = DISPLAY.s.lp[ _Top.visual[j][i].j[0] ];
						var r = DISPLAY.s.lp[ _Top.visual[j][i].j.last() + 1 ];

						if( b - 3 <= y && y <= b + 1 && r - 3 <= x && x <= r + 1 )		return [_Top.visual[j][i], 1, 1];
						if( b - 3 <= y && y <= b + 1 && x < r && x > l )				return [_Top.visual[j][i], 1, 0];
						if( r - 3 <= x && x <= r + 1 && y < b && y > t )				return [_Top.visual[j][i], 0, 1];
						if( t <= y && b >= y && l <= x && r >= x )						return [_Top.visual[j][i], 0, 0];
					}
				}
				return ;
			},
			table: function(e){
				var x = GET.dpiM(e.pageX - _Table.coords.left) + DISPLAY.s.l;
				var y = GET.dpiM(e.pageY - _Table.coords.top) + DISPLAY.s.t;

				for(var i = 0; i < DISPLAY.s.rows.length; i++){
					for(var j = 0; j < DISPLAY.s.cols.length; j++){

						var t = DISPLAY.s.tp[ DISPLAY.s.rows[i] ];
						var b = DISPLAY.s.tp[ DISPLAY.s.rows[i] + 1 ];
						var l = DISPLAY.s.lp[ DISPLAY.s.cols[j] ];
						var r = DISPLAY.s.lp[ DISPLAY.s.cols[j] + 1 ];

						if( t <= y && b >= y && l <= x && r >= x )						return _Table.cells[ DISPLAY.s.rows[i]][ DISPLAY.s.cols[j]];
					}
				}
				return ;
			}
		},
		position: {
			side: function(e){
				var x = GET.dpiM(e.pageX - _Side.coords.left);
				var y = GET.dpiM(e.pageY - _Side.coords.top) + DISPLAY.s.t;
				var p = {i: 0, j: 0};
				for(var i = 0; i < _Side.c; i++){		if( _Side.lp[i] <= x)										p.j = i;	}
				DISPLAY.s.rows.forEach(	function(i){	if( DISPLAY.s.tp[i] <= y && _Side.branches[i].visible)		p.i = i;	});
				return p;				
			},
			top: function(e){
				var x = GET.dpiM(e.pageX - _Top.coords.left) + DISPLAY.s.l;
				var y = GET.dpiM(e.pageY - _Top.coords.top);
				var p = {i: 0, j: 0};
				DISPLAY.s.cols.forEach(	function(i){	if( DISPLAY.s.lp[i] <= x  && _Top.branches[i].visible)		p.j = i;	});
				for(var i = 0; i < _Top.r; i++){		if( _Top.tp[i] <= y )										p.i = i;	}
				return p;

			},
			table: function(e){
				var x = GET.dpiM(e.pageX - _Table.coords.left) + DISPLAY.s.l;
				var y = GET.dpiM(e.pageY - _Table.coords.top) + DISPLAY.s.t;
				var p = {i: 0, j: 0};
				DISPLAY.s.cols.forEach(	function(i){	if( DISPLAY.s.lp[i] <= x)	p.j = i;	});
				DISPLAY.s.rows.forEach(	function(i){	if( DISPLAY.s.tp[i] <= y)	p.i = i;	});
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
				p.l = (p2.j > p1.j) ? p1.j : p2.j;
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
				result[0] = GET.dpiD(y - DISPLAY.s.t) + DISPLAY.s.y;
				result[1] = GET.dpiD(x);
				return result;
			},
			top: function(y, x){
				var result = [];
				result[0] = GET.dpiD(y);
				result[1] = GET.dpiD(x - DISPLAY.s.l) + DISPLAY.s.x;
				return result; 
			},
			table: function(y, x){
				var result = [];
				result[0] = GET.dpiD(y - DISPLAY.s.t) + DISPLAY.s.y;
				result[1] = GET.dpiD(x - DISPLAY.s.l) + DISPLAY.s.x;
				return result; 
			}
		},
		dpiD: function(v){	return Math.round(v*size.scale/size.dpi);	},
		dpiM: function(v){	return Math.round(v*size.dpi/size.scale);	},
		dpiMS: function(v){	return Math.round(v*size.dpi);	}
	}
	var EVENTS = {
		move: {
			side: function(e){

				var cell = GET.cell.side(e);

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

				var cell = GET.cell.top(e);

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
				var x = GET.dpiM(e.pageX - _Side.coords.left);
				var y = GET.dpiM(e.pageY - _Top.coords.top);
				var s = DISPLAY.s;
	
				if( s.y - 3 <= y && y <= s.y + 1 && s.x - 3 <= x && x <= s.x + 1 || e.ctrlKey){			_Corner.html.style.cursor = 'se-resize';	return;	}
				if( s.y - 3 <= y && y <= s.y + 1 && x < s.x && x > 0 || e.ctrlKey){						_Corner.html.style.cursor = 'n-resize';		return;	}
				if( s.x - 3 <= x && x <= s.x + 1 && y < s.y && y > 0 || e.ctrlKey){						_Corner.html.style.cursor = 'e-resize';		return;	}
	
				_Corner.html.style.cursor = 'default';			return;
			},
			table: function(e){
				var x = GET.dpiMS(e.pageX - _Table.coords.left);
				var y = GET.dpiMS(e.pageY - _Table.coords.top);
				
				if( DISPLAY.s.vw < x && x < DISPLAY.s.vw + 18 && y > DISPLAY.s.vh - 18 && y < DISPLAY.s.vh && !DISPLAY.s.corn.b){		DISPLAY.s.corn.b = true;	DISPLAY.table();	return false; };
				if( DISPLAY.s.vw < x && x < DISPLAY.s.vw + 18 && y < 18  && !DISPLAY.s.corn.t){											DISPLAY.s.corn.t = true;	DISPLAY.table();	return false; };
				if( !(DISPLAY.s.vw < x && x < DISPLAY.s.vw + 18 && y > DISPLAY.s.vh - 18 && y < DISPLAY.s.vh) && DISPLAY.s.corn.b){		DISPLAY.s.corn.b = false;	DISPLAY.table();	return false; };
				if( !(DISPLAY.s.vw < x && x < DISPLAY.s.vw + 18 && y < 18)  && DISPLAY.s.corn.t){										DISPLAY.s.corn.t = false;	DISPLAY.table();	return false; };

				if( DISPLAY.s.vh < y && y < DISPLAY.s.vh + 18 && x > DISPLAY.s.vw - 18 && x < DISPLAY.s.vw && !DISPLAY.s.corn.r){		DISPLAY.s.corn.r = true;	DISPLAY.table();	return false; };
				if( DISPLAY.s.vh < y && y < DISPLAY.s.vh + 18 && x < 18  && !DISPLAY.s.corn.l){											DISPLAY.s.corn.l = true;	DISPLAY.table();	return false; };
				if( !(DISPLAY.s.vh < y && y < DISPLAY.s.vh + 18 && x > DISPLAY.s.vw - 18 && x < DISPLAY.s.vw) && DISPLAY.s.corn.r){		DISPLAY.s.corn.r = false;	DISPLAY.table();	return false; };
				if( !(DISPLAY.s.vh < y && y < DISPLAY.s.vh + 18 && x < 18)  && DISPLAY.s.corn.l){										DISPLAY.s.corn.l = false;	DISPLAY.table();	return false; };
			} 
		},
		down: {
			corn: function(e){
				if(e.which != 1)	return;

				var x = GET.dpiM(e.pageX - _Side.coords.left);
				var y = GET.dpiM(e.pageY - _Top.coords.top);
				var s = DISPLAY.s;
	
				if( s.y - 3 <= y && y <= s.y + 1 && s.x - 3 <= x && x <= s.x + 1  || e.ctrlKey){		RESIZE.corner.down( e, 1, 1);	return;	}
				if( s.y - 3 <= y && y <= s.y + 1 && x < s.x && x > 0 || e.ctrlKey){						RESIZE.corner.down( e, 1, 0);	return;	}
				if( s.x - 3 <= x && x <= s.x + 1 && y < s.y && y > 0 || e.ctrlKey){						RESIZE.corner.down( e, 0, 1);	return;	}
	
				if(SELECT.table.length != 0)			link.clearAll();
				else if(_Table.c != 0 && _Table.r != 0)	link.selectAll();								

				console.log(main);
			},
			table: function(e){
				if(e.which != 1)	return;
				var x = GET.dpiM(e.pageX - _Table.coords.left);
				var y = GET.dpiM(e.pageY - _Table.coords.top);
				var cell = GET.cell.table(e);
	
				if( DISPLAY.s.vs.w > x && DISPLAY.s.vs.h < y && e.which == 1){				SCROLL.hdown(e, _Table.coords);	return;	}
				if( DISPLAY.s.vs.h > y && DISPLAY.s.vs.w < x && e.which == 1){				SCROLL.vdown(e, _Table.coords);	return;	}
	
				if(cell)	SELECT.cTable.down(e);	
				else		link.clearAll();
	
				return;
			},
			side: function(e){
				if(e.which != 1) return;

				var cell = GET.cell.side(e);

				if(cell){
					if((cell[1] || cell[2]) && cell[0].visible){
						RESIZE.side.down(e, cell[0], cell[1], cell[2]);
						return;
					}
				}

				if(cell)	SELECT.cSide.down(e);	
				else 		link.clearAll();

				return;
			},
			top: function(e){
				if(e.which != 1) return;

				var cell = GET.cell.top(e);

				if(cell){
					if((cell[1] || cell[2]) && cell[0].visible){
						RESIZE.top.down(e, cell[0], cell[1], cell[2]);
						return;
					}
				}

				if(cell)	SELECT.cTop.down(e);	
				else 		link.clearAll();

				return;
			}
		},
		click: {
			side: function(e){
				var cell = GET.cell.side(e);
				if(typeof functions.click == 'function'){
					if(cell)	functions.click(e, {cell: cell[0], i: cell[0].i[0], j: cell[0].j[0], area: 'side' });
					else		functions.click(e, { area: 'side' });
				}
			},
			top: function(e){
				var cell = GET.cell.top(e);
				if(typeof functions.click == 'function'){
					if(cell)	functions.click(e, {cell: cell[0], i: cell[0].i[0], j: cell[0].j[0], area: 'top' });
					else		functions.click(e, { area: 'top' });
				}
			},
			table: function(e){
				var cell = GET.cell.table(e);

				if(typeof functions.click == 'function'){
					if(cell)	functions.click(e, {cell: cell, i: cell.i[0], j: cell.j[0], area: 'table' });
					else		functions.click(e, { area: 'table' });
				}
			},
			corner: function(e){
				if(typeof functions.click == 'function'){
					functions.click(e, { area: 'corner' });
				}
			}
		},
		dbl: {
			side: function(e){
				var cell = GET.cell.side(e);
				if(cell){
					if(cell[2])		RESIZE.dbl.sideWidth(cell[0]);
					if(cell[1])		RESIZE.dbl.sideHeight(cell[0]);
					if(!cell[1] && !cell[2] && typeof functions.dbl == 'function'){
						functions.dbl(e, {cell: cell[0], i: cell[0].i[0], j: cell[0].j[0], area: 'side' });
					}
				}
			},
			top: function(e){
				var cell = GET.cell.top(e);
				if(cell){
					if(cell[2])		RESIZE.dbl.topWidth(cell[0]);
					if(cell[1])		RESIZE.dbl.topHeight(cell[0]);
					if(!cell[1] && !cell[2] && typeof functions.dbl == 'function'){
						functions.dbl(e, {cell: cell[0], i: cell[0].i[0], j: cell[0].j[0], area: 'top' });
					}
				}
			},
			table: function(e){

				var x = GET.dpiM(e.pageX - _Table.coords.left);
				var y = GET.dpiM(e.pageY - _Table.coords.top);
				
				var cell = GET.cell.table(e);

				if( DISPLAY.s.vs.w > x && DISPLAY.s.vs.h < y )	return;
				if( DISPLAY.s.vs.h > y && DISPLAY.s.vs.w < x )	return;

				if(typeof functions.dbl == 'function' && cell){
					functions.dbl(e, {cell: cell, i: cell.i[0], j: cell.j[0], area: 'table' });
				}
			},
			corner: function(e){
				if(typeof functions.dbl == 'function'){
					functions.dbl(e, { area: 'corner' });
				}
			}
		},
		context: function(e){
			if(functions.rightClick){
				var options;

				if(e.target == _Table.html){

					var cell = GET.cell.table(e);
					if(cell){
						if(!cell.select) SELECT.selectTable(cell.i[0], cell.i[0], cell.j[0], cell.j[0], false);
						options = {cell: cell, i: cell.i, j: cell.j, area: 'table' };
					} else	options = {cell: null, i: null, j: null, area: 'table' };

				} else if(e.target == _Side.html){

					var cell = GET.cell.side(e);

					if(cell){
						cell = cell[0];
						var types = [];

						if(cell.types){
							if(!(cell.types[0] && setting.showType[0]) && cell.floatType)				types.push(0);
							cell.types.forEach(function(item, i){ 	if(item && setting.showType[i])		types.push(i); });
						}
						if(!cell.select)	SELECT.selectSide( cell.i[0], cell.i.last(), cell.j[0], _Side.c - 1, false);

						options = {cell: cell, i:  cell.i, j:  cell.j, area: 'side', displayed: types, position: cell.index };
					} else {
						options = {cell: null, i:  null, j:  null, area: 'side' };
					}					

				} else if(e.target == _Top.html){

					var cell = GET.cell.top(e);

					if(cell){
						cell = cell[0];
						var types = [];

						if(cell.types){
							if(!(cell.types[0] && setting.showType[0]) && cell.floatType)				types.push(0);
							cell.types.forEach(function(item, i){ 	if(item && setting.showType[i])		types.push(i); });
						}
						if(!cell.select)	SELECT.selectTop( cell.i[0], _Top.r - 1, cell.j[0], cell.j.last(), false);

						options = {cell: cell, i:  cell.i, j:  cell.j, area: 'top', displayed: types, position: cell.index };
					} else {
						options = {cell: null, i:  null, j:  null, area: 'top' };
					}

				} else {	options = {area: 'corner'};		}

				DISPLAY.all();
				functions.rightClick(e, options);
				tools.stopProp(e);
				return false;
			}
		},
		key: {
			down: function(e){
				var kc = e.keyCode;
				if( kc == 38 || kc == 39 || kc == 40 || kc == 37 || kc == 65 || kc == 33 || kc == 34 || kc == 35 || kc == 36 || kc == 67 || kc == 83 ) tools.stopProp(e);

				if(e.shiftKey && SELECT.shift1st){		SELECT.shift = true;		DISPLAY.all();	}

				if( kc == 38 || kc == 39 || kc == 40 || kc == 37 ){
					if(kc == 38){
						if(e.shiftKey)		EVENTS.key.select( 0,-1);
						else				DISPLAY.s.t -= 30;
					}
					if(kc == 40){
						if(e.shiftKey)		EVENTS.key.select( 0, 1);
						else				DISPLAY.s.t += 30;
					}
					if(kc == 39){
						if(e.shiftKey)		EVENTS.key.select( 1, 0);
						else				DISPLAY.s.l += 30;
					}
					if(kc == 37){
						if(e.shiftKey)		EVENTS.key.select(-1, 0);
						else				DISPLAY.s.l -= 30;
					}
					DISPLAY.all();
					tools.stopProp(e);		return false;
				}				
				if(kc == 65 && e.ctrlKey){				SELECT.selectAll(); 		DISPLAY.all();			return false; }
				if(kc == 33 || kc == 34 || kc == 35 || kc == 36){
					if(kc == 33){	DISPLAY.s.t -= Math.round(DISPLAY.s.vh*0.8);	}
					if(kc == 34){	DISPLAY.s.t += Math.round(DISPLAY.s.vh*0.8);	}
					if(kc == 35){	DISPLAY.s.t = DISPLAY.s.tp.last();	}
					if(kc == 36){	DISPLAY.s.t = 0;	}
					DISPLAY.all();
					tools.stopProp(e);
					return false;
				}
				if( e.ctrlKey && ( kc == 67 || kc == 83) ){
					if(functions.keyDown)				functions.keyDown(e, link);		
					tools.stopProp(e);		
					return false;
				}
			},
			up: function(e){	if(!e.shiftKey && SELECT.shift1st){		SELECT.shift = false;		DISPLAY.table();	}},
			blur: function(e){	if( SELECT.shift1st){					SELECT.shift = false;		DISPLAY.table(); 	}},
			select: function(h, v){
				if(h == -1 && SELECT.shift2nd.j != 0)						SELECT.shift2nd.j -= 1;
				else if(h == 1 && SELECT.shift2nd.j != _Table.c - 1)		SELECT.shift2nd.j += 1;
				if(v == -1 && SELECT.shift2nd.i != 0)						SELECT.shift2nd.i -= 1;
				else if(v == 1 && SELECT.shift2nd.i != _Table.r - 1)		SELECT.shift2nd.i += 1;

				if(DISPLAY.s.lp[SELECT.shift2nd.j + 1] > DISPLAY.s.l + DISPLAY.s.vw)	DISPLAY.s.l = DISPLAY.s.lp[SELECT.shift2nd.j + 1] - DISPLAY.s.vw + 10;
				else if(DISPLAY.s.lp[SELECT.shift2nd.j] < DISPLAY.s.l )					DISPLAY.s.l = DISPLAY.s.lp[SELECT.shift2nd.j] - 10;

				if(DISPLAY.s.tp[SELECT.shift2nd.i + 1] > DISPLAY.s.t + DISPLAY.s.vh)	DISPLAY.s.t = DISPLAY.s.tp[SELECT.shift2nd.i + 1] - DISPLAY.s.vh + 10;
				else if(DISPLAY.s.tp[SELECT.shift2nd.i] < DISPLAY.s.t )					DISPLAY.s.t = DISPLAY.s.tp[SELECT.shift2nd.i] - 10;

				var p = GET.sortedPosition.table(SELECT.shift1st, SELECT.shift2nd);
				SELECT.selectTable(  p.t,  p.b,  p.l,  p.r,  false );
			}
		},
		out: {
			table: function(e){
				DISPLAY.s.corn = {};
				DISPLAY.table();
			}
		},
		dd: {
			drop: {
				side: function(e){
					var cell = GET.cell.side(e);
					if(cell) {
						cell = cell[0];
						functions.drop(e, { area: 'side', cell: cell, i: cell.i, j: cell.j,} );
					} else {
						functions.drop(e, { area: 'side', cell: undefined, i: undefined, j: undefined,} );
					}
					return false;
				},
				top: function(e){
					var cell = GET.cell.top(e);
					if(cell) {
						cell = cell[0];
						functions.drop(e, { area: 'top', cell: cell, i: cell.i, j: cell.j,} );
					} else {
						functions.drop(e, { area: 'top', cell: undefined, i: undefined, j: undefined,} );
					}
					return false;
				},
				corner: function(e){
					functions.drop(e, { area: 'corner'} );
					return false;
				},
				table: function(e){
					var cell = GET.cell.table(e);
					if(cell) 	functions.drop(e, { area: 'table', cell: cell, i: cell.i, j: cell.j,} );
					else		functions.drop(e, { area: 'table', cell: undefined, i: undefined, j: undefined,} );
					return false;
				}
			},
			over: function(e){
				if( typeof functions.drop == 'function')	return false;
				else return true;

			}
		}		
	}

	var BUILD = new function(){
		this.setTable = function(top, side, table){

			removeTable();
			if(top == undefined || side == undefined || table == undefined) return;

			setBranches(top, _Top.tree);
			setBranches(side, _Side.tree);
			_Top.branches = BUILD.getSignBranches(_Top.tree)
			_Side.branches = BUILD.getSignBranches(_Side.tree);

			_Top.r	= BUILD.getDepth(_Top.tree) - 1;
			_Side.c	= BUILD.getDepth(_Side.tree) - 1;
			_Top.c	= _Table.c = _Top.branches.length;
			_Side.r	= _Table.r = _Side.branches.length;

			_Top.branches.forEach(function(item, i){item.index = i;});
			_Side.branches.forEach(function(item, i){item.index = i;});

			normalizeIntupTable(table);
			setTable(table);

			setSize();
			BUILD.autoSize();
		}
		function removeTable(){
			_Side.branches.forEach(function(item, i) { size.table.h[i] = item.dh; });
			_Top.branches.forEach(function(item, i) { size.table.w[i] = item.dw; });

			if(_Side.dw.length < size.corner.w.length ){
				for(var i = 1; i <= _Side.dw.length; i++ )
					size.corner.w[size.corner.w.length - i] = _Side.dw[_Side.dw.length - i] 
			} else 	size.corner.w = _Side.dw;
			if(_Top.dh.length < size.corner.h.length ){
				for(var i = 1; i <= _Top.dh.length; i++ )
					size.corner.h[size.corner.h.length - i] = _Top.dh[_Top.dh.length - i]
			} else	size.corner.h = _Top.dh;

			_Side.tree.children = [];
			_Top.tree.children = [];
			_Top.c = _Top.r = _Table.c = _Table.r = _Side.c = _Side.r = 0;
			SELECT.table = [];
			SELECT.side = [];
			SELECT.top = [];
			SORT.side = {};
			SORT.top = {};
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
			var c = _Table.ctx;

			c.font = size.text + "px tunga, calibri, garamond, serif";
			c.textBaseline = "alpabetic";
			c.textAlign = "left";

			_Top.branches.forEach(function(item, j){
				
				var width = item.dw;
				var symbol = 0;

				for(var i = 0; i < _Table.r; i++){
					_Table.cells[i][j].base = ((_Side.branches[i].obj.base || _Top.branches[j].obj.base) && !(_Side.branches[i].obj.type == undefined || _Top.branches[j].obj.type == undefined)) ? 1 : 0;

					var altWidth = 0;
					if(_Table.cells[i][j].alter){
						if(_Table.cells[i][j].alter.n)		altWidth = c.measureText(_Table.cells[i][j].alter.n).width + 4; 
					}

					_Table.cells[i][j].obj.forEach( function(cell, k){
						var percent = (setting.showPercent && (k == 1 || k == 2));
						var round;

						var rSide = (_Side.branches[i].obj.type == 3 || _Side.branches[i].obj.type == 8) ? 2 : 0;
						var rTop = (_Top.branches[j].obj.type == 3 || _Top.branches[j].obj.type == 8) ? 2 : 0;

						if(k == 0)		round = (rSide != rTop) ? more : rSide;
						else 			round = 1;


						var newWidth = (tools.roundPlus(cell, setting.round[round]) + '').length * size.numeral
									+ ((percent) ? size.percent : 0)
									+ altWidth + 8;

						if(width < newWidth)	width = newWidth + 1;
						if(k == 0)				_Table.cells[i][j].round = round;
					});
				}
				item.dw = Math.round(width);
			});
		}
		this.getDepth = function(tree){
			var result = 1;
			if(tree.children){
				var max = 0;
				for(var i = 0; i < tree.children.length; i++){
					var topical = BUILD.getDepth(tree.children[i]);
					if(topical > max)		max = topical;
				}
				result += max;
			}
			return result;
		}
		this.getSignBranches = function(tree){
			var result = [];
			if(tree.children){
				for(var i = 0; i < tree.children.length; i++) 		result = result.concat(BUILD.getSignBranches(tree.children[i]));
			} else result.push(tree);
			return result;
		}
		function setBranches(items, parent){
			if(!Array.isArray(items))			items = [items];
			if(parent.children == undefined)	parent.children = [];

			for(var i = 0; i < items.length; i++){
				var branch = { visible: true, obj: items[i], parent: parent, base: items[i].base, unsort: items[i].unsort };
				branch.aShow = items[i].aShow;
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
	var REMAKE = new function(){
		this.reBuild = function(){

			_Side.visual = [];
			_Side.tree.children.forEach( function(item){ reBuildSide(item, 0); } );

			_Top.visual = [];
			for(var i = 0; i < _Top.r; i++) _Top.visual[i] = [];
			_Top.tree.children.forEach( function(item){ reBuildTop(item, 0); } );

			_Top.branches = BUILD.getSignBranches(_Top.tree)
			_Side.branches = BUILD.getSignBranches(_Side.tree);

			REMAKE.reDrow();
		}
		function reBuildSide(item, level){
			var newLevel;
			item.i = [];			item.j = [];

			if(item.children){
				newLevel = (item.obj.skip) ? level : (_Side.c - BUILD.getDepth(item) + 1);
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
				newLevel = (item.obj.skip) ? level : (_Top.r - BUILD.getDepth(item) + 1);
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

			DISPLAY.generate();
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

			_Table.ctx.font = size.text + "px tunga, calibri, garamond, serif";

			for(var i = 0; i < _Table.r; i++){
				for(var j = 0; j < _Table.c; j++){
					var cell = _Table.cells[i][j];
					cell.i = [i];	cell.j = [j];

					if(!_Side.branches[i].visible || !_Top.branches[j].visible) continue;

					cell.visual = [];

					var altWidth = 0;
					if(_Table.cells[i][j].alter){
						if(_Table.cells[i][j].alter.n)		altWidth = _Table.ctx.measureText(_Table.cells[i][j].alter.n).width + 4; 
					}

					var reDrowCell = function(cell, item, type){
						var text = item;
						var round;
						var width = _Top.branches[j].width - 7;
						var percent = (setting.showPercent && (type == 1 || type == 2));

						if(type == 0)		round = setting.round[cell.round];
						else				round = setting.round[1];

						if(text === null)							text = (setting.showZero & !sep) ? '0' : ' '; 
						else if(text === 0 && setting.hideZero)		text = ' ';
						else										text = tools.roundPlus(text, round) + '';
						if(percent && text != ' ')					text = text + '%';

						if( text.length*size.numeral + altWidth > width){
							var end = (width - altWidth )/size.sharp - 1;
							text = '';
							for(var s = 0; s < end; s++ )			text += '#';								
						}

						//only first string cut by function ALTER
						altWidth = 0;
						cell.visual.push({
							text: text.replace(/\./g, setting.separator),
							type: ((type == 0 && cell.base) ? 3 : type)
						});
					}


					var sep = (_Side.branches[i].obj.type == undefined || _Top.branches[j].obj.type == undefined);
					cell.obj.forEach( function(item, type){ if(setting.showType[type]){ reDrowCell(cell, item, type); } } );
					if(!cell.visual.length){
						_Side.branches[i].floatType = true;
						_Top.branches[j].floatType = true; 
						reDrowCell(cell, cell.obj[0], 0);
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
			DISPLAY.s.lp = [0]; //left position
			_Top.branches.forEach( function(item, i){	DISPLAY.s.lp.push( DISPLAY.s.lp[i] + item.w ); } );

			DISPLAY.s.tp = [0];	//top position
			_Side.branches.forEach( function(item, i){	DISPLAY.s.tp.push( DISPLAY.s.tp[i] + item.h ); } );

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
				if(tree == SORT.side.cell)	cutText(tree.obj.text, tree.width - 15, tree.height - 4, tree); 
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
			else if(tree == SORT.top.cell)										cutText(tree.obj.text, tree.width - 15, tree.height - 4, tree);
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
	var DISPLAY = new function(){

		var s = this.s = { l: 0, t: 0, corn: {} };
		//	s - self,
		//	l - left (viewport left coord), t - top (viewport top coord),
		//	vh - viewport height, vw - viewport width,
		//	corn - active state of the control
	
		this.generate = function(){
			var x = (((_Side.w.length) ? _Side.lp.last() : 100)*size.scale/size.dpi);
			var y = (((_Top.h.length) ? _Top.tp.last() : 100)*size.scale/size.dpi);

			var height = (container.clientHeight - y); //viewport height
			var width  = (container.clientWidth - x); //veiwport width

			s.vh = height*size.dpi;
			s.vw = width*size.dpi;

			if( (height < 0) || (width < 0) )	return;

			_Table.html.width = _Top.html.width = s.vw;
			_Table.html.height = _Side.html.height = s.vh;

			_Table.html.style.width = _Top.html.style.width = width + 'px';
			_Table.html.style.height = _Side.html.style.height = height + 'px';

			_Top.html.height = s.y = y*size.dpi;
			_Side.html.width = s.x = x*size.dpi;

			_Corner.html.style.height = (y - size.scale/size.dpi) + 'px';
			_Corner.html.style.width = (x - size.scale/size.dpi) + 'px';

			s.vh += -18;
			s.vw += -18;

			if(s.l > (s.lp.last() - s.vw))	s.l = (s.lp.last() - s.vw > 0) ? (s.lp.last() - s.vw) : 0 ;
			if(s.t > (s.tp.last() - s.vh))	s.t = (s.tp.last() - s.vh > 0) ? (s.tp.last() - s.vh) : 0 ;

			_Table.coords = _Table.html.getBoundingClientRect();
			_Side.coords = _Side.html.getBoundingClientRect();
			_Top.coords = _Top.html.getBoundingClientRect();

			DISPLAY.all();
		}

		this.table = function(){
			//scaled viewport
			var vs = s.vs = {
				w: s.vw / size.scale,
				h: s.vh / size.scale
			}

			//verification of viewport position
			if( s.t > (s.tp.last() - vs.h)) s.t = s.tp.last() - vs.h;
			if( s.l > (s.lp.last() - vs.w)) s.l = s.lp.last() - vs.w;
			if( s.t < 0) s.t = 0;
			if( s.l < 0) s.l = 0;

			var c = _Table.ctx;

			//clear canvas
			c.clearRect(0, 0,  s.vw + 18, s.vh + 18);

			// set background borders
			c.fillStyle = '#AAA';
			c.fillRect(0, 0,
				size.scale * ((vs.w > s.lp.last()) ? s.lp.last() : vs.w),
				size.scale * ((vs.h > s.tp.last()) ? s.tp.last() : vs.h));

			//translate viewport 
			c.translate(
				- size.scale * s.l,
				- size.scale * s.t );

			// finding cells in the viewport.
			// check conditions: left or right border 
			// located between viewport or one border is between cell borders

			s.cols = [];
			s.rows = [];
			for( var i = 0; i < _Table.c; i++){
				if(( s.lp[i] >= s.l		&& s.lp[i] <= s.l + vs.w )
				|| ( s.lp[i] <= s.l		&& s.lp[i + 1] >= s.l + vs.w )
				|| ( s.lp[i + 1] >= s.l	&& s.lp[i + 1] <= s.l + vs.w ))
					s.cols.push(i);
			}
			for( var i = 0; i < _Table.r; i++){
				if(( s.tp[i] >= s.t		&& s.tp[i] <= s.t + vs.h )
				|| ( s.tp[i] <= s.t		&& s.tp[i + 1] >= s.t + vs.h )
				|| ( s.tp[i + 1] >= s.t	&& s.tp[i + 1] <= s.t + vs.h ))
					s.rows.push(i);
			}


			// make lines
			// 2 type of lines: dash line (for hidden cells)
			// and dark line (for different group of headers)

			c.fillStyle = '#555';
			s.rows.forEach(function(i){
				if(!_Side.branches[i].visible && setting.dashHidden){
					// first line match with SIDE and TOP areas
					if(i != 0)
						drow.dashLine(
							c,
							'#555',
							'#fff',
							size.scale * 0,
							size.scale * (s.tp[i + 1] - 0.5),
							size.scale * ((vs.w > s.lp.last()) ? s.lp.last() : vs.w),
							size.scale * (s.tp[i + 1] - 0.5));
					else
						drow.dashLine(
							c,
							'#999',
							'#fff',
							size.scale * 0,
							size.scale * 0.5,
							size.scale * ((vs.w > s.lp.last()) ? s.lp.last() : vs.w),
							size.scale * 0.5);
				} else if(_Side.branches[i].line)
					c.fillRect(
						size.scale * s.l,
						size.scale * (s.tp[i + 1] - 1),
						size.scale * (s.l + ((vs.w > s.lp.last()) ? s.lp.last() : vs.w) ),
						size.scale * 1 );			
			});
			s.cols.forEach(function(i){
				if(!_Top.branches[i].visible && setting.dashHidden){
					if(i != 0)
						drow.dashLine(
							c,
							'#555',
							'#fff',
							size.scale * (s.lp[i + 1] - 0.5),
							size.scale * 0,
							size.scale * (s.lp[i + 1] - 0.5),
							size.scale * ((vs.h > s.tp.last()) ? s.tp.last() : vs.h));
					else
						drow.dashLine(
							c,
							'#999',
							'#fff',
							size.scale * 0.5,
							size.scale * 0,
							size.scale * 0.5,
							size.scale * ((vs.h > s.tp.last()) ? s.tp.last() : vs.h));
				} else if(_Top.branches[i].line)
					c.fillRect(
						size.scale * (s.lp[i + 1] - 1),
						size.scale * (s.t),
						size.scale * 1,
						size.scale * (s.t + ((vs.h > s.tp.last()) ? s.tp.last() : vs.h)));
			});


			// background painting in cells
			// background color relate with type of cells
			// also for shift-cell used black border

			s.rows.forEach(function(i){
				s.cols.forEach(function(j){

					if(!_Top.branches[j].visible || !_Side.branches[i].visible)		return;

					var back = 2;
					var cell = _Table.cells[i][j];

					if(SELECT.shift && i == SELECT.shift1st.i && j == SELECT.shift1st.j){						
						c.fillStyle = '#000000';
						c.fillRect(
							size.scale * (s.lp[j] - 1),
							size.scale * (s.tp[i] - 1),
							size.scale * (_Top.branches[j].w + 1),
							size.scale * (_Side.branches[i].h + 1)
						);
					}
					
					for(var k = 0; k < cell.visual.length; k++){
						c.fillStyle = _colors.table[setting.whiteBackground ? 1 : 0][ cell.visual[k].type];
						if(cell.alter){
							if(cell.alter.b){
								c.fillStyle = _colors.alter.b[cell.alter.b];
							}
						}

						c.fillRect(
							size.scale * (s.lp[j]),
							size.scale * (s.tp[i] + cell.height*k),
							size.scale * (_Top.branches[j].w - 1),
							size.scale * (cell.height));
					}
				});
			});


			// paiting select-style in cells
			// for hover used opacity - 0.2
			// for select used opacity - 0.1

			s.rows.forEach(function(i){
				s.cols.forEach(function(j){

					if(!_Top.branches[j].visible || !_Side.branches[i].visible)		return;

					if(_Table.cells[i][j].hover){
						c.fillStyle = "rgba(0,0,0,0.2)";
						c.fillRect(
							size.scale * (s.lp[j]),
							size.scale * (s.tp[i]),
							size.scale * (_Top.branches[j].w - 1),
							size.scale * (_Side.branches[i].h - 1));
					}
					else if(_Table.cells[i][j].select){
						c.fillStyle = "rgba(0,0,0,0.15)";
						c.fillRect(
							size.scale * (s.lp[j]),
							size.scale * (s.tp[i]),
							size.scale * (_Top.branches[j].w - 1),
							size.scale * (_Side.branches[i].h - 1));
					}
				});
			});


			// paiting text
			// set setting of text
			c.textBaseline = "alpabetic";
			c.textAlign = "right";
			c.fillStyle = '#000';
			c.font = size.scale * size.text + "px " + size.font;

			s.rows.forEach(function(i){
				s.cols.forEach(function(j){
					if(!_Top.branches[j].visible)		return;
					if(!_Side.branches[i].visible)		return;
					if(_Table.cells[i][j].alter){
						if(_Table.cells[i][j].alter.t)	return;
					}

					var cell = _Table.cells[i][j];			
					for(var k = 0; k < cell.visual.length; k++){
						c.fillText(
							cell.visual[k].text,
							size.scale * (s.lp[j + 1] - 4), 
							size.scale * (s.tp[i] + cell.height*k + size.text ));
					}
				});
			});


			// paiting diferent type of text
			// t - text type - 1 - red, 2 - green 
			s.rows.forEach(function(i){
				s.cols.forEach(function(j){
					if(!_Top.branches[j].visible || !_Side.branches[i].visible)		return;
					var cell = _Table.cells[i][j];
					
					if(cell.alter){
						if(cell.alter.t){
							c.fillStyle = _colors.alter.t[cell.alter.t];

							for(var k = 0; k < cell.visual.length; k++){
								c.fillText(
									cell.visual[k].text,
									size.scale * (s.lp[j + 1] - 4), 
									size.scale * (s.tp[i] + cell.height*k + size.text));
							}
						}
					}
				});
			});


			// paiting arrow and signif
			// addition font - latha, tunga
			c.font = size.scale * (size.text ) + "px tunga, calibri, garamond, serif";
			c.textBaseline = "alpabetic";
			c.textAlign = "left";
			s.rows.forEach(function(i){
				s.cols.forEach(function(j){
					if(!_Top.branches[j].visible || !_Side.branches[i].visible)
						return;
					
					var cell = _Table.cells[i][j];
					if(cell.alter){
						var str = '';

						c.fillStyle = _colors.alter.a[cell.alter.a];

						if(cell.alter.a)			c.fillStyle = _colors.alter.a[cell.alter.a];
						else						c.fillStyle = _colors.alter.a[0];

						if(cell.alter.n){
							c.fillText(
								cell.alter.n,
								size.scale * (s.lp[j] + 4),
								size.scale * (s.tp[i] + size.text + 1)
							);
						}
					}
				});
			});

			//return viewport 
			c.translate(
				size.scale * s.l,
				size.scale * s.t );

			drow.verticalScroll(c, vs.h);
			drow.horizontalScroll(c, vs.w);

			c.fillStyle = '#aaa';
			c.fillRect( 0, s.vh - 1, s.vw, 1 );
			c.fillRect( s.vw - 1, 0, 1, s.vh );
		}

		this.top = function(){
			var c = _Top.ctx;

			// clear canvas
			c.clearRect(0, 0, s.vw, s.y);

			// set background borders
			c.fillStyle = '#555';
			c.fillRect(	0,	0,
				(( s.vw > s.lp.last()) ? s.lp.last() : s.vw),
				s.y
			);
			
			// translate viewport 
			c.translate( 
				size.scale * (- s.l),
				size.scale * 0
			);


			// mark cells which is in viewport
			// 1 - cells not displayed 
			s.cols.forEach(	function(j){
				for(var i = 0; i < _Top.r; i++)
					_Top.visual[i][j].displayed = 1;
			});

			// drow dash line and
			// remove hidden cells
			s.cols.forEach(	function(j){
				for(var i = 0; i < _Top.r; i++)
					if(_Top.visual[i][j].displayed == 1 && !_Top.visual[i][j].visible){
						if(setting.dashHidden)
							drow.dashLine(c,
								'#000',
								'#f1f1f1',
								size.scale * (s.lp[_Top.visual[i][j].j.last() + 1] - 0.5),
								size.scale * (_Top.tp[_Top.visual[i][j].i[0]]),
								size.scale * (s.lp[_Top.visual[i][j].j.last() + 1] - 0.5),
								size.scale * (_Top.tp[_Top.visual[i][j].i.last() + 1])
							);

						_Top.visual[i][j].displayed = 0;	
					}
			});


			// drow cells backgrounds
			c.fillStyle = _colors.header;
			s.cols.forEach( function(j){
				for(var i = 0; i < _Top.r; i++) { 
					var cell = _Top.visual[i][j];
	
					if(cell.displayed != 1) continue;				
					cell.displayed = 2;
	
					c.fillRect(
						size.scale * (s.lp[cell.j[0]]),
						size.scale * (_Top.tp[cell.i[0]]),
						size.scale * (cell.width - 1),
						size.scale * (cell.height - 1) );
			}});


			// paiting select-style in cells
			// for hover used opacity - 0.3
			// for select used opacity - 0.2
			// rgba( 0, 0, 0 ) - black for click on header
			// rgba( 81, 165, 255 ) - blue for click on table or other header
			s.cols.forEach( function(j){
				for(var i = 0; i < _Top.r; i++) { 
					var cell = _Top.visual[i][j];
	
					if(cell.displayed != 2) continue;				
					cell.displayed = 3;
					
					var back = undefined;
					if(cell.hover) 			back = 0.3;
					else if(cell.select)	back = 0.2;

					if(back){
						c.fillStyle = (SELECT.click == _Top) ? "rgba( 0, 0, 0," + back + ")" : "rgba( 81, 165, 255," + back + ")" ;
						c.fillRect(
							size.scale * (s.lp[cell.j[0]]),
							size.scale * (_Top.tp[cell.i[0]]),
							size.scale * (cell.width - 1),
							size.scale * (cell.height - 1) );

					}
			}});


			// paiting text
			// set setting of text 
			c.fillStyle = '#000';
			c.textBaseline = "middle";
			c.textAlign = "center";
			c.font = size.scale * size.text + "px " + size.font;
			s.cols.forEach( function(j){
				for(var i = 0; i < _Top.r; i++) { 
					var cell = _Top.visual[i][j];
	
					if(cell.displayed != 3) continue;				
					cell.displayed = 4;


					if(s.lp[cell.j[0]] + cell.width/2 - cell.textArray[0].width < s.l){
						if((s.lp[cell.j[0]] + cell.width - cell.textArray[0].width*2) > s.l ){

							// right side of cell near vp left border  
							c.fillText(
								cell.textArray[0].text,
								size.scale * (s.l + cell.textArray[0].width),
								size.scale * (_Top.tp[cell.i[0]] + cell.textArray[0].position)
							);
						} else {

							// right border of cell
							c.fillText(
								cell.textArray[0].text,
								size.scale * (s.lp[cell.j[0]] + cell.width - cell.textArray[0].width),
								size.scale * (_Top.tp[cell.i[0]] + cell.textArray[0].position)
							);
						}
					} else if((s.lp[cell.j[0]] + cell.width/2 + cell.textArray[0].width) > (s.l + s.vs.w)){
						if((s.lp[cell.j[0]] + cell.textArray[0].width*2) > (s.l + s.vs.w)){

							// left side of cell
							c.fillText(
								cell.textArray[0].text,
								size.scale * (s.lp[cell.j[0]] + cell.textArray[0].width),
								size.scale * (_Top.tp[cell.i[0]] + cell.textArray[0].position)
							);
						} else {

							// left side of cell near vp right border
							c.fillText(
								cell.textArray[0].text,
								size.scale * (s.l + s.vs.w - cell.textArray[0].width),
								size.scale * (_Top.tp[cell.i[0]] + cell.textArray[0].position)
							);
						}
					} else	{
						var cellWidth = (cell == SORT.top.cell) ? 5 : 0;
						cell.textArray.forEach( function(item){
							c.fillText(
								item.text,
								size.scale * (s.lp[cell.j[0]] + cell.width/2 - cellWidth),
								size.scale * (_Top.tp[cell.i[0]] + item.position)
							);
						});
					}
				}
			});


			// painting sort arrow
			if(SORT.top.cell){
				if(SORT.top.cell.displayed == 4 ){
					var cell = SORT.top.cell;
					cell.displayed = 0;
	
					var y = size.scale * (_Top.tp[cell.i[0]] + Math.round(cell.height/2));
					var x = size.scale * (s.lp[cell.j.last() + 1] - 6);
		
					if(SORT.top.direction)		drow.circuit(c, _colors.sort[(SORT.top.type == 0 && cell.base) ? 3 : SORT.top.type], [ [ x - 4, y - 3], [ x, y + 3], [ x + 4, y - 3] ]);
					else						drow.circuit(c, _colors.sort[(SORT.top.type == 0 && cell.base) ? 3 : SORT.top.type], [ [ x - 4, y + 3], [ x, y - 3], [ x + 4, y + 3] ]);
				}
			}
	

			//hidden line in first position
			if(s.cols.length){
				if(s.cols[0] == 0 && !_Top.branches[0].visible)
					drow.dashLine(c,
						'#666',
						'#f1f1f1',
						size.scale * 0.5,
						size.scale * 0,
						size.scale * 0.5,
						size.scale * _Top.tp.last() );
			}

			c.translate(
				size.scale * s.l,
				size.scale * 0
			);

			c.fillStyle = '#f1f1f1';			c.fillRect( s.vw, 0, 18, s.y );
			c.fillStyle = '#aaa';				c.fillRect( s.vw - 1, 0, 1, s.y );
		}

		this.side = function(){
			var c = _Side.ctx;


			// clear canvas
			c.clearRect(0, 0, s.x, s.vs.h);

			// set background borders
			c.fillStyle = '#555';
			c.fillRect(	0,	0,
				s.x,
				(( s.vh > s.tp.last()) ? s.tp.last() : s.vh)
			);
			
			// translate viewport 
			c.translate( 
				size.scale * 0,
				size.scale * (- s.t)
			);

			// mark cells which is in viewport
			// 1 - cells not displayed 
			s.rows.forEach(	function(j){
				for(var i = 0; i < _Side.c; i++)
					_Side.visual[j][i].displayed = 1;
			});

			// drow dash line and
			// remove hidden cells
			s.rows.forEach(	function(j){
				for(var i = 0; i < _Side.c; i++){
					if(_Side.visual[j][i].displayed == 1 && !_Side.visual[j][i].visible){
						if(setting.dashHidden)
							drow.dashLine(c,
								'#000',
								'#f1f1f1',
								size.scale * (_Side.lp[_Side.visual[j][i].j[0]]),
								size.scale * (s.tp[_Side.visual[j][i].i.last() + 1] - 0.5),
								size.scale * (_Side.lp[_Side.visual[j][i].j.last() + 1]),
								size.scale * (s.tp[_Side.visual[j][i].i.last() + 1] - 0.5)
							);

						_Side.visual[j][i].displayed = 0;	
					}
				}
			});


			// drow cells backgrounds
			c.fillStyle = _colors.header;
			s.rows.forEach(	function(j){
				for(var i = 0; i < _Side.c; i++){
					var cell = _Side.visual[j][i];
	
					if(cell.displayed != 1) continue;				
					cell.displayed = 2;
					
					c.fillRect( 
						size.scale * (_Side.lp[cell.j[0]]),
						size.scale * (s.tp[cell.i[0]]),
						size.scale * (cell.width - 1),
						size.scale * (cell.height - 1)
					);
			}});


			// paiting select-style in cells
			// for hover used opacity - 0.3
			// for select used opacity - 0.2
			// rgba( 0, 0, 0 ) - black for click on header
			// rgba( 81, 165, 255 ) - blue for click on table or other header
			s.rows.forEach(	function(j){
				for(var i = 0; i < _Side.c; i++){
					var cell = _Side.visual[j][i];
	
					if(cell.displayed != 2) continue;
					cell.displayed = 3;
					
					var back = undefined;
					if(cell.hover) 			back = 0.3;
					else if(cell.select)	back = 0.2;

					if(back){
						c.fillStyle = (SELECT.click == _Side) ? "rgba( 0, 0, 0," + back + ")" : "rgba( 81, 165, 255," + back + ")" ;
					
						c.fillRect( 
							size.scale * (_Side.lp[cell.j[0]]),
							size.scale * (s.tp[cell.i[0]]),
							size.scale * (cell.width - 1),
							size.scale * (cell.height - 1)
						);
					}
			}});


			// paiting text
			// branches with left-text style
			c.fillStyle = '#000';
			c.textBaseline = "middle";
			c.textAlign = "left";
			c.font = size.scale * size.text + "px " + size.font;

			s.rows.forEach(	function(j){
				var cell = _Side.branches[j];
				if(cell.displayed != 3) return;
				cell.displayed = 4;

				cell.textArray.forEach( function(item){
					c.fillText(
						item.text,
						size.scale * (_Side.lp[cell.j[0]] + 2),
						size.scale * (s.tp[cell.i[0]] + item.position)
					);
				});
			});


			// paiting text
			// first part - vertical text
			// second part - horizontal text
			c.textAlign = "center";
			if(!setting.orientation){
				
				c.rotate(Math.PI*3/2);

				s.rows.forEach( function(i){
					for(var j = 0; j < _Side.c - 1; j++) {

						var cell = _Side.visual[i][j];

						if(cell.displayed != 3)		continue;
						cell.displayed = 4;
	

						if(s.tp[cell.i[0]] + cell.height/2 - cell.textArray[0].width < s.t){
							if((s.tp[cell.i[0]] + cell.height - cell.textArray[0].width*2) > s.t ){

								cell.textArray.forEach( function(item){
									c.fillText(
										item.text,
										size.scale * ( - s.t - cell.textArray[0].width),
										size.scale * (_Side.lp[cell.j[0]] + 2 + item.position)
									);
								});	
							} else {

								cell.textArray.forEach( function(item){
									c.fillText(
										item.text,
										size.scale * ( - s.tp[cell.i[0]] - cell.height + cell.textArray[0].width),
										size.scale * (_Side.lp[cell.j[0]] + 2  + item.position)
									);
								});
							}
						} else if((s.tp[cell.i[0]] + cell.height/2 + cell.textArray[0].width) > (s.t + s.vs.h)){
							if((s.tp[cell.i[0]] + cell.textArray[0].width*2) > (s.t + s.vs.h)){
								cell.textArray.forEach( function(item){
									c.fillText(
										item.text,
										size.scale * ( - s.tp[cell.i[0]] - cell.textArray[0].width),
										size.scale * ( _Side.lp[cell.j[0]] + 2 + item.position)
									);
								});
							} else {
								cell.textArray.forEach( function(item){
									c.fillText(
										item.text,
										size.scale * ( - s.t - s.vs.h + cell.textArray[0].width),
										size.scale * (_Side.lp[cell.j[0]] + 2  + item.position)
									);
								});
							}
						} else {
							cell.textArray.forEach( function(item){
								c.fillText(
									item.text,
									size.scale * ( - s.tp[cell.i[0]] - cell.height/2),
									size.scale * ( _Side.lp[cell.j[0]] + 2  + item.position)
								);
							});	
						}
					}
				});

				//rotate canvas back
				c.rotate(Math.PI*1/2);
			} else {
				s.rows.forEach( function(i){
					for(var j = 0; j < _Side.c-1; j++) {

						var cell = _Side.visual[i][j];

						if(cell.displayed != 3)		continue;
						cell.displayed = 4;


						if((cell.height - size.text*cell.textArray.length)/2 + DISPLAY.s.tp[cell.i[0]] - 2 < s.t){
							if(DISPLAY.s.tp[cell.i[0]] + cell.height  - size.text*cell.textArray.length - 2 > s.t ){

								cell.textArray.forEach( function(item, k){
									c.fillText(
										item.text,
										size.scale * ( cell.width/2 + _Side.lp[cell.j[0]] ),
										size.scale * ( s.t + (k + 0.5)*size.text + 2 )
									);
								});	
							} else {

								cell.textArray.forEach( function(item, k){
									c.fillText(
										item.text,
										size.scale * ( cell.width/2 + _Side.lp[cell.j[0]] ),
										size.scale * ( s.tp[cell.i[0]] + cell.height  - size.text*cell.textArray.length - 2 + (k + 0.5)*size.text - 2 )
									);
								});
							}
						} else if((cell.height + size.text*cell.textArray.length)/2 + DISPLAY.s.tp[cell.i[0]] + 2 > (s.t + s.vs.h)){
							if(DISPLAY.s.tp[cell.i[0]] + size.text*cell.textArray.length + 2 > (s.t + s.vs.h)){
								cell.textArray.forEach( function(item, k){

									c.fillText(
										item.text,
										size.scale * (cell.width/2 + _Side.lp[cell.j[0]]),
										size.scale * (s.tp[cell.i[0]] + (k + 0.5)*size.text + 2)
									);
								});	
							} else {
								cell.textArray.forEach( function(item, k){
									
									c.fillText(
										item.text,
										size.scale * (cell.width/2 + _Side.lp[cell.j[0]]),
										size.scale * (s.t + s.vs.h - size.text*cell.textArray.length + (k + 0.5)*size.text - 2)
									);
								});	
							}
						} else { 
							cell.textArray.forEach( function(item, k){

								c.fillText(
									item.text,
									size.scale * (cell.width/2 + _Side.lp[cell.j[0]]),
									size.scale * ((cell.height - size.text*cell.textArray.length)/2 + s.tp[cell.i[0]] - 2 + (k + 0.5)*size.text)
								);
							});	
						}
					}
				});
			}


			// drow arrow if has sort
			if(SORT.side.cell){
				if(SORT.side.cell.displayed == 4 ){
					var cell = SORT.side.cell;
					cell.displayed = 0;
	
					var x = size.scale * (_Side.lp[cell.j.last() + 1] - 9);
					var y = size.scale * (s.tp[cell.i[0]] + Math.round(cell.height/2));
	
					if(SORT.side.direction)		drow.circuit(c, _colors.sort[type = (SORT.side.type == 0 && cell.base) ? 3 : SORT.side.type], [ [ x, y - 5], [ x + 6, y], [ x, y + 5] ]);
					else						drow.circuit(c, _colors.sort[type = (SORT.side.type == 0 && cell.base) ? 3 : SORT.side.type], [ [ x + 6, y - 5], [ x, y], [ x + 6, y + 5] ]);
				}
			}

			// bring back center of the viewport 
			c.translate(
				size.scale * 0,
				size.scale * s.t
			);

			if(s.rows.length){
				if(s.rows[0] == 0 && !_Side.branches[0].visible)
					drow.dashLine(c,
						'#666',
						'#f1f1f1',
						size.scale * 0,
						size.scale * 0.5,
						size.scale * _Side.lp.last(),
						size.scale * 0.5
					);
			}
			
			c.fillStyle = '#f1f1f1';		c.fillRect( 0, s.vh, s.x, 18 );
			c.fillStyle = '#aaa';			c.fillRect( 0, s.vh - 1, s.x, 1 );
		}

		this.all = function(){
			DISPLAY.table();
			DISPLAY.top();
			DISPLAY.side();
		}

		var drow = {
			dashLine: function(c, color, background, x1, y1, x2, y2){
				c.beginPath();
				c.lineWidth = size.scale;
				c.setLineDash([])
				c.strokeStyle = background;
				c.moveTo(x1, y1);
				c.lineTo(x2, y2);
				c.stroke();
				c.setLineDash([4, 2])
				c.strokeStyle = color;
				c.moveTo(x1, y1);
				c.lineTo(x2, y2);
				c.stroke();
				c.closePath();
			},
			circuit: function(c, color, path){
				c.beginPath();
				if(color)	c.fillStyle = color;
				c.moveTo( path[0][0], path[0][1]);
				for(var i = 1; i < path.length; i++)
					c.lineTo( path[i][0] , path[i][1]);
				c.fill();
				c.closePath();
			},
			verticalScroll: function(c, vh){
				c.fillStyle = '#F1F1F1';
				c.fillRect(s.vw, 0, 18, s.vh);
				c.fillStyle = '#aaa';
				if(s.tp.last() > vh){
					SCROLL.v.h = ((( s.vh - 36 )*( vh ))/s.tp.last() > 20) ? (( s.vh - 36 )*( vh ))/s.tp.last() : 20;
					SCROLL.v.t = ((( s.vh - 36 - SCROLL.v.h)*( s.t ))/(s.tp.last() - vh )) + 18;
					SCROLL.v.l = s.vw;
					
					c.fillRect( SCROLL.v.l + 2, SCROLL.v.t + 2, 14, SCROLL.v.h - 4);

					c.fillStyle = '#bbb';

					if(s.corn.t)	c.fillRect( s.vw, 0, 18, 18);
					if(s.corn.b)	c.fillRect( s.vw, s.vh - 18, 18, 18);

					c.fillStyle = '#333';
				} else SCROLL.v = {};

				drow.circuit(c, null, [ [ s.vw + 5, 11], [ s.vw + 9, 7], [ s.vw + 13, 11] ]);
				drow.circuit(c, null, [ [ s.vw + 5, s.vh - 11], [ s.vw + 9, s.vh - 7], [ s.vw + 13, s.vh - 11] ]);
			},
			horizontalScroll: function(c, vw){
				c.fillStyle = '#F1F1F1';
				c.fillRect(0, s.vh, s.vw + 18, 18);
				c.fillStyle = '#aaa'	
				if(s.lp.last() > vw){
					SCROLL.h.w = ((( s.vw - 36 )*( vw ))/s.lp.last() > 20) ? (( s.vw - 36 )*( vw ))/s.lp.last() : 20;
					SCROLL.h.l = ((( s.vw - 36 - SCROLL.h.w)*( s.l ))/(s.lp.last() - vw )) + 18;
					SCROLL.h.t = s.vh;
	
					c.fillRect( SCROLL.h.l + 2, SCROLL.h.t + 2, SCROLL.h.w - 4, 14);

					c.fillStyle = '#bbb';
	
					if(s.corn.l)	c.fillRect( 0, s.vh, 18, 18);
					if(s.corn.r)	c.fillRect( s.vw - 18, s.vh, 18, 18);
	
					c.fillStyle = '#333';
				} else SCROLL.h = {};
	
				drow.circuit(c, null, [ [ 11, s.vh + 5], [ 7, s.vh + 9], [ 11, s.vh + 13] ]);
				drow.circuit(c, null, [ [ s.vw - 11, s.vh + 5], [ s.vw - 7, s.vh + 9], [ s.vw - 11, s.vh + 13] ]);
			}
		}
	}
	var SCROLL = new function(){
		this.v = {}; //vertical
		this.h = {}; //horizontal
		var s;
		var timer;

		this.hdown = function(e, coord){
			var x = GET.dpiMS(e.pageX - coord.left);
			var y = GET.dpiMS(e.pageY - coord.top);

			if( x > SCROLL.h.l && x < (SCROLL.h.l + SCROLL.h.w) && (SCROLL.h.t - 2) < y  ){
				s = {e: e, ne: e, c: coord, l: DISPLAY.s.l};
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", hup);
				hredrow();
				return false;
			}
			if( x < 18 && y > DISPLAY.s.vh){					SCROLL.onScroll(300,-1, 0);	window.addEventListener("mouseup", SCROLL.offScroll); return; }
			if( x > (DISPLAY.s.vw - 18) && y > DISPLAY.s.vh){	SCROLL.onScroll(300, 1, 0);	window.addEventListener("mouseup", SCROLL.offScroll); return; }

			if( x < SCROLL.h.l)	SCROLL.pageScroll(-1, 0 );
			else				SCROLL.pageScroll( 1, 0 );
		}
		function move(e){
			s.ne = e;
			s.redrow = true;
		}
		function hredrow(){ // horizontal redrow 
			if(s.redrow){
				DISPLAY.s.l = Math.round(s.l + (((GET.dpiMS(s.ne.pageX - s.e.pageX))/(DISPLAY.s.vw - 36)) * DISPLAY.s.lp.last()));
				DISPLAY.table();
				DISPLAY.top();
				s.redrow = false;
			}
			timer = setTimeout(hredrow, 5);
		}
		function hup(e){
			clearTimeout(timer);		timer = null;
			s = undefined;
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", hup);
		}

		this.vdown = function(e, coord){
			var x = GET.dpiMS(e.pageX - coord.left);
			var y = GET.dpiMS(e.pageY - coord.top);

			if( x > (SCROLL.v.l - 2) && SCROLL.v.t < y && (SCROLL.v.t + SCROLL.v.h) > y ){
				s = {e: e, ne: e, c: coord, t: DISPLAY.s.t};
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", vup);
				vredrow();
				return false;
			}

			if( y < 18 && x > DISPLAY.s.vw){					SCROLL.onScroll(300, 0,-1);	window.addEventListener("mouseup", SCROLL.offScroll); return; }
			if( y > (DISPLAY.s.vh - 18) && x > DISPLAY.s.vw){	SCROLL.onScroll(300, 0, 1);	window.addEventListener("mouseup", SCROLL.offScroll); return; }

			if( y < SCROLL.v.t)	SCROLL.pageScroll( 0,-1 );
			else				SCROLL.pageScroll( 0, 1 );
		}
		function vredrow(e){
			if(s.redrow){
				DISPLAY.s.t = Math.round(s.t + (((GET.dpiMS(s.ne.pageY - s.e.pageY))/(DISPLAY.s.vh - 36)) * DISPLAY.s.tp.last()));
				DISPLAY.table();
				DISPLAY.side();
				s.redrow = false;
			}
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

			if(v)	DISPLAY.s.t += v*50;
			if(h)	DISPLAY.s.l += h*50;
			DISPLAY.table();
			if(v)	DISPLAY.side();
			if(h)	DISPLAY.top();

			if(times) timer = setTimeout(wheelScroll, 5, v, h, times - 1);
		}

		this.onScroll = function(time, h, v){

			DISPLAY.s.l += h*20;
			DISPLAY.s.t += v*20; 
			DISPLAY.table(); 
			if(h) DISPLAY.top();
			if(v) DISPLAY.side();

			timer = setTimeout( SCROLL.onScroll, time, 5, h, v);
		}
		this.pageScroll = function(h, v){
			var hbit = Math.round(DISPLAY.s.vw/10);
			var vbit = Math.round(DISPLAY.s.vh/10);
			for(var i = 0; i < 9; i++){
				setTimeout(function(){ 
					DISPLAY.s.l += h*hbit;
					DISPLAY.s.t += v*vbit; 
					DISPLAY.table(); 
					if(h) DISPLAY.top();
					if(v) DISPLAY.side();
				}, 20*i); };			
		}
		this.offScroll = function(){
			clearTimeout(timer);		timer = null;
			window.removeEventListener("mouseup", SCROLL.offScroll);
		}
	}
	var SELECT = new function(){
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
				s = {
					e: e,
					p: { l: 0, t: 0, r: 0, b: 0 }
				};

				if(e.shiftKey && SELECT.shift1st)	s.start = SELECT.shift1st;
				else 								s.start = GET.position.table(e);

				if(!e.ctrlKey)				SELECT.clearAll();
				
				SELECT.click = _Table;
				hover();
	
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", up);
			}
			function hover(){
				var p;

				hscroll(s.e);
				vscroll(s.e);

				if(s.redrow){
					DISPLAY.all();
					s.redrow = false;
				}
				// search position
				s.end = GET.position.table(s.e);
				p = GET.sortedPosition.table(s.start, s.end);

				// change hover area
				if(s.p.l != p.l || s.p.r != p.r || s.p.t != p.t || s.p.b != p.b){

					// reselect area
					SELECT.hover.table(  p.l,  p.r,  p.t,  p.b);
					SELECT.hover.side(_Side.c - 1, _Side.c - 1,  p.t,  p.b );
					SELECT.hover.top(  p.l,  p.r, _Top.r - 1, _Top.r - 1 );

					DISPLAY.all();
				}

				s.p = p;
				timer = setTimeout(hover, 5);
			}
			function up(e){
				clearTimeout(timer);			timer = undefined;

				SELECT.shift1st = s.start;		SELECT.shift2nd = s.end;
				var p = GET.sortedPosition.table(s.start, s.end);

				SELECT.selectTable(  p.t,  p.b,  p.l,  p.r, true);
				DISPLAY.all();
				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup", up);
			}
		}
		this.cSide = new function(){
			this.down = function(e){
				s = {
					e: e,
					p: { l: 0, t: 0, r: 0, b: 0 }
				};
				
				if(e.shiftKey && SELECT.shift1st)	s.start = { j:_Side.c - 1, i: SELECT.shift1st.i };
				else 								s.start = GET.position.side(e);

				s.sort = (_Side.visual[s.start.i][s.start.j].select && SELECT.side.length == 1 && SELECT.click == _Side) ? true : false;
				
				if(!e.ctrlKey)				SELECT.clearAll();
				
				SELECT.click = _Side;
				hover();
	
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", up);
			}
			function hover(){
				var p;

				hscroll(s.e);

				if(s.redrow){
					DISPLAY.all();
					s.redrow = false;
				}

				// search position
				s.end = GET.position.side(s.e);
				p = GET.sortedPosition.side( s.start, s.end);

				// change hover area
				if(s.p.l != p.l || s.p.r != p.r || s.p.t != p.t || s.p.b != p.b){
					SELECT.hover.table(  0, _Table.c - 1,  p.t, p.b);
					SELECT.hover.side(  p.l,  p.r,  p.t, p.b );
					SELECT.hover.top(0, _Table.c - 1, _Top.r - 1, _Top.r - 1 );
					DISPLAY.all();
				}

				s.p = p;
				timer = setTimeout(hover, 5);			
			}
			function up(e){
				clearTimeout(timer);
				timer = undefined;
				var p = GET.sortedPosition.side( s.start, s.end);
	
				SELECT.shift1st = { i: p.t, j: 0 };
				SELECT.shift2nd = { i: p.b, j: _Table.c - 1};

				SELECT.selectSide(  p.t,  p.b,  p.l,  p.r,  e.ctrlKey);

				if(s.start.i == s.end.i && s.start.j == s.end.j && s.start.j == (_Side.c - 1) && setting.sort && s.sort && !e.ctrlKey )
					SORT.sdown(_Side.visual[s.start.i][s.start.j], e);
				else
					DISPLAY.all(); 
				
				s = {};
				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup", up);
			}
		}
		this.cTop = new function(){
			this.down = function(e){
				s = {
					e: e,
					p: { l: 0, t: 0, r: 0, b: 0 }
				};
				
				if(e.shiftKey && SELECT.shift1st)	s.start = { i:_Top.r - 1, j: SELECT.shift1st.j };
				else 								s.start = GET.position.top(e);

				s.sort = (_Top.visual[s.start.i][s.start.j].select && SELECT.top.length == 1 && SELECT.click == _Top) ? true : false;
			
				if(!e.ctrlKey)				SELECT.clearAll();

				SELECT.click = _Top;
				hover();
	
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", up);
			}
			function hover(){
				var p;
				
				vscroll(s.e);
				if(s.redrow){
					DISPLAY.all();
					s.redrow = false;
				}

				// search position
				s.end = GET.position.top(s.e);
				p = GET.sortedPosition.top(s.start, s.end);

				// change hover area
				if(s.p.l != p.l || s.p.r != p.r || s.p.t != p.t || s.p.b != p.b){
					SELECT.hover.table(  p.l,  p.r, 0, _Table.r - 1);
					SELECT.hover.top(  p.l,  p.r,  p.t,  p.b);	
					SELECT.hover.side(_Side.c - 1, _Side.c - 1,  0, _Table.r - 1 );
					DISPLAY.all();
				}

				s.p = p;
				timer = setTimeout(hover, 5);
			}
			function up(e){
				clearTimeout(timer);
				timer = undefined;
				var p = GET.sortedPosition.top(s.start, s.end);

				SELECT.shift1st = { i: 0, j: p.l };
				SELECT.shift2nd = { i: _Table.r - 1, j: p.r };

				SELECT.selectTop(  p.t,  p.b,  p.l,  p.r,  e.ctrlKey);

				if(s.start.j == s.end.j && s.start.i == s.end.i && s.start.i == (_Top.r - 1) && setting.sort && s.sort && !e.ctrlKey)
					SORT.tdown(_Top.visual[s.start.i][s.start.j], e);			
				else
					DISPLAY.all();
				s = {};

				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup", up);
			}
		}
		function move(e){ s.e = e; };

		function vscroll(e){
			if(_Table.coords.left <= e.pageX && (_Table.coords.left + 10) > e.pageX){			DISPLAY.s.l += -10;		s.redrow = true; }
			else if(_Table.coords.left > e.pageX){												DISPLAY.s.l += -20;		s.redrow = true; }

			if(_Table.coords.right - 18 >= e.pageX && (_Table.coords.right - 28) < e.pageX){	DISPLAY.s.l += 10;		s.redrow = true; }
			else if(_Table.coords.right - 18 < e.pageX){										DISPLAY.s.l += 20;		s.redrow = true; }

		}
		function hscroll(e){
			if(_Table.coords.top <= e.pageY && (_Table.coords.top + 10) > e.pageY){				DISPLAY.s.t += -10;		s.redrow = true; }
			else if(_Table.coords.top > e.pageY){												DISPLAY.s.t += -20;		s.redrow = true; }

			if(_Table.coords.bottom - 18 >= e.pageY && (_Table.coords.bottom - 28) < e.pageY){	DISPLAY.s.t += 10;		s.redrow = true; }
			else if(_Table.coords.bottom - 18 < e.pageY){										DISPLAY.s.t += 20;		s.redrow = true; }

		}

		this.tree = {
			top: function( t, b, l, r ){
				for(var i = l; i <= r; i++){
					if(_Top.visual[t][i].select){
						SELECT.tree.up(_Top.visual[t][i].parent, SELECT.remove.top, false);
						SELECT.tree.down(_Top.visual[t][i], SELECT.remove.top, false);
					} else {
						SELECT.tree.down(_Top.visual[t][i], SELECT.add.top, true);
					}
					i = _Top.visual[t][i].j.last();
				}
				SELECT.side.forEach(function(item){ item.select = false; });		SELECT.side = [];
				SELECT.table.forEach(function(item){ item.select = false; });		SELECT.table = [];
				for(var j = 0; j < _Top.branches.length; j++){
					if(!_Top.branches[j].select)	continue;
					for(var i = 0; i < _Table.r; i++){
						SELECT.add.table(_Table.cells[i][j]);
					}
				}
				SELECT.select.side();
			},
			side: function( t, b, l, r ){
				for(var i = t; i <= b; i++){
					if(_Side.visual[i][l].select){
						SELECT.tree.up(_Side.visual[i][l].parent, SELECT.remove.side, false);
						SELECT.tree.down(_Side.visual[i][l], SELECT.remove.side, false);
					} else {
						SELECT.tree.down(_Side.visual[i][l], SELECT.add.side, true);
					}
					i = _Side.visual[i][l].i.last();
				}
				SELECT.top.forEach(function(item){ item.select = false; });			SELECT.top = [];
				SELECT.table.forEach(function(item){ item.select = false; });		SELECT.table = [];
				for(var i = 0; i < _Side.branches.length; i++){
					if(!_Side.branches[i].select)	continue;
					for(var j = 0; j < _Table.c; j++){
						SELECT.add.table(_Table.cells[i][j]);
					}
				}
				SELECT.select.top();
			},
			up: function(cell, func, bool){
				if(cell.parent != undefined && bool != cell.select){
					func(cell);
					SELECT.tree.up(cell.parent, func, bool);
				}
			},
			down: function(cell, func, bool){
				if(cell.select != bool){
					func(cell);
					if(cell.children){
						for(var i = 0; i < cell.children.length; i++)
							SELECT.tree.down(cell.children[i], func, bool);
					}
				}
			}
		}
		
		this.add = {
			table: function( arr ){
				if(!Array.isArray(arr))		arr = [arr];
				for(var i = 0; i < arr.length; i++){
					if(!arr[i].select){
						SELECT.table.push(arr[i]);
						arr[i].select = true;
					}
				}
			},
			top: function( arr ){
				if(!Array.isArray(arr))		arr = [arr];
				for(var i = 0; i < arr.length; i++){
					if(!arr[i].select){
						SELECT.top.push(arr[i]);
						arr[i].select = true;
					}
				}
			},
			side: function( arr ){
				if(!Array.isArray(arr))		arr = [arr];
				for(var i = 0; i < arr.length; i++){
					if(!arr[i].select){
						SELECT.side.push(arr[i]);
						arr[i].select = true;
					}
				}
			}
		}
		this.remove = {
			table: function( arr ){
				if(!Array.isArray(arr))		arr = [arr];
				for(var i = 0; i < arr.length; i++){
					for(var j = 0; j < SELECT.table.length; j++){
						if(arr[i] == SELECT.table[j]){
							SELECT.table.splice(j, 1);
							arr[i].select = false;
							break;
						}
					}
				}
			},
			top: function( arr ){
				if(!Array.isArray(arr))		arr = [arr];
				for(var i = 0; i < arr.length; i++){
					for(var j = 0; j < SELECT.top.length; j++){
						if(arr[i] == SELECT.top[j]){
							SELECT.top.splice(j, 1);
							arr[i].select = false;
							break;
						}
					}
				}
			},
			side: function( arr ){
				if(!Array.isArray(arr))		arr = [arr];
				for(var i = 0; i < arr.length; i++){
					for(var j = 0; j < SELECT.side.length; j++){
						if(arr[i] == SELECT.side[j]){
							SELECT.side.splice(j, 1);
							arr[i].select = false;
							break;
						}
					}
				}
			}
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
								for(var k = SELECT.table.length - 1; k >= 0; k--){
									if( _Table.cells[i][j] == SELECT.table[k]) SELECT.table.splice(k, 1);
								}
							} else {
								_Table.cells[i][j].select = true;
								SELECT.table.push(_Table.cells[i][j]);
							}
						}
					}
				}
			}
			this.clearHeaders = function(){
				SELECT.side.forEach(function(item){ item.select = false; });		SELECT.side = [];
				SELECT.top.forEach(function(item){ item.select = false; });			SELECT.top = [];				
			}
			this.headers = function(){
				SELECT.table.forEach(function(item){
					var i = item.i[0]; var j = item.j[0];
					if(!_Side.branches[i].select){	_Side.branches[i].select = true; SELECT.side.push(_Side.branches[i]); };
					if(!_Top.branches[j].select){	_Top.branches[j].select = true; SELECT.top.push(_Top.branches[j]); }
				})
			}
			this.top = function(){
				SELECT.table.forEach(function(item){
					var i = item.i[0]; var j = item.j[0];
					if(!_Top.branches[j].select){	_Top.branches[j].select = true; SELECT.top.push(_Top.branches[j]); }
				})				
			}
			this.side = function(){
				SELECT.table.forEach(function(item){
					var i = item.i[0]; var j = item.j[0];
					if(!_Side.branches[i].select){	_Side.branches[i].select = true; SELECT.side.push(_Side.branches[i]); };
				})				
			}
			this.header = function(l, r, t, b, area, array){	
				for(var i = t; i <= b; i++ ){
					for(var j = l; j <= r; j++){
						if(!area.visual[i][j].select){
							area.visual[i][j].select = true;
							array.push(area.visual[i][j]);
						}
					}
				}
			}
		}

		this.selectTable = function( t, b, l, r, ctrl){
			SELECT.click = _Table;

			if(!ctrl) SELECT.clearAll();
			SELECT.select.clearHeaders();
			SELECT.select.table(l, r, t, b);
			SELECT.select.headers();
			SELECT.hover.clear()

			if(functions.afterSelect)		functions.afterSelect(link);
		}
		this.selectSide = function( t, b, l, r, ctrl){
			SELECT.click = _Side;
			SELECT.hover.clear();

			if(ctrl){
				SELECT.tree.side(t, b, l, r);
			} else {
				SELECT.clearAll();
				SELECT.select.clearHeaders();
				SELECT.select.table(0, _Table.c - 1, t, b);

				SELECT.select.header(l, r, t, b, _Side, SELECT.side );
				SELECT.select.header(0, _Table.c - 1, _Top.r - 1, _Top.r - 1, _Top, SELECT.top );
			}

			if(functions.afterSelect)		functions.afterSelect(link);
		}		
		this.selectTop = function( t, b, l, r, ctrl){
			SELECT.click = _Top;
			SELECT.hover.clear();


			if(ctrl)
				SELECT.tree.top(t, b, l, r);
			else {
				SELECT.clearAll();
				SELECT.select.clearHeaders();
				SELECT.select.table( l, r, 0, _Table.r - 1);
				SELECT.select.header(_Side.c - 1, _Side.c - 1,  0, _Table.r - 1, _Side, SELECT.side );
				SELECT.select.header(l, r, t, b, _Top, SELECT.top );				
			}

			if(functions.afterSelect)		functions.afterSelect(link);				
		}

		this.selectAll = function(){
			for(var i = 0; i < _Table.r; i++){	for(var j = 0; j < _Table.c; j++)	{if(!_Table.cells[i][j].select){	_Table.cells[i][j].select = true;	SELECT.table.push(_Table.cells[i][j]); }}};
			for(var i = 0; i < _Top.r; i++){	for(var j = 0; j < _Top.c; j++)		{if(!_Top.visual[i][j].select){		_Top.visual[i][j].select = true; 	SELECT.top.push(_Top.visual[i][j]); }}};
			for(var i = 0; i < _Side.r; i++){	for(var j = 0; j < _Side.c; j++)	{if(!_Side.visual[i][j].select){	_Side.visual[i][j].select = true;	SELECT.side.push(_Side.visual[i][j]); }}};
		
			SELECT.shift1st = _Table.cells[0][0];
			SELECT.shift2nd = _Table.cells[_Table.r - 1][_Table.c - 1];
		}
		this.clearAll = function(){
			SELECT.table.forEach(function(item){ item.select = false; });		SELECT.table = [];
			SELECT.side.forEach(function(item){ item.select = false; });		SELECT.side = [];
			SELECT.top.forEach(function(item){ item.select = false; });			SELECT.top = [];
		}
	}
	var RESIZE = new function(){
		var s = this.s = {};

		this.side = {
			down: function(e, cell, v, h){
				var sCoords = GET.screenCoord.side(DISPLAY.s.tp[cell.i[0]], _Side.lp[cell.j[0]]);
				
				var html = tools.createHTML({
					tag: 'div',
					parent: container,
					className: 'tau-resize',
					style: ('left: ' + sCoords[1] + 'px; top: ' + sCoords[0] + 'px; width: ' + (GET.dpiD(cell.width) - 1) + 'px; height: ' + (GET.dpiD(cell.height) - 1) + 'px;')
				});
	
				s = {v: v, h: h, cell: cell, html: html, e: e };
	
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", RESIZE.side.up);
			},
			up: function(e){
				tools.destroyHTML(s.html);
				if(s.v && s.move){
					if(s.cell.select && (s.cell.j.last() + 1 == _Side.c))	RESIZE.side.select( s.cell.height + differenceHeight(e, s.e));
					else 													RESIZE.side.height( s.cell.i, s.cell.height + differenceHeight(e, s.e), s.cell.height );
				}
				if(s.h && s.move)											RESIZE.side.width( s.cell.j, s.cell.width + differenceWidth(e, s.e), s.cell.width );

				s = {};
				REMAKE.reDrow();
				tools.endBackdrop();
	
				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup",  RESIZE.side.up);
				return;
			},
			width:	function(columns, width, oldWidth){	columns.forEach(function(i){ _Side.dw[i] = minWidth(_Side.dw[i]*width/oldWidth);});		},
			height:	function(rows, height, oldHeight){	rows.forEach(function(i){ if(_Side.branches[i].visible) _Side.branches[i].dh = minHeight( _Side.branches[i].height*height/oldHeight );});	},
			select:	function(height){					_Side.branches.forEach( function(item){ if(item.select) item.dh =  minHeight( height ); })},
		}

		this.top = {
			down: function(e, cell, v, h){
				var sCoords = GET.screenCoord.top( _Top.tp[cell.i[0]], DISPLAY.s.lp[cell.j[0]]);
				var html = tools.createHTML({tag: 'div',
											parent: container,
											className: 'tau-resize',
											style: ('left: ' + sCoords[1] + 'px; top: ' + sCoords[0] + 'px; width: ' + GET.dpiD(cell.width - 1) + 'px; height: ' + GET.dpiD(cell.height - 1) + 'px;') });
	
				s = {v: v, h: h, cell: cell, html: html, e: e};
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", RESIZE.top.up);
			},
			up: function(e){
				tools.destroyHTML(s.html);
				if(s.h && s.move){
					if(s.cell.select && (s.cell.i.last() + 1 == _Top.r))	RESIZE.top.select( s.cell.width + differenceWidth(e, s.e), s.cell.width);
					else													RESIZE.top.width( s.cell.j, s.cell.width + differenceWidth(e, s.e), s.cell.width, s.cell.width);
				}
				if(s.v && s.move)											RESIZE.top.height( s.cell.i, s.cell.height + differenceHeight(e, s.e) , s.cell.height);
				s = {};
				REMAKE.reDrow();
				tools.endBackdrop();
	
				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup", RESIZE.top.up);
				return;
			},
			width:	function(columns, width, oldWidth){	columns.forEach(function(i){ if(_Top.branches[i].visible) _Top.branches[i].dw = minWidth(_Top.branches[i].width*width/oldWidth);});		},
			height:	function(rows, height, oldHeight){	rows.forEach(function(i){ _Top.dh[i] = minHeight(_Top.dh[i]*height/oldHeight);});			},
			select:	function(width){					_Top.branches.forEach( function(item){ if(item.select) item.dw = minWidth(width); })}
		}

		this.corner = {
			down: function(e, v, h){
				var html = tools.createHTML({tag: 'div', parent: container, className: 'tau-resize', style: ('left: 0; top: 0; width: ' + (DISPLAY.s.x - 1) + 'px; height: ' + (DISPLAY.s.y - 1) + 'px;') });
	
				s = { v: v, h: h, html: html, e: e, cell: {width: (DISPLAY.s.x - 1), height: (DISPLAY.s.y - 1) }};
				window.addEventListener("mousemove", move);
				window.addEventListener("mouseup", RESIZE.corner.up);
			},
			up: function(e){

				var row = [], col = [];
				for(var i = 0; i < _Side.c; i++)	row[i] = i;
				for(var i = 0; i < _Top.r; i++)		col[i] = i;
	
				if(s.h) 		RESIZE.side.width( row, GET.dpiM(e.pageX - _Side.coords.left), _Side.lp.last());
				if(s.v) 		RESIZE.top.height( col, GET.dpiM(e.pageY - _Top.coords.top), _Top.tp.last());

				tools.destroyHTML(s.html);
				s = {};
				REMAKE.reDrow();
				tools.endBackdrop();
	
				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup", RESIZE.corner.up);
			}
		}

		this.dbl = {
			sideWidth: function(cell){
				var result = false;
				if((cell.j.last() + 1) != _Side.c && setting.orientation){
					result = true;
					RESIZE.side.width(cell.j, RESIZE.dbl.getHeight(cell.obj.text, cell.height - 5), cell.width);
				} else {
					result = true;
					RESIZE.side.width(cell.j, RESIZE.dbl.getWidth(cell.obj.text, cell.height - 4), cell.width);
				}
				REMAKE.reDrow();
				return result;
			},
			sideHeight: function(cell){
				var result = false;
				if((cell.j.last() + 1) != _Side.c && setting.orientation){
					result = true;
					RESIZE.side.height(cell.i, RESIZE.dbl.getWidth(cell.obj.text, cell.width - 4) + 1, cell.height);
				} else {
					result = true;
					RESIZE.side.height(cell.i, RESIZE.dbl.getHeight(cell.obj.text, cell.width - 5), cell.height);
				}
				REMAKE.reDrow();
				return result;
			},
			topWidth: function(cell){
				var c = _Table.ctx;
	
				c.font = size.text + "px tunga, calibri, garamond, serif";
				c.textBaseline = "alpabetic";
				c.textAlign = "left";


				var aj = [];
				var cells = [];
				var more = (setting.round[2] > setting.round[0]) ? 2 : 0;

				if(cell.select){
					cells = SELECT.top;
					_Top.branches.forEach( function(item, i){	if(item.select) aj.push(i);	} );
				} else {
					cells.push(cell);
					aj = cell.j;
				}

				aj.forEach( function(j){
					var width = 0;
					for(var i = 0; i < _Table.r; i++){

						var altWidth = 0;
						if(_Table.cells[i][j].alter){
							if(_Table.cells[i][j].alter.n)		altWidth = c.measureText(_Table.cells[i][j].alter.n).width + 4; 
						}

						_Table.cells[i][j].obj.forEach( function(cell, k){
							var percent = (setting.showPercent && (k == 1 || k == 2));
							var round;
	
							var rSide = (_Side.branches[i].obj.type == 3 || _Side.branches[i].obj.type == 8) ? 2 : 0;
							var rTop = (_Top.branches[j].obj.type == 3 || _Top.branches[j].obj.type == 8) ? 2 : 0;
	
							if(k == 0)		round = (rSide != rTop) ? more : rSide;
							else 			round = 1;
	
	
							var newWidth = (tools.roundPlus(cell, setting.round[round]) + '').length * size.numeral
									+ ((percent) ? size.percent : 0)
									+ altWidth + 8;

							if(width < newWidth)	width = newWidth;
						});
					}

					_Top.branches[j].width = _Top.branches[j].dw = Math.round(width) + 1;
				} );

				cells.forEach( function(item){
					var width = 0;
					item.j.forEach( function(j){ width += _Top.branches[j].dw; } );
					var textWidth = RESIZE.dbl.getWidth(item.obj.text, item.height - 4);

					if(textWidth > width)	RESIZE.top.width(item.j, textWidth, width);
				} );

				REMAKE.reDrow();
			},
			topHeight: function(cell){
				RESIZE.top.height(cell.i, RESIZE.dbl.getHeight(cell.obj.text, cell.width - 5), cell.height);
				REMAKE.reDrow();
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
				_Table.ctx.font = size.scale * size.text + "px " + size.font;
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
				if(s.h)		s.html.style.width	= minWidth(GET.dpiD(s.cell.width) + e.pageX - s.e.pageX) + 'px';
				if(s.v)		s.html.style.height	= minHeight(GET.dpiD(s.cell.height) + e.pageY - s.e.pageY) + 'px';
			}
		}
		function differenceHeight(e, ne){	return GET.dpiM(e.pageY - ne.pageY);	}
		function differenceWidth(e, ne){	return GET.dpiM(e.pageX - ne.pageX);	}
		function minWidth(value){			return (value < GET.dpiD(size.minw)) ? GET.dpiD(size.minw) : Math.round(value);	}
		function minHeight(value){			return (value < GET.dpiD(size.minh)) ? GET.dpiD(size.minh) : Math.round(value);	}
	}
	var SORT = new function(){
		this.side = {};
		this.top = {};

		this.setSort = function(options){
			_Corner.sort.innerHTML = '';
			if(!options)	options = {};

			if(_Top.branches.length == 0 || _Side.branches.length == 0)		return;

			SORT.side = {};
			SORT.top = {};
			sideSort(fDefault);
			topSort(fDefault);

			if(options.side){
				if(options.side.sort == 'text' || options.side.sort == 'exp' || options.side.sort == 'label'){
					SORT.side = { sort: options.side.sort, cell: {i: [0], j: [0], types: [0], index: -1 }, codeOnly: !!options.side.codeOnly, direction: !!options.side.direction };

					if(options.side.direction){
						_Corner.sort.innerHTML += '<div id="tau-sort-arr-h">◀</div>';
						sideSort(increaseBy);
					} else {
						_Corner.sort.innerHTML += '<div id="tau-sort-arr-h">▶</div>';
						sideSort(dencreaseBy);
					}
				} else {
					var cell;
					if(options.side.index >= _Side.branches.length)		options.side.index = _Side.branches.length - 1;
					_Side.branches.forEach(function(item){	if(item.index == options.side.index) cell = item; });
					if(options.side.type == undefined){
						if(!(cell.types[0] && setting.showType[0]) && cell.floatType)	options.side.type = 0;
						else{ for(var i = 0; i < cell.types.length; i++){ if(cell.types[i] && setting.showType[i]){ options.side.type = i;		break; } } }
					}

					SORT.side = {cell: cell, type: options.side.type, direction: options.side.direction };
					if(options.side.direction)						sideSort(increase);
					else											sideSort(dencrease);
				}
			}
			if(options.top){
				if(options.top.sort == 'text' || options.top.sort == 'exp' || options.top.sort == 'label'){
					SORT.top = { sort: options.top.sort, cell: {i: [0], j: [0], types: [0], index: -1 }, codeOnly: !!options.top.codeOnly, direction: !!options.top.direction };

					if(options.top.direction){
						_Corner.sort.innerHTML += '<div id="tau-sort-arr-v">▲</div>';
						topSort(increaseBy);
					} else {
						_Corner.sort.innerHTML += '<div id="tau-sort-arr-v">▼</div>';
						topSort(dencreaseBy);
					}
				} else {
					var cell;

					if(options.top.index >= _Top.branches.length)	options.top.index = _Top.branches.length - 1;
					else if(options.top.index < 0)					options.top.index = 0;
						_Top.branches.forEach(function(item){	if(item.index == options.top.index) cell = item; });
					if(options.top.type == undefined){
						if(!(cell.types[0] && setting.showType[0]) && cell.floatType)	options.top.type = 0;
						else{ for(var i = 0; i < cell.types.length; i++){ if(cell.types[i] && setting.showType[i]){ options.top.type = i; break; } } }
					}

					SORT.top = {cell: cell, type: options.top.type, direction: options.top.direction};
					if(options.top.direction)						topSort(increase);
					else											topSort(dencrease);
				}
			}
			REMAKE.reBuild();
		}
		this.getSort = function(){
			var result = {};
			if(SORT.side.cell)			result.side = { index: SORT.side.cell.index, direction: SORT.side.direction, type: SORT.side.type, sort: SORT.side.sort, codeOnly: SORT.side.codeOnly };
			if(SORT.top.cell)			result.top = { index: SORT.top.cell.index, direction: SORT.top.direction, type: SORT.top.type, sort: SORT.top.sort, codeOnly: SORT.top.codeOnly };
			return result;
		}

		this.sdown = function(cell, e){
			if(document.getElementById('tau-sort-arr-h'))	tools.destroyHTML(document.getElementById('tau-sort-arr-h'));
			var types = [], type;
			if( !(cell.types[0] && setting.showType[0]) && cell.floatType)			types.push(0);
			cell.types.forEach(function(item, i){ 	if(item && setting.showType[i])	types.push(i); });

			var bite = cell.height/types.length, top = _Side.coords.top + DISPLAY.s.tp[cell.i[0]] - DISPLAY.s.t;
			for(var i = 0; i < types.length; i++){	if( top + bite*i < e.pageY && top + bite*(i + 1) > e.pageY)		type = types[i];	}
		
			if(type != SORT.side.type || cell != SORT.side.cell ){
				SORT.side = {cell: cell, type: type, direction: true };
				sideSort(increase);
			} else if(SORT.side.direction === true){
				SORT.side.direction = false;
				sideSort(dencrease);
			} else if(SORT.side.direction === false){
				SORT.side = {};
				sideSort(fDefault);
			}
			REMAKE.reBuild();
		}
		this.tdown = function(cell, e){
			if(document.getElementById('tau-sort-arr-v'))	tools.destroyHTML(document.getElementById('tau-sort-arr-v'));
			var types = [], type;
			if(!(cell.types[0] && setting.showType[0]) && cell.floatType)			types.push(0);
			cell.types.forEach(function(item, i){ 	if(item && setting.showType[i])	types.push(i); });

			var bite = cell.width/types.length, left = _Top.coords.left + DISPLAY.s.lp[cell.j[0]] - DISPLAY.s.l;
			for(var i = 0; i < types.length; i++){	if( left + bite*i < e.pageX && left + bite*(i + 1) > e.pageX)		type = types[i];	}
		
			if(type != SORT.top.type || cell != SORT.top.cell ){
				SORT.top = {cell: cell, type: type, direction: true };
				topSort(increase);
			} else if(SORT.top.direction === true){
				SORT.top.direction = false;
				topSort(dencrease);
			} else if(SORT.top.direction === false){
				SORT.top = {};
				topSort(fDefault);
			}
			REMAKE.reBuild();
		}
		function sideSort(compare){
			for(var j = 0; j < _Table.c - 1; j++){
				var p = j, parent = _Top.branches[j].parent, buf; //p - new position, paretn - current parent, buf - variable for reshuffle items

				for(var k = j + 1; k < _Table.c; k++){
					if(parent != _Top.branches[k].parent) break;

					if(compare( (SORT.side.cell)? _Table.cells[SORT.side.cell.i[0]][p].obj[SORT.side.type] : null,
								(SORT.side.cell)? _Table.cells[SORT.side.cell.i[0]][k].obj[SORT.side.type] : null,
								_Top.branches[p],
								_Top.branches[k],
								SORT.side, j))		p = k;
				}
				if(p != j){
					var pi, pj;
					parent.children.forEach(function(item, i){ if(item == _Top.branches[j]) pi = i; if(item == _Top.branches[p]) pj = i; });
	
					buf = parent.children[pi];				parent.children[pi] = parent.children[pj];				parent.children[pj] = buf;
					buf = _Top.branches[j];					_Top.branches[j] = _Top.branches[p];					_Top.branches[p] = buf;
					for(var i = 0; i < _Table.r; i++){
						buf = _Table.cells[i][j];			_Table.cells[i][j] = _Table.cells[i][p];				_Table.cells[i][p] = buf;
					}
				}
			}
		}
		function topSort(compare){
			for(var j = 0; j < _Table.r - 1; j++){
				var p = j, parent = _Side.branches[j].parent, buf; //p - new position, paretn - current parent, buf - variable for reshuffle items

				for(var k = j + 1; k < _Table.r; k++){
					if(parent != _Side.branches[k].parent) break;

					if(compare( (SORT.top.cell)? _Table.cells[p][SORT.top.cell.j[0]].obj[SORT.top.type] : null,
								(SORT.top.cell)? _Table.cells[k][SORT.top.cell.j[0]].obj[SORT.top.type] : null,
								_Side.branches[p],
								_Side.branches[k],
								SORT.top, j ))	p = k;
				}
				if(j != p){
					var pi, pj;
					parent.children.forEach(function(item, i){ if(item == _Side.branches[j]) pi = i; if(item == _Side.branches[p]) pj = i; });
	
					buf = parent.children[pi];				parent.children[pi] = parent.children[pj];				parent.children[pj] = buf;
					buf = _Side.branches[j];				_Side.branches[j] = _Side.branches[p];					_Side.branches[p] = buf;
					buf = _Table.cells[j];					_Table.cells[j] = _Table.cells[p];						_Table.cells[p] = buf;
				}
			}
		}

		function increase(a, b, f, l, s){
			if(a == undefined)			return false;
			if(b == undefined)			return false;
			if(f.unsort || (f.base && !s.cell.base && s.type == 0 ) )		return false;
			if(l.unsort || (l.base && !s.cell.base && s.type == 0 ) )		return false;

			if(a < b)					return true;
			else if(a == b){
				if(f.index > l.index)	return true;
				else					return false;
			} else						return false;
		}
		function dencrease(a, b, f, l, s){
			if(a == undefined)			return false;
			if(b == undefined)			return false;
			if(f.unsort || (f.base && !s.cell.base && s.type == 0 ) )		return false;
			if(l.unsort || (l.base && !s.cell.base && s.type == 0 ) )		return false;
			if(a > b)					return true;
			else if(a == b){
				if(f.index > l.index)	return true;
				else					return false;
			} else 						return false;
		}
		function increaseBy(a, b, f, l, s){
			if(f.unsort || l.unsort)			return false;
			if(!s.codeOnly){
				if(f.base != l.base){
					if(f.base == 1) 			return false;
					else						return true;
				}
				if(l.obj.type != f.obj.type){
					if(f.obj.type == 5)			return false;
					else if(l.obj.type == 5)	return true;
				}
			}
			if(s.sort == 'text'){
				if(f.obj.text.toLowerCase() > l.obj.text.toLowerCase())		return true;
				else														return false;
			} else if(s.sort == 'exp' && f.obj.type == 5 && l.obj.type == 5) {
				if( parseFloat(f.obj.exp) > parseFloat(l.obj.exp) )			return true;
				else														return false;
			} else if(s.sort == 'label') {
				if(f.obj.label.toLowerCase() > l.obj.label.toLowerCase())	return true;
				else														return false;
			}
		}
		function dencreaseBy(a, b, f, l, s){
			if(f.unsort || l.unsort)			return false;
			if(!s.codeOnly){
				if(f.base != l.base){
					if(f.base == 1) 			return false;
					else						return true;
				}
				if(l.obj.type != f.obj.type){
					if(f.obj.type == 5)			return false;
					else if(l.obj.type == 5)	return true;
				}
			}
			if(s.sort == 'text'){
				if(f.obj.text.toLowerCase() < l.obj.text.toLowerCase())		return true;
				else														return false;
			} else if(s.sort == 'exp' && f.obj.type == 5 && l.obj.type == 5) {
				if( parseFloat(f.obj.exp) < parseFloat(l.obj.exp) )			return true;
				else														return false;
			} else if(s.sort == 'label') {
				if(f.obj.label.toLowerCase() < l.obj.label.toLowerCase())	return true;
				else														return false;
			}
		}
		function fDefault(a, b, f, l, s, j){	return (l.index == j);	}
	}
	var ALTER = new function(){
		this.items = [];

		this.add = function(obj){
			var cell;
			
			if(obj.cell){
				cell = cell;
			} else {
				var tr = 0;
				var tc = 0;
				for(var i = 0; i < _Side.branches.length; i++){
					if(_Side.branches[i].index === obj.i)
						tr = i;
				}
				for(var i = 0; i < _Top.branches.length; i++){
					if(_Top.branches[i].index === obj.j)
						tc = i;
				}
				cell = _Table.cells[tr][tc];
			}

			ALTER.items.push(cell);
			// ALTER?
			cell.alter = obj.alter;
		}

		this.adds = function(input){
			for(var i = 0; i < input.length; i++){
				ALTER.add(input[i]);
			}
		}

		this.remove = function(cell){
			if(!cell.obj){
				cell = _Table.cells[ _Side.branches[cell.i].index , _Top.branches[cell.j].index ];
			}
			for(var i = 0; i < ALTER.items.length; i++){
				if(ALTER.items[i] == cell){
					cell.alter = undefined;
					ALTER.items.splice(i, 1);
					break;
				}
			}
		}

		this.removeAll = function(){
			for(var i = 0; i < ALTER.items.length; i++){
				ALTER.items[i].alter = undefined;
			}
			ALTER.items = [];
		}

		this.get = function(){
			var result = [];
			for(var i = 0; i < ALTER.items.length; i++){
				tr = _Side.branches[ ALTER.items[i].i[0] ].index;
				tc = _Top.branches[ ALTER.items[i].j[0] ].index;
				result.push( { i: tr, j: tc, alter: ALTER.items[i].alter } );
			}
			return result;
		}
	}

	if(options)		link.create(options);
}