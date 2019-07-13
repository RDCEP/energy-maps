const plants_legend = function plants_legend(ctx, nff) {
  let cap = 5000;
  let r = Math.sqrt(cap / Math.PI) * viz.plants.scale;

  let xo = 1620 * SCALE;
  // Title
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${24 * SCALE}px Arial`;
  let x = 10 * SCALE + xo;
  let y = 550 * SCALE;
  ctx.fillText('US power plants', x, y);
  ctx.font = `bold ${18 * SCALE}px Arial`;
  y += 24 * SCALE;
  ctx.fillText('by fuel type & capacity', x, y);

  x = r * 2 - 20 * SCALE + xo;
  let text_x = x + 30 * SCALE;

  if (nff) {

    // Fuel swatches
    // solar swatch
    ctx.fillStyle = viz.plants.solar;
    x = r * 2 - 20 * SCALE + xo;
    y += 18 * SCALE;
    ctx.fillRect(x, y, 20 * SCALE, 20 * SCALE);
    // solar font
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    text_x = x + 30 * SCALE;
    y += 15 * SCALE;
    ctx.fillText('Solar', text_x, y);

    // wind swatch
    ctx.fillStyle = viz.plants.wind;
    x = r * 2 - 20 * SCALE + xo;
    y += 10 * SCALE;
    ctx.fillRect(x, y, 20 * SCALE, 20 * SCALE);
    // wind font
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 15 * SCALE;
    ctx.fillText('Wind', text_x, y);

    // hydro swatch
    ctx.fillStyle = viz.plants.hydro;
    x = r * 2 - 20 * SCALE + xo;
    y += 10 * SCALE;
    ctx.fillRect(x, y, 20 * SCALE, 20 * SCALE);
    // hydro font
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 15 * SCALE;
    ctx.fillText('Hydro', text_x, y);

    // nuclear swatch
    ctx.fillStyle = viz.plants.nuclear;
    x = r * 2 - 20 * SCALE + xo;
    y += 10 * SCALE;
    ctx.fillRect(x, y, 20 * SCALE, 20 * SCALE);
    // hydro font
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 15 * SCALE;
    ctx.fillText('Nuclear', text_x, y);

    // geo swatch
    ctx.fillStyle = viz.plants.geo;
    x = r * 2 - 20 * SCALE + xo;
    y += 10 * SCALE;
    ctx.fillRect(x, y, 20 * SCALE, 20 * SCALE);
    // hydro font
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 15 * SCALE;
    ctx.fillText('Geothermal', text_x, y);

    // nff swatch
    ctx.fillStyle = viz.white;
    ctx.strokeStyle = viz.black;
    ctx.strokeWidth = 1;
    x = r * 2 - 20 * SCALE + xo;
    y += 10 * SCALE;
    ctx.strokeRect(x, y, 20 * SCALE, 20 * SCALE);
    // hydro font
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 15 * SCALE;
    ctx.fillText('Fossil fuel', text_x, y);

  } else {
    // Fuel swatches
    // gas swatch
    ctx.fillStyle = viz.plants.gas;
    x = r * 2 - 20 * SCALE + xo;
    y += 18 * SCALE;
    ctx.fillRect(x, y, 20 * SCALE, 20 * SCALE);
    // hydro font
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 15 * SCALE;
    ctx.fillText('Natural gas', text_x, y);

    // oil swatch
    ctx.fillStyle = viz.plants.oil;
    x = r * 2 - 20 * SCALE + xo;
    y += 10 * SCALE;
    ctx.fillRect(x, y, 20 * SCALE, 20 * SCALE);
    // hydro font
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 15 * SCALE;
    ctx.fillText('Petroleum', text_x, y);

    // coal swatch
    ctx.fillStyle = viz.plants.coal;
    x = r * 2 - 20 * SCALE + xo;
    y += 10 * SCALE;
    ctx.fillRect(x, y, 20 * SCALE, 20 * SCALE);
    // hydro font
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 15 * SCALE;
    ctx.fillText('Coal', text_x, y);

    // nff swatch
    ctx.fillStyle = viz.white;
    ctx.strokeStyle = viz.black;
    ctx.strokeWidth = 1;
    x = r * 2 - 20 * SCALE + xo;
    y += 10 * SCALE;
    ctx.strokeRect(x, y, 20 * SCALE, 20 * SCALE);
    // hydro font
    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    y += 15 * SCALE;
    ctx.fillText('Non-fossil fuel', text_x, y);

  }

  ctx.fillStyle = viz.black;
  ctx.strokeStyle = viz.black;
  ctx.lineWidth = SCALE;

  // let cap = 5000;
  // let r = Math.sqrt(cap / Math.PI) * viz.plants.scale;
  x = text_x - 8 * SCALE - r;
  y += r + 20 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap} MW`, text_x, y + 7 * SCALE);
  y += r;

  cap = 1000;
  r = Math.sqrt(cap / Math.PI) * viz.plants.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 10 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap} MW`, text_x, y + 3 * SCALE);
  y += r;

  cap = 250;
  r = Math.sqrt(cap / Math.PI) * viz.plants.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 10 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap} MW`, text_x, y + 3 * SCALE);
  y += r;

  cap = 50;
  r = Math.sqrt(cap / Math.PI) * viz.plants.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 10 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap} MW`, text_x, y + 3 * SCALE);
  y += r;

  cap = 10;
  r = Math.sqrt(cap / Math.PI) * viz.plants.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 10 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap} MW`, text_x, y + 3 * SCALE);

};

const wells_legend = function wells_legend(ctx) {
  let cap = 2000;
  // let r = Math.sqrt(cap / Math.PI) * viz.plants.scale;
  let r = viz.process.oil_refinery.size * cap;

  let xo = 1620 * SCALE;
  // Title
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${24 * SCALE}px Arial`;
  let x = 10 * SCALE + xo;
  let y = 550 * SCALE;
  ctx.fillText('US gas & oil', x, y);
  ctx.font = `bold ${18 * SCALE}px Arial`;
  y += 24 * SCALE;
  ctx.fillText('including wells,', x, y);
  y += 20 * SCALE;
  ctx.fillText('transportation,', x, y);
  y += 20 * SCALE;
  ctx.fillText('processing, & storage', x, y);

  // ctx.font = 'bold 18px Arial';
  // y += 24;
  // ctx.fillText('by fuel type & capacity', x, y);

  x = r * 2 - 20 * SCALE + xo;
  let text_x = x + 30 * SCALE;

  y += 5 * SCALE;

  // Gas well
  y += 15 * SCALE;
  ctx.strokeStyle = viz.gas;
  ctx.strokeWidth = viz.wells.stroke;
  ctx.fillStyle = viz.gas;
  ctx.beginPath();
  draw_circle(ctx, [x, y], viz.wells.diameter * 3);
  ctx.stroke();
  ctx.fill();

  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  y += 5 * SCALE;
  ctx.fillText('Gas well', text_x, y);

  // Oil well
  y += 15 * SCALE;
  ctx.strokeStyle = viz.oil;
  ctx.strokeWidth = viz.wells.stroke;
  ctx.fillStyle = viz.oil;
  ctx.beginPath();
  draw_circle(ctx, [x, y], viz.wells.diameter * 3);
  ctx.stroke();
  ctx.fill();

  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  y += 5 * SCALE;
  ctx.fillText('Oil well', text_x, y);

  // Offshore well
  y += 15 * SCALE;
  draw_off_well(ctx, [x, y]);
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  y += 5 * SCALE;
  ctx.fillText('Off-shore well', text_x, y);

  // Gas pipeline
  y += 15 * SCALE;
  ctx.lineCap = 'round';
  ctx.strokeStyle = viz.transport.gas.stroke;
  ctx.lineWidth = viz.transport.gas.width;
  ctx.beginPath();
  ctx.moveTo(xo + 10 * SCALE, y);
  ctx.lineTo(text_x - 30 * SCALE, y);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  y += 5 * SCALE;
  ctx.fillText('Gas pipeline', text_x, y);

  // Oil pipeline
  y += 15 * SCALE;
  ctx.lineCap = 'round';
  ctx.strokeStyle = viz.transport.oil.stroke;
  ctx.lineWidth = viz.transport.oil.width;
  ctx.beginPath();
  ctx.moveTo(xo + 10 * SCALE, y);
  ctx.lineTo(text_x - 30 * SCALE, y);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  y += 5 * SCALE;
  ctx.fillText('Oil pipeline', text_x, y);

  // Oil product pipeline
  y += 15 * SCALE;
  ctx.lineCap = 'round';
  ctx.strokeStyle = viz.transport.oil_product.stroke;
  ctx.lineWidth = viz.transport.oil_product.width;
  ctx.setLineDash([viz.transport.oil_product.dash,
                   viz.transport.oil_product.dash +
                   2 * viz.transport.oil_product.width]);
  ctx.beginPath();
  ctx.moveTo(xo + 10 * SCALE, y);
  ctx.lineTo(text_x - 30 * SCALE, y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  y += 5 * SCALE;
  ctx.fillText('Oil product pipeline', text_x, y);

  // Gas processing
  y += 15 * SCALE;
  draw_gas_processor(ctx, [x, y]);
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  y += 5 * SCALE;
  ctx.fillText('Gas processing', text_x, y);

  // Gas storage
  y += 15 * SCALE;
  draw_gas_storage(ctx, [x, y]);
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  y += 5 * SCALE;
  ctx.fillText('Gas storage', text_x, y);

  // Oil refinery
  y += 15 * SCALE;
  draw_oil_refinery(ctx, [x, y], 200);
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  y += 5 * SCALE;
  ctx.fillText('Oil refinery', text_x, y);

  // Scales
  ctx.fillStyle = viz.black;
  ctx.strokeStyle = viz.black;
  ctx.lineWidth = SCALE;

  // let cap = 5000;
  // let r = Math.sqrt(cap / Math.PI) * viz.plants.scale;
  x = text_x - 8 * SCALE - r;
  y += r + 20 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap / 10} M bpy`, text_x, y + 7 * SCALE);
  y += r;

  cap = 1000;
  r = Math.sqrt(cap / Math.PI) * viz.plants.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 10 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap / 10} M bpy`, text_x, y + 3 * SCALE);
  y += r;

  cap = 250;
  r = Math.sqrt(cap / Math.PI) * viz.plants.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 10 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap / 10} M bpy`, text_x, y + 3 * SCALE);
  y += r;

  cap = 50;
  r = Math.sqrt(cap / Math.PI) * viz.plants.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 10 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap / 10} M bpy`, text_x, y + 3 * SCALE);
  y += r;

  cap = 10;
  r = Math.sqrt(cap / Math.PI) * viz.plants.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 10 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap / 10} M bpy`, text_x, y + 3 * SCALE);


};

const coal_legend = function coal_legend(ctx) {
  let cap = 100000000;
  let r = Math.sqrt(cap / Math.PI) * viz.mines.scale;

  let xo = 1620 * SCALE;
  // Title
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${24 * SCALE}px Arial`;
  let x = 10 * SCALE + xo;
  let y = 550 * SCALE;
  ctx.fillText('US coal', x, y);
  ctx.font = `bold ${18 * SCALE}px Arial`;
  y += 24 * SCALE;
  ctx.fillText('including mines', x, y);
  y += 20 * SCALE;
  ctx.fillText('& railroads', x, y);

  x = r - 20 * SCALE + xo;
  let text_x = x + 30 * SCALE;
  y += 5 * SCALE;

  // Scales
  ctx.fillStyle = viz.black;
  ctx.strokeStyle = viz.black;
  ctx.lineWidth = SCALE;

  x = text_x - 8 * SCALE - r;
  y += r + 20 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap / 1000000} M tpy`, text_x, y + 7 * SCALE);
  y += r;

  cap = 10000000;
  r = Math.sqrt(cap / Math.PI) * viz.mines.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 5 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap / 1000000} M tpy`, text_x, y + 3 * SCALE);
  y += r;

  cap = 2000000;
  r = Math.sqrt(cap / Math.PI) * viz.mines.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 10 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap / 1000000} M tpy`, text_x, y + 3 * SCALE);
  y += r;

  cap = 500000;
  r = Math.sqrt(cap / Math.PI) * viz.mines.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 15 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap} tpy`, text_x, y + 3 * SCALE);
  y += r;

  cap = 10000;
  r = Math.sqrt(cap / Math.PI) * viz.mines.scale;
  x = text_x - 8 * SCALE - r ;
  y += r + 20 * SCALE;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${14 * SCALE}px Arial`;
  ctx.fillText(`${cap} tpy`, text_x, y + 3 * SCALE);
  y += r;

};

const grid_legend = function grid_legend(ctx, max) {
  let xo = 1620 * SCALE;
  // Title
  ctx.fillStyle = viz.black;
  ctx.font = `bold ${24 * SCALE}px Arial`;
  let x = 10 * SCALE + xo;
  let y = 550 * SCALE;
  ctx.fillText('US electrical grid', x, y);
  ctx.font = `bold ${18 * SCALE}px Arial`;
  y += 24 * SCALE;
  ctx.fillText('by voltage', x, y);

  let swatch = 16;
  x = xo + swatch / 2 * SCALE;
  let text_x = x + 30 * SCALE;

  let bins = [100, 200, 300, 350, 500, 1000];
  let bin_labels = ['Unknown', 'Under 100', '100–200',
    '200–300', '345', '500', '735+', 'HVDC'];
  // Voltage swatches
  for (let i = 0; i < (bins.length + 2); ++i) {
    y += 12 * SCALE;
    if (i === 0) {
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'white';
      ctx.strokeRect(x, y, swatch * SCALE, swatch * SCALE);
    } else if (i <= bins.length) {
      ctx.fillStyle = viz.grid.palette[i-1];
      // ctx.fillStyle = d3.schemeSet1[i-1];
      ctx.fillRect(x, y, swatch * SCALE, swatch * SCALE);
    } else {
      ctx.fillStyle = 'black';
      ctx.fillRect(x, y, swatch * SCALE, swatch * SCALE);
    }

    ctx.fillStyle = viz.black;
    ctx.font = `bold ${14 * SCALE}px Arial`;
    text_x = x + swatch * 1.5 * SCALE;
    y += 12 * SCALE;
    if (i <= bins.length) {
      ctx.fillText(`${bin_labels[i]} kV`, text_x, y);
    } else {
      ctx.fillText(`${bin_labels[i]}`, text_x, y);
    }

  }

};
