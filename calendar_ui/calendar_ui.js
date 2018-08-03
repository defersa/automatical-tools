function calendar_ui(options){

	var _calendar;
	var setting;

	var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];
	var vDay = 86400000;


	var leftButton = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="8px" height="12px" viewBox="0 0 8 12" xml:space="preserve"><path class="cu-arrow" d="M 0,6 L 6,0 L 8,2 L 4,6 L 8,10 L 6,12 z" /></svg>';
	var rightButton = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="8px" height="12px" viewBox="0 0 8 12" xml:space="preserve"><path class="cu-arrow" d="M 8,6 L 2,0 L 0,2 L 4,6 L 0,10 L 2,12 z" /></svg>';

	var topButton ='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="8px" viewBox="0 0 12 8" xml:space="preserve"><path class="cu-arrow" d="M 6,0 L 0,6 L 2,8 L 6,4 L 10,8 L 12,6 z" /></svg>';
	var bottomButton = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="8px" viewBox="0 0 12 8" xml:space="preserve"><path class="cu-arrow" d="M 6,8 L 0,2 L 2,0 L 6,4 L 10,0 L 12,2 z" /></svg>';

	var link = this;

	link.create = function(options){
		if(!options)							options = {};
		if(_calendar)							link.remove();
		var cd = new Date();

		if(options.panels == undefined)			options.panels = 1;
		if(options.month == undefined)			options.month = cd.getMonth();
		if(options.year == undefined)			options.year = cd.getFullYear();
		if(options.startDay == undefined)		options.startDay = 1;

		if(options.parent == undefined)			options.parent = document.body;


		window.addEventListener('resize', display.month);
		setting = { startDay: options.startDay };
		create.panel();

		link.change(options);

	}
	link.change = function(options){
		if(options.parent !== undefined)			changing.parent(options);
		if(options.startDay !== undefined)			setting.startDay = options.startDay;
		if(options.month !== undefined)				setting.sMonth = options.month;
		if(options.year !== undefined)				setting.sYear = options.year;

		display.month();
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
			right: function(e){
				display.nextMonth();
			},
			left: function(e){
				display.prevMonth();
			},
			top: function(e){
				display.monthUp.start();
			},
			bottom: function(e){
				display.monthDown.start();
			}
		},
		down: {
			date: function(e){
				if(e.which != 1)	return;
				select.down(e);
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

				if(delta < 0)	display.monthUp.start();
				else			display.monthDown.start();

				tools.stopProp(e);		return false;
			}
		}
	}

	var create = {
		panel: function(options){
			_calendar = {};

			_calendar.html = tools.createHTML({tag: 'div', className: 'cu-panel'})

			_calendar.header = tools.createHTML({tag: 'div', parent: _calendar.html, className: 'cu-panel-header' });
			_calendar.content = tools.createHTML({tag: 'div', parent: _calendar.html, className: 'cu-panel-content', onwheel: events.wheel.content });
			_calendar.title = tools.createHTML({	tag: 'div',
													parent: _calendar.header,
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
			_calendar.table = [];
			for(var i = 0; i < 7; i++){
				_calendar.weekDays.days[i] =  tools.createHTML({tag: 'div', parent: _calendar.weekDays, style: ('left: ' + (1 + i * 14) + '%;' ), className: 'cu-day-name', innerHTML: dayNames[(i + setting.startDay)%7] });
			}
		}
	}

	var changing = {
		parent: function(options){
			setting.parent = options.parent;
			options.parent.appendChild(_calendar.html);
		},
		date: function(des){
			setting.month += des;
			while(setting.month < 0 || setting.month > 11){
				if(setting.month < 0){
					setting.month += 12;
					setting.year += -1;
				}
				if(setting.month > 11){
					setting.month += -12;
					setting.year += 1;
				}
			}	
		},
		title: function(){
			if(_calendar.table.length < 1)	return false;
			setting.month = _calendar.table[1].r[3].date.getMonth();
			setting.year = _calendar.table[1].r[3].date.getFullYear();
			_calendar.title.innerHTML = monthNames[setting.month] + ' ' + setting.year;
		}
	}
	var display = new function(){

		this.month = function(){
			var d;

			if(_calendar.table.length <= 0){
				d = new Date(setting.sYear, setting.sMonth, 1 );
				if(d.getDay() < setting.startDay)		d.setDate(d.getDate() - d.getDay() + setting.startDay - 7);
				else									d.setDate(d.getDate() - d.getDay() + setting.startDay);
			} else {
				d = new Date( _calendar.table[0].s );
			}
			var rows = display.getRowCount();

			for(var i = _calendar.table.length; i < rows; i++){
				var sd = new Date(d.valueOf() + vDay*7*i);
				var ed = new Date(d.valueOf() + vDay*(7*i+6));
				var row = [];
				var container = tools.createHTML({ tag: 'div', parent: _calendar.content, className: 'cu-week', style: 'top: ' + (30*i) + 'px;' })
				_calendar.table.push({r: row, c: container, s: sd, e: ed });
				display.week(row, container, sd);
			}
			if(_calendar.table.length > rows){
				while(_calendar.table.length != rows){
					tools.destroyHTML( _calendar.table.last().c );
					_calendar.table.splice( _calendar.table.length - 1, 1);
				}
			}
			changing.title();
		}

		this.getRowCount = function(){
			var height = _calendar.content.offsetHeight;
   			return Math.floor(height / 30);
		}

		this.week = function(row, html, d) {
			for(var i = 0; i < 7; i++){
				row[i] = {}
				var nd = new Date(d);
				nd.setDate(nd.getDate() + i);
				var cn = ( ((nd.getMonth() + setting.sMonth)%2) ? 'cu-day' : 'cu-day-month' );
				cn += ((nd.getUTCDay() == 5 || nd.getUTCDay() == 6) ? ' cu-day-hol' : '');
				row[i].html = tools.createHTML({	tag: 'div',
											className: cn,
											parent: html,
											onmousedown: events.down.date,
											onmouseenter: events.enter.date,
											innerHTML: nd.getDate(),
											style: 'left:' + (1 + i*14) + '%;'});
				row[i].html.date = row[i];
				row[i].date = nd;
				if(select.is(nd))									row[i].html.className += ' cu-day-select';
				if(select.hover.s <= nd && select.hover.e >= nd)	row[i].html.className += ' cu-day-hover';	
			}
		}

		this.nextMonth = function(){
			var count = 0;
			var d = new Date(_calendar.table[1].r[0].date);
			while(d.getMonth() == _calendar.table[1].r[0].date.getMonth()){
				d.setDate(d.getDate() + 7);
				count++;
			}
			display.monthDown.roll(count);
		}
		this.prevMonth = function(){
			var count = 0;
			var d = new Date(_calendar.table[0].r[0].date);
			while(d.getMonth() == _calendar.table[0].r[0].date.getMonth()){
				d.setDate(d.getDate() - 7);
				count++;
			}
			display.monthUp.roll(count);			
		}

		this.scroll = new function(){
			var timer;

			this.top = function(e){
				display.scroll.leave();
				if(!select.s)		return;
				top();
			}
			function top(){
				display.monthUp.start();
				timer = setTimeout(top, 230);
			}
			
			this.bot = function(e){
				display.scroll.leave();
				if(!select.s)		return;
				bot();
			}
			function bot(){
				display.monthDown.start();
				timer = setTimeout(bot, 230);
			}

			this.leave = function(e){
				clearTimeout(timer);		timer = null;
			}
		}


		this.monthUp = new function(){
			var lCount;
			this.roll = function(count){
				if(count >= 0)	lCount = count;
				if(lCount > 0)	display.monthUp.start();
			},
			this.start = function(){
				_calendar.content.style.height = (_calendar.table.length*30) + 'px';
				var sd = new Date(_calendar.table[0].s.valueOf() - vDay*7);
				var ed = new Date(sd.valueOf() + vDay*6);
				var row = [];
				var container = tools.createHTML({ tag: 'div', parent: _calendar.content, className: 'cu-week', style: 'top: -30px;' })
				_calendar.table.splice(0, 0, {r: row, c: container, s: sd, e: ed });
				display.week(row, container, sd);
				step(15);
			}
			function step(dif){
				for(var i = 0; i < _calendar.table.length; i++)		_calendar.table[i].c.style.top = (30*i - 2*dif) + 'px';
				if(dif > 0)											setTimeout( step, 6, dif - 3);
				else												end();
			}
			function end(){
				tools.destroyHTML(_calendar.table.last().c);
				_calendar.table.splice(_calendar.table.length - 1, 1);
				_calendar.content.style.height = '';
				changing.title();
				display.monthUp.roll(lCount - 1);
			}
		}

		this.monthDown = new function(){
			var lCount;
			this.roll = function(count){
				if(count >= 0)	lCount = count;
				if(lCount > 0)	display.monthDown.start();
			}
			this.start = function(){
				_calendar.content.style.height = (_calendar.table.length*30) + 'px';
				var sd = new Date(_calendar.table.last().s.valueOf() + vDay*7);
				var ed = new Date(sd.valueOf() + vDay*6);
				var row = [];
				var container = tools.createHTML({ tag: 'div', parent: _calendar.content, className: 'cu-week', style: 'top: ' + _calendar.table.length*30 + 'px;' })
				_calendar.table.push({r: row, c: container, s: sd, e: ed });
				display.week(row, container, sd);
				step(0);
			}
			function step(dif){
				for(var i = 0; i < _calendar.table.length; i++)		_calendar.table[i].c.style.top = (30*(i) - 2*dif) + 'px';
				if(dif != 15)										setTimeout( step, 6, dif + 3);
				else												end();
			}
			function end(){
				tools.destroyHTML(_calendar.table[0].c);
				_calendar.table.splice(0, 1);
				_calendar.content.style.height = '';
				changing.title();
				display.monthDown.roll(lCount - 1);
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
			if(!has){
				select.items.splice(i, 0, time);
				for(var i = 0; i < _calendar.table.length; i++){
					if(_calendar.table[i].s > time || _calendar.table[i].e < time)		continue;
					var r = _calendar.table[i].r;
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
			for(var i = 0; i < _calendar.table.length; i++){
				if(_calendar.table[i].s <= time && _calendar.table[i].e >= time){
					var r = _calendar.table[i].r;
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
			for(var i = 0; i < _calendar.table.length; i++){
				var r = _calendar.table[i].r;
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

				for(var i = 0; i < _calendar.table.length; i++){
					var row = _calendar.table[i].r;
					for(var j = 0; j < row.length; j++){
						if(row[j].date >= select.hover.s && row[j].date <= select.hover.e ){
							row[j].html.className = row[j].html.className.replace(/ cu-day-hover/g, '');
						}
					}
				}
				select.hover.s = s;
				select.hover.e = e;

				for(var i = 0; i < _calendar.table.length; i++){
					var row = _calendar.table[i].r;
					for(var j = 0; j < row.length; j++){
						if(row[j].date >= select.hover.s && row[j].date <= select.hover.e ){
							row[j].html.className += ' cu-day-hover'
						}
					}
				}
			}

			this.removeAll = function(){

				for(var i = 0; i < _calendar.table.length; i++){
					var row = _calendar.table[i].r;
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

		function move(e){

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