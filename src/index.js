import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import logger from './middlewares/logger';

import App from './components/App';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(logger)(createStore);

ReactDOM.render(
   <Provider store={createStoreWithMiddleware(reducers)}>
      <App />
   </Provider>,
   document.querySelector('.mainHolder')
);
