// const is = require('./InfrastructureSet');
// let InfrastructureSet = is.InfrastructureSet;

// const d3 = require('d3')
// const plants = require('./energy-maps.funcs.plants.v0.js')

// function PowerPlant(name, value, column, draw, fuel_type, legend_func, text, color, stroke) {
//     InfrastructureSet.call(this, name, value, column, draw);
//     this.fuel_type = fuel_type || '';
//     this.legend_func = legend_func || null;
//     this.text = text || 'undefined';
//     this.color = color || 'rgba(0, 0, 0, 0.5)';
//     this.stroke = stroke || plant_stroke;
// }
// PowerPlant.prototype = new InfrastructureSet;

// let draw = [ {
//     f: d3.json(plants.draw_coal_plants),
//     src: ['/static/json/power_plants_split/power_plants-COAL.json'],
//     w: d3.json,
//   } ]

// let coal_plants = new PowerPlant('coal-plant', 1_092_000_000_000, 'electricity-generation',draw,'COAL', draw_coalmine_legend, 'Coal power plant', 'rgba(0, 0, 0, .5)', plant_stroke)
// console.log(coal_plants);