/**
 * @file Provides draw functions and any helpers for the electric grid, subdivided into separate classes.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 */

 /**
 * @type {Object} 
 * A collection of electric grid classifications, used to filter out and render separate portions of the grid.
 */
 let classes = {
  GRID_CLASS_NA: {
    name: 'NOT AVAILABLE',
    value: 0
  },
  GRID_CLASS_UNDER_100: { 
    name: 'Under 100',
    value: 1
  },
  GRID_CLASS_100_200: {
    name: '100-161',
    value: 2
  }, 
  GRID_CLASS_200_300: {
    name: '220-287',
    value: 3
  }, 
  GRID_CLASS_345: {
    name: '345',
    value: 4
  }, 
  GRID_CLASS_500: {
    name: '500',
    value: 5
  }, 
  GRID_CLASS_735_PLUS: {
    name: '735 and Above',
    value: 6
  },
  GRID_CLASS_DC: {
    name: 'DC',
    value: 7
  }
};

/**
 * Get the features you want from your GeoJSON FeatureCollection.
 * @param {Object} infrastructure - readfile
 * @param {Number} c - `classes` object member to compare readfile against
 */
const filter_features = function filter_features(infrastructure, c) {
  let features = infrastructure.features.filter(function(d) {
    return d.properties.class === c.name;
  });
  return features;
}
/**
 * A quick 'n dirty kludge to format electric grid line width for the calling grid class object
 * @param  {Number} value - value attached to the respective `classes` object member
 */
const line_width_kludge = function line_width_kludge(value) {
  // TODO: Replace magic numbers with descriptive variable names
      return viz.transport.rail.width *
      (1 + 3 / (1 + Math.exp(-3 * (value / ((7 - 1) / 1.25) -1 ))));
}

/**
 * Draw a grid class on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Array} xy - Array of xy coordinates 
 * @param {Object} c - object member of `classes`
 */
draw_grid_class = function draw_grid_class(ctx, queued_data, c) {
  let grid = queued_data[0];
  const path = get_path(ctx);
  let tmp_grid = {type: 'FeatureCollection', features: []};
  
  ctx.lineCap = 'round';

  features = filter_features(grid, c);

  let feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];

    if (c == classes.GRID_CLASS_DC) {
      // FIXME: Replace magic numbers with descriptive variable names
      ctx.lineWidth = viz.transport.rail.width *
      (1 + 3 / (1 + Math.exp(-3 * (features[i]['properties']['voltage'] / 500 - 1))));
      ctx.strokeStyle = 'black';
    } 
    
    else {
      ctx.lineWidth = line_width_kludge(c.value);
      ctx.strokeStyle = viz.grid.palette[c.value];
    }

    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();

      if (i === feat_len - 1) { 
        hide_spinner(); 
      }
    }
};

/**
 * Draw grid class unknown and under 100 on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Array} xy - Array of xy coordinates 
 */
const draw_grid_class_ac_unk_and_under_100 = function draw_grid_class_ac_unk_and_under_100(ctx, queued_data) {
  draw_grid_class(ctx, queued_data, classes.GRID_CLASS_NA);
  draw_grid_class(ctx, queued_data, classes.GRID_CLASS_UNDER_100);
};

/**
 * Draw grid class 100-300 on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Array} xy - Array of xy coordinates 
 */
const draw_grid_class_ac_100_300 = function draw_grid_class_ac_100_300(ctx, queued_data) {
  draw_grid_class(ctx, queued_data, classes.GRID_CLASS_100_200);
  draw_grid_class(ctx, queued_data, classes.GRID_CLASS_200_300);
};

/**
 * Draw grid class 345-735 on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Array} xy - Array of xy coordinates 
 */
const draw_grid_class_ac_345_735 = function draw_grid_class_ac_345_735(ctx, queued_data) {
  draw_grid_class(ctx, queued_data, classes.GRID_CLASS_345);
  draw_grid_class(ctx, queued_data, classes.GRID_CLASS_500);
  draw_grid_class(ctx, queued_data, classes.GRID_CLASS_735_PLUS);
};

/**
 * Draw grid class DC on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Array} xy - Array of xy coordinates 
 */
const draw_grid_class_dc = function draw_grid_class_dc (ctx, queued_data) {
  console.log('electrical-grid-dc-lines');
  draw_grid_class(ctx, queued_data, classes.GRID_CLASS_DC);
}