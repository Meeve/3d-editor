export default function plane() {
   return {
      vertices: getVertices(),
      faces: getFaces(),
      colors: getColors(),

      x: 0,
      y: 0,
      z: 0,

      rx: 0,
      ry: 0,
      rz: 0
   };
}

// prettier-ignore
function getVertices() {
   return [+1.0, 0, +1.0, +1.0, 0, -1.0, -1.0, 0, -1.0, -1.0, 0, +1.0];
}

// prettier-ignore
function getFaces() {
   return [0, 1, 2, 2, 3, 0];
}

// prettier-ignore
function getColors() {
   return [0.7, 0.0, 0.0, 1.0, 0.9, 0.9, 0.9, 1.0, 0.7, 0.0, 0.0, 1.0, 0.9, 0.9, 0.9, 1.0];
}
