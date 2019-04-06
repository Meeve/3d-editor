import React, {Component} from 'react';
import _ from 'lodash';

export default class NumberField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
        
        this.handleMouseMoveEvent = _.throttle(this.handleMouseMoveEvent, 20);
    }

    componentWillUnmount() {
        this.clearWindowEvents();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        });
    }

    changeProp = (e) => {
        this.setState({
            value: e.target.value
        });

        if (!isNaN(e.target.value) && e.target.value !== "") {
            this.props.onChange(parseInt(e.target.value));
        }
    }

    appendMouseMoveListener = () => {
        window.addEventListener('mousemove', this.handleMouseMoveEvent);
    }

    handleMouseMoveEvent = (e) => {
        let offset = this.state.prevValue + (+e.pageX - this.state.clickedX) / 20;
        this.setState({
            value: offset
        });
        this.props.onChange(offset);
    }
    

    appendMouseUpListener = () => {
        window.addEventListener('mouseup', this.handleMouseUpEvent);
    }

    handleMouseUpEvent = (e) => {
        this.setState({
            mouseDown: false
        });
        this.clearWindowEvents();
    }

    mouseDown = (e) => {
        this.appendMouseMoveListener();
        this.appendMouseUpListener();
        this.setState({ 
            clickedX: e.pageX,
            prevValue: parseInt(this.state.value)
        });
    }

    clearWindowEvents = () => {
        window.removeEventListener('mousemove', this.handleMouseMoveEvent);
        window.removeEventListener('mouseup', this.state.mouseUpEvent);
    }

    render() {
        return (
            <div>
                <label style={{width: '58px', display: 'inline-block'}}>
                    {this.props.label}:
                </label>
                <input
                    onMouseDown={this.mouseDown}
                    onChange={this.changeProp}
                    value={this.state.value}
                    type="number"/>
            </div>
        );
    }
}