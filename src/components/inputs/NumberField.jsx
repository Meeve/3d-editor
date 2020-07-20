import React, { useEffect, useRef, useState } from 'react';

export const NumberField = ({value, label, slideSpeed, onChange, size = 'medium'}) => {
   const incrementSpeed = slideSpeed || 1;
   const inputField = useRef(null);
   const prevValue = useRef(0);
   const clickedX = useRef(0);
   const labelWidth = (label ? 40 : 0);
   const sizeMap = {
      medium: labelWidth + 80 + 'px'
   }

   const inactiveState = {
      windowMouseMove: () => {
      },
      mouseDown: () => setState(waitingForActionState),
      windowMouseUp: () => {
      },
      windowMouseDown: () => {
      }
   };

   const waitingForActionState = {
      classes: 'sliderState',
      windowMouseMove: ({e, value}) => {
         prevValue.current = parseFloat(value);
         clickedX.current = e.pageX;
         setState(sliderActionState);
      },
      mouseDown: () => {
      },
      windowMouseUp: ({inputField}) => {
         setState(numberInputActionState);
         inputField.current.focus();
      },
      windowMouseDown: () => {
      }
   };

   const sliderActionState = {
      classes: 'sliderState',
      windowMouseMove: ({e}) => {
         let offset = prevValue.current + (+e.pageX - clickedX.current) / 20 * incrementSpeed;
         onChange(parseFloat(offset.toFixed(2)));
      },
      mouseDown: () => {
      },
      windowMouseUp: () => setState(inactiveState),
      windowMouseDown: () => {
      }
   };

   const numberInputActionState = {
      id: 1,
      windowMouseMove: () => {
      },
      mouseDown: e => e.stopPropagation(),
      windowMouseUp: () => {
      },
      windowMouseDown: () => setState(inactiveState)
   };

   const [state, setState] = useState(inactiveState);

   useEffect(() => {
      const x = e => state.windowMouseMove({e, value});
      const y = e => state.windowMouseUp({e, inputField});
      const z = e => state.windowMouseDown({e});
      window.addEventListener('mousemove', x);
      window.addEventListener('mouseup', y);
      window.addEventListener('mousedown', z);

      return () => {
         window.removeEventListener('mousemove', x);
         window.removeEventListener('mouseup', y);
         window.removeEventListener('mousedown', z);
      }
   });

   return (
      <React.Fragment>
         {!state.id && <div className="numberFieldHolder" style={{width: sizeMap[size]}}>
            <div className={"numberField " + state.classes}>
               <div className="arrow leftArrow" onClick={e => {
                  e.stopPropagation();
                  onChange(parseFloat(value) - 1)
               }} />
               <div className="numberFieldDisplayerHolder" onMouseDown={state.mouseDown}>
                  {label && <div className="numberFieldLabel">{label}:</div>}
                  <div className="numberFieldText">{value}</div>
               </div>
               <div className="arrow rightArrow" onClick={e => {
                  e.stopPropagation();
                  onChange(parseFloat(value) + 1)
               }} />
            </div>
         </div>}

         {state.id && <div className="numberFieldHolder" style={{width: sizeMap[size]}}>
            <input
               ref={inputField}
               className="numberField numerFieldInput"
               onChange={e => {
                  if (/^[0-9]*\.?[0-9]*$/.test(e.target.value)) {
                     onChange(e.target.value);
                  }
               }}
               onMouseDown={state.mouseDown}
               value={value} type="text"
               onFocus={e => e.target.select()} />
         </div>}
      </React.Fragment>
   )
}
