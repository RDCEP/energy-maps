const fill_screen = false;

// vvv Original width and scale definitions vvv
// let width = 2000 * SCALE;

// if (!SCALE) {
//   width = screen.width;
//   SCALE = width / 2000;
// }
// ^^^ end original width and scale definitions ^^^

// alter the width variable below to change the scale of the map if you need to make UI adjustments
SCALE = 1;
let width = 1200 * SCALE;

const height = width / 2;
const padding = {top: 10, right: 10, bottom: 50, left: 50};

const viz = {
  white: 'rgba(255, 255, 255, 1)',
  black: 'rgba(0, 0, 0, 1)',
  gas: 'rgba(0, 191, 255)',
  oil: 'rgba(34, 139, 34)',
  coal: 'rgba(0, 0, 0)',
  plants: {
    gas: 'rgba(0, 191, 255, .5)',
    oil: 'rgba(34, 139, 34, .5)',
    hydro: 'rgba(11, 36, 251, .5)',
    wind: 'rgba(144, 29, 143, .5)',
    solar: 'rgba(255, 215, 0, .5)',
    geo: 'rgba(210, 105, 30, .5)',
    nuclear: 'rgba(255, 0, 0, .5)',
    coal: 'rgba(0, 0, 0, .5)',
    stroke: {
      light: 'rgba(255, 255, 255, 1)',
      dark: 'rgba(0, 0, 0, 1)',
      width: .66 * SCALE
    },
    scale: .3 * SCALE,
    // vvv Old Scale vvv
    // scale: .9 * SCALE,
  },
  wells: {
    gas: 'rgba(0, 191, 255, .5)',
    oil: 'rgba(34, 139, 34, .5)',
    off: 'rgba(34, 139, 34)',
    width: SCALE / 6,
    cross: 5 * SCALE,
    diameter: SCALE / 2,
    stroke: SCALE,
  },
  mines: {
    coal: {
      fill: 'rgba(0, 0, 0, 0.5)',
      stroke: 'rgba(255, 255, 255, 1)',
      width: SCALE
    },
    scale: SCALE / 190
    // vvv Old scale vvv
    // scale: SCALE / 90
  },
  process: {
    oil_refinery: {
      fill: 'rgba(60, 179, 113, .7)',
      size: .006 * SCALE 
      // vvv Old scale vvv
      // size: .015 * SCALE
    },
    gas_storage: {
      fill: 'rgb(45, 45, 45, .9)',
      size: 5 * SCALE
    },
    gas_process: {
      fill: 'rgba(0, 0, 139, .5)',
      size: 1.5 * SCALE
      // vvv Old scale vvv
      // size: 4 * SCALE
    },
    stroke: {
      light: 'rgba(255, 255, 255, 1)',
      width: SCALE * .75
    }
  },
  transport: {
    gas: {
      stroke: 'rgba(0, 191, 255, .5)',
      width: 1.8 * SCALE
    },
    oil: {
      stroke: '#3CB371',
      width: 1.5 * SCALE
    },
    oil_product: {
      stroke: '#3CB371',
      width: 2 * SCALE,
      dash: 2.5 * SCALE
    },
    rail: {
      stroke: '#767676',
      width: SCALE,
    }
  },
  grid: {
    palette: [
      'rgba(255, 255, 170)', // yellow
      // 'rgba(255, 214, 255)', // lilac
      'rgba(86, 180, 233)', // lt blue
      'rgba(55, 126, 184)', // blue
      // 'rgba(255, 127, 0)', // orange
      'rgba(255, 149, 0)', // orange
      // 'rgba(213, 94, 0)', // vermilion
      'rgba(213, 113, 45)', // vermilion
      'rgba(77, 175, 74)', // green
      // 'rgba(228, 26, 28)', // red
      'rgba(228, 53, 5)', // red
    ],
    palette_uni: [
      'rgba(0, 114, 178)', // blue
      'rgba(86, 180, 233)', // lt blue
      'rgba(0, 158, 115)',
      'rgba(230, 159, 0)',
      'rgba(204, 121, 167)',
      'rgba(213, 94, 0)',
    ],
    palette_set1: [
      'rgba(152, 78, 163)', // dk blue
      'rgba(55, 126, 184)', // blue
      'rgba(77, 175, 74)', // green
      'rgba(255, 127, 0)', // orange
      'rgba(255, 255, 51)', // yellow
      'rgba(228, 26, 28)', // red
    ],
    palette_div: [
      'rgba(44,123,182)',
      'rgba(171,217,233)',
      'rgba(255,255,191)',
      'rgba(253,174,97)',
      'rgba(26,152,80)', //
      'rgba(215,25,28)',
    ],
    palette_fuel: [ // Unused. Uses fuel colors and looks like shit.
      'rgba(144, 29, 143, .5)',
      'rgba(11, 36, 251, .5)',
      'rgba(34, 139, 34, .5)',
      'rgba(255, 215, 0, .5)',
      'rgba(255, 127, 0, .5)',
      'rgba(255, 0, 0, .5)',
    ]
  },
  map: {
    fill: '#dddddd',
    stroke: '#767676',
    ocean: '#ffffff',
    width: SCALE
  }

};


// create projection and path objects with which to draw geo objects

const projection = d3.geoAlbersUsa()
  .scale(width*1.1)
  .translate([width / 2.4, height / 2]);

// const canvas = d3.select('.main.map')
//   .append('canvas')
//   .attr('width', width + SCALE * 400)
//   .attr('height', height);
// const ctx = canvas.node().getContext('2d');
// ctx.LineCap = 'round';
//
// const path = d3.geoPath()
//   .projection(projection)
//   .pointRadius(2)
//   .context(ctx);

const path = d3.geoPath()
  .projection(projection)
  .pointRadius(2);

const get_path = function get_path(ctx) {
  return d3.geoPath()
    .projection(projection)
    .pointRadius(2)
    .context(ctx);
};