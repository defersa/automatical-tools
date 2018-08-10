
'strict mode'

var cal2, cal;

window.onload = new_function;

function new_function() {
	cal = new calendar_ui({parent: document.getElementById('example') });
	var win = new window_ui({ width: '300px', height: '370px', footer: false});
	cal2 = new calendar_ui({parent: win.container });
	cal2.setSelect([ new Date(2018, 7, 7), new Date(2018, 7, 8), new Date(2018, 7, 9) ]);
	cal2.change({week: [true,true,false,true,true,true,true]})
}