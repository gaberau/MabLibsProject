export default class Adventure {
  constructor(title, text) {
    this.title = title;
    this.text = text;
    this.parsedStory = this._parse(text);
    this.current = this.parsedStory;
  }

  reset() {
    this.current = this.parsedStory;
    return this.current;
  }

  getText() {
    return this.current.text;
  }

  getOptions() {
    if (this.current.options) {
      var optionTexts = [];
      for (var i = 0; i < this.current.options.length; i++) {
        optionTexts.push(this.current.options[i].prompt);
      }
      return optionTexts;
    }
  }

  makeChoice(index) {
    if (this.current.options) {
      this.current = this.current.options[index].action;
      return this.current;
    } else {
      throw Error("Options don't exist. GAME OVER!");
    }
  }

  _parse() {
    function parseStory(story) {
      var actions = story.split("##");
      actions.shift();
      var firstAction;
      var actionObj = {};
      for (var i = 0; i < actions.length; i++) {
        let action = parseAction(actions[i]);
        if (i === 0) {
          firstAction = action;
        }
        actionObj[action.label] = action;
      }
      for (var label in actionObj) {
        let action = actionObj[label];
        for (var i = 0; i < action.options.length; i++) {
          var option = action.options[i];
          option.action = actionObj[option.label];
        }
      }
      return firstAction;
    }

    function parseAction(action) {
      var brackets = /^<([^<>]*)>([\s\S]*)/;
      var match = action.match(brackets);
      var label = match[1];
      var rest = match[2].trim();
      var actionFields = rest.split("-O");
      var text = actionFields.shift().trim();
      var options = [];
      for (var i = 0; i < actionFields.length; i++) {
        options.push(parseOption(actionFields[i]));
      }
      return {
        text: text,
        label: label,
        options: options
      };
    }

    function parseOption(option) {
      var brackets = /^<([^<>]*)>([\s\S]*)/;
      var match = option.match(brackets);
      var label = match[1];
      var text = match[2].trim();
      return {
        label: label,
        prompt: text
      };
    }

    return parseStory(this.text);
  }
}
