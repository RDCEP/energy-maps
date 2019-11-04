
const update_legend = function update_legend(ctx, layers) {

  const draw_well_legend = function draw_well_legend(
    ctx, x, y, color, text) {
    console.log('well symbol');
    // Advance vertical increment
    y += 15 * SCALE;
    ctx.strokeStyle = color;
    ctx.strokeWidth = viz.wells.stroke;
    ctx.fillStyle = color;
    ctx.beginPath();
    // Draw circle
    draw_circle(ctx, [x, y], viz.wells.diameter * 3);
    ctx.stroke();
    ctx.fill();
    // Advance vertical increment for type
    y += 5 * SCALE;
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    ctx.fillText(`${text} well`, text_offset + x, y);
    // Advance vertical increment
    y += 15 * SCALE;
    ctx.strokeStyle = color;
    ctx.lineWidth = viz.wells.stroke;
    ctx.beginPath();
    draw_x(ctx, [x, y], viz.wells.cross);
    ctx.stroke();
    // Advance vertical increment for type
    y += 5 * SCALE;
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    ctx.fillText(`${text} offshore well`, text_offset + x, y);
    return y;
  };

  const draw_pipeline_legend = function draw_pipeline_legend(
    ctx, x, y, color, width, dashed, text) {
    // Advance vertical increment
    y += 15 * SCALE;
    ctx.lineCap = 'round';
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
    y += 5 * SCALE;
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    ctx.fillText(`${text} pipeline`, text_offset + x, y);
    return y;
  };

  const draw_processing_legend = function draw_processing_legend(
    ctx, x, y, color) {
    // Advance vertical increment
    y += 15 * SCALE;
    draw_gas_processor(ctx, [x, y]);
    y += 5 * SCALE;
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    ctx.fillText('Gas processing', text_offset + x, y);
    return y;
  };

  const draw_storage_legend = function draw_storage_legend(
    ctx, x, y, color) {
    // Advance vertical increment
    y += 15 * SCALE;
    draw_gas_storage(ctx, [x, y]);
    y += 5 * SCALE;
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    ctx.fillText('Gas storage', text_offset + x, y);
    return y;
  };

  const draw_refinery_legend = function draw_refinery_legend(
    ctx, x, y, color) {
    y += 15 * SCALE;
    draw_oil_refinery(ctx, [x, y], 200000*viz.process.oil_refinery.size);
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 5 * SCALE;
    ctx.fillText('Oil refinery', text_offset + x, y);
    return y;
  };

  const draw_coalmine_legend = function draw_coalmine_legend(
    ctx, x, y, color) {
    y += 15 * SCALE;
    draw_mine(ctx, [x, y], false, 1000000000*viz.process.oil_refinery.size);
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 5 * SCALE;
    ctx.fillText('Coal mine', text_offset + x, y);
    return y;
  };

  const draw_power_plant_legend = function draw_power_plant_legend(
    ctx, x, y, color, text) {
    ctx.fillStyle = color;
    ctx.strokeStyle = viz.plants.stroke.light;
    ctx.lineWidth = viz.plants.stroke.width;
    if (color === viz.plants.gas ||
        color === viz.plants.solar)
    {
      ctx.strokeStyle = viz.plants.stroke.dark;
    }
    // x = r * 2 - 20 * SCALE + xo;
    y += 18 * SCALE;
    ctx.beginPath();
    draw_circle(ctx, [x, y], 7 * SCALE);
    ctx.stroke();
    ctx.fill();
    // ctx.fillRect(x, y, 20 * SCALE, 20 * SCALE);
    // solar font
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 5 * SCALE;
    let plant_text = text == 'Wind' ? 'farm' : 'power plant';
    ctx.fillText(`${text} ${plant_text}`, text_offset + x, y);
    return y;
  };

  const draw_railroad_legend = function draw_railroad_legend(
    ctx, x, y, color, width, dashed, text) {
    // Advance vertical increment
    y += 15 * SCALE;
    ctx.lineCap = 'round';
    ctx.strokeStyle = viz.transport.rail.stroke;
    ctx.lineWidth = viz.transport.rail.width;
    ctx.beginPath();
    ctx.moveTo(x - 7 * SCALE, y);
    ctx.lineTo(x + 7 * SCALE, y);
    ctx.stroke();
    // Advance vertical increment for type
    y += 5 * SCALE;
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    ctx.fillText(`Railroads`, text_offset + x, y);
    return y;
  };

  const draw_grid_ac_legend = function draw_grid_ac_legend(
    ctx, x, y, color, width, dashed, text) {
    let bins = [100, 200, 300, 350, 500, 1000];
    let bin_labels = ['Under 100 kV', '100–200 kV',
      '200–300 kV', '345 kV', '500 kV', '735+ kV'];
    // Voltage swatches
    for (let i = 0; i < bins.length; ++i) {
      y += 15 * SCALE;
      ctx.strokeStyle = viz.grid.palette[i];
      ctx.lineWidth = viz.transport.rail.width *
        (1 + 3 / (1 + Math.exp(-3 * (i / ((bins.length - 1) / 2) -1 ))));
      ctx.beginPath();
      ctx.moveTo(x - 7 * SCALE, y);
      ctx.lineTo(x + 7 * SCALE, y);
      ctx.stroke();
      y += 5 * SCALE;
      ctx.fillStyle = viz.black;
      ctx.font = `bold ${14 * SCALE}px Arial`;
      ctx.fillText(`${bin_labels[i]} kV AC`, text_offset + x, y);
    }
    return y;
  };

  const draw_grid_dc_legend = function draw_grid_dc_legend(
    ctx, x, y, color, width, dashed, text) {
    y += 15 * SCALE;
    ctx.lineWidth = viz.transport.rail.width *
      (1 + 3 / (1 + Math.exp(-3 * (1000 / 500 - 1))));
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(x - 7 * SCALE, y);
    ctx.lineTo(x + 7 * SCALE, y);
    ctx.stroke();
    y += 5 * SCALE;
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    ctx.fillText(`500–1000 kV DC`, text_offset + x, y);
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
            ctx, x, y, viz.oil, 'Oil');
          break;
        case 'gas-well':
          console.log('gas-well switch');
          y = draw_well_legend(
            ctx, x, y, viz.gas, 'Gas');
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
        case 'solar-plant':
          y = draw_power_plant_legend(ctx, x, y, viz.plants.solar, 'Solar');
          break;
        case 'wind-farms':
          y = draw_power_plant_legend(ctx, x, y, viz.plants.wind, 'Wind');
          break;
        case 'electrical-grid-unavailable-kv':
          break;
        case 'electrical-grid-ac-lines':
          y = draw_grid_ac_legend(ctx, x, y);
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
    "solar-plant", "wind-farms",].indexOf(d[0]) > -1;
  }).length > 0;
  if (draw_plants_legend) {
    // draw_circle(ctx, xy, Math.sqrt(r / Math.PI) * viz.plants.scale);
    // y +=
  }

};
