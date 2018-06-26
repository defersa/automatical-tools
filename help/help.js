(function(){
})();

var input;
var pages = [];
var header;
var loop;

function jump(e, dest){		link.go(e.target, dest);	}

window.onload = function(){
	input = document.getElementById('h-panel-controls-search');
	loop = document.getElementById('h-panel-controls-loop');
	input.oninput = search.oninput;	
	input.onkeydown = search.down;
	loop.onclick = search.next;

	pages = document.getElementsByClassName('h-page');
	header = document.getElementsByClassName('h-menu-content');

	scroll.slider = document.getElementById('h-panel-slider');
	scroll.fill = document.getElementById('h-panel-list-back');
	scroll.back = document.getElementById('h-panel-scrollbar');


	if(window.clipboardData)				scroll.fill.onmousewheel = scroll.scroll;
	else									scroll.fill.onwheel = scroll.scroll;

	scroll.fill.onscroll = scroll.rework;
	scroll.slider.onmousedown = scroll.down;
	scroll.rework();
	window.addEventListener('resize', scroll.rework);


	mark.header = [];
	var h = document.getElementsByClassName("h-lvl-1")[0];
	for(var i = 0; i < h.children.length; i++){
		if(h.children[i].tagName == 'LI') mark.header.push(h.children[i]);
	}

	mark.back = document.getElementById("h-content");
	mark.back.onscroll = mark.scroll;
	window.addEventListener('resize', mark.scroll);
	mark.scroll();
}

var search = new function(){
	var foundItems = [];
	var carriage;

	this.oninput = function(e){
		
		var searchText = input.value.toLowerCase();

		for(var i = foundItems.length - 1; i >= 0; i--){
			foundItems[i].outerHTML = foundItems[i].innerHTML;
		}
		foundItems = [];


		if(searchText){
			var expr = new RegExp(searchText, 'g');
			var repl = '<span class="h-s">' + searchText + '</span>';

			for(var i = 0; i < pages.length; i++){
				var oldInner = pages[i].innerHTML;
				var newInner = '';

				var sp = 0;
				var tag = false;
				for(var j = 0; j < oldInner.length; j++){
					var kChar = oldInner[j].toLowerCase();

					if(kChar == '<'){
						tag = true;
						continue; 
					} else if(kChar == '>'){
						tag = false;
						continue;
					} else if(tag){ 
						continue;
					}

					var same = true;
					for(var k = 0; k < searchText.length; k++){
						if(same){
							if(kChar == searchText[k]) kChar = oldInner[j + k + 1].toLowerCase()
							else same = false;
						}
					}

					if(same){
						newInner += oldInner.substring(sp, j);
						newInner += '<span class="h-s">' + oldInner.substring(j, j + searchText.length) + '</span>';
						sp = j + searchText.length;
					}
				}
				newInner += oldInner.substring(sp, oldInner.length);
				pages[i].innerHTML = newInner;

			}
		}
		
		foundItems = document.getElementsByClassName('h-s');
		if(foundItems.length != 0){
			carriage = 0;
			foundItems[0].id = 'h-s-c';
			window.location = '#h-s-c';
			input.focus();
		}
	}

	this.next = function(){
		if(foundItems.length != 0){
			foundItems[carriage].id = '';
			if(foundItems.length - 1 == carriage)	carriage = 0;
			else									carriage++;
			foundItems[carriage].id = 'h-s-c';
			window.location = '#h-s-c';
		}
	}

	this.down = function(e){
		if(e.keyCode == 13)	search.next();
		input.focus();
	}
}

var link = new function(){
	var curent;
	this.go = function(target, destination){
		if(curent != undefined){
			curent.id = undefined;
		}
		curent = target;
		target.id = 'h-active-link';
		$('#h-content').animate({scrollTop: document.getElementById(destination).offsetTop - 15 }, 500);
	}
}

var scroll = new function(){
	this.slider;
	this.fill;
	this.back;

	var top;
	var height;
	var bheight;
	var s;

	this.rework = function(){
		top = (scroll.fill.scrollTop / scroll.fill.scrollHeight) * scroll.back.offsetHeight;
		height = Math.floor(scroll.back.offsetHeight * scroll.back.offsetHeight / scroll.fill.scrollHeight);
		bheight = scroll.back.offsetHeight - height;
		scroll.slider.style.height = height + 'px';
		scroll.slider.style.top = top + 'px';
	}

	this.down = function(e){
		s = {e: e, t: top, d: (scroll.fill.scrollHeight / scroll.back.offsetHeight) };
		window.addEventListener('mousemove', move);
		window.addEventListener('mouseup', up);
	}

	this.scroll = function(e){
		var delta = (e.deltaY || -e.wheelDelta)/2;

		if(delta > 0){			for(var i = 0; i < 8; i++)	setTimeout( function(){ scroll.fill.scrollTop +=  12; }, 16*i );
		} else {				for(var i = 0; i < 8; i++)	setTimeout( function(){ scroll.fill.scrollTop += -12; }, 16*i );
		}
	}

	function move(e){
		var dy = s.t + (e.y - s.e.y);
		if(dy < 0)					dy = 0;
		else if(dy > bheight)		dy = bheight;
		top =  dy;
		scroll.slider.style.top = top + 'px';
		scroll.fill.scrollTop = top*s.d;
	}
	function up(e){
		s = undefined;
		window.removeEventListener('mousemove', move);
		window.removeEventListener('mouseup', up);
	}
}

var mark = new function(){
	this.back;
	this.header;
	var current;

	this.scroll = function(){
		var top = mark.back.scrollTop;
		for(var i = 0; i < pages.length; i++){
			if(top < pages[i].offsetTop - 25){
				break;
			}
		}
		i--;
		if(current != mark.header[i]){
			if(current)	current.className = '';
			current = mark.header[i];
			current.className = 'h-link-line';
		}
	}
}