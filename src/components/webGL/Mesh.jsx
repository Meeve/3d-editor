import React from 'react';
import { mat4 } from 'gl-matrix';
import _ from 'lodash';

export default class Mesh extends React.Component {
   constructor(props) {
      super(props);
      this.initModel(this.props.meshProperties);
   }

   initModel(model) {
      const vertexBuffer = this.props.gl.createBuffer();
      this.props.gl.bindBuffer(this.props.gl.ARRAY_BUFFER, vertexBuffer);
      this.props.gl.bufferData(this.props.gl.ARRAY_BUFFER, new Float32Array(model.vertices), this.props.gl.STATIC_DRAW);

      let faceBuffer = null;
      if (model.faces !== undefined) {
         faceBuffer = this.props.gl.createBuffer();
         this.props.gl.bindBuffer(this.props.gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
         this.props.gl.bufferData(
            this.props.gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(model.faces),
            this.props.gl.STATIC_DRAW
         );
      }

      const colorBuffer = this.props.gl.createBuffer();
      this.props.gl.bindBuffer(this.props.gl.ARRAY_BUFFER, colorBuffer);
      this.props.gl.bufferData(this.props.gl.ARRAY_BUFFER, new Float32Array(model.colors), this.props.gl.STATIC_DRAW);

      this.state = { vertexBuffer, faceBuffer, colorBuffer };
   }

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
      this.props.gl.uniformMatrix4fv(this.props.mvMatrixUniform, false, this.getModelMatrix(model));

      this.props.gl.bindBuffer(this.props.gl.ARRAY_BUFFER, this.state.vertexBuffer);
      this.props.gl.vertexAttribPointer(this.props.vertexPositionAttribute, 3, this.props.gl.FLOAT, false, 0, 0);

      this.props.gl.bindBuffer(this.props.gl.ARRAY_BUFFER, this.state.colorBuffer);
      this.props.gl.vertexAttribPointer(this.props.vertexColorAttribute, 4, this.props.gl.FLOAT, false, 0, 0);

      if (model.faces) {
         this.props.gl.bindBuffer(this.props.gl.ELEMENT_ARRAY_BUFFER, this.state.faceBuffer);
         this.props.gl.drawElements(this.props.gl.TRIANGLES, model.faces.length, this.props.gl.UNSIGNED_SHORT, 0);
      } else {
         this.props.gl.drawArrays(this.props.gl.LINES, 0, model.vertices.length / 3);
      }
   }

   render() {
      this.drawModel(this.props.meshProperties);
      return null;
   }
}
