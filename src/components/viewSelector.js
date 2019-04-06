import React, {Component} from 'react';
import Canvas from './canvas.js';
import Scene from './scene.js';
import Dropdown from "./dropdown/Dropdown";
import Scroller from "./Scroller";

export default class ViewSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuBarHeight: 25,
            views: {
                Canvas: {
                    name: "Canvas", 
                    getElement: () => <Canvas/>
                },
                Scene: {
                    name: "Scene",
                    getElement: () => {
                        return (<Scroller height={ this.props.componentHeight - this.state.menuBarHeight } >
                            <Scene /> 
                        </Scroller>);
                    }
                },
            },
            selectedView: "Canvas"
        };
    }

    viewChanged(event) {
        this.setState({
            selectedView: event.target.value
        });
    }

    render() {
        let viewList = _.map(this.state.views, (view, key) => <option key={key}> {view.name} </option>);
        const currentView = this.state.views[this.state.selectedView].getElement()
        
        return (
            <div style={{display: "grid", gridTemplateRows: "1fr 25px", overflow: "hidden"}}>
                {currentView}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <select value={this.state.selectedView.name} onChange={this.viewChanged.bind(this)}>
                        {viewList}
                    </select>
                    <Dropdown content="outer" openAction="click">
                        <Dropdown content="inner" direction="right">
                            <Dropdown content="inner" direction="right">
                                <Dropdown content="inner" direction="right">
                                    <Dropdown content="inner" direction="right">
                                        
                                    </Dropdown>
                                    <Dropdown content="inner" direction="right">
                                        
                                    </Dropdown>
                                    <Dropdown content="inner" direction="right">
                                        
                                    </Dropdown>
                                </Dropdown>
                            <span>DUPA</span>
                            <span>saddsa</span>
                            <span>DUPA</span>
                            <span>saddsa</span>
                            </Dropdown>
                            <span>DUPA</span>
                            <span>saddsa</span>
                        </Dropdown>
                        DUPA
                    </Dropdown>
                </div>
            </div>
        );
    }
}