
'strict mode'

var cal2, cal;
var logic;

window.onload = new_function;

function new_function() {
	cal = new calendar_ui({parent: document.getElementById('example') });

	var eTree = [ {text: 'OR', children: [ {text: 'AND', children: [{text: 'VAR1'},{text: 'VAR2'}] } , { text: 'VAR3' } ] } ];

	logic = new logic_ui({ tree: eTree, parent: document.getElementById('elogic') });

}