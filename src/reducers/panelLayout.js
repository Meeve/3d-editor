import React from 'react';
import ViewSelector from "../components/viewSelector";
import { CHANGE_COLUMN_SIZES, CHANGE_ROW_SIZES, REMOVE_COMPONENT, REMOVE_ROW, UPDATE_COMPONENTS, REMOVE_COLUMN } from "../actions/types";

function getDefaultPanelLayout() {
    const colSize = window.innerWidth / 4;
    const rowSize = window.innerHeight / 4;
    return {
        components: [
            {element: <ViewSelector/>, colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2},
            {element: <ViewSelector/>, colStart: 3, colEnd: 4, rowStart: 1, rowEnd: 2},
            {element: <ViewSelector/>, colStart: 2, colEnd: 3, rowStart: 1, rowEnd: 2},

            {element: <ViewSelector/>, colStart: 1, colEnd: 3, rowStart: 3, rowEnd: 4},
            {element: <ViewSelector/>, colStart: 3, colEnd: 4, rowStart: 2, rowEnd: 5},
            {element: <ViewSelector/>, colStart: 1, colEnd: 3, rowStart: 4, rowEnd: 5},
            {element: <ViewSelector/>, colStart: 1, colEnd: 3, rowStart: 2, rowEnd: 3, id: 'udpa'},

            {element: <ViewSelector/>, colStart: 4, colEnd: 5, rowStart: 1, rowEnd: 2},
            {element: <ViewSelector/>, colStart: 4, colEnd: 5, rowStart: 2, rowEnd: 3},
            {element: <ViewSelector/>, colStart: 4, colEnd: 5, rowStart: 3, rowEnd: 4},
            {element: <ViewSelector/>, colStart: 4, colEnd: 5, rowStart: 4, rowEnd: 5},
        ],
        columnSizes: [colSize, colSize, colSize, colSize],
        rowSizes: [rowSize, rowSize, rowSize, rowSize]
    };
}

export default (state = getDefaultPanelLayout(), action) => {
    switch(action.type) {
        case CHANGE_COLUMN_SIZES:
            return {
                ...state,
                columnSizes: action.payload
            }
        case CHANGE_ROW_SIZES: 
            return {
                ...state,
                rowSizes: action.payload
            }
        case REMOVE_COMPONENT: 
            return {
                ...state,
                components: _.filter(state.components, component => component != action.componentToDelete)
            }
            
        case REMOVE_ROW: {
            state.rowSizes[action.rowToRemove - 1] += state.rowSizes[action.rowToRemove];
            return {
                ...state,
                rowSizes: state.rowSizes.slice(0, action.rowToRemove).concat(state.rowSizes.slice(action.rowToRemove + 1))
            }
        }
        case UPDATE_COMPONENTS: 
            return {
                ...state,
                components: action.components
            }
        case REMOVE_COLUMN: {
            state.columnSizes[action.columnToRemove - 1] += state.columnSizes[action.columnToRemove];
            return {
                ...state,
                columnSizes: state.columnSizes.slice(0, action.columnToRemove).concat(state.columnSizes.slice(action.columnToRemove + 1))
            }
        }
    }
    return state;
}