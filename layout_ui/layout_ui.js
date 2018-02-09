function layout_ui(options){
	//main controls and container
	var containers;
	var parent;
	var fragment = document.createDocumentFragment(); //inner parent
	//options and paranters
	var self_options;

	this.create = function(options){
		if(containers != undefined) this.remove;
		if(options.orientation == undefined)	options.orientation = false; //default orientation - vertical
		if(options.size == undefined)			options.size = [];
		if(options.minSize == undefined)		options.minSize = [];

		if(options.containers[0])	parent = options.containers[0].parentNode;//check and set parent
		else						{ console.warn('Please set correct parent and try create window again!'); return; };

		containers = [];			self_options = {};
		self_create.containers(options);//create object for storage links

		this.change(options);
	}
	this.remove = function(){//clear containers and destroy separators
		for(var i = 0; i < containers.length; i++){
			if(containers[i].rSeparator){
				tools.destroyHTML(containers[i].rSeparator);
				containers[i].rSeparator = undefined;
			}
			containers[i].html.cssText = '';								containers[i].html.layout = undefined;
			containers[i].html.index = undefined;							containers[i].lSeparator = undefined;
		}
	}
	this.change = function(options){ 
		if(options.orientation != undefined)								self_change.set_orientation(options);
		if(options.size != undefined )										self_change.set_size(options);
		if(options.minSize != undefined)									self_change.set_minSize(options);

		self_change.apply_positions();
	}

	this.show = function(html){ //show hidden container
		html.layout.visible = true;
		self_change.apply_positions();
	}
	this.hide = function(html){//hide visible container
		html.layout.visible = false;
		self_change.apply_positions();
	}

	var self_change = {
		apply_positions: function(){

			var position = 0;		self_options.pieces = 0;			var value;
			for(var i = 0; i < containers.length; i++){ //count of size
				if(containers[i].visible) self_options.pieces += containers[i].size; }

			for(var i = 0; i < containers.length; i++){
				if(containers[i].visible){
					if(containers[i].html.parentNode != parent){//show hidden object with change status
																	parent.appendChild(containers[i].html);
						if(containers[i].lSeparator)				parent.appendChild(containers[i].lSeparator);
						else if(containers[i].rSeparator)			parent.appendChild(containers[i].rSeparator);
					}

					if(position == 0)								value = 0;
					else											value = 'Calc(' + tools.roundPlus(position*100/self_options.pieces, 1) + '% + 3px)';

					if(self_options.orientation)					containers[i].html.style.left = value;
					else											containers[i].html.style.top = value;

					if(containers[i].lSeparator != undefined){
																	value = 'Calc(' + tools.roundPlus(position*100/self_options.pieces, 1) + '% - 3px)';
							if(self_options.orientation)			containers[i].lSeparator.style.left = value;
							else									containers[i].lSeparator.style.top = value;
					}

																	position += containers[i].size;

					if(position == self_options.pieces)				value = 0;
					else 											value = 'Calc(' + tools.roundPlus(100 - position*100/self_options.pieces, 1) + '% + 3px)';

					if(self_options.orientation)					containers[i].html.style.right = value;
					else											containers[i].html.style.bottom = value;
				} else {
					if(containers[i].html.parentNode == parent){//hide object with change status
																	fragment.appendChild(containers[i].html);
						if(containers[i].lSeparator)				fragment.appendChild(containers[i].lSeparator);
						else if(containers[i].rSeparator)			fragment.appendChild(containers[i].rSeparator);
					}
				}
			}
			var event = new CustomEvent("resize", {bubbles: true, cancelable: true});		
			window.dispatchEvent(event);
		},
		set_size: function(options){

			var size = (!self_options.orientation) ? parent.clientHeight : parent.clientWidth;
			var spendSize = 100;
			var itemsDefault = [];

			for(var i = 0; i < containers.length; i++){
				if(options.size[i] == undefined)					itemsDefault.push(containers[i]);
				else {
					if(typeof options.size[i] == 'number')			containers[i].size = options.size[i]; 
					else if(options.size[i].indexOf('%') != -1)		containers[i].size = parseFloat(options.size[i].substring(0, options.size[i].indexOf('%')));
					else if(options.size[i].indexOf('px') != -1)	containers[i].size = tools.roundPlus( parseFloat(options.size[i].substring(0, options.size[i].indexOf('px')))*100/size, 2 );
					spendSize += - containers[i].size;
				}
			}

			if(itemsDefault.length != 0){
				spendSize = tools.roundPlus(spendSize/itemsDefault.length, 2);
				if(spendSize < 5) spendSize = 5;
				for(var i = 0; i < itemsDefault.length; i++)		itemsDefault[i].size = spendSize;
			}

		},
		set_minSize: function(options){
			for(var i = 0; i < containers.length; i++){
				if(options.minSize[i] == undefined)					containers[i].minSize = {value: 5, units: true};
				else if(typeof options.minSize[i] == 'number')		containers[i].minSize = {value: options.minSize[i], units: true};
				else if(options.minSize[i].indexOf('%') != -1)		containers[i].minSize = {value: parseFloat(options.minSize[i].substring(0, options.minSize[i].indexOf('%'))), units:true};
				else if(options.minSize[i].indexOf('px') != -1)		containers[i].minSize = {value: parseFloat(options.minSize[i].substring(0, options.minSize[i].indexOf('px'))), units:false};

			}
		},
		set_orientation: function(options){
			if(self_options.orientation !== options.orientation){
																	self_options.orientation = options.orientation;
				for(var i = 0; i < containers.length; i++){
					if(self_options.orientation)					containers[i].html.style.cssText = 'position: absolute; height: 100%; width: auto; top: 0';
					else 											containers[i].html.style.cssText = 'position: absolute; width: 100%; height: auto; left: 0';

					if( i < options.containers.length - 1){
						if(self_options.orientation)				containers[i].rSeparator.style.cssText = 'height: 100%; top: 0; width: 6px; cursor: e-resize;';
						else										containers[i].rSeparator.style.cssText = 'width: 100%; left: 0; height: 6px; cursor: s-resize;';
					}
				}
			}
		}
	}
	var self_create = {
		containers: function(options){
			for(var i = 0; i < options.containers.length; i++){
				containers[i] = { html: options.containers[i], index: i, visible: true};
				containers[i].html.layout = containers[i];
				
				if( i != 0)	containers[i].lSeparator = containers[i - 1].rSeparator;
				if( i < options.containers.length - 1){
					containers[i].rSeparator = tools.createHTML({tag:'div', parent: parent, className: 'layout-separator', onmousedown: resize.mdown});
					containers[i].rSeparator.index = i;
				}
			}
		}
	}
	var resize = new function(){
		var self;
		this.mdown = function(event){
			var separator = tools.closest(event.target, 'layout-separator');
			self = {separator: separator, event: event};
			if(self_options.orientation)	self.size = parent.clientWidth;
			else							self.size = parent.clientHeight;

		 	for(var i = separator.index + 1; i < containers.length; i++){
		 		if(containers[i].visible){
		 			self.right_containers = containers[i];
		 			break;
		 		}
	 		}
	 		for(var i = separator.index; i >= 0; i--){
		 		if(containers[i].visible){
		 			self.left_containers = containers[i];
		 			break;
		 		}
	 		}
	 		self.left = 0;
	 		for(var i = 0; i < self.left_containers.index; i++){
	 			if(containers[i].visible) self.left = containers[i].size;
	 		}
	 		self.min_left 	= (self.left_containers.minSize.units) ? (self.left_containers.minSize.value) : (tools.roundPlus((self.left_containers.minSize.value*100)/self.size, 1));
	 		self.min_right 	= (self.right_containers.minSize.units) ? (self.right_containers.minSize.value) : (tools.roundPlus((self.right_containers.minSize.value*100)/self.size, 1));

	 		self.position	= tools.roundPlus((self.left + self.left_containers.size)*100/self_options.pieces - 3*100/self.size, 1);
	 		self.right		= tools.roundPlus((self.left + self.left_containers.size + self.right_containers.size)*100/self_options.pieces, 1) - self.min_right;
	 		self.left		= tools.roundPlus((self.left * 100 / self_options.pieces), 1) + self.min_left;

			window.addEventListener("mousemove", mmove);
			window.addEventListener("mouseup", mup);
		}

		function mmove(event){
			if(!self.line){
				if(Math.abs(self.event.pageX - event.pageX) > 3 || Math.abs(self.event.pageY - event.pageY) > 3 ){
					if(self_options.orientation){		self.line					= tools.createHTML({tag: 'div', parent: parent, className: 'layout-splitter', style: ('cursor: e-resize; height: 100%; top: 0; width: 6px; left: 0;')});
														tools.startBackdrop({cursor: 'e-resize'});
					} else {							self.line					= tools.createHTML({tag: 'div', parent: parent, className: 'layout-splitter', style: ('cursor: s-resize; width: 100%; left: 0; height: 6px; top: 0;')});
														tools.startBackdrop({cursor: 's-resize'});
					}	
				}
			}
			if(self.line){
				if(self_options.orientation)			self.new_position			= self.position - tools.roundPlus((self.event.pageX - event.pageX)*100/self.size, 1);
				else									self.new_position			= self.position - tools.roundPlus((self.event.pageY - event.pageY)*100/self.size, 1);
				if(self.new_position < self.left)		self.new_position			= self.left;
				else if(self.new_position > self.right)	self.new_position			= self.right;
				if(self_options.orientation)			self.line.style.transform	= 'translate(' + Math.round((self.new_position*self.size)/100) + 'px, 0)';
				else									self.line.style.transform	= 'translate(0, ' + Math.round((self.new_position*self.size)/100) + 'px)';
			}
		}
		function mup(event){
			if(self.line){
				tools.endBackdrop();

				for(var i = 0; i < containers.length; i++)
					containers[i].size = Math.round(containers[i].size*1000/self_options.pieces);

				self.left_containers.size = Math.round((self.new_position - self.left + self.min_left)*10);
				self.right_containers.size = Math.round((self.right + self.min_right - self.new_position)*10); 

				tools.destroyHTML(self.line);
				self_change.apply_positions();
			}
			window.removeEventListener("mousemove", mmove);
			window.removeEventListener("mouseup", mup);
			self = undefined;
		}
	}
	if(options)	this.create(options);
}
