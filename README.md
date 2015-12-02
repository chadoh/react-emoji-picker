react-emoji-picker
==================

Thanks to the awesome work of @banyan on [react-emoji](https://github.com/banyan/react-emoji), it's easy to turn user-generated boring-old plain text like `:laughing:` into super sweet emojis like <img src="https://twemoji.maxcdn.com/16x16/1f606.png"/>

But how do you introduce emoji n00bs to this brave new world of named emojis?

With react-emoji-picker!

react-emoji-picker allows you to create a very customizable Slack-like emoji picker in your own user interfaces. It looks a little something like this:

<img width="50%" alt="emoji picker palette, with search bar"
  src="http://f.cl.ly/items/1n2z3n1D3B1B0y3o2s03/Image%202015-12-02%20at%2012.53.40%20PM.png"/>


How to use
----------

If you want an emoji picker that looks like the above, first install this package using `npm i -S react-emoji-picker`, and then here's some code you can write to get you to a good starting point:

``` javascript
var React = require('react');
var EmojiPicker = require('emoji-picker');
var emojiMap require('react-emoji-picker/lib/emojiMap');

// styles for the emoji picker wrapper
var emojiPickerStyles = {
  position: 'absolute',
  left: 0, top: '3.9rem',
  backgroundColor: 'white',
  width: '100%',
  padding: '.3em .6em',
  border: '1px solid #0074d9',
  borderTop: 'none',
  zIndex: '2'
};

var MyEmojiInput = React.createClass({
  getInitialState: function() {
    return {
      emoji: null,
      showEmojiPicker: false,
    }
  },

  componentDidMount: function() {
    document.addEventListener('click', this.toggleEmojiPicker, false)
  },

  componentWillUnmount: function() {
    document.removeEventListener('click', this.toggleEmojiPicker, false)
  },

  toggleEmojiPicker: function(e) {
    if(this.refs.emoji.contains(e.target)) {
      this.setState({showEmojiPicker: true});
    } else {
      setTimeout(this.validateEmoji, 10)
      this.setState({showEmojiPicker: false});
    }
  },

  validateEmoji: function() {
    var matched = emojiMap.filter(function(emoji) {
      return `:${emoji.name}:` === this.state.emoji
    })

    if(matched.length === 0) {
      this.setState({emoji: null})
    }
  }

  updateState: function(e) {
    this.setState({emoji: e.target.value})
  },

  setEmoji: function(emoji) {
    this.setState({emoji: emoji})
  },

  // allows selecting first emoji by pressing "Enter" without submitting form
  grabKeyPress: function(e) {
    if(e.keyCode === 13) {
      e.preventDefault()
    }
  },

  emojiPicker: function() {
    if(this.state.showEmojiPicker) {
      return (
        <EmojiPicker
          style={emojiPickerStyles} onSelect={this.setEmoji}
          query={this.state.emoji}
        />
      )
    }
  },

  render: function() {
    return (
      <p ref="emoji">
        <label htmlFor="emoji">Emoji</label>
        <input name="emoji" id="emoji" value={this.state.emoji} autoComplete="off"
          type={this.state.showEmojiPicker ? "search" : "text"}
          onChange={this.updateState} onKeyDown={this.grabKeyPress}/>
        {this.emojiPicker()}
      </p>
    )
  }
})

export.defaults = MyEmojiInput
```

Phew! That was a lot of stuff! 

### Why doesn't it do a bunch of that for me?

You're right, it could! But the above code will give you an `<input type="text"/>` that only accepts a single emoji as a valid value. That's probably not what you want! But react-emoji-picker is flexible enough to support whatever sort of emoji-picking experience you want to build.

Basically, react-emoji-picker takes care of actually listing out all the emojis and responding when a user clicks them. Plus, it keeps the list of all emojis up-to-date in a community-supported way.


What emojis does it support?
----------------------------

Right now, it only supports [twemoji](https://twemoji.maxcdn.com/). However, it's built with [react-emoji](https://github.com/banyan/react-emoji), which also supports [emojione](https://github.com/Ranks/emojione), or even your own custom emoji set.

Patching this package to support other emoji flavors would be really easy. If you want to contribute that improvement, pull requests are welcome!


Contributing
------------

Fork the repo, submit a small pull request. There aren't any tests, yet—if that makes you sad, feel free to add some!
