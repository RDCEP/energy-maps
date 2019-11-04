let classes = [
  'NOT AVAILABLE',
  'Under 100',
  '100-161', '220-287', '345', '500', '735 and Above',
  'DC'
];

/**
 * Draw grid class unavailable on the electric grid infrastructure map.
 * @param {Object} ctx
 * @param {coal_mine[]} queued_data
 */
const draw_grid_class_unavailable = function draw_grid_class_unavailable(ctx, queued_data) {
  console.log('draw_grid_class_unavailable')

  let grid = queued_data[0];

  const path = get_path(ctx);

  let tmp_grid = {type: 'FeatureCollection', features: []};

  ctx.lineCap = 'round';

  // Class unavailable
  let features = grid.features.filter(function(d) {
    return d.properties.class === classes[0]; });
  
  let feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];
    ctx.lineWidth = viz.transport.rail.width;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }

}

const draw_grid_class_ac_under_100 = function draw_grid_class_ac_under_100(ctx, queued_data) {
  console.log('electrical-grid-ac-lines-under-100-kv')

  let grid = queued_data[0];

  const path = get_path(ctx);

  let tmp_grid = {type: 'FeatureCollection', features: []};

  ctx.lineCap = 'round';

  // Class ac under 100
  let features = grid.features.filter(function(d) {
    return d.properties.class === classes[1]});

  let feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];
    ctx.lineWidth = viz.transport.rail.width;
    ctx.strokeStyle = 'purple';
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }

// let features2 = grid.features.filter(function(d) {
//   return d.properties.class === classes[2]});

//   let feat_len = features2.length;
//   for (let i = 0; i < feat_len; ++i) {
//     tmp_grid.features = [features2[i]];
//     ctx.lineWidth = viz.transport.rail.width;
//     ctx.strokeStyle = 'purple';
//     ctx.beginPath();
//     path(tmp_grid);
//     ctx.stroke();
//   }

}

/**
 * Draw grid class 100-200 on the electric grid infrastructure map.
 * @param {Object} ctx
 * @param {coal_mine[]} queued_data
 */
const draw_grid_class_ac_100_200 = function draw_grid_class_ac_100_200(ctx, queued_data) {
  console.log('electrical-grid-ac-lines-100-200')

  let grid = queued_data[0];

  const path = get_path(ctx);

  let tmp_grid = {type: 'FeatureCollection', features: []};

  ctx.lineCap = 'round';

  // Class ac 100 to 200
  let features = grid.features.filter(function(d) {
    return d.properties.class === classes[2]});

  let feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];
    ctx.lineWidth = viz.transport.rail.width;
    ctx.strokeStyle = viz.grid.palette[2];
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }

}

const draw_grid_class_ac_200_300 = function draw_grid_class_ac_200_300 (ctx, queued_data) {
  console.log('electrical-grid-ac-lines-200-to-300-kv')

  let grid = queued_data[0];

  const path = get_path(ctx);

  let tmp_grid = {type: 'FeatureCollection', features: []};

  ctx.lineCap = 'round';

  let features = grid.features.filter(function(d) {
    return d.properties.class === classes[3]; });
  
  let feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];
    ctx.lineWidth = viz.transport.rail.width;
    ctx.strokeStyle = viz.grid.palette[5];
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }

}

const draw_grid_class_ac_345 = function draw_grid_class_ac_345 (ctx, queued_data) {
  console.log('electrical-grid-ac-lines-345-kV')

  let grid = queued_data[0];

  const path = get_path(ctx);

  let tmp_grid = {type: 'FeatureCollection', features: []};

  ctx.lineCap = 'round';

  let features = grid.features.filter(function(d) {
    return d.properties.class === classes[4]; });
  
  let feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];
    ctx.lineWidth = viz.transport.rail.width;
    ctx.strokeStyle = 'rgba(255, 255, 51)';
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }

}

const draw_grid_class_ac_500 = function draw_grid_class_ac_500 (ctx, queued_data) {
  console.log('electrical-grid-ac-lines-500-kV')

  let grid = queued_data[0];

  const path = get_path(ctx);

  let tmp_grid = {type: 'FeatureCollection', features: []};

  ctx.lineCap = 'round';

  let features = grid.features.filter(function(d) {
    return d.properties.class === classes[5]; });
  
  let feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];
    ctx.lineWidth = viz.transport.rail.width;
    ctx.strokeStyle = 'rgba(255, 127, 0)';
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }

}

const draw_grid_class_ac_735 = function draw_grid_class_ac_735 (ctx, queued_data) {
  console.log('electrical-grid-ac-lines-735+-kV')

  let grid = queued_data[0];

  const path = get_path(ctx);

  let tmp_grid = {type: 'FeatureCollection', features: []};

  ctx.lineCap = 'round';

  let features = grid.features.filter(function(d) {
    return d.properties.class === classes[6]; });
  
  let feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];
    ctx.lineWidth = viz.transport.rail.width;
    ctx.strokeStyle = 'rgba(228, 26, 28)';
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }

}

const draw_grid_class_ac = function draw_grid_class_ac(ctx, queued_data) {
  console.log('draw_grid_class_ac')

  let grid = queued_data[0];

  const path = get_path(ctx);

  let tmp_grid = {type: 'FeatureCollection', features: []};

  ctx.lineCap = 'round';
  
  // AC voltage classes
  let features = grid.features
    .filter(function(d) {
      // Sort voltage ratings in ascending order
      return classes.slice(1, classes.length-1).indexOf(d.properties.class) >= 0 ; })
    .sort((a, b) => (a.properties.voltage > b.properties.voltage) ? 1 : -1);
  feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    let voltage = features[i].properties.voltage;
    let volt_class = features[i].properties.class;
    tmp_grid.features = [features[i]];
    let idx = classes.slice(1, classes.length-1).indexOf(volt_class);
    ctx.lineWidth = viz.transport.rail.width *
      (1 + 3 / (1 + Math.exp(-3 * (idx / ((classes.length - 1) / 2) -1 ))));
    ctx.strokeStyle = viz.grid.palette[idx];
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }
  
  // unavailable 
  console.log('draw_grid_class_unavailable')

  tmp_grid = {type: 'FeatureCollection', features: []};

  features = grid.features.filter(function(d) {
    return d.properties.class === classes[0]; });

  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];
    ctx.lineWidth = viz.transport.rail.width;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }
}

const draw_grid_class_dc = function draw_grid_class_dc(ctx, queued_data) {
  console.log('draw_grid_class_dc')

  let grid = queued_data[0];

  const path = get_path(ctx);

  let tmp_grid = {type: 'FeatureCollection', features: []};

  ctx.lineCap = 'round';

  // DC voltage class
  features = grid.features
    .filter(function(d) {
      return d.properties.class === classes[classes.length-1]; });
  feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];
    ctx.lineWidth = viz.transport.rail.width *
      (1 + 3 / (1 + Math.exp(-3 * (features[i]['properties']['voltage'] / 500 - 1))));
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }
} 


/**
 * Draw grid on the electric grid infrastructure map.
 * @param {Object} ctx
 * @param {coal_mine[]} queued_data
 */
const draw_grid = function draw_grid(ctx, queued_data) {
  console.log('draw_grid');

  let grid = queued_data[0];

  const path = get_path(ctx);

  let tmp_grid = {type: 'FeatureCollection', features: []};
  // A way to filter the grid into kv capacity, no longer in use
  let bins = [100, 200, 300, 350, 500, 1000];
  // let classes = [
  //   'NOT AVAILABLE',
  //   'Under 100',
  //   '100-161', '220-287', '345', '500', '735 and Above',
  //   'DC'
  // ];

  ctx.lineCap = 'round';

  // Class unavailable
  let features = grid.features.filter(function(d) {
    return d.properties.class === classes[0]; });
  
  let feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];
    ctx.lineWidth = viz.transport.rail.width;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }

  // AC voltage classes
  features = grid.features
    .filter(function(d) {
      // Sort voltage ratings in ascending order
      return classes.slice(1, classes.length-1).indexOf(d.properties.class) >= 0 ; })
    .sort((a, b) => (a.properties.voltage > b.properties.voltage) ? 1 : -1);
  feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    let voltage = features[i].properties.voltage;
    let volt_class = features[i].properties.class;
    tmp_grid.features = [features[i]];
    let idx = classes.slice(1, classes.length-1).indexOf(volt_class);
    ctx.lineWidth = viz.transport.rail.width *
      (1 + 3 / (1 + Math.exp(-3 * (idx / ((classes.length - 1) / 2) -1 ))));
    ctx.strokeStyle = viz.grid.palette[idx];
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }

  // DC voltage class
  features = grid.features
    .filter(function(d) {
      return d.properties.class === classes[classes.length-1]; });
  feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];
    ctx.lineWidth = viz.transport.rail.width *
      (1 + 3 / (1 + Math.exp(-3 * (features[i]['properties']['voltage'] / 500 - 1))));
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();
  }

};

// const draw_grid2 = function draw_railroads(ctx, queued_data) {
//   console.log('test_grid');

//   let grid = queued_data[0];
//   console.log(grid.features[0].properties);

//   console.log('VOLT_CLASSES',
//     d3.map(grid.features, function(d) { return d.properties.VOLT_CLASS; }).keys()
//   );

//   console.log('TYPES',
//     d3.map(grid.features, function(d) { return d.properties.TYPE; }).keys()
//   );

//   console.log('500',
//     grid.features.filter(function(d) {
//       return d.properties.VOLT_CLASS === '500';
//     }));

//   console.log('735',
//     grid.features.filter(function(d) {
//       return d.properties.VOLT_CLASS === '735 and Above';
//     }));

//   console.log('-999999',  // 23129 v. 335
//     grid.features.filter(function(d) {
//       return d.properties.VOLTAGE === -999999
//         && d.properties.VOLT_CLASS !== 'NOT AVAILABLE';
//     }));



//   let all_volts = d3.map(
//     grid.features, function(d) { return d.properties.VOLTAGE; }
//   ).keys();

//   console.log(all_volts.sort());

//   console.log(1);

//   let max_volt = d3.max(grid.features, function(d) {
//     return d.properties.VOLTAGE;
//   });

//   let bins =[50, 100, 150, 200, 250,
//             300, 400, 500, 750, 1000];
//   let bins_dict = {};

//   for (let i = 0; i < grid.features.length; ++i) {
//     let d = grid.features[i];
//     let voltage = d.properties.VOLTAGE;

//     if (voltage < 0) {
//       ctx.strokeStyle = 'white';
//     } else {
//       let idx = bins.findIndex(function(n) { return n >= voltage; });
//       ctx.strokeStyle = d3.schemeSpectral[bins.length][idx];
//     }
//   }

// };

// const draw_grid_old = function draw_railroads(ctx, queued_data) {
//   console.log('draw_grid');

//   let grid = queued_data[0];
//   console.log(grid.features.length);

//   const path = get_path(ctx);

//   let tmp_grid = {type: 'FeatureCollection', features: []};
//   let bins = [100, 200, 300, 350, 500, 1000];

//   let features = grid.features.filter(function(d) {
//     return d.properties.voltage === -999999; });

//   for (let i = 0; i < features.length; ++i) {
//     let d = features[i];
//     tmp_grid.features = [d];
//     ctx.lineWidth = viz.transport.rail.width;
//     ctx.strokeStyle = 'white';
//     ctx.beginPath();
//     path(tmp_grid);
//     ctx.stroke();
//   }

//   features = grid.features
//     .filter(function(d) {
//       return d.properties.voltage !== -999999; })
//     // .sort((a, b) => (a.properties.voltage > b.properties.voltage) ? -1 : 1);
//     .sort((a, b) => (a.properties.voltage > b.properties.voltage) ? 1 : -1);

//   for (let i = 0; i < features.length; ++i) {
//     let d = features[i];
//     let voltage = d.properties.voltage;
//     tmp_grid.features = [d];
//     let idx = bins.findIndex(function(n) { return n > voltage; });
//     // ctx.lineWidth = viz.transport.rail.width * (1 + bins[idx] / 1000);
//     ctx.lineWidth = viz.transport.rail.width * (1 + bins[idx] / 500);
//     ctx.strokeStyle = viz.grid.palette[idx];
//     ctx.beginPath();
//     path(tmp_grid);
//     ctx.stroke();
//   }

// };
