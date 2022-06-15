function Grid() {
  this.grid = this.initialize();
}

Grid.prototype = {
  initialize: function () {
    var grid = [];

    for (var x = 0; x < 4; x++) {
      var row = grid[x] = [];
      for (var y = 0; y < 4; y++) {
        row.push(null);
      }
    }

    return grid;
  },

  getEmptyCells: function () {
    var emptyCells = [];
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (!this.grid[i][j]) {
          emptyCells.push({
            x: i,
            y: j
          });
        }
      }
    }
    return emptyCells;
  },

  getRandomEmptyCell: function () {
    var cells = this.getEmptyCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  },

  getEmptyNumber: function () {
    return !!this.getEmptyCells().length;
  },

  withinBounds: function (cell) {
    return cell.x >= 0 && cell.x < 4 && cell.y >= 0 && cell.y < 4;
  },

  getCell: function (cell) {
    if (this.withinBounds(cell)) {
      return this.grid[cell.x][cell.y] || null;
    } else {
      return null;
    }
  },

  insertTile: function (tile) {
    this.grid[tile.x][tile.y] = tile;
  },

  removeTile: function (tile) {
    this.grid[tile.x][tile.y] = null;
  },
  
}

module.exports = Grid;