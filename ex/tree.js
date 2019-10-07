
'strict mode'

var t1, t2;
var w1;

window.onload = function new_function(){

	var t1p = document.getElementById('f');
	var t2p = document.getElementById('s');
	
	var rowdataset1 = '[{"type":"3","exp":"-*","text":"*"},{"text":"Gender","type":"4","exp":"SEX","children":[{"text":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"text":"Male","type":"5","exp":"1","percent":1,"text":"Male"},{"text":"Female","type":"5","exp":"2","percent":1,"text":"Female"}],"text":"Gender"},{"text":"*","type":"3","exp":"-*","text":"*"},{"text":"Age","type":"4","exp":"AGE","children":[{"text":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"text":"18-24","type":"5","exp":"1","percent":1,"text":"18-24"},{"label":"25-39","type":"5","exp":"2","percent":1,"text":"25-39"},{"label":"40-55","type":"5","exp":"3","percent":1,"text":"40-55"}],"text":"Age"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"strataQ","type":"4","exp":"STRATAQ","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"1M+","type":"5","exp":"1","percent":1,"text":"1M+"},{"label":"500K-1M","type":"5","exp":"2","percent":1,"text":"500K-1M"},{"label":"100K-500K","type":"5","exp":"3","percent":1,"text":"100K-500K"}],"text":"strataQ"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Federal district","type":"4","exp":"S1","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Moscow","type":"5","exp":"101","percent":1,"text":"Moscow"},{"label":"Saint-Petersburg","type":"5","exp":"102","percent":1,"text":"Saint-Petersburg"},{"label":"Central/Northwest","type":"3","exp":"s1(1/2)","percent":1,"text":"Central/Northwest"},{"label":"Volga","type":"5","exp":"5","percent":1,"text":"Volga"},{"label":"South/Caucasus","type":"5","exp":"3","percent":1,"text":"South/Caucasus"},{"label":"Urals","type":"5","exp":"6","percent":1,"text":"Urals"},{"label":"Siberia/Far East","type":"3","exp":"s1(7/8)","percent":1,"text":"Siberia/Far East"}],"text":"Federal district"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Education","type":"4","exp":"D1","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"1","type":"5","exp":"1","percent":1,"text":"1"},{"label":"2","type":"5","exp":"2","percent":1,"text":"2"},{"label":"3","type":"5","exp":"3","percent":1,"text":"3"},{"label":"4","type":"5","exp":"4","percent":1,"text":"4"},{"label":"5","type":"5","exp":"5","percent":1,"text":"5"},{"label":"9","type":"5","exp":"9","percent":1,"text":"9"}],"text":"Education"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Marital status","type":"4","exp":"D2","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Married","type":"5","exp":"1","percent":1,"text":"Married"},{"label":"Live together","type":"5","exp":"2","percent":1,"text":"Live together"},{"label":"Not married","type":"5","exp":"3","percent":1,"text":"Not married"},{"label":"Divorced","type":"5","exp":"4","percent":1,"text":"Divorced"},{"label":"Widowed","type":"5","exp":"5","percent":1,"text":"Widowed"},{"label":"DK/NA","type":"5","exp":"9","percent":1,"text":"DK/NA"}],"text":"Marital status"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Family members","type":"4","exp":"D3","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"1","type":"5","exp":"1","percent":1,"text":"1"},{"label":"2","type":"5","exp":"2","percent":1,"text":"2"},{"label":"3","type":"5","exp":"3","percent":1,"text":"3"},{"label":"4","type":"5","exp":"4","percent":1,"text":"4"},{"label":"5+","type":"5","exp":"5","percent":1,"text":"5+"}],"text":"Family members"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Precense of children <15y.o.","type":"4","exp":"D4","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"0","type":"5","exp":"0","percent":1,"text":"0"},{"label":"1","type":"5","exp":"1","percent":1,"text":"1"},{"label":"2","type":"5","exp":"2","percent":1,"text":"2"},{"label":"3+","type":"5","exp":"3","percent":1,"text":"3+"}],"text":"Precense of children <15y.o."},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Precense of children <15y.o.(1-to-3+)","type":"2","exp":"d4(1/3)","children":[{"label":"Precense of children <3y.o.","type":"4","exp":"D5_1","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Under 3 y.o.","type":"5","exp":"1","percent":1,"text":"Under 3 y.o."}],"text":"Precense of children <3y.o."},{"label":"Precense of children 4-6y.o.","type":"4","exp":"D5_2","children":[{"label":"4-6 y.o.","type":"5","exp":"2","percent":1,"text":"4-6 y.o."}],"text":"Precense of children 4-6y.o."},{"label":"Precense of children 7-10y.o.","type":"4","exp":"D5_3","children":[{"label":"7-10 y.o.","type":"5","exp":"3","percent":1,"text":"7-10 y.o."}],"text":"Precense of children 7-10y.o."},{"label":"Precense of children 11-15y.o.","type":"4","exp":"D5_4","children":[{"label":"11-15 y.o.","type":"5","exp":"4","percent":1,"text":"11-15 y.o."}],"text":"Precense of children 11-15y.o."},{"label":"Precense of children -DK/NA","type":"4","exp":"D5_9","children":[{"label":"No answer","type":"5","exp":"9","percent":1,"text":"No answer"}],"text":"Precense of children -DK/NA"}],"text":"Precense of children <15y.o.(1-to-3+)"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Working status","type":"4","exp":"D6","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Work full time","type":"5","exp":"1","percent":1,"text":"Work full time"},{"label":"Work part time","type":"5","exp":"2","percent":1,"text":"Work part time"},{"label":"Work shifts","type":"5","exp":"3","percent":1,"text":"Work shifts"},{"label":"Study","type":"5","exp":"4","percent":1,"text":"Study"},{"label":"Small business","type":"5","exp":"5","percent":1,"text":"Small business"},{"label":"Retired","type":"5","exp":"6","percent":1,"text":"Retired"},{"label":"Homemaker","type":"5","exp":"7","percent":1,"text":"Homemaker"},{"label":"Unemployed","type":"5","exp":"8","percent":1,"text":"Unemployed"},{"label":"Parental leave","type":"5","exp":"9","percent":1,"text":"Parental leave"},{"label":"Other","type":"5","exp":"98","percent":1,"text":"Other"},{"label":"No answer","type":"5","exp":"99","percent":1,"text":"No answer"}],"text":"Working status"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Working status(Work full time-to-Work shifts)","type":"2","exp":"d6(1/3)","children":[{"label":"Position","type":"4","exp":"D11","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Executive","type":"5","exp":"1","percent":1,"text":"Executive"},{"label":"Manager","type":"5","exp":"2","percent":1,"text":"Manager"},{"label":"Specialist/professional","type":"5","exp":"3","percent":1,"text":"Specialist/professional"},{"label":"Clerical worker","type":"5","exp":"4","percent":1,"text":"Clerical worker"},{"label":"Technical or maintenance staff","type":"5","exp":"5","percent":1,"text":"Technical or maintenance staff"},{"label":"Worker","type":"5","exp":"6","percent":1,"text":"Worker"},{"label":"No answer","type":"5","exp":"99","percent":1,"text":"No answer"}],"text":"Position"}],"text":"Working status(Work full time-to-Work shifts)"},{"label":"*","type":"3","exp":"-*","text":"*"},{"label":"Income","type":"4","exp":"D12N","children":[{"label":"Cases WF","type":"7","exp":"cwf","text":"Cases WF"},{"label":"Less than 10 000 rubles per month","type":"5","exp":"1","percent":1,"text":"Less than 10 000 rubles per month"},{"label":"10 001 - 15 000","type":"5","exp":"2","percent":1,"text":"10 001 - 15 000"},{"label":"15 001 - 20 000","type":"5","exp":"3","percent":1,"text":"15 001 - 20 000"},{"label":"20 001 - 25 000","type":"5","exp":"4","percent":1,"text":"20 001 - 25 000"},{"label":"25 001 - 30 000","type":"5","exp":"5","percent":1,"text":"25 001 - 30 000"},{"label":"30 001 - 35 000","type":"5","exp":"6","percent":1,"text":"30 001 - 35 000"},{"label":"35 001 - 40 000","type":"5","exp":"7","percent":1,"text":"35 001 - 40 000"},{"label":"40 001 – 50 000","type":"5","exp":"8","percent":1,"text":"40 001 – 50 000"},{"label":"50 001 – 60 000","type":"5","exp":"9","percent":1,"text":"50 001 – 60 000"},{"label":"60 001 – 70 000","type":"5","exp":"10","percent":1,"text":"60 001 – 70 000"},{"label":"Over 70 000 rubles","type":"5","exp":"11","percent":1,"text":"Over 70 000 rubles"},{"label":"No answer","type":"5","exp":"99","percent":1,"text":"No answer"}],"text":"Income"}]';
	var rowdataset2 = '[{"text":"Card for use abroad - Payment system", "drag": true, "children":[{"text":"Cases UF", "id": "2" }, {"text":"Cases WF", "id": "3"}, {"text":"net_Card for use abroad - Payment system(7/8)", "id": "4"}, {"text":"net_Card for use abroad - Payment system(2/3)", "id": "5" }, {"text":"MasterCard", "id": "6"}, {"text":"Visa", "id": "7"}, {"text":"Maestro", "id": "8"}, {"text":"Visa Electron", "id": "9"}, {"text":"American Express", "id": "10"}, {"text":"Zolotaya Korona", "id": "11"}, {"text":"China Union Pay", "id": "12"}, {"text":"Diners Club", "id": "13"}, {"text":"JCB", "id": "14"}, {"text":"Pro 100", "id": "15"}, {"text":"Other", "id": "16"}, {"text":"net_Card for use abroad - Payment system(4/5; 9/98)", "id": "17"}, {"text":"DK/NA", "id": "18", "children": [{"text":"Card for use abroad - Payment system", "drag": true, "children":[{"text":"Cases UF", "id": "2" }, {"text":"Cases WF", "id": "3"}, {"text":"net_Card for use abroad - Payment system(7/8)", "id": "4"}, {"text":"net_Card for use abroad - Payment system(2/3)", "id": "5" }, {"text":"MasterCard", "id": "6"}, {"text":"Visa", "id": "7"}, {"text":"Maestro", "id": "8"}, {"text":"Visa Electron", "id": "9"}, {"text":"American Express", "id": "10"}, {"text":"Zolotaya Korona", "id": "11"}, {"text":"China Union Pay", "id": "12"}, {"text":"Diners Club", "id": "13"}, {"text":"JCB", "id": "14"}, {"text":"Pro 100", "id": "15"}, {"text":"Other", "id": "16"}, {"text":"net_Card for use abroad - Payment system(4/5; 9/98)", "id": "17"}, {"text":"DK/NA", "id": "18"}]}] }]}]';

	var dataset1 = JSON.parse(rowdataset1);
	var dataset2 = JSON.parse(rowdataset1);


	function openALL(children){
		for(var i = 0; i < children.length; i++){
			if(children[i].children){
				children[i].expand = true;
				openALL(children[i].children);
			}
		}
	}
	openALL(dataset1);
	openALL(dataset2);

	t1 = new tree_ui({	parent: t1p,
						items: dataset1,
						defaultExpand: true,
						defaultDrag: true,
						defaultDrop: true,
						rootDrop: true,
						outline: true,
						functions: {
							dblClick: function(e){ console.log(arguments)},
							keyDown: function(e){ console.log(arguments)},
							afterSelect: function(e){ console.log(arguments)},
							drop: function(e, input, output, items, parent, index){
								for(var i = 0; i < items.length; i++){
									for(var j = 0; j < items[i].parent.children.length; j++){
										if(items[i].parent.children[j] == items[i]){
											items[i].parent.children.splice(j, 1);
											break;
										}
									}
								}
								for(var i = 0; i < items.length; i++){
									parent.children.splice(i + index, 0, items[i]);
								}
								input.change();
								output.change();
							}
						} });


	t2 = new tree_ui({	parent: t2p,
						functions: {
							keyDown: function(e, i, l){ console.log(e, i, l);},
							dblClick: function(e, i){ console.log(e, i)}
						} });

	var input = document.getElementById('search');
	input.oninput = function(){
		t1.showFoundItems(input.value);
	}
}
