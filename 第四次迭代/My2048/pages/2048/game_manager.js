var Grid = require('./grid.js');
var Tile = require('./tile.js');


function GameManager() {

}

GameManager.prototype = {
  setup: function () {
    this.grid = new Grid();
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
    this.won = false;
    this.over = false;
    return this.grid.grid;
  },

  addRandomTile: function () {
    if (this.grid.getEmptyNumber()) {
      var value = Math.random() < 0.8 ? 2 : 4;
      var cell = this.grid.getRandomEmptyCell();
      var tile = new Tile(cell, value);
      this.grid.insertTile(tile);
    }
  },

  getVector: function (direction) {
    var vectors = {
      'up': {
        x: -1,
        y: 0
      },
      'left': {
        x: 0,
        y: -1,
      },
      'down': {
        x: 1,
        y: 0
      },
      'right': {
        x: 0,
        y: 1
      }
    };
    return vectors[direction];
  },

  findFarthestCell: function (cell, vector) {
    var previous;
    do {
      previous = cell;
      cell = {
        x: previous.x + vector.x,
        y: previous.y + vector.y
      };
    }
    while (this.grid.withinBounds(cell) && !this.grid.getCell(cell));

    return {
      farthest: previous,
      next: cell
    }
  },

  moveTile: function (tile, cell) {
    this.grid.grid[tile.x][tile.y] = null;
    this.grid.grid[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
  },

  buildTraversals: function (vector) {
    var traversals = {
      x: [],
      y: []
    };

    for (var pos = 0; pos < 4; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }
    if (vector.x === 1) {
      traversals.x = traversals.x.reverse();
    }
    if (vector.y === 1) {
      traversals.y = traversals.y.reverse();
    }
    return traversals;
  },

  tileMergeAvailable: function () {
    var self = this;
    var tile;
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        tile = this.grid.getCell({
          x: x,
          y: y
        });

        if (tile) {
          ['up', 'left', 'down', 'right'].forEach(function (direction) {
            var vector = self.getVector(direction);
            var cell = {
              x: x + vector.x,
              y: y + vector.y
            };
            var other = self.grid.getCell(cell);
            if (other && other.value === tile.value) {
              return true;
            }
          })
        }
      }
    }
    return false;
  },

  positionEqual: function (pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  },

  prepare: function () {
    var tile;
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        tile = this.grid.grid[x][y];
        if (tile) {
          tile.savePosition();
          tile.mergedFrom = null;
        }
      }
    }
  },

  moveAvailable: function () {
    return this.grid.getEmptyNumber() || this.tileMergeAvailable();
  },

  move: function (direction) {
    var self = this;
    var vector = this.getVector(direction);
    var traversals = this.buildTraversals(vector);
    var cell;
    var tile;
    var moved = false;
    self.prepare();
    traversals.x.forEach(function (x) {
      traversals.y.forEach(function (y) {
        cell = {
          x: x,
          y: y
        };
        tile = self.grid.getCell(cell);

        if (tile) {
          var position = self.findFarthestCell(cell, vector);
          var next = self.grid.getCell(position.next);

          if (next && next.value === tile.value && !next.mergedFrom) {
            var merged = new Tile(position.next, tile.value * 2);
            merged.mergedFrom = [tile, next];
            self.grid.insertTile(merged);
            self.grid.removeTile(tile);
            tile.updatePosition(position.next);
            self.score += merged.value;
            if (merged.value === 2048) {
              self.won = true;
            }
          } else {
            self.moveTile(tile, position.farthest)
          }

          if (!self.positionEqual(cell, tile)) {
            moved = true;
          }
        }
      });
    });

    if (moved) {
      this.addRandomTile();
      if (!this.moveAvailable()) {
        this.over = true;
      }
      return this.result();
    }
  },

  result: function () {
    return {
      grid: this.grid.grid,
      over: this.over,
      won: this.won,
      score: this.score
    }
  },

  restart: function () {
    return this.setup();
  },
}
module.exports = GameManager;