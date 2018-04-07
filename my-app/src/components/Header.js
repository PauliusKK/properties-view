/*eslint-disable */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";

class Header extends Component {
  render() {
    return (
			<header className="header">
        <div className="logo">
          <NavLink to="/">
            <img src="https://d27025paaqexrb.cloudfront.net/assets/images/logos/hostmaker-round.svg" alt=""/>
          </NavLink>
        </div>
      </header>
    );
  }
}

export default Header;
