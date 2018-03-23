
'strict mode'

window.onload = new_function;
var dg  = {};
var tree_top = {};
var side_h;
var otab;
var thirdTree;

var tau;
var dataSet = { top: [], side: [], cells: []};
var displayed = [true, true, true, true];
var setting = { orientation: true, hideRow: false, hideCol: false };


function new_function(){


	var fdso = document.getElementById('fds');
	var sdso = document.getElementById('sds');
	
	fdso.onclick = fds;
	sdso.onclick = sds;


	//функции создания spliter'ов. Возвращаемое значение - массив получившихся контейнеров. Входные параметры: Родительский контейнер, количество создаваемых контейнеров, массив размеров контейнеров (в процентах/в единицах соотношения) ось направления деления контейнера
	var first_spliter = new layout_ui({orientation: true, containers: document.getElementsByClassName("first"), size: [1,3]});
	var secont_spliter = new layout_ui({orientation: false, containers: document.getElementsByClassName("second")});

	side_h ='[{"type":"3","exp":"-*","text":"*"},{"text":"Gender","type":"4","exp":"SEX","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Male","type":"5","exp":"1","percent":1,"text":"Male"},{"label":"Female","type":"5","exp":"2","percent":1,"text":"Female"}],"text":"Gender"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Age","type":"4","exp":"AGE","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"18-24","type":"5","exp":"1","percent":1,"text":"18-24"},{"label":"25-39","type":"5","exp":"2","percent":1,"text":"25-39"},{"label":"40-55","type":"5","exp":"3","percent":1,"text":"40-55"}],"text":"Age"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"strataQ","type":"4","exp":"STRATAQ","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"1M+","type":"5","exp":"1","percent":1,"text":"1M+"},{"label":"500K-1M","type":"5","exp":"2","percent":1,"text":"500K-1M"},{"label":"100K-500K","type":"5","exp":"3","percent":1,"text":"100K-500K"}],"text":"strataQ"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Federal district","type":"4","exp":"S1","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Moscow","type":"5","exp":"101","percent":1,"text":"Moscow"},{"label":"Saint-Petersburg","type":"5","exp":"102","percent":1,"text":"Saint-Petersburg"},{"label":"Central/Northwest","type":"3","exp":"s1(1/2)","percent":1,"text":"Central/Northwest"},{"label":"Volga","type":"5","exp":"5","percent":1,"text":"Volga"},{"label":"South/Caucasus","type":"5","exp":"3","percent":1,"text":"South/Caucasus"},{"label":"Urals","type":"5","exp":"6","percent":1,"text":"Urals"},{"label":"Siberia/Far East","type":"3","exp":"s1(7/8)","percent":1,"text":"Siberia/Far East"}],"text":"Federal district"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Education","type":"4","exp":"D1","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"1","type":"5","exp":"1","percent":1,"text":"1"},{"label":"2","type":"5","exp":"2","percent":1,"text":"2"},{"label":"3","type":"5","exp":"3","percent":1,"text":"3"},{"label":"4","type":"5","exp":"4","percent":1,"text":"4"},{"label":"5","type":"5","exp":"5","percent":1,"text":"5"},{"label":"9","type":"5","exp":"9","percent":1,"text":"9"}],"text":"Education"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Marital status","type":"4","exp":"D2","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Married","type":"5","exp":"1","percent":1,"text":"Married"},{"label":"Live together","type":"5","exp":"2","percent":1,"text":"Live together"},{"label":"Not married","type":"5","exp":"3","percent":1,"text":"Not married"},{"label":"Divorced","type":"5","exp":"4","percent":1,"text":"Divorced"},{"label":"Widowed","type":"5","exp":"5","percent":1,"text":"Widowed"},{"label":"DK/NA","type":"5","exp":"9","percent":1,"text":"DK/NA"}],"text":"Marital status"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Family members","type":"4","exp":"D3","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"1","type":"5","exp":"1","percent":1,"text":"1"},{"label":"2","type":"5","exp":"2","percent":1,"text":"2"},{"label":"3","type":"5","exp":"3","percent":1,"text":"3"},{"label":"4","type":"5","exp":"4","percent":1,"text":"4"},{"label":"5+","type":"5","exp":"5","percent":1,"text":"5+"}],"text":"Family members"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Precense of children <15y.o.","type":"4","exp":"D4","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"0","type":"5","exp":"0","percent":1,"text":"0"},{"label":"1","type":"5","exp":"1","percent":1,"text":"1"},{"label":"2","type":"5","exp":"2","percent":1,"text":"2"},{"label":"3+","type":"5","exp":"3","percent":1,"text":"3+"}],"text":"Precense of children <15y.o."},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Precense of children <15y.o.(1-to-3+)","type":"2","exp":"d4(1/3)","children":[{"label":"Precense of children <3y.o.","type":"4","exp":"D5_1","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Under 3 y.o.","type":"5","exp":"1","percent":1,"text":"Under 3 y.o."}],"text":"Precense of children <3y.o."},{"label":"Precense of children 4-6y.o.","type":"4","exp":"D5_2","children":[{"label":"4-6 y.o.","type":"5","exp":"2","percent":1,"text":"4-6 y.o."}],"text":"Precense of children 4-6y.o."},{"label":"Precense of children 7-10y.o.","type":"4","exp":"D5_3","children":[{"label":"7-10 y.o.","type":"5","exp":"3","percent":1,"text":"7-10 y.o."}],"text":"Precense of children 7-10y.o."},{"label":"Precense of children 11-15y.o.","type":"4","exp":"D5_4","children":[{"label":"11-15 y.o.","type":"5","exp":"4","percent":1,"text":"11-15 y.o."}],"text":"Precense of children 11-15y.o."},{"label":"Precense of children -DK/NA","type":"4","exp":"D5_9","children":[{"label":"No answer","type":"5","exp":"9","percent":1,"text":"No answer"}],"text":"Precense of children -DK/NA"}],"text":"Precense of children <15y.o.(1-to-3+)"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Working status","type":"4","exp":"D6","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Work full time","type":"5","exp":"1","percent":1,"text":"Work full time"},{"label":"Work part time","type":"5","exp":"2","percent":1,"text":"Work part time"},{"label":"Work shifts","type":"5","exp":"3","percent":1,"text":"Work shifts"},{"label":"Study","type":"5","exp":"4","percent":1,"text":"Study"},{"label":"Small business","type":"5","exp":"5","percent":1,"text":"Small business"},{"label":"Retired","type":"5","exp":"6","percent":1,"text":"Retired"},{"label":"Homemaker","type":"5","exp":"7","percent":1,"text":"Homemaker"},{"label":"Unemployed","type":"5","exp":"8","percent":1,"text":"Unemployed"},{"label":"Parental leave","type":"5","exp":"9","percent":1,"text":"Parental leave"},{"label":"Other","type":"5","exp":"98","percent":1,"text":"Other"},{"label":"No answer","type":"5","exp":"99","percent":1,"text":"No answer"}],"text":"Working status"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Working status(Work full time-to-Work shifts)","type":"2","exp":"d6(1/3)","children":[{"label":"Position","type":"4","exp":"D11","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Executive","type":"5","exp":"1","percent":1,"text":"Executive"},{"label":"Manager","type":"5","exp":"2","percent":1,"text":"Manager"},{"label":"Specialist/professional","type":"5","exp":"3","percent":1,"text":"Specialist/professional"},{"label":"Clerical worker","type":"5","exp":"4","percent":1,"text":"Clerical worker"},{"label":"Technical or maintenance staff","type":"5","exp":"5","percent":1,"text":"Technical or maintenance staff"},{"label":"Worker","type":"5","exp":"6","percent":1,"text":"Worker"},{"label":"No answer","type":"5","exp":"99","percent":1,"text":"No answer"}],"text":"Position"}],"text":"Working status(Work full time-to-Work shifts)"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Income","type":"4","exp":"D12N","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Less than 10 000 rubles per month","type":"5","exp":"1","percent":1,"text":"Less than 10 000 rubles per month"},{"label":"10 001 - 15 000","type":"5","exp":"2","percent":1,"text":"10 001 - 15 000"},{"label":"15 001 - 20 000","type":"5","exp":"3","percent":1,"text":"15 001 - 20 000"},{"label":"20 001 - 25 000","type":"5","exp":"4","percent":1,"text":"20 001 - 25 000"},{"label":"25 001 - 30 000","type":"5","exp":"5","percent":1,"text":"25 001 - 30 000"},{"label":"30 001 - 35 000","type":"5","exp":"6","percent":1,"text":"30 001 - 35 000"},{"label":"35 001 - 40 000","type":"5","exp":"7","percent":1,"text":"35 001 - 40 000"},{"label":"40 001 – 50 000","type":"5","exp":"8","percent":1,"text":"40 001 – 50 000"},{"label":"50 001 – 60 000","type":"5","exp":"9","percent":1,"text":"50 001 – 60 000"},{"label":"60 001 – 70 000","type":"5","exp":"10","percent":1,"text":"60 001 – 70 000"},{"label":"Over 70 000 rubles","type":"5","exp":"11","percent":1,"text":"Over 70 000 rubles"},{"label":"No answer","type":"5","exp":"99","percent":1,"text":"No answer"}],"text":"Income"}]';
	top_h = '[{"text":"Card for use abroad - Payment system", "drag": true, "children":[{"text":"Cases UF", "id": "2" }, {"text":"Cases WF", "id": "3"}, {"text":"net_Card for use abroad - Payment system(7/8)", "id": "4"}, {"text":"net_Card for use abroad - Payment system(2/3)", "id": "5" }, {"text":"MasterCard", "id": "6"}, {"text":"Visa", "id": "7"}, {"text":"Maestro", "id": "8"}, {"text":"Visa Electron", "id": "9"}, {"text":"American Express", "id": "10"}, {"text":"Zolotaya Korona", "id": "11"}, {"text":"China Union Pay", "id": "12"}, {"text":"Diners Club", "id": "13"}, {"text":"JCB", "id": "14"}, {"text":"Pro 100", "id": "15"}, {"text":"Other", "id": "16"}, {"text":"net_Card for use abroad - Payment system(4/5; 9/98)", "id": "17"}, {"text":"DK/NA", "id": "18", "children": [{"text":"Card for use abroad - Payment system", "drag": true, "children":[{"text":"Cases UF", "id": "2" }, {"text":"Cases WF", "id": "3"}, {"text":"net_Card for use abroad - Payment system(7/8)", "id": "4"}, {"text":"net_Card for use abroad - Payment system(2/3)", "id": "5" }, {"text":"MasterCard", "id": "6"}, {"text":"Visa", "id": "7"}, {"text":"Maestro", "id": "8"}, {"text":"Visa Electron", "id": "9"}, {"text":"American Express", "id": "10"}, {"text":"Zolotaya Korona", "id": "11"}, {"text":"China Union Pay", "id": "12"}, {"text":"Diners Club", "id": "13"}, {"text":"JCB", "id": "14"}, {"text":"Pro 100", "id": "15"}, {"text":"Other", "id": "16"}, {"text":"net_Card for use abroad - Payment system(4/5; 9/98)", "id": "17"}, {"text":"DK/NA", "id": "18"}]}] }]}]';
	
	side_h = JSON.parse(side_h);
	top_h = JSON.parse(top_h);

	thirdTree = new tree_ui({parent: document.getElementsByClassName('second')[1], items: side_h, defaultExpand: true, defaultDrag: true, defaultDrop: true, rootDrop: true,
							functions: {
							rightClick: function(e, item){ thirdTree.removeItems(item); }, 
							singleClick: function(item){ console.log("single click " + item ); }, 
							doubleClick: function(item){ console.log("double click " + item ); },
							customSelect: function(event, items){ console.log("custom select " + items ); }
							}});

	var simple = tools.createHTML({tag: 'div', className: 'tbu-default' });

	dataSet.top[0]		= JSON.parse('[{"text":"Город","type":"4","exp":"SQ4","children":[		{"text":"Москва","type":"8","exp":"1"},		{"text":"Санкт-Петербург","type":"5","exp":"2"},		{"text":"Другой город","type":"5","exp":"999"}]}]');
	dataSet.side[0]		= JSON.parse('[{"text":"Возраст recoded(sum#)","type":"4","exp":"SQ3","children":[	{"text":"Cases WF-Not Established","type":"8","exp":"#cwf-nes"},{"text":"Cases WF","type":"7","exp":"cwf"},{"text":"24 и младше","type":"5","exp":"1"},{"text":"25 - 40","type":"5","exp":"2"},{"text":"41 - 55","type":"5","exp":"4"},{"text":"Старше 55 лет","type":"5","exp":"5"}]}]');
	dataSet.cells[0]	= JSON.parse('[[[1402],[603],[0]],[[1402,100,69.925187032419],[603,100,30.0748129675811],[0,null,0]],[[0,0,null],[0,0,null],[0,null,null]],[[743,52.9957203994294,69.5042095416277],[326,54.0630182421227,30.4957904583723],[0,null,0]],[[659,47.0042796005706,70.4059829059829],[277,45.9369817578773,29.5940170940171],[0,null,0]],[[0,0,null],[0,0,null],[0,null,null]]]');
	
	dataSet.top[1]		= JSON.parse('[{"text":"Wave","text2":"","type":"4","exp":"WAVE","children":[{"text":"Mayu002717","text2":"","type":"5","exp":"1","nopercent":1},{"text":"Julu002717","text2":"","type":"5","exp":"2","nopercent":1}]}]');
	dataSet.side[1]		= JSON.parse('[{"text":"T-O-M Brand Awareness","text2":"","type":"4","exp":"QB1KC1","children":[{"text":"Cases WF","text2":"","type":"7","exp":"cwf"},{"text":"Calve","text2":"","type":"5","exp":"1","nopercent":1},{"text":"Heinz","text2":"","type":"5","exp":"2","nopercent":1},{"text":"Mr. Ricco","text2":"","type":"5","exp":"3","nopercent":1},{"text":"Baltimor","text2":"","type":"5","exp":"4","nopercent":1},{"text":"EZhK Gotovim doma","text2":"","type":"5","exp":"5","nopercent":1},{"text":"Kukhmaster","text2":"","type":"5","exp":"6","nopercent":1},{"text":"Makheev","text2":"","type":"5","exp":"7","nopercent":1},{"text":"Moya semja","text2":"","type":"5","exp":"8","nopercent":1},{"text":"Stebel Bambuka","text2":"","type":"5","exp":"9","nopercent":1},{"text":"Pikador","text2":"","type":"5","exp":"10","nopercent":1},{"text":"Ryaba","text2":"","type":"5","exp":"11","nopercent":1},{"text":"Sloboda","text2":"","type":"5","exp":"12","nopercent":1},{"text":"Astoria","text2":"","type":"5","exp":"13","nopercent":1},{"text":"Hershey\u0027s","text2":"","type":"5","exp":"14","nopercent":1},{"text":"Dolmio","text2":"","type":"5","exp":"15","nopercent":1},{"text":"Kikkoman","text2":"","type":"5","exp":"16","nopercent":1},{"text":"Kuhne","text2":"","type":"5","exp":"17","nopercent":1},{"text":"Mivimex","text2":"","type":"5","exp":"18","nopercent":1},{"text":"Monin","text2":"","type":"5","exp":"19","nopercent":1},{"text":"Barilla","text2":"","type":"5","exp":"20","nopercent":1},{"text":"Veres","text2":"","type":"5","exp":"21","nopercent":1},{"text":"Spilva","text2":"","type":"5","exp":"22","nopercent":1},{"text":"Sen Soi","text2":"","type":"5","exp":"23","nopercent":1},{"text":"Pikanta","text2":"","type":"5","exp":"24","nopercent":1},{"text":"Kinto","text2":"","type":"5","exp":"25","nopercent":1},{"text":"Uncle Ben\u0027s","text2":"","type":"5","exp":"106","nopercent":1},{"text":"Buzdyakskiy","text2":"","type":"5","exp":"110","nopercent":1},{"text":"Dyadya Vanya","text2":"","type":"5","exp":"122","nopercent":1},{"text":"Knorr","text2":"","type":"5","exp":"126","nopercent":1},{"text":"Maggi","text2":"","type":"5","exp":"133","nopercent":1},{"text":"MZhK / Moskovskiy provansal\u0027","text2":"","type":"5","exp":"135","nopercent":1},{"text":"Persona","text2":"","type":"5","exp":"143","nopercent":1},{"text":"Pomidorka","text2":"","type":"5","exp":"146","nopercent":1},{"text":"Semeynye sekrety","text2":"","type":"5","exp":"152","nopercent":1},{"text":"Skit","text2":"","type":"5","exp":"155","nopercent":1},{"text":"Torchin","text2":"","type":"5","exp":"160","nopercent":1},{"text":"Hame","text2":"","type":"5","exp":"163","nopercent":1},{"text":"Chumak","text2":"","type":"5","exp":"165","nopercent":1},{"text":"Shchedro","text2":"","type":"5","exp":"166","nopercent":1},{"text":"Uni Dan","text2":"","type":"5","exp":"170","nopercent":1},{"text":"Yanta","text2":"","type":"5","exp":"175","nopercent":1},{"text":"Private text","text2":"","type":"5","exp":"178","nopercent":1},{"text":"Other","text2":"","type":"5","exp":"95","nopercent":1},{"text":"Hard to answer","text2":"","type":"5","exp":"99","nopercent":1}]}]');
	dataSet.cells[1]	= JSON.parse('[[[400],[400]],[[50.8694187637],[41.1870544317]],[[128.1520214761],[144.4974128099]],[[13.8947961437],[12.8876546067]],[[67.7626670177],[60.3154765315]],[[1.0054070994],[0]],[[0.9642984904],[1.0012241972]],[[68.6679149247],[59.4512407323]],[[6.9697150402],[6.9411062156]],[[0],[0]],[[4.0145470581],[5.742697663]],[[3.0107425161],[0.9985044423]],[[10.9068999188],[11.7542399408]],[[0.9944681426],[0.9782872138]],[[0],[0]],[[1.9669929652],[3.0315768746]],[[1.0026366978],[0.9988534707]],[[0],[0]],[[0],[0]],[[0],[0]],[[1.0076307823],[0]],[[0],[0]],[[0],[0]],[[0],[0]],[[0],[0]],[[0],[0]],[[1.986684118],[0]],[[0],[0]],[[3.008257881],[0]],[[0],[1.0092588755]],[[0],[0]],[[0],[2.9966279887]],[[1.9964504057],[1.0092588755]],[[0],[0.9288980332]],[[0],[0]],[[0],[0]],[[1.0078971638],[2.9498266762]],[[0],[0]],[[2.9589157768],[2.9255977435]],[[0],[0]],[[0],[0]],[[1.9875156402],[1.9631339505]],[[0.9908103906],[1.9505384542]],[[7.9639817465],[18.6894074523]],[[16.9093298406],[14.8142637484]]]');

	tau = new table_ui({parent: document.getElementsByClassName('first')[1], round: [5,4,3], functions: {
		rightClick: function(e, options){
			if(options.area == 'side' || options.area == 'top' ){
				if(options.area == 'side' && options.displayed){
					tau.setSort({side: {index: options.position, type: options.displayed[0], direction: true } });
				} else if(options.area == 'top' && options.displayed){
					tau.setSort({top: {index: options.position, type: options.displayed[0], direction: true } });
				}

				console.log(options.displayed[0]);
			}
		}}, size: { corner: {w: [40, 200]} }});

	document.body.oncontextmenu = function(e){
		var right = menu_ui({x: e.pageX, y: e.pageY, tree: [ {text: 'first', icon: 'default-img', func: function(e){alert('asfd');}, text2: 'That text is in text2' }, {text: 'second', icon: 'default-img', disabled: true}, {text: 'new branch', icon: 'default-img', check: true}, , {text: 'thrid', children: [ {text: 'first'}, {text: 'second'}, {text: 'thrid', children: [ {text: 'first'}, {text: 'second'}, ,{text: 'thrid', children: [ {text: 'first'}, {text: 'second'}]}]}]}, {text: 'fourth', children: [ {text: 'first'}, ,{text: 'second'}]} ] });
		return false;
	}

	thirdTree.focus();
	thirdTree.setScroll(1400);
	console.log(thirdTree.getScroll());
	tau.setTable( dataSet.top[1], dataSet.side[1], dataSet.cells[1]);
	tau.focus();

	var ar = [{text: '----', lvl: 1}, {separator: true }, { unselect: true, text: 'Some header', icon: 'tu-FolderClose'}, { text: 'first', icon: 'tu-TableIcon', lvl: 1}, { text: 'second', icon: 'tu-TableIcon', lvl: 1}, { text: 'third', icon: 'tu-TableIcon', lvl: 1}, {text: '----', lvl: 1}, {separator: true }, { unselect: true, text: 'Some header', icon: 'tu-FolderClose'}, { text: 'first', icon: 'tu-TableIcon', lvl: 1}, { text: 'second', icon: 'tu-TableIcon', lvl: 1}, { text: 'third', icon: 'tu-TableIcon', lvl: 1}, {text: '----', lvl: 1}, {separator: true }, { unselect: true, text: 'Some header', icon: 'tu-FolderClose'}, { text: 'first', icon: 'tu-TableIcon', lvl: 1}, { text: 'second', icon: 'tu-TableIcon', lvl: 1}, { text: 'third', icon: 'tu-TableIcon', lvl: 1}, {text: '----', lvl: 1}, {separator: true }, { unselect: true, text: 'Some header', icon: 'tu-FolderClose'}, { text: 'first', icon: 'tu-TableIcon', lvl: 1}, { text: 'second', icon: 'tu-TableIcon', lvl: 1}, { text: 'third', icon: 'tu-TableIcon', lvl: 1}, {text: '----', lvl: 1}, {separator: true }, { unselect: true, text: 'Some header', icon: 'tu-FolderClose'}, { text: 'first', icon: 'tu-TableIcon', lvl: 1}, { text: 'second', icon: 'tu-TableIcon', lvl: 1}, { text: 'third', icon: 'tu-TableIcon', lvl: 1}];

	window.ccb = new combobox_ui({parent: document.getElementById('ccb'), tree: ar });
	window.ccb.setSelected(ar[3]);
	console.log(window.ccb.getSelected());	
}

function some(e){
	
}

function fds(e){
	tau.setTable( dataSet.top[0], dataSet.side[0], dataSet.cells[0]);
}
function sds(event){
	tau.setTable( dataSet.top[1], dataSet.side[1], dataSet.cells[1]);
}


function set(){
	var newSize = parseFloat(document.getElementById('size').value);
	tau.change({scale: newSize });
}

function t1(){
	displayed[0] = !displayed[0];
	var button = document.getElementById('t1');
	button.style.background = (displayed[0]) ? 'green' : 'red';
	tau.change({showType: displayed});
}
function t2(){
	displayed[1] = !displayed[1];
	var button = document.getElementById('t2');
	button.style.background = (displayed[1]) ? 'green' : 'red';
	tau.change({showType: displayed});
}
function t3(){
	displayed[2] = !displayed[2];
	var button = document.getElementById('t3');
	button.style.background = (displayed[2]) ? 'green' : 'red';
	tau.change({showType: displayed});
}
function t4(){
	displayed[3] = !displayed[3];
	var button = document.getElementById('t4');
	button.style.background = (displayed[3]) ? 'green' : 'red';
	tau.change({showType: displayed});
}
function t4(){
	displayed[3] = !displayed[3];
	var button = document.getElementById('t4');
	button.style.background = (displayed[3]) ? 'green' : 'red';
	tau.change({showType: displayed});
}
function or(){
	setting.orientation = !setting.orientation;
	var button = document.getElementById('or');
	button.style.background = (setting.orientation) ? 'green' : 'red';
	tau.change({orientation: setting.orientation});
}
function hr(){
	setting.hideRow = !setting.hideRow;
	var button = document.getElementById('hr');
	button.style.background = (setting.hideRow) ? 'green' : 'red';
	tau.change({hideRow: setting.hideRow});
}
function hc(){
	setting.hideCol = !setting.hideCol;
	var button = document.getElementById('hc');
	button.style.background = (setting.hideCol) ? 'green' : 'red';
	tau.change({hideCol: setting.hideCol});
}

function xlsx(){
	var b = tau.xlsxExport({side: true, top: true, color: true});
	console.log(b);
	object_to_xlsx( {descPrefix: ['1','2','3','4','5','6','7'], TOC: true, annotation: true, background: true}, [{description: ['first string', 'second string', 'third string', 'fourth string', 'fifth string'], annotation: 'annotation'}, {description: ['first string', 'second string', 'third string', 'fourth string', 'fifth string'], object: b, annotation: 'annotation'}] );
}