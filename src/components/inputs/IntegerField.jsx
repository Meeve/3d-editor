import React from 'react';
import { NumberField } from './NumberField';

export const IntegerField = props => {
   return <NumberField
      {...props}
      onChange={value => props.onChange(Math.round(value))}
   />;
};
