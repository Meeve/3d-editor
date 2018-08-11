import React from 'react';
import { mount } from 'enzyme';

import Scroller from "../Scroller";  

function TestComponent() {
    return <div style={{ height: "200px" }}></div>;
}

it("scrollerHolder should be not visible if children is smaller than Scroller", () => {
    const component = mount(<Scroller height={300} >
            { TestComponent }
        </Scroller>);

    component.setProps({ height: 300 });

    expect(component.find(".scrollerOuter").get(0).props.style.display).toEqual("none");

    component.unmount();
});

it("scrollerHolder should be visible if children is bigger than Scroller", () => {
    document.body.innerHTML = '<div id="hoge"></div>';
    const options = {
        attachTo: document.querySelector('#hoge')
    };
    const component = mount(<Scroller height={100} >
            { TestComponent }
        </Scroller>, options);

    component.setProps({ height: 100 });

    expect(component.find(".scrollerOuter").get(0).props.style.display).toEqual("block");

    component.unmount();
});