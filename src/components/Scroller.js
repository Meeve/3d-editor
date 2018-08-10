import React from 'react';

export default class Scroller extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{display: "grid", gridTemplateColumns: "1fr 25px", overflow: "hidden"}}>
                <div style={{overflow: "hidden"}}>
                    <this.props.children/>
                </div>
                <div>
                    aaa
                </div>
            </div>
        );
    }
}