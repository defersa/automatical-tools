function calendar_ui(options){

	var _calendar;
	var setting;

	var monthName = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var monthNameShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var dayNames = ['Mo','Tu','We','Th','Fr','Sa','Su'];
	var vDay = 86400000;
	var animationSpeed = 6;


	var leftButton = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="8px" height="12px" viewBox="0 0 8 12" xml:space="preserve"><path class="cu-arrow" d="M 0,6 L 6,0 L 8,2 L 4,6 L 8,10 L 6,12 z" /></svg>';
	var rightButton = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="8px" height="12px" viewBox="0 0 8 12" xml:space="preserve"><path class="cu-arrow" d="M 8,6 L 2,0 L 0,2 L 4,6 L 0,10 L 2,12 z" /></svg>';

	var topButton ='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="8px" viewBox="0 0 12 8" xml:space="preserve"><path class="cu-arrow" d="M 6,0 L 0,6 L 2,8 L 6,4 L 10,8 L 12,6 z" /></svg>';
	var bottomButton = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="8px" viewBox="0 0 12 8" xml:space="preserve"><path class="cu-arrow" d="M 6,8 L 0,2 L 2,0 L 6,4 L 10,0 L 12,2 z" /></svg>';

	var link = this;

	link.create = function(options){
		if(!options)							options = {};
		if(_calendar)							link.remove();
		var cd = new Date();

		if(options.preRow == undefined)			options.preRow = true;
		if(options.month == undefined)			options.month = cd.getMonth();
		if(options.year == undefined)			options.year = cd.getFullYear();
		if(options.startDay == undefined)		options.startDay = 0;
		if(options.week == undefined)			options.week = [true, true, true, true, true, true, true];

		if(options.parent == undefined)			options.parent = document.body;


		window.addEventListener('resize', display.generate);
		setting = { type: true };
		create.panel();

		link.change(options);
	}
	link.change = function(options){
		if(options.parent !== undefined)			changing.parent(options);
		if(options.startDay !== undefined)			setting.startDay = options.startDay;

		if(options.type !== undefined)										setting.type = options.type;
		if(options.month !== undefined || options.year !== undefined)		changing.date(options);
		if(options.preRow !== undefined)									changing.preRow(options);
		if(options.week !== undefined)										changing.week(options);
		if(options.startDay !== undefined)									create.dayName(options);

		display.generate();
		changing.title();
	}
	link.remove = function(options){
	}

	link.setSelect = function(dates){
		select.removeAll();
		for(var i = 0; i < dates.length; i++){
			select.add(dates[i]);
		}
	}
	link.getSelect = function(){
		var result = [];
		for(var i = 0; i < select.items.length; i++){
			result.push(select.items[i]);
		}
		return result;
	}

	var events = {
		click: {
			title: function(e){
				if(setting.type){
					setting.sMonth = setting.month;
					setting.sYear = setting.year;
					display.slideToYear.start();
				} else {
					console.log(_calendar);
				}
			},
			right: function(e){
				display.nextMonth();
			},
			left: function(e){
				display.prevMonth();
			},
			top: function(e){
				if(setting.type)		display.month.up.start();
				else					display.year.up.start();
			},
			bottom: function(e){
				if(setting.type)		display.month.down.start();
				else					display.year.down.start();
			},
			day: function(e){
				var cell = e.target;
				if( _calendar.week[ cell.d ] ){
					cell.className = 'cu-day-name';
					for(var i = select.items.length - 1; i >= 0; i--){
						if(select.items[i].getUTCDay() == cell.d)	select.remove(select.items[i]);
					}
				} else {
					cell.className = 'cu-day-name cu-day-name-select';
				}
				_calendar.week[ cell.d ] = !_calendar.week[ cell.d ];
			}
		},
		down: {
			date: function(e){
				if(e.which != 1)	return;
				select.down(e);
			},
			month: function(e){
				if(e.which != 1)	return;
				setting.sMonth = e.target.date.month;
				setting.sYear = e.target.date.year;
				display.slideToMonth.start();
			}
		},
		enter: {
			date: function(e){
				select.enter(e);
			},
			top: function(e){
				display.scroll.top(e);
			},
			bot: function(e){
				display.scroll.bot(e);
			}
		},
		leave: {
			scroll: function(e){
				display.scroll.leave();
			}
		},
		wheel: {
			content: function(e){
				if(e.ctrlKey)			return;
				var delta = (e.deltaY || -e.wheelDelta)/2;

				if(delta < 0){
					if(setting.type)	display.month.up.start();
					else				display.year.up.start();
				} else {
					if(setting.type)	display.month.down.start();
					else				display.year.down.start();
				}

				tools.stopProp(e);		return false;
			}
		}
	}

	var create = {
		panel: function(options){
			_calendar = {};

			_calendar.html = tools.createHTML({tag: 'div', className: 'cu-panel'})

			_calendar.header = tools.createHTML({tag: 'div', parent: _calendar.html, className: 'cu-panel-header'});
			_calendar.content = tools.createHTML({tag: 'div', parent: _calendar.html, className: 'cu-panel-content', onwheel: events.wheel.content });
			_calendar.title = tools.createHTML({	tag: 'div',
													parent: _calendar.header,
													onclick: events.click.title,
													className: 'cu-panel-header-title'});


			_calendar.toBottom = tools.createHTML({	tag: 'div',
													parent: _calendar.html,
													className: 'cu-panel-bottom cu-panel-button',
													innerHTML: bottomButton,
													onclick: events.click.bottom,
													onmouseenter: events.enter.bot});
			_calendar.toTop = tools.createHTML({	tag: 'div',
													parent: _calendar.html,
													className: 'cu-panel-top cu-panel-button',
													innerHTML: topButton,
													onclick: events.click.top,
													onmouseenter: events.enter.top});

			_calendar.toLeft = tools.createHTML({	tag: 'div',
													parent: _calendar.header,
													className: 'cu-panel-header-left cu-panel-button',
													innerHTML: leftButton,
													onclick: events.click.left});
			_calendar.toRight = tools.createHTML({	tag: 'div',
													parent: _calendar.header,
													className: 'cu-panel-header-right cu-panel-button',
													innerHTML: rightButton,
													onclick:events.click.right });

			_calendar.weekDays =  tools.createHTML({tag: 'div', parent: _calendar.html, className: 'cu-panel-week-days' });
			
			_calendar.weekDays.days = [];
			_calendar.week = [true, true, true, true, true, true, true]
			_calendar.month = [];
			_calendar.year = [];
		},
		dayName: function(options){
			if(options.startDay >= 0 && options.startDay <= 6 )	setting.startDay = options.startDay;
			else												setting.startDay = 0;
			_calendar.weekDays.innerHTML = '';
			for(var i = 0; i < 7; i++){
				var cn = (_calendar.week[(i + setting.startDay)%7]) ? 'cu-day-name cu-day-name-select' : 'cu-day-name';
				_calendar.weekDays.days[i] =  tools.createHTML({	tag: 'div',
																	parent: _calendar.weekDays,
																	style: ('left: ' + (1 + i * 14) + '%;' ),
																	className: cn,
																	onclick: events.click.day,
																	innerHTML: dayNames[(i + setting.startDay)%7] });
				_calendar.weekDays.days[i].d = (i + setting.startDay)%7;
			}
			_calendar.content.innerHTML = '';
			_calendar.month = [];
		}
	}

	var changing = {
		parent: function(options){
			setting.parent = options.parent;
			options.parent.appendChild(_calendar.html);
		},
		date: function(options){
			if(options.year)				setting.sYear = options.year;
			if(options.month !== undefined)	setting.sMonth = options.month;
			_calendar.content.innerHTML = '';
			_calendar.month = [];			
		},
		title: function(){
			if(setting.type){
				if(_calendar.month.length < 1)	return false;
				setting.month = _calendar.month[1].r[3].date.getMonth();
				setting.year = _calendar.month[1].r[3].date.getFullYear();
				_calendar.title.innerHTML = monthName[setting.month] + ' ' + setting.year;
			} else {
				_calendar.title.innerHTML = _calendar.year[0].d.year;
			}
		},
		week: function(options){
			_calendar.week = options.week;
			for(var i = select.items.length - 1; i >= 0; i-- ){
				if( !_calendar.week[ select.items[i].getUTCDay()] ) select.remove(select.items[i]);
			}
			create.dayName({startDay: setting.startDay});
		},
		preRow: function(options){
			if(options.preRow)			_calendar.html.className = 'cu-panel cu-pre-row';
			else						_calendar.html.className = 'cu-panel';
			setting.preRow = options.preRow;
		}
	}

	var display = new function(){

		this.month = new function(){
			this.generate = function(){
				var d;

				if(_calendar.month.length <= 0){
					d = new Date(setting.sYear, setting.sMonth, 1 );
					if(d.getUTCDay() < setting.startDay)		d.setDate(d.getDate() - d.getUTCDay() + setting.startDay - 7);
					else										d.setDate(d.getDate() - d.getUTCDay() + setting.startDay);
				} else {
					d = new Date( _calendar.month.last().s.valueOf() + vDay*7 );
				}
				var rows = display.month.getRowCount();
	
				for(var i = _calendar.month.length; i < rows; i++){
					makeWeek(d, i);
					d.setDate(d.getDate() + 7);
				}
				while(_calendar.month.length != rows)	removeWeek(_calendar.month.length - 1);
			
				changing.title();
			}
			this.getRowCount = function(){
				var height = _calendar.content.offsetHeight;
   				return Math.floor(height / 30);
			}

			function makeWeek(d, p){
				var sd = new Date(d.valueOf());
				var ad = new Date(d.valueOf() + vDay*3)
				var ed = new Date(d.valueOf() + vDay*6);
				var r = [];
				var n = tools.createHTML({ tag: 'div', parent: _calendar.content, className: 'cu-month-name', style: 'top: ' + (30*p) + 'px;' , innerHTML: monthNameShort[ad.getMonth()]})
				var c = tools.createHTML({ tag: 'div', parent: _calendar.content, className: 'cu-week', style: 'top: ' + (30*p) + 'px;' })
				_calendar.month.splice(p, 0, {r: r, c: c, s: sd, e: ed, n: n });
				display.month.days(r, c, sd);
			}
			function removeWeek(p){
				tools.destroyHTML( _calendar.month[p].c );
				tools.destroyHTML( _calendar.month[p].n );
				_calendar.month.splice( p, 1);				
			}

			this.days = function(r, html, d) {
				for(var i = 0; i < 7; i++){
					r[i] = { date: new Date(d.valueOf() + vDay*i) }

					var className = ( ((r[i].date.getMonth() + setting.sMonth)%2) ? 'cu-day' : 'cu-day-month' );
					if(r[i].date.getUTCDay() == 5 || r[i].date.getUTCDay() == 6)	className += ' cu-day-hol';
					if(select.is(r[i].date))										className += ' cu-day-select';
					if(select.hover.s <= r[i].date && select.hover.e >= r[i].date
								 && _calendar.week[r[i].date.getUTCDay()] )		className += ' cu-day-hover';	

					r[i].html = tools.createHTML({	tag: 'div',
												className: className,
												parent: html,
												onmousedown: events.down.date,
												onmouseenter: events.enter.date,
												innerHTML: r[i].date.getDate(),
												style: 'left:' + (1 + i*14) + '%;'});
					r[i].html.date = r[i];
				}
			}

			this.up = new function(){
				var lCount;
				this.roll = function(count){
					if(count >= 0)	lCount = count;
					if(lCount > 0)	display.month.up.start();
				},
				this.start = function(){
					_calendar.content.style.height = (_calendar.month.length*30) + 'px';
					var d = new Date(_calendar.month[0].s.valueOf() - vDay*7);
					makeWeek(d, 0);
					step(15);
				}
				function step(dif){
					for(var i = 0; i < _calendar.month.length; i++)
						_calendar.month[i].c.style.top = _calendar.month[i].n.style.top = (30*i - 2*dif) + 'px';

					if(dif > 0)											setTimeout( step, animationSpeed, dif - 3);
					else												end();
				}
				function end(){
					removeWeek(_calendar.month.length - 1);
					_calendar.content.style.height = '';
					changing.title();
					display.month.up.roll(lCount - 1);
				}
			}
			this.down = new function(){
				var lCount;
				this.roll = function(count){
					if(count >= 0)	lCount = count;
					if(lCount > 0)	display.month.down.start();
				}
				this.start = function(){
					_calendar.content.style.height = (_calendar.month.length*30) + 'px';
					var d = new Date(_calendar.month.last().s.valueOf() + vDay*7);
					makeWeek(d, _calendar.month.length);
					step(0);
				}
				function step(dif){
					for(var i = 0; i < _calendar.month.length; i++)		_calendar.month[i].c.style.top = _calendar.month[i].n.style.top = (30*(i) - 2*dif) + 'px';
					if(dif != 15)										setTimeout( step, animationSpeed, dif + 3);
					else												end();
				}
				function end(){
					removeWeek(0);
					_calendar.content.style.height = '';
					changing.title();
					display.month.down.roll(lCount - 1);
				}	
			}
		}
		this.year = new function(){
			this.generate = function(){
				var d;

				if(_calendar.year.length <= 0){
					d = {year: setting.sYear, month: 0 };
				} else {
					d = {year: _calendar.year.last().d.year, month: _calendar.year.last().d.month };
					nextPeriod(d);
				}

				var rows = display.year.getRowCount();

				for(var i = _calendar.year.length; i < rows; i++){
					makeHalfYear(d, i);
					nextPeriod(d);
				}
				while(rows < _calendar.year.length){
					removeHalfYear(_calendar.year.length - 1);
				}
			}
			this.getRowCount = function(){
				var height = _calendar.content.offsetHeight;
   				return Math.floor(height / 45);				
			}

			function nextPeriod(d){
				if(d.month == 4){
					d.month = 8
				} else if(d.month == 8){
					d.month = 0;
					d.year++;
				} else {
					d.month = 4;
				}
			}
			function prevPeriod(d){
				if(d.month == 4){
					d.month = 0;
				} else if(d.month == 8){
					d.month = 4;
				} else {
					d.year--;
					d.month = 8;
				}
			}

			function makeHalfYear(d, p){
				var r = [];
				var year = d.year + '';
				var n = tools.createHTML({ tag: 'div', parent: _calendar.content, className: 'cu-year-name', style: 'top: ' + (45*p) + 'px;' , innerHTML: year[0] + '' + year[1] + '<br/>' + year[2] + '' + year[3] })
				var c = tools.createHTML({ tag: 'div', parent: _calendar.content, className: 'cu-half-year', style: 'top: ' + (45*p) + 'px;' })
				_calendar.year.splice(p, 0, {r: r, c: c, n: n, d: tools.cloneObject(d) });
				for(var i = 0; i < 4; i++){
					r[i] = { month: d.month + i, year: d.year }
					var className = 'cu-month';
					if(select.monthIs(r[i]))	className += ' cu-month-select';
					r[i].html = tools.createHTML({	tag: 'div',
												className: className,
												parent: c,
												onmousedown: events.down.month,
												innerHTML: monthNameShort[r[i].month],
												style: 'left:' + (2 + i*24) + '%;'});
					r[i].html.date = r[i];
				}
			}
			function removeHalfYear(p){
				tools.destroyHTML( _calendar.year[p].c );
				tools.destroyHTML( _calendar.year[p].n );
				_calendar.year.splice( p, 1);
			}

			this.up = new function(){
				var lCount;
				this.roll = function(count){
					if(count >= 0)	lCount = count;
					if(lCount > 0)	display.year.up.start();
				},
				this.start = function(){
					_calendar.content.style.height = (_calendar.year.length*45) + 'px';
					var d = tools.cloneObject(_calendar.year[0].d);
					prevPeriod(d);
					makeHalfYear(d, 0);
					step(15);
				}
				function step(dif){
					for(var i = 0; i < _calendar.year.length; i++)
						_calendar.year[i].c.style.top = _calendar.year[i].n.style.top = (45*i - 3*dif) + 'px';

					if(dif > 0)											setTimeout( step, animationSpeed, dif - 3);
					else												end();
				}
				function end(){
					removeHalfYear(_calendar.year.length - 1);
					_calendar.content.style.height = '';
					changing.title();
					display.year.up.roll(lCount - 1);
				}
			}
			this.down = new function(){
				var lCount;
				this.roll = function(count){
					if(count >= 0)	lCount = count;
					if(lCount > 0)	display.year.down.start();
				}
				this.start = function(){
					_calendar.content.style.height = (_calendar.year.length*45) + 'px';
					var d = tools.cloneObject(_calendar.year.last().d);
					nextPeriod(d);
					makeHalfYear(d, _calendar.year.length);
					step(0);
				}
				function step(dif){
					for(var i = 0; i < _calendar.year.length; i++)		_calendar.year[i].c.style.top = _calendar.year[i].n.style.top = (45*(i) - 3*dif) + 'px';
					if(dif != 15)										setTimeout( step, animationSpeed, dif + 3);
					else												end();
				}
				function end(){
					removeHalfYear(0);
					_calendar.content.style.height = '';
					changing.title();
					display.year.down.roll(lCount - 1);
				}	
			}
		}

		this.nextMonth = function(){
			var count = 0;
			if(setting.type){
				var d = new Date(_calendar.month[1].r[0].date);
				while(d.getMonth() == _calendar.month[1].r[0].date.getMonth()){
					d.setDate(d.getDate() + 7);
					count++;
				}
				display.month.down.roll(count);
			} else {
				if(_calendar.year[0].d.month == 0)		count = 3;
				else if(_calendar.year[0].d.month == 4)	count = 2;
				else									count = 1;
				display.year.down.roll(count);
			}
		}
		this.prevMonth = function(){
			var count = 0;
			if(setting.type){
				var d = new Date(_calendar.month[0].r[0].date);
				while(d.getMonth() == _calendar.month[0].r[0].date.getMonth()){
					d.setDate(d.getDate() - 7);
					count++;
				}
				display.month.up.roll(count);
			} else {
				if(_calendar.year[0].d.month == 0)		count = 3;
				else if(_calendar.year[0].d.month == 4)	count = 1;
				else									count = 2;
				display.year.up.roll(count);
			}		
		}

		this.slideToYear = new function(){
			this.start = function(){
				setting.type = false;
				_calendar.oldContent = _calendar.content;
				_calendar.content = tools.createHTML({tag: 'div', parent: _calendar.html, style: 'left: 100%; width: 100%', className: 'cu-panel-content', onwheel: events.wheel.content });
				_calendar.month = [];
				display.year.generate();
				changing.title();
				step(100);
			}
			function step(des){
				_calendar.content.style.cssText = 'left: ' + des + '%; width: 100%;';
				_calendar.oldContent.style.cssText = 'left: -' + (100 - des) + '%; width: 100%;';
				if(des != 0) 	setTimeout(step, animationSpeed, des - 2.5);
				else			end();
			}
			function end(){
				tools.destroyHTML( _calendar.oldContent );
				_calendar.oldContent = undefined;
			}
		}
		this.slideToMonth = new function(){
			this.start = function(){
				setting.type = true;
				_calendar.oldContent = _calendar.content;
				_calendar.content = tools.createHTML({tag: 'div', parent: _calendar.html, style: 'left: 100%; width: 100%', className: 'cu-panel-content', onwheel: events.wheel.content });
				_calendar.year = [];
				display.month.generate();
				changing.title();
				step(100);
			}
			function step(des){
				_calendar.content.style.cssText = 'left: ' + des + '%; width: 100%;';
				_calendar.oldContent.style.cssText = 'left: -' + (100 - des) + '%; width: 100%;';
				if(des != 0) 	setTimeout(step, animationSpeed, des - 2.5);
				else			end();
			}
			function end(){
				tools.destroyHTML( _calendar.oldContent );
				_calendar.oldContent = undefined;
			}
		}

		this.generate = function(){
			if(setting.type)	display.month.generate();
			else				display.year.generate();
		}

		this.scroll = new function(){
			var timer;

			this.top = function(e){
				display.scroll.leave();
				if(!select.s)		return;
				top();
			}
			function top(){
				display.month.up.start();
				timer = setTimeout(top, 230);
			}
			
			this.bot = function(e){
				display.scroll.leave();
				if(!select.s)		return;
				bot();
			}
			function bot(){
				display.month.down.start();
				timer = setTimeout(bot, 230);
			}

			this.leave = function(e){
				clearTimeout(timer);		timer = null;
			}
		}
	}

	var select = new function(){
		this.items = [];
		this.s;

		this.add = function(time){
			var i = 0;
			var has = false;
			for(; i < select.items.length;i++){
				if( select.items[i].valueOf() <= time.valueOf() ){
					if(select.items[i].valueOf() == time.valueOf()){
						has = true;
						break;
					}
				} else {
					break;
				}
			}
			if(!has && _calendar.week[time.getUTCDay()] ){
				select.items.splice(i, 0, time);
				for(var i = 0; i < _calendar.month.length; i++){
					if(_calendar.month[i].s > time || _calendar.month[i].e < time)		continue;
					var r = _calendar.month[i].r;
					for(var j = 0; j < r.length; j++){
						if(r[j].date.valueOf() == time.valueOf() && !tools.hasClass(r[j].html,'cu-day-select')){
							r[j].html.className += ' cu-day-select';
						}
					}					
				}
			}
		}
		this.addAll = function(ar){
			for(var j = 0; j < ar.length; j++){
				select.add(ar[i]);
			}
		}
		this.remove = function(time){
			for(var i = 0; i < select.items.length; i++){
				if(	select.items[i].valueOf() == time.valueOf()){
					select.items.splice(i, 1);
					break;
				}
			}
			for(var i = 0; i < _calendar.month.length; i++){
				if(_calendar.month[i].s <= time && _calendar.month[i].e >= time){
					var r = _calendar.month[i].r;
					for(var j = 0; j < r.length; j++){
						if(r[j].date.valueOf() == time.valueOf()){
							r[j].html.className = r[j].html.className.replace(/ cu-day-select/g, '');
						}
					}
				}
			}
		}
		this.removeAll = function(){
			select.items = [];
			for(var i = 0; i < _calendar.month.length; i++){
				var r = _calendar.month[i].r;
				for(var j = 0; j < r.length; j++){
					r[j].html.className = r[j].html.className.replace(/ cu-day-select/g, '');
				}
			}
		}

		this.is = function(time){
			for(var i = 0; i < select.items.length; i++){
				if( select.items[i] <= time){
					if(select.items[i].valueOf() == time.valueOf())		return true;
				}
			}
			return false;
		}
		this.monthIs = function(d){
			for(var i = 0; i < select.items.length; i++){
				if( select.items[i].getMonth() == d.month && select.items[i].getFullYear() == d.year ){
					return true;
				}
			}
			return false;			
		}

		this.down = function(e){
			var sDate = e.target.date;
			if(!e.ctrlKey)	select.removeAll();
			select.s = { s: sDate, e: sDate };
			select.hover.reAdd(select.s.s.date, select.s.e.date);

			window.addEventListener("mouseup", up);
		}
		this.enter = function(e){
			display.scroll.leave();
			if(!select.s)		return;
			var eDate = e.target.date;
			select.s.e = eDate;
			select.hover.reAdd(select.s.s.date, select.s.e.date);
		}

		this.hover = new function(){
			this.s = 0;
			this.e = 0; 
			
			this.reAdd = function(s, e){
				if(s > e){
					var d = e;
					e = s;
					s = d;
				}

				for(var i = 0; i < _calendar.month.length; i++){
					var row = _calendar.month[i].r;
					for(var j = 0; j < row.length; j++){
						if(row[j].date >= select.hover.s && row[j].date <= select.hover.e ){
							row[j].html.className = row[j].html.className.replace(/ cu-day-hover/g, '');
						}
					}
				}
				select.hover.s = s;
				select.hover.e = e;

				for(var i = 0; i < _calendar.month.length; i++){
					var row = _calendar.month[i].r;
					for(var j = 0; j < row.length; j++){
						if(row[j].date >= select.hover.s && row[j].date <= select.hover.e && _calendar.week[row[j].date.getUTCDay()] ){
							row[j].html.className += ' cu-day-hover'
						}
					}
				}
			}

			this.removeAll = function(){

				for(var i = 0; i < _calendar.month.length; i++){
					var row = _calendar.month[i].r;
					for(var j = 0; j < row.length; j++){
						if(row[j].date >= select.hover.s && row[j].date <= select.hover.e ){
							row[j].html.className = row[j].html.className.replace(/ cu-day-hover/g, '');
						}
					}
				}
				select.hover.s = 0;
				select.hover.e = 0;
			}
		}

		function up(){
			display.scroll.leave();
			select.hover.removeAll();

			var s = new Date(select.s.s.date);
			var e = new Date(select.s.e.date);

			if(s > e){
				var d = e;
				e = s;
				s = d;
			}
			while ( s.valueOf() <= e.valueOf() ){

				if(select.is(s))	select.remove(s);
				else				select.add(s);
			
				s = new Date(s.valueOf() + 86400000);
			}

			select.s = undefined;
			window.removeEventListener("mouseup", up);
		}
	}

	link.create(options);
}