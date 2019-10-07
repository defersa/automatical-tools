//
//	Created by Makarov Aleksand
//

//	Feaches:

//	Custom functions:

function texteditor_ui(options){

	var _te;
	var _functions;
	var _setting;

	var link = this;
	var _fragment = document.createDocumentFragment();	
	
	link.create = function(options){
		if(!options)			options = {};
		if(_te)					link.remove();


		_functions = {};
		_setting = {};
		CREATE.main();

		link.change(options);
	}

	link.change = function(options){
		if(!options)			options = {};

		if(options.parent !== undefined)		SET.parent(options);
		if(options.functions !== undefined)		SET.functions(options);
	}

	link.remove = function(){
		tools.destroyHTML(_te.html.main);

		_te = undefined;
		_function = undefined;

	}
	link.getText = function(){
		IMAGES.removeImgResize();
		return _te.html.text.innerHTML;
	}
	link.getContainer = function(){

	}
	link.setText = function(text){
		_te.html.text.innerHTML = text;
	}
	link.focus = function(){
		_te.html.text.focus();
	}


	var EVENTS = {
		click: {
			buttons: function(b, n){

				if(_te.image){
					IMAGES.removeImgResize();
				}

				SEL.restore();				
				document.execCommand(_buttons[ b ][ n ].tag, 0, "" );			
				SET.update();

				if(_buttons[ b ][ n ].tag == "underline"){

					var node = GET.node();

					function deepReplace(node){
						if(node.tagName == 'U'){
							node.style.textDecoration = "underline";
							node.style.color = "inherit";
						}

						if(node.children.length){
							for(var i = 0; i < node.children.length; i++){
								deepReplace(node.children[i]);
							}
						}
					}
					deepReplace(node);
				}
			},
			textarea: function(e){

				if(e.target.tagName.toLowerCase() == 'img'){
					var IE = !!document.documentMode;
					if(!IE){
						IMAGES.clickOnImage(e);
					}


					var target = e.target;

					if (document.createRange) {
						rng = document.createRange();
						rng.selectNode(target)
						sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(rng);
						SEL.range = rng;
						SEL.restore();
					} 

				} else if(_te.image){
					IMAGES.removeImgResize();
				}
				SET.update();
			}
		},
		mousedown: {
			panel: function(e){

				if(tools.closest( e.target, 'te-panel')){
					if(e.target.id){
						SEL.restore();
						document.execCommand( _te.panel.node.tag , 0, _te.panel.node.list[parseInt(e.target.id)] );
						SET.update();
					}
				}

				tools.destroyHTML( _te.panel.html );
				 _te.panel = undefined;

				window.removeEventListener( 'mousedown', EVENTS.mousedown.panel );
			},
			palette: function(e){
				if(tools.closest( e.target, 'te-palette')){
					if(e.target.className == 'te-palette-cell'){

						SEL.restore();
						document.execCommand( _te.palette.node.tag , 0, e.target.id );
						SET.update();
					}
				}

				tools.destroyHTML( _te.palette.html );
				 _te.palette = undefined;

				window.removeEventListener( 'mousedown', EVENTS.mousedown.palette );
			},
			textarea: function(e){
				var move = function(e){
					SET.update();
				}
				var up = function(e){
					SET.update();
					window.removeEventListener( 'mousemove', move );
					window.removeEventListener( 'mouseup', up );
				}
				SET.update();


				window.addEventListener( 'mousemove', move );
				window.addEventListener( 'mouseup', up );
			}

		},
		keydown: function(e){

			IMAGES.removeImgResize();

			var kc = e.keyCode;

			if(kc == 27){
				var node = _setting.parent.parentNode;

				while( (!node.tabIndex || node.tabIndex == -1) && node != document.body ){
					node = node.parentNode;
				}
				_te.html.text.blur();
				
				if(_functions.escapePress){
					_functions.escapePress(link);
				} else {
					node.focus();
				}

				tools.stopProp(e);
				return false;
			}
			if(kc == 13){
				tools.stopProp(e);
			}

			SET.update();
		},
		keyup: function(e){

			SET.update();
		}
	};

	var GET = {
		tags: function(){

			function depth(node){

				if(!node)
					return;

				if(node.className == 'te-main')
					return;

				for( var b in _buttons ){
					for( var n in _buttons[b]){
						if(_buttons[b][n].c(node)){
							param[b][n] = true; 
						}
					}
				}

				if(node.style.color)								param.color = node.style.color;
				if(node.style.backgroundColor)						param.backgroundColor = node.style.backgroundColor;

				if(node.style.fontFamily)							param.fontFamily = node.style.fontFamily;
				if(node.face)										param.fontFamily = node.face;

				if(node.style.fontSize)								param.fontSize = node.style.fontSize;
				if(node.size)										param.fontSize = node.size;
			
				
				depth(node.parentNode);
			}

			var startnode = GET.node();
			var param = {};

			var parent = startnode;

			while(parent !== _te.html.text && parent !== document.body && parent){
				parent = parent.parentNode;
			}


			for( var b in _buttons ){
				param[b] = {};
			}

			if(parent !== _te.html.text)
				return param;

			depth(startnode);

			if(!param.texta.c && !param.texta.l && !param.texta.r && !param.texta.j){
				param.texta.l = true;
			}
			return param;
		},
		node: function( ){
			var range, sel, container;
			if (document.selection && document.selection.createRange) {
			    // IE case
			    range = document.selection.createRange();
			    return range.parentElement();
			} else if (window.getSelection) {
			    sel = window.getSelection();
			    if (sel.getRangeAt) {
			        if (sel.rangeCount > 0) {
			            range = sel.getRangeAt(0);
			        }
			    } else {
			        // Old WebKit selection object has no getRangeAt, so
			        // create a range from other selection properties
			        range = document.createRange();
			        range.setStart(sel.anchorNode, sel.anchorOffset);
			        range.setEnd(sel.focusNode, sel.focusOffset);

			        // Handle the case when the selection was selected backwards (from the end to the start in the document)
			        if (range.collapsed !== sel.isCollapsed) {
			            range.setStart(sel.focusNode, sel.focusOffset);
			            range.setEnd(sel.anchorNode, sel.anchorOffset);
			        }
			    }

			    if (range) {
			       container = range.commonAncestorContainer;

			       // Check if the container is a text node and return its parent if so
			       return container.nodeType === 3 ? container.parentNode : container;
			    }   
			}
		}
	};

	var SET = {
		parent: function(options){
			_setting.parent = options.parent;

			if(options.parent instanceof Node)
				options.parent.appendChild(_te.html.main);
			else
				_fragment.appendChild(_te.html.main)
		},
		functions: function(options){
			if(options.functions.uploadImage !== undefined)			_functions.uploadImage = options.functions.uploadImage;
			if(options.functions.uploadVideo !== undefined)			_functions.uploadVideo = options.functions.uploadVideo;
			if(options.functions.escapePress !== undefined)			_functions.escapePress = options.functions.escapePress;
		},
		update: function(){
			var param = GET.tags();
			SEL.saveRange();

			for( var b in _buttons){
				for( var n in _buttons[ b ]){
					if(param[ b ][ n ]){
						_te.buttons[ b ][ n ].className = 'te-bar-button-active';
					} else {
						_te.buttons[ b ][ n ].className = 'te-bar-button';
					}				
				}
			}

			_buttons.fontf.f.current = undefined;
			if(param.fontFamily){
				for(var i = 0; i < _buttons.fontf.f.list.length; i++){
					if(_buttons.fontf.f.list[i].toLowerCase() == param.fontFamily.toLowerCase()){
						_buttons.fontf.f.current = i;
					}
				}
			}
			_buttons.fontf.s.current = 2;
			if(param.fontSize){
				for(var i = 0; i < _buttons.fontf.s.list.length; i++){
					if(_buttons.fontf.s.list[i] == param.fontSize){
						_buttons.fontf.s.current = i;
					}
				}
			}
		}
	};

	var CREATE = {
		main: function(){
			_te = {};
			_te.html = {};

			_te.html.main = tools.createHTML({
				tag: 'div',
				parent: _fragment,
				className: 'te-main'
			});

			_te.html.bar = tools.createHTML({
				tag: 'div',
				parent: _te.html.main,
				className: 'te-bar'
			});

			_te.html.text = tools.createHTML({
				tag: 'div',
				parent: _te.html.main,
				onmousedown: EVENTS.mousedown.textarea,
				onclick: EVENTS.click.textarea,
				className: 'te-text'
			});
			_te.html.text.contentEditable = 'true';
			_te.html.text.onkeydown = EVENTS.keydown;
			_te.html.text.onkeyup = EVENTS.keyup;
			_te.html.text.onpaste = EVENTS.paste;


			CREATE.buttons();
		},
		buttons: function(){
			_te.buttons = {};

			for( var block in _buttons ){

				_te.buttons[ block ] = {};

				for( var name in _buttons[block] ){
					var item = _buttons[block][name];

					_te.buttons[ block ][ name ] = tools.createHTML({
						tag: 'div',
						title: item.title,
						parent: _te.html.bar,
						onclick: item.f,
						innerHTML: item.icon,
						className: 'te-bar-button'
					});
				}

				// spliter
				tools.createHTML({	tag: 'div',	parent: _te.html.bar,	className: 'te-bar-sep'	});
			}

		
		},
		palette: function( p, node){
			var innerHTML = '';
			var colortheme = [
				['FFFFFF','000000','E7E6E6','44546A','5B9BD5','ED7D31','A5A5A5','FFC000','4472C4','70AD47'],
				['F2F2F2','7F7F7F','D0CECE','D6DCE4','DEEBF6','FBE5D5','EDEDED','FFF2CC','D9E2F3','E2EFD9'],
				['D8D8D8','595959','AEABAB','ADB9CA','BDD7EE','F7CBAC','DBDBDB','FEE599','B4C6E7','C5E0B3'],
				['BFBFBF','3F3F3F','757070','8496B0','9CC3E5','F4B183','C9C9C9','FFD965','8EAADB','A8D08D'],
				['A5A5A5','262626','3A3838','323F4F','2E75B5','C55A11','7B7B7B','BF9000','2F5496','538135'],
				['7F7F7F','0C0C0C','171616','222A35','1E4E79','833C0B','525252','7F6000','1F3864','375623']
			];
			var standartcolor = ['C00000','FF0000','FFC000','FFFF00','92D050','00B050','00B0F0','0070C0','002060','7030A0'];
			
			innerHTML += '<div class="te-palette-row">Цвет по умолчанию</div>';
			innerHTML += '<div class="te-palette-row"><div class="te-palette-cell" id="' + node.default + '" style="background:' + node.default + '"></div></div>';

			innerHTML += '<div class="te-palette-row">Цвета темы</div>';
			for(var i = 0; i < colortheme.length; i++){
				innerHTML += '<div class="te-palette-row">';
				for(var j = 0; j < colortheme[i].length; j++){
					innerHTML += '<div class="te-palette-cell" id="' + colortheme[i][j] + '" style="background: #' + colortheme[i][j] + '"></div>';
				}
				innerHTML += '</div>';
			}

			innerHTML += '<div class="te-palette-row">Стандартные цвета</div>';
				innerHTML += '<div class="te-palette-row">';
				for(var j = 0; j < standartcolor.length; j++){
					innerHTML += '<div class="te-palette-cell" id="' + standartcolor[j] + '"  style="background: #' + standartcolor[j] + '"></div>';
				}
				innerHTML += '</div>';

			_te.palette = {};
			_te.palette.node = node;
			_te.palette.html = tools.createHTML({
				tag: 'div',
				className: 'te-palette',
				style: 'left:' + p.x + 'px; top: ' + p.y + 'px;',
				parent: document.body,
				innerHTML: innerHTML
			});

			window.addEventListener( 'mousedown', EVENTS.mousedown.palette );
		},
		panel: function( p, node ){
			_te.panel = {};

			var list = node.list;
			var id = node.current;
			var innerHTML = '';

			list.forEach(function(item, i){
				innerHTML += '<div class="te-panel-node" id="' + i + '" style="' + ((id == i) ? 'background: #198cf0; color: white; ' : '') + 'font-family: ' + item + ';"">' + item + '</div>'
			});

			_te.panel.node = node;
			_te.panel.html = tools.createHTML({
				tag: 'div',
				className: 'te-panel',
				style: 'left:' + p.x + 'px; top: ' + p.y + 'px;',
				parent: document.body,
				innerHTML: innerHTML
			});

			window.addEventListener( 'mousedown', EVENTS.mousedown.panel );

		}
	};

	var SEL = new function(){
		this.range;
		this.restore = function(){
			var selection = window.getSelection();
			if (SEL.range) {
				try {
					selection.removeAllRanges();
				} catch (ex) {
					document.body.createTextRange().select();
					document.selection.empty();
				}
	
				selection.addRange(SEL.range);
			}
		}
		this.currentRange = function(){
			var sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				return sel.getRangeAt(0);
			}
		}
		this.saveRange = function(){
			SEL.range = SEL.currentRange();
		}
	};

	var IMAGES = new function(){
		this.removeImgResize = function(){
			if(_te.image){
				tools.destroyHTML(_te.image.navBar.html);
				_te.image.resize.forEach(function(item){ tools.destroyHTML(item); });
				_te.image = undefined;
			}
		}

		var s;

		function chainClick(){
			_setting.chain = !_setting.chain;
			_te.image.navBar.chain.className = _setting.chain ? 'te-bar-button-active' : 'te-bar-button';
		}
		function chainInput(e, side){
			console.log(side);
		}
		function createNav(){
			var navBar = {};
			navBar.html = tools.createHTML({
				tag: 'div',
				parent: _te.html.bar,
				className: 'te-bar-image'
			});
			var className = _setting.chain ? 'te-bar-button-active' : 'te-bar-button';
			navBar.chain = tools.createHTML({
				tag: 'div',
				parent: navBar.html,
				onclick: chainClick,
				className: className,
				innerHTML: _Icons.media.chain
			});
			navBar.wlabel = tools.createHTML({
				tag: 'span',
				parent: navBar.html,
				innerHTML: 'w:'
			})
			navBar.winput = tools.createHTML({
				tag: 'input',
				parent: navBar.html,
				oninput: function(e){ return chainInput(e, 0) }(),
				className: 'input'
			});
			navBar.hlabel = tools.createHTML({
				tag: 'span',
				parent: navBar.html,
				innerHTML: 'h:'
			})
			navBar.hinput = tools.createHTML({
				tag: 'input',
				parent: navBar.html,
				oninput: function(e){ return chainInput(e, 1) }(),
				className: 'input'
			});
			navBar.winput.type = 'Number';
			navBar.hinput.type = 'Number';
			navBar.winput.value = _te.image.target.width;
			navBar.hinput.value = _te.image.target.height;
			return navBar;
		}


		this.down = function( e, p, c ){

			var rect = tools.createHTML({
				tag: 'div',
				parent: _te.html.text,
				className: 'te-rectangle',
				style: 'left: ' + c.l + 'px; top: ' + c.t + 'px; width: ' + c.w + 'px; height: ' + c.h + 'px;'
			});

			tools.startBackdrop({cursor: 'default'});
						
			s = {
				p: p,
				e: e,
				c: c,
				r: rect
			};
			window.addEventListener( 'mousemove', move );
			window.addEventListener( 'mouseup', up );

			move(e);
		}

		var move = function(e){
			var c = {
				l: s.c.l,
				t: s.c.t,
				w: s.c.w,
				h: s.c.h,
			}
			var pageX = e.pageX,
				pageY = e.pageY;

/*
			if(_setting.chain){
				if(s.p[1] == 0)		s.p[1] = s.p[0]
				if(s.p[0] == 0)		s.p[0] = s.p[1]
				if(pageX - s.e.pageX < pageY - s.e.pageY )
					pageY = s.e.pageY - ((s.p[1] !== s.p[0]) ? (pageX - s.e.pageX) : (s.e.pageX - pageX));
				else 
					pageX = s.e.pageX - ((s.p[1] !== s.p[0]) ? (pageY - s.e.pageY) : (s.e.pageY - pageY));
			}
			*/

			if(s.p[0] == -1){
				c.l = s.c.l - s.e.pageX + pageX;
				c.w	= s.c.w + s.e.pageX - pageX;
			} else if(s.p[0] == 1) {
				c.w	= s.c.w - s.e.pageX + pageX;
			}


			if(s.p[1] == -1){
				c.t = s.c.t - s.e.pageY + pageY;
				c.h	= s.c.h + s.e.pageY - pageY;
			} else if(s.p[1] == 1) {
				c.h = s.c.h - s.e.pageY + pageY;
			}



			if(c.w < 40)					c.w = 40;
			if(c.l > s.c.l + s.c.w - 40)	c.l = s.c.l + s.c.w - 40;
			if(c.h < 40)					c.h = 40;
			if(c.t > s.c.t + s.c.h - 40)	c.t = s.c.t + s.c.h - 40;

			if(_setting.chain){
				if(s.p[1] == 0)		s.p[1] = s.p[0]
				if(s.p[0] == 0)		s.p[0] = s.p[1]
				if(c.w < c.h*_te.image.rate){
					var neww = Math.round(c.h*_te.image.rate);
					if(s.p[0] == -1){
						c.l += c.w - neww;
					} 
					c.w = neww;
				} else {

					var newh = Math.round(c.w/_te.image.rate);
					if(s.p[1] == -1){
						c.t += c.h - newh;
					} 
					c.h = newh;
				}
			}

			s.nc = c;
			s.r.style.cssText = 'left: ' + c.l + 'px; top: ' + c.t + 'px; width: ' + c.w + 'px; height: ' + c.h + 'px;'
		}

		var up = function(e){

			_te.image.target.width = s.nc.w;
			_te.image.target.height = s.nc.h;


			var ne = { target: _te.image.target };

			tools.destroyHTML(s.r);
			tools.endBackdrop();
			
			s = undefined;
			window.removeEventListener( 'mousemove', move );
			window.removeEventListener( 'mouseup', up );


			IMAGES.removeImgResize();
			IMAGES.clickOnImage(ne);
		}

		this.clickOnImage = function(e){

			if(_te.image){
				if(_te.image.target !== e.target){
					IMAGES.removeImgResize();
				} else {
					return;
				}
			}

			var targetCoords = e.target.getBoundingClientRect();
			var parentCoords = _te.html.text.getBoundingClientRect();
			var coords = { 
				l: targetCoords.left - parentCoords.left + _te.html.text.scrollLeft,
				t: targetCoords.top - parentCoords.top + _te.html.text.scrollTop,
				r: targetCoords.right - parentCoords.left + _te.html.text.scrollLeft,
				b: targetCoords.bottom - parentCoords.top  + _te.html.text.scrollTop,
				w: targetCoords.right - targetCoords.left,
				h: targetCoords.bottom - targetCoords.top, 
			};

			var points = [
				{ parametr: [-1,-1], cursor: 'nw-resize', point: [coords.l, coords.t] },
				{ parametr: [-1, 1], cursor: 'ne-resize', point: [coords.l, coords.b] },
				{ parametr: [ 1,-1], cursor: 'ne-resize', point: [coords.r, coords.t] },
				{ parametr: [ 1, 1], cursor: 'nw-resize', point: [coords.r, coords.b] },

				{ parametr: [-1, 0], cursor: 'e-resize', point: [coords.l, (coords.h)/2 + coords.t] },
				{ parametr: [ 0,-1], cursor: 'n-resize', point: [(coords.w)/2 + coords.l, coords.t] },
				{ parametr: [ 0, 1], cursor: 'n-resize', point: [(coords.w)/2 + coords.l, coords.b] },
				{ parametr: [ 1, 0], cursor: 'e-resize', point: [coords.r, (coords.h)/2 + coords.t] }

			];

			_te.image = {};
			_te.image.resize = [];
			_te.image.target = e.target;
			_te.image.rate = e.target.width/e.target.height;
			_te.image.navBar = createNav();
			points.forEach( function(item){
				_te.image.resize.push(
					tools.createHTML({
						tag: 'div',
						className: 'te-image-resize',
						style: ( 'left: ' + (item.point[0] - 5) + 'px; top: ' + (item.point[1] - 5) + 'px; cursor: ' + (item.cursor) + ';'),
						onmousedown: function(e){ IMAGES.down( e, item.parametr, coords ); return false; },
						parent: _te.html.text
					})
				)
			});
		}
		this.resize
	}

	/*
	var _Icons = {
		fonts: {
			b: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M10.187 17H5.773c-.637 0-1.092-.138-1.364-.415-.273-.277-.409-.718-.409-1.323V4.738c0-.617.14-1.062.419-1.332.279-.27.73-.406 1.354-.406h4.68c.69 0 1.288.041 1.793.124.506.083.96.242 1.36.478.341.197.644.447.906.75a3.262 3.262 0 0 1 .808 2.162c0 1.401-.722 2.426-2.167 3.075C15.05 10.175 16 11.315 16 13.01a3.756 3.756 0 0 1-2.296 3.504 6.1 6.1 0 0 1-1.517.377c-.571.073-1.238.11-2 .11zm-.217-6.217H7v4.087h3.069c1.977 0 2.965-.69 2.965-2.072 0-.707-.256-1.22-.768-1.537-.512-.319-1.277-.478-2.296-.478zM7 5.13v3.619h2.606c.729 0 1.292-.067 1.69-.2a1.6 1.6 0 0 0 .91-.765c.165-.267.247-.566.247-.897 0-.707-.26-1.176-.778-1.409-.519-.232-1.31-.348-2.375-.348H7z"></path></svg>',
			i: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M9.586 14.633l.021.004c-.036.335.095.655.393.962.082.083.173.15.274.201h1.474a.6.6 0 1 1 0 1.2H5.304a.6.6 0 0 1 0-1.2h1.15c.474-.07.809-.182 1.005-.334.157-.122.291-.32.404-.597l2.416-9.55a1.053 1.053 0 0 0-.281-.823 1.12 1.12 0 0 0-.442-.296H8.15a.6.6 0 0 1 0-1.2h6.443a.6.6 0 1 1 0 1.2h-1.195c-.376.056-.65.155-.823.296-.215.175-.423.439-.623.79l-2.366 9.347z"></path></svg>',
			u: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M3 18v-1.5h14V18zM5.2 10V3.6c0-.4.4-.6.8-.6.3 0 .7.2.7.6v6.2c0 2 1.3 2.8 3.2 2.8 1.9 0 3.4-.9 3.4-2.9V3.6c0-.3.4-.5.8-.5.3 0 .7.2.7.5V10c0 2.7-2.2 4-4.9 4-2.6 0-4.7-1.2-4.7-4z"></path></svg>',
			s: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M7 16.4c-.8-.4-1.5-.9-2.2-1.5a.6.6 0 0 1-.2-.5l.3-.6h1c1 1.2 2.1 1.7 3.7 1.7 1 0 1.8-.3 2.3-.6.6-.4.6-1.2.6-1.3.2-1.2-.9-2.1-.9-2.1h2.1c.3.7.4 1.2.4 1.7v.8l-.6 1.2c-.6.8-1.1 1-1.6 1.2a6 6 0 0 1-2.4.6c-1 0-1.8-.3-2.5-.6zM6.8 9L6 8.3c-.4-.5-.5-.8-.5-1.6 0-.7.1-1.3.5-1.8.4-.6 1-1 1.6-1.3a6.3 6.3 0 0 1 4.7 0 4 4 0 0 1 1.7 1l.3.7c0 .1.2.4-.2.7-.4.2-.9.1-1 0a3 3 0 0 0-1.2-1c-.4-.2-1-.3-2-.4-.7 0-1.4.2-2 .6-.8.6-1 .8-1 1.5 0 .8.5 1 1.2 1.5.6.4 1.1.7 1.9 1H6.8z"></path><path d="M3 10.5V9h14v1.5z"></path></svg>'
		},

		texta: {
			l: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M2 3.75c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0 8c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0 4c0 .414.336.75.75.75h9.929a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0-8c0 .414.336.75.75.75h9.929a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75z"></path></svg>',
			r: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M18 3.75a.75.75 0 0 1-.75.75H2.75a.75.75 0 1 1 0-1.5h14.5a.75.75 0 0 1 .75.75zm0 8a.75.75 0 0 1-.75.75H2.75a.75.75 0 1 1 0-1.5h14.5a.75.75 0 0 1 .75.75zm0 4a.75.75 0 0 1-.75.75H7.321a.75.75 0 1 1 0-1.5h9.929a.75.75 0 0 1 .75.75zm0-8a.75.75 0 0 1-.75.75H7.321a.75.75 0 1 1 0-1.5h9.929a.75.75 0 0 1 .75.75z"></path></svg>',
			c: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M2 3.75c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0 8c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm2.286 4c0 .414.336.75.75.75h9.928a.75.75 0 1 0 0-1.5H5.036a.75.75 0 0 0-.75.75zm0-8c0 .414.336.75.75.75h9.928a.75.75 0 1 0 0-1.5H5.036a.75.75 0 0 0-.75.75z"></path></svg>',
			f: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M2 3.75c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0 8c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0 4c0 .414.336.75.75.75h9.929a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0-8c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75z"></path></svg>'
		},

		fontf: {
			f: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M11.03 3h6.149a.75.75 0 1 1 0 1.5h-5.514L11.03 3zm1.27 3h4.879a.75.75 0 1 1 0 1.5h-4.244L12.3 6zm1.27 3h3.609a.75.75 0 1 1 0 1.5h-2.973L13.57 9zm-2.754 2.5L8.038 4.785 5.261 11.5h5.555zm.62 1.5H4.641l-1.666 4.028H1.312l5.789-14h1.875l5.789 14h-1.663L11.436 13z"></path></svg>',
			s: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M9.816 11.5L7.038 4.785 4.261 11.5h5.555zm.62 1.5H3.641l-1.666 4.028H.312l5.789-14h1.875l5.789 14h-1.663L10.436 13zm7.55 2.279l.779-.779.707.707-2.265 2.265-2.193-2.265.707-.707.765.765V4.825c0-.042 0-.083.002-.123l-.77.77-.707-.707L17.207 2.5l2.265 2.265-.707.707-.782-.782c.002.043.003.089.003.135v10.454z"></path></svg>'
		},
	
		ur: {
			u: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M5.042 9.367l2.189 1.837a.75.75 0 0 1-.965 1.149l-3.788-3.18a.747.747 0 0 1-.21-.284.75.75 0 0 1 .17-.945L6.23 4.762a.75.75 0 1 1 .964 1.15L4.863 7.866h8.917A.75.75 0 0 1 14 7.9a4 4 0 1 1-1.477 7.718l.344-1.489a2.5 2.5 0 1 0 1.094-4.73l.008-.032H5.042z"></path></svg>',
			r: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M14.958 9.367l-2.189 1.837a.75.75 0 0 0 .965 1.149l3.788-3.18a.747.747 0 0 0 .21-.284.75.75 0 0 0-.17-.945L13.77 4.762a.75.75 0 1 0-.964 1.15l2.331 1.955H6.22A.75.75 0 0 0 6 7.9a4 4 0 1 0 1.477 7.718l-.344-1.489A2.5 2.5 0 1 1 6.039 9.4l-.008-.032h8.927z"></path></svg>'
		},

		media: {
			i: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z"></path></svg>',
			v: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M18.68 2.53c.6 0 .59-.03.59.55v12.84c0 .59.01.56-.59.56H1.29c-.6 0-.59.03-.59-.56V3.08c0-.58-.01-.55.6-.55h17.38zM15.77 14.5v-10H4.2v10h11.57zM2 4v1h1V4H2zm0 2v1h1V6H2zm0 2v1h1V8H2zm0 2v1h1v-1H2zm0 2v1h1v-1H2zm0 2v1h1v-1H2zM17 4v1h1V4h-1zm0 2v1h1V6h-1zm0 2v1h1V8h-1zm0 2v1h1v-1h-1zm0 2v1h1v-1h-1zm0 2v1h1v-1h-1zM7.5 6.677a.4.4 0 0 1 .593-.351l5.133 2.824a.4.4 0 0 1 0 .7l-5.133 2.824a.4.4 0 0 1-.593-.35V6.676z"></path></svg>'
		},

		color: {
			b: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M10.126 2.268L2.002 13.874l1.895 1.852 2.521 1.402L14.47 5.481l-1.543-2.568-2.801-.645z" style="fill: #FFFFFF"></path><path d="M4.5 18.088l-2.645-1.852-.04-2.95-.006-.005.006-.008v-.025l.011.008L8.73 2.97c.165-.233.356-.417.567-.557l-1.212.308L4.604 7.9l-.83-.558 3.694-5.495 2.708-.69 1.65 1.145.046.018.85-1.216 2.16 1.512-.856 1.222c.828.967 1.144 2.141.432 3.158L7.55 17.286l.006.005-3.055.797H4.5zm-.634.166l-1.976.516-.026-1.918 2.002 1.402zM9.968 3.817l-.006-.004-6.123 9.184 3.277 2.294 6.108-9.162.005.003c.317-.452-.16-1.332-1.064-1.966-.891-.624-1.865-.776-2.197-.349zM8.245 18.5L9.59 17h9.406v1.5H8.245z"></path></svg>',
			c: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path style="fill: #fff" d="M10.798 1.59L3.002 12.875l1.895 1.852 2.521 1.402 6.997-12.194z" style="fill: var(--ck-highlight-marker-yellow);"></path><path d="M2.556 16.727l.234-.348c-.297-.151-.462-.293-.498-.426-.036-.137.002-.416.115-.837.094-.25.15-.449.169-.595a4.495 4.495 0 0 0 0-.725c-.209-.621-.303-1.041-.284-1.26.02-.218.178-.506.475-.862l6.77-9.414c.539-.91 1.605-.85 3.199.18 1.594 1.032 2.188 1.928 1.784 2.686l-5.877 10.36c-.158.412-.333.673-.526.782-.193.108-.604.179-1.232.21-.362.131-.608.237-.738.318-.13.081-.305.238-.526.47-.293.265-.504.397-.632.397-.096 0-.27-.075-.524-.226l-.31.41-1.6-1.12zm-.279.415l1.575 1.103-.392.515H1.19l1.087-1.618zm8.1-13.656l-4.953 6.9L8.75 12.57l4.247-7.574c.175-.25-.188-.647-1.092-1.192-.903-.546-1.412-.652-1.528-.32zM8.244 18.5L9.59 17h9.406v1.5H8.245z"></path></svg>',
			r: '<svg version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20"><path d="M8.636 9.531l-2.758 3.94a.5.5 0 0 0 .122.696l3.224 2.284h1.314l2.636-3.736L8.636 9.53zm.288 8.451L5.14 15.396a2 2 0 0 1-.491-2.786l6.673-9.53a2 2 0 0 1 2.785-.49l3.742 2.62a2 2 0 0 1 .491 2.785l-7.269 10.053-2.147-.066z"></path><path d="M4 18h5.523v-1H4zm-2 0h1v-1H2z"></path></svg>'
		}
	}
	*/
	var _Icons = {
		fonts: {
			b: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/text_bold.png);"></div>',
			i: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/text_italic.png);"></div>',
			u: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/text_underline.png);"></div>',
			s: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/text_strikethroungh.png);"></div>'
		},
		texta: {
			l: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/text_align_left.png);"></div>',
			r: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/text_align_right.png);"></div>',
			c: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/text_align_center.png);"></div>',
			f: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/text_align_justity.png);"></div>'
		},
		fontf: {
			f: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/font.png);"></div>',
			s: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/style.png);"></div>'
		},
	
		ur: {
			u: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/Content/images/undo24.png);"></div>',
			r: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/Content/images/redo24.png);"></div>'
		},
		media: {
			i: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/picture_add.png);"></div>',
			v: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/image_add.png);"></div>',
			chain: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/chain.png);"></div>'
		},
		color: {
			b: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/fill_color.png);"></div>',
			c: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/font_colors.png);"></div>',
			r: '<div class="te-bar-icon" style="background-image: url(http://dev.studylab.info/alex/img/rt/clear_formatting.png);"></div>'
		}
	}

	var _Check = {
		b: function(node){
			if(node.tagName == 'B'
				|| node.tagName == 'STRONG'
				|| node.style.fontStyle == 'bolder')
				return true;
			else
				return false;
		},
		i: function(node){
			if(node.tagName == 'I'
				|| node.tagName == 'EM'
				|| node.style.fontStyle == 'italic')
				return true;
			else
				return false;
		},
		u: function(node){
			if(node.tagName == 'U'
				|| node.style.textDecorationLine == 'underline')
				return true;
			else
				return false;
		},
		s: function(node){
			if(node.tagName == 'STRIKE')
				return true;
			else
				return false;
		},
		texta: function(node, type){
			if(node.style.textAlign == type || node.style.align == type || node.align == type)
				return true;
			else
				return false;
		},
		fontf: {
			f: function(node){

			},
			s: function(node){

			}
		}
	}

	var _Funct = {
		media: {
			i: function(e){

				var fileInput = document.getElementById('te-input-image')
				if (fileInput == null) {
					fileInput = document.createElement('input');
					fileInput.id = 'te-input-image';
					fileInput.style.display = 'none';
					fileInput.setAttribute('type', 'file');
					fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
					fileInput.addEventListener('change', function () {

						SEL.saveRange();


						if(_functions.uploadImage){

							if (fileInput.files != null && fileInput.files[0] != null) {
								var callbackuploadimage = function(url){
									var img = document.getElementById('te-temp');
									if(url){
										SEL.restore();
										img.id = '';
										img.src = url;
									} else {
										tools.destroyHTML(img);
									}
								}

								tools.pasteHtmlAtCaret( '<img id="te-temp" alt="' + fileInput.files[0].name + '"  title="' + fileInput.files[0].name + '" />');
								_functions.uploadImage(e, callbackuploadimage, fileInput);
							}
						}
						/*
						if (fileInput.files != null && fileInput.files[0] != null) {
							var reader = new FileReader();
							reader.onload = function (e) {

								if(_functions.uploadImage){

									var callbackuploadimage = function(url){
										SEL.restore();
										var img = document.getElementById('te-temp');
										img.id = '';
										img.src = url;
									}

									tools.pasteHtmlAtCaret( '<img id="te-temp" />');
									_functions.uploadImage(e, callbackuploadimage, fileInput);
								}
							};
						//	reader.readAsDataURL(fileInput.files[0]);
							reader.readAsText(fileInput.files[0]);
						}
						*/
					});
					_te.html.bar.appendChild(fileInput);
		 			}
				fileInput.click();
			},
			v: function(n){
				var fileInput = document.getElementById('te-input-video')
				if (fileInput == null) {
					fileInput = document.createElement('input');
					fileInput.id = 'te-input-video';
					fileInput.style.display = 'none';
					fileInput.setAttribute('type', 'file');
					fileInput.multiple = true;
					fileInput.setAttribute('accept', 'video/mp4, video/mpeg, video/mpg, video/webm, video/wmv, video/m4v, video/mkv, video/vob, video/avi');
					fileInput.addEventListener('change', function () {

						SEL.saveRange();

						if(_functions.uploadVideo){

							if (fileInput.files != null && fileInput.files[0] != null) {
								var callbackuploadvideo = function(url){
									var video = document.getElementById('te-temp');
									if(url){
										SEL.restore();
										video.id = '';
										video.src = url;
									} else {
										tools.destroyHTML(video);
									}
								}

								tools.pasteHtmlAtCaret( '<div style="display: inline-block; max-width: 100%;"><video id="te-temp" controls/></div>');
								_functions.uploadVideo(e, callbackuploadvideo, fileInput);
							}
						}
						/*
						if (fileInput.files != null && fileInput.files[0] != null) {
							var reader = new FileReader();
						
							reader.onload = function (e) {

								if(_functions.uploadVideo){

									var callbackuploadvideo = function(url){
										SEL.restore();
										var video = document.getElementById('te-temp');
										video.id = '';
										video.src = url;
									}

									tools.pasteHtmlAtCaret( '<div style="display: inline-block; max-width: 100%;"><video id="te-temp" controls/></div>');
									_functions.uploadVideo(e, callbackuploadvideo, fileInput);
								}
							};
						//	reader.readAsDataURL(fileInput.files[0]);
							reader.readAsText(fileInput.files[0]);
						}
						*/
					});
					_te.html.bar.appendChild(fileInput);
		 			}
				fileInput.click();	
			}
		},
		color: function( n ) {
			var innerContainer = _te.html.main.getBoundingClientRect();
			var buttonPlace = _te.buttons['color'][ n ].getBoundingClientRect();

			CREATE.palette(
				{
					x: buttonPlace.left,
					y: buttonPlace.bottom 
				},
				_buttons.color[ n ]
			);
		},
		colorr: function(){
			document.execCommand('removeFormat', 0, 0 );
			if(_te.html.text.innerText == '' ||  _te.html.text.innerText == '\n' || _te.html.text.innerText == '\r\n')
				_te.html.text.innerHTML = '';
		},
		fontf: function( n ){
			var innerContainer = _te.html.main.getBoundingClientRect();
			var buttonPlace = _te.buttons['fontf'][ n ].getBoundingClientRect();
			CREATE.panel(
				{
					x: buttonPlace.left,
					y: buttonPlace.bottom
				},
				_buttons.fontf[ n ]
			);
		},
		fonts: function(e, b, n){
			e.preventDefault();
			e.stopPropagation();
			EVENTS.click.buttons( b, n ); 
		},
		texta: function(e, b, n){
			e.preventDefault();
			e.stopPropagation();
			EVENTS.click.buttons( b, n ); 
		},
	}

	var _buttons = {
		// undo redo
		/*
		ur : {
			// undo
			u: { name: 'u', icon: _Icons.ur.u, f: function(e){ _Funct.texta( e, 'ur', 'u' ); }, c: function(){ return false; }, tag: 'undo' },
			// redo
			r: { name: 'r', icon: _Icons.ur.r, f: function(e){ _Funct.texta( e, 'ur', 'r' ); }, c: function(){ return false; }, tag: 'redo' }
		},
		*/
		// font style
		fonts : {
			b: { name: 'b', icon: _Icons.fonts.b, f: function(e){ _Funct.fonts( e, 'fonts', 'b' ); }, c: _Check.b, title: 'Bold', tag: 'bold' },
			i: { name: 'i', icon: _Icons.fonts.i, f: function(e){ _Funct.fonts( e, 'fonts', 'i' ); }, c: _Check.i, title: 'Italic', tag: 'italic' },
			u: { name: 'u', icon: _Icons.fonts.u, f: function(e){ _Funct.fonts( e, 'fonts', 'u' ); }, c: _Check.u, title: 'Underline', tag: 'underline' },
			s: { name: 's', icon: _Icons.fonts.s, f: function(e){ _Funct.fonts( e, 'fonts', 's' ); }, c: _Check.s, title: 'Strike', tag: 'strikeThrough' }
		},
		// text align
		texta : {
			// l - left, r - right, c - center, j - full
			l: { name: 'l', icon: _Icons.texta.l, f: function(e){ _Funct.texta( e, 'texta', 'l' ); }, title: 'Align left',		c: function(node){ return _Check.texta( node, 'left');	},	tag: 'justifyLeft'  },
			c: { name: 'c', icon: _Icons.texta.c, f: function(e){ _Funct.texta( e, 'texta', 'c' ); }, title: 'Align center',	c: function(node){ return _Check.texta( node, 'center');	},	tag: 'justifyCenter' },
			r: { name: 'r', icon: _Icons.texta.r, f: function(e){ _Funct.texta( e, 'texta', 'r' ); }, title: 'Align right',		c: function(node){ return _Check.texta( node, 'right');	},	tag: 'justifyRight' },
			j: { name: 'j', icon: _Icons.texta.f, f: function(e){ _Funct.texta( e, 'texta', 'j' ); }, title: 'Align full',		c: function(node){ return _Check.texta( node, 'justify');	},	tag: 'justifyFull' }
		},
		// font family
		fontf : {
			// font family
			f: {
				name:'f',
				title: 'Font family',
				icon: _Icons.fontf.f,
				f: function(){ _Funct.fontf('f')},
				c: _Check.fontf.f,
				tag: 'fontName',
				list: [ 'Serif', 'Sans', 'Sans-Serif', 'Arial', 'Arial Black', 'Courier', 'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times New Roman', 'Verdana' ]
			},
			// font size
			s: {
				name: 's',
				title: 'Font size',
				icon: _Icons.fontf.s,
				f: function(){ _Funct.fontf('s')},
				c: _Check.fontf.s,
				tag: 'fontSize',
				list: [ '1', '2', '3', '4', '5', '6', '7' ]
			}
		},
		// colors
		color : {
			// background color
			b: { name: 'b', icon: _Icons.color.b, f: function(){ _Funct.color('b')}, c: function(){ return false; }, tag: 'backColor', title: 'Fill color', default: 'inherit' },
			// font color
			c: { name: 'c', icon: _Icons.color.c, f: function(){ _Funct.color('c')}, c: function(){ return false; }, tag: 'foreColor', title: 'Font color', default: 'inherit' },
			// remove format
			r: { name: 'r', icon: _Icons.color.r, f: function(){ _Funct.colorr() }, c: function(){ return false; }, tag: 'removeFormat', title: 'Remove format' }
		},
		// images and videos
		media : {
			//image
			i: { name: 'i', icon: _Icons.media.i, f: _Funct.media.i, c: function(){ return false; }, title: 'Add image', tag: 'insertImage' },
			//video
			v: { name: 'v', icon: _Icons.media.v, f: _Funct.media.v, c: function(){ return false; }, title: 'Add video', tag: 'Inserthtml' },
		},
	}



	link.create(options);
}