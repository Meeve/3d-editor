function getCube() {
    return {
        vertices: [
            // Przód
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

            // Tył
            -1.0, -1.0, -1.0, -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Góra
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Dół
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

            // Prawo
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Lewo
            -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
        ],
        // Dwa trójkąty dla każdej ze ścian
        faces: [
            0, 1, 2, 0, 2, 3, // Przednia ściana
            4, 5, 6, 4, 6, 7, // Tylna ściana
            8, 9, 10, 8, 10, 11, // Górna ściana
            12, 13, 14, 12, 14, 15, // Dolna ściana
            16, 17, 18, 16, 18, 19, // Prawa ściana
            20, 21, 22, 20, 22, 23 // Lewa ściana
        ],
        colors: [
            // Przód
            0.5, 0.0, 0.0, 1.0,
            0.5, 0.0, 0.0, 1.0,
            0.5, 0.0, 0.0, 1.0,
            0.5, 0.0, 0.0, 1.0,

            // Tył
            0.0, 0.5, 0.0, 1.0,
            0.0, 0.5, 0.0, 1.0,
            0.0, 0.5, 0.0, 1.0,
            0.0, 0.5, 0.0, 1.0,

            // Góra
            0.0, 0.0, 0.5, 1.0,
            0.0, 0.0, 0.5, 1.0,
            0.0, 0.0, 0.5, 1.0,
            0.0, 0.0, 0.5, 1.0,

            // Dół
            0.5, 0.0, 0.5, 1.0,
            0.5, 0.0, 0.5, 1.0,
            0.5, 0.0, 0.5, 1.0,
            0.5, 0.0, 0.5, 1.0,

            // Prawo
            0.5, 5.0, 0.0, 1.0,
            0.5, 5.0, 0.0, 1.0,
            0.5, 5.0, 0.0, 1.0,
            0.5, 5.0, 0.0, 1.0,

            // Lewo
            0.5, 0.5, 0.5, 1.0,
            0.5, 0.5, 0.5, 1.0,
            0.5, 0.5, 0.5, 1.0,
            0.5, 0.5, 0.5, 1.0,
        ],

        vertexBuffer: null,
        faceBuffer: null,
        colorBuffer: null,

        x: 1,
        y: 0,
        z: 1,

        rx: 0,
        ry: 0,
        rz: 0
    }
}

export default (state = {}, action) => {
    switch(action.type) {
        case 'addCube': {
            let cube = getCube();
            cube.id = Math.random();
            return {[cube.id]: cube, ...state};
        } break;
        case 'changeMeshProp': {
            return Object.assign({}, state, {
                [action.payload.id]: {
                    ...state[action.payload.id] ,
                    [action.payload.prop]: action.payload.value
                }
            });
        }
    } 
    return state;
}