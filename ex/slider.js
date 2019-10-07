window.onload = function(){
	var slider = new slider_lib({
		parent: document.getElementById('cslider'),
		functions: {
			change: function(value){
				document.getElementById('svalue').value = value;
			}
		}
	});
	var slider = new slider_lib({
		parent: document.getElementById('csliderv'),
		orientation: true
	});
}