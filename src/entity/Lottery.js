var Cell = require('./Cell');
var Food = require('./Food');
// Test Your Luck :)

function Lottery() {
    Cell.apply(this, Array.prototype.slice.call(arguments));
    
    this.cellType = 2;
    this.isSpiked = true;
    this.isMotherCell = false;       // Not to confuse bots
    this.LotteryVirusSize = 136;
    this.setColor({ r: 255, g: 209, b: 26 });
       if (!this._size) {
        this.setSize(this.LotteryVirusSize);
    }
}

module.exports = Lottery;
Lottery.prototype = new Cell();

Lottery.prototype.onEat = function (prey) {
    // Called to eat prey cell
    this.setSize(Math.sqrt(this._sizeSquared + prey._sizeSquared));
    
    if (this._size >= this.gameServer.config.virusMaxSize) {
        this.setSize(this.gameServer.config.virusMinSize); // Reset mass
        this.gameServer.shootVirus(this, prey.boostDirection.angle);
    }
};
Lottery.prototype.onEaten = function (c) {
        this.prize = Math.round((Math.random() * (4 - 0.8)) + 0.8); // 1 = Gold, 2 = Silver, 3 = Bronze Don't Change It does it automatically
        if (this.prize == 1) { // Gold Best Prize
        if (c.owner == null) return;

        var minSize = this.gameServer.config.playerMinSize,
        min = (minSize == 32) ? 30 : minSize, // minimun size of small splits
        cellsLeft = this.gameServer.config.playerMaxCells - c.owner.cells.length,
        numSplits = cellsLeft < (c._mass / 16) ? cellsLeft : (c._mass / 16),
        splitMass = (c._mass / numSplits) < min ? (c._mass / numSplits) : min;
    
        // Diverse explosion(s)
            // ckeck size of exploding
            var threshold = c._mass - numSplits * splitMass; 
            
            if (threshold > 466) {
                // virus explosion multipliers
                var exp = (Math.random() * (2.5 - 1.5)) + 1.5;
                while (threshold / exp > 24) {
                    threshold /= exp;
                    exp = 2;
            }
        }
    // Split
            for (var k = 0; k < 512; k++) {
            var angle = 2 * Math.PI * Math.random(); // random directions
            this.gameServer.splitPlayerCell(c.owner, c, angle, min);
    }
}
    else if (this.prize == 2) { // Silver Second Best Prize
    if (c.owner == null) return;

    var minSize = this.gameServer.config.playerMinSize,
    min = (minSize == 32) ? 30 : minSize, // minimun size of small splits
    cellsLeft = this.gameServer.config.playerMaxCells - c.owner.cells.length,
    numSplits = cellsLeft < (c._mass / 16) ? cellsLeft : (c._mass / 16),
    splitMass = (c._mass / numSplits) < min ? (c._mass / numSplits) : min;
    
    // Diverse explosion(s)
    var big = [];
    if (!numSplits) return; // can't split anymore
    if (numSplits == 1) big = [c._mass/4];
    else if (numSplits == 2) big = [c._mass/8,c._mass/8];
    else if (numSplits == 3) big = [c._mass/8,c._mass/8,c._mass/14];
    else if (numSplits == 4) big = [c._mass/10,c._mass/14,c._mass/16,c._mass/20];
    else {
        // ckeck size of exploding
        var threshold = c._mass - numSplits * splitMass; 
        // Monotone explosion(s)
        if (threshold > 466) {
            // virus explosion multipliers
            var v = c.isMoving ? 2.5 : 4.5;
            var exp = (Math.random() * (v - 1.5)) + 3.33;
            while (threshold / exp > 24) {
                threshold /= exp;
                exp = 2;
                big.push(threshold >> 0);
            }
        }
    }
    numSplits -= big.length;
    // big splits
    for (var k = 0; k < big.length; k++) {
        var angle = 2 * Math.PI * Math.random(); // random directions
        this.gameServer.splitPlayerCell(c.owner, c, angle, big[k]);
    }
    // small splits
    for (var k = 0; k < numSplits; k++) {
        angle = 2 * Math.PI * Math.random(); // random directions
        this.gameServer.splitPlayerCell(c.owner, c, angle, min);
    }
    }

    else if (this.prize >= 3) { // Bronze Worst Prize
  
    // Split once xD
            var angle = 2 * Math.PI * Math.random(); // random directions
            var mass = (Math.random() * (c._mass / 20 - c._mass / 7)) + c._mass / 7; 
            this.gameServer.splitPlayerCell(c.owner, c, angle, mass);


    }
}



Lottery.prototype.onAdd = function () {
};

Lottery.prototype.onRemove = function () {
};
