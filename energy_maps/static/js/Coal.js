const InfSet = require('./InfrastructureSet');
let InfrastructureSet = InfSet.InfrastructureSet;

function Coal(name, value, column, draw, stroke, width, text) {
    InfrastructureSet.call(this, name, value, column, draw);
    this.stroke = stroke;
    this.width = width || 0;
    this.text = text || 'Coal';
}
Coal.prototype = new InfrastructureSet;

let coal_mine = new Coal('coal-mine', 57_000_000_000, 'Unknown kV AC', [], 'rgba(255, 255, 255, 1)', 1, 'Coal mine')
console.log(coal_mine);