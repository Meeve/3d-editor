import React, {Component} from 'react';
import Canvas from './canvas.js';
import Scene from './scene.js';
import Dropdown from "./dropdown/Dropdown";

export default class ViewSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            views: {
                Canvas: {name: "Canvas", element: Canvas},
                Scene: {name: "Scene", element: Scene}
            },
            selectedView: {name: "", element: Canvas}
        };
    }

    viewChanged(event) {
        this.setState({
            selectedView: this.state.views[event.target.value]
        });
    }

    render() {
        let viewList = _.map(this.state.views, (view, key) => <option key={key}> {view.name} </option>);
        let currentView = "";

        if (this.state.selectedView.element != null) {
            currentView = <this.state.selectedView.element/>;
        }
        
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