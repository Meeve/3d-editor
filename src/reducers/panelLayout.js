import React from 'react';
import ViewSelector from "../components/viewSelector";
import { CHANGE_COLUMN_SIZES, CHANGE_ROW_SIZES } from "../actions/types";

function getDefaultPanelLayout() {
    return {
        components: [
            {element: <ViewSelector/>, colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2},
            {element: <ViewSelector/>, colStart: 2, colEnd: 4, rowStart: 1, rowEnd: 2},
            {element: <ViewSelector/>, colStart: 1, colEnd: 2, rowStart: 2, rowEnd: 4},

            {element: <ViewSelector/>, colStart: 2, colEnd: 3, rowStart: 2, rowEnd: 3},
            {element: <ViewSelector/>, colStart: 3, colEnd: 4, rowStart: 2, rowEnd: 4},
            {element: <ViewSelector/>, colStart: 2, colEnd: 3, rowStart: 3, rowEnd: 4}
        ],
        columnSizes: [640, 640, 640],
        rowSizes: [316, 316, 315]
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
    }
    return state;
}