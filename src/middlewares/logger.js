import { LOG_INFO } from '../actions/types';

export default ({ dispatch }) => next => action => {
   // disable for now, I shouldn't log everything because it impact the performance
   //    if (action.type !== LOG_INFO) {
   //       dispatch({
   //          type: LOG_INFO,
   //          payload: action.type + ': ' + JSON.stringify(action)
   //       });
   //    }

   return next(action);
};
