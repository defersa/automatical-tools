function combobox_ui(options){

	var functions;
	var setting;

	var visual;
	var content;

	var link = this;

	link.create = function(options){
		if(!options)			options = {};
	
		visual = tools.createHTML({tag: 'div', className: 'cbb-main'}); 
		var arrow = tools.createHTML({div: 'div', className: 'cbb-arrow', parent: visual});
		var caption = tools.createHTML({div: 'div', className: 'cbb-caption', parent: visual});



		link.change(options);
	}

	link.change = function(options){
		if(options.parent != undefined)		options.parent.appendChild(visual);
	}

	link.remove = function(){

	}


	link.create(options)
}