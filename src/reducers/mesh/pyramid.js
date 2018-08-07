export default function pyramid() {
    return {
        vertices: getVertices(),
        faces: getFaces(),
        colors: getColors(),

        vertexBuffer: null,
        faceBuffer: null,
        colorBuffer: null,

        x: 0,
        y: 1,
        z: 0,

        rx: 0,
        ry: 0,
        rz: 0
    }
};

function getVertices() {
    return [
        // Podstawa
        +1.0, 0, +1.0,
        -1.0, 0, +1.0,
        -1.0, 0, -1.0,
        +1.0, 0, -1.0,

        // Wierzchołek
        +0.0, +1.3, +0.0
    ];
}

function getFaces() {
    return [
        // Podstawa
        0, 1, 2, 2, 3, 0,

        // Ściany
        0, 1, 4,
        1, 2, 4,
        2, 3, 4,
        3, 0, 4,
    ];
}

function getColors() {
    return [
        // Podstawa
        0.5, 0.0, 0.0, 1.0,
        0.5, 0.0, 0.0, 1.0,
        0.5, 0.0, 0.0, 1.0,
        0.5, 0.0, 0.0, 1.0,

        // Wierzchołek
        0.5, 0.5, 0.5, 1.0,
    ];
}
