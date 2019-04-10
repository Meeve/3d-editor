import { LOG_INFO } from '../actions/types';

export default (state = [], action) => {
   switch (action.type) {
      case LOG_INFO:
         return [...state, action.payload];
   }
   return state;
};
