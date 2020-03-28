import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import logger from './middlewares/logger';

import App from './views/App';
import reducers from './reducers';
import { AnimationProvider } from './modules/AnimationContext';

const createStoreWithMiddleware = applyMiddleware(logger)(createStore);

ReactDOM.render(
   <Provider store={createStoreWithMiddleware(reducers)}>
      <AnimationProvider>
         <App />
      </AnimationProvider>
   </Provider>,
   document.querySelector('.mainHolder')
);
