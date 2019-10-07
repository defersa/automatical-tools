
'strict mode'

var cal2, cal1;

window.onload = new_function;

function new_function() {

	cal1 = new calendar_ui({parent: document.getElementById('example') });
	var w = new window_ui({ width: '300px', height: '90%' });
	cal2 = new calendar_ui_old({parent: w.container });

	cal1.change({
		year: 2018,
		month: 3
	})
	cal2.change({
		year: 2018,
		month: 5
	})

}