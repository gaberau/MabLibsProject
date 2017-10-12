import React, { Component } from "react";
export default class AdventureComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.adventure.getOptions(),
      text: props.adventure.getText()
    };
  }
  clickOption(index) {
    this.props.adventure.makeChoice(index);
    this.setState({
      options: this.props.adventure.getOptions(),
      text: this.props.adventure.getText()
    });
  }
  render() {
    var buttons = [];
    for (let i = 0; i < this.state.options.length; i++) {
      buttons.push(
        <button onClick={() => this.clickOption(i)}>
          {this.state.options[i]}
        </button>
      );
    }
    return (
      <div>
        <div> {this.props.adventure.title} </div>
        <div> {this.state.text} </div>
        <div>{buttons}</div>
      </div>
    );
  }
}
