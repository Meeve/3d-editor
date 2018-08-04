
function getVertexSharedSource() {
    return "attribute vec3 aPos;" +
        "attribute vec4 aCol;" +

        "uniform mat4 uMVMatrix;" +
        "uniform mat4 uPMatrix;" +

        "varying vec4 vColor;" +

        "void main(void ) {" +
            "gl_Position = uPMatrix * uMVMatrix * vec4(aPos, 1.0);" +
            "vColor = aCol;" +
        "}";
}

function getFragmentSharedSource () {
    return "precision mediump float;" +
        "varying vec4 vColor;" +

        "void main(void) {" +
            "gl_FragColor = vColor;" +
        "}";
}
            
function createShader(shaderType, source, gl) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
    }
    return shader;
}

export function getShaderProgram(gl) {
    var fragmentShader = createShader(gl.FRAGMENT_SHADER, getFragmentSharedSource(), gl);
    var vertexShader = createShader(gl.VERTEX_SHADER, getVertexSharedSource(), gl);

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Błąd inicjalizacji shaderów");
    }
    gl.useProgram(shaderProgram);

    return shaderProgram;
}