/**
 * @file Provides draw functions and any helpers for the map legend.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 */

 // TODO: Factor out repetitive behavior
 
 // TODO: Document functions

const LEGEND_FONT = `bold ${14 * SCALE}px Arial`;
const VERTICAL_INCREMENT = 15 * SCALE;

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
  y += 5 * SCALE;
  ctx.fillStyle = viz.black;
  ctx.font = LEGEND_FONT;
  ctx.fillText(`${text}`, text_offset + x, y);
  return y;
}

function advance_vertical_increment(y, ctx, color) {
  y += VERTICAL_INCREMENT;
  ctx.strokeStyle = color;
  ctx.strokeWidth = viz.wells.stroke;
  ctx.fillStyle = color;
  ctx.beginPath();
  return y;
}

const update_legend = function update_legend(ctx, layers) {

  // FIXME: Integrating advance_vertical_increment() has exacerbated a pre-existing bug, in which activating a grid layer would alter the appearance
  // of circles drawn to the legend by draw_circle(). This bug was already up on the live site. After integrating advance_vertical_increment() to this block,
  // the x's drawn to the legend by draw_x() are also getting blown out. 
  const draw_well_legend = function draw_well_legend(
    ctx, x, y, color, text) {
    console.log('well symbol');
    // Advance vertical increment
    y += VERTICAL_INCREMENT;
    ctx.strokeStyle = color;
    ctx.strokeWidth = viz.wells.stroke;
    ctx.fillStyle = color;
    ctx.beginPath();
    // y = advance_vertical_increment(y, ctx, color);
    // Draw circle
    draw_circle(ctx, [x, y], viz.wells.diameter * 3);
    ctx.stroke();
    ctx.fill();
    // Advance vertical increment for type
    y = advance_for_type(y, ctx, text, text_offset, x);
    // Advance vertical increment
    y += VERTICAL_INCREMENT;
    ctx.strokeStyle = color;
    ctx.lineWidth = viz.wells.stroke;
    ctx.beginPath();
    // y = advance_vertical_increment(y, ctx, color);
    // draw x
    draw_x(ctx, [x, y], viz.wells.cross);
    ctx.stroke();
    // Advance vertical increment for type
    text = `${text.slice(0, 3)} offshore well`
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  const draw_pipeline_legend = function draw_pipeline_legend(
    ctx, x, y, color, width, dashed, text) {

    // Advance vertical increment
    y += VERTICAL_INCREMENT;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (dashed) {
      ctx.setLineDash(dashed);
    }
    ctx.beginPath();
    ctx.moveTo(x - 7 * SCALE, y);
    ctx.lineTo(x + 7 * SCALE, y);
    ctx.stroke();
    // Advance vertical increment for type
    text = `${text} pipeline`
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  const draw_processing_legend = function draw_processing_legend(
    ctx, x, y, color) {
    // Advance vertical increment
    y += VERTICAL_INCREMENT;
    draw_gas_processor(ctx, [x, y]);
    text = `Gas processing`
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  const draw_storage_legend = function draw_storage_legend(
    ctx, x, y, color) {
    // Advance vertical increment
    y += VERTICAL_INCREMENT;
    draw_gas_storage(ctx, [x, y]);
    text = 'Gas storage'
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  const draw_refinery_legend = function draw_refinery_legend(
    ctx, x, y, color) {
    y += VERTICAL_INCREMENT;
    draw_oil_refinery(ctx, [x, y], 200000*viz.process.oil_refinery.size);
    text = 'Oil refinery';
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  const draw_coalmine_legend = function draw_coalmine_legend(
    ctx, x, y, color) {
    y += VERTICAL_INCREMENT;
    draw_mine(ctx, [x, y], false, 1000000000*viz.process.oil_refinery.size);
    text = 'Coal mine'
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  const draw_power_plant_legend = function draw_power_plant_legend(
    ctx, x, y, color, text) {
    ctx.fillStyle = color;
    ctx.strokeStyle = viz.plants.stroke.light;
    ctx.lineWidth = viz.plants.stroke.width;
    if (color === viz.plants.gas) {
      ctx.strokeStyle = 'darkblue';
    } else if (color === viz.plants.solar)
    {
      ctx.strokeStyle = 'darkorange';
      // ctx.strokeStyle = viz.plants.stroke.dark;
    }
    // x = r * 2 - 20 * SCALE + xo;
    y += 18 * SCALE;
    ctx.beginPath();
    draw_circle(ctx, [x, y], 7 * SCALE);
    ctx.stroke();
    ctx.fill();
    // ctx.fillRect(x, y, 20 * SCALE, 20 * SCALE);
    // solar font
    let plant_text = text == 'Wind' ? 'farm' : 'power plant';
    text = `${text} ${plant_text}`
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  const draw_railroad_legend = function draw_railroad_legend(
    ctx, x, y, color, width, dashed, text) {
    // Advance vertical increment
    y += VERTICAL_INCREMENT;
    ctx.strokeStyle = viz.transport.rail.stroke;
    ctx.lineWidth = viz.transport.rail.width;
    ctx.beginPath();
    ctx.moveTo(x - 7 * SCALE, y);
    ctx.lineTo(x + 7 * SCALE, y);
    ctx.stroke();
    // Advance vertical increment for type
    text = `Railroads`;
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };

  const draw_grid_ac_legend = function draw_grid_ac_legend(
    ctx, x, y, bin_list) {
    let bins = [100, 200, 300, 350, 500, 1000];
    let bin_labels = ['Unknown kV AC', 'Under 100 kV AC', '100–200 kV AC',
      '200–300 kV AC', '345 kV AC', '500 kV AC', '735 kV AC'];
    // Voltage swatches
    for (let i = 0; i < bin_list.length; ++i) {
      let j = bin_list[i];
      y += VERTICAL_INCREMENT;
      ctx.strokeStyle = viz.grid.palette[j];
      // FIXME: This is a kludge for drawing a white swatch for unknown kV
      if (j === 0) {
        ctx.strokeStyle = 'rgba(76, 76, 76)'; 
        ctx.lineWidth = 1 * SCALE;
        ctx.strokeRect(x - 7 * SCALE, y - 7, 14 * SCALE, 14 * SCALE);
      } else {
        ctx.lineWidth = 14 * SCALE;
        ctx.beginPath();
        ctx.moveTo(x - 7 * SCALE, y);
        ctx.lineTo(x + 7 * SCALE, y);
        ctx.stroke();
      }
      text = `${bin_labels[j]}`;
      y = advance_for_type(y, ctx, text, text_offset, x);
    }
    return y;
  };

  const draw_grid_dc_legend = function draw_grid_dc_legend(
    ctx, x, y, color, width, dashed, text) {
    y += VERTICAL_INCREMENT;
    ctx.lineWidth = 14 * SCALE;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(x - 7 * SCALE, y);
    ctx.lineTo(x + 7 * SCALE, y);
    ctx.stroke();
    text = `500–1000 kV DC`;
    y = advance_for_type(y, ctx, text, text_offset, x);
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
    
  for (let i = 0; i < layers.length; ++i) {
    if (layers[i].active) {
      switch (layers[i].name) {
        case 'oil-well':
          y = draw_well_legend(
            ctx, x, y, viz.oil, 'Oil well');
          break;
        case 'gas-well':
          console.log('gas-well switch');
          y = draw_well_legend(
            ctx, x, y, viz.gas, 'Gas well');
          break;
        case 'gas-pipeline':
          y = draw_pipeline_legend(ctx, x, y,
            viz.transport.gas.stroke, viz.transport.gas.width,
            false, 'Gas');
          break;
        case 'oil-pipeline':
          y = draw_pipeline_legend(ctx, x, y,
            viz.transport.oil.stroke, viz.transport.oil.width,
            false, 'Oil');
          break;
        case 'oil-refinery':
          y = draw_refinery_legend(ctx, x, y);
          break;
        case 'railroad':
          y = draw_railroad_legend(ctx, x, y);
          break;
        case 'coal-mine':
          y = draw_coalmine_legend(ctx, x, y);
          break;
        case 'coal-plant':
          y = draw_power_plant_legend(ctx, x, y, viz.plants.coal, 'Coal');
          break;
        case 'geothermal-plant':
          y = draw_power_plant_legend(ctx, x, y, viz.plants.geo, 'Geothermal');
          break;
        case 'hydro-plant':
          y = draw_power_plant_legend(ctx, x, y, viz.plants.hydro, 'Hydro');
          break;
        case 'natural-gas-plant':
          y = draw_power_plant_legend(ctx, x, y, viz.plants.gas, 'Natural gas');
          break;
        case 'nuclear-plant':
          y = draw_power_plant_legend(ctx, x, y, viz.plants.nuclear, 'Nuclear');
          break;
        case 'petroleum-plant':
          y = draw_power_plant_legend(ctx, x, y, viz.plants.oil, 'Petroleum');
          break;
        case 'solar-PV':
          y = draw_power_plant_legend(ctx, x, y, viz.plants.solar, 'Solar');
          break;
        case 'wind-farms':
          y = draw_power_plant_legend(ctx, x, y, viz.plants.wind, 'Wind');
          break;
        case 'AC-lines-under-100-kV':
          y = draw_grid_ac_legend(ctx, x, y, [0, 1]);
          break;
        case 'AC-lines-100-to-300-kV':
          y = draw_grid_ac_legend(ctx, x, y, [2, 3]);
          break;
        case 'AC-lines-345-to-735-kV':
          y = draw_grid_ac_legend(ctx, x, y, [4, 5, 6]);
          break;
        case 'DC-lines':
          y = draw_grid_dc_legend(ctx, x, y);
          break;
        case 'electrical-grid-ac-lines':
          y = draw_grid_ac_legend(ctx, x, y, );
          break;
        case 'electrical-grid-dc-lines':
          y = draw_grid_dc_legend(ctx, x, y);
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
    // draw_circle(ctx, xy, Math.sqrt(r / Math.PI) * viz.plants.scale);
    // y +=
  }

};


