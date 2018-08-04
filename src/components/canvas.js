import React, {Component} from 'react';
import {connect} from 'react-redux';
import {mat4} from 'gl-matrix';
import {getShaderProgram} from '../shaders/shaders.js';

class Canvas extends Component {
    constructor(props) {
        super(props);

        let mouseUpListener = window.addEventListener('mouseup', () => {
            this.setState({
                mouseDown: false
            });
        });

        this.state = {
            holder: "canvas" + Math.random(),
            gl: null,
            pMatrixUniform: null,
            mvMatrixUniform: null,
            vertexPositionAttribute: null,
            vertexColorAttribute: null,
            projectionMatrix: mat4.create(),
            models: [],
            timer: 0,
            xOffset: 0,
            drawSceneInterval: null,
            mouseUpListener
        };
    }

    componentDidMount() {
        this.state.gl = document.getElementById(this.state.holder).getContext("webgl");
        this.state.gl.clearColor(0.15, 0.15, 0.15, 1.0);

        let width = this.getWidth();
        let height = this.getHeight();
        mat4.perspective(this.state.projectionMatrix, 45, width / height, 0.1, 100.0);
        this.state.gl.enable(this.state.gl.DEPTH_TEST);
        this.initShaders();

        for (let model of this.state.models) {
            this.initModel(model);
        }
        let interval = setInterval(() => {
            this.setState({
                timer: this.state.timer + 0.01
            });
            this.drawScene();
        }, 10);

        this.setState({
            drawSceneInterval: interval
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.drawSceneInterval);
        window.removeEventListener('mouseup', this.state.mouseUpListener);
    }

    componentWillReceiveProps(nextProps) {
        let models = [];
        for (let i in nextProps.meshes) {
            let model = Object.assign([], nextProps.meshes[i]);
            this.initModel(model);
            models.push(model);
        }
        this.setState({
            models: models
        });
        return true;
    }

    initShaders() {
        let program = getShaderProgram(this.state.gl);
        this.state.vertexPositionAttribute = this.state.gl.getAttribLocation(program, "aPos"); // TODO
        this.state.gl.enableVertexAttribArray(this.state.vertexPositionAttribute);

        this.state.vertexColorAttribute = this.state.gl.getAttribLocation(program, "aCol"); // TODO
        this.state.gl.enableVertexAttribArray(this.state.vertexColorAttribute);

        this.state.pMatrixUniform = this.state.gl.getUniformLocation(program, "uPMatrix");  // TODO
        this.state.mvMatrixUniform = this.state.gl.getUniformLocation(program, "uMVMatrix");  // TODO
    }

    initModel(model) {
        model.vertexBuffer = this.state.gl.createBuffer();
        this.state.gl.bindBuffer(this.state.gl.ARRAY_BUFFER, model.vertexBuffer);
        this.state.gl.bufferData(this.state.gl.ARRAY_BUFFER, new Float32Array(model.vertices), this.state.gl.STATIC_DRAW);

        model.faceBuffer = this.state.gl.createBuffer();
        this.state.gl.bindBuffer(this.state.gl.ELEMENT_ARRAY_BUFFER, model.faceBuffer);
        this.state.gl.bufferData(this.state.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.faces), this.state.gl.STATIC_DRAW);

        model.colorBuffer = this.state.gl.createBuffer();
        this.state.gl.bindBuffer(this.state.gl.ARRAY_BUFFER, model.colorBuffer);
        this.state.gl.bufferData(this.state.gl.ARRAY_BUFFER, new Float32Array(model.colors), this.state.gl.STATIC_DRAW);
    }

    drawScene() {
        this.state.gl.viewport(0, 0, this.getWidth(), this.getHeight());
        this.state.gl.clear(this.state.gl.COLOR_BUFFER_BIT | this.state.gl.DEPTH_BUFFER_BIT);

        for (let model of this.state.models) {
            this.drawModel(model);
        }
    }

    drawModel(model) {
        let modelViewMatrix = mat4.create();
        let helper = mat4.create();


        helper = mat4.create();
        mat4.translate(helper, modelViewMatrix, [0, -3, -14]);
        modelViewMatrix = helper;

        helper = mat4.create();
        mat4.rotateY(helper, modelViewMatrix, this.state.xOffset);
        modelViewMatrix = helper;

        mat4.translate(helper, modelViewMatrix, [model.x, model.y, model.z]);
        modelViewMatrix = helper;


        if (model.rx) {
            helper = mat4.create();
            mat4.rotateX(helper, modelViewMatrix, model.rx);
            modelViewMatrix = helper;
        }
        if (model.ry) {
            helper = mat4.create();
            mat4.rotateY(helper, modelViewMatrix, model.ry);
            modelViewMatrix = helper;
        }
        if (model.rz) {
            helper = mat4.create();
            mat4.rotateZ(helper, modelViewMatrix, model.rz);
            modelViewMatrix = helper;
        }


        this.state.gl.uniformMatrix4fv(this.state.pMatrixUniform, false, this.state.projectionMatrix);
        this.state.gl.uniformMatrix4fv(this.state.mvMatrixUniform, false, modelViewMatrix);

        this.state.gl.bindBuffer(this.state.gl.ARRAY_BUFFER, model.vertexBuffer);
        this.state.gl.vertexAttribPointer(this.state.vertexPositionAttribute, 3, this.state.gl.FLOAT, false, 0, 0);

        this.state.gl.bindBuffer(this.state.gl.ARRAY_BUFFER, model.colorBuffer);
        this.state.gl.vertexAttribPointer(this.state.vertexColorAttribute, 4, this.state.gl.FLOAT, false, 0, 0)

        this.state.gl.bindBuffer(this.state.gl.ELEMENT_ARRAY_BUFFER, model.faceBuffer);
        this.state.gl.drawElements(this.state.gl.TRIANGLES, model.faces.length, this.state.gl.UNSIGNED_SHORT, 0);
    }

    mouseMove(e) {
        if (this.state.mouseDown && this.state.isMouseIn) {
            let offset = this.state.prevXValue + (+e.pageX - this.state.clickedX) / 100;
            this.setState({
                xOffset: offset
            });
        }
    }

    render() {

        return (
            <div ref={(ref) => this.canvas = ref} style={{overflow: "hidden"}}>
                <canvas
                    onMouseDown={e => {
                        this.setState({mouseDown: true, clickedX: e.pageX, prevXValue: this.state.xOffset});
                    }}
                    onMouseMove={this.mouseMove.bind(this)}
                    onMouseLeave={e => this.setState({isMouseIn: false})}
                    onMouseEnter={e => this.setState({isMouseIn: true})}
                    id={this.state.holder}
                    width={this.getWidth() + "px"}
                    height={this.getHeight() + "px"}></canvas>
            </div>
        );
    }

    getHeight() {
        return this.canvas ? this.canvas.offsetHeight : 0;
    }

    getWidth() {
        return this.canvas ? this.canvas.offsetWidth : 0;
    }
}

function mapStateToProps(state) {
    return {
        meshes: state.meshes
    }
}

export default connect(mapStateToProps)(Canvas);