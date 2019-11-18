(function() {
  'use strict';

  /** @type {string} */
  /** @description Sets the path for the base map */
  const fmap = '../static/json/us-geojson.json';
  /** @type {string} */
  /** @description Sets the fill for the base map */
  const fmapfill = '../static/json/gz_2010_us_040_00_20m.json';

  const capitalize_first_letter = function capitalize_first_letter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  /** @description the total sum of asset values for all active layers */
  let asset_total_sum = 0;

  /** Add the passed value to the asset total array and compute the new value */
  function increment_asset_total(value) {
    asset_total_sum += value;
    display_asset_total();
  }

  /** Remove the passed value from the asset total array and compute the new value */
  function decrement_asset_total(value) {
    asset_total_sum -= value;
    display_asset_total();
  }

  /** Display total asset value of all active layers.
   * Currently using d3-format (https://github.com/d3/d3-format) for currency formatting.
   * Numeral.js (http://numeraljs.com/#format) was previously used for currency formatting.
   */
  function display_asset_total() {
    // FIXME: This is a horrible kludge in order to get space before units.
    //  Need to write a proper formatter.
    document.getElementById(
      "asset-totals"
    ).innerHTML = `${d3.format('$.2~s')(asset_total_sum)
      .replace(/G/, ' B')
      .replace(/T/, ' T')}`
    ;
  }

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
  
  /**
   * @description Call all draw methods for a given layer and render it to its canvas element. 
   * @param {*} lyr An object from layers[].
   */
  const load_layer_data = function load_layer_data(lyr) {
    for (let i = 0; i < lyr.draw.length; ++i) {
      console.log('show spinner');
      show_spinner();
      Promise.all(lyr.draw[i].src.map(x => lyr.draw[i].w(x)))
        .then(function(files) {
          lyr.draw[i].f(lyr.context, files);
        });
        // FIXME: this does not work. Spinner disappears too soon
    }
  };

  /** @description An array of objects representing resources to be rendered on top of the map canvas.
  @property {string}  name               - A canvas id.
  @property {number}  value              - Asset value in USD.
  @property {object}  draw[]             - An array of objects containing properties accessed by load_layer_data().
  @property {function}  draw[f]          - A draw function bound to each object.
  @property {string}  draw[src]          - A reference to the data source (json or csv).
  @property {function} draw[w]           - A call to a d3 data parse function.
  @property {string} column              -The class of the column that the layer's checkbox is written to.
     */
  let layers = [
    { name: 'AC-lines-under-100-kV',
      value: 102_000_000_000,
      draw: [ {
        f: draw_grid_class_ac_unk_and_under_100,
        src: ['/static/json/elec_grid_split/grid-unk_under_100.json'],
        w: d3.json,
      } ],
      column: 'electricity-transmission-and-distribution',
    },
    { name: 'AC-lines-100-to-300-kV',
      value: 167_000_000_000,
      draw: [ {
        f: draw_grid_class_ac_100_300,
        src: ['/static/json/elec_grid_split/grid-100_300.json'],
        w: d3.json,
      } ],
      column: 'electricity-transmission-and-distribution',
    },
    { name: 'AC-lines-345-to-735-kV',
      value: 137_000_000_000,
      draw: [ {
        f: draw_grid_class_ac_345_735,
        src: ['/static/json/elec_grid_split/grid-345_735.json'],
        w: d3.json,
      } ],
      column: 'electricity-transmission-and-distribution',
    },
    { name: 'DC-lines',
      value: 4_000_000_000,
      draw: [ {
        f: draw_grid_class_dc,
        src: ['/static/json/elec_grid_split/grid-dc.json'],
        w: d3.json,
      } ],
      column: 'electricity-transmission-and-distribution',
    },
    { name: 'electricity-distribution',
      value: 1_400_000_000_000,
      draw: false,
      column: 'electricity-transmission-and-distribution',
    },
    {
      name: 'gas-well',
      value: 1_059_000_000_000,
      draw: [ {
        f: draw_all_wells,
        src: [ '/static/csv/Wells_gas1.csv',
               '/static/csv/Wells_gas2.csv' ],
        w: d3.csv
      } ],
      column: 'oil-and-gas',
    },
    { name: 'oil-well',
      value: 654_000_000_000,
      draw: [ {
        f: draw_all_wells,
        src: [ '/static/csv/Wells_oil1.csv',
               '/static/csv/Wells_oil2.csv' ],
        w: d3.csv
      } ],
      column: 'oil-and-gas',
    },
    { name: 'foreign-oil-wells',
      value: 931_000_000_000,
      draw: false,
      column: 'oil-and-gas',
    },
    { name: 'foreign-gas-wells',
      value: 63_000_000_000,
      draw: false,
      column: 'oil-and-gas',
    },
    { name: 'gas-pipeline',
      value: 940_000_000_000,
      draw: [ {
        f: draw_gas_pipes,
        src: ['/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson'],
        w: d3.json
      }, ],
      column: 'oil-and-gas',
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
      column: 'oil-and-gas',
    },
    { name: 'oil-refinery',
      value: 373_000_000_000, // 373 B
      draw: [ {
        f: draw_refining,
        src: [ '/static/json/Petroleum_Refineries_US_2015.geojson' ],
        w: d3.json
      }],
      column: 'oil-and-gas',
    },
    { name: 'gas-processing',
      value: 45_000_000_000,
      draw: [ {
        f: draw_processing,
        src: [ '/static/csv/nproc.csv' ],
        w: d3.csv
      } ],
      column: 'oil-and-gas',
    },
    { name: 'oil-and-gas-storage',
      value: 181_000_000_000,
      draw: false,
      column: 'oil-and-gas',
    },
    { name: 'coal-mine',
      value: 57_000_000_000,
      draw: [ {
        f: draw_coal_mines,
        src: [ '/static/csv/coal.csv' ], // FIXME: All data in JSON
        w: d3.csv
      } ],
      column: 'coal',
    },
    { name: 'railroad',
      value: 137_000_000_000,
      // `137 B *` Needs an asterisk because this is 1/3 of
      // the value of the freight railway shown
      draw: [ {
        f: draw_railroads,
        src: [ '/static/json/railrdl020.geojson' ],
        w: d3.json
      } ],
      column: 'coal',
    },
    { name: 'coal-plant',
      value: 1_092_000_000_000,
      draw: [ {
        f: draw_coal_plants,
        src: ['/static/json/power_plants_split/power_plants-COAL.json'],
        w: d3.json,
      } ],
      column: 'electricity-generation',
    },
    { name: 'natural-gas-plant',
      value: 488_000_000_000,
      draw: [ {
        f: draw_ng_plants,
        src: ['/static/json/power_plants_split/power_plants-NG.json'],
        w: d3.json,
      } ],
      column: 'electricity-generation',
    },
    { name: 'petroleum-plant',
      value: 64_000_000_000,
      draw: [ {
        f: draw_petro_plants,
        src: ['/static/json/power_plants_split/power_plants-PET.json'],
        w: d3.json,
      } ],
      column: 'electricity-generation',
    },
    { name: 'nuclear-plant',
      value: 597_000_000_000,
      draw: [ {
        f: draw_nuclear_plants,
        src: ['/static/json/power_plants_split/power_plants-NUC.json'],
        w: d3.json,
      } ],
      column: 'electricity-generation',
    },
    { name: 'hydro-plant',
      value: 597_000_000_000,
      draw: [ {
        f: draw_hydro_plants,
        src: ['/static/json/power_plants_split/power_plants-HYC.json'],
        w: d3.json,
      } ],
      column: 'electricity-generation',
    },
    { name: 'wind-farms',
      value: 132_000_000_000,
      draw: [ {
        f: draw_wind_farms,
        src: ['/static/json/power_plants_split/power_plants-WND.json'],
        w: d3.json,
      } ],
      column: 'electricity-generation',
    },
    { name: 'solar-PV',
      value: 14_000_000_000,
      draw: [ {
        f: draw_solar_plants,
        src: ['/static/json/power_plants_split/power_plants-SUN.json'],
        w: d3.json,
      } ],
      column: 'electricity-generation',
    },
    { name: 'geothermal-plant',
      value: 22_000_000_000,
      draw: [ {
        f: draw_geo_plants,
        src: ['/static/json/power_plants_split/power_plants-GEO.json'],
        w: d3.json,
      } ],
      column: 'electricity-generation',
    },
    { name: 'biofuel',
      value: 51_000_000_000,
      draw: false,
      column: 'electricity-generation',
    }
  ];

  const button_columns = [
    { name: 'oil-and-gas',
    },
    { name: 'coal',
    },
    { name: 'electricity-generation',
    },
    { name: 'electricity-transmission-and-distribution',
    },
  ];

  let cols = button_columns.length;

  for (let i = 0; i < cols; ++i) {
    let col = button_columns[i];
    d3.select('.options')
      .append('div')
      .attr('class', () => { return `column ${col.name}`; })
      .append('h4')
      .text((d) => { return `${capitalize_first_letter(col.name
        .replace(/ /g, '\u00A0')
        .replace(/-/g, '\u00A0'))}`; })
  }

  let lay = layers.length;

  for (let i = 0; i < lay; i++) {

    let lyr = layers[i];
    lyr.counter = 0;
    // Generate UI element for checkbox columns
    let checkbox_span = d3.select(`.${lyr.column}`)
      .append('label')
      .attr('class', () => {
        // If the layer has no draw attributes, name the class inactive.
        return (!lyr.draw) ? `${lyr.name} inactive` : `${lyr.name}`
      })
      .text(`${capitalize_first_letter(
        lyr.name
          .replace(/ /g, '\u00A0') // Do we need this line? Commented out it does nothing, and it seems to be replacing a space with a space...?
          .replace(/-/g, '\u00A0'))}\u00A0`)
      .append('span')
      .attr('class', 'asset-value')
      // FIXME: This is a horrible kludge in order to get space before units.
      //  Need to write a proper formatter.
      .text(` ($${capitalize_first_letter(
        d3.format('.2~s')(lyr.value)
          .replace(/G/, ' B')
          .replace(/T/, ' T'))})`)
      .append('span');

    if (lyr.draw) {
      lyr.checkbox = checkbox_span.append('input')
        .attr('type', 'checkbox')
        .attr('class', `checkbox ${lyr.name}`)
        .attr('data-assetvalue', lyr.value);

      // bind 
      lyr.checkbox.on('change', function() {

        lyr.counter++;

        if (lyr.counter % 2 === 0) {

          hide_spinner();
          lyr.context.clearRect(0, 0, width, height);
          lyr.active = false;

          console.log(`layer[i].name counter is even, value of ${lyr.counter}`);

          decrement_asset_total(lyr.value);

        } else {

          console.log(`${lyr.name} counter is odd, value of ${lyr.counter}`);

          load_layer_data(lyr);
          // load(lyr.timer);
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

    lyr.canvas = d3
      .select('.map.builder')
      .append('div')
      .attr('class', `map layer ${lyr.name}`)
      .append('canvas')
      .attr('class', `map layer canvas ${lyr.name}`)
      .attr('width', width + SCALE * 400)
      .attr('height', height);

    console.log(`<div map layer ${lyr}> created!`);

    lyr.context = lyr.canvas.node().getContext('2d');
    lyr.context.lineCap = 'round';
    lyr.active = false;

  }

  draw_base_map();

})();
