import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "whatwg-fetch";
import Adventure from "./Adventure";
import AdventureComponent from "./AdventureComponent";

class App extends Component {
  state = {
    adventures: [],
    currentAdventure: 0
  };

  componentDidMount() {
    var self = this;
    fetch("/cya")
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        var adventures = [];
        for (var i = 0; i < json.length; i++) {
          adventures.push(new Adventure(json[i].title, json[i].text));
        }
        self.setState({ adventures: adventures });
        console.log(adventures);
        console.log("parsed json", json);
      })
      .catch(function(ex) {
        console.log("parsing failed", ex);
      });
  }

  render() {
    let { adventures, currentAdventure } = this.state;
    var buttons = [];
    for (let i = 0; i < adventures.length; i++) {
      buttons.push(
        <button onClick={() => this.setState({ currentAdventure: i })}>
          {adventures[i].title}
        </button>
      );
    }
    let adventureComponent = "";
    if (adventures.length > 0) {
      adventureComponent = (
        <AdventureComponent
          key={currentAdventure}
          adventure={adventures[currentAdventure]}
        />
      );
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            Welcome to React!!!!! Choose your adventure.
            "I'm_not_even_reloading!"
          </h1>
        </header>
        {buttons}
        {adventureComponent}
      </div>
    );
  }
}

export default App;
