"use strict";

var React = require('react');
var ReactEmoji = require('react-emoji');
var emojiMap = require('./lib/emojiMap');

var tabStyle = {
  marginRight: '0.4rem',
  display: 'inline-block',
  padding: '0.2rem 0.3rem',
  border: '1px solid silver',
  borderBottom: 'none',
  borderRadius: '0.3rem 0.3rem 0 0',
  cursor: 'pointer',
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
  },
  getInitialState: function() {
    return {
      hovered: null,
      category: 'people',
    }
  },

  componentDidMount: function() {
    document.addEventListener('keydown', this.grabKeyPress, false)
  },
  componentWillUnmount: function() {
    document.removeEventListener('keydown', this.grabKeyPress, false)
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
    var query = (this.props.query || '').replace(/:/g, '').replace(/([\+\-])/g, "\\$&");
    var category = this.state.category;

    return emojiMap.filter(function(emoji) {
      return query ? filterByName({emoji:emoji, query:query})
        : filterByCategory({emoji:emoji, category:category})
    })
  },

  setCategory: function(category) {
    this.setState({category:category})
  },

  header: function() {
    if(!this.props.query) {
      return (
        React.createElement("span", null,
          React.createElement("a", {style: tabStyle, className: "emoji-picker-emoji",
            onClick: this.setCategory.bind(this, 'people')},
            this.emojify(':smiley:', {singleEmoji: true})
          ),
          React.createElement("a", {style: tabStyle, className: "emoji-picker-emoji",
            onClick: this.setCategory.bind(this, 'nature')},
            this.emojify(':seedling:', {singleEmoji: true})
          ),
          React.createElement("a", {style: tabStyle, className: "emoji-picker-emoji",
            onClick: this.setCategory.bind(this, 'objects')},
            this.emojify(':telescope:', {singleEmoji: true})
          ),
          React.createElement("a", {style: tabStyle, className: "emoji-picker-emoji",
            onClick: this.setCategory.bind(this, 'places')},
            this.emojify(':bike:', {singleEmoji: true})
          ),
          React.createElement("a", {style: tabStyle, className: "emoji-picker-emoji",
            onClick: this.setCategory.bind(this, 'symbols')},
            this.emojify(':1234:', {singleEmoji: true})
          ),
          React.createElement("br", null)
        )
      )
    }
  },

  footer: function() {
    if(this.state.hovered) {
      return React.createElement("span", null,
               React.createElement("br", null), this.state.hovered
             )
    }
  },

  hovered: function(emoji) {
    this.setState({hovered: emoji})
  },

  blurred: function() {
    this.setState({hovered: null})
  },

  render: function() {
    var that = this;
    var emojiLinks = this.emojis().map(function(emoji) {
      emoji = ':' + emoji.name} + ':'
      return (
        React.createElement("a", {key: emoji, className: "emoji-picker-emoji",
          onClick: that.props.onSelect.bind(null, emoji),
          onMouseEnter: that.hovered.bind(that, emoji),
          onMouseLeave: that.blurred,
          style: {padding: '0.2rem', cursor: 'pointer'}},
          that.emojify(emoji, {singleEmoji: true})
        )
      )
    })
    if(emojiLinks.length === 0) emojiLinks = "No emojis found";

    return (
      React.createElement("span", {style: this.props.style},
        this.header(),
        emojiLinks,
        this.footer()
      )
    )
  }
})
