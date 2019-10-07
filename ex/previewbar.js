
'strict mode'

var PVB;
var PVBitems;


window.onload = function new_function(){

	// parent for objects
	var html_bar = document.getElementById('bar');
	var html_content = document.getElementById('content');


	var ctr = document.getElementById('content');
	var frag = document.createDocumentFragment();
	var cns;

	
	PVBitems = [
		{
			id: 'id1',
			text: 'Mozambique here... (your time has ended)'
		},
		{
			id: 'id2',
			text: 'Mozambique here... (you lost this one)'
		},
		{
			id: 'id3',
			text: 'Mozambique here... (what am i looking at)'
		},
		{
			id: 'id4',
			text: 'Mozambique here... (means little when you die)'
		},
		{
			id: 'id5',
			text: "It's over, It's over for you"
		},
		{
			id: 'id6',
			text: "You ain't  that bright if you wanna take me on, Accept it.. I'm here, you're not!, Wanna be here? Take me out!"
		},
		{
			id: 'id7',
			text: "I've become so numb, I can't feel you there, I'm tired of being what you want me to be"
		},
		{
			id: 'id9',
			text: "I remember feeling the opposite of falling (Into that spot where we untie every knot), Spinning past the ceiling, absolution calling, Are you there, or not?"
		},
		{
			id: 'id8',
			text: 'Only when I start to think about you I know, Only when you start to think about me do you know, I hate everything about you'
		},
		{
			span: true,
			id: 'id9',
			text: "I remember feeling the opposite of falling (Into that spot where we untie every knot), Spinning past the ceiling, absolution calling, Are you there, or not?"
		},
		{
			id: 'id10',
			text: 'Black holes living in the side of your face, Razor wire spinning around your Around your'
		},
		{	
			span: true,
			id: 'id11',
			text: "So to keep us from falling apart, We'll write songs in the dark, And to keep us from fading away, We'll write"
		},
		{
			id: 'skipidi2',
			text: 'denzafaradenza'
		}
	];




	PVB = new list_ui({
		parent: html_bar,
		items: PVBitems,
		functions: {
			click: function(...params){
				console.log(params);
			},
			dblClick: function(){
				console.log("hale");
			},
			current: function(){
				console.log(arguments);
			},
			keyDown: function(){
				if(arguments[0].keyCode == 86){
					var position = arguments[2][0].position + 1;
					if(arguments[1]){
						position += - 1;
					}
					var stop = PVB.addItems({text: 'lol'}, position );
					console.log(stop);
					PVB.removeSelect();
					PVB.setSelect(stop);
				}
				console.log(arguments);
			},
			drag: function(){
				console.log(arguments);
			},
			drop: function(){
				console.log(arguments);
			}
		}
	});

	PVB.addItems({text: 'make a selfi2'}, 0);

	PVB.addItems({text: 'make a selfi3'}, 1);

	PVB.addItems({text: 'make a selfi1'}, 0);

}
