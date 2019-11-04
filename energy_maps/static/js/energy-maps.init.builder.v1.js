(function() {
  'use strict';

  /** @type {string} */
  /** @description Sets the path for the base map */
  const fmap = '../static/json/us-geojson.json';
  /** @type {string} */
  /** @description Sets the fill for the base map */
  const fmapfill = '../static/json/gz_2010_us_040_00_20m.json';

  const spinner = document.getElementById('spinner');
  const show_spinner = function show_spinner() {
    spinner.style.display = "block";
  };
  const hide_spinner = function hide_spinner() {
    spinner.style.display = "none";
  };

  // Set base map canvas
  /** @description A canvas element for the base map, attached to
   *  <div class="main map builder" id="mapcanvas">
   */
  const base_canvas = d3
    .select('.main.map.builder')
    .append('canvas')
    .attr('id', 'mapcanvas')
    .attr('width', width + SCALE * 400)
    .attr('height', height);
  const ctx = base_canvas.node().getContext('2d');
  ctx.LineCap = 'round';

  function draw_base_map() {
    Promise.all(
      [d3.json(fmap), d3.json(fmapfill)]
    ).then(function(files) {
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
      Promise.all(lyr.draw[i].src.map(x => lyr.draw[i].w(x)))
        .then(function(files) {
          console.log('show spinner');
          show_spinner();
          lyr.draw[i].f(lyr.context, files);
        })
        // FIXME: this does not work. Spinner disappears too soon
        .then(function() {
          console.log('hide spinner');
          hide_spinner(); });
    }
  };

  let layers = [
    { name: 'electrical-grid-ac-lines-under-100-kv',
      value: 102_000_000_000,
      draw: [ {
        f: draw_grid_class_ac_unk_and_under_100,
        src: ['/static/json/elec_grid_split/grid-unk_under_100.json'],
        w: d3.json,
      } ]
    },
    { name: 'electrical-grid-ac-lines-100-to-300-kV',
      value: 167_000_000_000,
      draw: [ {
        f: draw_grid_class_ac_100_300,
        src: ['/static/json/elec_grid_split/grid-100_300.json'],
        w: d3.json,
      } ]
    },
    { name: 'electrical-grid-ac-lines-345-to-735-kV',
      value: 137_000_000_000,
      draw: [ {
        f: draw_grid_class_ac_345_735,
        src: ['/static/json/elec_grid_split/grid-345_735.json'],
        w: d3.json,
      } ]
    },
    { name: 'electrical-grid-dc-lines',
      value: 4_000_000_000,
      draw: [ {
        f: draw_grid_class_dc,
        src: ['/static/json/elec_grid_split/grid-dc.json'],
        w: d3.json,
      } ]
    },
    {
      name: 'gas-well',
      value: 1_059_000_000_000,
      draw: [ {
        f: draw_all_wells,
        src: [ '/static/csv/wells_gas1.csv',
               '/static/csv/wells_gas2.csv' ],
        w: d3.csv
      } ],
    },
    { name: 'oil-well',
      value: 654_000_000_000,
      draw: [ {
        f: draw_all_wells,
        src: [ '/static/csv/wells_oil1.csv',
               '/static/csv/wells_oil2.csv' ],
        w: d3.csv
      } ],
    },
    { name: 'gas-pipeline',
      value: 940_000_000_000,
      draw: [ {
        f: draw_gas_pipes,
        src: ['/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson'],
        w: d3.json
      }, ],

    },
    { name: 'oil-pipeline',
      value: 170_000_000_000,
      draw: [ {
        f: draw_oil_pipes,
        src: [ '/static/json/CrudeOil_Pipelines_US_Nov2014_clipped.geojson', ],
        w: d3.json
      }, {
        f: draw_oil_pipes,
        src: [ '/static/json/PetroleumProduct_Pipelines_US_Nov2014_clipped.geojson' ],
        w: d3.json
      }, ],
    },
    { name: 'gas-processing',
      value: 45_000_000_000,
      draw: [ {
        f: draw_processing,
        src: [ '/static/csv/nproc.csv' ],
        w: d3.csv
      } ]
    },
    { name: 'oil-refinery',
      value: 373_000_000_000, // 373 B
      draw: [ {
        f: draw_refining,
        src: [ '/static/json/Petroleum_Refineries_US_2015.geojson' ],
        w: d3.json
      }]

    },
    { name: 'railroad',
      value: 137_000_000_000,
      // `137 B *` Needs an asterisk because this is 1/3 of
      // the value of the freight railway shown
      draw: [ {
        f: draw_railroads,
        src: [ '/static/json/railrdl020.geojson' ],
        w: d3.json
      } ]
    },
    { name: 'coal-mine',
      value: 57_000_000_000,
      draw: [ {
        f: draw_coal_mines,
        src: [ '/static/csv/coal.csv' ], // FIXME: All data in JSON
        w: d3.csv
      } ]
    },
    { name: 'coal-plant',
      value: 1_092_000_000_000,
      draw: [ {
        f: draw_coal_plants,
        src: ['/static/json/power_plants_split/power_plants-COAL.json'],
        w: d3.json,
      } ]
    },
    { name: 'geothermal-plant',
      value: 22_000_000_000,
      draw: [ {
        f: draw_geo_plants,
        src: ['/static/json/power_plants_split/power_plants-GEO.json'],
        w: d3.json,
      } ]
    },
    { name: 'hydro-plant',
      value: 597_000_000_000,
      draw: [ {
        f: draw_hydro_plants,
        src: ['/static/json/power_plants_split/power_plants-HYC.json'],
        w: d3.json,
      } ]
    },
    { name: 'natural-gas-plant',
      value: 488_000_000_000,
      draw: [ {
        f: draw_ng_plants,
        src: ['/static/json/power_plants_split/power_plants-NG.json'],
        w: d3.json,
      } ]
    },
    { name: 'nuclear-plant',
      value: 597_000_000_000,
      draw: [ {
        f: draw_nuclear_plants,
        src: ['/static/json/power_plants_split/power_plants-NUC.json'],
        w: null,
      } ]
    },
    { name: 'petroleum-plant',
      value: 64_000_000_000,
      draw: [ {
        f: draw_petro_plants,
        src: ['/static/json/power_plants_split/power_plants-PET.json'],
        w: d3.json,
      } ]
    },
    { name: 'solar-plant',
      value: 14_000_000_000,
      draw: [ {
        f: draw_solar_plants,
        src: ['/static/json/power_plants_split/power_plants-SUN.json'],
        w: d3.json,
      } ]
    },
    { name: 'wind-farms',
      value: 132_000_000_000,
      draw: [ {
        f: draw_wind_farms,
        src: ['/static/json/power_plants_split/power_plants-WND.json'],
        w: d3.json,
      } ]
    },
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

    console.log(lyr.context);

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
