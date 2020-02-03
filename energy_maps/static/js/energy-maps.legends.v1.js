/**
 * @file Provides draw functions and any helpers for the map legend.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Legends
 */

 // TODO: Factor out repetitive behavior
 
 // TODO: Document functions

const LEGEND_FONT_SIZE = 14 * SCALE;
const LEGEND_FONT = `bold ${LEGEND_FONT_SIZE}px Arial`;
const VERTICAL_INCREMENT = 15 * SCALE;
const VERTICAL_TYPE_INCREMENT = 5 * SCALE;

/**
 * Advance vertical increment for legend type (text display)
 * @param {Number} y - y axis
 * @param {Object} ctx - HTML5 canvas context
 * @param {string} text - the text to be displayed
 * @param {Number} text_offset - ?
 * @param {Number} x - x axis
 * @returns {Number} y - updated y axis
 */
function advance_for_type(y, ctx, text, text_offset, x) {
  y += VERTICAL_TYPE_INCREMENT;
  ctx.fillStyle = viz.black;
  ctx.font = LEGEND_FONT;
  ctx.fillText(`${text}`, text_offset + x, y);
  console.log(`${text} y value: ${y}`);
  return y;
}

/**
 * Advance vertical increment for legend symbol
 * @param {Number} y - y axis
 * @param {Object} ctx - HTML5 canvas context
 * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
 * @param {string} lineWidth - symbol lineWidth, bound to `viz` object (some still loosely implemented)
 */
function advance_vertical_increment(y, ctx, color, lineWidth) {
  y += VERTICAL_INCREMENT;
  console.log(color);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = color;
  ctx.beginPath();
  return y;
}

/**
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
   * @param {string} text - the text for the layer written to the legend
   */

/**
 * Update the entire legend. Call each relevant draw function and render them in the appropriate order
 * @param {Object} ctx - HTML5 canvas context
 * @param {Object[]} layers - An array of objects representing resources to be rendered on top of the map canvas.
 */
const update_legend = function update_legend(ctx, layers) {

  /**
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {Object} obj - oil_and_gas_props.wells object 
   */
  const draw_well_legend = function draw_well_legend(ctx, x, y, obj) {
    console.log('well symbol');

    y = advance_vertical_increment(y, ctx, obj.color, obj.stroke); 
    draw_circle(ctx, [x, y], oil_and_gas_props.wells.diameter * 3);
    ctx.stroke();
    ctx.fill();
    
    y = advance_for_type(y, ctx, obj.text, text_offset, x);
    y = advance_vertical_increment(y, ctx, obj.color, oil_and_gas_props.wells.stroke);
    draw_x(ctx, [x, y], oil_and_gas_props.wells.cross);
    ctx.stroke();
    
    let text = `${obj.text.slice(0, 3)} offshore well`
    y = advance_for_type(y, ctx, text, text_offset, x);
    
    return y;
  };

  /**
   * Helper function for pipes and railroad
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
   * @param {Number} width - width value to set for lineWidth
   * @param {boolean} dashed - true if line should be dashed, false if solid
   * @param {string} text - the text for the layer written to the legend
   * @param {string} inf - a flag to determine the corresponding infrastructure (pipelines or railroads) 
   */
    const draw_line = function draw_line(ctx, x, y, dashed = false, text) {
    
    y += VERTICAL_INCREMENT;
    
    // TODO: Why do we have dashed param? Do we have any dashed lines?
    if (dashed) {
      ctx.setLineDash(dashed);
    }

    ctx.beginPath();
    ctx.moveTo(x - 7 * SCALE, y);
    ctx.lineTo(x + 7 * SCALE, y);
    ctx.stroke();

    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  }

  /**
   * Draw pipeline legend to its HTML5 canvas context. All params passed to draw_line() as a helper.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {Object} obj - oil_and_gas_props.wells object
   * @param {boolean} dashed - true if line should be dashed, false if solid
   */
  const draw_pipeline_legend = function draw_pipeline_legend(ctx, x, y, obj, dashed) {
    ctx.strokeStyle = obj.color;
    ctx.lineWidth = obj.width;
    let text = obj.text;
    y = draw_line(ctx, x, y, dashed, text)
    return y;
  };

  /**
   * Draw gas processing legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
   */
  const draw_processing_legend = function draw_processing_legend(
    ctx, x, y, color) {
    // Advance vertical increment
    y += VERTICAL_INCREMENT;
    draw_gas_processor(ctx, [x, y]);
    text = `Gas processing`
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  /**
   * Draw gas storage legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
   */
  const draw_storage_legend = function draw_storage_legend(
    ctx, x, y, color) {
    // Advance vertical increment
    y += VERTICAL_INCREMENT;
    draw_gas_storage(ctx, [x, y]);
    text = 'Gas storage'
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  /**
   * Draw oil refinery legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
   */
  const draw_refinery_legend = function draw_refinery_legend(
    ctx, x, y, color) {
    y += VERTICAL_INCREMENT;
    draw_oil_refinery(ctx, [x, y], 200000*oil_and_gas_props.processing.oil_refinery.size); // TODO: Document or extract these magic numbers
    text = 'Oil refinery';
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  /**
   * Draw coal mine legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
   */
  const draw_coalmine_legend = function draw_coalmine_legend(
    ctx, x, y, obj) {
    y += VERTICAL_INCREMENT;
    // TODO: decouple this func invocation from oil 
    draw_mine(ctx, [x, y], false, 1000000000*oil_and_gas_props.processing.oil_refinery.size); // TODO: Document or extract these magic numbers
    let text = obj.text;
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  /**
   * Draw power plant legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {string} obj - power plant object from `plant_classes`
   */
  const draw_power_plant_legend = function draw_power_plant_legend(
    ctx, x, y, obj) {
    ctx.fillStyle = obj.color;
    ctx.strokeStyle = obj.stroke;
    ctx.lineWidth = plant_classes.stroke.width;
    
    y += 18 * SCALE;
    ctx.beginPath();
    draw_circle(ctx, [x, y], 7 * SCALE);
    ctx.stroke();
    ctx.fill();
    
    let text = obj.text;
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  /**
   * Draw railroad legend to its HTML5 canvas context. All params passed to draw_line() as a helper.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
   * @param {Number} width - width value to set for lineWidth
   * @param {boolean} dashed - true if line should be dashed, false if solid
   * @param {string} text - the text for the layer written to the legend
   */
  const draw_railroad_legend = function draw_railroad_legend(
    ctx, x, y, obj, dashed) {
    ctx.strokeStyle = railroad_props.stroke;
    ctx.lineWidth = railroad_props.width;
    let text = obj.text;
    y = draw_line(ctx, x, y, dashed, text)
    return y;
  };

  /**
   * Draw AC electric grid legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {Object} obj - object from `grid_classes`
   */
  const draw_grid_ac_legend = function draw_grid_ac_legend(
    ctx, x, y, obj) {
    
    y += VERTICAL_INCREMENT;
    ctx.strokeStyle = obj.color;
    
    // Draw the square icon as a fat line
    ctx.lineWidth = 14 * SCALE;
    ctx.beginPath();
    ctx.moveTo(x - 7 * SCALE, y);
    ctx.lineTo(x + 7 * SCALE, y);
    ctx.stroke();

    // FIXME: This is a kludge for drawing a white swatch for unknown kV
    // draws a hollow grey rectangle to give the appearance of a border around the white rectangle
    if (obj === grid_classes.AC_NA) {
      ctx.strokeStyle = 'rgba(76, 76, 76)';
      ctx.lineWidth = 1 * SCALE;
      ctx.strokeRect(x - 7 * SCALE, y - 7, 14 * SCALE, 14 * SCALE);  
    }

    text = obj.text;
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  /**
   * Draw DC electric grid legend to its HTML5 canvas context. All params passed to draw_line() as a helper.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {string} color - symbol color, bound to `viz` object (some still loosely implemented)
   * @param {Number} width - width value to set for lineWidth
   * @param {boolean} dashed - true if line should be dashed, false if solid
   * @param {string} text - the text for the layer written to the legend
   */
  const draw_grid_dc_legend = function draw_grid_dc_legend(
    ctx, x, y, obj, dashed) {
    ctx.lineWidth = LEGEND_FONT_SIZE;
    ctx.strokeStyle = obj.color;
    text = obj.text;
    y = draw_line(ctx, x, y, dashed, text)
    return y;
  };

  // TODO: Add layer for legend

    // TODO: Clear context.
  // FIXME: width in globals is now 850.
  let x = 950 * SCALE;
  let x_offset = 10 * SCALE;
  let y = 200 * SCALE;
  // Offset for text
  let text_offset = 30 * SCALE;
    
  // Consider using Function.prototype.bind() to bind ctx, x, and y to the object's properties (draw function with params for stroke and width)
  for (let i = 0; i < layers.length; ++i) {
    if (layers[i].active) {
      switch (layers[i].name) {
        case 'oil-well':
          y = draw_well_legend(ctx, x, y, oil_and_gas_props.wells.oil);
          break;
        case 'gas-well':
          console.log('gas-well switch');
          y = draw_well_legend(ctx, x, y, oil_and_gas_props.wells.gas);
          break;
        case 'gas-pipeline':
          y = draw_pipeline_legend(ctx, x, y, oil_and_gas_props.transport.gas);
          break;
        case 'oil-pipeline':
          y = draw_pipeline_legend(ctx, x, y, oil_and_gas_props.transport.oil);
          break;
        case 'oil-refinery':
          y = draw_refinery_legend(ctx, x, y);
          break;
        case 'railroad':
          y = draw_railroad_legend(ctx, x, y, railroad_props);
          break;
        case 'coal-mine':
          y = draw_coalmine_legend(ctx, x, y, mine_props);
          break;
        case 'coal-plant':
          y = draw_power_plant_legend(ctx, x, y, plant_classes.PLANT_CLASS_COAL);
          break;
        case 'geothermal-plant':
          y = draw_power_plant_legend(ctx, x, y, plant_classes.PLANT_CLASS_GEO);
          break;
        case 'hydro-plant':
          y = draw_power_plant_legend(ctx, x, y, plant_classes.PLANT_CLASS_HYC);
          break;
        case 'natural-gas-plant':
          y = draw_power_plant_legend(ctx, x, y, plant_classes.PLANT_CLASS_NG);
          break;
        case 'nuclear-plant':
          y = draw_power_plant_legend(ctx, x, y, plant_classes.PLANT_CLASS_NUC);
          break;
        case 'petroleum-plant':
          y = draw_power_plant_legend(ctx, x, y, plant_classes.PLANT_CLASS_PET);
          break;
        case 'solar-PV':
          y = draw_power_plant_legend(ctx, x, y, plant_classes.PLANT_CLASS_SUN);
          break;
        case 'wind-farms':
          y = draw_power_plant_legend(ctx, x, y, plant_classes.PLANT_CLASS_WND);
          break;
        case 'AC-lines-under-100-kV':
          y = draw_grid_ac_legend(ctx, x, y, grid_classes.AC_NA);
          console.log(y)
          y = draw_grid_ac_legend(ctx, x, y, grid_classes.AC_UNDER_100);
          break;
        case 'AC-lines-100-to-300-kV':
          y = draw_grid_ac_legend(ctx, x, y, grid_classes.AC_100_200);
          y = draw_grid_ac_legend(ctx, x, y, grid_classes.AC_200_300);
          break;
        case 'AC-lines-345-to-735-kV':
          y = draw_grid_ac_legend(ctx, x, y, grid_classes.AC_345);
          y = draw_grid_ac_legend(ctx, x, y, grid_classes.AC_500);
          y = draw_grid_ac_legend(ctx, x, y, grid_classes.AC_735_PLUS);
          break;
        case 'DC-lines':
          y = draw_grid_dc_legend(ctx, x, y, grid_classes.DC);
          break;
        case 'electrical-grid-ac-lines':
          y = draw_grid_ac_legend(ctx, x, y, );
          break;
        case 'electrical-grid-dc-lines':
          y = draw_grid_dc_legend(ctx, x, y, grid_classes.DC);
          break;
        case 'gas-processing':
          y = draw_processing_legend(ctx, x, y);
          break;
        case 'gas-storage':
          y = draw_storage_legend(ctx, x, y);
          break;
        default:
          break;
      }
    }
  }

  let draw_plants_legend = layers.filter(function(d) {
    return ["coal-plant", "geothermal-plant", "hydro-plant",
    "natural-gas-plant", "nuclear-plant", "petroleum-plant",
    "solar-PV", "wind-farms",].indexOf(d[0]) > -1;
  }).length > 0;
  if (draw_plants_legend) {
    // draw_circle(ctx, xy, Math.sqrt(r / Math.PI) * plant_classes.scale);
    // y +=
  }

};


