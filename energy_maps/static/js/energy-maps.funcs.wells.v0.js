

const draw_gas_pipes = function draw_gas_pipes(ctx, queued_data) {
  console.log('draw_gas_pipes');

  let pipe_data = queued_data[0];
  const path = get_path(ctx);

  ctx.lineCap = 'round';
  ctx.strokeStyle = viz.transport.gas.stroke;
  ctx.lineWidth = viz.transport.gas.width;
  ctx.beginPath();
  path(pipe_data);
  ctx.stroke();
  ctx.setLineDash([]);
  hide_spinner();
};

const draw_oil_pipes = function draw_pipes(ctx, queued_data) {
  console.log('draw_pipes');

  let oil_pipe_data = queued_data[0];
  let oil_prod_pipe_data = queued_data[1];
  const path = get_path(ctx);

  // Oil pipeline
  ctx.strokeStyle = viz.transport.oil.stroke;
  ctx.lineWidth = viz.transport.oil.width;
  ctx.beginPath();
  path(oil_pipe_data);
  ctx.stroke();
  ctx.lineWidth = viz.transport.oil_product.width;
  ctx.strokeStyle = viz.transport.oil_product.stroke;
  ctx.setLineDash([viz.transport.oil_product.dash,
                   viz.transport.oil_product.dash +
                   2 * viz.transport.oil_product.width]);
  ctx.beginPath();
  path(oil_prod_pipe_data);
  ctx.stroke();
  ctx.setLineDash([]);
  hide_spinner();
};

/**
 * Get a set of xy coordinates on the map projection for each element in the dataset.
 * @param {array} queued_data -- the supplied dataset
 */
const get_xy = function get_xy(queued_data) {
  let wells = queued_data[0];
  
  wells.forEach(function(d) { 
    let xy = projection([+d.lon, +d.lat]);
    return xy 
  });

}

const draw_gas_wells = function draw_gas_wells(queued_data) {
  console.log('draw_gas_wells');

  get_xy(queued_data);
  draw_well(xy, viz.wells.gas)

};

const draw_oil_wells = function draw_oil_wells(queued_data) {
  console.log('draw_oil_wells');

  get_xy(queued_data)
  if (d.class === 'Off') {
    draw_off_well(xy);
  } else {
    draw_well(xy, viz.wells.oil);
  }

};

const draw_all_wells = function draw_all_wells(ctx, queued_data) {
  console.log('draw_all_wells');

  let wells = queued_data[0];

  wells.forEach(function(d, i) {
    let xy = projection([+d.lon, +d.lat]);
    if (xy === null) {
      return;
    } else {
      if (d.oilgas === 'GAS') {
        if (d.class === 'Off') {
          draw_off_well(ctx, xy, viz.wells.gas);
        } else {
          draw_well(ctx, xy, viz.wells.gas);
        }
      } else {
        if (d.class === 'Off') {
          draw_off_well(ctx, xy, viz.wells.oil);
        } else {
          draw_well(ctx, xy, viz.wells.oil);
        }
      }
    }
    if (i === wells.length - 1) { hide_spinner(); }
  });

};

const draw_processing = function draw_processing(ctx, queued_data) {
  console.log('draw_processing');

  let gproc = queued_data[0];
  let gstor = queued_data[1];

  gproc.forEach(function(d, i) {
    let xy = projection([+d.lon, +d.lat]);
    draw_gas_processor(ctx, xy);
    if (i === gproc.length - 1) { hide_spinner(); }
  });

  gstor.forEach(function(d) {
    let xy = projection([+d.lon, +d.lat]);
    draw_gas_storage(ctx, xy);
  });

};

const draw_refining = function draw_refining(ctx, queued_data) {
  console.log('draw_refining');

  let oref = queued_data[0].features;

  oref.forEach(function(d, i) {
    let procs = ['Atm_Dist', 'Vac_Dist', 'Cat_Crack', 'Visbreak',
      'Cat_Reform', 'Desulfur', 'Coking', 'Hydro_Crac', 'Alky_Iso'];
    let r = 0;
    for (let i = 0; i < procs.length; ++i) {
      if (d.properties.hasOwnProperty(procs[i])) {
        r += +d.properties[procs[i]];
      }
    }
    d.r = r;
    if (i === oref.length - 1) { hide_spinner(); }
  });

  oref.sort(function(a, b) {
    return d3.descending(a.r, b.r);
  });

  oref.forEach(function(d) {
    let xy = projection(d.geometry.coordinates);
    draw_oil_refinery(ctx, xy, d.r);
    ctx.strokeStyle = viz.process.stroke.light;
    ctx.lineWidth = viz.process.stroke.width;
    ctx.beginPath();
    draw_circle(ctx, xy, viz.process.oil_refinery.size * d.r);
    ctx.stroke();
  });

};

const draw_well = function draw_well(ctx, xy, color) {
  ctx.strokeStyle = color;
  ctx.strokeWidth = viz.wells.stroke;
  ctx.fillStyle = color;
  ctx.beginPath();
  draw_circle(ctx, xy, viz.wells.diameter);
  ctx.stroke();
};

const draw_gas_processor = function draw_gas_processor(ctx, xy) {
  ctx.beginPath();
  ctx.fillStyle = viz.process.gas_process.fill;
  draw_triangle(ctx, xy, viz.process.gas_process.size);
  ctx.fill();
};

const draw_gas_storage = function draw_gas_storage(ctx, xy) {
  ctx.beginPath();
  ctx.fillStyle = viz.process.gas_storage.fill;
  draw_box(ctx, xy, viz.process.gas_storage.size);
  ctx.fill();
};

const draw_oil_refinery = function draw_oil_refinery(ctx, xy, r) {
  r *= viz.process.oil_refinery.size;
  ctx.fillStyle = viz.process.oil_refinery.fill;
  ctx.beginPath();
  let a = Math.PI / 2;
  let n = 6;
  ctx.moveTo (xy[0] + r * Math.cos(a), xy[1] + r * Math.sin(a));
  for (let i = 1; i <= n; ++i) {
    ctx.lineTo (xy[0] + r * Math.cos(a + i * 2 * Math.PI / n),
      xy[1] + r * Math.sin(a + i * 2 * Math.PI / n));
  }
  // draw_circle(ctx, xy, r);
  ctx.fill();
};

const draw_off_well = function draw_off_well(ctx, xy, color) {
  // ctx.strokeStyle = viz.wells.off;
  ctx.strokeStyle = color;
  ctx.lineWidth = viz.wells.stroke;
  ctx.beginPath();
  draw_x(ctx, xy, viz.wells.cross);
  ctx.stroke();
};

