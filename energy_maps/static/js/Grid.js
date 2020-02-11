// const is = require('./InfrastructureSet');
// let InfrastructureSet = is.InfrastructureSet;

// /** 
//  * constructor description
//  * @param {[type]} name [description]
//  * @param {[type]} value [description]
//  * @param {[type]} column [description]
//  * @param {[type]} draw [description]
//  * @param {[type]} color [description]
//  * @param {[type]} line_width [description]
//  * @param {[type]} nominal_voltage [description]
//  */
// function Grid(name, value, column, draw, color, line_width, nominal_voltage) {
//     InfrastructureSet.call(this, name, value, column, draw);
//     this.color = color || 'rgba(0, 0, 0, 0.5)';
//     this.line_width = line_width || 0;
//     this.nominal_voltage = nominal_voltage || 50;
// }
// Grid.prototype = new InfrastructureSet;
// module.exports = Grid;

// let ac_na = new Grid('NOT AVAILABLE', 150, 'Unknown kV AC', [], 'rgba(255, 255, 255)', 0, 50)
// console.log(ac_na);