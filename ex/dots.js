var rotation = function(dot, ang, center){
	var x0 = dot[0] - center[0];
	var y0 = dot[1] - center[1];
	var x = x0*Math.cos(ang*Math.PI) - y0*Math.sin(ang*Math.PI);
	var y = x0*Math.sin(ang*Math.PI) + y0*Math.cos(ang*Math.PI);
	x = x + center[0];
	y = y + center[1];
	return [x, y];
}

var distance = function(d1, d2){
	return Math.sqrt((d1[0] - d2[0])*(d1[0] - d2[0]) + (d1[1] - d2[1])*(d1[1] - d2[1]));
}

var cross = function(e1, e2){
	var x;
	var y;
	x = ( e2[2]*e1[1] - e1[2]*e2[1] )/( e1[0]*e2[1] - e2[0]*e1[1] );
	y = ( e2[2]*e1[0] - e1[2]*e2[0] )/( e2[0]*e1[1] - e1[0]*e2[1] );
	return [x, y];
}

function getEqual(d1, d2){

	var x = 1/(d2[0] - d1[0]);
	var y = - 1 /(d2[1] - d1[1]);
	var b = - d1[0]/(d2[0] - d1[0]) + d1[1]/(d2[1] - d1[1]);
	
	if(d1[0] == d2[0])				return [ 1, 0, -d1[0]];
	else if(d1[1] == d2[1])			return [ 0, 1, -d1[1]];
	else							return [x, y, b];
}
function parEqual(eq, d){
	return [ eq[0], eq[1], ( Math.sqrt( eq[0]*eq[0] + eq[1]*eq[1] ) * d + eq[2] ) ];
}

var L = function(eq1, eq2){
	return { type: 'l', points: cross(eq1, eq2) };
}
var M = function(e1, e2){
	return { type: 'm', points: cross(e1, e2) };	
}

var C = function(e1, e2, d1, d2){
	e1_1 = parEqual(e1, d1);
	e2_1 = parEqual(e2, d2);
	points = [ cross(e1,e2_1), cross(e1,e2), cross(e1_1, e2) ];
	return { type: 'c', points: points };
}

var ame = function(){
	var center = [50,50];

	var a = [50,46];

	var f = [];
	var t = [];
	var s = [];

	var gl = 1;

	trg = [];
	path = [];
	
	f[1] = rotation(a, 1/3, center);
	f[0] = [f[1][0], f[1][1] - 40];
	f[2] = rotation(f[0], 1/3, f[1]);
	f[3] = rotation(f[2], 1/3, f[1]);

	for(var i = 0; i < 4; i++){
		s[i] = rotation(f[i], 2/3, center);
	}
	var svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 100 100">';

	e02 = getEqual(s[0], s[2]);
	e01 = getEqual(s[0], s[1]);
	e32 = getEqual(s[3], s[2]);
	e31 = getEqual(s[3], s[1]);
	e57 = parEqual(e02, -22);
	e67 = parEqual(e32, -22);
	e17 = getEqual(s[1], s[2]);	

	path.push( M(e17,e02) )
	path.push( C(e02,e01, -gl, -gl) )
	path.push( C(e01,e57, -gl, gl))
	path.push( L(e57,e17))

	trg.push(path);
	path = [];

	path.push( M(e17,e32) )
	path.push( C(e32,e31, -gl, -gl) )
	path.push( C(e31,e67, -gl, gl))
	path.push( L(e67,e17))

	trg.push(path);
	path = [];



	f[0][1] += 5; 
	e02 = getEqual(f[0], f[2]);
	e01 = getEqual(f[0], f[1]);
	e32 = getEqual(f[3], f[2]);
	e31 = getEqual(f[3], f[1]);
	e57 = parEqual(e02, 19.5);
	e67 = parEqual(e32, 21);
	e17 = getEqual(f[1], f[2]);


	e12P = parEqual(e17, -4);
	e12M = parEqual(e17,  4);
	e12P2 = parEqual(e17, -2);
	e12M2 = parEqual(e17,  2);
	e02M = parEqual(e02,  1);

	o4 = cross(e12P, e32);
	o5 = cross(e12M, e02);

	o7 = cross(e12P2, e32);
	o8 = cross(e12M2, e02);

	o6 = cross(e02M, e17);


	path.push( M(e17, e57) );
	path.push( C(e57, e01, -gl, -gl) );
	path.push( C(e01, e02, -gl,  gl) );
	path.push( { type: 'c', points: [o5, o8, o6] });

	trg.push(path);
	path = [];

	path.push( M(e17, e67) );
	path.push( C(e67, e31, -gl, gl) );
	path.push( C(e31, e32,  gl, gl) );
	path.push( { type: 'c', points: [o4, o7, o6] });

	trg.push(path);
	path = [];

	for(var i = 0; i < 2; i++){
		for(var j = 0; j < trg[2+i].length; j++){
			q = trg[2+i][j];
			if(q.type == 'm'){
				path.push( { type: 'm', points: [ 100 - q.points[0], q.points[1] ] } );
			}
			if(q.type == 'c'){
				path.push( { type: 'c', points: [[ 100 - q.points[0][0], q.points[0][1] ], [ 100 - q.points[1][0], q.points[1][1] ], [ 100 - q.points[2][0], q.points[2][1] ]] } );			}
			if(q.type == 'l'){
				path.push( { type: 'l', points: [ 100 - q.points[0], q.points[1] ] } );
			}
		}
		trg.push(path);
		path = [];
	}

	for(var i = 0; i < trg.length; i++){
		svg += '<path fill="#777777" d="';
		for(var j = 0; j < trg[i].length; j++){
			var q = trg[i][j];
			if(q.type == 'm')
				svg += 'M ' + Math.round(q.points[0]*100)/100 + ',' + Math.round(q.points[1]*100)/100 + ' ';
			else if(q.type == 'c'){
				svg += 'L ' + Math.round(q.points[0][0]*100)/100 + ',' + Math.round(q.points[0][1]*100)/100 + ' ';
				svg += 'C ' + Math.round(q.points[0][0]*100)/100 + ',' + Math.round(q.points[0][1]*100)/100 + ' ' + Math.round(q.points[1][0]*100)/100 + ',' + Math.round(q.points[1][1]*100)/100 + ' ' + Math.round(q.points[2][0]*100)/100 + ',' + Math.round(q.points[2][1]*100)/100 + ' ';
				svg += 'L ' + Math.round(q.points[2][0]*100)/100 + ',' + Math.round(q.points[2][1]*100)/100 + ' ';
			} else if(q.type == 'l')
				svg += 'L ' + Math.round(q.points[0]*100)/100 + ',' + Math.round(q.points[1]*100)/100 + ' ';
		}
		svg += ' z" />';
	}

	svg += '</svg>';
	return svg;
}

ame();