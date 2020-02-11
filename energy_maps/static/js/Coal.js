// const is = require('./InfrastructureSet');
// let InfrastructureSet = is.InfrastructureSet;

// /** 
//  * constructor description
//  * @param {[type]} name [description]
//  * @param {[type]} value [description]
//  * @param {[type]} column [description]
//  * @param {[type]} draw [description]
//  * @param {[type]} stroke [description]
//  * @param {[type]} width [description]
//  * @param {[type]} text [description]
//  */
// function Coal(name, value, column, draw, stroke, width, text) {
//     InfrastructureSet.call(this, name, value, column, draw);
//     this.stroke = stroke;
//     this.width = width || 0;
//     this.text = text || 'Coal';
// }
// Coal.prototype = new InfrastructureSet;
// module.exports = Coal;

// let coal_mine = new Coal('coal-mine', 57_000_000_000, 'coal', [], 'rgba(255, 255, 255, 1)', 1, 'Coal mine')
// console.log(coal_mine);

// let railroad = new Coal('railroad', 137_000_000_000, 'coal', [], '#767676', 1, 'Railroad');
// console.log(railroad);