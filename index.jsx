"use strict";

var React = require('react');
var ReactEmoji = require('react-emoji');
var emojiMap = require('./lib/emojiMap');

function touchDevice() {
  return "ontouchstart" in document.documentElement;
}

var tabWrapStyle = {
  display: 'block',
  borderBottom: '1px solid silver',
}

var tabStyle = {
  marginRight: '0.4rem',
  display: 'inline-block',
  padding: '0.2rem 0.3rem',
  border: '1px solid silver',
  borderBottom: 'none',
  borderRadius: '0.3rem 0.3rem 0 0',
  cursor: 'pointer',
  position: 'relative',
  top: 2,
}

var activeTabStyle = {};
for (var key in tabStyle) {
  activeTabStyle[key] = tabStyle[key];
}
activeTabStyle.borderBottom = '3px solid white';

var bodyStyle = {
  display: 'block',
  margin: '0.3em 0 0',
  maxHeight: '12.5em',
  overflowY: 'scroll',
}

function filterByName(opts) {
  return opts.emoji.name.match(opts.query)
    || opts.emoji.alternatives.match(opts.query)
}

function filterByCategory(opts) {
  return opts.emoji.category === opts.category
}

module.exports = React.createClass({
  displayName: 'EmojiPicker',
  mixins: [ReactEmoji],
  propTypes: {
    query: React.PropTypes.string,
    doGrabKeyPress: React.PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      doGrabKeyPress: true,
    };
  },
  getInitialState: function() {
    return {
      hovered: null,
      category: 'people',
    }
  },

  componentDidMount: function() {
    if (this.props.doGrabKeyPress) {
      document.addEventListener('keydown', this.grabKeyPress, false)
    }
  },
  componentWillUnmount: function() {
    if (this.props.doGrabKeyPress) {
      document.removeEventListener('keydown', this.grabKeyPress, false)
    }
  },

  // if user presses Enter or Tab while EmojiPicker showing
  grabKeyPress: function(e) {
    if(e.keyCode === 13 || e.keyCode === 9) {
      e.preventDefault()
      this.selectFirst()
    }
  },

  selectFirst: function() {
    if(this.emojis()[0]) {
      this.props.onSelect(':' + this.emojis()[0].name + ':')
    }
  },

  emojis: function() {
    var query = (this.props.query || '').
      replace(/:/g, '').
      replace(/([\+\-])/g, "\\$&").
      toLowerCase();
    var category = this.state.category;

    return emojiMap.filter(function(emoji) {
      return query ? filterByName({emoji:emoji, query:query})
        : filterByCategory({emoji:emoji, category:category})
    })
  },

  setCategory: function(category) {
    this.setState({category: category})
  },

  header: function() {
    var cat = this.state.category;
    if(!this.props.query) {
      return (
        React.createElement("span", {style: tabWrapStyle},
          React.createElement("a", { className: "emoji-picker-emoji",
            style: cat === 'people' ? activeTabStyle : tabStyle,
            onClick: this.setCategory.bind(this, 'people')},
            this.emojify(':smiley:', {singleEmoji: true})
          ),
          React.createElement("a", {className: "emoji-picker-emoji",
            style: cat === 'nature' ? activeTabStyle : tabStyle,
            onClick: this.setCategory.bind(this, 'nature')},
            this.emojify(':seedling:', {singleEmoji: true})
          ),
          React.createElement("a", {className: "emoji-picker-emoji",
            style: cat === 'objects' ? activeTabStyle : tabStyle,
            onClick: this.setCategory.bind(this, 'objects')},
            this.emojify(':telescope:', {singleEmoji: true})
          ),
          React.createElement("a", {className: "emoji-picker-emoji",
            style: cat === 'places' ? activeTabStyle : tabStyle,
            onClick: this.setCategory.bind(this, 'places')},
            this.emojify(':bike:', {singleEmoji: true})
          ),
          React.createElement("a", {className: "emoji-picker-emoji",
            style: cat === 'symbols' ? activeTabStyle : tabStyle,
            onClick: this.setCategory.bind(this, 'symbols')},
            this.emojify(':1234:', {singleEmoji: true})
          )
        )
      )
    }
  },

  body: function() {
    var that = this;

    var emojiLinks = this.emojis().map(function(emoji) {
      emoji = ':' + emoji.name + ':';
      return (
        React.createElement("a", {key: emoji, className: "emoji-picker-emoji",
          onClick: that.props.onSelect.bind(null, emoji),
          onMouseEnter: !touchDevice() && that.hovered.bind(that, emoji),
          onMouseLeave: !touchDevice() && that.blurred,
          style: {padding: '0.2rem', cursor: 'pointer'}},
          that.emojify(emoji, {singleEmoji: true})
        )
      )
    });

    if(emojiLinks.length === 0) emojiLinks = "No emojis found";

    return React.createElement("span", {style: bodyStyle}, emojiLinks);
  },

  footer: function() {
    if(this.state.hovered) {
      return (
        React.createElement("span", null,
          this.state.hovered
        )
      );
    }
  },

  hovered: function(emoji) {
    this.setState({hovered: emoji})
  },

  blurred: function() {
    this.setState({hovered: null})
  },

  render: function() {
    return (
      React.createElement("span", {style: this.props.style},
        this.header(),
        this.body(),
        this.footer()
      )
    )
  }
})
