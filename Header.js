import React, { Component } from "react";
import { Link } from "react-router-dom";
export default class Header extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/signup">sign up</Link>
            <br />
          </li>
          <li>
            <Link to="/signin">sign in</Link>
            <br />
          </li>
        </ul>
      </div>
    );
  }
}
