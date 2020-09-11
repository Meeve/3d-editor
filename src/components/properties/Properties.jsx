import React, { Component } from 'react';
import Texture from './Texture';
import Material from './Material';
import Render from './Render';

export default class Properties extends Component {
   state = {
      chosenProperties: '',
   };

   updateChosenProperties = (properties) => {
      this.setState({
         chosenProperties: properties,
      });
   };

   render() {
      return (
         <div>
            <div className="properties-container">
               <div className="first-properties" onClick={() => this.updateChosenProperties('render')}></div>
               <div className="second-properties" onClick={() => this.updateChosenProperties('material')}></div>
               <div className="third-properties" onClick={() => this.updateChosenProperties('texture')}></div>
            </div>
            <div className="chosen-properties">
               {this.state.chosenProperties === 'texture' ? <Texture /> : null}
               {this.state.chosenProperties === 'material' ? <Material /> : null}
               {this.state.chosenProperties === 'render' ? <Render /> : null}
            </div>
         </div>
      );
   }
}
