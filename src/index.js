import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

// Containers
import Full from './containers/Full/';

// Import Main styles for this application
import * as style from '../scss/style.scss';
//import 'antd/dist/antd.css';
//import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
//import 'rc-color-picker/assets/index.css';

// Connections
import thunk from 'redux-thunk';
import reducers from './reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import 'antd/dist/antd.css';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const spinner = document.getElementById('preloader');

if (spinner && !spinner.hasAttribute('hidden')) {
  spinner.setAttribute('hidden', 'true');
}

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <HashRouter>
      <Switch>
        <Route path="/" name="Home" component={Full} />
      </Switch>
    </HashRouter>
  </Provider>,

  document.getElementById('app')
);
