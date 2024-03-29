import React from 'react';
import ViewSelector from '../views/ViewSelector/ViewSelector';
import {
   CHANGE_COLUMN_SIZES,
   CHANGE_ROW_SIZES,
   REMOVE_COMPONENT,
   REMOVE_ROW,
   UPDATE_COMPONENTS,
   REMOVE_COLUMN,
   ADD_ROW,
   ADD_COLUMN,
   START_BOTTOM_UP_RESIZING,
   STOP_RESIZING,
   TRANSFORM_ROW_SIZES_BETWEEN_SIBLINGS,
   START_LEFT_RIGHT_RESIZING,
   TRANSFORM_COLUMN_SIZES_BETWEEN_SIBLINGS
} from '../actions/types';

function getDefaultPanelLayout() {
   const colSize = window.innerWidth / 3;
   const rowSize = window.innerHeight;
   return {
      components: [
         {
            element: ViewSelector,
            colStart: 1,
            colEnd: 4,
            rowStart: 1,
            rowEnd: 2,
            elementProperties: {selectedView: 'Info'}
         },

         {element: ViewSelector, colStart: 1, colEnd: 2, rowStart: 2, rowEnd: 3},
         {
            element: ViewSelector,
            colStart: 2,
            colEnd: 3,
            rowStart: 2,
            rowEnd: 3,
            elementProperties: {selectedView: 'Scene'}
         }, {
            element: ViewSelector,
            colStart: 3,
            colEnd: 4,
            rowStart: 2,
            rowEnd: 3,
            elementProperties: {selectedView: 'DopeSheet'}
         }, {
            element: ViewSelector,
            colStart: 1,
            colEnd: 4,
            rowStart: 3,
            rowEnd: 4,
            elementProperties: {selectedView: 'Timeline'}
         }

         // {element: ViewSelector, colStart: 1, colEnd: 3, rowStart: 3, rowEnd: 4},
         // {element: ViewSelector, colStart: 3, colEnd: 4, rowStart: 2, rowEnd: 5},
         // {element: ViewSelector, colStart: 1, colEnd: 3, rowStart: 4, rowEnd: 5},
         // {element: ViewSelector, colStart: 1, colEnd: 3, rowStart: 2, rowEnd: 3},

         // {element: ViewSelector, colStart: 4, colEnd: 5, rowStart: 1, rowEnd: 2},
         // {element: ViewSelector, colStart: 4, colEnd: 5, rowStart: 2, rowEnd: 3},
         // {element: ViewSelector, colStart: 4, colEnd: 5, rowStart: 3, rowEnd: 4},
         // {element: ViewSelector, colStart: 4, colEnd: 5, rowStart: 4, rowEnd: 5},
      ],
      columnSizes: [colSize + 600, colSize - 300, colSize - 300],
      rowSizes: [25, rowSize - 225, 200]
   };
}

export default (state = getDefaultPanelLayout(), action) => {
   switch (action.type) {
      case CHANGE_COLUMN_SIZES:
         return {
            ...state,
            columnSizes: action.payload
         };
      case CHANGE_ROW_SIZES:
         return {
            ...state,
            rowSizes: action.payload
         };
      case REMOVE_COMPONENT:
         return {
            ...state,
            components: _.filter(state.components, component => component != action.componentToDelete)
         };

      case REMOVE_ROW: {
         state.rowSizes[action.rowToRemove - 1] += state.rowSizes[action.rowToRemove];
         return {
            ...state,
            rowSizes: state.rowSizes.slice(0, action.rowToRemove).concat(state.rowSizes.slice(action.rowToRemove + 1))
         };
      }
      case UPDATE_COMPONENTS:
         return {
            ...state,
            components: action.components
         };
      case REMOVE_COLUMN: {
         state.columnSizes[action.columnToRemove - 1] += state.columnSizes[action.columnToRemove];
         return {
            ...state,
            columnSizes: state.columnSizes
               .slice(0, action.columnToRemove)
               .concat(state.columnSizes.slice(action.columnToRemove + 1))
         };
      }
      case ADD_ROW: {
         return {
            ...state,
            rowSizes: [...state.rowSizes.slice(0, action.index), 0, ...state.rowSizes.slice(action.index)]
         };
      }
      case ADD_COLUMN: {
         return {
            ...state,
            columnSizes: [...state.columnSizes.slice(0, action.index), 0, ...state.columnSizes.slice(action.index)]
         };
      }
      case START_BOTTOM_UP_RESIZING: {
         return {
            ...state,
            isUpDownResizing: true,
            yMouseClick: action.yMouseClick,
            activeRow: action.activeRow,
            prevActiveRowValue: state.rowSizes[action.activeRow],
            prevSibilingRowValue: state.rowSizes[action.activeRow + 1]
         };
      }
      case START_LEFT_RIGHT_RESIZING: {
         return {
            ...state,
            isLeftRightResizing: true,
            xMouseClick: action.xMouseClick,
            activeColumn: action.activeColumn,
            prevActiveColumnValue: state.columnSizes[action.activeColumn],
            prevSibilingColumnValue: state.columnSizes[action.activeColumn + 1]
         };
      }
      case STOP_RESIZING: {
         return {
            ...state,
            isUpDownResizing: false,
            isLeftRightResizing: false
         };
      }
      case TRANSFORM_ROW_SIZES_BETWEEN_SIBLINGS: {
         const currentOffset = action.yOffset - state.yMouseClick;
         const firstRowSize = state.prevActiveRowValue + currentOffset;
         const secondRowSize = state.prevSibilingRowValue - currentOffset;
         const activeColumnsHeight = state.prevActiveRowValue + state.prevSibilingRowValue;
         return {
            ...state,
            rowSizes: state.rowSizes
               .slice(0, state.activeRow)
               .concat(
                  [
                     Math.min(Math.max(25, firstRowSize), activeColumnsHeight - 25),
                     Math.min(Math.max(25, secondRowSize), activeColumnsHeight - 25)
                  ],
                  state.rowSizes.slice(state.activeRow + 2)
               )
         };
      }
      case TRANSFORM_COLUMN_SIZES_BETWEEN_SIBLINGS: {
         return {
            ...state,
            columnSizes: state.columnSizes
               .slice(0, state.activeColumn)
               .concat(
                  [
                     state.prevActiveColumnValue + action.xOffset - state.xMouseClick,
                     state.prevSibilingColumnValue - (action.xOffset - state.xMouseClick)
                  ],
                  state.columnSizes.slice(state.activeColumn + 2)
               )
         };
      }
   }
   return state;
};
