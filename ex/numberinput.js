
//'strict mode'

var NI;


window.onload = function new_function(){

	// parent for objects
	var ntml_ni = document.getElementById('NI');
	var ntml_ni2 = document.getElementById('NI2');
	var ntml_ni3 = document.getElementById('NI3');
	var html_content = document.getElementById('content');

	

	NI = new numberinput_ui({
		parent: ntml_ni,
		min: -10,
		max: 150,
		step: 1,
		ratio: true,
		style: 0
	});



	NI2 = new numberinput_ui({
		parent: ntml_ni2,
		min: -10,
		max: 150,
		step: 1,
		ratio: false,
		style: 1
	});

	NI3 = new numberinput_ui({
		parent: ntml_ni3,
		min: -10,
		max: 150,
		step: 1,
		ratio: false,
		style: 2
	});


	var t1 = document.getElementById('t1');

	t1.onclick = function(){
		var t2 = document.getElementById('t2');

		t2.focus();
		t2.onpaste = function(e){
			console.log(e);
		}

		var event = new CustomEvent("paste", {bubbles: true, cancelable: true});		
		t2.dispatchEvent(event);
	}
}
