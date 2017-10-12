import React, { Component } from "react";
export default class SignIn extends Component {
  render() {
    console.log(this.props.location.pathname);
    return (
      <div>
        <p>"Welcome to sign in"</p>

        <form>
          <div>First name:</div>
          <input type="text" name="firstname" value="" />
          <div>Last name:</div>
          <input type="text" name="lastname" value="" />
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  }
}
