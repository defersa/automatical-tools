
'strict mode'

var cal2;

window.onload = new_function;

function new_function() {
	var cal = new calendar_ui({parent: document.getElementById('example') });
	var win = new window_ui({ width: '300px', height: '350px', footer: false});
	cal2 = new calendar_ui({parent: win.container });
	cal2.setSelect([ new Date(2018, 7, 7), new Date(2018, 7, 8), new Date(2018, 7, 9) ]);
}