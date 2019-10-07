'strict mode'

var WIND;

window.onload = function(){

	WIND = new window_ui({
		modal: true
	});

	WIND.container.innerHTML = '<textarea style="width: 100%; height: 100%;">sometext lololol</textarea>';
}
