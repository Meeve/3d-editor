function getVertexSharedSource() {
   return (
      'attribute vec3 aPos;' +
      'attribute vec4 aCol;' +
      'attribute vec3 aVertexNormal;' +
      'uniform mat4 uNormalMatrix;' +
      'uniform mat4 uMVMatrix;' +
      'uniform mat4 uPMatrix;' +
      'uniform mat4 viewMatrix;' +
      'varying vec4 vColor;' +
      'varying highp vec3 vLighting;' +
      'void main(void ) {' +
      'gl_Position = uPMatrix * viewMatrix * uMVMatrix * vec4(aPos, 1.0);' +
      'vColor = aCol;' +
      `highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);` +
      '}'
   );
}

function getFragmentSharedSource() {
   return (
      'precision mediump float;' +
      'varying vec4 vColor;' +
      'varying highp vec3 vLighting;' +
      'void main(void) {' +
      'gl_FragColor = vColor * vec4(vLighting, 1);' +
      '}'
   );
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
      alert('Błąd inicjalizacji shaderów');
   }
   gl.useProgram(shaderProgram);

   return shaderProgram;
}
