
const update_legend = function update_legend(ctx, layers) {

  const draw_well_legend = function draw_well_legend(ctx, x, y, color, text) {
    console.log('well symbol');
    // Offset for text
    let offset = 30 * SCALE;
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
    ctx.fillText(`Well, ${text}`, offset + x, y);
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
    ctx.fillText(`Offshore well, ${text}`, offset + x, y);
    return y;
  };

  const draw_pipeline_legend = function draw_pipeline_legend(
    ctx, x, y, color, width, dashed, text) {
    // Offset for text
    let offset = 30 * SCALE;
    // Advance vertical increment
    y += 15 * SCALE;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (dashed) {
      ctx.setLineDash(dashed);
    }
    ctx.beginPath();
    ctx.moveTo(x + 10 * SCALE, y);
    ctx.lineTo(offset + x - 30 * SCALE, y);
    ctx.stroke();
    // Advance vertical increment for type
    y += 5 * SCALE;
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    ctx.fillText(`Pipeline, ${text}`, offset + x, y);
    return y;
  };

  const draw_processing_legend = function draw_processing_legend(
    ctx, x, y, color) {
    // Offset for text
    let offset = 30 * SCALE;
    // Advance vertical increment
    y += 15 * SCALE;
    draw_gas_processor(ctx, [x, y]);
    y += 5 * SCALE;
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    ctx.fillText('Gas processing', offset + x, y);
    return y;
  };

  const draw_storage_legend = function draw_storage_legend(
    ctx, x, y, color) {
    // Offset for text
    let offset = 30 * SCALE;
    // Advance vertical increment
    y += 15 * SCALE;
    draw_gas_storage(ctx, [x, y]);
    y += 5 * SCALE;
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    ctx.fillText('Gas storage', offset + x, y);
    return y;
  };

  const draw_refinery_legend = function draw_refinery_legend(
    ctx, x, y, color) {
    x = text_x - 8 * SCALE - r;
    y += r + 20 * SCALE;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.font = `bold ${14 * SCALE}px Arial`;
    ctx.fillText(`${cap / 10} M bpy`, text_x, y + 7 * SCALE);
    y += r;
  };

  const draw_power_plant_legend = function draw_power_plant_legend(
    ctx, x, y, color, text) {
    let offset = 30 * SCALE;
    ctx.fillStyle = color;
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
    ctx.fillText(`Power plant, ${text}`, offset + x, y);
    return y;
  };

  // TODO: Add layer for legend

    // TODO: Clear context.
  // FIXME: width in globals is now 850.
  let x = 950 * SCALE;
  let x_offset = 10 * SCALE;
  let y = 200 * SCALE;

  for (let i = 0; i < layers.length; ++i) {
    if (layers[i][1]) {
      switch (layers[i][0]) {
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
          break;
        case 'railroad':
          break;
        case 'coal-mine':
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
        case 'wind-plant':
          y = draw_power_plant_legend(ctx, x, y, viz.plants.wind, 'Wind');
          break;
        case 'electrical-grid-unavailable-kv':
          break;
        case 'electrical-grid-ac-lines':
          break;
        case 'electrical-grid-dc-lines':
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
    "solar-plant", "wind-plant",].indexOf(d[0]) > -1;
  }).length > 0;
  if (draw_plants_legend) {
    // draw_circle(ctx, xy, Math.sqrt(r / Math.PI) * viz.plants.scale);
    // y +=
  }

};
