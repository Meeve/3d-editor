import React, { Component } from 'react';
import { mat4 } from 'gl-matrix';
import { getShaderProgram } from '../../shaders/shaders.js';

export default class Canvas extends Component {
   constructor(props) {
      super(props);

      let mouseUpListener = window.addEventListener('mouseup', () => {
         this.mouseDown = false;
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
         xOffset: 0,
         yOffset: 0,
         mouseUpListener,
         distance: 14
      };
   }

   shouldComponentUpdate(prevProps) {
      return (
         this.lastRenderTime + 17 < new Date().getTime() ||
         prevProps.height != this.props.height ||
         prevProps.width != this.props.width
      );
   }

   componentDidMount() {
      //First render is to render canvas
      this.state.gl = document.getElementById(this.state.holder).getContext('webgl');
      this.state.gl.clearColor(0.22, 0.22, 0.22, 1.0);
      this.setPerspective();
      this.state.gl.enable(this.state.gl.DEPTH_TEST);
      this.initShaders();

      //Secound render is to render scene and pass children
      this.forceUpdate();
   }

   setPerspective() {
      mat4.perspective(this.state.projectionMatrix, 45, this.props.width / this.props.height, 0.1, 100.0);
   }

   componentWillUnmount() {
      window.removeEventListener('mouseup', this.state.mouseUpListener);
   }

   initShaders() {
      let program = getShaderProgram(this.state.gl);
      this.state.vertexPositionAttribute = this.state.gl.getAttribLocation(program, 'aPos');
      this.state.gl.enableVertexAttribArray(this.state.vertexPositionAttribute);

      this.state.vertexColorAttribute = this.state.gl.getAttribLocation(program, 'aCol');
      this.state.gl.enableVertexAttribArray(this.state.vertexColorAttribute);

      this.state.pMatrixUniform = this.state.gl.getUniformLocation(program, 'uPMatrix');
      this.state.mvMatrixUniform = this.state.gl.getUniformLocation(program, 'uMVMatrix');
      this.state.viewMatrixUniform = this.state.gl.getUniformLocation(program, 'viewMatrix');
   }

   drawScene() {
      this.state.gl.viewport(0, 0, this.props.width, this.props.height);
      this.state.gl.clear(this.state.gl.COLOR_BUFFER_BIT);

      this.state.gl.uniformMatrix4fv(this.state.pMatrixUniform, false, this.state.projectionMatrix);
      this.state.gl.uniformMatrix4fv(this.state.mvMatrixUniform, false, mat4.create());
      this.state.gl.uniformMatrix4fv(this.state.viewMatrixUniform, false, this.getViewMatrix());
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

   mouseMove(e) {
      if (this.mouseDown && this.state.isMouseIn) {
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

   getChildArray = children => {
      return _.map(children, child => {
         if (child.length !== undefined) {
            return this.getChildArray(child);
         } else {
            return React.cloneElement(child, {
               gl: this.state.gl,
               vertexColorAttribute: this.state.vertexColorAttribute,
               vertexPositionAttribute: this.state.vertexPositionAttribute,
               mvMatrixUniform: this.state.mvMatrixUniform,
               key: child.props.meshProperties.id
            });
         }
      });
   };

   componentDidUpdate(prevProps) {
      if (prevProps.height != this.props.height || prevProps.width != this.props.width) {
         this.setPerspective();
         this.forceUpdate();
      }
   }

   getMeshes = () => {
      let meshes = '';
      if (this.state.gl) {
         this.drawScene();
         meshes = _.flattenDeep(this.getChildArray(this.props.children));
      }
      return meshes;
   };

   render() {
      this.lastRenderTime = new Date().getTime();
      return (
         <div style={{ overflow: 'hidden' }} onWheel={this.onScroll}>
            <canvas
               onMouseDown={e => {
                  this.mouseDown = true;
                  this.setState({
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
               width={this.props.width + 'px'}
               height={this.props.height + 'px'}
            />
            {this.getMeshes()}
         </div>
      );
   }
}
