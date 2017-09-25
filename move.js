var glcanvas;
var mat4;
var user={
	"mouse": {"down": false, "x": 0, "y": 0}};
var vec4;
var view;

window.onkeydown=function (event) {
	var dx=0.0;
	var dy=0.0;
	var dz=0.0;
	switch (event.keyCode) {
		case 65: //A
			dx=-1.0;
			break;
		case 67: //C
			dy=-1.0;
			break;
		case 68: //D
			dx=1.0;
			break;
		case 69: //E
			dy=1.0;
			break;
		case 83: //S
			dz=1.0;
			break;
		case 87: //W
			dz=-1.0;
			break;
	}
	var mm=mat4.create();
	var vv=vec4.create();
	vec4.set(vv, dx, dy, dz, 1.0);
	mat4.identity(mm);
	mat4.rotate(mm, mm, -view.rotation.y, [0.0, 1.0, 0.0]);
	mat4.rotate(mm, mm, -view.rotation.x, [1.0, 0.0, 0.0]);
	vec4.transformMat4(vv, vv, mm);
	view.position.x+=view.fieldOfView*vv[0]/vv[3];
	view.position.y+=view.fieldOfView*vv[1]/vv[3];
	view.position.z+=view.fieldOfView*vv[2]/vv[3];
};

glcanvas.onmousedown=function(event) {
	user.mouse.down=true;
	user.mouse.x=event.clientX;
	user.mouse.y=event.clientY;
};

glcanvas.onmousemove=function(event) {
	if (user.mouse.down) {
		setRotates(event);
	}
};

glcanvas.onmouseout=function(event) {
	this.onmouseup(event);
};

glcanvas.onmouseup=function(event) {
	if (user.mouse.down) {
		user.mouse.down=false;
		setRotates(event);
	}
};

function resetView() {
	view={
			"fieldOfView": Math.PI/2.0,
			"position": {"x": 8.0, "y": 8.0, "z": 8.0},
			"rotation": {"x": Math.atan(1/Math.sqrt(2.0)), "y": -Math.PI/4.0}};
}

document.getElementById("resetView").onclick=resetView;

function setRotates(event) {
	var dx=user.mouse.x-event.clientX;
	var dy=user.mouse.y-event.clientY;
	view.rotation.x=Math.max(-Math.PI/2.0, Math.min(Math.PI/2.0,
			view.rotation.x+view.fieldOfView*dy/glcanvas.height));
	view.rotation.y+=view.fieldOfView*dx/glcanvas.width;
	while (2.0*Math.PI<=view.rotation.y) {
		view.rotation.y-=2.0*Math.PI;
	}
	while (0>view.rotation.y) {
		view.rotation.y+=2.0*Math.PI;
	}
	user.mouse.x=event.clientX;
	user.mouse.y=event.clientY;
}

window.addEventListener("wheel", function(event) {
	view.fieldOfView=Math.max(Math.PI/20.0, Math.min(Math.PI/2.0,
			view.fieldOfView+Math.sign(event.deltaY)*Math.PI/180.0));
});

resetView();
