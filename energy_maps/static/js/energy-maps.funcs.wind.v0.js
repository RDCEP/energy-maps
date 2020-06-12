/**
 * @file Functions for modeling and drawing Wind Speed
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Wind
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
      y = advance_vertical_increment(y, ctx, this.color, this.stroke); 
      draw_circle(ctx, [x, y], this.diameter * 3);
      ctx.stroke();
      ctx.fill();
      y = advance_for_type(y, ctx, this.text, text_offset, x);
      ctx.stroke();      
      return y;
    };
}
WindSpeed.prototype = new InfrastructureSet;

// version based on draw_gas_processor
const draw_wind_point = function draw_wind_point(ctx, xy, color) { 
    ctx.strokeStyle = color;
    ctx.strokeWidth = SCALE;
    ctx.fillStyle = color;
    ctx.beginPath();
    draw_triangle(ctx, xy, 1.5 * SCALE);
    // ctx.stroke(); // either stroke or fill
    ctx.fill();
};

// based on gas pipes
const draw_all_wind = function draw_all_wind(ctx, queued_data) {
  console.log('draw_all_wind');

  let wind_data = queued_data[0];
  const path = get_path(ctx);

  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgb(255,150,0)';
  ctx.lineWidth =  1;
  // ctx.lineWidth = 1.8 * SCALE;
  ctx.beginPath();
  path(wind_data);
  ctx.stroke();
  ctx.setLineDash([]);
  hide_spinner();
};

let wind_speed = new WindSpeed('wind-speed', 'Wind speed', 1_111_111_111_111, 'wind-speed', [ {
    f: draw_all_wind,
    src: [ `/static/json/neighbor_euclidean_modified_4326_conversion.geojson`],
    w: d3.json
  } ], 'rgb(255,0,0)', 'rgb(255,0,0)')

  //