/**
 * @file Provides global draw functions and any helpers for gas & oil wells, pipelines, refineries, processing, and storage.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Wells
 */

/** 
 * Instatiates a new WindSpeed object that contains properties used to draw gas and oil wells to the map and legend.
 * @class
 * @classdesc Used to create objects that represent wind speed in different regions.
 * @extends InfrastructureSet 
 * @param {String} name - canvas ID
 * @param {String} text - text displayed in the legend
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw - properties used to parse the data and render the visualization
 * @param {String} color - rgba value
 * @param {String} legend_color - rgba value
 * @property {Number} width - scaled value for symbols on the map
 * @property {Number} cross - scaled value for cross symbols on the map
 * @property {Number} diameter - scaled value for circular symbols on the map
 * @property {Number} stroke - stroke width
 */

function WindSpeed(name, text, value, column, draw, color, legend_color) {
    // TODO: This is not an infrastructure set itself so model it differently in the long run.
    InfrastructureSet.call(this, name, text, value, column, draw);  
    this.color = color;
    this.legend_color = legend_color;
    this.width = SCALE / 6;
    this.cross = 5 * SCALE;
    this.diameter = SCALE / 2;
    this.stroke = SCALE;
    this.z_index = 0;
    /**
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     * @returns {Number} y - updated y axis
     */
    this.draw_legend = function draw_wind_legend(ctx, x, y) {
      console.log('wind symbol');
  
      y = advance_vertical_increment(y, ctx, this.color, this.stroke); 
      draw_circle(ctx, [x, y], this.diameter * 3);
      ctx.stroke();
      ctx.fill();
      
      y = advance_for_type(y, ctx, this.text, text_offset, x);
      y = advance_vertical_increment(y, ctx, this.color, oil_and_gas.wells.stroke);
      draw_x(ctx, [x, y], oil_and_gas.wells.cross);
      ctx.stroke();
      
      let text = `Wind speed`
      y = advance_for_type(y, ctx, text, text_offset, x);
      
      return y;
    };
  }
  WindSpeed.prototype = new InfrastructureSet;

/**
 * Draw gas wells to the infrastructure map.
 * @param {Array} queued_data - readfile: '/static/json/wind-speed-georef-linear.geojson'
 */
const draw_wind_speed = function draw_wind_speed(queued_data) {
    console.log('draw_wind_speed');
  
    get_xy(queued_data);
    draw_well(xy, gas_well.color)
  
  };

let wind_speed = new WindSpeed('wind-speed', 'Wind speed', 1_111_111_111_111, 'wind-speed', [ {
    f: draw_wind_speed,
    src: [ `/static/json/wind-speed-georef-linear.geojson`],
    w: d3.json
  } ], 'rgb(255,0,0)', 'rgb(255,0,0)')