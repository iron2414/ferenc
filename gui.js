//Linear
function showLinear() {
    var linearGui = document.getElementById('linearArrayGui');
    linearGui.style.display
			= linearGui.style.display === 'none' ? 'table' : 'none';
}

function showShiftValue(newValue) {
    document.getElementById("linearShiftText").value = newValue;
}

function showShiftSliderValue(newValue) {
    document.getElementById("linearShift").value = newValue;
}

function updateRadiatorsTextAndCompile() {
    var n = document.getElementById('linearQuanity').value;
    var d = document.getElementById('linearDistance').value;
    var angle = document.getElementById('linearAngle').value;
    var shift = document.getElementById('linearShift').value;
    var freq = document.getElementById('linearFrequency').value;
    var wave = document.getElementById('linearWaveLength').value;
    var type = document.getElementById('linearType').value;
    var amplitude = 1 / n;
    var currPos = 0 - (Math.floor(n / 2) * d);

    if (type === 'spot') {
        var normal = '[0.0, 0.0, -1.0]';
    } else {
        var normal = '[0.0, 1.0, 0.0]';
    }

    if (n === '' || d === '' || shift === '' || freq === '' || wave === '') {
        alert('Form error');
        return;
    }

    var text = '';
    for (var i = 0; i < n; i++) {
        var currShift = (+i + 1) * +shift;
        currShift = degToRad(currShift);
        text += '{"amplitude": ' + amplitude + ',\n' +
            '"angle": ' + angle + ',\n' +
            '"frequency": ' + freq + ',\n' +
            '"normal": ' + normal + ',\n' +
            '"position": [' + currPos + ', 0.0, 0.0],\n' +
            '"shift":' + currShift + ',\n' +
            '"type": "' + type + '",\n' +
            '"wavelength": ' + wave + ',\n' +
			'"switchShift": '+0.0+',\n' +
			'"switchOn": '+10.0+',\n' +
			'"switchOff": '+3.0+',\n' +
			'"switchSpeed": '+10.0+'\n}, \n\n';

        currPos = +currPos + +d;
    }

    document.getElementById('radiatorsText').value = text;
    recompile();
}


//Matrix
function showMatrix() {
    var matrixGui = document.getElementById('matrixArrayGui');
    matrixGui.style.display
			= matrixGui.style.display === 'none' ? 'table' : 'none';
}

function showShiftSliderXValue(newValue) {
    document.getElementById("matrixShiftX").value = newValue;
}

function showShiftSliderYValue(newValue) {
    document.getElementById("matrixShiftY").value = newValue;
}

function showShiftXValue(newValue) {
    document.getElementById("matrixShiftXText").value = newValue;
}

function showShiftYValue(newValue) {
    document.getElementById("matrixShiftYText").value = newValue;
}

function updateRadiatorsTextAndCompileMatrix() {
    var n = document.getElementById('matrixRow').value;
    var m = document.getElementById('matrixColumn').value;
    var columnD = document.getElementById('matrixDistanceX').value;
    var rowD = document.getElementById('matrixDistanceY').value;
    var angle = document.getElementById('matrixAngle').value;
    var freq = document.getElementById('matrixFrequency').value;
    var wave = document.getElementById('matrixWaveLength').value;
    var type = document.getElementById('matrixType').value;
    var shiftX = document.getElementById('matrixShiftX').value;
    var shiftY = document.getElementById('matrixShiftY').value;

    var rotateNormal = false;
    if (type === "dipole90") {
        rotateNormal = true;
        type = "dipole";
    }

    var amplitude = 1 / (n * m);
    var currPosX = 0 - (Math.floor(n / 2) * columnD);
    var currPosY = 0 - (Math.floor(m / 2) * rowD);

    if (type === 'spot') {
        var normal = '[0.0, 0.0, -1.0]';
    } else {
        var normal = '[0.0, 1.0, 0.0]';
    }

    if (n === '' || m === '' || columnD === '' || rowD === '' || shiftX === ''
			|| shiftY === '' || freq === '' || wave === '') {
        alert('Form error');
        return;
    }

    var text = '';
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
            if (rotateNormal) {
                normal = (((+i + 1) + (+j + 1)) % 2) === 0
						? '[0.0, 1.0, 0.0]' : '[1.0, 0.0, 0.0]';
            }
            var currShift = (+i + 1) * +shiftX + (+j + 1) * shiftY;
            currShift = degToRad(currShift);
            text += '{"amplitude": ' + amplitude + ',\n' +
                '"angle": ' + angle + ',\n' +
                '"frequency": ' + freq + ',\n' +
                '"normal": ' + normal + ',\n' +
                '"position": [' + currPosX + ', ' + currPosY + ', 0.0],\n' +
                '"shift":' + currShift + ',\n' +
                '"type": "' + type + '",\n' +
                '"wavelength": ' + wave + ',\n' +
				'"switchShift": '+0.0+',\n' +
				'"switchOn": '+10.0+',\n' +
				'"switchOff": '+3.0+',\n' +
				'"switchSpeed": '+10.0+'\n}, \n\n';
            currPosY = +currPosY + +rowD;
        }
        currPosY = 0 - (Math.floor(m / 2) * rowD);
        currPosX = +currPosX + +rowD;
    }

    document.getElementById('radiatorsText').value = text;
    recompile();
}

//util
function degToRad(deg) {
    return deg * Math.PI / 180;
}
