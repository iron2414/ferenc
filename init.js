var debug=false;
var gl;
var glcanvas;
var height;
var start=Date.now();
var supreme;
var width;

function debugGl(oldGl) {
	var newGl=oldGl;
	if (debug) {
		newGl={"oldGl": oldGl};
		for (var key in oldGl) {
			newGl[key]=("function"===typeof oldGl[key])
					?debugGlFunction(oldGl, key)
					:oldGl[key];
		}
	}
	return newGl;
}

function debugGlFunction(oldGl, functionName) {
	return function() {
		var result=oldGl[functionName].apply(oldGl, arguments);
		var error=null;
		while (true) {
			var error2=oldGl.getError();
			if (oldGl.NO_ERROR===error2) {
				break;
			}
			if (null===error) {
				error=functionName+"(";
				for (var ii=0; arguments.length>ii; ++ii) {
					if (0!==ii) {
						error+=", ";
					}
					error+=arguments[ii];
				}
				error+="): ";
			}
			else {
				error+=", ";
			}
			switch (error2) {
				case oldGl.CONTEXT_LOST_WEBGL:
					error+="CONTEXT_LOST_WEBGL";
					break;
				case oldGl.INVALID_ENUM:
					error+="INVALID_ENUM";
					break;
				case oldGl.INVALID_FRAMEBUFFER_OPERATION:
					error+="INVALID_FRAMEBUFFER_OPERATION";
					break;
				case oldGl.INVALID_OPERATION:
					error+="INVALID_OPERATION";
					break;
				case oldGl.INVALID_VALUE:
					error+="INVALID_VALUE";
					break;
				case oldGl.OUT_OF_MEMORY:
					error+="OUT_OF_MEMORY";
					break;	
				default:
					error+=error2;
					break;
			}
		}
		if (null!==error) {
			throw error;
		}
		return result;
	};
}

function init() {
	if (!window.WebGLRenderingContext) {
		alert("webgl not supported");
		return;
	}
	height=window.innerHeight-10;
	width=height;
	glcanvas=document.getElementById("glcanvas");
	glcanvas["height"]=height;
	glcanvas["width"]=width;
	gl=debugGl(glcanvas.getContext("webgl2"));
}

function initParameters() {
	var search=window.location.search;
	if ("string"!==typeof search) {
		return;
	}
	if (search.startsWith("?")) {
		search=search.substring(1);
	}
	search=search.split("&");
	for (var ii=0; search.length>ii; ++ii) {
		var next=search[ii];
		if ("debug=true"===next) {
			debug=true;
		}
		else if ("supreme=false"===next) {
			supreme.enabled=false;
		}
	}
}

initParameters();
init();

gl.loadBuffer=function(target, constructor, usage, data) {
	var buffer=gl.createBuffer();
	gl.bindBuffer(target, buffer);
	gl.bufferData(target, new constructor(data), usage);
	gl.bindBuffer(target, null);
	return buffer;
};

gl.loadProgram=function(
		programName, fragmentSource, vertexSource, attributes, uniforms) {
	var result={};
	result.vertex=gl.loadShader(
			programName+"-vertex", vertexSource, gl.VERTEX_SHADER);
	result.fragment=gl.loadShader(
			programName+"-fragment", fragmentSource, gl.FRAGMENT_SHADER);
	result.program=gl.createProgram();
	gl.attachShader(result.program, result.vertex);
	gl.attachShader(result.program, result.fragment);
	if (0<attributes.length) {
		gl.bindAttribLocation(result.program, 0, attributes[0]);
	}
	gl.linkProgram(result.program);
	var log=gl.getProgramInfoLog(result.program);
	if (""!==log.trim()) {
		console.log(log);
	}
	if (!gl.getProgramParameter(result.program, gl.LINK_STATUS)) {
		throw "program "+programName+" failed to link";
	}
	gl.validateProgram(result.program);
	log=gl.getProgramInfoLog(result.program);
	if (""!==log.trim()) {
		console.log(log);
	}
	if (!gl.getProgramParameter(result.program, gl.VALIDATE_STATUS)) {
		throw "program "+programName+" failed to validate";
	}
	result.delete=function() {
		gl.deleteProgram(result.program);
		gl.deleteShader(result.fragment);
		gl.deleteShader(result.vertex);
	};
	result.use=function() {
		gl.useProgram(result.program);
	};
	for (var ii=0; attributes.length>ii; ++ii) {
		var attribute=attributes[ii];
		var location=gl.getAttribLocation(result.program, attribute);
		if ((null===location)
				|| (0>location)) {
			throw "attrib location "+attribute+" not found";
		}
		result[attribute]=location;
	}
	for (var ii=0; uniforms.length>ii; ++ii) {
		var uniform=uniforms[ii];
		var location=gl.getUniformLocation(result.program, uniform);
		if ((null===location)
				|| (0>location)) {
			throw "uniform location "+uniform+" not found";
		}
		result[uniform]=location;
	}
	return result;
};

gl.loadShader=function(shaderName, shaderSource, shaderType) {
	var shader=gl.createShader(shaderType);
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);
	var log=gl.getShaderInfoLog(shader);
	if (""!==log.trim()) {
		console.log(log);
	}
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw "shader "+shaderName+" failed to compile";
	}
	return shader;
};

gl.loadTexture=function(image) {
	var texture=gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
	return texture;
};
