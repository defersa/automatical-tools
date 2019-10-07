function question_ui(options){

	var _QE;

	var _main;

	var _functions;
	var _setting;
	var _timer;
	var _fragment = document.createDocumentFragment();

	var link = this;

	link.create = function(options){
		if(!options)		options = {};
		if(_main)			link.remove();

		_functions = {};
		_setting = {};

		CREATE.main();

		link.change(options);
	}

	link.remove = function(options){
		if(_QE){
			tools.destroyHTML(_QE.html);

			_functions = undefined;
			_setting = undefined;
			_main = undefined;
			_QE = undefined;
		}
	}

	link.change = function(options){

		if(!options)		options = {};

		if(options.parent !== undefined)			SET.parent(options);
		if(options.functions !== undefined)			SET.functions(options);

		if(options.object !== undefined)			SET.node(options.object);
	}

	link.moveHeaderFix = function(scrollTop, top){
		
		if(_QE.headerfix){
			var height = _QE.html.offsetHeight;
			
			if(scrollTop > top && scrollTop < top + height){
	
				_QE.headerfix.style.display = 'block';

				var questionHeight = options.parent.offsetHeight;

				if(questionHeight < scrollTop - top + _QE.headerfix.cHeight){
					_QE.headerfix.style.top = (questionHeight - _QE.headerfix.cHeight) + 'px';
				} else {
					_QE.headerfix.style.top = (scrollTop - top - 1) + 'px';
				}
			} else {
				_QE.headerfix.style.display = 'none';
			}
		}
	}


	link.getParent = function(){
		return _setting.parent;
	}

	var GET = {
	}

	var CREATE = {
		main: function(){
			_QE = {};

			_QE.html = tools.createHTML({
				tag: 'div',
				className: 'qe-main'
			});

			_QE.header = {};
			_QE.header.value = '';
			_QE.header.html = tools.createHTML({
				tag: 'div',
				className: 'qe-header',
				parent: _QE.html,
				innerHTML: _QE.header.value
			});

			_QE.hint = {};
			_QE.hint.value = '';
			_QE.hint.html = tools.createHTML({
				tag: 'div',
				className: 'qe-hint',
				parent: _QE.html,
				innerHTML: _QE.hint.value
			});
		},
		headerfix: function(text){
			_QE.headerfix = tools.createHTML({
				tag: 'div',
				className: 'qe-headerfix',
				parent: _QE.html,
				innerHTML: text
			});
			_QE.headerfix.cHeight = _QE.headerfix.offsetHeight;
			_QE.headerfix.style.display = 'none';
		}
	}

	var SET = {
		parent: function(options){
			_setting.parent = options.parent;

			if(options.parent instanceof Node)
				options.parent.appendChild(_QE.html);
			else
				_fragment.appendChild(_QE.html)
		},
		functions: function(options){
		},		
		node: function(object){
			_QE.object = object;

			if(object.xHeader)	_QE.header.value = object.xHeader;
			_QE.header.html.innerHTML = _QE.header.value;

			if(object.xHint)	_QE.hint.value = object.xHint;
			_QE.hint.html.innerHTML = _QE.hint.value;

			if(!_QE.hint.value || _QE.hint.value == '') 	_QE.hint.html.style.display = 'none';
			else											_QE.hint.html.style.display = 'block';

			_QE.wrap = tools.createHTML({
				tag: 'div',
				parent: _QE.html,
				className: 'qe-wrap'
			});

			_QE.container = tools.createHTML({
				tag: 'div',
				style: 'width: 100%',
				parent: _QE.wrap,
				className: 'qe-container'
			});

			var q = {}

			q.items = [];
			q.reset = [];

			q.parent = _QE.container;
			q.type = (object.xType) ? object.xType.toLowerCase() : 'radiobutton';

			q.extend;
			q.header;

			q.textwidth = object.xTextWidth;
			q.endtextwidth = object.xEndTextWidth;

			q.orientation = (object.xOrientation) ? (object.xOrientation + '').toLowerCase() : undefined;
			q.cornertext = object.xCornerText;

			q.text = object.xText;
			q.endtext = object.xEndText;

			// parse children

			object.children.forEach(function(item){
				
				var tagName = item.xName.toLowerCase();

				if(tagName == 'answer'){

					/*
					if(item.xReset && (item.xReset + '').toLowerCase() == 'true'){
						q.reset.push({
							text: item.xText,
							title: item.xTitle,
							id: item.xId,
							endtext: item.xEndText,
							type: (item.xType) ? (item.xType + '').toLowerCase() : undefined
						});
						// endtext: item.xEndText 
					}
					*/
					var isolate = '0';
					if(item.children){
						item.children.forEach(function(answeritem){
							if(answeritem.xName.toLowerCase() == 'ui' && answeritem.xIsolate)
								isolate = answeritem.xIsolate;
						})
					}
					
					q.items.push({
						text: item.xText,
						title: item.xTitle,
						id: item.xId,
						endtext: item.xEndText,
						reset: item.xReset ? (item.xReset + '').toLowerCase() : '',
						isolate: isolate,
						type: (item.xType) ? (item.xType + '').toLowerCase() : ''
					});
				}

				if(tagName == 'ui'){

					if(item.xHeaderFix !== undefined)
						CREATE.headerfix(object.xHeader);


					q.extend = (item.xExtend) ? item.xExtend.toLowerCase() : undefined;
					q.uitype = (item.xType) ? item.xType.toLowerCase() : undefined;

					/* COMBOBOX */
					q.search = item.xSearch;
					q.ulabel = item.xLabel;

					/* CONTENT ONLY */			
					q.cols = item.xCols;

					/* DRAG ITEM */
					// target container
					q.tContainer = (item.xTargetContainer) ? item.xTargetContainer.split(',').map(function(el){ return parseFloat( el ); }) : [ 0, 0 ];
					q.sContainer = (item.xSourceContainer) ? item.xSourceContainer.split(',').map(function(el){ return parseFloat( el ); }) : [ 0, 0 ];

					q.labeltop = item.xLabelTop;
					q.startlabel = item.xLabelStart ? item.xLabelStart : '';
					q.endlabel = item.xLabelEnd ? item.xLabelEnd : '';

					/* SLIDER RANGE */

					q.maxval = (item.xMaxVal) ? parseInt(item.xMaxVal) : 100;
					q.minval = (item.xMinVal) ? parseInt(item.xMinVal) : 0;

					/* SLIDER */

					q.valueshow = item.xValueShow;
					q.valueshowselected = item.xValueShowSelected;
					q.step = item.xStep;

					/* SCALE */
					q.gradient = item.xGradient;
					q.gradientcolor =
						item.xGradientColors
						? item.xGradientColors.replace(/[^.,;\d]+/g,"").split(';').map(function(item){ return item.split(','); })
						: [[ 250, 5, 5, 0.5],[ 200, 200, 200, 0.5],[ 50, 200, 50, 0.5]];


					/* IMAGES AND MEDIA*/
					q.src = item.xSrc ? item.xSrc.split(',') : [];

					/* CLICKTEXT */
					q.background = item.xSelectedBackgroundColor;
					q.color = item.xSelectedFontColor;

					/* SLIDER */
					q.startposition = item.xStartPosition;


					/* MEDIA */
					q.playauto				= item.xPlayAuto ?				item.xPlayAuto				: '0';
					q.pauseenable			= item.xPauseEnable ?			item.xPauseEnable			: '0';
					q.playredirect			= item.xPlayRedirect ?			item.xPlayRedirect			: '0';
					q.seekenable 			= item.xSeekEnable ?			item.xSeekEnable			: '0';
					q.volumeenable 			= item.xVolumeEnabled ?			item.xVolumeEnabled 		: '1';
					q.likeenable			= item.xButtonLikeEnable ?		item.xButtonLikeEnable		: '0';
					q.dislikeenable			= item.xButtonDislikeEnable ?	item.xButtonDislikeEnable	: '0';
					q.boringenable			= item.xButtonBoringEnable ?	item.xButtonBoringEnable	: '0';
					q.liketext				= item.xButtonLikeText ?		item.xButtonLikeText		: 'Нравится';
					q.disliketext			= item.xButtonDislikeText ?		item.xButtonDislikeText		: 'Не нравится';
					q.boringtext			= item.xButtonBoringText ?		item.xButtonBoringText		: 'Затянуто';

				}

				if(tagName == 'holder'){
					q.holder = {};
					q.holder.text = item.xInnerText;
					q.holder.align = item.xAlign;
				}
			});

			q.questions = [{}];
			if(object.union){
				q.questions = [];
				object.union.forEach(function(item){
					if(item.xName.toLowerCase() == 'question'){
						q.questions.push({
							text: item.xText,
							id: item.xId,
							type: ((item.xType) ? item.xType.toLowerCase() : q.type),
							select: []
						});
					}
				})
			}

			if(q.extend == undefined){
				if(q.questions.length > 1){
					TABLE(q);
				} else {
					LINE(q);
				}
			} else if(q.extend == 'slider'){
				SLIDER(q);
			} else if(q.extend == 'dragitem'){
				DRAG(q);
			} else if(q.extend == 'contentonly'){
				CONTENTONLY(q);
			} else if(q.extend == 'scale'){
				SCALE(q);
			} else if(q.extend == 'combobox'){
				COMBOBOX(q);
			} else if(q.extend == 'clicktext'){
				CLICKTEXT(q);
			} else if(q.extend == 'clicktest'){
				CLICKTEST(q);
			} else if(q.extend == 'mediaplayer'){
				MEDIA(q);
			}

			if(q.holder){
				HOLDER(q);
			}

		}
	}

	var HOLDER = function(options){
		var hwidth = options.holder.width ? options.holder.width : 30;
		var width = 100 - hwidth;
		var hold = tools.createHTML({
			tag: 'div',
			className: 'qe-holder',
			style: 'width: ' + hwidth + '%;',
			innerHTML: options.holder.text
		});
		_QE.container.style.width = width + '%';
		if(options.holder.align == 'right')		_QE.wrap.appendChild(hold);	 
		else									_QE.wrap.insertBefore(hold, _QE.container);
	
		return hold;
	}

	var LINE = function(options){
		var self;

		this.create = function(options){
			self = {};

			self.items = options.items;
			self.type = options.type;
			self.orientation = options.orientation;
			self.width = options.textwidth;
			self.endtextwidth = options.endtextwidth ? options.endtextwidth : 0;

			if(self.orientation == 'horizontal'){
				self.main = tools.createHTML({
					tag: 'div',
					className: 'qe-line-main-horizontal',
					parent: options.parent
				});
			} else {
				self.main = tools.createHTML({
					tag: 'div',
					className: 'qe-line-main-vertical',
					parent: options.parent
				});
			}
			
			var hasline = ((self.type == 'radiobutton' || self.type == 'checkbox') && self.orientation !== 'horizontal') ? true : false;

			self.line = {};
			self.line.items = [];
			self.items.forEach(function(item){

				var isolate = item.isolate;
				if( (self.type == 'text' || self.type == 'memo' || self.type == 'number' || self.type == 'integer') && item.reset == 'true'){
					isolate = '1';
				}


				if(isolate == '1'){
					self.line.items.push(
						TYPES.isolate(options.parent, CLICK.item, item)
					);
				} else {
					if(item.title && options.orientation !== 'horizontal'){
						var title = tools.createHTML({
							tag: 'div',
							className: 'qe-line-title',
							// horizontal line
							style: (hasline) ? 'border-bottom: 1px solid #d2d2d2;' : '',
							parent: self.main,
							innerHTML: item.title
						});
					}
	
					var AWidth = self.width;
					var EWidth = self.endtextwidth;
					var CWidth = 0;
	
					var visual = tools.createHTML({
						tag: 'div',
						className: 'qe-line-answer',
						link: item,
						parent: self.main
					});
					self.line.items.push(visual);

					if( hasline )
						visual.style.cssText = (self.line.items.length == 1 ? 'border-top: 1px solid #d2d2d2; ' : '') + 'border-bottom: 1px solid #d2d2d2;'


					if(!item.text || item.text == ''){
						AWidth = 0;
					}
	
					visual.answer = tools.createHTML({
						tag: 'div',
						className: 'qe-line-answer-text',
						style: 'width: ' + AWidth + '%;', 
						parent: visual,
						innerHTML: item.text 
					});
	
					var control = tools.createHTML({
						tag: 'div',
						className: 'qe-line-answer-control',
						parent: visual,
					});
	
					if(item.endtext){
						var endtext = tools.createHTML({
							tag: 'div',
							className: 'qe-line-answer-endtext',
							style: EWidth ? ('width:' + EWidth + '%;') : '',
							parent: visual,
							innerHTML: item.endtext
						});
					}
	
					if(AWidth !== 100){
						control.style.width = (100 - AWidth - ( (item.endtext) ? EWidth : 0)) + '%';
					}				
	
					// check types
					if(self.type == 'text' || self.type == 'memo' || self.type == 'number' || self.type == 'integer'){
						if(self.orientation == 'horizontal'){
							control.style.padding = '0.2rem 0.2rem';
						} else {
							control.style.padding = '0.2rem 0';
						}
					}
	
					if(self.type == 'radiobutton'){
						visual.onclick = CLICK.item;						
						TYPES.radio(control);
					} else if(self.type == 'checkbox'){
						visual.onclick = CLICK.item;
						TYPES.check(control);
					} else if(self.type == 'text'){
						visual.inc = TYPES.text(control, CLICK.input, visual);
					} else if(self.type == 'memo'){
						visual.inc = TYPES.memo(control, CLICK.input, visual);
					} else if(self.type == 'number'){
						visual.inc = TYPES.number(control, CLICK.input, visual);
					} else if(self.type == 'integer'){
						visual.inc = TYPES.integer(control, CLICK.input, visual);
					}
				}
			});
		}

		var CLICK = {
			item: function(e){
				var target = tools.closest(e.target, 'qe-line-answer') || tools.closest(e.target, 'qe-isolate');
				var item = target.link;

				if(item.reset && self.type == 'checkbox'){
					if(!target.select){
						SELECT.removeAll();	
						self.unselect = true;	
						SELECT.add(target);	
						CLICK.unselectAll(true);
	
					} else {
						SELECT.removeAll();									
						self.unselect = false;	
						CLICK.unselectAll(false);
					}
				} else if(item.reset && ( self.type == 'text' || self.type == 'memo' || self.type == 'number' || self.type == 'integer')){
					CLICK.reset(target);
				} else {
					if(self.type == 'radiobutton'){
						SELECT.removeAll();
					} 
	
					if(target.select){
						SELECT.remove(target);
					} else if(!self.unselect){
						SELECT.add(target);
					}
				}
			},
			unselectAll: function(type){
				self.line.items.forEach(function(item){
					if(!item.link.reset && type){
						item.style.opacity = '0.5';
						item.style.cursor = 'not-allowed';
						if(item.inc){
							item.inc.disabled = true;
						}
					} else {						
						item.style.opacity = '';
						item.style.cursor = '';
						if(item.inc){
							item.inc.disabled = false;
						}
					}
				});
			},
			reset: function(target){

				if(!target.select){
					SELECT.removeAll();
					CLICK.unselectAll(true);
					SELECT.add(target);
				} else {
					CLICK.unselectAll(false);					
					SELECT.remove(target);		
				}
			},
			input: function(e, target){

				if(target.link.reset){
					if(e.target.value != '' && !target.select){

						SELECT.removeAll();
						SELECT.add(target);
						self.unselect = true;
						CLICK.unselectAll(true);

					} else if(e.target.value == '' && target.select){

						SELECT.remove(target);
						self.unselect = false;	
						CLICK.unselectAll(false);
					}
				} else {
					if(e.target.value != '' && !target.select){
						SELECT.add(target);
					} else if(e.target.value == '' && target.select){					
						SELECT.remove(target);
					}
				}
			}
		}

		var SELECT = new function(){
			this.items = [];

			this.add = function(item){
				if(!item.select){
					item.classList.add('qe-select');
					item.select = true;
					SELECT.items.push(item);

					// whooou, for type "text"
					if(item.link.type == 'text'){
						item.answer.innerHTML = '';
						// '<input click="function(e){ tools.stopProp(e); return false;}" style="margin: 0.2rem" class="qe-text-in"/>';
						var inc = tools.createHTML({
							tag: 'input',
							className: 'qe-text-in',
							parent: item.answer,
							style: 'margin: 0.2rem',
							onclick: function(e){ tools.stopProp(e); return false;}
						})
					}
				}
			}

			this.remove = function(item){
				if(item.select){
					item.classList.remove('qe-select');
					item.select = false;
					SELECT.items.splice( SELECT.items.indexOf(item), 1);

					if(item.link.type == 'text'){
						item.answer.innerHTML = item.link.text;
					}
				}
			}

			this.removeAll = function(){
				for(var i = 0; i < SELECT.items.length; i++){
					SELECT.items[i].classList.remove('qe-select');
					SELECT.items[i].select = false;

					if(SELECT.items[i].inc)
						SELECT.items[i].inc.value = '';

					if(SELECT.items[i].link.type == 'text')
						SELECT.items[i].answer.innerHTML = SELECT.items[i].link.text;

				}
				SELECT.items = [];
			}
		}

		this.create(options);
	}

	var TABLE = function(options){
		var self;

		this.create = function(options){
			self = {};
			self.answers = options.items.concat( options.reset.map(function(item){ item.reset = true;	return item; }) );
			self.questions = options.questions;
			self.type = options.type;
			self.orientation = options.orientation;
			self.width = options.textwidth;

			self.main = tools.createHTML({
				tag: 'table',
				className: 'qe-table-main',
				parent: options.parent
			});

			self.items = [];
			
			self.cols = ((self.orientation == 'horizontal') ? self.answers.length : self.questions.length) + 1;
			self.rows = ((self.orientation == 'horizontal') ? self.questions.length : self.answers.length) + 1;

			var width = (self.width) ? Math.floor((100 - self.width)/(self.cols - 1)) : Math.floor(100/self.cols) ;

			for(var i = 0; i < self.rows; i++){
				var row = tools.createHTML({
					tag: 'tr',
					className: 'qe-table-row',
					parent: self.main
				});
				self.items.push([]);
				for(var j = 0; j < self.cols; j++){
					var cell = tools.createHTML({
						tag: 'td',
						className: 'qe-table-cell',
						style: 'width:' + width + '%;',
						parent: row
					});
					self.items[i].push(	cell );
					if(i != 0)	cell.style.borderTop = '1px solid lightgrey';
					if(j != 0)	cell.style.borderLeft = '1px solid lightgrey';
				}
			}
			for(var i = 1; i < self.rows; i++){
				var item = self.items[i][0];
				item.className = 'qe-table-header';
				item.style.textAlign = 'left';
				if(self.orientation == 'horizontal'){
					item.innerHTML = self.questions[i - 1].text || '';
					self.questions[i - 1].html = item;
				} else {

					if(self.answers[i - 1].title){
						var title = tools.createHTML({
							tag: 'tr',
							innerHTML: '<td class="qe-table-title" colspan="' + self.cols + '">' + self.answers[i - 1].title + '</td>'
						})
						item.parentNode.parentNode.insertBefore(title, item.parentNode);
					}

					item.innerHTML = self.answers[i - 1].text || '';
				}
				if(self.width){
					item.style.minWidth = self.width + '%';
					item.style.width = self.width + '%';
				}
			}
			
			if(options.cornertext)
				self.items[0][0].innerHTML = options.cornertext;
			
			for(var i = 1; i < self.cols; i++){
				self.items[0][i].className = 'qe-table-header';
				if(self.orientation == 'horizontal'){
					self.items[0][i].innerHTML = self.answers[i - 1].text || '';
				} else {
					self.items[0][i].innerHTML = self.questions[i - 1].text || '';
					self.questions[i - 1].html = self.items[0][i];
				}
			}
			for(var i = 1; i < self.rows; i++){
				for(var j = 1; j < self.cols; j++){
					var item = self.items[i][j];
					var question = (self.orientation == 'horizontal') ? self.questions[i - 1] : self.questions[j - 1];
					var answer = (self.orientation == 'horizontal') ? self.answers[j - 1] : self.answers[i - 1];
					var type = question.type;
				
					if(!question.items) question.items = [];

					question.items.push(item);

					var control = tools.createHTML({
						tag: 'div',
						className: 'qe-table-answer',
						parent: item
					})
					item.question = question;
					item.answer = answer;
					item.control = control;
					item.link = answer;
					var visual;


					if(type == 'radiobutton'){
						TYPES.radio(control);

						item.onclick = CLICK.item;

					} else if(type == 'checkbox'){
						
						item.onclick = CLICK.item;
						TYPES.check(control);


					} else if(type == 'text'){
						item.inp = TYPES.text(control, CLICK.input, item);
					} else if(type == 'memo'){
						item.inp = TYPES.memo(control, CLICK.input, item);
					} else if(type == 'number'){
						item.inp = TYPES.number(control, CLICK.input, item);
					} else if(type == 'integer'){
						item.inp = TYPES.integer(control, CLICK.input, item);
					}

					if(answer.endtext){
						var endtext = tools.createHTML({
							tag: 'div',
							className: 'qe-table-answer-endtext',
							parent: control,
							innerHTML: answer.endtext
						});
					}
				}
			}
		}

		var CLICK = new function(){
			this.item = function(e){				
				var target = tools.closest(e.target, 'qe-table-cell');
				if(target.question.type == 'radiobutton'){
					SELECT.removeAll(target);
				} else if(target.link.reset){
					if(target.select){
						CLICK.unselectAll(target.question, false)
						target.question.unselect = false;
					} else {
						target.question.unselect = true;
						CLICK.unselectAll(target.question, true)
						SELECT.removeAll(target);
					}
				}
				if(!target.question.unselect || target.link.reset){
					if(target.select){
						SELECT.remove(target);
					} else {
						SELECT.add(target);
					}
				}
				CLICK.checkQuest(target);
			};
			this.input = function(e, target){
				/*
				if(e.target.value != '' && !target.select){
					SELECT.add(target);
				} else if(e.target.value == '' && target.select){
					SELECT.remove(target);
				}
				*/
				if(target.link.reset){
					if(e.target.value != '' && !target.select){

						SELECT.removeAll(target);

						target.question.unselect = true;

						SELECT.add(target);

						CLICK.unselectAll(target.question, true);

					} else if(e.target.value == '' && target.select){

						SELECT.remove(target);

						target.question.unselect = false;
	
						CLICK.unselectAll(target.question, false);
					}
				} else if(!target.question.unselect){
					if(e.target.value != '' && !target.select){
						SELECT.add(target);
					} else if(e.target.value == '' && target.select){
						SELECT.remove(target);
					}
				}

				CLICK.checkQuest(target);
			};
			this.unselectAll = function(question, type){
				question.items.forEach(function(item){
					if(!item.link.reset && type){
						item.style.opacity = '0.5';
						item.style.cursor = 'not-allowed';
						if(item.inp){
							item.inp.disabled = true;
						}
					} else {						
						item.style.opacity = '';
						item.style.cursor = '';
						if(item.inp){
							item.inp.disabled = false;
						}
					}
				});
			},
			
			this.checkQuest = function(item){
				if(item.question.select.length){
					item.question.html.className = 'qe-table-header qe-table-header-select';
				} else {
					item.question.html.className = 'qe-table-header';
				}				
			}
		}
		var SELECT = new function(){
			this.items = [];

			this.add = function(item){
				if(!item.select){
					item.className = 'qe-table-cell qe-select';
					item.select = true;
					item.question.select.push(item);
					if(item.link.type == 'text' && !item.inp){
						item.typeText = true;

						var title = (item.answer.text) ? (item.answer.text.split(';'))[1] : ' ';
						title = title ? title : ' ';

						var tempWindow = new window_ui({
							modal: true,
							title: title
						})
						tempWindow.container.style.overflow = 'hidden';

						var input = tools.createHTML({
							tag: 'textarea',
							parent: tempWindow.container,
							style: "width: 100%; height: 100%; box-sizing: border-box;"
						});
						input.focus();

						tempWindow.change({
							functions: {
								cancel: function(){
									SELECT.remove(item);
									tempWindow.remove();
								},
								apply: function(){
									item.control.innerHTML = input.value;
									tempWindow.remove();
								}
							}
						})

					}
					
				}
			}

			function remove(item){
				item.className = 'qe-table-cell';
				item.select = false;

				if(item.typeText){
					item.control.innerHTML = '';
					item.typeText = false;

					if(item.question.type == 'radiobutton'){
						TYPES.radio(item.control);
					} else if(item.question.type == 'checkbox'){
						TYPES.check(item.control);
					}
				}
				if(item.inp){
					item.inp.value = '';
				}
			}

			this.remove = function(item){
				if(item.select){
					remove(item);
					item.question.select.splice( item.question.select.indexOf(item), 1);
					
				}
			}
			this.removeAll = function(item){
				item.question.html.className = 'qe-table-header';
				item.question.select.forEach(function(item){
					remove(item);
				});
				item.question.select = [];
			}
		}

		this.create(options);
	}

	var TYPES = {
		radio: function(html){
			var outc = tools.createHTML({
				tag: 'div',
				className: 'qe-radiobutton-out',
				parent: html
			})
			var inc = tools.createHTML({
				tag: 'div',
				className: 'qe-radiobutton-in',
				parent: outc
			})
		},
		check: function(html){
			var outc = tools.createHTML({
				tag: 'div',
				className: 'qe-checkbox-out',
				parent: html
			})
			var inc = tools.createHTML({
				tag: 'div',
				className: 'qe-checkbox-in',
				parent: outc
			})
		},
		text: function(html, func, item){
			var inc = tools.createHTML({
				tag: 'input',
				className: 'qe-text-in',
				parent: html
			});
			inc.type = 'text';
			inc.oninput = function(e){ func(e, item); };

			return inc;
		},
		memo: function(html, func, item){
			html.style.padding = '0.2rem 0';
			var inc = tools.createHTML({
				tag: 'textarea',
				className: 'qe-memo-in',
				parent: html
			});
			inc.type = 'text';
			inc.oninput = function(e){ func(e, item); };

			return inc;
		},
		number: function(html, func, item){
			html.style.padding = '0.2rem 0';
			var inc = tools.createHTML({
				tag: 'input',
				className: 'qe-text-in',
				parent: html
			});
			inc.type = 'number';
			inc.oninput = function(e){ func(e, item); };

			return inc;
		},
		integer: function(html, func, item){
			html.style.padding = '0.2rem 0';
			var inc = tools.createHTML({
				tag: 'input',
				className: 'qe-text-in',
				parent: html
			});
			inc.type = 'number';
			inc.oninput = function(e){ func(e, item); };
			
			inc.onkeydown = function(e){
				var kc = e.keyCode;
				if (kc == 190 || kc == 191 || kc == 110 || kc == 69 || kc == 188 || kc == 189 || kc == 109 || kc == 187 || kc == 107) { 
					return false;
				}
			}

			return inc;
		},
		reset: function(parent, func, item){
			var visual = {};
			visual.outer = tools.createHTML({
				tag: 'div',
				parent: parent,
				className: "qe-ureset"
			});
			visual.inner = tools.createHTML({
				tag: 'div',
				parent: visual.outer,
				onclick: func,
				className: 'qe-reset',
				innerHTML: item.text
			});
			return visual;
		},
		isolate: function(parent, event, item){
			var visual = tools.createHTML({
				tag: 'div',
				parent: parent,
				link: item,
				className: "qe-isolate"
			});
			var inner = tools.createHTML({
				tag: 'div',
				parent: visual,
				onclick: event,
				className: 'qe-reset',
				innerHTML: item.text
			});
			return visual;
		}
	}

	var COMBOBOX = function(options){
		var self;

		this.create = function(options){
			self = {};
			self.answers = [];
			self.reset = [];
			self.label = options.ulabel ? options.ulabel : "Выберите";
			self.type = options.type;
			self.orientation = options.orientation;

			self.main = tools.createHTML({
				tag: 'div',
				className: 'qe-combo-main',
				onclick: CLICK.main,
				parent: options.parent
			});

			if(options.type == 'radiobutton'){
				self.main.className += ' qe-combo-radio-close';
			}

			self.input = tools.createHTML({
				tag: 'input',
				className: 'qe-combo-input',
				parent: self.main
			});

			if(options.search == '1'){
				self.input.oninput = SEARCH.oninput;
			} else {
				self.input.disabled = 'true';
			}
		
			self.input.autocomplete = 'off';
			self.input.placeholder = self.label;

			var wrap = tools.createHTML({
				tag: 'div',
				className: 'qe-combo-wrap',
				parent: options.parent
			})
			self.panel = tools.createHTML({
				tag: 'div',
				className: 'qe-combo-panel',
				parent: wrap
			});

			options.items.forEach(function(item){
				var answer = {};
				answer.item = item;
				answer.html = tools.createHTML({
					tag: 'div',
					parent: self.panel,
					className: 'qe-combo-p-answer',
					link: item,
					innerHTML: item.text
				});
				self.answers.push(answer)
			});

			options.reset.forEach(function(item){
				self.reset.push( TYPES.reset(options.parent, CLICK.reset, item) );

			});
		}

		var CLICK = {
			main: function(e){
				if(self.unselect) return;

				var hidePanel = function(e){


					var main = tools.closest(e.target, 'qe-combo-main');
					var target = tools.closest(e.target, 'qe-combo-p-answer');

					if(target){
						SEARCH.clear();
						if(self.type == 'checkbox'){
							SELECT.add(target);
							return false;
						} else {
							SELECT.removeAll();
							SELECT.add(target);
						}
					}
					if(main == self.main){
						return;
					}

					self.panel.style.display = 'none';
					self.main.className = 'qe-combo-main qe-combo-radio-close';
					window.removeEventListener('mousedown', hidePanel);
				}
				self.main.className = 'qe-combo-main qe-combo-radio-open';
				self.panel.style.display = 'block';
				window.addEventListener('mousedown', hidePanel);
				return false;
			},
			reset: function(e){
				if(!self.unselect){
					SELECT.removeAll();
					self.main.style.opacity = '0.5';
					self.unselect = true;
					e.target.className = 'qe-sc-reset qe-reset-select';
					
				} else {
					self.main.style.opacity = '1';
					self.unselect = false;
					e.target.className = 'qe-sc-reset';
				}
			}
		}

		var SELECT = new function(){
			this.items = [];

			this.add = function(item){
				if(!item.select){
					
					// some piece of shit
					self.input.placeholder = '';

					SELECT.items.push(item);
					item.select = true;
					item.style.display = 'none';

					item.avatar = tools.createHTML({
						tag: 'div',
						className: 'qe-combo-avatar',
						innerHTML: item.link.text
					});
					self.main.insertBefore(item.avatar, self.main.children[0] );

					if(self.type == 'checkbox'){
						item.avatar.className = 'qe-combo-avatar-check';
						item.avatar.onclick = function(){
							SELECT.remove(item);
						}
					}
				}
			}
			this.remove = function(item){
				if(item.select){
					item.select = false;
					item.style.display = 'block';
					SELECT.items.splice( SELECT.items.indexOf(item), 1 );
					tools.destroyHTML(item.avatar);
					item.avatar = undefined;
				}
				if(!SELECT.items.length){					
					// some piece of shit
					self.input.placeholder = self.label;
				}
			}
			this.removeAll = function(){
				SELECT.items.forEach(function(item){
					item.select = false;
					item.style.display = 'block';
					tools.destroyHTML(item.avatar);
					item.avatar = undefined;
				});
				SELECT.items = [];

				self.reset.forEach(function(item){
					item.inner.className = 'qe-sc-reset';
				});

				// some piece of shit
				self.input.placeholder = self.label;
			}
		}

		var SEARCH = new function(){

			this.oninput = function(e){
				findItem((self.input.value + '').toLowerCase());
			}
			function findItem(text){
				self.answers.forEach(function(item){
					if(!item.html.select){
						if(item.item.text.toLowerCase().indexOf(text) === -1 ){
							item.html.style.display = 'none';
						} else {
							item.html.style.display = 'block';
						}
					}
				});
			}
			this.clear = function(){
				self.input.value = '';
				findItem('');
				self.input.focus();
			}
		}

		this.create(options);
	}

	var SLIDER = function(options){
		var warpslider = function(){
			var self;
			const indents = 40;
			const indent = indents/2;
	
			this.create = function(options){
				self = {};
	
				self.position = 0;
				self.type = options.uitype;
				self.items = options.items;
	
				self.startlabel = options.startlabel;
				self.endlabel = options.endlabel;

				self.step = options.step;
	
	
				self.valueshow = options.valueshow;
				self.valueshowselected = options.valueshowselected;
	
				self.reset = [];
	
	
				if(self.type == 'continuous'){
					self.items = [];
					for(var i = options.minval; i <= options.maxval; i++){
						self.items.push({
							id: i,
							text: i + ''
						});
					}
				}
	
				self.value = (options.startposition) ? getPositionById(options.startposition) : 0 ;
				self.length = self.items.length;
				
				self.main = tools.createHTML({
					tag: 'div',
					className: 'qe-sl-main',
					parent: options.parent
				});
	
	
				/* TEXT */
	
				if(options.text){
					self.text = tools.createHTML({
						tag: 'div',
						className: 'qe-sl-text',
						parent: self.main,
						innerHTML: options.text
					});
	
					if(options.textwidth)
						self.text.style.width = options.textwidth + '%';
				}
	
				/* SLIDER */
	
				self.slider = tools.createHTML({
					tag: 'div',
					className: 'qe-sl',
					parent: self.main
				});
	
				self.description = tools.createHTML({
					tag: 'div',
					className: 'qe-sl-description',
					parent: self.slider
				});	
				self.outside = tools.createHTML({
					tag: 'div',
					className: 'qe-sl-outside',
					parent: self.slider
				});			
				self.subs = tools.createHTML({
					tag: 'div',
					className: 'qe-sl-subs',
					onmousedown: SLIDE.downSub,
					parent: self.outside
				});
				self.line = tools.createHTML({
					tag: 'div',
					className: 'qe-sl-line',
					parent: self.subs
				});
				self.arm = tools.createHTML({
					tag: 'div',
					className: 'qe-sl-arm',
					style: 'box-sizing: content-box;',
					onmousedown: SLIDE.downArm,
					parent: self.subs
				});
	
				/* LABEL TOP */
				if(options.labeltop){
					self.description.innerHTML = '<span class="qe-sl-desc-inner">' + self.items[0].text + '</span><span class="qe-sl-desc-inner">' + self.items.last().text + "</span>";
				}
	
				/* TEXT END */	
				if(options.endtext){
					self.endtext = tools.createHTML({
						tag: 'div',
						className: 'qe-sl-endtext',
						parent: self.main,
						innerHTML: options.endtext
					});
	
					if(options.endtextwidth)
						self.endtext.style.width = options.endtextwidth + '%';
				}
	
				/* ITEMS WIDTH */
				self.items.forEach(function(item){
					item.width = tools.getWidth(item.text, '16.875px sans-serif')/2;
				});
	
				options.reset.forEach(function(item){
					self.reset.push( TYPES.reset(options.parent, CLICK.reset, item) );
				});
	
				/* DISCRATE */	
				if(self.type == 'discrete'){
					addLines();
	
				}
	
				SLIDE.initialize();
			}
	
			var addLines = function(){
				self.grid = tools.createHTML({
					tag: 'div',
					className: 'qe-sl-grid',
					parent: self.slider
				});	
	
				var l = self.subs.offsetWidth - indents;
				var step = l/(self.length - 1);
				l = self.slider.offsetWidth;
				self.items.forEach(function(item, i){
					var left = indent + 14 + step*i;
					tools.createHTML({
						tag: "div",
						className: 'qe-sl-grid-line',
						style: "left: " + left + "px;",
						parent: self.grid
					});
					var width = item.width;
					left += - width;
					if(left < 0)						left = 0;
					if(l < left + width*2 - 10)			left = l - width*2 - 10;	
					tools.createHTML({
						tag: "span",
						className: 'qe-sl-grid-text',
						style: "left: " + left + "px;",
						innerHTML: item.text,
						parent: self.grid
					});
				});
			}
	
			var getPositionById = function(id){
				var value = 0;
				self.items.forEach(function(item, i){
					if(item.id == id)
						value = i;
				})
				return value;
			}
	
			var CLICK = new function(){
				this.reset = function(e){
					if(!self.unselect){
						self.main.style.opacity = '0.5';
						self.unselect = true;
						e.target.className = 'qe-sc-reset qe-reset-select';
						
					} else {
						self.main.style.opacity = '1';
						self.unselect = false;
						e.target.className = 'qe-sc-reset';
					}
				}
			}
	
			var SLIDE = new function(){
				var s = {};
	
	
				this.initialize = function(){
					var l = self.subs.offsetWidth - indents;
	
					self.position = self.value*l/(self.length - 1);
					apply(l);
				}
	
				this.downSub = function(e){
	
					if(self.unselect)	return;
	
					var coord = self.subs.getBoundingClientRect();
					var difference = e.pageX - coord.left - indent;
					var l = coord.right - coord.left - indents;
	
					self.position = difference;
	
					apply(l);
				}
	
				this.downArm = function(e){
	
					if(self.unselect)	return;
	
					s.e = e;
					s.p = self.position;
					s.v = self.value;
					s.l = self.subs.offsetWidth - indents;
	
					if(self.valueshow && !s.t){
						s.t = tools.createHTML({
							tag: 'div',
							parent: self.description,
							className: 'qe-sl-tooltip'
						})
					}
		
					window.addEventListener('mousemove', move);
					window.addEventListener('mouseup', up);
	
					return false;
				}
		
				function move(e){				
					var difference = e.pageX - s.e.pageX;
					self.position = s.p + difference;
	
					apply(s.l);
	
					var tcoord = self.arm.getBoundingClientRect();
					var pcoord = self.description.getBoundingClientRect();
	
					if(s.t){
						s.t.innerHTML = self.startlabel + self.items[self.value].text + self.endlabel;
						s.t.style.cssText =  'left: ' + (tcoord.left - pcoord.left + 15) + 'px; bottom: 0;';
					}
				}
	
				function up(e){
					if(!self.valueshowselected && s.t){
						tools.destroyHTML(s.t);
						s.t = undefined;
					}
	
					window.removeEventListener('mousemove', move);
					window.removeEventListener('mouseup', up);
				}
	
				
				function apply(l){
					if(self.position < 0)		self.position = 0;
					if(self.position > l)		self.position = l;
	
					var value = Math.round( self.position * (self.length - 1) / l );
	
					if(self.type == 'discrete' || self.type == 'continuous'){
						self.position = value * l / (self.length - 1);
					}
	
					self.arm.style.cssText = "left: " + (indent + self.position) + 'px; top: 0; box-sizing: content-box;';
					self.line.style.cssText = "width: " + (indent + self.position) + 'px;';
	
	
					if(value != self.value && l != 0){
						self.value = value;
					}
				}
			}
	
			this.create(options);
		}


		if(options.questions.length > 1){
			var parent = options.parent;
			options.questions.forEach(function(item){
				options.parent = tools.createHTML({
					tag: 'div',
					parent: parent,
					className: 'qe-sl-union'
				})
				options.text = item.text;
				warpslider(options);
			})

		} else {
			warpslider(options);
		}
	}

	var DRAG = function(options){
		var self;

		this.create = function(options){

			self = {};
			self.items = options.items;
			self.cols = options.cols;
			self.questions = options.questions;
			self.tContainer = options.tContainer;
			self.sContainer = options.sContainer;
			self.type = options.uitype;
			self.width = (options.width) ? options.width : 100;

			self.main = tools.createHTML({
				tag: 'div',
				className: 'qe-dr-main',
				parent: options.parent
			});

			self.sources = tools.createHTML({
				tag: 'div',
				className: 'qe-dr-sources',
				parent: self.main
			});
			self.target = tools.createHTML({
				tag: 'div',
				className: 'qe-dr-target',
				parent: self.main
			});

			/* QUESTION CARD */

			if(self.type == 'card'){
				self.SOURCE = new CARD();
			} else {
				self.SOURCE = new RANGE();
			}

			TARGET.create();
		}

		var CARD = function(){

			var current;
			var spacer;
			var stack = [];
			var other = [];

			this.create = function(){
				self.card = tools.createHTML({
					tag: 'div',
					className: 'qe-dr-card',
					parent: self.sources
				});

				self.st = tools.createHTML({
					tag: 'div',
					style: 'min-width: ' + self.width + 'px; width: ' + self.width + 'px;',
					className: 'qe-dr-card-st',
					parent: self.card
				});
				spacer = tools.createHTML({
					tag: 'div',
					style: 'min-width: ' + self.width + 'px; width: ' + self.width + 'px;',
					className: 'qe-dr-card-spacer',
					parent: self.card
				});

				self.hq = [];

				self.questions.forEach(function(item, i){
					var visual = {};
					visual.index = i;
					visual.item = item;
					visual.html = tools.createHTML({
						tag: 'div',
						className: 'qe-dr-card-c',
						style: 'min-width: ' + self.width + 'px; width: ' + self.width + 'px;',
						parent: self.card,
						onmousedown: DRAGDROP.down,
						link: visual,
						innerHTML: item.text 
					});
					visual.iter = tools.createHTML({
						tag: 'div',
						className: "qe-dr-card-iter",
						parent: visual.html,
					});
					
					self.hq.push( visual );
					stack.push( visual );
				});

				this.next( {q: []} );
			}
			
			this.current = function(){
				return current;
			}

			this.next = function(target){

				if(current){
					other.push(current);
					current.html.style.visibility = 'hidden';
					current = undefined;
				} else {
					spacer.style.visibility = 'hidden';
				}

				if(stack.length != 0){
					current = stack.pop();
					current.html.style.visibility = 'visible';
					current.iter.innerHTML = (self.questions.length - stack.length ) + '/' + self.questions.length;
					self.card.insertBefore(current.html,  self.card.children[0]);
	
					if(stack.length == 0){
						self.st.style.visibility = 'hidden';
					}
				} else {
					spacer.style.visibility = 'visible';
					self.card.insertBefore(spacer,  self.card.children[0]);
				}
			}

			this.back = function(item){
				if(current){
					stack.push(current);
					current.html.style.visibility = 'hidden';
					current = undefined;
				} else {
					spacer.style.visibility = 'hidden';
				}

				other.forEach(function(oth,i){
					if(oth == item){
						other.splice(i, 1);
					}
				});

				current = item;
				current.html.style.visibility = 'visible';
				current.iter.innerHTML = (self.questions.length - stack.length ) + '/' + self.questions.length;
				self.card.insertBefore(current.html,  self.card.children[0]);

				if(stack.length == 1){
					self.st.style.visibility = 'visible';
				}
			}

			this.create();
		}

		var RANGE = function(){
			var current;
			var spacer;
			var HTMLmain;
			var stack = [];
			var other = [];

			this.create = function(){
				let width = self.sContainer[0] ? self.sContainer[0] : 0;
				let height = self.sContainer[1] ? self.sContainer[1] : 0;

				HTMLmain = tools.createHTML({
					tag: 'div',
					className: 'qe-dr-range',
					parent: self.sources
				});

				self.questions.forEach(function(item, i){

					var visual = {};

					visual.index = i;
					visual.item = item;					
					visual.html = tools.createHTML({
						tag: 'div',
						className: 'qe-dr-range-c',
						parent: HTMLmain,
						onmousedown: DRAGDROP.down,
						link: visual,
						innerHTML: item.text 
					});
					stack.push( visual );
				});

				// width calc
				if(!width){
					if(options.cols){	
						width = 920 / options.cols;
					} else {
	
						stack.forEach(function(item){
							if(item.html.offsetWidth > width) {
								width = item.html.offsetWidth;
							}
						});
					}
				}
	
				stack.forEach(function(item){
					item.html.style.width = width + 'px';
				});
				
				/*
				if(!height){
					stack.forEach(function(item){
						if(item.html.offsetHeight > height) {
							height = item.html.offsetHeight;
						}
					});
				}
				stack.forEach(function(item){
					item.html.style.height = height + 'px';
				});
				*/

				this.next( {q: []} );
			}
			
			this.current = function(){
				return current;
			}

			this.next = function(target, item){
				if(item == current){
					if(current){
						other.push(current);
						current.html.style.display = 'none';
						current = undefined;
					} 
	
					if(stack.length != 0){
						current = stack.pop();
						current.html.style.display = 'inline-flex';
						HTMLmain.insertBefore(current.html,  HTMLmain.children[0]);
	
					} 
				} else {
					stack.splice( stack.indexOf(item) , 1 );
					other.push( item );
					item.html.style.display = 'none';
				}
				
				if(target.q.length > 1){
					target.q[0].destroy();
				}
			}

			this.back = function(item){
				if(current){
					stack.push(current);
					current = undefined;
				}

				other.forEach(function(oth,i){
					if(oth == item){
						other.splice(i, 1);
					}
				});

				current = item;
				current.html.style.display = 'inline-flex';
				HTMLmain.insertBefore(current.html,  HTMLmain.children[0]);
			}

			this.create();
		}

		var TARGET = new function(){
			var s;

			this.create = function(){

				let width = self.tContainer[0] ? self.tContainer[0] : (950 / self.items.length);
				let height = self.tContainer[1] ? self.tContainer[1] : 50;

				let inRow = Math.floor( 950 / width );
				let count = Math.ceil( self.items.length / inRow );

				for(var j = 0; j < count; j++){

					var titles = tools.createHTML({
						tag: 'div',
						className: 'qe-dr-target-title',
						parent: self.target
					});
					var containers = tools.createHTML({
						tag: 'div',
						className: 'qe-dr-target-container',
						parent: self.target
					});

					for(var i = 0; i < inRow; i++){
						
						var ind = i + inRow * j;
						
						if(ind == self.items.length)
							break;

						self.items[ind].q = [];
	
						self.items[ind].title = tools.createHTML({
							tag: 'div',
							className: 'qe-dr-target-t',
							style: 'width: ' + width + 'px;', 
							innerHTML: self.items[ind].text,
							parent: titles
						});
						self.items[ind].html = tools.createHTML({
							tag: 'div',
							className: 'qe-dr-target-c',
							style: 'width: ' + width + 'px;',
							link: self.items[ind],
							parent: containers
						});
						tools.createHTML({
							tag: 'div',
							className: 'qe-dr-target-fill',
							style: 'height: ' + height + 'px;',
							onclick: TARGET.click,
							onmouseover: TARGET.over,
							onmouseout: TARGET.out,
							parent: self.items[ind].html
	
						})
					}	

				}
			}

			this.click = function(e){

				var item = e.target.parentNode.link;
				var current = self.SOURCE.current();

				if(current){
					
					TARGET.createIn( item, current );
					self.SOURCE.next( item, current );

					TARGET.out();
					TARGET.over(e);
				}
			}

			// element in target
			this.createIn = function(parent, item){


				var html =  tools.createHTML({
					tag: 'div',
					className: 'qe-dr-target-dropped',
					parent: parent.html,
					onmousedown: function(e){ DRAGDROP.down(e, parent) },
					link: item,
					innerHTML: item.item.text
				});


				var cross = tools.createHTML({
					tag: 'div',
					className: 'qe-dr-target-cross',
					parent: html,
					innerHTML: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 24 24" xml:space="preserve"><g fill="#b5b0b0"><path d="M 5.5,7 L 7,5.5 L 18.5,17 L 17,18.5 L 5.5,7 z" /><path d="M 5.5,17 L 7,18.5 L 18.5,7 L 17,5.5 L 5.5,17 z" /></g></svg>'
				})

				var destroy = (function(html, item, parent) {
									return function(){
										tools.destroyHTML(html);
										self.SOURCE.back(item);
										parent.q.splice( parent.q.indexOf(html) , 1 );
										return false;
									}
								})(html, item, parent);

				cross.onmousedown = destroy;
				html.destroy = destroy;

				parent.q.push(html);
			}

			// hover activities
			this.over = function(e){
				var current = self.SOURCE.current();
				if(current){
					s = {};
					s.ghost = tools.createHTML({
						tag: 'div',
						className: 'qe-dr-target-ghost',
						innerHTML: current.item.text
					});
					insertAfter( s.ghost, e.target );
				}
			}

			this.out = function(e){
				if(s){
					tools.destroyHTML(s.ghost);
					s = undefined;
				}
			}

			// drag&drop activities
			this.unblur = function(){
				self.items.forEach(function(item){
					item.title.style.opacity = 1;
					item.html.style.opacity = 1;
				})
			}

			this.select = function(item){
				self.items.forEach(function(item){
					item.title.style.opacity = 0.5;
					item.html.style.opacity = 0.5;
				})
				item.title.style.opacity = 1;
				item.html.style.opacity = 1;
			}

			function insertAfter(elem, refElem) {
				var parent = refElem.parentNode;
				var next = refElem.nextSibling;
				if (next) {
					return parent.insertBefore(elem, next);
				} else {
					return parent.appendChild(elem);
				}
			}
		}

		var DRAGDROP = new function(){
			
			var s;

			this.down = function(e, parent){
				
				s = {};

				s.w = e.target.offsetWidth;
				s.h = e.target.offsetHeight;

				s.t = e.target;
				s.p = parent;
				s.l = s.t.link;
				s.a = s.t.cloneNode(true);
				s.t.style.visibility = 'hidden';

				document.body.appendChild(s.a);
				s.a.style.cssText = 'width: ' + s.w + 'px; '
									+ 'height: ' + s.h + 'px; '
									+ 'position: absolute; '
									+ 'box-sizing: border-box; '
									+ 'visibility: visible; '
									+ 'opacity: 0.5;'
									+ 'z-index: 3;';



				window.addEventListener('mousemove', move);
				window.addEventListener('mouseup', up);
				move(e);

				return false;
			}

			var move = function(e){

				// taking element under cursor
				s.a.style.display = 'none';
				var x = e.pageX, y = e.pageY;
    			var target = document.elementFromPoint(x, y);
				s.a.style.display = '';
				target = tools.closest(target, 'qe-dr-target-c');

				if(target !== s.target){
					if(s.target){
						TARGET.unblur();
						s.target = undefined;
					}
					if(target){
						TARGET.select(target.link);
						s.target = target;
					}
				}

				s.a.style.left = (e.pageX - s.w/2) + 'px';
				s.a.style.top = (e.pageY - s.h/2) + 'px';
			}

			function elemUnderCursor(e){
				return target;
			}

			var up = function(e){

    			s.t.style.visibility = 'visible';

				tools.destroyHTML(s.a);
				TARGET.unblur();

				if(s.target){
					if(s.p){
						s.t.destroy();
					}
				
					var current = s.t.link;

					if(current){
						TARGET.createIn( s.target.link, current);
						self.SOURCE.next( s.target.link, current );
					}

				} else {
					var x = e.pageX, y = e.pageY;
    				var target = document.elementFromPoint(x, y);

    				var cardobj = tools.closest(target, 'qe-dr-card-spacer');
    				var spacerobj = tools.closest(target, 'qe-dr-card-c');
    				var rangeobj = tools.closest(target, 'qe-dr-range-c');

    				if( (spacerobj || cardobj || rangeobj) && s.p ){
						s.t.destroy();
    				} else {
    					s.t.style.visibility = 'visible';
					}
				}


				s = undefined;

				window.removeEventListener('mousemove', move);
				window.removeEventListener('mouseup', up);
			}
		}


		this.create(options);
	}

	var CONTENTONLY = function(options){
		var self;

		this.create = function(options){
			self = {};

			self.position = 0;
			self.type = options.type || 'radiobutton';
			self.items = options.items;

			self.main = tools.createHTML({
				tag: 'div',
				className: 'qe-co-main',
				parent: options.parent
			});

			self.answers = [];

			self.items.forEach(function(item){
				self.answers.push(
					item.isolate == '1' ?
					TYPES.isolate(options.parent, click, item) :
					tools.createHTML({
						tag: 'div',
						parent: self.main,
						className: 'qe-co-answer',
						onclick: click,
						link: item,
						innerHTML: ('<div>' + item.text + '</div>')
					})
				)
			});
			setWidth( options.cols)

		}

		var setWidth = function( cols){
			var width = 0;
			var containerWidth = self.main.offsetWidth - 20;
			var items = self.answers.filter(function(item){ return item.link.isolate !== '1' });
			if(!width){
				if(cols)
					width = containerWidth / cols;
				else 
					width = items.reduce(function(prev, item){	return Math.max(prev, item.offsetWidth); }, 0);

				if( containerWidth > items.length * width ){
					width = Math.floor(containerWidth / items.length);
				}
			}
			items.forEach(function(item){
				item.style.width = width + 'px';
			});

			/*
			if(!height){
				self.answers.forEach(function(item){
					if(item.offsetHeight > height) {
						height = item.offsetHeight;
					}
				});
			}
			self.answers.forEach(function(item){
				item.style.height = height + 'px';
			});
			*/
		}

		var click = function(e){
			var target = tools.closest(e.target, 'qe-co-answer') || tools.closest(e.target, 'qe-isolate');

			if(self.type == 'radiobutton'){
				SELECT.removeAll();
				SELECT.add(target);
			} else if(self.type == 'checkbox'){

				if(target.link.reset){
					if(target.select){
						self.unselect = false;
						unselect(false);
						SELECT.remove(target);
					} else {
						SELECT.removeAll();
						self.unselect = true;
						unselect(true);
						SELECT.add(target);
					}
				} else if(!self.unselect){
					if(target.select){
						SELECT.remove(target);
					} else {
						SELECT.add(target);
					}
				}
			}
			return false;
		}
		var unselect = function(type){
			self.answers.forEach(function(item){
				if(!item.link.reset){
					if(type){
						item.style.opacity = '0.5';
						item.style.cursor = 'not-allowed';
					} else {
						item.style.opacity = '1';
						item.style.cursor = '';
					}
				}
			});
		}

		var SELECT = new function(){
			this.items = [];

			this.add = function(item){
				if(!item.select){
					SELECT.items.push(item);
					item.select = true;
					item.classList.add( 'qe-select' );
				}
			}

			this.remove = function(item){
				if(item.select){
					SELECT.items.splice( SELECT.items.indexOf(item), 1);
					item.select = false;
					item.classList.remove( 'qe-select' );
				}
			}

			this.removeAll = function(){
				SELECT.items.forEach(function(item){
					item.select = false;
					item.classList.remove( 'qe-select' );
				});
				SELECT.items = [];
			}
		}

		this.create(options);
	}

	var SCALE = function(options){
		var self;

		this.create = function(options){
			self = {};

			self.position = 0;
			self.gradient = options.gradient;
			self.gradientcolor = options.gradientcolor;

			self.main = tools.createHTML({
				tag: 'div',
				className: 'qe-sc-main',
				parent: options.parent
			});

			self.scale = {};
			self.scale.html = tools.createHTML({
				tag: 'div',
				style: 'width: 100%;',
				className: 'qe-sc-scale',
				parent: self.main
			});


			// labels
			self.scale.title = tools.createHTML({
				tag: 'div',
				className: 'qe-sc-title',
				parent: self.scale.html
			});

			if(options.startlabel){
				self.scale.SL = tools.createHTML({
					tag: 'div',
					className: 'qe-sc-startlabel',
					parent: self.scale.title,
					innerHTML: options.startlabel
				});
			}
			if(options.endlabel){
				self.scale.SL = tools.createHTML({
					tag: 'div',
					className: 'qe-sc-endlabel',
					parent: self.scale.title,
					innerHTML: options.endlabel
				});
			}

			self.scale.target = tools.createHTML({
				tag: 'div',
				className: 'qe-sc-target',
				parent: self.scale.html
			});

			self.scale.items = [];
			self.scale.reset = [];


			var colors = options.gradientcolor;

			colors.forEach( function(item){
				item[item.length - 1] = Math.round(item[item.length - 1]*255);
			} );

			options.items.forEach(function(item, i){
				if(item.reset == 'true')	item.isolate = '1';
				if(item.isolate == '1'){
					var container = tools.createHTML({
						tag: 'div',
						parent: self.scale.html,
						className: 'qe-sc-ureset'
					});
					self.scale.reset.push(
						tools.createHTML({
							tag: 'div',
							parent: container,
							onclick: CLICK.reset,
							className: 'qe-sc-reset',
							innerHTML: item.text
						})
					);
				} else if(self.gradient){
					var color = getColor(colors, i / (options.items.length - 1) );

					self.scale.items.push( 
						tools.createHTML({
							tag: 'div',
							parent: self.scale.target,
							className: 'qe-sc-answer-grad',
							style: 'border-top: 1em solid ' + color,
							onclick: CLICK.gradient,
							innerHTML: item.text
						})
					);
					self.scale.items.last().specColor = color;
				} else {
					self.scale.items.push( 
						tools.createHTML({
							tag: 'div',
							parent: self.scale.target,
							className: 'qe-sc-answer',
							onclick: CLICK.item,
							innerHTML: item.text
						})
					);
				}
			});

			options.reset.forEach(function(item){
				var container = tools.createHTML({
					tag: 'div',
					parent: self.scale.html,
					className: 'qe-sc-ureset'
				});
				self.scale.reset.push(
					tools.createHTML({
						tag: 'div',
						parent: container,
						onclick: CLICK.reset,
						className: 'qe-sc-reset',
						innerHTML: item.text
					})
				);
			});
		}

		function getColor(colors, left){
	    	let index = left === 1 ? colors.length - 2 : Math.floor((colors.length - 1) * left);
			let part = 1 / (colors.length - 1);
			let newColor = [0, 0, 0, 0].map( function(item, i){
			 	return Math.round(
			    	(colors[index][i] *
			    	(1 - (left - part * index) * (colors.length - 1))) 
			    	 + (colors[index + 1][i] * (left - part * index) * (colors.length - 1)));
			  }
			);
			return newColor.reduce(
			  function(sum, item){
			  	return sum + (item.toString(16).length === 1 ? "0" : "") + item.toString(16);
			  },
			  "#"
			);
		}

		var CLICK = {
			item: function(e){
				var target = tools.closest(e.target, 'qe-sc-answer');				
				CLICK.clear();

				self.tItem = target;
				target.className =  'qe-sc-answer qe-sc-answer-select';
				return false;
			},
			gradient: function(e){
				var target = tools.closest(e.target, 'qe-sc-answer-grad');				
				CLICK.clear();

				var c = target.specColor;
				self.tItem = target;
				self.tItem.style.backgroundColor  = c;
				self.tItem.style.transform = 'scale(1.05)';
				return false;
			},
			reset: function(e){
				var target = tools.closest(e.target, 'qe-sc-reset');				
				CLICK.clear();

				self.tReset = target;
				target.className =  'qe-sc-reset qe-sc-reset-select';
				return false;
			},
			clear: function(){
				if(self.tItem){
					if(self.gradient){
						self.tItem.style.background = '';
						self.tItem.style.transform = '';
					} else {
						self.tItem.className = 'qe-sc-answer';
					}
					self.tItem = undefined;
				}
				if(self.tReset){
					self.tReset.className = 'qe-sc-reset';
					self.tReset = undefined;
				}
			}

		}

		this.create(options);
	}

	var CLICKTEXT = function(options){
		var self;

		this.create = function(options){
			self = {};
			self.htmls = [];
			self.reset = [];
			self.background = (options.background) ? options.background : 'black';
			self.color = (options.color) ? options.color : 'white';
			self.main = tools.createHTML({
				tag: 'div',
				parent: options.parent,
				className: 'qe-clicktext-main'
			});

			options.items.forEach(function(item){
				if(item.reset == 'true') return;
				var html = item.text;
				var strings = [];

				while(html.length !== 0){
					if(html.indexOf('<') !== -1){
						if( html.indexOf('<') != 0)	strings.push( html.slice(0, html.indexOf('<') ));
						strings.push( html.slice(html.indexOf('<'), html.indexOf('>') + 1));
						html = html.slice( html.indexOf('>') + 1);
					} else {
						strings.push( html );
						html = '';
					}
				}
				for(var i = 0; i < strings.length; i++){
				
					var str = strings[i];

					if(str[0] !== '<' && str.indexOf('{') !== -1 ){
				
						if( html.indexOf('{') != 0)					strings[i] = str.slice(0, str.indexOf('{'));
						if( str.indexOf('}') != str.length - 1)		strings.splice( i + 1, 0, str.slice( str.indexOf('}') + 1));
																	strings.splice( i + 1, 0, str.slice(str.indexOf('{'), str.indexOf('}') + 1));
						i++;
					}
				}

				strings = strings.map(function(str){
					if(str[0] == '<'){

					} else if(str[0] == '{'){						
						str = '<span class="qe-clicktext-item">' + str.slice( 1, str.length - 1 ) + '</span>';
					} else {

					//	str = str.replace(/'\ '/g, '</span> <span class="rep-it">');
					//	str = str.replace(/'\.'/g, '</span>.<span class="rep-it">');
					//	str = str.replace(/'\,'/g, '</span>,<span class="rep-it">');

						str = str.split(' ').join('</span> <span class="qe-clicktext-item">');
						str = str.split('.').join('</span>.<span class="qe-clicktext-item">');
						str = str.split(',').join('</span>,<span class="qe-clicktext-item">');
						
						str = '<span class="qe-clicktext-item">' + str + '</span>';
					}
					return str;
				});
				var html = strings.join('');

				var visual = tools.createHTML({
					tag: 'div',
					className: 'qe-clicktext-answer',
					parent: self.main,
					innerHTML: html 
				});

				self.htmls.push( visual	);

				var repDip = function(node){
					if(node.children && node.children.length){
						for(var i = 0; i < node.children.length; i++){
							repDip(node.children[i]);
						}
					} else {
						if(node.className == 'qe-clicktext-item'){
							node.onclick = (function(node){
									return function(e){
										CLICK.span(e, node);
									}					
								})(node);
						}
					}
				}
				repDip(visual);
			});

			options.items.forEach(function(item){
				if(item.reset !== 'true') return;
				var visual = {};
				visual.outer = tools.createHTML({
					tag: 'div',
					parent: self.main,
					className: "qe-sc-ureset"
				});
				visual.inner = tools.createHTML({
					tag: 'div',
					parent: visual.outer,
					onclick: CLICK.reset,
					className: 'qe-sc-reset',
					innerHTML: item.text
				});
				self.reset.push(visual);
			});
		}

		var CLICK = {
			span: function(e, node){
				if(!SELECT.resetItem){
					if(node.select){
						SELECT.remove(node);
					} else {
						SELECT.add(node);
					}
				}
			},
			reset: function(e){
				var target = tools.closest(e.target, 'qe-sc-reset')

				if( tools.hasClass(target, 'qe-sc-reset-select') ){
					target.className = 'qe-sc-reset';
					
					self.htmls.forEach(function(item){
						item.style.opacity = 1;
						item.style.cursor = '';
					})

					SELECT.resetItem = undefined;

				} else {
					target.className = 'qe-sc-reset qe-sc-reset-select';


					self.htmls.forEach(function(item){
						item.style.opacity = 0.5;
						item.style.cursor = 'not-allowed';
					});

					if(SELECT.resetItem != undefined){
						SELECT.resetItem.className = 'qe-sc-reset';
					}
					SELECT.resetItem = target;
				}
			}
		}
		var SELECT = new function(){
			this.resetItem;
			this.items = [];

			this.reset = function(){
				if(!SELECT.items.length){
					self.reset.forEach(function(item){
						item.outer.style.display = 'inline-flex';
						item.inner.className = 'qe-sc-reset';
					});
				} else {
					self.reset.forEach(function(item){
						item.outer.style.display = 'none';
						item.inner.className = 'qe-sc-reset';
					});
				}
			}


			this.add = function(item){
				if(!item.select){
					item.style.background = self.background;
					item.style.color = self.color;
					item.select = true;
					SELECT.items.push(item);
				}
				SELECT.reset();
			}
			this.remove = function(item){
				if(item.select){
					item.style.background = '';
					item.style.color = '';
					item.select = false;
					SELECT.items.splice( SELECT.items.indexOf(item), 1);
				}
				SELECT.reset();
			}
			this.removeAll = function(item){
				for(var i = 0; i < SELECT.items.length; i++){
					item.style.background = '';
					item.style.color = '';
					item.question.select[i].select = false;
				}
				item.question.select = [];
			}
		}

		this.create(options);
	}

	var CLICKTEST = function(options){
		var self;

		this.create = function(options){
			self = {};
			self.background = (options.background) ? options.background : 'black';
			self.color = (options.color) ? options.color : 'white';
			self.stack = [];
			self.items = [];
			self.reset = [];
			self.main = tools.createHTML({
				tag: 'div',
				parent: options.parent,
				className: 'qe-clicktest-main'
			});

			self.wrap = tools.createHTML({
				tag: 'div',
				parent: self.main,
				onclick: CLICK.wrap,
				className: 'qe-clicktest-wrap'
			});

			self.img = tools.createHTML({
				tag: 'img',
				parent: self.wrap,
				className: 'qe-clicktest-img'
			});

			self.img.src = options.src[0];
			
			options.items.forEach(function(item, i){
				if(item.reset == 'true') return ;
				item.i = i + 1;
				SELECT.push(item);
				self.items.push(item);
			});
			options.items.forEach(function(item){
				if(item.reset !== 'true') return ;
				var visual = {};
				visual.outer = tools.createHTML({
					tag: 'div',
					parent: self.main,
					className: "qe-sc-ureset"
				});
				visual.inner = tools.createHTML({
					tag: 'div',
					parent: visual.outer,
					onclick: CLICK.reset,
					className: 'qe-sc-reset',
					innerHTML: item.text
				});
				self.reset.push(visual);
			});
		}

		var CLICK = {
			wrap: function(e){
				var coord = self.wrap.getBoundingClientRect();
				var x = e.pageX - coord.left - 21;
				var y = e.pageY - coord.top - 21;
				var item = SELECT.pop();
				if(item){
					var pick = tools.createHTML({
						tag: 'div',
						className: 'qe-clicktest-answer',
						parent: self.wrap,
						onclick: function(e){
							tools.destroyHTML(pick);
							SELECT.push(item);
							tools.stopProp(e);
							return false;
						},
						style: 'left: ' + x + 'px; top: ' + y + 'px'
					});
					var iter = tools.createHTML({
						tag: 'div',
						className: 'qe-clicktest-iter',
						parent: pick,
						innerHTML: item.i
					});
				}
			},
			reset: function(e){
				var target = tools.closest(e.target, 'qe-sc-reset')

				if( tools.hasClass(target, 'qe-sc-reset-select') ){
					target.className = 'qe-sc-reset';
					self.wrap.onclick = CLICK.wrap;
					self.wrap.style.opacity = 1;
					self.wrap.style.cursor = '';
					SELECT.resetItem = undefined;

				} else {
					target.className = 'qe-sc-reset qe-sc-reset-select';
					self.wrap.onclick = undefined;
					self.wrap.style.opacity = 0.5;
					self.wrap.style.cursor = 'not-allowed';

					if(SELECT.resetItem != undefined){
						SELECT.resetItem.className = 'qe-sc-reset';
					}
					SELECT.resetItem = target;
				}
			}
		}

		var SELECT = new function(){
			this.resetItem;
			this.items = [];

			this.reset = function(){
				if(self.stack.length == self.items.length){
					self.reset.forEach(function(item){
						item.outer.style.display = 'inline-flex';
						item.inner.className = 'qe-sc-reset';
					});
				} else {
					self.reset.forEach(function(item){
						item.outer.style.display = 'none';
						item.inner.className = 'qe-sc-reset';
					});
				}
			}

			this.pop = function(){
				if(self.stack.length){
					var item = self.stack.pop();
					SELECT.reset();
					return item;
				}
			}
			this.push = function(item){
				self.stack.push(item);
				self.stack.sort(function(a, b){	return b.i - a.i;	});

				SELECT.reset();
			}
		}

		this.create(options);
	}

	var MEDIA = function(options){
		var self = {};

		this.create = function(options){
			var videooptions = {
				controlBar: {
					fullscreenToggle: false
				}
			};
			if(options.playauto == '1')			videooptions.autoplay = true;
			else 								videooptions.autoplay = false;
			if(options.pauseenable !== '1')		videooptions.controlBar.playToggle = false;
		
			if(options.volumeenable !== '1'){
				videooptions.controlBar.volumeControl = false;
				videooptions.controlBar.volumeMenuButton = false;
			}

			console.log(options);
			var src = "";
			options.src.forEach(function(item){
				var fileformat = item.split('.').last();
				src += '<source src="' + item + '" type="video/' + fileformat + '" />';
			});
			src += '<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>';

			self.main = tools.createHTML({
				tag: 'div',
				className: 'qe-video-main',
				parent: options.parent 
			});

			self.videocontainer = tools.createHTML({
				tag: 'video',
				className: 'video-js vjs-default-skin',
				parent: self.main,
				innerHTML: src
			});
			self.videocontainer.controls = true;
			self.videocontainer.preload = "auto"; 
			self.video = videojs(self.videocontainer, videooptions );

			if(options.seekenable !== '1')
				self.video.controlBar.progressControl.el_.style.pointerEvents = 'none';

			if(options.pauseenable !== '1'){
				self.video.on('pause', function() {
					if(self.video.player_.cache_.currentTime !== self.video.player_.cache_.duration){
						self.video.play();
					}
				});
			}
			self.cbutton = tools.createHTML({
				tag: 'div',
				className: 'qe-video-buttons',
				parent: options.parent 
			})
			self.button = [];
			if(options.likeenable == '1'){
				var visual = {};
				visual.html = tools.createHTML({
					tag: 'div',
					className: 'qe-video-button',
					parent: self.cbutton
				});
				visual.avatar = tools.createHTML({
					tag: 'div',
					className: 'qe-video-button-avatar',
					parent: visual.html,
					innerHTML: '<img style="max-width: 100%" src="data:image/png;base64,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">'
				});
				visual.text = tools.createHTML({
					tag: 'div',
					className: 'qe-video-button-text',
					parent: visual.html,
					innerHTML: options.liketext
				});
			}
			if(options.boringenable == '1'){
				var visual = {};
				visual.html = tools.createHTML({
					tag: 'div',
					className: 'qe-video-button',
					parent: self.cbutton
				});
				visual.avatar = tools.createHTML({
					tag: 'div',
					className: 'qe-video-button-avatar',
					parent: visual.html,
					innerHTML: '<img style="max-width: 100%" src="data:image/png;base64,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">'
				});
				visual.text = tools.createHTML({
					tag: 'div',
					className: 'qe-video-button-text',
					parent: visual.html,
					innerHTML: options.boringtext
				});
			}
			if(options.dislikeenable == '1'){
				var visual = {};
				visual.html = tools.createHTML({
					tag: 'div',
					className: 'qe-video-button',
					parent: self.cbutton
				});
				visual.avatar = tools.createHTML({
					tag: 'div',
					className: 'qe-video-button-avatar',
					parent: visual.html,
					innerHTML: '<img style="max-width: 100%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAARFFJREFUeNrs3X2c1WWd//HXOQzDgCOMMCKOMExE6KLLKpFLZkZIauiampGZpmZlbjduu49+u+be/PbX7rpt21bblplrapp3uYZKamY0GRqxpITEEiHBgCMgjIDTMB4O5/z+uL6Tk8vNDHzPzfd7Xs/Hg4d3eJi5znfO9b7uPlemWCwiSZJqSx1AJpOxJaQKWTerfjTQFv0aD0yM/tr3z+OAbMK+rQKwsd+vdcDz/f9dW3uu03f/0DiA06HIFItFA4AUf6fev8NuAqYAk6NOfQLQ2q+Tb6zRZspHwaAvIHQCG4DVwApga99vbGvPFXyqDAAyAEjV2tE3AJOAqcAfAScA06KOvs7WGnQ42BIFgWXAL4HlwBqgx2BgAJABQKpER58FxkYd/AlRZz81+jXC1iqpHLAKWAk8GwWEldEMQqHWgoEBQAYAqXQdfhZoBqYDbwFmRKP6Zkf1VaMA7IxmCBYBTwJPE5YQCmkOBAYAGQCkeDr8vl+tUUf/FmBmNMpvsJUSpTeaHVgM/ARYQthjUAAKaQkEBgAZAKSDH91nCZvzTok6/FMIG/PqbalUyRGWCRYBPwWeIuwnKCR5lsAAIAOANPARfn00oj8VeHPU4SfxmJ0OTT6aEeibIVhE2EuQqBkCA4AMANK+O/ws4RjeTOCdwFm4K197nyFYCywAvg8sJZw2yFdzGDAAyAAg/X6nX0eYxp8DnBmN9ptsIQ1QAdgEPA58L5od2FqNswMGABkAVMudfl3U6TcQpvbPBObixj3FZzvwRDQzsJBXjxxWfHbAACADgGqx068DRhPW8N8JzMapfZVeD+G44feAxwj7BnKVCgMGABkAVAudft8GvpGEKf33Eqb4R9s6qpC+fQMPA98lVCwsaxgwAMgAoDR3+nWEqfwZwPnAOYRz+u7aVzXpjQLAPcCjQAeQa2vP5Q0AMgBIg+v064Djog7/3dHfezZfSbAdaI/CwBNAVzQrEHsYMADIAKA0dPx1UQffApwBvCca9TfaOkqoQjQTsICwRLA0mimIbYnAACADgJI82q8nrOOfRpjin02osy+lSY5Qmvgewp6BdYQlgpwBQAYA1dpov4FQgve9wEW4rq/asZ2wNHAPYamgKwoDg54VMADIAKCkjPbrCFP6M4FLCVP97uJXrSpEMwF3AN8hnCgY1MZBA4AMAKr2jr+BMK1/FnAZ4Wpdi/RIr9pC2CtwO+Eq496BLA8YAGQAUDV2/H3T/FMIu/gvIpTndZpf2redhNLDNxOWCbrZz/KAAUAGAFXTaL+eMM1/MmGafw5u6pMGK0eoK3AzoeLglmhWoGAAkAFA1djxjyWs6/dN84+wdaRDUiDsDbgdmB/9fW/fPgEDgAwAqnTHP45wAc+HCZfwWI9fit8mwj6Bb0ezAz0Tf/RKzmaRAUB2/FJt2Ek4PngT8BTQfaj1BFR7isWiAUB2/FKCg8BC4EZgcRQE8jaLDACKu+NvIKzx2/FL1WUrobrgLYQjhD0GARkAFFfHP45whv9KYJodv1S1QeD+KAisNAjIACA7fqm2dAL3EU4OrIqCQMFmkQFAB+r8+6b6zwKusuOXEmstcCevlhk2CMgAoL12/HVAE+FWvo8BpxI2/ElKttWEZYEHCdcTGwRkANDvpvsbo5H+lcB5URCQlB4FwnLAzVEQ2NjWnuu1WQwABoDa7fgbCNfwzgOuINTql5ReOcKRwa8Qaglsd6OgAcDWqK3Ov69s7xzgamAGXtIj1ZIuwkbBm3n1xIDLAgYApbjjrwNGAjMJG/zmYL1+qZatIhQSehDodFnAAKD0dfzZqKOfSrihb140AyBJOcJywA2Eq4hdFjAAKCWdfwMwHjiXUMHvOFtF0l5sBe4lnBiwfoABQAkf9TcBs/BYn6SBW0FYFlgAbHJZwACg5I36JxGm+z8AtNgqkgahl1cvGnoKlwUMAErcqP80rOIn6eBtIiwL3AasamvP9dgkBgBVX+c/Ihr1v99Rv6QYFYAlhNoBjzkbYABQ9XT8fSV8Z0ej/lMc9UsqgS3At6LZgDXuDTAAqPKj/imEtf5L8GifpNLKA0/waiXBnZ4UMACo/KP+0YS1/k9Eo34r+Ukqlw5CFcG7gQ5nAwwActQvqXb0Ao8SCggtcTbAAKDSdfx9O/xnR6P+Ux31S6oCqwnHBe8nlBPO2SQGAMXX+dcTdvXPI1ze02arSKoiPcD8KAg83dae67ZJDAA69M5/BDCNUMZ3HtBoq0iqUssISwIPE6oIelzQAKCD6Pid8peURNsJxYNuBpa7QdAAoMF1/vWEC3wuxCl/SclTIJQS/grQ3tae22mTGAB04M7fKX9JabEqCgHzgS0uCRgAtPeO3yl/SWm0Ffgmr1YQ9JSAAUD9On+n/CWlWS6aBbgBWOopAQOA+N2U/4nAlTjlLyndFgNfBh4HuiwcZACo5c5/JGHK/1M45S+pRj76CPUC7gY2ui/AAFBrHX8WaAbOA64BptoqkmrITuAO4BZghUcFDQC10vnXEdb7LyJc3zveVpFUgwrAY4RTAos8KmgASHvnXw9MJqz3fwgYaatIqnHLoxCwgHBU0H0BBoDUdf4NhM1+HyNs9qu3VSQJgE2EEwJ3EK4Xdl+AASA1nf8I4BTCev9c3OwnSa/VDfwncBPWCzAApKTzHwnMAv4COM0WkaR9ykWzADfg5kADQMI7/9HRiP9TwHRbRJIOqADcT9gXsLStPddjkxgAktTx9x3zuyDq/KfYKpI0KI8DXwSesHKgASBJnX8LcDFhw1+rrSJJB6WvcuCjbe257TaHAaCaO/++M/6XEDb8NdsqknRIVkYzAfOxfLABoIo7/zbCNb4fIdzsJ0k6dB3RTMDdwCZDgAGg2jr/SVHn/1G80EeS4rYV+BrhWmFrBRgAqqbzPw64Crjczl+SSsZaAQaAqur8pxI2+12O1f0kqdRywJ3AV4HlhgADQCU6/3rgBOBq4AN2/pJUNgXgPsLmwKcNAQaAcnb+fXX9PwVciKV9JamSIWCZVQMHHwDsuOz8JSmJstFn8KeAE6PPZg2yAWXnL0mGAAOA7PwlyRBgAJCdvyQZAgwAdv62mSQZAgwAdv6SJEOAASBVnX+9nb8kJT4EWKPFADDozn+6nb8kGQIMALXT+dcRKvxdY+cvSYkPAdcAU6PPdhkA9tv5TyVc7GPnL0npCAFXAZMNAQaAA3X+fRf7+KBIUvLVA5cAlwHj182qt98zAPyvzn8y4WKfy/FiH0lKk0bgI8BFwFibwwDQ1/lngVbgSrzVT5LSajTwCeCCdbPqR9scNR4Aos5/fNT5fxQY4SMhSanVQjgZcM66WfUjDQC1bSxhbegjhCkiSVK6TY5CwOx1s+pretBXswFg3az6ZsJ60DVAsz8TklQzToxCwCm1XC2wJgNAtP7TVyTCDSGSVHtOI+wJqNlCQTUXANbNqm8Ezoo6/1Z/BiSpZp1DOPp9XC3WCKipABCt98yKOv8pPvuSVNOywDxCoaBJtRYCaiYAROs8M6LOf4bPvSSJcPT7A8AVwLhaKhRUE99ovyp/1wCzfd4lSf00Ah8i7A1rMgCkq/Pvq/J3ns+5JGkvmgn7AebUyvHAVAeAaCpnHGFq5xKseyBJ2rfJUQiYXgsnA9LeITYRpnQ+BDT4bEuSDuA04MNAW9r3A6T2m4uO+82J0px1nyVJAzUPuJSU14lJZQCIdvyfTNj0N9lnWZI0CA2EmeNU3xmQugAQbfqbEo38T/E5liQdhHGESoGpLRecxhmAscBlhApPkiQdrGmkuFJgqgJANFUzl1DUod5nV5J0iM4iXBnfkrZNgan5ZqIjG9MJ5/293U+SFIc6wjHy1BUJSkUAiFJZK6Ge83SfV0lSjJoISwGz01QkKC0zAKMJxzbO8zmVJJXAJMLJstRcH5z4ABClsdOi0b/FfiRJpXJq1NekYj9Aor+Bfpf8fIywBCBJUildCFwAJL4+QNITzFhCnf9ZPpOSpDIYQdhsPjPp9QESGwCiI3/nAhfjJT+SpPLpu2E20fcFJPILjzZgnEyY+m/yWZQkldlZhM3nie2DEhcAorTVFnX+J/gMSpIqoJ5QIOjUpC4FJHEGYDTwfkLFP0mSKqU1GoxOTuJSQKK+4OjI32zCLU2W+pUkVdrsaFCauGvnExMAoiN/kwm3M7X4zEmSqkAdcDkJrBKYpBmApihlecWvJKma9F0dnKhbAxMRAKINFqcQLmTwyJ8kqdqcQqhLk5jL6Kq+M33NRT9O/UuSqrU/vRg4IylLAUkYTTcSLvmZ7fMlSapio4mOqCdhKaCqA0BU8Gc68GG86EeSVP1Ojvqsql8KqNoAEE39j40acrLPlCQpIS4EZlX7UkA1zwCMIBT7OddnSZKUIE2EuwJaq7lAUFV+YdHayXGEjX+NPkuSpIQ5hXBtcNX2YdWaTJoIxylO9BmSJCVQXdSPTavWDYFVFwCiM/+zCLcseeZfkpRUk6niDYFV1cH2u+nvEySomIIkSftwHjCnGjcEVtsIuxF4H5b7lSSlw0jChsC2atsQWDVfTL8z/5cT1k4kSUqDk4H3UmUbAqspjTQBVxLK/kqSlBZ1wAeA6dFg1wDQb/Tfd9nPOT4nkqQUaqPKNgRWywzAWMKZ/yafEUlSSp1DFW0IrHgAiBpiDuHonyRJaTWScFlQVWwIrOgXEDVASzT697IfSVLazQDeTxVsCKx0AhlBqPU/3WdCklQDsoQNgVMrXSGwYgEgGv1PImyK8NifJKlWjCfUvKnoLEAlZwAagUsJl/5IklRLLgSOq+QsQEUCQPQNnwhc7DMgSapBLdEguGKzAJVKHiMJU/8tPgOptRVYCWyxKUqiGZiJm2elJLsA+M66WfWL2tpz+dQHgKgKkkV/0m0jcO/RN/60eciR473UqQT2dG3auOX/nPP5PV2b30HYVew+Gil5xhGuDF4GbC/3H54pFotkMplyBoBxwM3AXN/7VFqbbWz69vh7nzs9M7zRS51KqVjc1vvsovmbr5mzLfp5mopXaEtJsxV4D1DWWYBisVjeD4uo5K9Ff9JrRcMbZ981/v6Oc+z8yxHfM2Mapr31yok/7LngyM9+5wng68A6oGDjSInRTFgSH5nqGYBo9P8d4FTf81QpAEtHXvTn7U1X/r93ZeqGHmuTVGBCYPcrz7w8/8aFL33t00cCZxFKbEuqftsJxYEeb2vP5co1A1C2ABCt/Z8LfBuo9/1OjTzw1Ji/+OrTjWd/8N1kshNskgqnsd/uaN9xxz8v2Xn3v00BZldiZFFGPcBSwoZTlcdIwgbUSTZFrO4Hrmprz21NYwBoBu4iLAEoHXqB9rGf/9764W88/TwymaNskuoJZnu2vfDo1us/+Iveny98E2HZLY3Be8vQCVO+cfTNS8/2LS/Tg/X8c//TecVJTbiPK247CcWByjILUCwWy7NzOBr9n0zY/a906AYePfrGn/bUv+GkC8lkxtgkVaVuyJijzznqXx+ZlX/+uYc3/8VZn8tv7jiTUHY7TScGCsNOePOQzNBhJ/mWl8eQsRO6gc22ROxGEu7FWULYGFhy5doEOIKwyWGE73EqdAH3HXPHykL9lOkX2PlXtca6Y14/75i7Vv/puP/48QrgX4EVNotUlWYDs6JBc/IDQL+qf7N9b1NhE3DH+Ps3jK075vXnUgU3WmkAMpkxw46f+cGJC3e9Nzox8B9Ahw0jVVdgj2YBmtIyAzACuJJ0b0SqFR3ANycs2DJtyBFjz8AqdAkMAtnXjTj13D9tfWznW0Z/8kv/BXyLMk03ShqQU4AZ5ZgFKGkAiEb/x+FmkTRYPXTClG+1Prr9jOxho2Zh5blk54Chw046/PyrPzVhwZbWkRf9+TeB+YRNnZIqawThjoCSD7BKPQPQAFwGjPY9TawCsOyw0y+67+hvPn1+ZtjwGTZJemQPGzXriKuu/+T4+9bVNbxx9heAxwlHOyVVzhnA1FLfFFiyALBuVn2WcE70At/LxMoDS0Zdeu0Pmj/zzXmZuqHH2ySp1DBkzNHnHPX5hz/ectvyrXVHtV5P2IksqTJGE8oDl3QWoJQzAA2EM43jfC8TKQe0N1936383XfG3F5EdMtkmSblMZtTQ1mMvOuau1R+JTgz8C7DahpEq4gKgJRpMJycARF/weOBi38NE6gUePerLj68/7PSL5lndr+aCwFHDjp/5wdYfdL/ryL+78zHga0CnDSOVVSth/1zJNgOWKlnUR+ml1fcwcXYC81tueaa74Q9PvdDqfjWcA+qGHjti1rs/3vro9pNHf/JL9wB3UoErS6UalaXEe+hiDwDR6H8s4Y5jJUsXcO/4e9cOH9o29QIymVE2iTLDhs84/PyrPzHhgc6xh7/74zcCC/DEgFQOJwCnlepIYClmAOoIRX9cM06WTuDWCQ90tg058piz8Yy/XvNznR05Zs7oj3/hY8fc/evdw2e+8wtAO54YkEr6cxcNpktSRTf2y4DWzaofCXwXK/8lydpsY9O3x9/73OmZ4Y3e16ADKxa37V7/P9/v/v7tG4s93YWKfToe3Ta0ce7lf5QdOcZLxsqk0PPyTzac3bwZuNDWKItu4Hygva09l4/vRzjmy4CiM4vTCBf/KBlWNrxx9nfHXj//nLJcqFLYs+a3C+995OUHb9pR3P2KrT8ATZf99Zjhf3zWvKq6cyGTGTO0berFR1x1vW+QVFqNhMJAi6MwEOv0QpzqgXdjffhEBHng6ZEX/fnCpiv/34WZuqHHlnzQuPuVZ164csb3dm9YPZdwPDTr23BgW649rxO4veWWZ8YObZt6AS7PSLXmLGDyuln1y9vac7HNuMUWAKLNf83Aeb5XVS8PLBrzlzf9ovHMS95XjmN+0bThk8AHCEdE7fwHbhwwpfOKk5YNGX3U51tuW/6WbGPTaViOWaoVYwmFgVYDPXG9aJwfwn2b/zz6V916gceO+vLjzzWeeelF5ej892x7YcGGs5t/CVwePR92/oPXCJy6p2vzVRv+5Kjci3/73n8p5nPLcROeVCsuAprjLAwU5wdxPWGdwg/36tUNPNhyyzPby3TGP7973co7N17YthOYh1Uh4xoJnNXzk/mXdLzj8FUvf/eGr1AsWqRHSr82YA4xzvzF0llHicTNf9WtC7h7/L1rh5XpjH/vrqWP39x5xUlNwDl4IVTcWoELu/79z85cP7vh4d7lP7mZmDcISaoqWUJ5/fo4XzCu0f97cPNftdoE3Drhoc2TynLGv1jc8fJ3b7hhy6fP/gNgFjDSt6BkHwhTgUs2XzPnD9e/fdjX9rz4/AO4LCCl1cnAlLiWAeIKAKOBc31vqtLabGPTTa0Pb5uZbWyaTak3jhULG7q+9Mkbuv79z94GzKREBSz0exqiD4aPbJw3adQLH3rTPxdf6fmZzSKlzkjCiYBYZgEOOQBEJQpnE9YnVF1WNrxx9l3j7+84pxwFfor53b984U/fetvLD37jPMKSUL1vQVk1AbNyzy3/YMdZR7z40o3X/gvFwm9sFilVYrsmOI4ZADf/VZ8CsHTUpdd+b+w/P3hhOQr8FHpe/knHOxofyK1aegkwBY+oVVILMHfn3f92wfrZw5/87eN3fQX3B0hpMRWYHhXeq1wAiNYhphKmelUd8sCi5utu/WnTFX97UTkK/Ox5acvDG85ufhb4IGEmyDBYeVnCfRzztv7j5W9b//Zh39q9buWdNouUeH0F9yobAHh185+bvKpDjnDG/9eHnX7RvDKc8c/v7vjV3RsvmNCFx/yq+cNiGnB55xUnTVr/9mH/VNi57XGbRUq0ucRwsupQA0AjcIHvRVXoBua33LZ8Z5nO+Pf2Lv/JbZ2XTRtBOObX7FtQ1UYQZuo+uuFdLdlNn5z9D8X87l/aLFIitQKnHuoywEEHgOgPnomb/6pBF3Dv+PvWjRjaeux5JT/jXyzu+O3jd920+Zo5ryMUpmjyLUiM0cDsV5598vKOdzQ+t/PuL3yBYnGbzSIlShZ4L4e40fpQZgDqgD/B9d6q6PwnPLS5bciYo8+i9Gf8O7ff8vff2PqPl78JOAWP+SXVeOCcl278zJ+sn93wyK7Fj9yAGwWlJJkFtBxKTYBD6bwbCecRVeEAMOrSa18uxxn/Yn73r7Z85vxbdtx+/TuB6XgrXRpGEVOAeVuuPe/N698+7NbdHb+622aREmF01AfXHcoHwKBFiePEaBShysoNOeKokh+5K76ya+nz7339vbsWP/JewskPz/inR33083x552XT2jrOHPUPhZ6Xf2KzSFXvfWUPANEfeDZO/9eEwm93tHec1dS+p2vzFcAk3/fUagRmFnO9H91wdvMrL/7te//JjYJSVTsROOFglwEONjn07fxWyu158fkHNs6b9CLwAcJNdEq/ZmBOz0/mT+l4R+PTR/zp5x89/PyrD2mqsVQy2ewQMtkjy3C5lVSNRgDvApYRjoGXNgBESWM67v5Pu/zudSvv7bzipDrCUU9v86s9rUDLS1/79NqXvvbpdYQKk9Vm+9jPf2/H8BlzrvLtUo06F/hcWQIAr+7+t9RrevX2PtN+++Y/P3MCYae/hZ5qVx1ho+CUKv36NvUsvPeW4TPm+E6pVk0hLAMsbmvPDSqkH8y6gdP/aVYs7uhe8J9f3/znZ/4BcJqdvyRVtXpCPZZBD8oHFQCc/k+/PVs727d94WOthOtlPeMvSdXv7JIHAF7d/e/0f1oDwLYXXiJs9vOYnyQlwwnApMGeBhhsAKgnXEIgSZKqwwhg9mD79AH/5ihZTCOcA5ckSdVj0JvzB5MW+nb/OzUsSVJ1OZlBXsmeHeTvPdc2liSp6owEZg3miuABBYBo+n8SMNk2liSpKg3qht7sIH7fLJz+lySpWg2qdstgAsDbbFtJkqrWaGDmQI8DDjQANETJQpIkVacs8PaB9u0H/E1RkpiKN8FJklTtBlwWODvA3zML74CXJKnaTSHc5BlbAHi7bSpJUtVrYIDHAQcSABqBmbapJEmJcPpA+vf9/oZo/f9kvBJWkqSkOI0BHNvPDuC/n25bSpKUGGOB6Qc6DjiQADDLtpQkKTEGtHn/QAFgHOGeYUmSlBzvOOgAEE0dnELYUShJkpJjOmET/0HNALj+L0lSMo0Apu1vH8CBAsBs21CSpESaebAzAJMZYDUhSZJUdd6yv35+r/8hmjKYzgDrCUuSpKpz8v768f3NALzRtpMkKbGaCXcDDCoA9FUAlCRJyZQFZu5rI+C+AkA9MM22kyQp0f54X339vgLAcRzg/KAkSap6p+xveuD39LsASJIkJdskwt0AA54BcAOgJEnJVw+csLd9ANl9hAJnACRJSocTBjoD0EjYAyBJkpLvpIEGgBMJUwaSJCkdMwD7XwKI1ghm2FaSJKXGcYTLgQ44A+AGQEmS0qOBcBrggAHADYCSJKXL9NeeBHhtABiHNwBKkpQ2xx9oBuBEvAFQkqTUzQDsMwBEUwNvto0kSUqdqQeaAZhqG0mSlDrNwOj9BYATbCNJklInC7TtKwCMYC/HBCRJUipM2lcAaMMNgJIk1WQAkCRJ6XRs/1oABgBJkmrD5H3NAEy0bSRJSq22fQWA8baNJEmpNY5+lwL1DwAtto0kSalVR7+NgAYASZJqx3gDgCRJtaf59wLAuln1TfRbF5AkSanU9toZgCbbRJKk1DvqtQFgrG0iSVLqNb82ADj9L0lSDQYAZwAkSUq/NmcAJElyBsAZAEmSakDjuln1jf0DwGG2iSRJqZftmwXI2haSJNWU1v4BwIuAJEmqnVmA3wUAZwIkSaoNv7cEUGd7SJJUE35vE6AXAUmSVIMBwCUASUmUHzbtVOuYSINzZP+Ov9H2kJRAhWxj01CbQRq8vgAw2qaQJKkmjO8fAFwCkCSphgb/fR1/k+0hSVJNGGcAkCSp9jT0DwCSJKmGGAAkSTIASJIkA4AkSUqb8QYASZJqT50BQJKkGmUAkCTJACBJiZIf2nqspcwlA4CkGlPIDBs+zGaQDACSJMkAIEmSDACS0iafPfyIZptBMgBIqi2FTP2wUTaDZACQVGsBYEjdETaDZACQVFtyZLITbAbJACCpljp/6LQZJAOApNrSC6yxGaSDU2cTSEqQQr+/djVfd+sQm0QatG4DgKQkdPgFIA9sB5YBq+uPm7FzzDVfHl9/3IxP2ETSoG01AEiq1k4/D/QAi0e89bynR3/qKycOOWLsbOCs6JekQ2QAkFRNI/0eYPGoS6/9xagPXHdupm6oHb5U4gBQwA2BkirT8eeAjiGjj7qn5bblb8k2Np0BnGHTSOUJAFuAcTaHpDLJE3bxr2i64u8Wjbr02ivIZP7GZpHKYnv/ANBre0gqU8ffDbQf9eXHtzVMe+v7gZk2i1S5AFCwPSSVUA7YCdw//t61Rw058pjzbBKpYnr7B4AOYJJtIqlUHf+EhzZPzjY2fcQmkSpuS/8AIElx6ju3b8cvVZ89/QNAzvaQFJNuYEnLbcu3DG091o5fqj6d8OrRPy/UkBTHqH/j4ed+5D8m/uiVU4a2HnuRTSJV7c+qSwCSYhv1L57w0OZstrHpr2wOqar9XingbttD0kEoAF2Z+oavtz66/WoymTE2iZSIwP67ANBle0gapF5g9bj/+PHSYcfP/GubQ0qMnv4BYI/tIWkQtgMPtv6g+42ZuqEftDmkRNkEr24CdAZA0kAUgC2HnX7R1yb+6JUPZOqGHm+TSIn7Ge7sPwPgHgAF2WwWK0NqPx8cY6+f/9Dwme/8jM0hJdLWtvZcvtgvAGy3TQQw5MjxzVE67AZG4C2RCvLA2pbblj89tPXYq20OKbkB4HfjPQOAfi8AHDF2butjO4/NNjZ9EViLRaIUnoHl4+9bt9qz/VLibTIAaJ8yQ4edNOGhzde23PLMEuBBwh6RvC1Ts53/4taHt/UOGXP0OVXyNeUpFndQLHZSLPyGYnGbb5M0YBtfGwDcBKjXqhvaNvXiiQt3/fHh7/74TcAywtER9wfUjl5g4cQf9rRkhjeeUvGvpVjcXMzv/mV+c8dD62c3/NX62Q33r589/L9fnv/1b/lWSQP2v5YAtvjBrr1PB2QnjP74F/5ywgOd24FvRunRZYHaGPk/OHFh75vIDplcwZH+tmI+t3x3x6/mr5/dcFPHOxpfef6iN7wLuAH4OHBa7tfP9Pp2SQO2+XejPIC29lzvuln124HRto32JjtyzJyJC3vftOtnj9655drzXgfMBEbiJsG0dv5PTFzYe2qFKvvlKRZ3FHZ1r9xwdvODwPuAeT5rUiz+1x6AvlkAaT+zAZlRw2e+8+rWH7zcMnTClP8AVhKmiZUeeWDRxB/2tJHJtFRkxL+re8n62Q3/sOHs5qOBzwPT7fyl2GzcWwDwRkANLAfU1U9r+dazf3XMHStXAvdH4dFNgslXAJa3PrytoQLT/t3FV3YtWz+74a875o4ZAXwRmOxbIpUnAGy0XTQIdXXHvH7exIW9s0Zdeu1twBJC7QD3kiTXuvHf3fhimTf85SkWNuRWLb2v46ymHsLa/om+FVKJft5g3d4CQIdtk0jZYn535TrdTKal6YP/99MTFmzJAd+IHi43CSZP19jr539/SNORZ5Z11L+re8n62cO/8cLVb7kAOM23QSqpNfSbre0fANbbNok0cufd/9pDYc8aKrgenz1s1KyJP3rlI2M//70fAI9j7YAk6R4+8503DJ/5znJV+Ht11D93TA74LGFDqaTSWtf/H+r29R+UGC17ujZ/bP3pI+Yfc+evRtaNm/hWMpmjKvS1NA6fMeeq1h90/3LTJ2Z9Lbdq6VlAc0rauZl0lkbOAbeOvX7+deXq/Iu7X3m244yRdwPXAk3+CEtlnQEwAKTMaODy5y8+dkXjOy/75uhPfeWszNBhbwAaK/HFZOqGHn/0DU8eT7GwoZjfvTUNDdxxxshFwHmVatMSKQCLJy7sfV+Z/rzewm93LN5wzti1wOf8sZXK7rm29lxhbwGgg1DpbYRtlEhZYFr3I7dN6n7ktoePvvGnz9a/4aQ5ZDJjX/M+lzEJZCdkhg6bkJL2/Rnp2+DYOeGhzfmynPUvFnfkO9d+//lLpjYDH/THVar8DED/6cw8sMr2SbxGYN4LV7155vrZDV8s7upeQrG4w2bRa3SP/uSXvpNtbJpdhs6/c9fPHr3z+UumTgdm2/RSxazdVwDAAJAqU4DPdswds33Xzx69k2JhA27K06th/9bDz7/6U6Xv/Au/2fb5q27bcu1578Vz/VKlf+7X7TUAROsCz9hGqdIAzN1y7Xlnr589/LbCzm3t3pwmYNnEhb0XlKfz/+jd3Y/cdg2WGZcqbR2vOSn22hmAJbZRKrUCf7XhXS31L8//+reK+d2/whK+tarr6BueXFHiMr95CnvW9Ov83VckVd7y1/6Lur38hhxQb1ulTh1wWte//9lxXf/+Z3ePv3ftxCHNLTMreGRQ5ZfLNjZ9tf64GdeWsvMv5nc/1/GOxjuAvynDZ0k295tf7olCrcqgsGPbZsLsopJl5Wv/RaZYLJLJZML8wKz6LPBzLMWZ+p9hYOmoS6/98agPfObMTF39JNJ1vC12698+7OvAxSS7YM1TExf2vr6Eoa9/5/93lOf0SQ9h5tL9S+UzEjgZ93Qkzflt7bn5ff9QLBb3+gO61ACQelng5B23Xz9lx+3Xz2+55ZkVQyf+wayKHhlUqXUdc8fKjWQypavzXyxsKHPnD2F5YVb0S9K+B32r9tYRvNbPbaua0QRc3nnFSdPWz264vriru+9CH6VLHvh63TGvL93Gv2Kxs+tL19xDmPY3RErVZSevqQHwvwJAdBLAjYC15wTg+o65Yza+8svF93pkMHVWTVy4630l65iLxR3d37/9Oy8/+I2P4P4hqRqt2Nu/3NsMwCpHgTWpEZi36eNvO2397OH/UfjtjkUWEEqF7iP/7s52MtlSVWTszf36mQe2fe7D5+NRP6laPc1eKpnuLQDk2MtxAdWMycDfbzhnbE/Pkw99O7pl0NmAZCoA94+Y9e4PlWj0n9/z0paFL1z15hMJR00lVadfDnQGoAAstr1qWgMw98W/ec/c9aePuHvPS1ses4BQInVO+N7W11GaI1v54q7uJRsvmNAATLOppaq2vP8lQPsLAGBFQAVtwP/ZeMGE+u7v3Xx7Mb/7l1hAKCny9cfNuDU74vA3leLFi/ndz3XMHbMaa/tL1a4HWD2gGYAoJSwlfTef6eDUA3O2feFjF3W8o/H7+c0dj1AsbrZZqj/xH/3VJy4qyei/WNz24t+85z7gAzazVPWWEU4BHDgARNYAW2039TMO+OTzF73hqB23X397cfcrz+Bm0apN/M3X3fok2SFtJXjt3ldW/uyBXYsfuXo/nx+SqsfifQ3oswdIDVJ/dcAp22/5+8s7zhj537vXrXyQYrETNwlWm8cOm/O+K4h/41++8Nsdizd9/G0n4o5/KSl+uq//sK8AYD0A7U8z8KHOK06asn52w2ctIFRVuo65+9dFSjD1X8zvfm7DOWM7gOk2s5QIOeDpvW0A5AAjhJ/ZdtqPLDADmNIxd8z8Iz/7nWX1rzu+uVq+uCFHTTguU1c/hdq7tOTOuqNaL4999F8s7ojW/a/10ZcSowPYuK//uNcPibb2XGHdrPrlhB3f3vqk/RkJfODFv3lPtX1dfzlx4a6Pksm+robei00TFmw5oQQ/s/ndG1Y/4rq/lDhL2M+G/v39MHeyl+sDJVWlQqa+4T+zh42aEffov5jf/VznZdOacN1fSponDzYAACy0/aREWDdhwZazif9a5+4tf3XufcBZNrGUrEEBByjqlz3A//wj21CqevnhM995V2bosDfE/bp7Xnz+h70/X3ilTSwlThewel8bAPcbAKL/aTHu7paq3aojP/udC2Mf/RcLGzbOm7SbUANCUrIs4QCVWw+0BLATeMp2lKpWbtSl1z6SqRs6MebX7X3pG9d9B7jAJpYS6QccoKLvQHb0/th2lKrWiqYr/vZCYt75X/jtjsU77/63ebjrX0qiPAPYw3egH+5C9CLeCyBV5+j/h2SyR8b6qsXitg3njF1NuAxKUvKsA1btb/3/gAEg+p9XAFtsT6lqR/9xrv3nc2uffQS42OaVEuuxgQzcBzK9lwMW2Z5SbYz+X/jQm8YS/3FCSeVzwPX/gQYAjwNK1Wd5KUb/u37+w/nAHJtXSqydwJIDTf8PJgC0RzMBkqpj9P+j+Ef/hRe2fPrsY3Hjn5RkS4CtA/mNB/xBj1LEWsKlApIqb0XT5X9zfsyjf7q/f8f9wCybV0q0AU3/D3QGoG8WwLLAUuXlD3/3x39Adki8xXmKhQ3bPvfhN9m8UrI/H4An4g4AedwHIFWD1Ud89Pp3lmj0f4rNKyXaRmDFQNb/BxwA+pUF7rF9pcql+xFvPW9+ZkjMVf+Kxc5tn/vwH9u8UuItYBD79Qaz2WcTsMz2lSpmVfPf3n4OmcyoWEf/37v5XmCmzSslWgF4hDBjH3sAyAPfsY2liv1w31SS0f8XPmbnLyXfFmDxQKf/BxsACoTqQi4DSOW3tvXR7ZeSyRzm6F/SXrQzyNt7BxwA+h0HfNp2lso++r8lU9/wOqDO0b+kvfgug7y3Z7AFP/LRHyKpfDZNeKDz7XGv/ff8+P77Hf1LqdBFmP7PD+Z/GmwA6KsH0Gt7S2Vzb/bw0X8Y8+h/24t/f/FxNq2UCos4iEv7BhUAomWA1YQbAqVqlo+1w6ycrcfc/euJZDJj4nzR3mcXzceqf1JaDGr3/8HOAPR9sD5ge6vK7YTMiBR8Hw/XjZ3wxzGP/ndsvmbOUSkJSFKt6wEeZ5Dr/4cSAB7FZQBV/wxA4kPM0Tc8WSCTGR3ni+7esPoR4AwfESkVngY6B3P876ADQPSHrMRlAFW3QgpGuE/UHzv9dKAhxtfs7rxsGkC9j4iUCvcc7IDnYK/99DSAqtqYv7xpOpnMsAR/C7nm6279DZnsEXG+6J5tL7QDc31CpFToIszIlz0APIbLAKpSQ5pbGmIeOZfbshGzLjyDeC/9yW+8sK0z5teUVDmPAxsPZvr/oAOAywCqcr2Z+mFJnv4vADdnhtTFeuVvoeflnwIXHELwl1RdnxMHPf3PIX4QuAygarUle9ioJE//r2l99KUPxl32d8PZzT8BRvt4SKnQASwabPGfOAOAywCqzgDQ2HRYgr/+2zP1w9uIcRNjMZ9bDlzi6F9KjQXAzkN5gYP+MIiWAVbhFcGqwgCQGTY8qTUANo2/f8Ob4y78s+kTb38QGO+jIaVCDvgvDvG4czaGL+LbvheqMp3Z4Yc1xfh6eWAk5TlWeP+QpiNPjPXPKhZ+k1u19FxH/1JqrASWHcr0fxwBIA88DGzy/VAV+U1m6LDYRtDF/O5fAZMp/amCnUf/53+PjLvwz47b//m/gKk+FlJq3EOoAHhIDikARMsAmwhrEVI1KBxx1T+NJpM9Mq4X3LXowR8BY8swgn6iftIJb4k1aBSLm7ff8vczHf1LqbGTQzj7H+cMAIRlgHuiv0qVtrXhxLeNifPq3Bf//uI80FTirzs3+pNf+jXEO/rvfXbRAmCGAUBKjSXAmoM9+x9rAIjWIJYCy31fVAVWDTnymOb4RtCFDcCJlL54zorGP7ny9DiDC9C9+Zo5R2DZXylN7oprwB3XqKAHNwOqSgJAtnFUbNP/uV8v+xFh93wpNwAWgG9nhgw9Js4X3fPi8z8EZjv6l1JjE7CQmC47i+uDoe+GwC2+P6qgAvDLTP3wCXG94JZrz1tP6af/N054oPOdMY/+8xvnTXoey/5KafIYsCWO6f/YAkD0xXREIUCqlK6j/u37J5DJjI3l1YrFbXu6Np9EOAJYSvdlDx89Nc5ZhuIrPT8HziX5NyJKCnLAd4hxv1025i/uLtwMqMpZMbT12KPj6vT2dG36KTCJ0q6hd7Xctrwl7qN/nZf90WPAOB8JKTWWA4sP9ex/SQKAmwFVBZZlR46ObR19279e/QtKXzu/fej4yTOI8+hfYc+a/OaOd+Pav5QWBeBmDrH0bylnAAC6cTOgKiPXdMXf5TN19ZNier3eXYsfeR2lnf7vbb7u1ufjrFkAsP3Wz36XULjIACClwzpC0b18nC8a9wdEDjcDqjI6Rpx2XktcG+mKu7qfJlTPK+WdAstHvO2CU2Pd/Fcsbt5x+/VvxrV/KU3uALbGtfnv9wJAsViM5dfEH71SADZGSUUqp6eHNLfEtub98gM3/pTSTv+Ho3919S2xTiks+/GDwHRH/1JqbCJc/NMbV19dLBZLMgMA4Xrge/CaYJVPAfh59rCRr4vp9fIv3fiZwyjt8b+OCQ9tflfMt/51b/7zM8dg4R8pTR4G1sY9+i9JAOi3GXCJ75vKZPvY6+e3kcnGcv6/mN/9HKWv/nd/9rCRbyDGqfr85o4fALNw+l9Ki53A7aUaUGdL+EXfhEcCVR4r618/rSWujq932Y/bgeYS/nx0tdzyzLi4N/89f9EbXqD0NQsklc9TxHDtb1kDQFt7LkcoV7jM909lEOvxvy2fPvtFSjv93143/g1vJMajf8VXdi0F5jr6l1IjB9xCDNf+lnsGAKAr+uLzvo8qofzh7/74bzP1DfGs/xeL2wib6Eo1ku4d/ckvrc8MqYu1SM/mT5/9KNDi4yClxnLgiWhAnbgA0HckcKXvo0poY+MZ7z86rs10UfW/Vkq3kW5549zL3xrv0b/Cb1559smzHP1LqVEAbgO2l/IPKVkAiHYsboq+iYLvp0pkWd24ibGNfLff/HfPUrrp/wJwT6a+YUKcL9r9/TseJNQs8OiflA5rCbv/S7qPrtQfGDlgAbDG91Ml8vNsY1NbTK+V737ktqNLGAA6xt+/4fS4j/5t+9yH34BH/6Q0uZsYb/2rSACIvviNWB5YpbG9+bpbx5IdMj6e8fmedcAUSlf9b8GQpuY/IM6jf88/9zBwCk7/S2mxCfguJdz8V64ZAAjnF+cTahlLcVo17Pg3H01Mu+lza37xFKH6Xyl+LrqOvvGnI2M++pd//pKp2yltuWJJ5TUfWFPq0X9ZAkD0TawF7vN9VcxWDmlqjm39/6VvXLeB0u3+Xzh00h/+MTEWFyru6l4CuPlPSo9Owr65nnL8YeXaNNRLqGXc6furGP1PpmFEXBvq8r0/XziB0qz/9zZfd+sLcR/92/SJty8ExuLmPykt7gNWlqrwT0UCQPTNrCRsCJTi0NN83a2tsU2ph/X/ScRYnKefpSPeet6b4z76l3tu+Vzc/Celxbpyjv7LOQNA9E3dBWz1fVYMNg593fFHxNVh7+741RJKs/5fAO6K/ejf9775AHCco38pNe4EVpdr9F/WABB9U8vwqmDFFACGjBxzeFwvtvPeL62nNOv/68Z/d+O5sR/9+8LHpjj6l1JjDeEW3Z5y/qHlHj10E8oDb/H91iHqyBw2cnRsD+Yjtx1eogDw4JBRY6YQ40a93R2/WgDMxM1/UhoUon5xbTl2/lcsAESzAE/jiQAdus5MfUNcAaAbmEz8x+m6jr7hyaa4j/51XjZtJ6W9qlhS+awG7i/36L8SMwBE3+RtWBdAh2ZzZkjdEXG8UDGfW0tY/497RL1w6OQ/elOcnXWh5+WfAmc4+pdSIQ/cDGws9+i/IgGg34mAW/COAB1kP3jEn36+lUwmlhmA/MY1K0owou4Z85c3PZ8ZUjc+zhd94YPT2/Hon5QWywmFf3oq8YdX6kOkB7gXWOH7r4N5foZOeMMIYjoB0PvMjzcT//G/pw97+4UzYz36V9izJr+542xKc1RRUmVG/52VGP1XLABE32wHcBMlvu1IqbQze/gRw+J6sT0vbc4T75R6dOvf8LZYv+n/+uoDhLsKHP1LybcUeJRQKK8iKvlB0ks4ErjY50CD1J0ZWl/Na+Brx3934zmxHv0rFre99LVPH+/oX0qFHHBjJUf/FQ0A0TfdGTVCj8+DBjUDcNioau4I74v76F/uVz9/CDgZN/9JabAEWNjWnuut5BdR0anE6JtfCDzu86DBzABQN3RolX5tnS23PNNKJnt0jK+Zf+Hqt2Tx6J+UBtuBG6iCejjVMJroimYBTgGafTY0EJnskNjCa/bw0VlgZ/SDOVC9hGm8nujvu6Nn+cmhE4/7KDFO1Rd2bmsHZmHlPykNHgQer/TovyoCQFt7LrduVv0SwlGID/lsqNwaz3z/H+3peuHh3K+X7R7wD87YCdkhzS11Q444qm7IEWOH1o2b2DjkyGOah4w+6uMxj/7Z8K6WxVFAlpRsawmb37uq4YuplvXE7YTiQGcArT4jKqfsyDFzjrjq+jnV+LUV87t/BZyLm/+kpMsT6t8sL+eFP/v97KuGLyJqjBWE25AsDiRFXr7v3xcAbXj0T0q6xYT6N91VM/iposbpJtyGtNznRAKKxR0v3fiZ44n/jgJJ5bWdsPGvo5LH/qo2AESzAKujRur2eVGty6199iFgBh79k5LuQarg2F81zwDAq8WBFvi8qMblX/jQmwp49E9KujWEjX9bq+0Lq6oAEE2NbCEcC1zjc6NatWf7iz/Eo39S4oM8Vbbxr5pnAGhrz+WApwmXJPT6/KgWbTx//C8IdTHc/Ccl12Lgfqp0WbtaP1y6gfuAdp8f1ZriK7uWAufg0T8pybZThRv/qj4ARI21MWq8Tp8j1ZIX/+/7vg+Md/QvJdp8wsa/qr3rpmo/YKLdkk8Bd2BtANXM8L/wm12LH3k7Hv2TkmwNYe2/q5q/yGofYWwHvk24OUlKvd/+8J4FwFQ8+iclVY5XN/7lDAAHPwuQj5LUVxncRS1SEvVu/cfLJzj6lxLtccIetp3V/oVW/RpjtH7yOGEnpZRauzt+NZ9Q+Mejf1IyrQW+QhVv/EtUAIhsJRwLXOHzpZTKd142rRuvxJaSqodQw2ZxtVX8S3QA6HdZ0I1RI0upsuelLY9h4R8pyRaQkKn/pM0AQKgNsADLBCuFNl4wYSUwDo/+SUm0MhqgbkzC1H/iAkDUqJ2E2gDeGKjUKPS8/BPgLNz8JyVRd9QvLa32Xf9JngHoKxO8FE8FKEVe+OD0dqDV0b+USPcSbvtL3C22iTtr3Nae6143q34B8IfAn/qhWZMaXvnl4hUNJ5/xk6R/I8Vd3Tvymzv+xNG/lEh999Z0Jmnqv0+mWCzG+4KZTMm/6HWz6uuAacDngdk+gzVnK2FT6PY0hBnC5j/r/kvJ0gX8BXBfW3uuLKP/2PvrJAaAKAQ0ENZNvwi0+SxKksqkAHwNuL6tPVe2+2ri7q8TO30enbN8ArgJjwZKksrnKeA2YEuSv4mkr59vJ2zAsEqgJKkcNhE2oq+MatQYACo0C1AAOqJZgKU+l5KkEsoBt1Ll1/zWygxA39HAp6NEttXnU5JUIguA26nya35rJgBEIaAbeDRKZnmfUUlSzBZHA801SZ/6T1UAiGyNktnjPqeSpBitI9zytyRp1f5qIgBEiWx1X0LzeZUkxWAnodTvY+U6728AOLgQ0Assit6s7T63kqRDkAfuIJw260rbN5fGMro7CVcy3krYsSlJ0sF4lHDKbGMSS/3WXADod2vgLYQLGiRJGqxlhCXlVWnZ9FcLMwCv3Q+wyOdYkjQIncCXgaeipeVUSu1NetGbtpSwc3Otz7MkaQC6gRuBh9vaczvT/I2m+irdaMfm44QLg7b4XEuS9qMA3A3cSQ0Ulsum/Rtsa891ETYFfoWwQVCSpL1ZCNwMdKRx01/NBYDIFsJRjm8AvT7jkqTXWBkNFJenqdhPzQeAKMltjJLdHYRpHkmSIFwq92XgiTRc8mMA+N8hIE+oEHgDXh8sSQq2Ek6MPdjWntteS994tpa+2SgErCBM8zzmcy9JNa2bsDR8NzW4UTxba99wtLazlHAywBoBklSbcoSKsbeR0kp/BoC9h4CeqPP/AuGKR0lS7eg77ncTsLYWO/+aDQBRCOirEfBlwu5PSVJtWEDYD5baMr8GgIGFgEeBzxNKB0uS0q09Gvgtq5XjfgaAfYeA7YRLg75IOAoiSUqnvv1fi9Nc498AMLgQ0EU4GmjJYElKp1XRZ3x7LZ31NwAMzFbCppAvUwM1oCWphvQV+nk07Rf8GAAObhagEI3+v2UIkKRUDe6+CswHttscBoD9hYBOwtlQQ4AkJdvvFfqp1eN+BoCDCwHeIChJye38vw7cAnTa+RsABhsCvhU9QN22iiQlrvO/EVhXy2f9DQAHHwI2EipFGQIkyc7fAFBDISAPrIseJEOAJNn5GwAMAZIkO38DQC2FgK8BXbaKJNn5J1mmWCzG+4KZTGoba92s+jpgPHAJcA3Q7CMkSXb+5RB3f+0MwOBnAjqwToAk2fknnAFg8CHAYkGSZOdvADAEeIGQJNn5J497AA7Buln1WWAcMA/4FNDqIyVJJbUz6vxvqrXOP/b+2gAQSwhojkLApw0BklQymwgX+9wBbKy1kb8BoLpDwAXAJ4Cp/pxKUqzWEPZd3UeNXuxjAKjuENAEnAP8pSFAkmLzdNT5LwC21+rFPgaA6g8CTcBc4C+A6f7cStIhaSdstm5va8/V9O2sBoBkhICRwGzCxsDT/PmVpEErAA8SrmVf3Nae66n1BjEAJCcEjABOJVQMPAuPXErSQPUCdwI3ACva2nO9NokBIGkhoAGYAXyMsEGw3laRpP3aDvwncDOwtq09l7NJDABJDQH1wAnAVYQ7BEbYKpK0V52EY353UoPH/AwA6QwBdcBk4ErgQ4TTApKkV60m7PS/nxo95mcASHcIGA9cRFgSGG+rSBIQjvl9EXi4rT3ndesGgFSGgL6CQecSTghYK0BSLSsAj0cj/0W1fszPAFAbQWAkMIdwQsBjgpJqUTdhrf9mwk7/HpvEAFArIWAEMJOwHHAuUGerSKoRHYQjfvcCHW72MwDUYghoICwDXEk4ITDSVpGUcosJxX0eA7rc7GcAqOUQ0Lc58ELgamCSrSIphXKEHf43Akvb2nPdNokBwBDw6kVCswi3CZ6GlQMlpccW4JvA7cAai/sYAPS/g8AIYBrwYWAe0GirSEq4FYTiPg8Cm5zyNwBo3yGgnrAkMI9QPbDNVpGUQB7xMwDoIEJA35LAGYQlgVNsFUkJshO4g3DEb6WX+RgANPggMAKYHs0EXID3CEhKwEcX4Yjf3UCnR/wMADr4EFAPtBJKCH84+ntJqjZ5oD3q/NuB7a73GwB06CEgC4wmnA64mnBawMJBkqpFJ/At4C7CLn+r+hkAFHMQGEG4VfBS4APAWFtFUgUVotH+V4EnolG/U/4GAJUoBNRFswFzCGWEZ2LNAEnlt4Ww0e92YLWjfgOAAaC8swF9ZYQvxjLCkso36n8qGvUvJJTzddRvADAAVGA2YCwwl7A3YLqtIqnEo/47gdsc9RsADADVEQQagRMJxwXPwwqCkuIf9S+NRv2POuo3ABgAqisE1APjotmAq6JAIEmHqotwpv8WQlEfR/0GAANAFYaALKFY0FTCSYF5eFJA0qGP+h8DtjrqNwAYAKo/CPSdFDiVsDfgNKDelpE0QJsIa/3fBlY56jcAGACSFwQaCJUDzyOcFphiq0jajx7CGv9NwBJgp6N+A4ABILkhIEvYFNh3zfB5eGRQ0u8rAMuAG6MAsKmtPZezWQwABoB0BIE6oJlXCwidjAWEJEEHYbr/LmAt0GMNfwOAASCdQWAEMAl4D6GccJutItWk7mi0fyNhs99OO34DgAEg/SGgb1lgKnAF4arhZltGqgl54GnCrX19u/ud7jcAGABqLAjUEfYDnEw4LTCHcIxQUjp1ALcC9wDr3N1vADAAGATqefWCoauBGXhsUEqTncDDhOn+p4Fup/sNAAYA9Q8CDUALcC7h2OBU3CgoJVkPsIhwrK/vul6n+w0ABgDtNQT0VRNsA95PuGmw1ZaREtvxL4o6/l6bxQBgANBAg0DfRsH3EzYKttgyUlXrjTr8G+34DQAGAB1qEKjj1fsFDAJSdcoRjvLdBDxO2Nlvx28AMADIICDZ8csAYACQQUBKuv5n+e34DQAGAFUsCFwaBYFxtoxU8o5/BXAzsIBQs9+O3wBgAFBFg8BkQnnheYQTBB4flOLTE434bydU79sE5Cb+6BXP8ssAoIoHgb7jgy3AWcBlwAlYUEg6FF3AwqjjX0wo6JPrK+IT9+e3DAAGAB1qEOirLHga4a6BUwhHCiUdWIFQsvd+4DvASqB3bwV8DAAyAKhaw0B91PFPj2YEzsJLh6R9yRHW928jlO3dFHX8+X39DwYAGQBU7UGgDmgApgDvJewTaMV9AhKEaf1FUcffzmum+ffHACADgJISBLJREBgLnEE4RjgdlwdUmzYB84G7gGXsY5rfACADgNIWBPpmBU4AziccI2xzVkAplyOs6d8Tdf4d0Wg/fzAvZgCQAUBpmBUYSdg0+L7or6NtHaVEAVhHOLf/AOE4Xy8DnOY3AMgAoFoIA32zAm2EK4nfQyg05FFCJdEWwpn97xLW+HcC+YMd7RsAZABQrcwK1BH2BswgLBHMBcbjEoGq207gKeC/CCV6t3AIU/wGABkAVOuzAn1hYCbwLsIGQsOAqkUvsJywrv8YsJZQsjd/qFP8BgAZAKR9h4G5hDsIDAMqp3zU0d8PPETYxV+WTt8AIAOADAMhDDQBpxKWCeYQCg0ZBlQKPYRCPY8CP4j+vqfcnb4BQAYAae9hYCZwOmGZoA03EOrgFYCtwBNRh98ObKzESN8AIAOANLAw0LeJcAowG3gH4T6CkbaQDiAHrCGs5X8fWNI3ygcK1dDpGwBkAJAOHAayURjIEuoKzIzCwBxgUhQSpL6d+z8g3Ly3Khr956utwzcAyAAgHXwg6JshOI5QcOit0eyAGwlrb5S/KOr0nyJM9ReqcZRvAJABQCrd7EAWmBwFgbdEf23F/QNp0XdMbxHwM8K0fmcSO3wDgAwAUulDQSuhCFHfDMFxhCqFqm4FQvGdJf06+6eB7jR0+AYAGQCk8gYCCHsIphFuLzyJcInRFGcJKt7ZbyKcwV8B/CIa6a/u6+wB0tThGwBkAJAqFwjoFwpGRkHghCgUnBj9vTMF8csRNuf1dfTLCLfqbeoXBlLd2RsAZACQqjsY1EczA9OBNxD2FkwmnDpoxI2GB5InrM+vijr4/yFM4a8mHMf7XQdfa529AUAGAClZoaC/cVE4mAy8vl84mByFg1pRIBy9W0O4JncN8Fw0ql8T/Tfs6A0AMgBItRAQxr3m13jgmL38u6TMIOSizr3v1/p+nf06wrE7O3kDgAwAkgYYHFqAlmjGYBxhv0Fd9O+GEPYlNEW/fXz03+qivx+sTYQjdHv7+xywh7DjvhfYDnQRpu+3t7XntvpuGQBUYwFAkiRVv/8/AAVra3mQ9I9AAAAAAElFTkSuQmCC">'
				});
				visual.text = tools.createHTML({
					tag: 'div',
					className: 'qe-video-button-text',
					parent: visual.html,
					innerHTML: options.disliketext
				});
			}
		}

		this.create(options);
	}

	link.create(options);
}