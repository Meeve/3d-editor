export function getGrid() {
   return {
      vertices: getGridVerticies(),
      colors: getGridColors(),
      vertexBuffer: null,
      colorBuffer: null
   };
}

let getGridVerticies = () => {
   const gridSize = 16;
   let grid = [];
   for (var i = -gridSize / 2; i < gridSize / 2 + 1; i++) {
      grid = grid.concat([i, 0, -8, i, 0, 8]);
      grid = grid.concat([8, 0, i, -8, 0, i]);
   }
   return grid;
};

let getGridColors = () => {
   let colors = [];
   for (var i = 0; i < 68; i++) {
      if (i === 34 || i === 35) {
         colors = colors.concat([0.08, 0.51, 0.08, 1.0]);
      } else if (i === 32 || i === 33) {
         colors = colors.concat([0.51, 0.08, 0.08, 1.0]);
      } else {
         colors = colors.concat([0.29, 0.29, 0.29, 1.0]);
      }
   }
   return colors;
};
