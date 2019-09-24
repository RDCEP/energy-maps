(function() {
  'use strict';

  // Path Group: Base map

  /** @type {string} */
  /** @description Sets the path for the base map */
  const fmap = '../static/json/us-geojson.json';
  /** @type {string} */
  /** @description Sets the fill for the base map */
  const fmapfill = '../static/json/gz_2010_us_040_00_20m.json';

  // Set base map canvas
  /** @description A canvas element for the base map, attached to div 'main map builder' with id='mapcanvas' */
  const base_canvas = d3
    .select('.main.map.builder')
    .append('canvas')
    .attr('id', 'mapcanvas')
    .attr('width', width + SCALE * 400)
    .attr('height', height);
  const ctx = base_canvas.node().getContext('2d');
  ctx.LineCap = 'round';

  function draw_base_map() {
    Promise.all([d3.json(fmap), d3.json(fmapfill)]).then(function(files) {
      draw_land(ctx, files, false);
    });
    console.log('draw base map');
  }

  // Set legend canvas
  let legend_canvas = d3
    .select('.map.legend')
    .append('canvas')
    .attr('id', 'legendcanvas')
    .attr('width', width + SCALE * 400)
    .attr('height', height);
  let legend_ctx = legend_canvas.node().getContext('2d');
  ctx.LineCap = 'round';
  
  const load_layer_data = function load_layer_data(lyr) {
    for (let i = 0; i < lyr.draw.length; ++i) {
      Promise.all(lyr.draw[i].src.map(x => d3.json(x)))
        .then(function(files) {
          lyr.draw[i].f(lyr.context, files);
        });
    }
  };

  let layers = [
    // FIXME: The layers commented out will break this code.
    //  This code assumes that all data is json (no csv). Further
    //  it assumes every row of data will be drawn---so no passing of
    //  the entire power plants file to draw only geothermal.

    // {
    //   name: 'gas-well',
    //   value: 1_059_000_000_000, // 1.06B || 1,059 B -- US only}
    //   src: [ '/static/csv/wells_gas1.csv',
    //          '/static/csv/wells_gas2.csv' ], // FIXME: All data in JSON
    //   f: draw_all_wells,
    //   timer: 2000,
    // },
    // { name: 'oil-well',
    //   value: 654_000_000_000, // 654 B
    //   src: [ '/static/csv/wells_oil1.csv',
    //          '/static/csv/wells_oil2.csv' ], // FIXME: All data in JSON
    //   f: draw_all_wells,
    // },
    { name: 'gas-pipeline',
      value: 940_000_000_000, // 940 B
      draw: [ {
          f: draw_gas_pipes,
          src: ['/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson']
        }, ],
    },
    { name: 'oil-pipeline',
      value: 170_000_000_000, // 170 B (includes oil product pipelines)
      draw: [ {
        f: draw_oil_pipes,
        src: [ '/static/json/CrudeOil_Pipelines_US_Nov2014_clipped.geojson', ]
      }, {
        f: draw_oil_pipes,
        src: [ '/static/json/PetroleumProduct_Pipelines_US_Nov2014_clipped.geojson' ]
      }, ],
    },
    // { name: 'gas-processing',
    //   value: 45_000_000_000, // 45 B
    //   src: [ '/static/csv/nproc.csv' ], // FIXME: All data in JSON
    // },
    // { name: 'oil-refinery',
    //   value: 373_000_000_000, // 373 B
    //   src: [ '/static/json/Petroleum_Refineries_US_2015.geojson' ],
    // },
    // { name: 'railroad',
    //   value: 137_000_000_000, // `137 B *` Needs an asterisk because this is 1/3 of the value of the freight railway shown
    //   src: [ '../static/json/railrdl020.geojson' ],
    // },
    // { name: 'coal-mine',
    //   value: 57_000_000_000, // 57 B
    //   src: [ '../static/csv/coal.csv' ], // FIXME: All data in JSON
    // },
    // { name: 'coal-plant',
    //   value: 1_092_000_000_000, // $1092 B ($1100 B) -- currently displays as 1T, and only updates if something increases it by over 1B
    //   src: [  ], // FIXME: Need to separate power plants
    // },
    // { name: 'geothermal-plant',
    //   value: 22_000_000_000, // $22 B
    //   src: [  ], // FIXME: Need to separate power plants
    // },
    // { name: 'hydro-plant',
    //   value: 597_000_000_000, // 597 B
    //   src: [  ], // FIXME: Need to separate power plants
    // },
    // { name: 'natural-gas-plant',
    //   value: 488_000_000_000, // $488 B ($490 B)
    //   src: [  ], // FIXME: Need to separate power plants
    // },
    // { name: 'nuclear-plant',
    //   value: 597_000_000_000, // $597 B ($600 B)
    //   src: [  ], // FIXME: Need to separate power plants
    // },
    // { name: 'petroleum-plant',
    //   value: 64_000_000_000, // $64 B
    //   src: [  ], // FIXME: Need to separate power plants
    // },
    // { name: 'solar-plant',
    //   value: 14_000_000_000, // $14 B
    //   src: [  ], // FIXME: Need to separate power plants
    // },
    // { name: 'wind-plant',
    //   value: 132_000_000_000, // $132 B ($130 B)
    //   src: [  ], // FIXME: Need to separate power plants
    // },
    // // { name: 'complete-electrical-grid' },
    // { name: 'electrical-grid-unavailable-kv',
    //   value: 2_946_000_000_000, // 2.95T || 2,946 B
    //   src: [  ], // FIXME: Need to separate transmission grid
    // },
    // { name: 'electrical-grid-ac-lines',
    //   value: 2_238_000_000_000, // $2238 B ($2240 B), also includes substations
    //   src: [  ], // FIXME: Need to separate transmission grid
    // },
    // { name: 'electrical-grid-dc-lines',
    //   value: 4_900_000_000, // $3.9 B ($4 B)
    //   src: [  ], // FIXME: Need to separate transmission grid
    // },
  ];
  
  let lay = layers.length;
  
  for (let i = 0; i < lay; i++) {
    let lyr = layers[i];
    lyr.canvas = d3
      .select('.map.wrapper')
      .append('div')
      .attr('class', `map layer ${lyr.name}`)
      .append('canvas')
      .attr('class', `map layer canvas ${lyr.name}`)
      .attr('width', width + SCALE * 400)
      .attr('height', height);

    console.log(`<div map layer ${lyr}> created!`);

    lyr.context = lyr.canvas.node().getContext('2d');
    lyr.context.lineCap = 'round';

    console.log(lyr.context); // currently displaying 'undefined'

    layers[i].checkbox = d3
      .select('.options')
      .insert('span')
      .append('label')
      .text(`${lyr.name.replace(/ /g, '\u00A0')
        .replace(/-/g, '\u2011')}\u00A0`)
      .append('input')
      .attr('type', 'checkbox')
      .attr('class', `checkbox ${lyr.name}`)
      .attr('data-assetvalue', lyr.value);

    layers[i].active = false;

    lyr.counter = 0;
    lyr.checkbox.on('change', function() {

      lyr.counter++;

      if (lyr.counter % 2 === 0) {

        lyr.context.clearRect(0, 0, width, height);
        lyr.active = false;
        
        console.log(`layer[i].name counter is even, value of ${lyr.counter}`);
        
        d3.select(`.map.layer.${lyr.name}`)
          .append('canvas')
          .attr('class', `map layer canvas ${lyr.name}`)
          .attr('width', width + SCALE * 400)
          .attr('height', height);

        decrement_asset_total(lyr.value);

      } else {

        console.log(`${lyr.name} counter is odd, value of ${lyr.counter}`);

        load_layer_data(lyr);
        load(lyr.timer);
        lyr.active = true;

        console.log(lyr.value);

        increment_asset_total(lyr.value);
      }

      // TODO: Arguably the legend context should be cleared in the
      //  update_legend() function.
      legend_ctx.clearRect(0, 0, width, height);
      update_legend(legend_ctx, layers);

    });
  }

  draw_base_map();

})();