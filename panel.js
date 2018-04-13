
'strict mode'

window.onload = new_function;

var pLayouts = [];
var pTrees = [];

var panelPanel;

var dataSet = JSON.parse('[{"text":"Wave","text2":"","type":"4","exp":"WAVE","children":[{"text":"Mayu002717","text2":"","type":"5","exp":"1","nopercent":1},{"text":"Julu002717","text2":"","type":"5","exp":"2","nopercent":1}]}]');


function new_function(){

	pLayouts.push( new layout_ui({ orientation: true, containers: document.getElementsByClassName('first'), size: [1, 5] }));
	pLayouts.push( new layout_ui({ containers: document.getElementsByClassName('second'), size: [ 2, 1]}));

	pTrees.push( new tree_ui({ items: dataSet, parent: document.getElementsByClassName('second')[0], defaultExpand: true}));
	pTrees.push( new tree_ui({ items: dataSet, parent: document.getElementsByClassName('second')[1] }));

	panelPanel = new dash_ui({	parent: document.getElementsByClassName('first')[1],
								functions: { rightClick: function(link, item){ if(item){ link.removeItems([item]); return true; } else { return false; } } }}); 
	some();
}


//
// functions for scale main panel
//
var panelScale = 1;

function addPanel(){
	var f = (Math.round(Math.random()*155 + 100)).toString(16);
	var s = (Math.round(Math.random()*155 + 100)).toString(16);
	var t = (Math.round(Math.random()*155 + 100)).toString(16);
	var w = (100 + Math.random()*400);
	var h = (50 + Math.random()*200);
	var html = tools.createHTML({tag: 'div', style: 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; background: #' + f + s + t +';'})
	var content = {content: html, left: 0, top: 0, width: w, height: h };
	panelPanel.addItems([content]);
}

function plus(){
	panelScale = tools.round(panelScale + 0.05 ,2 );
	document.getElementById('scale').innerHTML = panelScale;
	panelPanel.change({scale: panelScale });
}
function minus(){
	panelScale = tools.round(panelScale - 0.05 ,2 );
	document.getElementById('scale').innerHTML = panelScale;
	panelPanel.change({scale: panelScale });
}

function some(){
	var p = 3/4;
	var m = 5;
	var l = 3;

	r = (Math.pow(p, 2) * ( 1 - Math.pow(p, m)*( m + 1 - m*p) ))/((1 - Math.pow(p, m + 2))*(1 - p));
	console.log(r);
}