const InfSet = require('./InfrastructureSet');
let InfrastructureSet = InfSet.InfrastructureSet;

function Grid(name, value, column, draw, color, line_width, nominal_voltage) {
    InfrastructureSet.call(this, name, value, draw, column);
    this.color = color || 'rgba(0, 0, 0, 0.5)';
    this.line_width = line_width || 0;
    this.nominal_voltage = nominal_voltage || 50;
}
Grid.prototype = new InfrastructureSet;

let ac_na = new Grid('NOT AVAILABLE', 150, 'Unknown kV AC', [], 'rgba(255, 255, 255)', 0, 50)
console.log(ac_na);