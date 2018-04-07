/*eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import './index.css';
// import App from './App';
import Header from './components/Header';
import Home from './components/Home';
import registerServiceWorker from './registerServiceWorker';

// Styles
import './styles.scss';

ReactDOM.render(<Router>
    <div className="content">
      <Header/>

      <div className="page-content">

        <Route exact path="/" component={Home} />
      </div>
    </div>
  </Router>, document.getElementById('root'));
registerServiceWorker();
