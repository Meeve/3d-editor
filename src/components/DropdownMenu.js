import React from "react";
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default class DropdownMenu extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedElement: null,
            actionList: this.props.actionList.map(action => {
                return {
                    ...action,
                    ref: React.createRef()
                }
            })
        };
    }

    selectElement(selectedElement) {
        if(selectedElement.actionList) {
            this.setState({
                selectedElement
            });
        }
        console.log(selectedElement.actionList);
    }

    unselectElement() {
        this.setState({
            selectedElement: null
        });
    }

    triggerAction(selectedElement) {
        if(selectedElement.action) {
            selectedElement.action();
        }   
    }

    render() {
        const position = this.props.position;
        let dropDownStyle = {};

        if(this.props.location == "right") {
            dropDownStyle = { left: position.x + position.width };
            if(position.y + 30 * this.state.actionList.length > 943) {
                dropDownStyle.bottom = 943 - position.y - position.height;
            } else {
                dropDownStyle.top = position.y;
            }
        } else {
            dropDownStyle = {
                left: position.x,
                top: position.y - 30 * this.state.actionList.length
            };
        }

        const list = _.map(this.state.actionList, (el, key) => {
            return <li key={key} 
                ref={el.ref}
                onMouseEnter={() => this.selectElement(el)} 
                onClick={() => this.triggerAction(el)}>
                {/* onMouseLeave={() => this.unselectElement()}> */}
                {el.text}
            </li>
        });

        let nextDropdown = "";
        if(this.state.selectedElement) {
            const childPosition = this.state.selectedElement.ref.current.getBoundingClientRect();
            nextDropdown = <DropdownMenu location="right" position={childPosition} actionList={this.state.selectedElement.actionList}></DropdownMenu>;
        }

        return ReactDOM.createPortal(
            <div className="dropDownOptionHolder" style={dropDownStyle}>
                <ul className="dropdownOptionList">
                    {list}
                </ul>
                {nextDropdown}
            </div>,
            document.body
        );
    }
}