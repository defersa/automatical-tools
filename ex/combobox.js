var cb;

window.onload = function(){
	var p = document.getElementById('block');
	cb = new combobox_ui({
		parent: p,
		tree: [
		{text: 'headline', unselect: true },
		{text: 'item'},
		{text: 'second item'},
		{ separator: true},
		{text: 'third item'},
		{text: 'item'},
		{text: 'second item'},
		{ separator: true},
		{text: 'third item'},
		{text: 'item'},
		{text: 'second item'},
		{ separator: true},
		{text: 'third item'}
		]
	});

	var mitems = [
		{ text: 'lol1', func: function(item) {console.log(item.check); item.check = !item.check; item.change(); return true; } },
		{ text: 'lol2'},
		{ separator: true },
		{ text: 'lol3', children:[
			{ text: 'new lvl'},
			{ text: 'i believe in it'},
			{ text: 'its a trap!!!', children: [
				{ text: 'palap'},
				{ text: 'stop'}
			]}
		]},
		{ text: 'lol4', children:[
			{ text: 'new lvl'},
			{ text: 'i believe in it'},
			{ text: 'its a trap!!!', children: [
				{ text: 'palap'},
				{ text: 'stop'}
			]}
		]}
	]

	document.body.oncontextmenu = function(e){
		menu.change({ show: true, x: e.pageX, y: e.pageY });
		return false
	}

	var menu = new menu_ui({
		x: 100,
		y: 100,
		tree: mitems
	})
}