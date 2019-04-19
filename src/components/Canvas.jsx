import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mat4 } from 'gl-matrix';
import { getShaderProgram } from '../shaders/shaders.js';
import { getGrid } from '../reducers/mesh/grid.js';

class Canvas extends Component {
   constructor(props) {
      super(props);

      let mouseUpListener = window.addEventListener('mouseup', () => {
         this.setState({
            mouseDown: false
         });
      });

      this.state = {
         holder: 'canvas' + Math.random(),
         gl: null,
         pMatrixUniform: null,
         mvMatrixUniform: null,
         viewMatrixUniform: null,
         vertexPositionAttribute: null,
         vertexColorAttribute: null,
         projectionMatrix: mat4.create(),
         models: [],
         xOffset: 0,
         yOffset: 0,
         drawSceneInterval: null,
         mouseUpListener,
         distance: 14,
         grid: getGrid()
      };
   }

   componentDidMount() {
      this.state.gl = document.getElementById(this.state.holder).getContext('webgl');
      this.state.gl.clearColor(0.22, 0.22, 0.22, 1.0);
      this.setPerspective();
      this.state.gl.enable(this.state.gl.DEPTH_TEST);
      this.initShaders();

      for (let model of this.state.models) {
         this.initModel(model);
      }

      this.state.grid.vertexBuffer = this.state.gl.createBuffer();
      this.state.gl.bindBuffer(this.state.gl.ARRAY_BUFFER, this.state.grid.vertexBuffer);
      this.state.gl.bufferData(
         this.state.gl.ARRAY_BUFFER,
         new Float32Array(this.state.grid.vertices),
         this.state.gl.STATIC_DRAW
      );

      this.state.grid.colorBuffer = this.state.gl.createBuffer();
      this.state.gl.bindBuffer(this.state.gl.ARRAY_BUFFER, this.state.grid.colorBuffer);
      this.state.gl.bufferData(
         this.state.gl.ARRAY_BUFFER,
         new Float32Array(this.state.grid.colors),
         this.state.gl.STATIC_DRAW
      );

      let interval = setInterval(() => {
         this.drawScene();

         this.state.gl.uniformMatrix4fv(this.state.pMatrixUniform, false, this.state.projectionMatrix);
         this.state.gl.uniformMatrix4fv(this.state.mvMatrixUniform, false, mat4.create());
         this.state.gl.uniformMatrix4fv(this.state.viewMatrixUniform, false, this.getViewMatrix());

         this.state.gl.bindBuffer(this.state.gl.ARRAY_BUFFER, this.state.grid.vertexBuffer);
         this.state.gl.vertexAttribPointer(this.state.vertexPositionAttribute, 3, this.state.gl.FLOAT, false, 0, 0);

         this.state.gl.bindBuffer(this.state.gl.ARRAY_BUFFER, this.state.grid.colorBuffer);
         this.state.gl.vertexAttribPointer(this.state.vertexColorAttribute, 4, this.state.gl.FLOAT, false, 0, 0);

         this.state.gl.drawArrays(this.state.gl.LINES, 0, this.state.grid.vertices.length / 3);
      }, 1000 / 60);

      this.setState({
         drawSceneInterval: interval
      });
   }

   setPerspective() {
      let width = this.getWidth();
      let height = this.getHeight();
      mat4.perspective(this.state.projectionMatrix, 45, width / height, 0.1, 100.0);
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
      this.state.vertexPositionAttribute = this.state.gl.getAttribLocation(program, 'aPos'); // TODO
      this.state.gl.enableVertexAttribArray(this.state.vertexPositionAttribute);

      this.state.vertexColorAttribute = this.state.gl.getAttribLocation(program, 'aCol'); // TODO
      this.state.gl.enableVertexAttribArray(this.state.vertexColorAttribute);

      this.state.pMatrixUniform = this.state.gl.getUniformLocation(program, 'uPMatrix'); // TODO
      this.state.mvMatrixUniform = this.state.gl.getUniformLocation(program, 'uMVMatrix'); // TODO
      this.state.viewMatrixUniform = this.state.gl.getUniformLocation(program, 'viewMatrix');
   }

   initModel(model) {
      model.vertexBuffer = this.state.gl.createBuffer();
      this.state.gl.bindBuffer(this.state.gl.ARRAY_BUFFER, model.vertexBuffer);
      this.state.gl.bufferData(this.state.gl.ARRAY_BUFFER, new Float32Array(model.vertices), this.state.gl.STATIC_DRAW);

      model.faceBuffer = this.state.gl.createBuffer();
      this.state.gl.bindBuffer(this.state.gl.ELEMENT_ARRAY_BUFFER, model.faceBuffer);
      this.state.gl.bufferData(
         this.state.gl.ELEMENT_ARRAY_BUFFER,
         new Uint16Array(model.faces),
         this.state.gl.STATIC_DRAW
      );

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

   getViewMatrix = () => {
      let helper = mat4.create();
      let viewMatrix = mat4.create();
      let rotationY = mat4.create();
      mat4.fromYRotation(rotationY, this.state.xOffset);

      let rotationX = mat4.create();
      mat4.fromXRotation(rotationX, this.state.yOffset);

      let translationHelper = mat4.create();
      mat4.fromTranslation(translationHelper, [0, 0, -this.state.distance]);

      helper = mat4.create();
      mat4.multiply(helper, translationHelper, rotationX);
      viewMatrix = helper;

      helper = mat4.create();
      mat4.multiply(helper, viewMatrix, rotationY);
      viewMatrix = helper;

      return viewMatrix;
   };

   getModelMatrix = model => {
      let modelViewMatrix = mat4.create();
      let helper = mat4.create();

      mat4.translate(helper, modelViewMatrix, [model.x, model.y, model.z]);
      modelViewMatrix = helper;

      helper = mat4.create();
      mat4.rotateX(helper, modelViewMatrix, model.rx);
      modelViewMatrix = helper;

      helper = mat4.create();
      mat4.rotateY(helper, modelViewMatrix, model.ry);
      modelViewMatrix = helper;

      helper = mat4.create();
      mat4.rotateZ(helper, modelViewMatrix, model.rz);
      modelViewMatrix = helper;

      return modelViewMatrix;
   };

   drawModel(model) {
      this.state.gl.uniformMatrix4fv(this.state.pMatrixUniform, false, this.state.projectionMatrix);
      this.state.gl.uniformMatrix4fv(this.state.mvMatrixUniform, false, this.getModelMatrix(model));
      this.state.gl.uniformMatrix4fv(this.state.viewMatrixUniform, false, this.getViewMatrix());

      this.state.gl.bindBuffer(this.state.gl.ARRAY_BUFFER, model.vertexBuffer);
      this.state.gl.vertexAttribPointer(this.state.vertexPositionAttribute, 3, this.state.gl.FLOAT, false, 0, 0);

      this.state.gl.bindBuffer(this.state.gl.ARRAY_BUFFER, model.colorBuffer);
      this.state.gl.vertexAttribPointer(this.state.vertexColorAttribute, 4, this.state.gl.FLOAT, false, 0, 0);

      this.state.gl.bindBuffer(this.state.gl.ELEMENT_ARRAY_BUFFER, model.faceBuffer);
      this.state.gl.drawElements(this.state.gl.TRIANGLES, model.faces.length, this.state.gl.UNSIGNED_SHORT, 0);

      this.state.gl.drawArrays(this.state.gl.LINES, 0, model.vertices.length / 3);
   }

   mouseMove(e) {
      if (this.state.mouseDown && this.state.isMouseIn) {
         this.setState({
            xOffset: this.state.prevXValue + (+e.pageX - this.state.clickedX) / 100,
            yOffset: this.state.prevYValue + (+e.pageY - this.state.clickedY) / 100
         });
      }
   }

   onScroll = event => {
      this.setState({
         distance: this.state.distance + event.deltaY / 100
      });
   };

   render() {
      this.setPerspective(); // TODO change this for event "onColumnResize"
      return (
         <div ref={ref => (this.canvas = ref)} style={{ overflow: 'hidden' }} onWheel={this.onScroll}>
            <canvas
               onMouseDown={e => {
                  this.setState({
                     mouseDown: true,
                     clickedX: e.pageX,
                     prevXValue: this.state.xOffset,
                     clickedY: e.pageY,
                     prevYValue: this.state.yOffset
                  });
               }}
               onMouseMove={this.mouseMove.bind(this)}
               onMouseLeave={e => this.setState({ isMouseIn: false })}
               onMouseEnter={e => this.setState({ isMouseIn: true })}
               id={this.state.holder}
               width={this.getWidth() + 'px'}
               height={this.getHeight() + 'px'}
            />
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
   };
}

export default connect(mapStateToProps)(Canvas);
