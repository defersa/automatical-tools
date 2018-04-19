
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
								functions: { rightClick: function(link, item){ if(item){ item.zindex++; panelPanel.change(); return true; } else { return false; } } }}); 

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

function fmodel(){
	var n = 2;
	var m = 3;
	var la = 3;
	var nu = 2;

	var p = m/n;
	var pn = [];

	var buf = 0;
	for(var i = 0; i <= n; i++){
		buf += Math.pow(p,i)/factorial(i);
	}
	buf += (Math.pow(p,n) * (p/n - Math.pow(p/n, m + 1)))/(factorial(n)*(1 - p/n));
	var p0 = 1/buf;
	for(var i = 1; i <= n; i++){
		pn.push(p0*Math.pow(p ,i)/factorial(i));
	}
	for(var i = 1; i <= m; i++){
		pn.push((p0 * Math.pow(p ,i + n))/(Math.pow(n,i)*factorial(n)));
	}
	var Potk = pn[pn.length - 1];
	var q = 1 - Potk;
	var A = la*q;
	var z = A/nu;

	var x = p/n;

	var r = (Math.pow(p, n + 1)*p0*(1 - (m + 1)*x +m*x))/(n*factorial(n)*(1 - x)*(1 - x));

	var toj = r/la;
	var tsys = toj + q/nu;

	console.log(p0, pn, Potk, q, A, z, r, toj, tsys);
}
function smodel(m){
	var n = 2;
	var la = 3;
	var nu = 2;

	var p = la/(nu*n);
	var nm = n + m;
	var pn = [];

	var p0 = (1 - p)/(1 - Math.pow(p, nm + 1));
	for(var i = 0; i < nm; i++){
		pn[i] = p0*Math.pow(p, i + 1);
	}
	var Potk = pn[pn.length - 1];
	var q = 1 - Potk;
	var A = la*q;
	var z = A/nu;

	var r = (Math.pow(p, 2) * ( 1 - Math.pow(p, m)*( m + 1 - m*p) ))/((1 - Math.pow(p, m + 2))*(1 - p));

	var toj = r/la;
	var tsys = toj + q/nu;

	console.log(p0, pn, Potk, q, A, z, r, toj, tsys);
}
function factorial(item){
	if(item == 0) return 1;
	else return (item * factorial(item - 1))
}