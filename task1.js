
var o_color = [ 57.0,235.0,235.0,1.0];
var o_size = 1;
var o_shape = 'Rectangle';
var dragging = false;

function main() {

  	var canvas = document.getElementById('webgl');
	var gl = getWebGLContext(canvas);
	if (!gl){
		console.log('Failed to find context');
	}

	var tapCoordinates = [];

	var tapColors = [];
	var tapSizes = [];
	var tapShapes = [];
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram (program);
	gl.program = program;

	
	canvas.onmousedown = function(ev) {click(ev,program, gl, canvas,  tapCoordinates,tapColors,tapSizes,tapShapes );};
	canvas.onmouseup = function(ev){up(ev);}
	canvas.onmousemove = function(ev){move(ev,program,gl,canvas,tapCoordinates,tapColors,tapSizes,tapShapes);}
	render(gl,tapCoordinates,program,tapSizes,tapShapes);
}


function render(gl,tapCoordinates,program,tapColors,tapSizes,tapShapes){
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	var len = tapCoordinates.length;
	var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');
		if (u_FragColor < 0) { console.log ("Failed to Get Color"); return;	}	 
	for (var i = 0; i < len; i+=1)
	{
		var loc = tapCoordinates[i];
		var size = tapSizes[i];
		var shape = tapShapes[i];
		var color = tapColors[i];
		
		var vertices = [loc[0]-0.01*size,loc[1]-0.01*size,loc[0]+0.03*size,loc[1]-0.01*size,loc[0]+0.03*size,loc[1]+0.01*size,loc[0]-0.01*size,loc[1]+0.01*size, //rectangle
		loc[0]-0.01*size,loc[1]-0.01*size,loc[0] +0.01*size,loc[1]-0.01*size,loc[0]+0*size,loc[1]+0.01*size,   													//triangle
		loc[0]-0.01*size,loc[1]-0.01*size,loc[0]+0.01*size,loc[1]-0.01*size,loc[0]+0.01*size,loc[1]+0.01*size,loc[0]-0.01*size,loc[1]+0.01*size,
		loc[0]+0*size, loc[1]+0*size, loc[0]+0*size, loc[1]+0.03*size, loc[0]-0.03*size, loc[1]+0.015*size, loc[0]-0.03*size, loc[1]-0.015*size, loc[0]+0*size, loc[1]-0.03*size, loc[0]+0.03*size, loc[1]-0.015*size, loc[0]+0.03*size, loc[1]+0.015*size, loc[0]+0*size, loc[1]+0.03*size,//hexagon
		loc[0]+0*size, loc[1]+0*size, loc[0]+0*size, loc[1]+0.03*size, loc[0]-0.025*size, loc[1]+0.005*size, loc[0]-0.015*size, loc[1]-0.025*size, loc[0]+0.015*size, loc[1]-0.025*size, loc[0]+0.025*size, loc[1]+0.005*size, loc[0]+0*size, loc[1]+0.03*size,//pentagon
		loc[0]-0.03*size, loc[1]+0*size,  loc[0]+0*size, loc[1]+0.04*size ,  loc[0]+0.03*size,  loc[1]+0*size, loc[0]+0*size, loc[1]-0.04*size,	//diamond
		 loc[0]-0.01*size, loc[1]-0.01*size, loc[0]+0.01*size, loc[1]-0.01*size, loc[0]+0*size,loc[1]+0.012*size, loc[0]-0.01*size, loc[1]+0.005*size, loc[0]+0.01*size,loc[1]+0.005*size,loc[0]+0*size,loc[1]-0.017*size  //star
		 ];	

		var circle = {x: loc[0], y: loc[1], r: 45*0.05*size};
    	vertices.push(circle.x, circle.y);
	    for(var k = 0; k <= 16; k++) {
	     var angle = (2 * Math.PI) / 16* (k+1);
	      vertices.push(loc[0]+(circle.x + Math.cos(angle) * circle.r)*0.01);
	      vertices.push(loc[1]+(circle.y + Math.sin(angle) * circle.r)*0.01);
	    }
		vertices.push(loc[0],loc[1]);
		 
	
		var numberOfVertices = initVertices(program,gl,vertices);
		var c = 1.0/255;
		
		gl.uniform4f(u_FragColor,c*color[0] , c*color[1] ,c*color[2],1.0 );
		
		
		if (shape == 'Rectangle')
			gl.drawArrays(gl.TRIANGLE_FAN,0,4);	
		else if (shape == 'Triangle')
			gl.drawArrays(gl.TRIANGLE_FAN,4,3);
		else if (shape == 'Square')
			gl.drawArrays(gl.TRIANGLE_FAN,7,4);
		else if (shape == 'Hexagon')
			gl.drawArrays(gl.TRIANGLE_FAN,11,8);
		else if (shape == 'Pentagon')
			gl.drawArrays(gl.TRIANGLE_FAN,19,7);
		else if (shape == 'Diamond')
			gl.drawArrays(gl.TRIANGLE_FAN,26,4);
		else if (shape == 'Star')
			{
				gl.drawArrays(gl.TRIANGLE_FAN,30,3);
				gl.drawArrays(gl.TRIANGLE_FAN,33,3);
			}
		else if (shape == "Circle")
				gl.drawArrays(gl.TRIANGLE_FAN,36,18);
		else if (shape == "Line")
			gl.drawArrays(gl.points,54,1);
	}
	


}

var FizzyText = function() {
  this.Shape = 'Rectangle';
  this.Color = [ 57.0,235.0,235.0,1.0];
  this.Size = 1;
  this.Erase = false;

}

window.onload = function() {
 
  	var text = new FizzyText();
  	var gui = new dat.GUI();
  	var shape = gui.add(text, 'Shape', [ 'Circle', 'Triangle', 'Square' , 'Rectangle', 'Pentagon', 'Hexagon','Diamond','Star','Line' ] );
	var color = gui.addColor(text, 'Color');
	var size = gui.add(text,'Size',1,10);
	var erase = gui.add(text, 'Erase');
	var current = o_color;
	color.onChange(function(value) {
		o_color = value;
		
	});	 

	size.onFinishChange(function(value) {
		o_size = value;
	});	 

	shape.onChange(function(value) {
		o_shape = value;
	});	 

	erase.onChange(function(value) {
		if (value == true)
			{
				current = o_color;
//console.log(current);
				o_color = [0,0,0,1];
			}
		else 
			o_color = current;
			console.log(o_color);
	});	


	main();

};





function initVertices(program, gl,vertices){
	
	var noOfDim = 2;
	var numberOfVertices = vertices.length / noOfDim;
	
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer){ console.log('Failed to create the buffer object ');	return -1;}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	
	var a_Position = gl.getAttribLocation(program, 'a_Position');
	if (a_Position < 0) { console.log ("Failed to Get Position"); return;	}
	
	gl.vertexAttribPointer(a_Position, noOfDim, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);
	

	return numberOfVertices;

}
function up (ev){
	dragging = false;
}
function move (ev,program,gl,canvas,tapCoordinates,tapColors,tapSizes,tapShapes){
	if(dragging) {
		var x = ev.clientX;
	    var y = ev.clientY;
	    var x = ev.clientX; // x coordinate of a mouse pointer
		var y = ev.clientY; // y coordinate of a mouse pointer
		var rect = ev.target.getBoundingClientRect();

		x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
		y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
		tapCoordinates.push([x, y]);
		tapColors.push(o_color);
		tapSizes.push(o_size);
		tapShapes.push(o_shape);
		render(gl,tapCoordinates,program,tapColors,tapSizes,tapShapes);
     }
}
function click(ev,program,gl,canvas,tapCoordinates,tapColors,tapSizes,tapShapes){

	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect();

	x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
	y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);

	tapCoordinates.push([x, y]);

	tapColors.push(o_color);
	tapSizes.push(o_size);
	tapShapes.push(o_shape);
	dragging =true;
	render(gl,tapCoordinates,program,tapColors,tapSizes,tapShapes);
	
	}
