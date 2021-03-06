function Tile(position, value) {
  this.x = position.x;
  this.y = position.y;
  this.value = value || 2;
  this.previousPosition = null;
  this.mergedFrom = null;
}

Tile.prototype = {
  savePosition: function () {
    this.previousPosition = {
      x: this.x,
      y: this.y
    };
  },

  updatePosition: function (position) {
    this.x = position.x;
    this.y = position.y;
  },

  get: function () {
    return {
      position: {
        x: this.x,
        y: this.y
      },
      value: this.value
    };
  }
}

module.exports = Tile;