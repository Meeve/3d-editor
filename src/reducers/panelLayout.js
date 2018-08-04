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
        columns: [640, 640, 640],
        rows: [316, 316, 315]
    };
}

export default (state = getDefaultPanelLayout(), action) => {
    return state;
}