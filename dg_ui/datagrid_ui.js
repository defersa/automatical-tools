function data_grid(){
	/*-------------------------------------------------------*/
	/*----------------MAIN OBJECTS IN UI---------------------*/
	var dg_CORNER; //datagrid corner
	var dg_COL_h;  //datagrid columns header
	var dg_ROW_h;  //datagrid rows header
	var dg_TABLE;  //datagrid main table
	/*------------------DG STYLE SHEETS----------------------*/
	var dg_ts  = {};//datagrid table stylesheet
	var dg_cs  = {};//datagrid corner stylesheet
	/*-------------------DEFAULT VALUE-----------------------*/
	var default_dg_ts = { width: [], height: []};
	var default_dg_cs = { width: [], height: []};
	var default_width  = 80;
	var default_height = 40;
	var default_minimum_height = 20;
	/*-------------CURRENT DISPLAYED ELEMENTS----------------*/
	var dg_col_disp; //datagrid colls display
	var dg_row_disp; //datagrid rows display
	/*------------------ARRAY FOR SELECT---------------------*/
	var selected_items = {};
	var cell_under_select = {};
	/*-----------------OBJECTS FOR RESIZE--------------------*/
	var so; //select object
	var ro = {};//resize object	
	var shift_cell = {};//cell for shift
	var char_width = [];//array for chars' width 
	var char_height = 13;
	/*------------------Object for sort----------------------*/
	var ofs_col = {}; //object for sort columns
	var ofs_row = {}; //object for sort rows
	var sorted_line;

	var ccn = ['dg_cell dg_ct', 'dg_cell dg_select_2c', 'dg_cell dg_select_c'];
	var hcn = ['dg_cell dg_ch', 'dg_cell dg_select_2h', 'dg_cell dg_select_h', 'dg_cell dg_select_2h_click', 'dg_cell dg_select_h_click'];
	var self = this;
	var auto_scroll;
	var ie = false;

	var setting = {displayed_types: [true, true, true, true], color_types: ['#ffffff','#d9ffff','#ffecec','#ffffe1'], round_types:[3,3,3,3, 0, 3,3], units_types: ['','%','%',''], 
					hide_zero: false, zero_is_empty: false, move_headers: true,  hide_miss_row: false, hide_miss_col: false, after_select_function: null, font_size: 13, text_orientation: 1,
					auto_width: false, decimal_separator: '.', table_sorted: null, key_down_event: null, right_click: null, sort_by_click: false};
	

	/* property a_s(always show) in every cell means that that row/col always visible */


	/*--------------------------------------------------------------------------------------*/
	/*-------------------------------------TABLE CREATE-------------------------------------*/
	/*--------------------------------------------------------------------------------------*/
	this.dg_table_create = function(parent, width, height) {

		dg_ts			= { top: [], left: [], width: [], height: []};
		dg_cs			= { top: [], left: [], width: [], height: []};
		selected_items	= { table: [], row: [], col: [] };
		dg_CORNER		= {};
		dg_COL_h		= {};
		dg_ROW_h		= {};
		dg_TABLE		= {};
		dg_col_disp		= [];
		dg_row_disp		= [];

		if(width != undefined)
			default_width  = width;
		if(height != undefined)
			default_height = height;
		if(window.clipboardData)
			ie = true;

		window.addEventListener("resize", generate_styles);
		
		function create_Main_object( event, cont_class) {
			var main_object = {x_length: 0, y_length: 0, tree: [], ar: [], empty_divs: []};
			main_object.sc = create_html_object("div", cont_class, dg_CORNER.parent);
			main_object.cont = create_html_object("div", "dg_sc", main_object.sc);
			main_object.cont.onmousedown = event;
			return main_object;
		}
		
		dg_CORNER.parent = create_html_object("div", "dg_div", parent);
		dg_CORNER.cont = create_html_object("div", "dg_corner_cell", dg_CORNER.parent);
		dg_CORNER.parent.tabIndex	= '0';
		dg_CORNER.parent.onkeydown	= dgkeydown;
		dg_CORNER.parent.onkeyup	= dgkeyup;
		dg_CORNER.parent.onblur		= dgblur;
		dg_CORNER.parent.oncontextmenu = function(e){
			if(typeof setting.right_click == 'function'){

				let cell = closest(e.target, 'dg_cell');
				var options = {};

				if(closest(e.target, 'dg_corner_cell'))
					options.area = 'corner';
				else if(closest(e.target, 'dg_col'))
					options.area = 'top';
				else if(closest(e.target, 'dg_row'))
					options.area = 'side';
				else if(closest(e.target, 'dg_tab'))
					options.area = 'table';

				if(cell){
					cell = cell.array;
					options.i = cell.i;
					options.j = cell.j;
					options.position = cell.default_position;
					options.cell = cell.obj;

					if(options.area == 'side' && cell.v_y != undefined){
						options.displayed = [false, false, false, false];
						for(let i = 0; i < dg_TABLE.x_length; i++){
							let count = 0;
							for(let j = 0; j < 4; j++){
								if(dg_TABLE.ar[cell.i[0]][i].obj[j] != undefined && setting.displayed_types[j]){
									count++;
									options.displayed[j] = true;
								} 
							}
							if(!count)		options.displayed[0] = true;
						}
					}
					if(options.area == 'top' && cell.v_x != undefined){
						options.displayed = [false, false, false, false];
						for(let i = 0; i < dg_TABLE.y_length; i++){
							let count = 0;
							for(let j = 0; j < 4; j++){
								if(dg_TABLE.ar[i][cell.j[0]].obj[j] != undefined && setting.displayed_types[j]){
									count++;
									options.displayed[j] = true;
								} 
							}
							if(!count)		options.displayed[0] = true;
						}
					}


					if(!cell.state){
						clear_all();

						if(options.area == 'side'){
							for(let j = cell.i[0]; j <= cell.i[cell.i.length - 1]; j++){
								for(let i = cell.j[0]; i < dg_ROW_h.x_length; i++){
									if(!dg_ROW_h.ar[j][i].state){
										let ncell = dg_ROW_h.ar[j][i];
										selected_items.row.push(ncell);
										change_state(ncell, 4);
									}
								}
								for(var i = 0; i < dg_TABLE.x_length; i++){
									let ncell = dg_TABLE.ar[j][i];
									selected_items.table.push(ncell);
									change_state(ncell, 2);
								}
							}
							for(var i = 0; i < dg_TABLE.v_x.length; i++){
								let ncell = dg_TABLE.v_x[i].tree;
								selected_items.col.push(ncell);
								change_state(ncell, 2);
							}
						} else if(options.area == 'top') {
							for(let j = cell.j[0]; j <= cell.j[cell.j.length - 1]; j++){
								for(let i = cell.i[0]; i < dg_COL_h.y_length; i++){
									if(!dg_COL_h.ar[i][j].state){
										let ncell = dg_COL_h.ar[i][j];
										selected_items.col.push(ncell);
										change_state(ncell, 4);
									}
								}
								for(var i = 0; i < dg_TABLE.y_length; i++){
									let ncell = dg_TABLE.ar[i][j];
									selected_items.table.push(ncell);
									change_state(ncell, 2);
								}
							}
							for(var i = 0; i < dg_TABLE.v_y.length; i++){
								let ncell = dg_TABLE.v_y[i].tree;
								selected_items.row.push(ncell);
								change_state(ncell, 2);
							}
						} else if(options.area == 'table'){
							selected_items.table.push(cell);
							change_state(cell, 2);
							selected_items.table.push(dg_TABLE.v_y[cell.i[0]].tree);
							change_state(dg_TABLE.v_y[cell.i[0]].tree, 2);
							selected_items.table.push(dg_TABLE.v_x[cell.j[0]].tree);
							change_state(dg_TABLE.v_x[cell.j[0]].tree, 2);
						}
						
					}

					if(Array.isArray(options.displayed)){	if( options.area == 'top' && !options.displayed[1] && !options.displayed[2]) options.displayed[0] = true;			}
				}


				setting.right_click(e, options);
			}
			return false;
		}

		dg_COL_h = create_Main_object(ch_mouse_down, 'dg_col');
		dg_ROW_h = create_Main_object(ch_mouse_down, 'dg_row');
		dg_COL_h.root = {children: dg_COL_h.tree};
		dg_ROW_h.root = {children: dg_ROW_h.tree};

		dg_TABLE = {x_length: 0, y_length: 0, tree: [], ar: [], empty_divs: [], visible_x: [], visible_y: [], setting: setting};
		dg_TABLE.sc = create_html_object("div", "dg_tab", dg_CORNER.parent);
		dg_TABLE.custum_scroll = new custum_scroll(dg_TABLE.sc, "dg_sc");
		dg_TABLE.cont = dg_TABLE.custum_scroll.get_container();
		dg_TABLE.cont.onmousedown = cell_mouse_down;
		dg_TABLE.custum_scroll.set_scroll_function(display);

		dg_ROW_h.cn = dg_COL_h.cn = hcn;
		dg_TABLE.cn = ccn;

		dg_TABLE.sc.onmousedown	= function(event){
			if(!closest(event.target, "dg_sc") && !(closest(event.target, "cs-container-horizontal") || closest(event.target, "cs-container-vertical") || closest(event.target, "cs-slider-corner") || closest(event.target, "cs-slider-corner-none")))
				clear_all();
			after_selection();	}
		dg_TABLE.sc.onclick		= function(event){after_selection();}
		dg_CORNER.cont.onclick	= function(event){
			if(selected_items.table.length != 0) clear_all();
			else select_all();
			after_selection();	}

		var corner_resizer = create_html_object("div", "dg_c_resize", dg_CORNER.cont);
		corner_resizer.onmousedown = mouse_down_cor_col_resize;
		corner_resizer = create_html_object("div", "dg_r_resize", dg_CORNER.cont);
		corner_resizer.onmousedown = mouse_down_cor_row_resize;

		dg_CORNER.style = create_html_object("style", "", dg_CORNER.parent);

		get_font_size();
		create_ts_cs();
		generate_styles();

		if (dg_ROW_h.sc.addEventListener) {
			if ('onwheel' in document){ // IE9+, FF17+, Ch31+
				dg_ROW_h.sc.addEventListener("wheel", row_wheel_y);
				dg_COL_h.sc.addEventListener("wheel", row_wheel_x);
				dg_TABLE.sc.addEventListener("wheel", row_wheel_y);
			} else if ('onmousewheel' in document) {	// устаревший вариант события
				dg_ROW_h.sc.addEventListener("mousewheel", row_wheel_y);
				dg_COL_h.sc.addEventListener("mousewheel", row_wheel_x);
				dg_TABLE.sc.addEventListener("mousewheel", row_wheel_y);
			} else {// Firefox < 17
				dg_ROW_h.sc.addEventListener("MozMousePixelScroll", row_wheel_y);
				dg_COL_h.sc.addEventListener("MozMousePixelScroll", row_wheel_x);
				dg_TABLE.sc.addEventListener("MozMousePixelScroll", row_wheel_y);
			}
		} else {// IE8-
			dg_ROW_h.sc.attachEvent("onmousewheel", row_wheel_y);
			dg_COL_h.sc.attachEvent("onmousewheel", row_wheel_x);
			dg_TABLE.sc.attachEvent("onmousewheel", row_wheel_y);
		}
	}

	/*----------------------------------ALTERNATIVE SCROLL----------------------------------*/
	function row_wheel_y(event){
  		var delta = event.deltaY || event.detail || event.wheelDelta;
  		if(ie) delta = -delta;

  		if(event.shiftKey){
			if(delta > 0) dg_TABLE.custum_scroll.change_lp(1);
		  	else dg_TABLE.custum_scroll.change_lp(-1);
		} else {
	  		if(delta > 0) dg_TABLE.custum_scroll.change_tp(3);
		  	else dg_TABLE.custum_scroll.change_tp(-3);
		}
	}
	function row_wheel_x(event){
  		var delta = event.deltaY || event.detail || event.wheelDelta;
  		if(ie) delta = -delta;

  		if(delta > 0) dg_TABLE.custum_scroll.change_lp(1);
	  	else dg_TABLE.custum_scroll.change_lp(-1);
	}
	function after_selection(){
		dg_CORNER.parent.focus();
		if(setting.after_select_function)
			setting.after_select_function();
	}
	var tools = {
		recalc_headers: function(children){
			for(var i = 0; i < children.length; i++){
				children[i].text_width = [];
				var weight = 0;
				for(var j = 0; j < children[i].obj.text.length; j++){
					var cur_elem = char_width[children[i].obj.text.charCodeAt(j)];
					if(cur_elem == undefined)
						cur_elem = 3;
					weight += cur_elem;
					children[i].text_width[j] = weight;
				}
				if(children[i].children.length > 0)
					tools.recalc_headers(children[i].children);
			}
		},
		find_last_parent: function(array){
			var last_item = [];
			for(var i = 0; i < array.length; i++){
				if(array[i].i.length == 1 && array[i].j.length == 1){
					if(last_item.length != 0){
						if(last_item[last_item.length - 1] != array[i].parent)
							last_item[last_item.length] = array[i].parent;
					} else {
						last_item[last_item.length] = array[i].parent;
					}
				}
			}
			return last_item;
		},
		max_type: function(array){
			var count = 0;
			for(var i = 0; i < array.length; i++){
				if(setting.round_types[i] > count && array[i])
					count = setting.round_types[i];
			}
			return count;
		},
		scale_resize: function(new_font){
			for(var i = 0; i < default_dg_ts.width.length; i++)
				default_dg_ts.width[i] = Math.round(default_dg_ts.width[i]*((new_font)/setting.font_size));		

			for(var i = 0; i < default_dg_ts.height.length; i++)
				default_dg_ts.height[i] = (Math.round(default_dg_ts.height[i]*((new_font)/setting.font_size)) > default_minimum_height )? Math.round(default_dg_ts.height[i]*((new_font)/setting.font_size)) : default_minimum_height;

			for(var i = 0; i < default_dg_cs.width.length; i++)
				default_dg_cs.width[i] = Math.round(default_dg_cs.width[i]*((new_font)/setting.font_size));		

			for(var i = 0; i < default_dg_cs.height.length; i++)
				default_dg_cs.height[i] = (Math.round(default_dg_cs.height[i]*((new_font)/setting.font_size)) > default_minimum_height )? Math.round(default_dg_cs.height[i]*((new_font)/setting.font_size)) : default_minimum_height;

			setting.font_size = new_font;
			get_font_size();

			tools.recalc_headers(dg_ROW_h.tree);
			tools.recalc_headers(dg_COL_h.tree);
			
			change_visib();
		}
	}

	function dgkeydown(e){
		var kc = e.keyCode;

		if( kc == 38 || kc == 39 || kc == 40 || kc == 37 || kc == 65 || kc == 33 || kc == 34 || kc == 35 || kc == 36 || kc == 67 || kc == 83 ){
			if (e.stopPropagation)
				e.stopPropagation();
			else
				e.cancelBubble = true; 
		}

		if(e.shiftKey && shift_cell.table != undefined){
			if(shift_cell.table.html != undefined){
				if( shift_cell.table.html.id != "dg_main_select_c")
					shift_cell.table.html.id = "dg_main_select_c";
			}
		} 
		if( kc == 38 || kc == 39 || kc == 40 || kc == 37 ){
			if(kc == 38){
				if(e.shiftKey)		key_select(event, 0,-1);
				else				dg_TABLE.custum_scroll.change_tp(-1);
			}
			if(kc == 40){
				if(e.shiftKey)		key_select(event, 0, 1);
				else				dg_TABLE.custum_scroll.change_tp( 1);
			}
			if(kc == 39){
				if(e.shiftKey)		key_select(event, 1, 0);
				else				dg_TABLE.custum_scroll.change_lp( 1);
			}
			if(kc == 37){
				if(e.shiftKey)		key_select(event,-1, 0);
				else				dg_TABLE.custum_scroll.change_lp(-1);
			}
			return false;
		}
			
		if(kc == 65 && e.ctrlKey){
			select_all();
			return false;
		}
		if(kc == 33 || kc == 34 || kc == 35 || kc == 36){
			if(kc == 33){	dg_TABLE.custum_scroll.change_tp(-10);	}
			if(kc == 34){	dg_TABLE.custum_scroll.change_tp( 10);	}
			if(kc == 35){	dg_TABLE.custum_scroll.change_tp( dg_TABLE.y_length);	}
			if(kc == 36){	dg_TABLE.custum_scroll.change_tp(-dg_TABLE.y_length);	}
			return false;
		}
		if( e.ctrlKey && ( kc == 67 || kc == 83) ){
			if(typeof setting.key_down_event == 'function')
				setting.key_down_event(event, self);

			return false;
		}
	}
	function dgkeyup(e){
		if(shift_cell.table != undefined && !e.shiftKey ){
			if( shift_cell.table.html != undefined){
				shift_cell.table.html.id = '';
			}
			var kc = e.keyCode;

			if( kc == 38 || kc == 39 || kc == 40 || kc == 37 || kc == 65 || kc == 33 || kc == 34 || kc == 35 || kc == 36 || kc == 67 || kc == 83 ){
				if (e.stopPropagation)
					e.stopPropagation();
				else
					e.cancelBubble = true; 
			}
		}
	}
	function dgblur(e){
		if(shift_cell.table != undefined && !e.shiftKey ){
			if( shift_cell.table.html != undefined){
				shift_cell.table.html.id = '';
			}	
		}
	}

	function key_select(event, h, v){
		if(shift_cell.table == undefined && dg_TABLE.ar[0] != undefined) shift_cell.table = dg_TABLE.ar[0][0];
		else if(shift_cell.table == undefined) return;
		if(shift_cell.target == undefined ) shift_cell.target = shift_cell.table;
		so = {event: event};

		so.new_i = (((shift_cell.target.i[0] + v) >= 0) ? (((shift_cell.target.i[0] + v ) < dg_TABLE.y_length) ? (shift_cell.target.i[0] + v) : (dg_TABLE.y_length - 1) ) : 0 );
		so.new_j = (((shift_cell.target.j[0] + h) >= 0) ? (((shift_cell.target.j[0] + h ) < dg_TABLE.x_length) ? (shift_cell.target.j[0] + h) : (dg_TABLE.x_length - 1) ) : 0 );
		shift_cell.target = dg_TABLE.ar[so.new_i][so.new_j];

		so.left		= (so.new_j < shift_cell.table.j[0]) ? so.new_j : shift_cell.table.j[0];
		so.right	= (so.new_j > shift_cell.table.j[0]) ? so.new_j : shift_cell.table.j[0];
		so.top		= (so.new_i < shift_cell.table.i[0]) ? so.new_i : shift_cell.table.i[0];
		so.bot		= (so.new_i > shift_cell.table.i[0]) ? so.new_i : shift_cell.table.i[0];

		clear_all();
		
		for(var i = so.left; i <= so.right; i++){
			change_state(dg_TABLE.v_x[i].tree, 2);
			selected_items.col.push(dg_TABLE.v_x[i].tree);
		}
		for(var i = so.top; i <= so.bot; i++){
			change_state(dg_TABLE.v_y[i].tree, 2);
			selected_items.row.push(dg_TABLE.v_y[i].tree);
		}
		cell_mouse_up(event);

		var scrolled;
		do {
			scrolled = false;
			var vp_c = { l: dg_TABLE.custum_scroll.get_lp(), t: dg_TABLE.custum_scroll.get_tp(), r: (dg_TABLE.custum_scroll.get_lp() + dg_TABLE.custum_scroll.get_width()),  b: (dg_TABLE.custum_scroll.get_tp() + dg_TABLE.custum_scroll.get_height())}; 
			if(vp_c.l > dg_ts.left[shift_cell.target.j[0]]){
				dg_TABLE.custum_scroll.change_lp(-1);
				scrolled = true;
			} else if(vp_c.r < dg_ts.left[shift_cell.target.j[0]] + dg_ts.width[shift_cell.target.j[0]]){
				dg_TABLE.custum_scroll.change_lp( 1);
				scrolled = true;
			}
			if(vp_c.t > dg_ts.top[shift_cell.target.i[0]]){
				dg_TABLE.custum_scroll.change_tp(-1);
				scrolled = true;
			} else if(vp_c.b < dg_ts.top[shift_cell.target.i[0]] + dg_ts.height[shift_cell.target.i[0]]){
				dg_TABLE.custum_scroll.change_tp( 1);
				scrolled = true;
			}
		} while(scrolled) 
	}


	function scale_increase()	{	if(setting.font_size < 30)	tools.scale_resize(setting.font_size + 1); }
	function scale_dencrease()	{	if(setting.font_size >  3) 	tools.scale_resize(setting.font_size - 1); }
	this.scale_plus = function()  {	scale_increase(); };
	this.scale_minus = function() {	scale_dencrease();};
	this.scale_reset = function(fnt_sz) {	tools.scale_resize(fnt_sz);};

	/*--------------------------------------------------------------------------------------*/
	/*---------------------------------SET-GET-SETTING--------------------------------------*/
	/*--------------------------------------------------------------------------------------*/
	this.get_setting = function() {return setting; };

	this.set_setting = function(object) {
		if(object.displayed_types != undefined){
			if(object.displayed_types.length > 0){
				if(Array.isArray(object.displayed_types[0])){
					for(var i = 0; i < object.displayed_types.length; i++){
						if(typeof (object.displayed_types[i] == 'number'[0]) && typeof object.displayed_types[i][1] == 'boolean'){
							setting.displayed_types[object.displayed_types[i][0]] = object.displayed_types[i][1];
						} else {
							console.log('function "set_setting" got incorrect parameter (displayed_types)');
						}
					}
				} else if (object.displayed_types.length == 4){
					setting.displayed_types = object.displayed_types;
				} else {
					console.log('function "set_setting" got incorrect parameter (display_types has incorrect length)');
				}

				if(setting.displayed_types[0] == false && setting.displayed_types[1] == false && setting.displayed_types[2] == false)
					setting.displayed_types[0] = true;

				if(setting.displayed_types[3] == false)
					setting.displayed_types[3] = true;
			}
		}

		if(object.color_types != undefined){
			if(object.color_types.length > 0){
				if(Array.isArray(object.color_types[0])){
					for(var i = 0; i < object.color_types.length; i++){
						if(typeof (object.color_types[i][0]) == 'number' && typeof object.color_types[i][1] == 'string'){
							setting.color_types[object.color_types[i][0]] = object.color_types[i][1];
						} else {
							console.log('function "set_setting" got incorrect parameter (color_types)');
						}
					}
				} else if (object.color_types.length == 4){
					setting.color_types = object.color_types;
				} else {
					console.log('function "set_setting" got incorrect parameter (color_types has incorrect length)');
				}
			}
		}

		if(object.round_types != undefined){
			if(object.round_types.length > 0){
				if(Array.isArray(object.round_types[0])){
					for(var i = 0; i < object.round_types.length; i++){
						if(typeof (object.round_types[i][0]) == 'number' && typeof object.round_types[i][1] == 'number'){
							setting.round_types[object.round_types[i][0]] = object.round_types[i][1];
						} else {
							console.log('function "set_setting" got incorrect parameter (round_types)');
						}
					}
				} else if (object.round_types.length == 4){
					if(typeof object.round_types[0] != 'number'){
						setting.round_types[0] = parseInt(object.round_types[0]);
						setting.round_types[1] = parseInt(object.round_types[1]);
						setting.round_types[2] = parseInt(object.round_types[2]);
						setting.round_types[3] = parseInt(object.round_types[3]);
					} else {
						setting.round_types[0] = object.round_types[0];
						setting.round_types[1] = object.round_types[1];
						setting.round_types[2] = object.round_types[2];
						setting.round_types[3] = object.round_types[3];
					}
				} else if (object.round_types.length == 7){
					if(typeof object.round_types[0] != 'number'){
						setting.round_types[0] = parseInt(object.round_types[0]);
						setting.round_types[1] = parseInt(object.round_types[1]);
						setting.round_types[2] = parseInt(object.round_types[2]);
						setting.round_types[3] = parseInt(object.round_types[3]);
						setting.round_types[4] = parseInt(object.round_types[4]);
						setting.round_types[5] = parseInt(object.round_types[5]);
						setting.round_types[6] = parseInt(object.round_types[6]);
					} else
						setting.round_types = object.round_types;
				} else{
					console.log('function "set_setting" got incorrect parameter (round_types has incorrect length)');
				}

				for(var i = 0; i < setting.round_types.length; i++){
					if(setting.round_types[i] > 15 || setting.round_types[i] < 0)
						setting.round_types[i] = 5;
				}
			}
		}


		if(object.units_types != undefined){
			if(Array.isArray(object.units_types)){
				if(Array.isArray(object.units_types[0])){
					for(var i = 0; i < object.units_types.length; i++){
						if(typeof (object.units_types[i][0]) == 'number' && typeof object.units_types[i][1] == 'string'){
							setting.units_types[object.units_types[i][0]] = object.units_types[i][1];
						} else {
							console.log('function "set_setting" got incorrect parameter (units_types)');
						}
					}
				} else if (typeof object.units_types[0] == 'string'){
					for(var i = 0; i < object.units_types.length; i++){
						if(typeof object.units_types[i] == 'string')
							setting.units_types[i] = object.units_types[i];
					}
				} else if (object.units_types.length == 0){
					setting.units_types = ['','','',''];
				} else {
					console.log('function "set_setting" got incorrect parameter (units_types has incorrect length)');
				}
			}
		}
		if(object.hide_zero != undefined){
			if( typeof object.hide_zero == 'boolean'){
				setting.hide_zero = object.hide_zero;
			} else {
				console.log('function "set_setting" got incorrect parameter ("hide_zero" is not boolean!)');
			}
		}
		if(object.zero_is_empty != undefined){
			if( typeof object.zero_is_empty == 'boolean'){
				setting.zero_is_empty = object.zero_is_empty;
			} else {
				console.log('function "set_setting" got incorrect parameter ("zero_is_empty" is not boolean!)');
			}
		}

		if(object.move_headers != undefined){
			if( typeof object.move_headers == 'boolean'){
				setting.move_headers = object.move_headers;
			} else {
				console.log('function "set_setting" got incorrect parameter ("move_headers" is not boolean!)');
			}
		}
		if(object.hide_miss_row != undefined){
			if( typeof object.hide_miss_row == 'boolean'){
				if(setting.hide_miss_row != object.hide_miss_row){
					setting.hide_miss_row = object.hide_miss_row;					
				}
			} else {
				console.log('function "set_setting" got incorrect parameter ("hide_miss_row" is not boolean!)');
			}
		}
		if(object.hide_miss_col != undefined){
			if( typeof object.hide_miss_col == 'boolean'){
				if(setting.hide_miss_col != object.hide_miss_col){
					setting.hide_miss_col = object.hide_miss_col;					
				}
			} else {
				console.log('function "set_setting" got incorrect parameter ("hide_miss_col" is not boolean!)');
			}
		}
		if(object.after_select_function != undefined){
			if( typeof object.after_select_function == 'function'){
				setting.after_select_function = object.after_select_function;
			} else 
			console.log('function "set_setting" got incorrect parameter ("after_select_function" is not function!)');
		}
		if(object.text_orientation != undefined){
			setting.text_orientation = object.text_orientation;
		}
		if(object.decimal_separator != undefined){
			if( typeof object.decimal_separator == 'string'){
				setting.decimal_separator = object.decimal_separator;
			} else 
			console.log('function "set_setting" got incorrect parameter ("decimal_separator  is not string!)');
		}
		if(object.table_sorted != undefined){
			if( typeof object.table_sorted == 'function'){
				setting.table_sorted = object.table_sorted;
			} else 
			console.log('function "set_setting" got incorrect parameter ("table_sorted  is not function!)');
		}
		if(object.key_down_event != undefined){
			if( typeof object.key_down_event == 'function'){
				setting.key_down_event = object.key_down_event;
			} else 
			console.log('function "set_setting" got incorrect parameter ("key_down_event  is not function!)');
		}
		if(object.right_click != undefined){
			if( typeof object.right_click == 'function'){
				setting.right_click = object.right_click;
			} else 
			console.log('function "set_setting" got incorrect parameter ("right_click  is not function!)');
		}
		if(object.sort_by_click != undefined){
			if(object.sort_by_click)	setting.sort_by_click = true;
			else						setting.sort_by_click = false;
		}
		change_visib();
	}
	this.optimal_width = function(array) {
		if(!Array.isArray(array))
			array = [array];
		for(var i = 0; i < array.length; i++){
			if(array[i] instanceof tree_node)
				dblclick_for_x_resize({target: array[i]});
		}
	}

	this.clear_default_size = function(){ default_dg_ts = {width:[], height: []}; };

	this.show = function(){};
	this.hide = function(){};
	
	this.get_ROWS = function(){ if(typeof dg_CORNER.parent == 'undefined') return;	return dg_ROW_h.tree;};
	this.get_COLS = function(){ if(typeof dg_CORNER.parent == 'undefined') return;	return dg_COL_h.tree;};

	/*-----------------------------DEAULT-WIDTH-AND-HEIGHT--------------------------------*/
	this.set_default_width_to_header  = function(array) { for(var i = 0; i < array.length; i++) default_dg_cs.width[i]  = array[i]; }
	this.set_default_height_to_header = function(array) { for(var i = 0; i < array.length; i++)	default_dg_cs.height[i] = array[i];	}

	this.remove_table = function(){
		if(typeof dg_CORNER.parent == 'undefined') return;		
		window.removeEventListener('resize', display);

		dg_CORNER.parent.parentNode.removeChild(dg_CORNER.parent);
		dg_CORNER = {};	dg_TABLE = {};
		dg_ROW_h = {};	dg_COL_h = {};
		dg_cs = {}; dg_ts = {}; shift_cell = {};
		so_co = {};
	}
	this.reset = function(){
		if(typeof dg_CORNER.parent == 'undefined') return;
		var parent = dg_CORNER.parent.parentNode;
		this.remove_table();
		this.dg_table_create(parent, default_width, default_height);
	}


	/*------------------------------------------------------------------------------------*/
	/*--------------------------GET-TABLE-TO-OTHER-FORMAT---------------------------------*/
	/*------------------------------------------------------------------------------------*/
	this.get_html = function(select, style, cols, rows, split, has_text){
		var html = '<!DOCTYPE HTML><html><head><style> th{background:#F1F1F1; }</style></head><body>';

		if(split == undefined)
			split = false;
		if(has_text == undefined)
			has_text = false;

		var first_i = 0; var last_i = 0;
		var first_j = 0; var last_j = 0;
		
		if(selected_items.table.length > 0){
			for(var i = 0; i < selected_items.table.length; i++){
				if(selected_items.table[i].i[0] < selected_items.table[first_i].i[0])
					first_i = i;
				if(selected_items.table[i].i[0] > selected_items.table[last_i].i[0])
					last_i = i;
				if(selected_items.table[i].j[0] < selected_items.table[first_j].j[0])
					first_j = i;
				if(selected_items.table[i].j[0] > selected_items.table[last_j].j[0])
					last_j = i;
			}
			first_i = selected_items.table[first_i].i[0]; last_i = selected_items.table[last_i].i[0];
			first_j = selected_items.table[first_j].j[0]; last_j = selected_items.table[last_j].j[0];
		}

		var first_j_cor = dg_ROW_h.x_length;
		for(var i = 0; i < selected_items.row.length; i++){
			if(selected_items.row[i].j[selected_items.row[i].j.length - 1] < first_j_cor)
				first_j_cor = selected_items.row[i].j[selected_items.row[i].j.length - 1];
		}

		var first_i_cor = dg_COL_h.y_length;
		for(var i = 0; i < selected_items.col.length; i++){
			if(selected_items.col[i].i[selected_items.col[i].i.length - 1] < first_i_cor)
				first_i_cor = selected_items.col[i].i[selected_items.col[i].i.length - 1];
		}

		if(!select || selected_items.table.length == 0){
			first_i = 0; last_i = dg_TABLE.y_length - 1;
			first_j = 0; last_j = dg_TABLE.x_length - 1;
			first_i_cor = 0; first_j_cor = 0;
		}

		html += '<table border="1" padding="1px" style="vertical-align: middle; font-family: Verdana, serif; font-size: 11px; border-collapse: collapse; text-align: center; "><tbody>';

		if(cols){
			var has_corner = true;

			for(var i = first_i_cor; i < dg_COL_h.y_length; i++){				
				
				var has_select_item = false;
				var bit_html = '';
	
				for(var j = first_j; j <= last_j; j++){	
					if( ((dg_COL_h.ar[i][j].i[0] == i) || (dg_COL_h.ar[i][j].i[0] <= i && dg_COL_h.ar[i][j].i[dg_COL_h.ar[i][j].i.length - 1] >= i && i ==  first_i_cor)) && (dg_COL_h.ar[i][j].j[0] == j)  ){
						bit_html += '<th';
						if(style) bit_html += ' style="background:#F1F1F1;"';
						if( (dg_COL_h.ar[i][j].i[dg_COL_h.ar[i][j].i.length - 1] - i + 1) != 1)		bit_html += ' rowspan="' + (dg_COL_h.ar[i][j].i[dg_COL_h.ar[i][j].i.length - 1] - i + 1) + '"';
						if( dg_COL_h.ar[i][j].j.length != 1)							bit_html += ' colspan="' + dg_COL_h.ar[i][j].j.length + '"';
						bit_html += ' >' + dg_COL_h.ar[i][j].obj.text + '</th>';
						has_select_item = true;
					}
				}
				if(has_select_item){
					if(rows && has_corner){
						html += '<tr><th';
						if(style)		html += ' style="background:#F1F1F1;"'; 
						if( (dg_COL_h.y_length - first_i_cor) != 1)				html += ' rowspan="' + (dg_COL_h.y_length - first_i_cor) + '"';
						if( (dg_ROW_h.x_length - first_j_cor) != 1)				html += ' colspan="' + (dg_ROW_h.x_length - first_j_cor) + '"';
						html += ' ></th>'  + bit_html + '</tr>';
						has_corner = false;
					} else {
						html += '<tr>' + bit_html + '</tr>';
					}					
				}
			}
		}
		for(var i = first_i; i <= last_i; i++){
			var has_select_item = false;

			var bit_html = '';
			for(var j = first_j_cor; j < dg_ROW_h.x_length; j++){	
				if( (dg_ROW_h.ar[i][j].i[0] == i) && ( (dg_ROW_h.ar[i][j].j[0] == j) || (dg_ROW_h.ar[i][j].j[0] <= j && dg_ROW_h.ar[i][j].j[dg_ROW_h.ar[i][j].j.length - 1] >= j && j == first_j_cor ) ) )  {
					var current_row_span = 0;

					for(var k = 0; k < dg_ROW_h.ar[i][j].i.length; k++)
						current_row_span += dg_TABLE.visible_y[dg_ROW_h.ar[i][j].i[k]].cc;

					if(rows){
						if(dg_ROW_h.ar[i][j].j[dg_ROW_h.ar[i][j].j.length - 1] == dg_ROW_h.x_length - 1){
							if(!split)
								bit_html += '<th' + ((style)? ' style="text-align:left; background:#F1F1F1;"' : '') + ' rowspan="' + current_row_span + '" colspan="' + (dg_ROW_h.ar[i][j].j[dg_ROW_h.ar[i][j].j.length - 1] - j + 1) + '"  >' + dg_ROW_h.ar[i][j].obj.text + '</th>';
							
						} else {
							if(!split)
								bit_html += '<th' + ((style)? ' style="background:#F1F1F1;"' : '') + '  rowspan="' + current_row_span + '" colspan="' + (dg_ROW_h.ar[i][j].j[dg_ROW_h.ar[i][j].j.length - 1] - j + 1) + '"  >' + dg_ROW_h.ar[i][j].obj.text + '</th>';
						}
					}

					has_select_item = true;
				}
			}
			if(has_select_item){

				var rc = [];
				for(var k = 0; k < dg_TABLE.visible_y[i].cc; k++)
					rc[k] = '';

				
				for(var j = first_j; j <= last_j; j++){	
					var current_row = 0;
					for(var k = 0; k < 4; k++){
						if( dg_TABLE.ar[i][j].obj[k] != undefined){
							if(setting.displayed_types[k]){
								var vo = dg_TABLE.ar[i][j].obj[k];

								rc[current_row] += '<td ' + ((style) ? ('style="background:' + setting.color_types[k] + ';"') : '') + '>';
								
								if(vo.text == 0 && setting.hide_zero){
									rc[current_row] += '';
								} else if(typeof vo.text != 'number' && setting.zero_is_empty) {
									rc[current_row] += '0' + setting.units_types[k];
								} else if(typeof vo.text == 'number') { 
									rc[current_row] += (Math.round(vo.text * Math.pow(10, setting.round_types[vo.type]))/ Math.pow(10, setting.round_types[vo.type]) + '').replace(/\./g, setting.decimal_separator) + setting.units_types[k];
								} else { rc[current_row] += '';}

								rc[current_row] += '</td>'

								current_row++;
							}
						}						
					}
					if(current_row == 0 && dg_TABLE.ar[i][j].obj[0] != undefined){
								var vo = dg_TABLE.ar[i][j].obj[0];

								rc[0] += '<td>';
								
								if(vo.text == 0 && setting.hide_zero){
									rc[0] += '';
								} else if(typeof vo.text != 'number' && setting.zero_is_empty) {
									rc[0] += '0' + setting.units_types[0];
								} else if(typeof vo.text == 'number') { 
									rc[0] += (Math.round(vo.text * Math.pow(10, setting.round_types[vo.type]))/ Math.pow(10, setting.round_types[vo.type]) + '').replace(/\./g, setting.decimal_separator) + setting.units_types[0];
								} else { rc[0] += '';}

								rc[0] += '</td>'

								current_row++;
					}
					if(current_row != rc.length){
						for(var k = current_row; k < rc.length; k++)
							rc[k] += '<td></td>';
					}
				}


				if(rc.length != 0){

					if(split){
						for(var k = 0; k < rc.length; k++){
							bit_html = '';
							for(var j = first_j_cor; j < dg_ROW_h.x_length; j++){	
								bit_html += '<td>' + dg_ROW_h.ar[i][j].obj.text + '</td>';
							}
							rc[0] = bit_html + rc[0];
						}
					} else {						
						rc[0] = bit_html + rc[0];
					}

					for(var k = 0; k < rc.length; k++){
						html += '<tr>' + rc[k] + '</tr>';
					}
					
					bit_html = '';
				}
			}
		}
		html += '</tbody></table></body></html>';

		return html;
	}
	this.get_object = function(select, split, has_text){
		var obj = {};

		if(split == undefined)
			split = false;		
		if(has_text == undefined)
			has_text = false;

		var first_i = 0; var last_i = 0;
		var first_j = 0; var last_j = 0;

		if(selected_items.table.length > 0){
			for(var i = 0; i < selected_items.table.length; i++){
				if(selected_items.table[i].i[0] < selected_items.table[first_i].i[0])
					first_i = i;
				if(selected_items.table[i].i[0] > selected_items.table[last_i].i[0])
					last_i = i;
				if(selected_items.table[i].j[0] < selected_items.table[first_j].j[0])
					first_j = i;
				if(selected_items.table[i].j[0] > selected_items.table[last_j].j[0])
					last_j = i;
			}
			first_i = selected_items.table[first_i].i[0]; last_i = selected_items.table[last_i].i[0];
			first_j = selected_items.table[first_j].j[0]; last_j = selected_items.table[last_j].j[0];
		}

		var first_j_cor = dg_ROW_h.x_length;
		for(var i = 0; i < selected_items.row.length; i++){
			if(selected_items.row[i].j[selected_items.row[i].j.length - 1] < first_j_cor)
				first_j_cor = selected_items.row[i].j[selected_items.row[i].j.length - 1];
		}
		var first_i_cor = dg_COL_h.y_length;
		for(var i = 0; i < selected_items.col.length; i++){
			if(selected_items.col[i].i[selected_items.col[i].i.length - 1] < first_i_cor)
				first_i_cor = selected_items.col[i].i[selected_items.col[i].i.length - 1];
		}

		if(!select || selected_items.table.length == 0){
			first_i = 0; last_i = dg_TABLE.y_length - 1;
			first_j = 0; last_j = dg_TABLE.x_length - 1;
			first_i_cor = 0; first_j_cor = 0;
		}

		obj.row = []; obj.col = [];

		for(var i = first_j_cor; i < dg_cs.width.length; i++)
			obj.col[obj.col.length] = dg_cs.width[i];		
		for(var i = first_i_cor; i < dg_cs.height.length; i++)
			obj.row[obj.row.length] = dg_cs.height[i];


		for(var i = first_j; i <= last_j; i++)
			obj.col[obj.col.length] = dg_ts.width[i];		
		for(var i = first_i; i <= last_i; i++){
			for(var k = 0; k < dg_TABLE.v_y[i].cc; k++)
				obj.row[obj.row.length] = Math.floor(dg_ts.height[i]/dg_TABLE.v_y[i].cc);
		}

		obj.array = [];
		var has_corner = true;

		for(var i = first_i_cor; i < dg_COL_h.y_length; i++){

			var has_select_item = false;
			var row = [];

			for(var j = first_j; j <= last_j; j++){	
				if( ((dg_COL_h.ar[i][j].i[0] == i) || (dg_COL_h.ar[i][j].i[0] <= i && dg_COL_h.ar[i][j].i[dg_COL_h.ar[i][j].i.length - 1] >= i && i ==  first_i_cor)) && (dg_COL_h.ar[i][j].j[0] == j)){
					row[row.length] = {text: dg_COL_h.ar[i][j].obj.text, rowspan: (dg_COL_h.ar[i][j].i[dg_COL_h.ar[i][j].i.length - 1] - i + 1), colspan: dg_COL_h.ar[i][j].j.length, type: 'header', j: (j + dg_ROW_h.x_length - first_j_cor - first_j)};
					has_select_item = true;
				}
			}

			if(has_select_item){
				if(has_corner){
					row.splice( 0, 0, {text:'', rowspan: (dg_COL_h.y_length - first_i_cor), colspan: (dg_ROW_h.x_length - first_j_cor), type: 'corner', j: 0});
					has_corner = false;
				}
				obj.array[obj.array.length] = row;
			}
		}	
		

		for(var i = first_i; i <= last_i; i++){
			var has_select_item = false;

			var row = [];
			for(var j = first_j_cor; j < dg_ROW_h.x_length; j++){	
				if( (dg_ROW_h.ar[i][j].i[0] == i) && ( (dg_ROW_h.ar[i][j].j[0] == j) || (dg_ROW_h.ar[i][j].j[0] <= j && dg_ROW_h.ar[i][j].j[dg_ROW_h.ar[i][j].j.length - 1] >= j && j == first_j_cor ) ) )  {

					var current_row_span = 0;
					for(var k = 0; k < dg_ROW_h.ar[i][j].i.length; k++)
						current_row_span += dg_TABLE.v_y[dg_ROW_h.ar[i][j].i[k]].cc;

					if(!split){
						if(dg_ROW_h.ar[i][j].j[dg_ROW_h.ar[i][j].j.length - 1] == dg_ROW_h.x_length - 1)
							row[row.length] = {text: dg_ROW_h.ar[i][j].obj.text, colspan: (dg_ROW_h.ar[i][j].j[dg_ROW_h.ar[i][j].j.length - 1] - j + 1), rowspan: current_row_span, type: 'header left', j: j - first_j_cor};
						else if(setting.text_orientation)
							row[row.length] = {text: dg_ROW_h.ar[i][j].obj.text, colspan: (dg_ROW_h.ar[i][j].j[dg_ROW_h.ar[i][j].j.length - 1] - j + 1), rowspan: current_row_span, type: 'header vert', j: j - first_j_cor};
						else 
							row[row.length] = {text: dg_ROW_h.ar[i][j].obj.text, colspan: (dg_ROW_h.ar[i][j].j[dg_ROW_h.ar[i][j].j.length - 1] - j + 1), rowspan: current_row_span, type: 'header', j: j - first_j_cor};
					}
					has_select_item = true;
				}
			}

			if(has_select_item){

				var rc = [];
				for(var k = 0; k < dg_TABLE.v_y[i].cc; k++)
					rc[k] = [];

				
				for(var j = first_j; j <= last_j; j++){	
					var current_row = 0;
					for(var k = 0; k < 4; k++){
						if( dg_TABLE.ar[i][j].obj[k] != undefined && setting.displayed_types[k]){
							
							var cur_cell = {type: dg_TABLE.ar[i][j].obj[k].type, j: (dg_ROW_h.x_length + j - first_j - first_j_cor )};
							rc[current_row][rc[current_row].length] = cur_cell; 

							if(dg_TABLE.ar[i][j].obj[k].text == 0 && setting.hide_zero)	cur_cell.text = '';
							else if(typeof dg_TABLE.ar[i][j].obj[k].text != 'number' && setting.zero_is_empty) cur_cell.text = 0;
							else if(typeof dg_TABLE.ar[i][j].obj[k].text == 'number') cur_cell.text = Math.round(dg_TABLE.ar[i][j].obj[k].text * Math.pow(10, setting.round_types[dg_TABLE.ar[i][j].obj[k].type]))/ Math.pow(10, setting.round_types[dg_TABLE.ar[i][j].obj[k].type]);
							else cur_cell.text = '';

							current_row++;
						}						
					}
					if(current_row == 0 && dg_TABLE.ar[i][j].obj[0] != undefined){

						var cur_cell = {type: dg_TABLE.ar[i][j].obj[0].type, j: (dg_ROW_h.x_length + j - first_j - first_j_cor )};
						rc[current_row][rc[current_row].length] = cur_cell; 

						if(dg_TABLE.ar[i][j].obj[0].text == 0 && setting.hide_zero)	cur_cell.text = ''
						else if(typeof dg_TABLE.ar[i][j].obj[0].text != 'number' && setting.zero_is_empty) cur_cell.text = 0;
						else if(typeof dg_TABLE.ar[i][j].obj[0].text == 'number') cur_cell.text = Math.round(dg_TABLE.ar[i][j].obj[0].text * Math.pow(10, setting.round_types[dg_TABLE.ar[i][j].obj[0].type]))/ Math.pow(10, setting.round_types[dg_TABLE.ar[i][j].obj[0].type]);
						else cur_cell.text = '';

						current_row++;
					}
					if(current_row != rc.length){
						for(var k = current_row; k < rc.length; k++)
							rc[k][rc[k].length] = {type: 0, text: '' };
					}
				}

				if(rc.length != 0){
					if(split){
						for(var s = 0; s < rc.length; s++){
							var new_row = [];

							for(var j = first_j_cor; j < dg_ROW_h.x_length; j++){
								if(has_text || (dg_ROW_h.ar[i][j].i[0] == i && dg_ROW_h.ar[i][j].j[0] == j && s == 0))
									new_row[new_row.length] = {type: 'header left', text: dg_ROW_h.ar[i][j].obj.text , colspan: 1, rowspan: 1, j: j - first_j_cor };								
								else 
									new_row[new_row.length] = {type: 'header left', text: '', colspan: 1, rowspan: 1, j: j - first_j_cor };								
							}
							rc[s] = new_row.concat(rc[s]);
						}
					} else
						rc[0] = row.concat(rc[0]);

					for(var k = 0; k < rc.length; k++)
						obj.array[obj.array.length] = rc[k];

					row = [];
				}			
			}
		}
		obj.color_types = setting.color_types.concat();
		obj.round_types = setting.round_types.concat();
		obj.units_types = setting.units_types.concat();

		return obj;
	}
	this.get_selected_objects = function(){
		var objs = [];
		var cell;
		for(var i = 0; i < selected_items.table.length; i++) {
			cell = selected_items.table[i];
			var obj = [];
			for(var j = 0; j < cell.obj.length; j++){
				if(cell.obj[j] != undefined)
					obj[obj.length] = cell.obj[j];
			}
			objs.push(obj);
		}
		return objs;
	}
	
	/*------------------------------------------------------------------------------------*/
	/*---------------------------------SET-TABLE------------------------------------------*/
	/*------------------------------------------------------------------------------------*/
	this.set_table = function(cols, rows, cells){
		this.reset();

		if(typeof cols == 'string')
			cols = JSON.parse(cols);
		if(typeof rows == 'string')
			rows = JSON.parse(rows);
		if(typeof cells == 'string')
			cells = JSON.parse(cells);


		if(typeof dg_CORNER.parent == 'undefined') return;

		var new_rows = add_objects_to_tree(dg_ROW_h, null, rows);
		remake_rows_header();
		for(var i = 0; i < new_rows.length; i++)
			table_add_row(new_rows[i].i[0], new_rows[i]);		

		var new_cols = add_objects_to_tree(dg_COL_h, null, cols);
		remake_columns_header();
		for(var i = 0; i < new_cols.length; i++)
			table_add_col(new_cols[i].j[0], new_cols[i]);

		for(var i = 0; i < cells.length; i++){
			for(var j = 0; j < cells[i].length; j++){

				if( dg_TABLE.visible_x.length > j  || dg_TABLE.visible_y.length > i ){
					var obj = dg_TABLE.tree[i][j].obj;
					dg_TABLE.tree[i][j].a_s = false;

					for(var k = 0; k < cells[i][j].length; k++){
						if(cells[i][j][k].type == 4)
							dg_TABLE.tree[i][j].a_s = true;
						else if(cells[i][j][k].type > 4)
							obj[0] = cells[i][j][k];
						else
							obj[cells[i][j][k].type] = cells[i][j][k];
					}
				}
			}
		}
		dg_TABLE.default_position_x = [];
		for(var i = 0; i < dg_TABLE.visible_x.length; i++){
			dg_TABLE.default_position_x[i] = {index: i, tree: dg_TABLE.visible_x[i].tree};
			dg_TABLE.default_position_x[i].tree.dpi = dg_TABLE.default_position_x[i];
		}
		dg_TABLE.default_position_y = [];
		for(var i = 0; i < dg_TABLE.visible_y.length; i++){
			dg_TABLE.default_position_y[i] = {index: i, tree: dg_TABLE.visible_y[i].tree};
			dg_TABLE.default_position_y[i].tree.dpi = dg_TABLE.default_position_y[i];
		}
		change_visib();
	}

	this.set_cells  = function(start_r, start_c, arr){
		if(dg_CORNER.parent == undefined || dg_TABLE.visible_x.length <= col  || dg_TABLE.visible_y.length <= row ) return;
		if(start_r + arr.length > dg_TABLE.visible_y.length || start_c + arr[0].length > dg_TABLE.visible_x.length) return;

		for(var i = start_r; i < start_r + arr.length; i++){
			for(var j = start_c; j < start_c + arr[0].length; j++){
				var cell = arr[i - start_r][j - start_c];
				var obj = dg_TABLE.tree[i][j].obj;
				obj[0] = {};

				for(var k = 0; k < cells.length; k++)
					obj[cells[k].type] = cells[k];
			}
		}
		change_visib();
	}
	this.refresh = function(){change_visib();}

	function change_visib(){
		for(var i = 0; i < dg_TABLE.visible_y.length; i++){
			dg_TABLE.visible_y[i].tree_i = i;
			var empty = true;
			for(var j = 0; j < dg_TABLE.visible_x.length; j++){
				for(var k = 0; k < dg_TABLE.tree[i][j].obj.length; k++){
					if(dg_TABLE.tree[i][j].obj[k] != undefined ){
						if(dg_TABLE.tree[i][j].obj[k].text != undefined && dg_TABLE.tree[i][j].obj[k].text != '' && dg_TABLE.tree[i][j].obj[k].text != 0)
							empty = false;
					}
					if(dg_TABLE.tree[i][j].a_s || !setting.hide_miss_row)
						empty = false;
				}
				if(!empty)
					break;
			}
			if(empty) dg_TABLE.visible_y[i].bool = dg_TABLE.visible_y[i].tree.visible = false;
			else dg_TABLE.visible_y[i].bool = dg_TABLE.visible_y[i].tree.visible = true;
		}

		for(var i = 0; i < dg_TABLE.visible_x.length; i++){
			dg_TABLE.visible_x[i].tree_j = i;
			var empty = true;
			for(var j = 0; j < dg_TABLE.visible_y.length; j++){
				for(var k = 0; k < dg_TABLE.tree[j][i].obj.length; k++){
					if(dg_TABLE.tree[j][i].obj[k] != undefined){
						if(dg_TABLE.tree[j][i].obj[k].text != undefined && dg_TABLE.tree[j][i].obj[k].text != '' && dg_TABLE.tree[j][i].obj[k].text != 0)
							empty = false;
					}						
					if(dg_TABLE.tree[j][i].a_s || !setting.hide_miss_col)
						empty = false;
				}
				if(!empty)
					break;
			}			
			if(empty) dg_TABLE.visible_x[i].bool = dg_TABLE.visible_x[i].tree.visible = false;
			else dg_TABLE.visible_x[i].bool = dg_TABLE.visible_x[i].tree.visible = true;
		}
		
		for(var i = 0; i < dg_col_disp.length; i++){
			for(var j = 0; j < dg_COL_h.y_length; j++)
				destroy_cell(dg_COL_h.ar[j][dg_col_disp[i]]);
			
			for(var j = 0; j < dg_row_disp.length; j++)
				destroy_cell(dg_TABLE.ar[dg_row_disp[j]][dg_col_disp[i]]);
		}
		for(var i = 0; i < dg_row_disp.length; i++){
			for(var j = 0; j < dg_ROW_h.x_length; j++)
				destroy_cell(dg_ROW_h.ar[dg_row_disp[i]][j]);
		}

		for(var i = 0; i < dg_TABLE.visible_x.length; i++)
			dg_TABLE.visible_x[i].d_p = [false, false, false, false];

		for(var i = 0; i < dg_TABLE.tree.length; i++){
			for(var j = 0; j < dg_TABLE.tree[i].length; j++){
				for(var k = 0; k < dg_TABLE.tree[i][j].obj.length; k++){
					if(dg_TABLE.tree[i][j].obj[k] != undefined){
						if( Math.abs(dg_TABLE.tree[i][j].obj[k].text) > dg_TABLE.visible_x[j].max )
							dg_TABLE.visible_x[j].max = Math.abs(dg_TABLE.tree[i][j].obj[k].text);
						if(setting.displayed_types[dg_TABLE.tree[i][j].obj[k].type])
							dg_TABLE.visible_x[j].d_p[dg_TABLE.tree[i][j].obj[k].type] = true;
					}
				}
			}
		}

		if(setting.auto_width){
			for(var i = 0; i < dg_TABLE.visible_x.length; i++)
				dg_TABLE.visible_x[i].width = (Math.floor(Math.log(dg_TABLE.visible_x[i].max)/Math.log(10) + 1) + tools.max_type(dg_TABLE.visible_x[i].d_p))*char_width[48] + 6;
		}

		dg_col_disp = [];
		dg_row_disp = [];

		remake_rows_header();
		remake_columns_header();

		add_cr_in_TABLE();
		recalc_cells();
	}
	
	function tree_node(parent, obj, table){
		this.children 		= [];
		this.parent			= null;
		this.visible		= true;
		this.table  		= table;
		this.state			= 0;
		this.obj 			= obj;

		if(parent instanceof tree_node){
			this.parent = parent;
			this.default_position = parent.children.length;
			parent.children[parent.children.length] = this;
		} else {
			this.parent = table.root;
			this.default_position = table.tree.length;
			table.tree[table.tree.length] = this;
		}
	}

	function add_objects_to_tree(table, parent, tree){
		var new_column = [];
		if(tree.length != undefined && tree.length > 0){
			for(var s = 0; s < tree.length; s++){
				var new_elem = new tree_node(parent, tree[s], table);

				if(typeof tree[s].children != 'undefined'){
					if(tree[s].children.length > 0)						
						new_column = new_column.concat(add_objects_to_tree(table, new_elem, tree[s].children));
					else
						new_column[new_column.length] = new_elem; 
				} else 
					new_column[new_column.length] = new_elem; 				
			}
		}
		return new_column;
	}

	function remake_columns_header(){	
		for(var i = 0; i < dg_COL_h.ar.length; i++){
			for(var j = 0; j < dg_COL_h.ar[i].length; j++){
				if(dg_COL_h.ar[i][j].html != undefined)
					destroy_cell(dg_COL_h.ar[i][j]);
			}
		}
		for(var i = 0; i < dg_TABLE.ar.length; i++){
			for(var j = 0; j < dg_TABLE.ar[i].length; j++){
				if(dg_TABLE.ar[i][j].html != undefined)
					destroy_cell(dg_TABLE.ar[i][j]);
			}
		}
		dg_COL_h.cur_x_length = 0;

		dg_COL_h.x_length = get_children_count(dg_COL_h.tree);
		dg_COL_h.y_length = get_how_deep(dg_COL_h.tree);
		if(dg_COL_h.x_length == 0) dg_COL_h.y_length = 0;
		dg_COL_h.ar = [];

		create_ts_cs();

		for(i = 0; i < dg_COL_h.y_length; i++)
			dg_COL_h.ar[i] = [];

		for(i = 0; i < dg_COL_h.tree.length; i++)
			create_col(dg_COL_h.tree[i], 0, dg_COL_h.y_length);
	}
	function remake_rows_header(){
		for(var i = 0; i < dg_ROW_h.ar.length; i++){
			for(var j = 0; j < dg_ROW_h.ar[i].length; j++){
				if(dg_ROW_h.ar[i][j].html != undefined)
					destroy_cell(dg_ROW_h.ar[i][j]);
			}
		}
		for(var i = 0; i < dg_TABLE.ar.length; i++){
			for(var j = 0; j < dg_TABLE.ar[i].length; j++){
				if(dg_TABLE.ar[i][j].html != undefined)
					destroy_cell(dg_TABLE.ar[i][j]);
			}
		}

		dg_ROW_h.cur_y_length = 0;

		dg_ROW_h.y_length = get_children_count(dg_ROW_h.tree);
		dg_ROW_h.x_length = get_how_deep(dg_ROW_h.tree);
		if(dg_ROW_h.y_length == 0) dg_ROW_h.x_length = 0;
		dg_ROW_h.ar = [];

		create_ts_cs();

		for(i = 0; i < dg_ROW_h.tree.length; i++)
			create_row(dg_ROW_h.tree[i], 0, dg_ROW_h.x_length);
	}

	function remake_table_and_display(){
		add_cr_in_TABLE();
		change_visib();
	}


	/*-------------------------------CHANGE-ROWS---------------------------*/
	this.delete_row = function(elem){
		if(typeof dg_CORNER.parent == 'undefined') return;
		var delete_rows = elem.i.concat();
		splice_elem_in_tree(dg_ROW_h, elem);

		remake_rows_header();

		for(var i = (delete_rows.length - 1); i >= 0; i--) {
			dg_TABLE.tree.splice(delete_rows[i], 1);
			dg_TABLE.visible_y.splice(delete_rows[i], 1);
		}			
		remake_table_and_display();
	}
	this.add_rows = function(tree){
		if(typeof dg_CORNER.parent == 'undefined') return;
		var new_rows = add_objects_to_tree(dg_ROW_h, null, tree);

		remake_rows_header();

		for(var i = 0; i < new_rows.length; i++)
			table_add_row(new_rows[i].i[0], new_rows[i]);

		remake_table_and_display();
	}
	this.add_row = function(obj, parent){
		if(typeof dg_CORNER.parent == 'undefined') return;
		var new_elem = new tree_node(parent, obj, dg_ROW_h);

		remake_rows_header();

		if(new_elem.parent != undefined){
			if(new_elem.parent.children.length != 1)
				table_add_row(new_elem.i[0], new_elem);	
		} else 
			table_add_row(new_elem.i[0], new_elem)

		remake_table_and_display();
		return new_elem;
	}

	/*-------------------------------CHANGE-COLS---------------------------*/
	this.delete_col = function(elem){
		if(typeof dg_CORNER.parent == 'undefined') return;
		var delete_cols = elem.j.concat(); 
		splice_elem_in_tree(dg_COL_h, elem);
		
		remake_columns_header();

		for(var i = (delete_cols.length - 1); i >= 0; i--){
			for(var j = 0; j < dg_TABLE.tree.length; j++)
				dg_TABLE.tree[j].splice(delete_cols[i], 1);
		}				
		remake_table_and_display();
	}
	this.add_cols = function(tree){
		if(typeof dg_CORNER.parent == 'undefined') return;
		var new_cols = add_objects_to_tree(dg_COL_h, null, tree);
		
		remake_columns_header();

		for(var i = 0; i < new_cols.length; i++){
			table_add_col(new_cols[i].j[0], new_cols[i]);
		}
		remake_table_and_display();
	}
	this.add_col = function(obj, parent){
		if(typeof dg_CORNER.parent == 'undefined') return;	
		var new_elem = new tree_node(parent, obj, dg_COL_h);
		
		remake_columns_header();

		if(new_elem.parent != undefined){
			if(new_elem.parent.children.length != 1)
				table_add_col(new_elem.j[0], new_elem)
		} else 
			table_add_col(new_elem.j[0], new_elem)
		
		remake_table_and_display();
		return new_elem;
	}

	function table_add_col(new_j, tree){
		for(var i = 0; i < new_j; i++){
			if(dg_TABLE.visible_x[i].bool == false){
				new_j++;
			}
		}
		dg_TABLE.visible_x.splice(new_j, 0 , {bool: true, tree: tree, max: 0});
		tree.v_x = dg_TABLE.visible_x[new_j];

		for(var i = 0; i < dg_TABLE.visible_y.length; i++)
			dg_TABLE.tree[i].splice(new_j, 0, { state: 0, obj: [null,null,null,null], text: '&nbsp;', a_s: true, table: dg_TABLE });
	}
	function table_add_row(new_i, tree){
		for(var i = 0; i < new_i; i++){
			if(dg_TABLE.visible_y[i].bool == false){
				new_i++;
			}
		}
		dg_TABLE.tree.splice(new_i, 0, []);
		dg_TABLE.visible_y.splice(new_i, 0 , {bool: true, tree: tree, cc: 1, height: 0});
		tree.v_y = dg_TABLE.visible_y[new_i];

		for(var i = 0; i < dg_TABLE.visible_x.length; i++)
			dg_TABLE.tree[new_i][i] = { state: 0, obj: [null,null,null,null], text: '&nbsp;', a_s: true, table: dg_TABLE };
	}
	function splice_elem_in_tree(table, elem){
		var childs = table.tree;
		if(elem != null){
			if(elem.parent != null)
				childs = elem.parent.children;
		}
		for( i = 0; i < childs.length; i++){
			if(elem == childs[i]){
				childs.splice(i,1);
				break;
			}
		}
		if( childs.length == i && i > 0)
			childs.splice(0,1);
	}
	function add_cr_in_TABLE(){	
		dg_TABLE.y_length = dg_ROW_h.y_length;
		dg_TABLE.x_length = dg_COL_h.x_length;
		dg_TABLE.ar = [];
		
		for(i = 0; i < dg_TABLE.visible_y.length; i++){

			if(dg_TABLE.visible_y[i].bool){

				var c_i = dg_TABLE.ar.length;
				dg_TABLE.ar[c_i] = [];

				for(var j = 0 ; j < dg_TABLE.visible_x.length; j++){
					if(dg_TABLE.visible_x[j].bool){
						var c_j = dg_TABLE.ar[c_i].length;
						var obj = dg_TABLE.ar[c_i][c_j] = dg_TABLE.tree[i][j];

						obj.i = [c_i];
						obj.j = [c_j];
						obj.html = undefined;
					}					
				}
			}
		}
	}

	function get_text_width(node){
		node.text_width = [];
		var weight = 0;
		for(var i = 0; i < node.obj.text.length; i++){
			var cur_elem = char_width[node.obj.text.charCodeAt(i)];
			if(cur_elem == undefined)
				cur_elem = char_width[48];
			weight += cur_elem;
			node.text_width[i] = weight;
		}
	}
	/*-----------------------------CREATE-ARR-------------------------------*/
	function create_row( node, cc, lc){
		var ce = [];//current elements
		var ncc;//new current coll
			
		node.width = 0;		node.i = [];	
		node.height = 0;	node.j = [];

		get_text_width(node);

		if(node.visible){
			if(node.children.length != 0){
				ncc = lc - get_how_deep(node.children);
				for(var i = 0; i < node.children.length; i++)
					ce = ce.concat(create_row(node.children[i], ncc, lc));
			} else {
				ncc = lc;
				dg_ROW_h.ar[dg_ROW_h.cur_y_length] = new Array(dg_ROW_h.x_length);
				dg_ROW_h.cur_y_length += 1;
				ce[0] = dg_ROW_h.cur_y_length - 1;
			}
		
			for(var j = cc; j < ncc; j++){
				for( var k = 0; k < ce.length; k++)
					dg_ROW_h.ar[ce[k]][j] = node;
				node.width += dg_cs.width[j];
				node.j[node.j.length] = j;
			}

			for( var j = 0; j < ce.length; j++)
				node.height += dg_ts.height[ce[j]];
			node.i = ce;
		}

		return ce;
	}
	function create_col( node, cr, lr){ //cr-current row, lr - last row
		var ce = [];//current elements
		var ncr;//new current row

		node.width = 0;		node.i = [];
		node.height = 0;	node.j = [];

		get_text_width(node);

		if(node.visible){
			if(node.children.length != 0){	
				ncr = lr - get_how_deep(node.children); 
				for(var i = 0; i < node.children.length; i++)
					ce = ce.concat(create_col(node.children[i], ncr, lr));//current elements
			} else {
				ncr = lr;
				ce[0] = dg_COL_h.cur_x_length;
				dg_COL_h.cur_x_length += 1;				
			}
			
			for(var j = cr; j < ncr; j++){
				for( var k = 0; k < ce.length; k++)
					dg_COL_h.ar[j][ce[k]] = node;
				node.i[node.i.length] = j;
				node.height += dg_cs.height[j];
			}

			for( var j = 0; j < ce.length; j++)
				node.width += dg_ts.width[ce[j]];
			node.j = ce;
		}
		return ce;
	}

	/*-------------------------DISPLAY-TABLE----------------------*/
	function display( lp, tp, vp_w, vp_h){

		if(so != undefined){
			var t_coords = so.parent.cont.getBoundingClientRect();
			so.x = t_coords.left+ window.pageXOffset;
			so.y = t_coords.top + window.pageYOffset;	
		} 

		dg_TABLE.cont.style.display = 'none';

		var dg_scr_b = vp_h + tp;
		var dg_scr_t = tp;

		var dg_scr_r = vp_w + lp;
		var dg_scr_l = lp;

		var dg_col_disp_new = [];
		var dg_row_disp_new = [];

		for(i = 0; i < dg_ts.width.length; i++){
			if(((dg_ts.left[i] <= dg_scr_r )) && ((dg_ts.left[i] + dg_ts.width[i]) >= dg_scr_l))
				dg_col_disp_new[dg_col_disp_new.length] = i;
			else if(dg_col_disp_new.length > 0) break;
		}		
		for(i = 0; i < dg_ts.height.length; i++){
			if((dg_ts.top[i] <= dg_scr_b) &&  ((dg_ts.top[i] + dg_ts.height[i]) >= dg_scr_t ))
				dg_row_disp_new[dg_row_disp_new.length] = i;
			else if(dg_row_disp_new.length > 0) break;
		}
		/*------------------delete element----------------*/
		for(var i = 0; i < dg_col_disp.length; i++){
			for(var j = 0; j < dg_col_disp_new.length; j++){
				if(dg_col_disp[i] == dg_col_disp_new[j])
					break;
			}			
			if(j == dg_col_disp_new.length){
				for(var j = 0; j < dg_row_disp.length; j++)
					destroy_cell(dg_TABLE.ar[dg_row_disp[j]][dg_col_disp[i]]);

				for(var j = 0; j < dg_COL_h.y_length; j++){
					if( !(( dg_ts.left[dg_COL_h.ar[j][dg_col_disp[i]].j[0]] <= dg_scr_r) && ((dg_ts.left[dg_COL_h.ar[j][dg_col_disp[i]].j[0]] + dg_COL_h.ar[j][dg_col_disp[i]].width) >= dg_scr_l)))
						destroy_cell(dg_COL_h.ar[j][dg_col_disp[i]]);
				}
			}
		}
		for(var i = 0; i < dg_row_disp.length ; i++){
			for(var j = 0; j < dg_row_disp_new.length; j++){
				if(dg_row_disp[i] == dg_row_disp_new[j])
					break;
			}
			if(j == dg_row_disp_new.length){
				for(var j = 0; j < dg_col_disp.length; j++)
						destroy_cell(dg_TABLE.ar[dg_row_disp[i]][dg_col_disp[j]]);

				for(var j = 0; j < dg_ROW_h.x_length; j++){
					if( ! (( dg_ts.top[dg_ROW_h.ar[dg_row_disp[i]][j].i[0]] <= dg_scr_b) && ((dg_ts.top[dg_ROW_h.ar[dg_row_disp[i]][j].i[0]] + dg_ROW_h.ar[dg_row_disp[i]][j].height) >= dg_scr_t)))				
							destroy_cell(dg_ROW_h.ar[dg_row_disp[i]][j]);
				}
			}
		}		
		
		/*--------------------add element-----------------*/
		for(i = 0; i < dg_col_disp_new.length; i++){
			for(j = 0; j < dg_col_disp.length; j++){
				if(dg_col_disp[j] == dg_col_disp_new[i])
					break;				
			}
			if(j == dg_col_disp.length){
				for(j = 0; j < dg_row_disp_new.length; j++)
					create_cell(dg_TABLE, dg_row_disp_new[j], dg_col_disp_new[i]);
				for(j = 0; j < dg_COL_h.y_length; j++)
					create_cell(dg_COL_h, j, dg_col_disp_new[i]);
			}
		}
		for(var i = 0; i < dg_row_disp_new.length; i++){
			for(var j = 0; j < dg_row_disp.length; j++){
				if(dg_row_disp[j] == dg_row_disp_new[i])
					break;
			}
			if(j == dg_row_disp.length){
				for(var j = 0; j < dg_col_disp_new.length; j++)
					create_cell(dg_TABLE, dg_row_disp_new[i],dg_col_disp_new[j]);
				for( var j = 0; j < dg_ROW_h.x_length; j++)
					create_cell(dg_ROW_h, dg_row_disp_new[i], j);
			}
		}

		dg_row_disp = dg_row_disp_new;
		dg_col_disp = dg_col_disp_new;

		if(setting.move_headers)
			move_headers(dg_scr_l, dg_scr_r, dg_scr_t, dg_scr_b);

		dg_ROW_h.cont.style.top  = "-" + tp + "px";
		dg_COL_h.cont.style.left = "-" + lp + "px";
		dg_TABLE.cont.style.display = 'block';
	}

	function move_headers (le, ri, to, bo) {
		for(var j = 0; j < dg_ROW_h.x_length - 1; j++){
			for(var i = dg_row_disp[0]; i <= dg_row_disp[dg_row_disp.length - 1]; i++){

				var center = dg_ts.top[dg_ROW_h.ar[i][j].i[0]] + Math.round(dg_ROW_h.ar[i][j].height / 2);

				if(setting.text_orientation == 1){
					var half_text = Math.round( dg_ROW_h.ar[i][j].text_width[dg_ROW_h.ar[i][j].text_width.length - 1] / 2);
					if(dg_ROW_h.ar[i][j].html != undefined && (dg_ROW_h.ar[i][j].j[dg_ROW_h.ar[i][j].j.length - 1] + 1) != dg_ROW_h.x_length  && dg_ROW_h.ar[i][j].height > half_text*2 ){
						var target = dg_ROW_h.ar[i][j].html.children[0];
						var cell = dg_ROW_h.ar[i][j].html;
						
						if( (to > (center - half_text) || bo < (center + half_text)) && ((bo - to) > half_text*2) ){					

							if(to > (center - half_text)){

								target.style.textAlign = 'right';
								if(( dg_ROW_h.ar[i][j].height - (to - dg_ts.top[dg_ROW_h.ar[i][j].i[0]]) - 5) > (half_text*2 + 5) )
									target.style.width = (dg_ROW_h.ar[i][j].height - (to - dg_ts.top[dg_ROW_h.ar[i][j].i[0]]) - 5) + 'px';
								else
									target.style.width = (half_text*2 + 5) + 'px';							
															
							} else if( bo < (center + half_text) ) {						

								target.style.textAlign = 'left';

								if(( bo - dg_ts.top[dg_ROW_h.ar[i][j].i[0]]) > (half_text*2 + 5) ){
									target.style.width = (bo - dg_ts.top[dg_ROW_h.ar[i][j].i[0]] ) + 'px';
									target.style.top = (bo - dg_ts.top[dg_ROW_h.ar[i][j].i[0]] ) + 'px';
								} else {
									target.style.width	= (half_text*2 + 5) + 'px';
									target.style.top	= (half_text*2 + 5) + 'px';
								}
							} 
						} else {
							target.style.textAlign = 'center';
							target.style.top = (dg_ROW_h.ar[i][j].height ) + 'px';
							target.style.width = (dg_ROW_h.ar[i][j].height ) + 'px';
						}					 
					}
				} else {
					var target = dg_ROW_h.ar[i][j].html.children[0];
					var cell = dg_ROW_h.ar[i][j];
					var half_text =  Math.round(dbl_find_height(cell.width, cell.text_width)/2);
					if(cell.html != undefined && (cell.j[cell.j.length - 1] + 1) != dg_ROW_h.x_length  && cell.height > half_text*2 ){

						
						if( (to > (center - half_text) || bo < (center + half_text)) && ((bo - to) > half_text*2) ){
							cell.html.style.lineHeight	= '';	
							target.style.position		= 'absolute';
							target.style.width			= (cell.width - 5) + 'px';
							target.style.left			= '0';

							if(to > (center - half_text)){

								if(( cell.height - (to - dg_ts.top[cell.i[0]]) - 5) > (half_text*2 + 5) )
									target.style.top = ((to - dg_ts.top[cell.i[0]]) + 5) + 'px';
								else
									target.style.top = (cell.height - (half_text*2 + 5)) + 'px';

							} else if( bo < (center + half_text) ) {

								if(( bo - dg_ts.top[cell.i[0]]) > (half_text*2 + 5) )
									target.style.top = (bo - dg_ts.top[cell.i[0]] - half_text*2 ) + 'px';
								else
									target.style.top = '5px';
							} 
						} else {
							target.style.position	= '';
							target.style.top		= '';
							target.style.left		= '';
							target.style.width		= '';
							cell.html.style.lineHeight	=  (cell.height - 4) + 'px';
						}
					}
				}
				i = dg_ROW_h.ar[i][j].i[dg_ROW_h.ar[i][j].i.length - 1];
			}
		}

		for(var i = 0; i < dg_COL_h.y_length - 1; i++){
			for(var j = dg_col_disp[0]; j <= dg_col_disp[dg_col_disp.length - 1]; j++){

				var center = dg_ts.left[dg_COL_h.ar[i][j].j[0]] + Math.round(dg_COL_h.ar[i][j].width / 2);
				var half_text = Math.round( dg_COL_h.ar[i][j].text_width[dg_COL_h.ar[i][j].text_width.length - 1] / 2);

				if(dg_COL_h.ar[i][j].html != undefined && (dg_COL_h.ar[i][j].i[dg_COL_h.ar[i][j].i.length - 1] + 1) != dg_COL_h.y_length  && dg_COL_h.ar[i][j].width > half_text*2 ){
					var target = dg_COL_h.ar[i][j].html.children[0];

					if( le > (center - half_text) || ri < (center + half_text) ){

						if(le > (center - half_text)){

							target.style.textAlign = 'left';
							if(( dg_COL_h.ar[i][j].width - (le - dg_ts.left[dg_COL_h.ar[i][j].j[0]])) > (half_text*2 + 7) ){
								target.style.width = (dg_COL_h.ar[i][j].width - (le - dg_ts.left[dg_COL_h.ar[i][j].j[0]])) + 'px';
								target.style.left  = (le - dg_ts.left[dg_COL_h.ar[i][j].j[0]]) + 'px';
							} else {
								target.style.width = (half_text*2 + 7) + 'px';
								target.style.left  = (dg_COL_h.ar[i][j].width - half_text*2 - 7) + 'px';
							}
						
						} else if( ri < (center + half_text) ) {						

							target.style.textAlign = 'right';
							target.style.left = '0px';

							if(( ri - dg_ts.left[dg_COL_h.ar[i][j].j[0]] ) > (half_text * 2 + 7) )
								target.style.width = (ri - dg_ts.left[dg_COL_h.ar[i][j].j[0]] ) + 'px';
							else 
								target.style.width = (half_text*2 + 7) + 'px';
						} 
					} else {
						target.style.textAlign = 'center';
						target.style.left = '0px';
						target.style.width = (dg_COL_h.ar[i][j].width) + 'px';
					} 
				}
				j = dg_COL_h.ar[i][j].j[dg_COL_h.ar[i][j].j.length - 1] ;
			}
		}
	}	

	function create_html_object(obj_name, className, parent, type){
		obj = document.createElement(obj_name);

		obj.className = className;
		obj.style.type = type;
		parent.appendChild(obj);
		return obj;
	}

	function destroy_cell(elem){
		if( elem.html != undefined){

			elem.html.className = '';
			elem.html.style = '';
			elem.html.onmouseover = undefined;
			elem.html.id = '';

			if(elem.table == dg_ROW_h){
				elem.html.innerHTML = '';
				dg_ROW_h.empty_divs[dg_ROW_h.empty_divs.length] = elem.html;
			} else if (elem.table == dg_COL_h){
				elem.html.innerHTML = '';
				dg_COL_h.empty_divs[dg_COL_h.empty_divs.length] = elem.html;
			} else {
				elem.fragment = document.createDocumentFragment();
				for(var i = elem.html.children.length - 1; i >= 0; i--)
					elem.fragment.appendChild(elem.html.children[i]);
				dg_TABLE.empty_divs[dg_TABLE.empty_divs.length] = elem.html;
			}

			elem.html = undefined;			
		}
	}


	/*---------------------------------CREATE CELL----------------------------*/

	function create_cell(table, index_i, index_j){
		if( table.ar[index_i][index_j].html == undefined){

			var cell = table.ar[index_i][index_j];
			var obj;

			if(table.empty_divs.length == 0){
				obj = document.createElement("div");
				table.cont.appendChild(obj);
			} else {
				obj = table.empty_divs[0];
				table.empty_divs.splice(0,1);
			}
			obj.className = cell.table.cn[cell.state];
			
			if(table == dg_ROW_h){

				obj.style.cssText = 'height: ' + (cell.height) + 'px; \
								width:' + (cell.width) + 'px; \
								left: ' + (dg_cs.left[table.ar[index_i][index_j].j[0]] ) + 'px; \
								top: ' + (dg_ts.top[table.ar[index_i][index_j].i[0]] ) + 'px; \
								line-height: ' + (cell.height - 4) + 'px;';

				if( cell.j[cell.j.length - 1] == (dg_ROW_h.x_length - 1)){
					obj.style.textAlign = 'left';
					if(ofs_col.cell == cell){
						obj.innerHTML = "<span class='dg_text_header' style='width: Calc(100% - " + (setting.font_size + 6) + "px);'>" + cut_text(cell.obj.text, cell.width - setting.font_size - 2, cell.height, cell.text_width) 
								  	  + "</span><span class='dg_text_header' style='width: " + (setting.font_size + 2) + "px; margin: 0; color: " + ofs_col.color + "'>" + cell.sort_style + "</span>";
					} else
						obj.innerHTML = "<span class='dg_text_header' style='width: Calc(100% - 4px);'>" + cut_text(cell.obj.text, cell.width, cell.height, cell.text_width) + "</span>";
				} else if(setting.text_orientation){
					obj.innerHTML = "<div class='vert_text' style='height:" + (cell.width - 1) + "px; width: " + (cell.height - 4) + "px; top: " + (cell.height - 2) + "px; line-height: " + (cell.width - 1) + "px'><span class='dg_text_header' style='width: 100%'>" + cut_text(cell.obj.text, cell.height - 3, cell.width, cell.text_width) + "</span></div>";
				} else {
					obj.style.textAlign = 'center';
					obj.innerHTML = "<span class = 'dg_text_header' >" + cut_text(cell.obj.text, cell.width, cell.height, cell.text_width) + "</span>";					
				}
				
			} else if (table == dg_COL_h){
				obj.style.cssText = 'height: ' + (cell.height) + 'px; \
								width:' + (cell.width) + 'px; \
								left: ' + (dg_ts.left[table.ar[index_i][index_j].j[0]] ) + 'px; \
								top: ' + (dg_cs.top[table.ar[index_i][index_j].i[0]] ) + 'px; \
								line-height: ' + (cell.height - 4) + 'px;';

				if(ofs_row.cell == cell){
					obj.innerHTML = "<div style='position: absolute; height:" + (cell.height) + "px; width: " + (cell.width) + "px; line-height: " + (cell.height) + "px'>" 
								  + "<span class='dg_text_header' style='width: Calc(100% - " + (setting.font_size + 6) + "px)'>" + cut_text(cell.obj.text, cell.width - setting.font_size - 2, cell.height, cell.text_width) 
								  + "</span><span class='dg_text_header' style='width: " + (setting.font_size + 2) + "px; right: 0; margin: 0; color: " + ofs_row.color + "'>" + cell.sort_style + "</span></div>";
				} else {
					obj.innerHTML = "<div style='position: absolute; height:" + (cell.height ) + "px; width: " + (cell.width ) + "px; line-height: " + (cell.height ) + "px'>" 
								  + "<span class='dg_text_header' style=''>" + cut_text(cell.obj.text, cell.width, cell.height, cell.text_width) + "</span></div>";
				}
					
			} else if (table == dg_TABLE) {
				obj.style.cssText = 'height: ' + (dg_ts.height[index_i]) + 'px; \
									width:' + (dg_ts.width[index_j]) + 'px; \
									left: ' + (dg_ts.left[table.ar[index_i][index_j].j[0]] ) + 'px; \
									top: ' + (dg_ts.top[table.ar[index_i][index_j].i[0]] ) + 'px;';
				obj.appendChild(cell.fragment);
				obj.onmouseover = so_onmouseover;
			}

			if (table == dg_ROW_h || table == dg_COL_h) {
				var dgr = create_html_object("div", "dg_c_resize", obj);
				var dgc = create_html_object("div", "dg_r_resize", obj);
				dgr.ondblclick = dblclick_x;
				dgr.onmousedown = mouse_down_col_resize;
				dgc.onmousedown = mouse_down_row_resize;
				dgc.ondblclick = dblclick_y;
			}

			cell.html = obj; 
			obj.array = cell;

			return obj;
		}
	}

	function create_ts_cs(){
		function generate_style_sheet(position, size, count, default_size, default_table){
			for(var i = 0; i < count; i++){
				if(default_table.length >= count)				size[i] = default_table[default_table.length - count + i];
				else if( (default_table.length + i) < count)	size[i] = default_size;
				else											size[i] = default_table[default_table.length - count + i];
		
				if(i != 0)	position[i] = position[i - 1] + size[i - 1];
				else		position[i] = 0;
			}
		}

		function generate_style_sheet_simple(position, size, count, default_size, default_table){
			for(var i = 0; i < count; i++){
				if(default_table.length > i) {
					size[i] = default_table[i];
					if(i != 0)				position[i] = position[i - 1] + size[i - 1];
					else 					position[i] = 0;
				} else {
					size[i] = default_size;
					if(i != 0)				position[i] = position[i - 1] + size[i - 1];
					else 					position[i] = 0;
				}
			}
		}
		dg_TABLE.v_x = [];
		for(var i = 0; i < dg_TABLE.visible_x.length; i++){
			if(dg_TABLE.visible_x[i].bool)
				dg_TABLE.v_x[dg_TABLE.v_x.length] = dg_TABLE.visible_x[i];
		}
		dg_TABLE.v_y = [];
		for(var i = 0; i < dg_TABLE.visible_y.length; i++){
			if(dg_TABLE.visible_y[i].bool)
				dg_TABLE.v_y[dg_TABLE.v_y.length] = dg_TABLE.visible_y[i];
		}

		if(setting.auto_width){			
			for(var i = 0; i < dg_TABLE.v_x.length; i++){
				if(dg_TABLE.v_x[i].width > default_dg_ts.width[i] || default_dg_ts.width[i] == undefined)
					default_dg_ts.width[i] = dg_TABLE.v_x[i].width;
			}
		}

		dg_ts  = { top: [], left: [], width: [], height: []}; dg_cs  = { top: [], left: [], width: [], height: []};

		generate_style_sheet(dg_cs.left, dg_cs.width, dg_ROW_h.x_length, default_width, default_dg_cs.width);
		generate_style_sheet(dg_cs.top, dg_cs.height, dg_COL_h.y_length, default_height, default_dg_cs.height);	
		generate_style_sheet_simple(dg_ts.left, dg_ts.width, dg_COL_h.x_length, default_width, default_dg_ts.width);
		generate_style_sheet_simple(dg_ts.top, dg_ts.height, dg_ROW_h.y_length, default_height, default_dg_ts.height);

		if(dg_ts.width.length > default_dg_ts.width.length)
			default_dg_ts.width = dg_ts.width.concat();
		if(dg_ts.height.length > default_dg_ts.height.length)
			default_dg_ts.height = dg_ts.height.concat();
		if(dg_cs.width.length > default_dg_cs.width.length)
			default_dg_cs.width = dg_cs.width.concat();
		if(dg_cs.height.length > default_dg_cs.height.length)
			default_dg_cs.height = dg_cs.height.concat();
	}

	function recalc_cells(){
		for(var i = 0; i < dg_TABLE.v_y.length; i++){
			dg_TABLE.v_y[i].cc = 0;
			dg_TABLE.v_y[i].d_p = [false, false, false, false];
		}

		for(var i = 0; i < dg_TABLE.ar.length; i++){
			for(var j = 0; j < dg_TABLE.ar[i].length; j++){
				var array = dg_TABLE.ar[i][j].obj;
				
				var vo = 0;
				for(var k = 0; k < array.length; k++){
					if(setting.displayed_types[k] && array[k] != undefined){
						vo++;
						dg_TABLE.v_y[i].d_p[k]= true;
					}
				}
				if( vo == 0 ) vo = 1;

				if( vo > dg_TABLE.v_y[i].cc ){

					dg_ts.height[i] = (vo * default_minimum_height > dg_TABLE.v_y[i].height)? vo * default_minimum_height : dg_TABLE.v_y[i].height;
					default_dg_ts.height[i] = dg_ts.height[i];
					dg_TABLE.v_y[i].cc = vo;

					for(var k = 1; k < dg_ts.top.length; k++)
						dg_ts.top[k] = dg_ts.top[k-1] + dg_ts.height[k-1];

					for(var k = 0; k < dg_ROW_h.ar[0].length; k++ ){
							
						dg_ROW_h.ar[i][k].height = 0;
						for(s = 0; s < dg_ROW_h.ar[i][k].i.length; s++)
							dg_ROW_h.ar[i][k].height += dg_ts.height[dg_ROW_h.ar[i][k].i[s]];
					}
				}

				dg_TABLE.ar[i][j].text = '';
				dg_TABLE.ar[i][j].fragment = document.createDocumentFragment();
				var n_v = 0;

				for(var k = 0; k < array.length; k++){
					if(setting.displayed_types[k] && array[k] != undefined){

						var text = '';
						if(array[k].text != undefined) {
							if(!(setting.hide_zero && array[k].text == 0))
								text = (Math.round(array[k].text * Math.pow(10, setting.round_types[array[k].type]))/ Math.pow(10, setting.round_types[array[k].type]) + '').replace(/\./g, setting.decimal_separator) + setting.units_types[k];
						} else { 
							if(setting.zero_is_empty)
								text = '0' + setting.units_types[k];
						}

						var obj = create_html_object('div', 'dg_under_cell', dg_TABLE.ar[i][j].fragment);
						obj.style.cssText = 'top: ' + (Math.floor((1000 * n_v)/vo))/10 + '%; bottom: ' + (Math.floor((1000 * (vo - 1 - n_v) )/vo))/10 + '%; background:' + setting.color_types[k] + ';';
						obj.innerHTML = text;
						n_v++;
					}
				}
				if(dg_TABLE.ar[i][j].fragment.childNodes.length == 0 && dg_TABLE.ar[i][j].obj[0] != undefined){

					var text = '';
					if(dg_TABLE.ar[i][j].obj[0].text != undefined)	{
						if(!(setting.hide_zero && dg_TABLE.ar[i][j].obj[0].text == 0))
							text = (Math.round(dg_TABLE.ar[i][j].obj[0].text * Math.pow(10, setting.round_types[array[0].type]))/ Math.pow(10, setting.round_types[array[0].type]) + '').replace(/\./g, setting.decimal_separator) + setting.units_types[0];						
					} else { 
						if(setting.zero_is_empty)
							text = '0' + setting.units_types[0];
					}	
					var obj = create_html_object('div', 'dg_under_cell', dg_TABLE.ar[i][j].fragment);
					obj.style.cssText = 'top: 0; bottom: 0; background: #fff;';
					obj.innerHTML = text;
				} else if(dg_TABLE.ar[i][j].fragment.childNodes.length == 0){
					var obj = create_html_object('div', 'dg_under_cell', dg_TABLE.ar[i][j].fragment);
					obj.style.cssText = 'top: 0; bottom: 0; background: #fff;';
				}
			
			}
		}
		generate_styles();
	}

	function generate_styles(){
		for(var i = 0; i < dg_col_disp.length; i++){
			for(var j = 0; j < dg_COL_h.y_length; j++)
				destroy_cell(dg_COL_h.ar[j][dg_col_disp[i]]);
			
			for(var j = 0; j < dg_row_disp.length; j++)
				destroy_cell(dg_TABLE.ar[dg_row_disp[j]][dg_col_disp[i]]);
		}
		for(var i = 0; i < dg_row_disp.length; i++){
			for(var j = 0; j < dg_ROW_h.x_length; j++)
				destroy_cell(dg_ROW_h.ar[dg_row_disp[i]][j]);
		}

		dg_col_disp = [];
		dg_row_disp = [];

		var container_h = dg_CORNER.parent.clientHeight;
		var container_w = dg_CORNER.parent.clientWidth;

		if(container_h == 0 || container_w == 0) return;

		var x_coord = (isNaN(dg_cs.width[dg_cs.width.length - 1] + dg_cs.left[dg_cs.width.length - 1]))? 100 : dg_cs.width[dg_cs.width.length - 1] + dg_cs.left[dg_cs.width.length - 1];
		var y_coord = (isNaN(dg_cs.height[dg_cs.height.length - 1] + dg_cs.top[dg_cs.height.length - 1]))? 70 : dg_cs.height[dg_cs.height.length - 1] + dg_cs.top[dg_cs.height.length - 1];


		dg_ROW_h.cont.style.width	= dg_ROW_h.sc.style.width  = (x_coord  + 3) + "px";
		dg_COL_h.cont.style.height	= dg_COL_h.sc.style.height = (y_coord  + 3) + "px";
		dg_COL_h.sc.style.left = (x_coord) + "px";	dg_TABLE.sc.style.left = (x_coord - 1) + "px";
		dg_ROW_h.sc.style.top  = (y_coord) + "px";	dg_TABLE.sc.style.top  = (y_coord - 1) + "px";

		dg_TABLE.custum_scroll.set_viewport_size( (container_w - x_coord), (container_h - y_coord));
		dg_ROW_h.cont.style.height	= (isNaN(dg_ts.height[dg_ts.height.length - 1] + dg_ts.top[dg_ts.top.length - 1]))? (0 + "px"): ((dg_ts.height[dg_ts.height.length - 1] + dg_ts.top[dg_ts.top.length - 1] ) + "px");	
		dg_COL_h.cont.style.width 	= (isNaN(dg_ts.width[dg_ts.width.length - 1] + dg_ts.left[dg_ts.left.length - 1]))? (0 + "px"): ((dg_ts.width[dg_ts.width.length - 1] + dg_ts.left[dg_ts.left.length - 1] ) + "px");

		dg_TABLE.custum_scroll.set_container_size((isNaN(dg_ts.width[dg_ts.width.length - 1] + dg_ts.left[dg_ts.left.length - 1]))? (0): (dg_ts.width[dg_ts.width.length - 1] + dg_ts.left[dg_ts.left.length - 1] ),
												  (isNaN(dg_ts.height[dg_ts.height.length - 1] + dg_ts.top[dg_ts.top.length - 1]))? (0): (dg_ts.height[dg_ts.height.length - 1] + dg_ts.top[dg_ts.top.length - 1] ),
												  dg_ts.left, dg_ts.top);

		dg_CORNER.cont.style.width	= (x_coord ) + "px";
		dg_CORNER.cont.style.height = (y_coord ) + "px";

		dg_TABLE.custum_scroll.change_lp(0);
		dg_TABLE.custum_scroll.change_tp(0);

		display(dg_TABLE.custum_scroll.get_lp(), dg_TABLE.custum_scroll.get_tp(), (container_w - x_coord - 18), (container_h - y_coord - 18));
	}

	function get_cell_height(node, width){
		var row_count = 1;
		var index = 0;
		var width_differ = 0;

		for(var i = 0; i < row_count; i++){
			while( (text_width[index] - width_differ) < (width - 8)){
				index++;
			}
			width_differ = text_width[index - 1];
		}
		return index - 1;
	}

	function cut_text(text, width, height, text_width){

		function get_index(text, width, height, text_width){
			var row_count = Math.floor((height - 3)/char_height);
			var index = 0;
			var width_differ = 0;
	
			for(var i = 0; i < row_count; i++){
				while( (text_width[index] - width_differ) < (width - 8)){
					index++;
				}
				width_differ = text_width[index - 1];
			}
			return index - 1;
		}

		var current_width = (width - 8) * Math.floor((height - 3)/char_height);


		if(current_width < text_width[text_width.length - 1]){
			var index = get_index(text, width, height, text_width);
			if(text_width[index] - text_width[index - 1] > char_width[38])
				index--;
			else
				index -= 2;


			return text.substring(0, index) + "&hellip;";
		} else
			return text; 
	}

	function get_how_deep(tree){		
		var deep_lvl = 0; var current_lvl = 0;

		for(var i = 0 ; i < tree.length; i++){
			if(tree[i].children){
				if(tree[i].children.length != 0)
					current_lvl = get_how_deep(tree[i].children) ;
			}
			if(deep_lvl < current_lvl)
				deep_lvl = current_lvl;
		}
		if(tree.length != 0)
			deep_lvl += 1;
		return deep_lvl;
	}
	function get_children_count(tree){		
		var count = 0;
		for(var i = 0 ; i < tree.length; i++){
			if(tree[i].children.length != 0)
				count += get_children_count(tree[i].children);
			else if(tree[i].visible)
				count += 1;
		}
		return count;
	}
	function get_font_size(){
		dg_CORNER.style.innerHTML = '.dg_cell { font-size: ' + setting.font_size + 'px;}';
		var hidden_div = create_html_object('span', 'dg_cell dg_text_header dg_hidden_block', document.body);
		
		for(var i = 0; i < 256; i++){
			hidden_div.innerHTML = String.fromCharCode(i);
			char_width[i] = hidden_div.clientWidth + 0.3;
		} 
		hidden_div.innerHTML = "A B";
		char_width[32] = hidden_div.clientWidth - char_width[65] - char_width[66] + 0.3;
		char_height = hidden_div.clientHeight;
		default_minimum_height = (hidden_div.clientHeight + 4); 

		for(var i = 1024; i < 1106; i++){
			hidden_div.innerHTML = String.fromCharCode(i);
			char_width[i] = hidden_div.clientWidth + 0.3;
		} 
		hidden_div.parentNode.removeChild(hidden_div);
	}

	function dbl_find_width(height, text_width){
		var row_count = Math.floor((height - 3)/char_height);
		var width = Math.round(text_width[text_width.length - 1]/row_count) + 6;

		do{
			width += 2;
			var index = 0;
			var width_differ = 0;
			for(var i = 0; i < row_count; i++){
				while( (text_width[index] - width_differ) < (width - 8)){
					index++;
				}
				width_differ = text_width[index - 1];
			}
		} while (index < text_width.length)
		return width; 
	}
	function dbl_find_height(width, text_width){
		var height = 0;
		var index = 0;
		var width_differ = 0;

		while (index < text_width.length) {
			while( (text_width[index] - width_differ) < (width - 8)){
				index++;
			}
			width_differ = text_width[index - 1];
			height += char_height + 4;
		}
		return height; 
	}

	function dblclick_x(e){
		if(e.which != 1) return;
		var target = closest(e.target, 'dg_cell').array;
		ro = {elem: target, event: event, parent: target.parent };
		var width;

		if(target.table == dg_ROW_h && target.j[target.j.length - 1] != dg_ROW_h.x_length - 1)
			width = dbl_find_height(target.height, target.text_width);
		else
			width = dbl_find_width( target.height, target.text_width);

		if(target.table == dg_COL_h){
			var new_width = (Math.floor(Math.log(dg_TABLE.v_x[target.j[0]].max)/Math.log(10) + 1) + tools.max_type(dg_TABLE.v_x[target.j[0]].d_p))*char_width[48] + setting.font_size;
			if(width < new_width)
				width = new_width;
		}
		if(target == ofs_col.cell || target == ofs_row.cell)
			width += setting.font_size + 2;


		coef = width/target.width;

		if(target.table == dg_ROW_h)
			resize_elements_on_vertical(dg_cs, coef, default_dg_cs);
		else
			resize_elements_on_vertical(dg_ts, coef, default_dg_ts);

		ro = {};
		generate_styles();
	}
	function dblclick_y(e){
		if(e.which != 1) return;
		var target = closest(e.target, 'dg_cell').array;
		ro = {elem: target, event: event, parent: target.parent };
		var height;

		if(target.table == dg_ROW_h && target.j[target.j.length - 1] != dg_ROW_h.x_length - 1)
			height = dbl_find_width( target.width, target.text_width);
		else
			height = dbl_find_height(target.width, target.text_width);

		coef = height/target.height;

		if(target.table == dg_ROW_h)
			resize_elements_on_horizontal(dg_ts, coef, default_dg_ts);
		else
			resize_elements_on_horizontal(dg_cs, coef, default_dg_cs);

		ro = {};
		generate_styles();
	}

	function dblclick_for_y_resize(e){
		var target = closest(e.target, "dg_cell").array;
		if(target.i.length > 1 || e.which != 1) return;

		var test_height = dbl_find_height(target.width, target.text_width);
		var new_height = char_height*Math.floor(target.text_width[target.text_width.length - 1]/target.width + 1) + 8;
		var ts = dg_cs;	var dts = default_dg_cs
		
		if(target.table == dg_ROW_h){
			ts = dg_ts;	dts = default_dg_ts;

			if(default_minimum_height*dg_TABLE.v_y[target.i[0]].cc > new_height)
				new_height = default_minimum_height*dg_TABLE.v_y[target.i[0]].cc;
		} 
		ts.height[target.i[0]] = new_height;
		dts.height = ts.height.concat();
		for(var i = 1; i < ts.height.length; i++)
			ts.top[i] = ts.top[i - 1] + ts.height[i - 1];
		reposition_elements_on_gorizontal(target, ts);		
		generate_styles();
	}


	function dblclick_for_x_resize(e){
		var target = closest(e.target, "dg_cell").array;
		if(target.j.length > 1 || e.which != 1) return;

		var test_width = dbl_find_width(target.height, target.text_width);
		var new_width = (target.text_width[target.text_width.length - 1]/Math.floor(target.height/(char_height+2))) + 16;
		var ts = dg_cs;	var dts = default_dg_cs

		if(target.table == dg_COL_h){
			ts = dg_ts;	dts = default_dg_ts;

			var width = (Math.floor(Math.log(dg_TABLE.v_x[target.j[0]].max)/Math.log(10) + 1) + tools.max_type(dg_TABLE.v_x[target.j[0]].d_p))*char_width[48] + setting.font_size;
			if(width > new_width)
				new_width = width;
		} 
		ts.width[target.j[0]] = new_width;
		dts.width = ts.width.concat();
		for(var i = 1; i < ts.width.length; i++)
			ts.left[i] = ts.left[i - 1] + ts.width[i - 1];
		reposition_elements_on_vertical(target, ts);		
		generate_styles();
	}
	/*--------------------------------------------------------------------------------------*/
	/*--------------------------------------ROW-RESIZE--------------------------------------*/
	/*--------------------------------------mouse-down--------------------------------------*/
	function mouse_down_row_resize(event){
		if(event.which != 1) return;
	
		var target 	 = closest( event.target, "dg_cell").array;

		var t_coords = target.html.getBoundingClientRect();
		var p_coords = dg_CORNER.parent.getBoundingClientRect();

		if((target.state == 2 || target.state == 4) && target.table == dg_ROW_h && target.j[target.j.length - 1] == (dg_ROW_h.x_length - 1) ){
				
			var new_target = {state: target.state, height: target.height, i: target.i, j: [], table: target.table};
			new_target.j[0] = target.j[target.j.length - 1];

			for(var i = 0; i < selected_items.row.length; i++){
				if(selected_items.row[i].j[selected_items.row[i].j.length - 1] == new_target.j[0])
					new_target.i = new_target.i.concat(selected_items.row[i].i);
			}
			target = new_target;
		}
		
		ro = { y: (event.pageY - p_coords.top), top: p_coords.top, parent: target.table, elem: target, event: event};
			
		window.addEventListener("mousemove", mouse_move_row_resize);
		window.addEventListener("mouseup", mouse_up_row_resize);
	}
	/*--------------------------------------mouse-move--------------------------------------*/
	function mouse_move_row_resize(e){
		
		if( typeof ro.parent != "undefined"){
			if(Math.abs(ro.event.pageY - e.pageY) >= 3 && typeof ro.r_line == "undefined"){

				ro.r_line = create_line("dg_resize_g_line");
				dg_CORNER.parent.style.cursor = "s-resize";
			} 
			if(ro.r_line != undefined) 
				ro.r_line.style.top = (e.pageY - ro.top) + "px";
		}
	}
	/*---------------------------------------mouse-up---------------------------------------*/
	function mouse_up_row_resize(e){
		
		if(ro.r_line){
			ro.r_line.destroy();

			if((ro.elem.state == 2 || ro.elem.state == 4) && ro.parent == dg_ROW_h && ro.elem.j[ro.elem.j.length - 1] == (dg_ROW_h.x_length - 1) ){
				var new_height = ro.elem.height + (e.pageY - ro.top - ro.y);
				if(new_height < default_minimum_height * dg_TABLE.visible_y[ro.elem.i[0]].cc) new_height = default_minimum_height * dg_TABLE.visible_y[ro.elem.i[0]].cc;

				for(i = 0; i < ro.elem.i.length; i++){
					dg_ts.height[ro.elem.i[i]] = new_height;
				}
				default_dg_ts.height = dg_ts.height.concat();

				for(i = 1; i < dg_ts.top.length; i++)
					dg_ts.top[i] = dg_ts.top[i-1] + dg_ts.height[i-1];

				for(var i = 0; i < ro.elem.i.length; i++)
					dg_TABLE.v_y[ro.elem.i[i]].height = dg_ts.height[ro.elem.i[i]];
				
				reposition_elements_on_gorizontal(ro.elem, dg_ts);

			} else {
				var coef = ((e.pageY - ro.top - ro.y) + ro.elem.height)/ro.elem.height;

				if(ro.parent == dg_COL_h){
					resize_elements_on_horizontal(dg_cs, coef, default_dg_cs);
				} else {
					resize_elements_on_horizontal(dg_ts, coef, default_dg_ts);

					for(var i = 0; i < ro.elem.i.length; i++)
						dg_TABLE.v_y[ro.elem.i[i]].height = dg_ts.height[ro.elem.i[i]];					
				}
			}

			dg_CORNER.parent.style.cursor = "";							
			generate_styles();
		}	

		window.removeEventListener("mousemove", mouse_move_row_resize);
		window.removeEventListener("mouseup", mouse_up_row_resize);		
		ro = {};
	}

	/*--------------------------------------resize-elems--------------------------------------*/
	function resize_elements_on_horizontal(stylesheet, coef, def_stylesheet) {
		
		for(i = 0; i < ro.elem.i.length; i++){
			if(stylesheet == dg_ts)
				stylesheet.height[ro.elem.i[i]] = change_size(stylesheet.height[ro.elem.i[i]], coef, default_minimum_height * dg_TABLE.visible_y[ro.elem.i[i]].cc);				
			else
				stylesheet.height[ro.elem.i[i]] = change_size(stylesheet.height[ro.elem.i[i]], coef, default_minimum_height);
		}
		def_stylesheet.height = stylesheet.height.concat();

		for(i = 1; i < stylesheet.top.length; i++)
			stylesheet.top[i] = stylesheet.top[i-1] + stylesheet.height[i-1];

		reposition_elements_on_gorizontal(ro.elem, stylesheet);
	}

	function reposition_elements_on_gorizontal(elem, stylesheet) {
		for(i = 0; i < elem.table.ar[0].length; i++ ){
			for(j = 0; j < elem.i.length; j++){
				
				if(elem.table.ar[elem.i[j]][i].height !== 0){
					elem.table.ar[elem.i[j]][i].height = 0;

					for(k = 0; k < elem.table.ar[elem.i[j]][i].i.length; k++)
						elem.table.ar[elem.i[j]][i].height += stylesheet.height[elem.table.ar[elem.i[j]][i].i[k]];					
				}
			}
		}
	}
	/*--------------------------------------------------------------------------------------*/
	/*--------------------------------------COL-RESIZE--------------------------------------*/
	/*--------------------------------------mouse-down--------------------------------------*/
	function mouse_down_col_resize(e){

		if(e.which != 1) return;
		
		var target = closest(e.target, "dg_cell");
		var parent_header= closest( e.target, "dg_sc");
		
		var t_coords = target.getBoundingClientRect();
		var p_coords = dg_CORNER.parent.getBoundingClientRect();
		
		target = target.array;

		if((target.state == 2 || target.state == 4) && parent_header == dg_COL_h.cont && target.i[target.i.length - 1] == (dg_COL_h.y_length - 1) ){
				
			var new_target = {state: target.state, width: target.width, j: target.j, i: [], table: dg_COL_h};
			new_target.i[0] = target.i[target.i.length - 1];
			
			for(var i = 0; i < selected_items.col.length; i++){
				if(selected_items.col[i].i[selected_items.col[i].i.length - 1] == new_target.i[0])
					new_target.j = new_target.j.concat(selected_items.col[i].j);
			}
			target = new_target;
		} 

		ro = { x: (t_coords.right - p_coords.left), left: p_coords.left, parent: parent_header, elem: target, event: e};

		window.addEventListener("mousemove", mouse_move_col_resize);
		window.addEventListener("mouseup", mouse_up_col_resize);
	}
	/*-------------------------------------mouse-move---------------------------------------*/
	function mouse_move_col_resize(e){

		if( typeof ro.parent != "undefined"){
			if(Math.abs(ro.event.pageX - e.pageX) >= 3 && typeof ro.r_line == "undefined"){

				ro.r_line = create_line("dg_resize_v_line");
				dg_CORNER.parent.style.cursor = "e-resize";
			}
			if( ro.r_line != undefined)
				ro.r_line.style.left = (e.pageX - ro.left) + "px";
		}
	}
	/*-------------------------------------mouse-up-----------------------------------------*/
	function mouse_up_col_resize(e){
		if(ro.r_line){
			ro.r_line.destroy();

			if((ro.elem.state == 2 || ro.elem.state == 4) && ro.parent == dg_COL_h.cont && ro.elem.i[ro.elem.i.length - 1] == (dg_COL_h.y_length - 1) ){
				var new_width = (e.pageX - ro.left - ro.x) + ro.elem.width;
				if(new_width < 40 ) new_width = 40;

				for(i = 0; i < ro.elem.j.length; i++)
					dg_ts.width[ro.elem.j[i]] = new_width;
				for(i = 1; i < dg_ts.left.length; i++)
					dg_ts.left[i] = dg_ts.left[i-1] + dg_ts.width[i-1];
				
				default_dg_ts.width = dg_ts.width.concat();
				reposition_elements_on_vertical(ro.elem, dg_ts);
			} else {
				if(ro.parent == dg_COL_h.cont)
					resize_elements_on_vertical(dg_ts,  ((e.pageX - ro.left - ro.x) + ro.elem.width) / ro.elem.width, default_dg_ts);
				else 
					resize_elements_on_vertical(dg_cs,  ((e.pageX - ro.left - ro.x) + ro.elem.width) / ro.elem.width, default_dg_cs);
			}

			dg_CORNER.parent.style.cursor = "";
			generate_styles();
		}	

		window.removeEventListener("mousemove", mouse_move_col_resize);
		window.removeEventListener("mouseup", mouse_up_col_resize);

		ro = {};
	}
	/*--------------------------------------resize-elems------------------------------------*/
	function resize_elements_on_vertical(stylesheet, coef, def_stylesheet){
		
		for(i = 0; i < ro.elem.j.length; i++){
			stylesheet.width[ro.elem.j[i]] = change_size(stylesheet.width[ro.elem.j[i]], coef, 40);
		}
		def_stylesheet.width = stylesheet.width.concat();

		for(i = 1; i < stylesheet.left.length; i++)
			stylesheet.left[i] = stylesheet.left[i-1] + stylesheet.width[i-1];

		reposition_elements_on_vertical(ro.elem, stylesheet);
	}

	function reposition_elements_on_vertical(elem, stylesheet){		
		for(i = 0; i < elem.table.ar.length; i++ ){
			for(j = 0; j < elem.j.length; j++){
				if(elem.table.ar[i][elem.j[j]].width != 0){
					elem.table.ar[i][elem.j[j]].width = 0;
					for(k = 0; k < elem.table.ar[i][elem.j[j]].j.length; k++)
						elem.table.ar[i][elem.j[j]].width += stylesheet.width[elem.table.ar[i][elem.j[j]].j[k]];					
				}
			}
		}
	}

	/*--------------------------------------------------------------------------------------*/
	/*-------------------------------corner-resize-element----------------------------------*/
	function mouse_down_cor_col_resize (event){

		if(event.which != 1 || dg_ROW_h.y_length == 0 || dg_COL_h.x_length == 0 ) return;
		var p_coords = dg_CORNER.parent.getBoundingClientRect();
		var elem = { j: [], width: dg_CORNER.cont.clientWidth, table: dg_ROW_h};
		
		for(var i = 0; i < dg_ROW_h.x_length; i++)
			elem.j[i] = i;

		ro = { x: (dg_CORNER.cont.getBoundingClientRect().right - p_coords.left), left: p_coords.left, parent: dg_ROW_h, elem: elem, event: event};
		window.addEventListener("mousemove", mouse_move_col_resize);
		window.addEventListener("mouseup", mouse_up_col_resize);	
		return false;
	}

	function mouse_down_cor_row_resize(event) {
		
		if(event.which != 1 ||  dg_ROW_h.y_length == 0 || dg_COL_h.x_length == 0 ) return;
		var p_coords = dg_CORNER.parent.getBoundingClientRect();
		var elem = { i: [], height: dg_CORNER.cont.clientHeight, table: dg_COL_h};

		for(var i = 0; i < dg_COL_h.y_length; i++)
			elem.i[i] = i;

		ro = { y: ( dg_CORNER.cont.getBoundingClientRect().bottom - p_coords.top), top: p_coords.top, parent: dg_COL_h, elem: elem, event: event};
		window.addEventListener("mousemove", mouse_move_row_resize);
		window.addEventListener("mouseup", mouse_up_row_resize);	
		return false;
	}


	/*-------------------------------create-line-for-resize---------------------------------*/
	function create_line(className){		
		var r_line = document.createElement("div");		
		dg_CORNER.parent.appendChild(r_line);
		r_line.className = className;		
		r_line.destroy = function() { r_line.parentNode.removeChild(r_line); };		
		return r_line;
	}
	
	/*--------------------------------------------------------------------------------------*/
	/*------------------------------------SELECT-HEADER-------------------------------------*/
	/*-------------------------------------mouse-down---------------------------------------*/
	function ch_mouse_down(event) {	
		if(event.which != 1 || dg_TABLE.x_length == 0 || dg_TABLE.y_length == 0 || closest(event.target,"dg_c_resize") || closest(event.target,"dg_r_resize")) return;

		var target = closest(event.target, 'dg_cell').array;

		if( (target.table == dg_COL_h) && ( (target == selected_items.col[0] && selected_items.col.length == 1) || (target == ofs_col.cell) ) )
			sorted_line = target;
		if( (target.table == dg_ROW_h) && ( (target == selected_items.row[0] && selected_items.row.length == 1) || (target == ofs_row.cell) ) )
			sorted_line = target;

		if(!event.ctrlKey)	clear_all();

		if(closest(event.target,"dg_sc") == dg_ROW_h.cont)
			select_area_create( event, dg_cs, dg_ts, dg_ROW_h);
		else
			select_area_create( event, dg_ts, dg_cs, dg_COL_h);

		window.addEventListener("mousemove", ch_mouse_move);
		window.addEventListener("mouseup", ch_mouse_up);
		ch_mouse_move(event);
	}
	/*-------------------------------------mouse-move---------------------------------------*/
	function ch_mouse_move(event){	
		if(so.parent == dg_ROW_h )
			mouse_move_in_ROW(event);
		else
			mouse_move_in_COL(event);
	}
	/*-----------------------------mouse-move-calculated-row--------------------------------*/
	function mouse_move_in_ROW(event){
		selected_square(event, dg_ts, dg_cs);

		so.left = min_number(so.j, so.new_j);
		so.right = dg_ROW_h.x_length - 1;

		so.top = min_number( dg_ROW_h.ar[so.i][so.left].i[0] , dg_ROW_h.ar[so.new_i][so.left].i[0]);
		so.bot = max_number( dg_ROW_h.ar[so.i][so.left].i[dg_ROW_h.ar[so.i][so.left].i.length - 1] , dg_ROW_h.ar[so.new_i][so.left].i[dg_ROW_h.ar[so.new_i][so.left].i.length - 1]);

		change_select_area(so.top, so.bot, 0, dg_TABLE.x_length - 1, dg_TABLE, cell_under_select.table, 1);
		change_select_area(so.top, so.bot, so.left, so.right, dg_ROW_h, cell_under_select.row, 3);

		so.event = event;
		if((so.absolute_bottom - 30 < event.pageY || so.absolute_top + 30 > event.pageY) && 
			auto_scroll == undefined)	mouse_auto_scroll();
	}

	/*-----------------------------mouse-move-calculated-col--------------------------------*/
	function mouse_move_in_COL(event){
		selected_square(event, dg_cs, dg_ts);

		so.top = min_number(so.i, so.new_i);
		so.bot = dg_COL_h.y_length - 1;

		so.left = min_number( dg_COL_h.ar[so.top][so.j].j[0] , dg_COL_h.ar[so.top][so.new_j].j[0]);
		so.right = max_number( dg_COL_h.ar[so.top][so.j].j[dg_COL_h.ar[so.top][so.j].j.length - 1] , dg_COL_h.ar[so.top][so.new_j].j[dg_COL_h.ar[so.top][so.new_j].j.length - 1]);

		change_select_area(0, dg_TABLE.y_length - 1, so.left, so.right, dg_TABLE, cell_under_select.table, 1);
		change_select_area(so.top, so.bot, so.left, so.right, dg_COL_h, cell_under_select.col, 3);

		so.event = event;
		if((so.absolute_right - 30 < event.pageX || so.absolute_left + 30 > event.pageX) && 
			auto_scroll == undefined)	mouse_auto_scroll();
	}

	/*---------------------------------------mouse-up---------------------------------------*/
	function ch_mouse_up(event){ //cell header mouse up
		if( so.parent == dg_ROW_h ){

			so.left = 0;
			so.right = dg_COL_h.x_length - 1;

			clear_headers();
			cs_t_sit(dg_COL_h, cell_under_select.col, selected_items.col, 2);
			cs_t_sit(dg_ROW_h, cell_under_select.row, selected_items.row, 4);

			for(i = cell_under_select.table.length - 1 ; i >= 0 ; i--)
				change_state(cell_under_select.table[i], cell_under_select.table[i].prev_state);	
			
			cell_under_select = {};
			window.removeEventListener("mousemove", ch_mouse_move);
			window.removeEventListener("mouseup", ch_mouse_up);
		} else {

			so.top = 0;
			so.bot = dg_ROW_h.y_length - 1;

			clear_headers();
			cs_t_sit(dg_COL_h, cell_under_select.col, selected_items.col, 4);
			cs_t_sit(dg_ROW_h, cell_under_select.row, selected_items.row, 2);

			for(i = cell_under_select.table.length - 1 ; i >= 0 ; i--)
				change_state(cell_under_select.table[i], cell_under_select.table[i].prev_state);	
			
			cell_under_select = {};
			window.removeEventListener("mousemove", ch_mouse_move);
			window.removeEventListener("mouseup", ch_mouse_up);
		}
		cell_mouse_up(event);
	}
	/*--------------------------------------------------------------------------------------*/
	/*----------------------------------SELECT-MAIN-TABLE-----------------------------------*/
	/*-------------------------------------mouse-down---------------------------------------*/
	function cell_mouse_down(event){
		
		if(event.which != 1)
			return;

		if(!(event.ctrlKey))
			clear_all();	

		select_area_create(event, dg_ts, dg_ts, dg_TABLE);


		window.addEventListener("mousemove", cell_mouse_move);
		window.addEventListener("mouseup", cell_mouse_up);
		
		//first step in select
		selected_square(event, dg_ts, dg_ts);

		so.left  = min_number(so.j, so.new_j);
		so.right = max_number(so.j, so.new_j);
		so.top = min_number(so.i, so.new_i);
		so.bot = max_number(so.i, so.new_i);
		//table
		change_select_area(so.top, so.bot, so.left, so.right, dg_TABLE, cell_under_select.table, 1);
		//rows and cols
		change_select_area(so.top, so.bot, dg_ROW_h.ar[dg_ROW_h.y_length - 1].length - 1, dg_ROW_h.ar[dg_ROW_h.y_length - 1].length - 1, dg_ROW_h, cell_under_select.row, 1);		
		change_select_area(dg_COL_h.y_length - 1, dg_COL_h.y_length - 1, so.left, so.right, dg_COL_h, cell_under_select.col, 1);

	}

	/*-------------------------------------mouse-move---------------------------------------*/
	function so_onmouseover(event){
		if(so != undefined ){
			var target = closest(event.target, 'dg_cell');
			if( target == undefined	|| so.parent != dg_TABLE) return;

			so.new_i = target.array.i;
			so.new_j = target.array.j;

			so.left  = min_number(so.j, so.new_j);
			so.right = max_number(so.j, so.new_j);
			so.top   = min_number(so.i, so.new_i);
			so.bot   = max_number(so.i, so.new_i);
			//table
			change_select_area(so.top, so.bot, so.left, so.right, dg_TABLE, cell_under_select.table, 1);
			//rows and cols
			change_select_area(so.top, so.bot, dg_ROW_h.ar[dg_ROW_h.y_length - 1].length - 1, dg_ROW_h.ar[dg_ROW_h.y_length - 1].length - 1, dg_ROW_h, cell_under_select.row, 1);		
			change_select_area(dg_COL_h.y_length - 1, dg_COL_h.y_length - 1, so.left, so.right, dg_COL_h, cell_under_select.col, 1);
		}
	}

	/*------------------------------------mouse-scroll--------------------------------------*/
	function cell_mouse_move(event){
		so.event = event;

		if((so.absolute_right - 30 < event.pageX || so.absolute_left + 30 > event.pageX ||
			so.absolute_bottom - 30 < event.pageY || so.absolute_top + 30 > event.pageY) && 
			auto_scroll == undefined)	mouse_auto_scroll();
		return;
	}

	/*--------------------------mouse-up-and-main-selection-tool----------------------------*/

	function cell_mouse_up(event){

		shift_cell.target = dg_TABLE.ar[so.new_i][so.new_j];

		if(so.parent == dg_TABLE){
			change_select_to_selected();
		} else if(so.parent == dg_COL_h){
			shift_cell.target = dg_TABLE.ar[dg_TABLE.y_length - 1][so.new_j];
		} else if(so.parent == dg_ROW_h){
			shift_cell.target = dg_TABLE.ar[so.new_i][dg_TABLE.x_length - 1];
		}
		

		if(so.event.ctrlKey){
			for(i = so.top; i <= so.bot; i++){
				for(j = so.left; j <= so.right; j++){
					 
					if(dg_TABLE.ar[i][j].state == 2 ){

						for(k = 0 ; k < selected_items.table.length; k++){
							if(selected_items.table[k] ==  dg_TABLE.ar[i][j]){
								selected_items.table.splice(k, 1);
								break;
							}
						}
						change_state(dg_TABLE.ar[i][j], 0);

					} else {
						selected_items.table[selected_items.table.length] = dg_TABLE.ar[i][j];
						change_state(dg_TABLE.ar[i][j], 2);
					}
				}				
			}
			clear_headers();

			for(i = 0; i < selected_items.table.length; i++){
				var row = selected_items.table[i].i[0];
				var col = selected_items.table[i].j[0];

				if(dg_ROW_h.ar[row][dg_ROW_h.ar[row].length - 1].state != 2 ){
					change_state(dg_ROW_h.ar[row][dg_ROW_h.ar[row].length - 1], 2);
					selected_items.row[selected_items.row.length] = dg_ROW_h.ar[row][dg_ROW_h.ar[row].length - 1];
				}
				if(dg_COL_h.ar[dg_COL_h.y_length - 1][col].state != 2 ){
					change_state(dg_COL_h.ar[dg_COL_h.y_length - 1][col], 2);
					selected_items.col[selected_items.col.length] = dg_COL_h.ar[dg_COL_h.y_length - 1][col];
				}
			}
		} else {
			for(i = so.top; i <= so.bot; i++){
				for(j = so.left; j <= so.right; j++){
					selected_items.table[selected_items.table.length] = dg_TABLE.ar[i][j];
					change_state(dg_TABLE.ar[i][j], 2);
				}				
			}			
		}
		window.removeEventListener("mousemove", cell_mouse_move);
		window.removeEventListener("mouseup", cell_mouse_up);
		
		var target = closest(event.target, 'dg_cell');
		if(target != undefined && setting.sort_by_click){
			target = target.array;
			if( (target.table == dg_COL_h) && ( target == sorted_line) )
				sort_rows(target, event);
			if( (target.table == dg_ROW_h) && ( target == sorted_line) )
				sort_cols(target, event);
		}

		sorted_line = undefined;
		so = undefined;
		after_selection();
	}
	/*--------------------------------------------------------------------------------------*/
	/*----------------------------------SELECTION-TOOLS-------------------------------------*/
	/*-------------------------CREATE-OBJ-so-AND-PREPARE-TO-SELECT--------------------------*/
	function select_area_create( event, la, ta, parent){//left area, top area

		var t_coords = parent.cont.getBoundingClientRect();

		var nj = search_index(la.left, (event.pageX - t_coords.left - window.pageXOffset));
		var ni = search_index(ta.top,  (event.pageY - t_coords.top - window.pageYOffset));
			
		if(event.shiftKey && shift_cell.table != undefined) {
			nj = shift_cell.table.j[0];
			ni = shift_cell.table.i[0];

			if(parent == dg_ROW_h)
				nj = dg_ROW_h.ar[dg_ROW_h.y_length - 1].length - 1;
			if(parent == dg_COL_h)
				ni = dg_COL_h.y_length - 1;

		} else {
			if(parent == dg_TABLE)
				shift_cell.table = dg_TABLE.ar[ni][nj];
			else if(parent == dg_ROW_h)
				shift_cell.table = dg_TABLE.ar[ni][0];
			else if(parent == dg_COL_h)
				shift_cell.table = dg_TABLE.ar[0][nj];
		}

		if(parent != dg_TABLE){
			so =	{ x: t_coords.left + window.pageXOffset, y: t_coords.top + window.pageYOffset, i: parent.ar[ni][nj].i[0], j: parent.ar[ni][nj].j[0], event: event, parent: parent};

			if(parent == dg_COL_h)
				so.i = parent.ar[ni][nj].i[parent.ar[ni][nj].i.length - 1];
			else
				so.j = parent.ar[ni][nj].j[parent.ar[ni][nj].j.length - 1];

		} else 
			so =	{ x: t_coords.left + window.pageXOffset, y: t_coords.top + window.pageYOffset, i: ni, j: nj, event: event, parent: parent};
		
		var coord_abs_parent = dg_CORNER.parent.getBoundingClientRect();
		so.absolute_right = coord_abs_parent.right;
		so.absolute_bottom = coord_abs_parent.bottom;
		coord_abs_parent = dg_CORNER.cont.getBoundingClientRect();
		so.absolute_left = coord_abs_parent.right;
		so.absolute_top = coord_abs_parent.bottom;

		cell_under_select = { table: [], row: [], col: []};	
	}
	/*-------------------------------CLEAR-SELECTED-AREA----------------------------------*/
	function clear_all(){
		for(i = 0; i < selected_items.table.length; i++){
			if(selected_items.table[i] != undefined)
				change_state(selected_items.table[i], 0);
		}
		shift_cell.target = undefined;
		selected_items.table = [];
		clear_headers();
	}
	function select_all(){
		if( selected_items.table.length != dg_TABLE.y_length*dg_TABLE.x_length){
			clear_all();
			select(dg_TABLE, 2, selected_items.table);
			select(dg_COL_h, 2, selected_items.col);
			select(dg_ROW_h, 2, selected_items.row);

			function select(table, state, select_table){
				for(i = 0; i < table.y_length; i++){
					for(var j = 0; j < table.x_length; j++){
						if( table.ar[i][j].state != state ){
							select_table[select_table.length] = table.ar[i][j];
							change_state(table.ar[i][j], state);
						}
					}
				}
			}
		}
	}
	function clear_headers(){
		for(i = 0; i < selected_items.row.length; i++){
			if(selected_items.row[i] != undefined)
				change_state(selected_items.row[i], 0);
		}
		
		for(i = 0; i < selected_items.col.length; i++){
			if(selected_items.col[i] != undefined)
				change_state(selected_items.col[i], 0);
		}

		selected_items.col = [];
		selected_items.row = [];
	}
	/*--------------------------------SEARCH-PRESSED-PLACE----------------------------------*/
	function search_index(style_sheet, point){
		for(i = 0; i < style_sheet.length - 1; i++){
			if( style_sheet[i] <= point && style_sheet[i + 1] >= point)
				break;
		}
		return i;
	}
	/*------------------------------CHANGE-CLASS-TO-SELECTED--------------------------------*/
	function change_select_to_selected(){
		
		clear_headers();
		cs_t_sit(dg_COL_h, cell_under_select.col, selected_items.col, 2);
		cs_t_sit(dg_ROW_h, cell_under_select.row, selected_items.row, 2);

		for(i = cell_under_select.table.length - 1 ; i >= 0 ; i--){
			change_state(cell_under_select.table[i], cell_under_select.table[i].prev_state);	
		}
		cell_under_select = {};
	}
	/*--------------------------------TRANSFER-TO-SELECTED----------------------------------*/
	function cs_t_sit(table, select, selected, state){ //change select to selected in table
		if(select.length != 0){
			for( i = 0; i < select.length; i++){
				selected[selected.length] = select[i];
				change_state(select[i], state);
			}
		} else {
			if(table == dg_ROW_h){
				for( i = 0; i < table.ar.length; i++){
					selected[i] = table.ar[i][table.ar[i].length - 1];
					change_state(selected[i], state);
				}
			} else if(table == dg_COL_h){
				for( i = 0; i < table.ar[table.ar.length - 1].length; i++){
					selected[i] = table.ar[table.ar.length - 1][i];
					change_state(selected[i], state);
				}
			}
		}
	}
	/*-----------------------------CHANGE-CLASS-TO-UNDERMOUSE-------------------------------*/
	function change_select_area(top, bot, left, right, table, select_arr, state){
		for(i = select_arr.length - 1 ; i >= 0 ; i--){
				if( !(( select_arr[i].i[0] >= top && select_arr[i].i[0] <= bot ) && ( select_arr[i].j[0] >= left && select_arr[i].j[0] <= right  )) ) {
					
					change_state(select_arr[i], select_arr[i].prev_state);	
					select_arr.splice(i,1);			
				}										
			}
		for(i = top ; i <= bot ; i++){
			for(j = left; j <= right; j++){
				if(table.ar[i][j].state != state){

					select_arr[select_arr.length] = table.ar[i][j];
					select_arr[select_arr.length - 1].prev_state = table.ar[i][j].state;
					change_state(table.ar[i][j], state);						
				}
			}				
		}
	}
	/*---------------------------------------------------------------------------------------*/
	/*---------------------------------AUTO SCROLL IN TABLE----------------------------------*/
	/*---------------------------------------------------------------------------------------*/

	function mouse_auto_scroll() {

		if(so != undefined){
			var y_scroll = false; var x_scroll = false;

			if(so.parent == dg_ROW_h || so.parent == dg_TABLE){
				if(so.absolute_bottom - 30 < so.event.pageY )
					dg_TABLE.custum_scroll.change_tp( 1);

				else if (so.absolute_top + 30 > so.event.pageY)	
					dg_TABLE.custum_scroll.change_tp(-1);

				else
					y_scroll = true;
				
			} else 
				y_scroll = true;
			

			if(so.parent == dg_COL_h || so.parent == dg_TABLE){

				if(so.absolute_right - 30 < so.event.pageX )
					dg_TABLE.custum_scroll.change_lp( 1);

				else if (so.absolute_left + 30 > so.event.pageX)	
					dg_TABLE.custum_scroll.change_lp(-1);

				else 
					x_scroll = true;				
			} else 
				x_scroll = true;
			

			if(x_scroll && y_scroll)
				auto_scroll = null;
			else		
				auto_scroll = setTimeout(mouse_auto_scroll, 50);
			
		} else 
			auto_scroll = undefined;		
	}

	/*-----------------------------------CALC-NEW-INDEX-------------------------------------*/
	function selected_square(event, hor_ss, ver_ss){

		var cp =  event.pageX - so.x; //current position
		if( ver_ss.left[so.j] >= (event.pageX - so.x)){			
			for( i = so.j ; i >= 0; i--){
				so.new_j = i;	
				if( (ver_ss.left[i] <= cp) && ((ver_ss.left[i] + ver_ss.width[i] + 1) >= cp))
					break;
			}
		} else {
			for( i = so.j ; i < ver_ss.left.length; i++){
				so.new_j = i;	
				if( (ver_ss.left[i] <= cp) && ((ver_ss.left[i] + ver_ss.width[i] + 1) >= cp))
					break;
			}
		}
		/* TOP AND HEIGHT  */
		var cp =  event.pageY - so.y; //current position
		if( hor_ss.top[so.i] >= (event.pageY - so.y ) ){
			for( i = so.i ; i >= 0; i--){
			so.new_i = i;
				if( (hor_ss.top[i] <= cp) && ((hor_ss.top[i] + hor_ss.height[i] + 1) >= cp))
					break;
			}
		} else {
			for( i = so.i ; i < hor_ss.top.length ; i++){
			so.new_i = i;
				if( (hor_ss.top[i] <= cp) && ((hor_ss.top[i] + hor_ss.height[i] + 1) >= cp))
					break;
			}
		}
	}
	/*--------------------------------------------------------------------------------------*/
	/*-----------------------------------OTHER-FUNCTION-------------------------------------*/
	/*--------------------------------------------------------------------------------------*/
	function change_state(elem, new_state){
		var prev_state = elem.state;

		elem.state = new_state;
		if(elem.html != undefined)
			elem.html.className = elem.table.cn[new_state]; 
		return prev_state; }
	function max_number(a, b){
		if(a > b)
			return a;
		return b; }
	function min_number(a, b){
		if(a > b)
			return b;
		return a; }
	function closest(target, cur_class){
		if( target != undefined){
			if( has_class(target, cur_class))
				return target;
			else
				return closest( target.parentNode, cur_class);	}	} 
	function has_class(elem, className){
		if(elem)
			return new RegExp("(^|\\s)"+className+"(\\s|$)").test(elem.className);	}		
	function change_size(elem, coef, min){
		elem = Math.round(elem * coef);
		if(elem < min )	elem = min;
		return elem; }

	/*-------------------------------------------------------------------------------------*/
	/*---------------------------------------SORT------------------------------------------*/
	/*----------------------------------SORTING-ROWS---------------------------------------*/
	function sort_rows(target, event){

		var has_types = target.v_x.d_p.concat();

		for(var i = 0; i < 4; i++){
			if(has_types[i])
				has_types[i] = i;
		}
		for(var i = 3; i >= 0; i--){
			if(has_types[i] === false)
				has_types.splice(i,1);
		}
		if(has_types.length == 0)
			has_types[0] = 0;
		if(has_types.length == 1 && has_types[0] == 3)
			has_types.splice(0,0,0);

		var coords = target.html.getBoundingClientRect();
		coords.bite = (coords.right - coords.left)/has_types.length; 
		var current_type_of_sort;
		for(var i = 0; i < has_types.length; i++){
			if((coords.left + coords.bite*i <= event.pageX) && (coords.left + coords.bite*(i+1) >= event.pageX))
				current_type_of_sort = has_types[i];
		}

		ofs_row.color = get_color(current_type_of_sort);

		if(ofs_row.type_of_sort != current_type_of_sort || target != ofs_row.cell){
			sort_rows_default();

			ofs_row.cell = target;
			ofs_row.cell.sort_style = '&#9660;';
			ofs_row.type_of_sort = current_type_of_sort;
			sort_rows_dencrease(target.v_x.tree_j);
		} else if(target.sort_style == '&#9660;'){

			ofs_row.cell.sort_style = '&#9650;';
			ofs_row.type_of_sort = current_type_of_sort;
			sort_rows_increase(target.v_x.tree_j);
		} else if(target.sort_style == '&#9650;'){
			ofs_row.cell.sort_style = '';
			ofs_row.cell = undefined;

			sort_rows_default();
		}
		after_sort();
	}
	function sort_rows_increase( index_j){
		var p_array = []; 
		for(var i = 0; i < dg_TABLE.visible_y.length; i++)
			p_array[i] = dg_TABLE.visible_y[i].tree;

		p_array = tools.find_last_parent(p_array);

		for(var l = 0; l < p_array.length; l++){
			var p = p_array[l];
			var odds = 0;
			for(var i = 0; i < p.children.length; i++){
				if(p.children[i].default_position == 0)
					odds = p.children[i].dpi.index;
			}

			for(var i = 0; i < p.children.length - 1; i++){
				var cell = dg_TABLE.tree[i + odds][index_j].obj[ofs_row.type_of_sort];	
				if( cell != undefined){
					var min = (cell.text)? cell.text : 0;
					var n_i = i;

					for(var j = i + 1; j < p.children.length; j++){
						var n_cell = dg_TABLE.tree[j + odds][index_j].obj[ofs_row.type_of_sort];
						if( n_cell != undefined && n_cell != null){
							var value = (n_cell.text)? n_cell.text : 0;
							if( min > value){
								min = value;
								n_i = j;
							}
						}
					}
					swap_rows(i, n_i, odds, p);
				}				
			}
			for(var i = 0; i < p.children.length - 1; i++){
				var cell = dg_TABLE.tree[i + odds][index_j].obj[ofs_row.type_of_sort];
				var n_cell = dg_TABLE.tree[i + 1 + odds][index_j].obj[ofs_row.type_of_sort];
				
				if(cell != undefined && n_cell != undefined){
					var val = (cell.text)? cell.text : 0;
					var n_val = (n_cell.text)? n_cell.text : 0;
					if(val == n_val && p.children[i].default_position > p.children[i + 1].default_position){
						swap_rows(i, i + 1, odds, p);
						i--;
						if(i == -1) i = 0;
					}
				}
			}
		}
		change_visib();
	}
	function sort_rows_dencrease( index_j){
		var p_array = []; 
		for(var i = 0; i < dg_TABLE.visible_y.length; i++)
			p_array[i] = dg_TABLE.visible_y[i].tree;

		p_array = tools.find_last_parent(p_array);

		for(var l = 0; l < p_array.length; l++){
			var p = p_array[l];
			var odds = 0;
			for(var i = 0; i < p.children.length; i++){
				if(p.children[i].default_position == 0)
					odds = p.children[i].dpi.index;
			}

			for(var i = 0; i < p.children.length - 1; i++){
				var cell = dg_TABLE.tree[i + odds][index_j].obj[ofs_row.type_of_sort];
				
				if(cell != undefined && cell != null){
					var max = (cell.text)? cell.text : 0;
					var n_i = i;

					for(var j = i + 1; j < p.children.length; j++){
						var n_cell = dg_TABLE.tree[j + odds][index_j].obj[ofs_row.type_of_sort];
						if( n_cell != undefined && n_cell != null){
							var value = (n_cell.text)? n_cell.text : 0;
							if( max < value ){
								max = value;
								n_i = j;
							}
						}
					}
					swap_rows(i, n_i, odds, p);					
				}				
			}
			for(var i = 0; i < p.children.length - 1; i++){
				var cell = dg_TABLE.tree[i + odds][index_j].obj[ofs_row.type_of_sort];
				var n_cell = dg_TABLE.tree[i + 1 + odds][index_j].obj[ofs_row.type_of_sort];
				
				if(cell != undefined && n_cell != undefined){
					var val = (cell.text)? cell.text : 0;
					var n_val = (n_cell.text)? n_cell.text : 0;
					if(val == n_val && p.children[i].default_position > p.children[i + 1].default_position){
						swap_rows(i, i + 1, odds, p);
						i--;
						if(i == -1) i = 0;
					}
				}
			}
		}
		change_visib();
	}
	function sort_rows_default(){
		var p_array = []; 
		for(var i = 0; i < dg_TABLE.visible_y.length; i++)
			p_array[i] = dg_TABLE.visible_y[i].tree;

		p_array = tools.find_last_parent(p_array);

		for(var l = 0; l < p_array.length; l++){
			var p = p_array[l];
			var odds = 0;
			for(var i = 0; i < p.children.length; i++){
				if(p.children[i].default_position == 0)
					odds = p.children[i].dpi.index;
			}

			for(var i = 0; i < p.children.length; i++){
				if(p.children[i].default_position != i){
					swap_rows(i, p.children[i].default_position, odds, p);
					i--;
				}
			}
		}
		change_visib();
	}

	/*--------------------COL SORTING-------------------*/
	function sort_cols(target, event){

		var has_types = target.v_y.d_p.concat();
		for(var i = 0; i < 4; i++){
			if(has_types[i])
				has_types[i] = i;
		}

		for(var i = 3; i >= 0; i--){
			if(has_types[i] === false)
				has_types.splice(i,1);
		}

		if(has_types.length == 0)
			has_types[0] = 0;

		var coords = target.html.getBoundingClientRect();
		coords.bite = (coords.bottom - coords.top)/has_types.length; 
		var current_type_of_sort;
		for(var i = 0; i < has_types.length; i++){
			if((coords.top + coords.bite*i <= event.pageY) && (coords.top + coords.bite*(i+1) >= event.pageY))
				current_type_of_sort = has_types[i];
		}

		ofs_col.color = get_color(current_type_of_sort);

		if(ofs_col.type_of_sort != current_type_of_sort || target != ofs_col.cell){
			sort_cols_default();
	
			ofs_col.cell = target;
			ofs_col.cell.sort_style = '&#9654;';
			ofs_col.type_of_sort = current_type_of_sort;
			sort_cols_dencrease( target.v_y.tree_i);

		} else if(target.sort_style == '&#9654;'){
			
			ofs_col.cell = target;
			ofs_col.cell.sort_style = '&#9664;';
			ofs_col.type_of_sort = current_type_of_sort;
			sort_cols_increase( target.v_y.tree_i);

		} else if(target.sort_style == '&#9664;'){
			ofs_col.cell.sort_style = '';
			ofs_col.cell = undefined;
			sort_cols_default();
		}
		after_sort();
	}
	function sort_cols_increase( index_i){
		var p_array = []; 
		for(var i = 0; i < dg_TABLE.visible_x.length; i++)
			p_array[i] = dg_TABLE.visible_x[i].tree;

		p_array = tools.find_last_parent(p_array);

		for(var l = 0; l < p_array.length; l++){
			var p = p_array[l];
			var odds = 0;
			for(var i = 0; i < p.children.length; i++){
				if(p.children[i].default_position == 0)
					odds = p.children[i].dpi.index;
			}

			for(var i = 0; i < p.children.length - 1; i++){
				var cell = dg_TABLE.tree[index_i][i + odds].obj[ofs_col.type_of_sort];				
				if(cell != undefined){
					var min = (cell.text)? cell.text : 0;
					var n_i = i;
					for(var j = i + 1; j < p.children.length; j++){
						var n_cell = dg_TABLE.tree[index_i][j + odds].obj[ofs_col.type_of_sort];
						if( n_cell != undefined && n_cell != null){
							var value = (n_cell.text)? n_cell.text : 0;
							if( min > value){
								min = value;
								n_i = j;
							}
						}
					}
					swap_columns(i, n_i, odds, p);					
				}			
			}
			for(var i = 0; i < p.children.length - 1; i++){
				var cell = dg_TABLE.tree[index_i][i + odds].obj[ofs_col.type_of_sort];
				var n_cell = dg_TABLE.tree[index_i][i + 1 + odds].obj[ofs_col.type_of_sort];
				
				if(cell != undefined && n_cell != undefined){
					var val = (cell.text)? cell.text : 0;
					var n_val = (n_cell.text)? n_cell.text : 0;
					if(val == n_val && p.children[i].default_position > p.children[i + 1].default_position){
						swap_columns(i, i + 1, odds, p);
						i--;
						if(i == -1) i = 0;
					}
				}
			}
		}
		change_visib();
	}
	function sort_cols_dencrease( index_i){
		var p_array = []; 
		for(var i = 0; i < dg_TABLE.visible_x.length; i++)
			p_array[i] = dg_TABLE.visible_x[i].tree;

		p_array = tools.find_last_parent(p_array);

		for(var l = 0; l < p_array.length; l++){
			var p = p_array[l];
			var odds = 0;
			for(var i = 0; i < p.children.length; i++){
				if(p.children[i].default_position == 0)
					odds = p.children[i].dpi.index;
			}

			for(var i = 0; i < p.children.length - 1; i++){
				var cell = dg_TABLE.tree[index_i][i + odds].obj[ofs_col.type_of_sort];				
				if(cell != undefined){
					var max = (cell.text)? cell.text : 0;
					var n_i = i;
					for(var j = i + 1; j < p.children.length; j++){
						var n_cell = dg_TABLE.tree[index_i][j + odds].obj[ofs_col.type_of_sort];
						if( n_cell != undefined && n_cell != null){
							var value = (n_cell.text)? n_cell.text : 0;
							if( max < value){
								max = value;
								n_i = j;
							}
						}
					}
					swap_columns(i, n_i, odds, p);
				}			
			}
			
			for(var i = 0; i < p.children.length - 1; i++){
				var cell = dg_TABLE.tree[index_i][i + odds].obj[ofs_col.type_of_sort];
				var n_cell = dg_TABLE.tree[index_i][i + 1 + odds].obj[ofs_col.type_of_sort];
				
				if(cell != undefined && n_cell != undefined){
					var val = (cell.text)? cell.text : 0;
					var n_val = (n_cell.text)? n_cell.text : 0;
					if(val == n_val && p.children[i].default_position > p.children[i + 1].default_position){
						swap_columns(i, i + 1, odds, p);
						i--;
						if(i == -1) i = 0;
					}
				}
			}
		}
		change_visib();
	}
	function sort_cols_default(){
		var p_array = []; 
		for(var i = 0; i < dg_TABLE.visible_x.length; i++)
			p_array[i] = dg_TABLE.visible_x[i].tree;

		p_array = tools.find_last_parent(p_array);

		for(var l = 0; l < p_array.length; l++){
			var p = p_array[l];
			var odds = 0;
			for(var i = 0; i < p.children.length; i++){
				if(p.children[i].default_position == 0)
					odds = p.children[i].dpi.index;
			}

			for(var i = 0; i < p.children.length; i++){
				if(p.children[i].default_position != i){
					swap_columns(i, p.children[i].default_position, odds, p);
					i--;
				}
			}
		}
		change_visib();
	}

	function swap_columns(i, j, odds, p){
		var temporary;

		temporary = p.children[i];
		p.children[i] = p.children[j];
		p.children[j] = temporary;

		temporary = dg_TABLE.visible_x[i + odds];
		dg_TABLE.visible_x[i + odds] =  dg_TABLE.visible_x[j + odds];
		dg_TABLE.visible_x[j + odds] = temporary;

		for(var k = 0; k < dg_TABLE.tree.length; k++){						
			temporary = dg_TABLE.tree[k][i + odds];
			dg_TABLE.tree[k][i + odds] = dg_TABLE.tree[k][j + odds];
			dg_TABLE.tree[k][j + odds] = temporary;
		}

		temporary = default_dg_ts.width[i + odds];
		default_dg_ts.width[i + odds] = default_dg_ts.width[j + odds];
		default_dg_ts.width[j + odds] = temporary;
	}
	function swap_rows(i, j, odds, p){
		var temporary;

		var temporary = p.children[i];
		p.children[i] = p.children[j];
		p.children[j] = temporary;

		temporary = dg_TABLE.visible_y[i + odds];
		dg_TABLE.visible_y[i + odds] =  dg_TABLE.visible_y[j + odds];
		dg_TABLE.visible_y[j + odds] = temporary;

		temporary = dg_TABLE.tree[i + odds];
		dg_TABLE.tree[i + odds] = dg_TABLE.tree[j + odds];
		dg_TABLE.tree[j + odds] = temporary;

		temporary = default_dg_ts.height[i + odds];
		default_dg_ts.height[i + odds] = default_dg_ts.height[j + odds];
		default_dg_ts.height[j + odds] = temporary;
	}
	function get_color(type){
		var color;
		if(type == 0) color = '#000';
		if(type == 1) color = '#00a8a8';
		if(type == 2) color = '#ff5757';
		if(type == 3) color = '#b3b300';
		return color;
	}


	function support_sort_rows(obj){
		if(obj.col_index <= dg_TABLE.v_x.length && obj.col_index >= 0){
		
			var target = dg_TABLE.default_position_x[obj.col_index].tree;
			var type = obj.col_type;
		
			if(type == undefined ){
				for(var i = 0; i < target.v_x.d_p.length; i++){
					if(target.v_x.d_p[i]){
						type = i;
						break;
					}
				}
			}

			ofs_row.color = get_color(type);
			ofs_row.cell = target;
			ofs_row.type_of_sort = type;

			if(obj.col_direction == 1){
			
				sort_rows_default();
				ofs_row.cell.sort_style = '&#9660;';
				sort_rows_dencrease(target.v_x.tree_j);

			} else if(obj.col_direction == 2){

				sort_rows_default();
				ofs_row.cell.sort_style = '&#9650;';
				sort_rows_increase(target.v_x.tree_j);

			} else {
				ofs_row.cell.sort_style = '';
				ofs_row.cell = undefined;
				sort_rows_default();
			}
		}
	}
	function support_sort_cols(obj){
		if(obj.row_index <= dg_TABLE.v_y.length && obj.row_index >= 0){

			var target = dg_TABLE.default_position_y[obj.row_index].tree;
			var type = obj.row_type;
			
			if(type == undefined ){
				for(var i = 0; i < target.v_y.d_p.length; i++){
					if(target.v_y.d_p[i]){
						type = i;
						break;
					}
				}
			}
			ofs_col.color = get_color(type);
			ofs_col.cell = target;
			ofs_col.type_of_sort = type;

			if(obj.row_direction == 1){

				sort_cols_default();
				ofs_col.cell.sort_style = '&#9654;';
				sort_cols_dencrease(target.v_y.tree_i);

			} else if(obj.row_direction == 2){

				sort_cols_default();
				ofs_col.cell.sort_style = '&#9664;';
				sort_cols_increase(target.v_y.tree_i);

			} else {
				ofs_col.cell.sort_style = '';
				ofs_col.cell = undefined;
				sort_cols_default();		
			}
		}
	}


	this.sort_rows = function(obj){	support_sort_rows(obj);	}
	this.sort_cols = function(obj){	support_sort_cols(obj);	}
	this.sort_all = function(obj){
		support_sort_rows(obj);
		support_sort_cols(obj);
	}


	function after_sort(){
		if(typeof setting.table_sorted == 'function'){
			var obj = {};

			if(ofs_col.cell != undefined){
				obj.row_type 		= ofs_col.type_of_sort;
				obj.row_direction 	= (ofs_col.cell.sort_style == '&#9654;')? 1 : 2;
				obj.row_index		= ofs_col.cell.dpi.index;
			}

			if(ofs_row.cell != undefined){
				obj.col_type 		= ofs_row.type_of_sort;
				obj.col_direction 	= (ofs_row.cell.sort_style == '&#9660;')? 1 : 2;
				obj.col_index		= ofs_row.cell.dpi.index;
			}


			setting.table_sorted(obj);
		}
	}
	this.get_sorted = function(){
		var obj = {};

		if(ofs_col.cell != undefined){
			obj.row_type 		= ofs_col.type_of_sort;
			obj.row_direction 	=(ofs_col.cell.sort_style == '&#9654;')? 1 : 2;
			obj.row_index		= ofs_col.cell.dpi.index;
		}

		if(ofs_row.cell != undefined){
			obj.col_type 		= ofs_row.type_of_sort;
			obj.col_direction 	=(ofs_row.cell.sort_style == '&#9660;')? 1 : 2;
			obj.col_index		= ofs_row.cell.dpi.index;
		}
		return obj;
	}

	this.test = function(bool){
		if(bool){
			dg_CORNER.parent.oncontextmenu = function(e){
				if(typeof setting.right_click == 'function')
					setting.right_click(e, self);
				return false;
			}	
		} else
			dg_CORNER.parent.oncontextmenu = null;
	}
}

function custum_scroll(target, name_class){

	var viewport = target;
	var container;
	var sliders;
	var custum_scroll_function;
	var container_height;
	var container_width;

	var viewport_width = target.clientWidth;
	var viewport_height= target.clientHeight;

	var slider_height;
	var slider_width;

	var lp = 0;
	var tp = 0;
	var last_lp = 0;
	var last_tp = 0;

	var vertical_separators   = [0];	
	var horizontal_separators = [0];

	var horizontal_work = false;
	var vertical_work = false;

	var mouse_move;
	var scroll_timer;

	create_sliders();
	container = create_element( 'div', viewport, ('cs-container ' + name_class) );


	function create_sliders(){
		if(!sliders){
			sliders = {};

			sliders.horizontal = create_element( 'div', viewport, 'cs-container-horizontal');

			sliders.left_arrow = create_element( 'div', sliders.horizontal, 'cs-slider-none-button');
			create_element( 'div', sliders.left_arrow, 'cs-slider-left-arrow');
			sliders.left_arrow.style.left = '0';

			sliders.right_arrow = create_element( 'div', sliders.horizontal, 'cs-slider-none-button');
			create_element( 'div', sliders.right_arrow, 'cs-slider-right-arrow');
			sliders.right_arrow.style.right = '0';

			sliders.vertical = create_element( 'div', viewport, 'cs-container-vertical');

			sliders.top_arrow = create_element( 'div', sliders.vertical, 'cs-slider-none-button');
			create_element( 'div', sliders.top_arrow, 'cs-slider-top-arrow');
			sliders.top_arrow.style.top = '0';

			sliders.bottom_arrow = create_element( 'div', sliders.vertical, 'cs-slider-none-button');
			create_element( 'div', sliders.bottom_arrow, 'cs-slider-bottom-arrow');
			sliders.bottom_arrow.style.bottom = '0';

			sliders.corner = create_element( 'div', viewport, 'cs-slider-corner-none');
			create_element( 'div', sliders.corner, 'cs-slider-corner-arrow');
		}
	}

	function vertical_scroll(){
 		if(container_height > viewport_height ){
 			sliders.top_arrow.className = 'cs-slider-button';
 			sliders.bottom_arrow.className = 'cs-slider-button';
 			sliders.top_arrow.onmousedown = function() {sv_single_click( -1)};
 			sliders.bottom_arrow.onmousedown  = function() {sv_single_click( 1)};

 			if(!sliders.vertical_slider){
 				sliders.vertical_slider = create_element( 'div', sliders.vertical, 'cs-slider-vertical');
 				sliders.vertical_slider.onmousedown = down_vertical;
 			}

 			slider_height = (Math.floor((viewport_height - 34)*viewport_height/container_height) - 3);
 			if(slider_height < 20)
 				slider_height = 20;

 			vertical_work = true;
 			sliders.vertical_slider.style.top = (17 + Math.floor((vertical_separators[tp]/(vertical_separators[last_tp]))*(viewport_height - slider_height - 34))) + 'px';
 			sliders.vertical_slider.style.height = (slider_height - 4) + 'px';
 			sv_support(tp);

 		} else {
 			vertical_work = false;
 			sliders.top_arrow.className = 'cs-slider-none-button';
 			sliders.bottom_arrow.className = 'cs-slider-none-button'
 			sliders.top_arrow.onmousedown = sliders.bottom_arrow.onmousedown = undefined;
 			tp = 0; container.style.top = '0';

 			if(sliders.vertical_slider){
 				sliders.vertical_slider.parentNode.removeChild(sliders.vertical_slider);
 				sliders.vertical_slider = undefined;
 			} 
 		}
	}

	function horizontal_scroll(){
 		if(container_width > viewport_width){
 			sliders.left_arrow.className = 'cs-slider-button';
 			sliders.right_arrow.className = 'cs-slider-button';
 			sliders.left_arrow.onmousedown = function() {sh_single_click( -1)};
 			sliders.right_arrow.onmousedown  = function() {sh_single_click( 1)};

 			if(!sliders.horizontal_slider){
 				sliders.horizontal_slider = create_element( 'div', sliders.horizontal, 'cs-slider-horizontal');
 				sliders.horizontal_slider.onmousedown = down_horizontal;
 			}

 			slider_width = (Math.floor((viewport_width - 34)*viewport_width/container_width) - 3);
 			if(slider_width < 20)
 				slider_width = 20;
			horizontal_work = true;			
			sliders.horizontal_slider.style.left = (17 + Math.floor((horizontal_separators[lp]/(horizontal_separators[last_lp]))*(viewport_width - slider_width - 34))) + 'px';
 			sliders.horizontal_slider.style.width = (slider_width - 4) + 'px';
 			sh_support(lp);
 		} else {
			horizontal_work = false;
 			sliders.left_arrow.className = 'cs-slider-none-button';
 			sliders.right_arrow.className = 'cs-slider-none-button';
 			sliders.left_arrow.onmousedown = sliders.right_arrow.onmousedown = undefined;
 			lp = 0; container.style.left = '0';

 			if(sliders.horizontal_slider){
 				sliders.horizontal_slider.parentNode.removeChild(sliders.horizontal_slider);
 				sliders.horizontal_slider = undefined;
 			} 
 		}

 		if((container_width > (viewport.clientWidth - 17)) && (container_height > (viewport.clientHeight - 17))){
 			sliders.corner.className = 'cs-slider-corner';
 			sliders.corner.onclick = function(e){
 				if(lp == last_lp &&  tp == last_tp){
 					new_lp = 0;
 					new_tp = 0;
 				} else {
 					new_lp = last_lp;
 					new_tp = last_tp;
 				}
 				sh_support(new_lp);
				sv_support(new_tp);
 			}
 		} else {
 			sliders.corner.className = 'cs-slider-corner-none';
 			sliders.corner.onclick = undefined;
 		}
	}


	/*------------------------MOUSE MOVE----------------------*/

	function down_vertical(e){
		mouse_move = {mouse_y: e.pageY, started_tp: vertical_separators[tp]};

		window.addEventListener("mousemove", move_vertical);
		window.addEventListener("mouseup", up_vertical);	
		return false;	
	}
	function move_vertical(e){
		var position = mouse_move.started_tp + (e.pageY - mouse_move.mouse_y)*((container_height - viewport_height)/(viewport_height - slider_height - 34));

		var i;
		for( i = 0; i < vertical_separators.length; i++){
			if(vertical_separators[i] >= position)
				break;
		}
		var new_tp;
		if(position == container_height - viewport_height) new_tp = i;
		else if(i != 0){
			if( (vertical_separators[i] + vertical_separators[i - 1])/2 >= position)
				new_tp = i - 1;
			else
				new_tp = i;
		} else new_tp = i;

		sv_support(new_tp);
		return false;	
	}
	function up_vertical(e){
		mouse_move = undefined;
		window.removeEventListener("mousemove", move_vertical);
		window.removeEventListener("mouseup", up_vertical);
		return false;
	}


	function down_horizontal(e){
		mouse_move = {mouse_x: e.pageX, started_lp: horizontal_separators[lp]};

		window.addEventListener("mousemove", move_horizontal);
		window.addEventListener("mouseup", up_horizontal);	
		return false;	
	}
	function move_horizontal(e){
		var position = mouse_move.started_lp + (e.pageX - mouse_move.mouse_x)*((container_width - viewport_width)/(viewport_width - slider_width - 34));

		var i;
		for( i = 0; i < horizontal_separators.length; i++){
			if(horizontal_separators[i] >= position){
				break;
			}
		}
		var new_lp;
		if(position == container_width - viewport_width) new_lp = i;
		else if(i != 0){
			if( (horizontal_separators[i] + horizontal_separators[i - 1])/2 >= position)
				new_lp = i - 1;
			else
				new_lp = i;
		} else new_lp = 0;

		sh_support(new_lp);
		return false;
	}
	function up_horizontal(e){
		mouse_move = undefined;
		window.removeEventListener("mousemove", move_horizontal);
		window.removeEventListener("mouseup", up_horizontal);
		return false;
	}

	/*-----------------------------CLICK-AT-ROW------------------------*/

	function sh_support(new_lp){//scroll horizontal		
		if(horizontal_work){
			if(new_lp < 0)
				new_lp = 0;
			if(new_lp > last_lp)
				new_lp = last_lp;

			lp = new_lp;
			sliders.horizontal_slider.style.left = (17 + Math.floor((horizontal_separators[lp]/(horizontal_separators[last_lp]))*(viewport_width - slider_width - 34))) + 'px';
			container.style.left = - horizontal_separators[lp] + 'px';
			scroll_function();
			
		}
	}
	function sv_support(new_tp){//scroll horizontal
		if(vertical_work){
			if(new_tp < 0)
				new_tp = 0;
			if(new_tp > last_tp)
				new_tp = last_tp;

			tp = new_tp;
			sliders.vertical_slider.style.top = (17 + Math.floor((vertical_separators[tp]/(vertical_separators[last_tp]))*(viewport_height - slider_height - 34))) + 'px';
			container.style.top = - vertical_separators[tp] + 'px';
			scroll_function();		
		}
	}


	function sh_single_click(direction){// mouse down for scroll horizontal
		var new_lp = lp + direction;
		sh_support(new_lp);
		scroll_timer = setTimeout( function (){sh(direction)}, 400);
		window.addEventListener("mouseup", up_sa);
		return false;	
	}
	function sv_single_click(direction){// mouse down for scroll vertical
		var new_tp = tp + direction;
		sv_support(new_tp);
		scroll_timer = setTimeout( function (){sv(direction)}, 400);
		window.addEventListener("mouseup", up_sa);
		return false;	
	}

	function sh(direction){//scroll horizontal
		var new_lp = lp + direction;
		sh_support(new_lp);
		scroll_timer = setTimeout( function (){sh(direction)}, 50);
	}
	function sv(direction){//scroll vertical
		var new_tp = tp + direction;
		sv_support(new_tp);
		scroll_timer = setTimeout( function (){sv(direction)}, 50);
	}

	function up_sa(){
		window.removeEventListener("mouseup", up_sa);
		clearTimeout(scroll_timer);
		scroll_timer = null;
	}
	this.change_lp = function(direction){
		if(horizontal_work){
			new_lp = lp + direction;
			sh_support(new_lp);
		}
	}
	this.change_tp = function(direction){
		if(vertical_work){
			new_tp = tp + direction;
			sv_support(new_tp);
		}
	}

	this.scroll_to_coords = function(obj){
		if(obj.x){
			lp = x;
			sh_support(lp);
		}
		if(obj.y){
			tp = y;
			sv_support(tp);	
		}	
	}
	this.get_container = function(){ return container;}

	this.set_container_size = function(new_width, new_height, horizontal, vertical){
		container_height = new_height;
		container_width = new_width;

		container.style.height = container_height + 'px';
		container.style.width = container_width + 'px';

		vertical_separators = vertical;
		horizontal_separators = horizontal;

		new_last_index()
	
		vertical_scroll();		
		horizontal_scroll();
	}
	this.set_viewport_size = function(new_width, new_height){
	
		viewport_height = new_height - 17;
		viewport_width = new_width - 17;
	}

	function new_last_index(){	
		last_tp = 0;
		last_lp = 0;
		for(var i = 0; i < vertical_separators.length; i++){
			if(vertical_separators[i] > (container_height - viewport_height)){
				last_tp = i;
				break;
			}
		}
		for(var i = 0; i < horizontal_separators.length; i++){
			if(horizontal_separators[i] > (container_width - viewport_width)){
				last_lp = i;
				break;
			}
		}
	}

	this.get_lp = function(){return horizontal_separators[lp];}
	this.get_tp = function(){return vertical_separators[tp];}
	this.get_height = function(){return viewport_height;}
	this.get_width = function(){return viewport_width;}
	this.set_scroll_function = function(new_scroll_function){
		if(typeof new_scroll_function == 'function')
			custum_scroll_function = new_scroll_function;
	}
	function scroll_function(){
		if(typeof custum_scroll_function == 'function')
			custum_scroll_function(horizontal_separators[lp], vertical_separators[tp], viewport_width, viewport_height);
	}

	function create_element( tag, parent, class_name){
		var new_element = 	document.createElement(tag);
		if(parent) 			parent.appendChild(new_element);		
		if(class_name) 		new_element.className = class_name;
		return new_element;
	}
}