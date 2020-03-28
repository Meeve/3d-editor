import React, { Component } from 'react';
import Scene from '../Scene/Scene';
import Scroller from '../../components/Scroller';
import AddDropdown from '../Dropdowns/AddDropdown';
import ConnectedCanvas from '../Canvas/ConnectedCanvas';
import ConnectedTimeline from '../Timeline/ConnectedTimeline';
import Dropdown from '../../components/dropdown/Dropdown';
import { DopeSheet } from '../DopeSheet/DopeSheet';
import { DopeSheetStrip } from '../DopeSheet/DopeSheetStrip';
import Info from '../Info/Info';
import TimelineStrip from '../Timeline/TimelineStrip';

export default class ViewSelector extends Component {
   constructor(props) {
      super(props);

      this.state = {
         menuBarHeight: 25,
         views: {
            Canvas: {
               name: 'Canvas',
               getElement: () => (
                  <ConnectedCanvas height={this.props.componentHeight - 25} width={this.props.componentWidth} />
               )
            },
            Scene: {
               name: 'Scene',
               getElement: () => {
                  return (
                     <Scroller height={this.props.componentHeight - this.state.menuBarHeight}>
                        <Scene />
                     </Scroller>
                  );
               }
            },
            Timeline: {
               name: 'Timeline',
               getElement: () => <ConnectedTimeline />,
               getStrip: () => <TimelineStrip />
            },
            DopeSheet: {
               name: 'DopeSheet',
               getElement: () => <DopeSheet />,
               getStrip: () => <DopeSheetStrip />
            },
            Info: {
               name: 'Info',
               getElement: () => {
                  return (
                     <Scroller height={this.props.componentHeight - this.state.menuBarHeight}>
                        <Info />
                     </Scroller>
                  );
               }
            }
         },
         selectedView: this.props.elementProperties ? this.props.elementProperties.selectedView : 'Canvas'
      };
   }

   viewChanged(view) {
      this.setState({
         selectedView: view
      });
   }

   render() {
      let viewList = _.map(this.state.views, (view, key) => (
         <button className="dropdownButton" key={key} onClick={() => this.viewChanged(view.name)}>
            {view.name}
         </button>
      ));
      const currentView = this.state.views[this.state.selectedView];

      return (
         <div
            style={{
               display: 'grid',
               gridTemplateRows: '1fr 25px',
               overflow: 'hidden'
            }}>
            {currentView.getElement()}
            <div className="viewSelectorStrip">
               <Dropdown content={currentView.name} openAction="click">
                  {viewList}
               </Dropdown>
               <AddDropdown />
               {currentView.getStrip ? currentView.getStrip() : null}
            </div>
         </div>
      );
   }
}
