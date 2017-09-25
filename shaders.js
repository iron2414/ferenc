var amplitude={"dirty": true};
var color={};
var texture={};

amplitude.fragment=`
precision mediump float;

uniform highp float uTime;
varying vec3 vCoordinates;

const float PI=3.1415926535897932384626433832795;

float dipole(float amplitude, float frequency, vec3 normal, vec3 position,
		float shift, float wavelength,
		float switchShift, float switchOn,
		float switchOff, float switchSpeed) {
$isotropic
$switch
	return result
			*(1.0-abs(dot(normal, relative/distance)));
}

float isotropic(float amplitude, float frequency, vec3 position, float shift,
		float wavelength,
		float switchShift, float switchOn,
		float switchOff, float switchSpeed) {
$isotropic
$switch
	return result;
}

float spot(float amplitude, float angle, float frequency, vec3 normal,
		vec3 position, float shift, float wavelength,
		float switchShift, float switchOn,
		float switchOff, float switchSpeed) {
$isotropic
$switch
	return result
			*cos(clamp(PI*acos(dot(normal, relative/distance))/angle, 0.0, 0.5*PI));
}

void main(void) {
	float amplitude=0.0;
$amplitude
	gl_FragColor=vec4(amplitude, -amplitude, 0.0, 1.0);
}
`;

amplitude.isotropic=`
	vec3 relative=vCoordinates-position;
	float distance=length(relative);
	float sourceTime=uTime-distance/(wavelength*frequency);
	float result
			=amplitude*cos(2.0*PI*frequency*sourceTime+shift)
			/(distance*distance);
`;

amplitude.switch=`
	float switchTime=mod(sourceTime-switchShift, switchOn+switchOff);
	float switchOffSign=sign(switchTime-switchOn);
	float switchOffSwitch=0.5*(switchOffSign+1.0);
	float switchOnSwitch=1.0-switchOffSwitch;
	highp float switchTime2=switchTime-switchOffSwitch*switchOn;
	result*=switchOnSwitch+switchOffSign*exp(-switchSpeed*switchTime2);
`;

amplitude.vertex=`
precision mediump float;

attribute vec3 aCoordinates;
uniform mat4 uProjectionMatrix;
varying vec3 vCoordinates;

void main(void) {
	vCoordinates=aCoordinates;
	gl_Position=uProjectionMatrix*vec4(aCoordinates, 1.0);
}
`;

color.fragment=`
precision mediump float;

varying lowp vec3 vColors;

void main(void) {
	gl_FragColor=vec4(vColors, 1.0);
}
`;

color.vertex=`
precision mediump float;

attribute lowp vec3 aColors;
attribute vec3 aCoordinates;
uniform mat4 uProjectionMatrix;
varying lowp vec3 vColors;

void main(void) {
	vColors=aColors;
	gl_Position=uProjectionMatrix*vec4(aCoordinates, 1.0);
}
`;

texture.fragment=`
precision mediump float;

uniform sampler2D uTextureUnit;
varying vec2 vTextureCoordinates;

void main(void) {
	gl_FragColor=texture2D(uTextureUnit, vTextureCoordinates);
}
`;

texture.vertex=`
precision mediump float;

attribute vec3 aCoordinates;
attribute vec2 aTextureCoordinates;
uniform mat4 uProjectionMatrix;
varying vec2 vTextureCoordinates;

void main(void) {
	vTextureCoordinates=aTextureCoordinates;
	gl_Position=uProjectionMatrix*vec4(aCoordinates, 1.0);
}
`;
