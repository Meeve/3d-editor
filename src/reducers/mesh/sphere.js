export default function sphere() {
   return {
      vertices: getVertices(),
      faces: getFaces(),
      colors: getColors(),

      vertexBuffer: null,
      faceBuffer: null,
      colorBuffer: null,

      x: 0,
      y: 0,
      z: 0,

      rx: 0,
      ry: 0,
      rz: 0
   };
}

function getVertices() {
   let vertices = [];

   for (let j = -7; j < 8; j++) {
      const scale = Math.cos(((Math.PI / 2) * j) / 8);
      for (let i = 0; i < 32; i++) {
         vertices = vertices.concat([
            Math.cos((Math.PI * i) / 16) * scale,
            Math.sin((Math.PI * j) / 16),
            Math.sin((Math.PI * i) / 16) * scale
         ]);
      }
   }

   return vertices;
}

function getFaces() {
   let faces = [];

   for (var j = 0; j < 14; j++) {
      const rowOffset = 32 * j;
      faces = faces.concat([0 + rowOffset, 31 + 32 + rowOffset, 31 + rowOffset]);
      faces = faces.concat([0 + rowOffset, 31 + 32 + rowOffset, 32 + rowOffset]);
      for (var i = 0; i < 31; i++) {
         const offset = i + rowOffset;
         faces = faces.concat([offset, offset + 1, offset + 32]);
         faces = faces.concat([offset + 1, offset + 32, offset + 32 + 1]);
      }
   }

   return faces;
}

function getColors() {
   let colors = [];
   for (var i = 0; i < 480; i++) {
      colors = colors.concat([0.46, 0.46, 0.48, 1.0]);
   }
   return colors;
}
