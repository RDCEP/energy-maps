

const draw_pipes = function draw_pipes(ctx, queued_data) {
  console.log('draw_pipes');

  let o_pipe = queued_data[0];
  let op_pipe = queued_data[1];
  let g_pipe = queued_data[2];
  const path = get_path(ctx);

  // Gas pipeline
  ctx.lineCap = 'round';
  ctx.strokeStyle = viz.transport.gas.stroke;
  ctx.lineWidth = viz.transport.gas.width;
  ctx.beginPath();
  path(g_pipe);
  ctx.stroke();

  // Oil pipeline
  ctx.strokeStyle = viz.transport.oil.stroke;
  ctx.lineWidth = viz.transport.oil.width;
  ctx.beginPath();
  path(o_pipe);
  ctx.stroke();
  ctx.lineWidth = viz.transport.oil_product.width;
  ctx.strokeStyle = viz.transport.oil_product.stroke;
  ctx.setLineDash([viz.transport.oil_product.dash,
                   viz.transport.oil_product.dash +
                   2 * viz.transport.oil_product.width]);
  ctx.beginPath();
  path(op_pipe);
  ctx.stroke();
  ctx.setLineDash([]);

};

const draw_gas_wells = function draw_gas_wells(queued_data) {
  console.log('draw_gas_wells');

  let wells = queued_data[0];

  wells.forEach(function(d) {
    let xy = projection([+d.lon, +d.lat]);
    if (xy === null) {
      //
    } else {
      draw_well(xy, viz.wells.gas);
    }
  });
};

const draw_oil_wells = function draw_oil_wells(queued_data) {
  console.log('draw_oil_wells');

  let wells = queued_data[0];

  wells.forEach(function(d) {
    let xy = projection([+d.lon, +d.lat]);
    if (xy === null) {
      //
    } else {
      if (d.class === 'Off') {
        draw_off_well(xy);
      } else {
        draw_well(xy, viz.wells.oil);
      }
    }
  });

};

const draw_all_wells = function draw_all_wells(ctx, queued_data) {
  console.log('draw_all_wells');

  let wells = queued_data[0];

  wells.forEach(function(d) {
    let xy = projection([+d.lon, +d.lat]);
    if (xy === null) {
      return;
    } else {
      if (d.class === 'Off') {
        draw_off_well(ctx, xy);
      } else if (d.oilgas === 'GAS') {
        draw_well(ctx, xy, viz.wells.gas);
      } else {
        draw_well(ctx, xy, viz.wells.oil);
      }
    }
  });

};

const draw_processing = function draw_processing(ctx, queued_data) {
  console.log('draw_processing');

  let gproc = queued_data[0];
  let gstor = queued_data[1];

  gproc.forEach(function(d) {
    let xy = projection([+d.lon, +d.lat]);
    draw_gas_processor(ctx, xy);
  });

  gstor.forEach(function(d) {
    let xy = projection([+d.lon, +d.lat]);
    draw_gas_storage(ctx, xy);
  });

};

const draw_refining = function draw_refining(ctx, queued_data) {
  console.log('draw_refining');

  let oref = queued_data[0].features;

  oref.forEach(function(d) {
    let procs = ['Atm_Dist', 'Vac_Dist', 'Cat_Crack', 'Visbreak',
      'Cat_Reform', 'Desulfur', 'Coking', 'Hydro_Crac', 'Alky_Iso'];
    let r = 0;
    for (let i = 0; i < procs.length; ++i) {
      if (d.properties.hasOwnProperty(procs[i])) {
        r += +d.properties[procs[i]];
      }
    }
    d.r = r;
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
  ctx.beginPath();
  ctx.fillStyle = viz.process.oil_refinery.fill;
  draw_circle(ctx, xy, viz.process.oil_refinery.size * r);
  ctx.fill();
};

const draw_off_well = function draw_off_well(ctx, xy) {
  ctx.strokeStyle = viz.wells.off;
  ctx.lineWidth = viz.wells.stroke;
  ctx.beginPath();
  draw_x(ctx, xy, viz.wells.cross);
  ctx.stroke();
};

