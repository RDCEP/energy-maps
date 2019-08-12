(function() {
  "use strict";

  // ######## Path Variables ######## //

  // Path Group: Base map

  /** @type {string} */
  /** @description Sets the path for the base map */
  const fmap = "../static/json/us-geojson.json";
  /** @type {string} */
  /** @description Sets the fill for the base map */
  const fmapfill = "../static/json/gz_2010_us_040_00_20m.json";

  // The `layers` object will hold all information about counters,
  // canvases, contexts, data files, etc.
  const layers = {
    // TODO: Oil and gas wells are contained in multiple files. Would need
    // to rework the promises if we need to loop through an array of
    // files rather than loading a single file.
    railroads: {
      func: draw_railroads,
      file: d3.json('../static/json/railrdl020.geojson')
    },
    coal_mines: {
      func: draw_coal_mines,
      file: '../static/csv/coal.csv'
    },
    gas_well: {
      func: draw_all_wells,
      file: '/static/csv/wells_gas1.csv'
    },
    oil_well: {
      func: draw_all_wells,
      file: '/static/csv/wells_oil1.csv'
    },
    oil_pipelines: {
      func: null, // Call function for oil pipes,

      file: d3.json('/static/json/CrudeOil_Pipelines_US_Nov2014_clipped.geojson')
    },
    oil_product_pipelines: {
      func: null, // Call function for product pipes,
      file: d3.json('/static/json/PetroleumProduct_Pipelines_US_Nov2014_clipped.geojson')
    },
    gas_pipelines: {
      func: null, // Call function for gas pipes,
      file: d3.json('/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson')
    },
    refineries: {
      func: draw_refining,
      file: d3.json('/static/json/Petroleum_Refineries_US_2015.geojson')
    },
    gas_processing: {
      func: null, // Call separate function for processing
      file: ''
    },
    gas_storage: {
      func: null, // Call separate function for storage
      file: ''
    },
    nuclear_power: {
      func: draw_power_plants,
      args: ['NUC'],
      file: d3.json('/static/json/PowerPlants_US_2014Aug_R.geojson')
    },
    geo_power: {
      inactive: true
    },
    solar_power: {
      inactive: true
    },
    hydro_power: {
      inactive: true
    },
    wind_power: {
      inactive: true
    },
    oil_power: {
      inactive: true
    },
    gas_power: {
      inactive: true
    },
    coal_power: {
      inactive: true
    },
    grid_100: {
      func: draw_grid,
      args: [100],
      file: d3.json('/static/json/Electric_Power_Transmission_Lines_011s.geojson')
    },
    grid_200: {
      inactive: true
    },
    grid_300: {
      inactive: true
    },
    grid_500: {
      inactive: true
    },
    grid_700: {
      inactive: true
    },
    grid_1000: {
      inactive: true
    },
    grid_dc: {
      inactive: true
    },
    offshore_wells: {
      inactive: true
    },

  };

  // Loop through each property in the `layers` object
  for (let layer in layers) {
    if (layers.hasOwnProperty(layer)) {
      // If the layer has an inactive property, no matter its value, ignore it
      if (layer.hasOwnProperty('inactive')) {
        if (layer.inactive) {
          continue;
        }
      }
      // Set counter to 0
      layers[layer].counter = 0;
      // Create canvas
      layers[layer].canvas = d3
        .select(".map.wrapper")
        .append("div")
        .attr("class", `map layer ${layers[i]}`)
        .append("canvas")
        .attr("class", `map layer canvas ${layers[i]}`)
        .attr("width", width + SCALE * 400)
        .attr("height", height);
      // Create context
      layers[layer].context = layers[layer].canvas.node().getContext('2d');
      // Set lineCap
      layers[layer].context.lineCap = 'round';
      // Create checkbox
      d3
        .select('.options')
        .append('label')
        .text(`${layer}`)
        .append('input')
        .attr('type', 'checkbox')
        .attr('class', `checkbox ${layer}`)
        .attr('data-layer', `${layer}`)
      ;
    }
  }

  // Loading
  let spinner = document.getElementById("spinner");
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  };
  /** @description display the loading spinner for user set time in milliseconds */
  const load = async (time) => {
    // show the spinner
    spinner.style.display = 'block';
    await sleep(time);
    // hide the spinner
    spinner.style.display = 'none';
  };

  // Set base map canvas
  /** @description A canvas element for the base map, attached to div "main map builder" with id="mapcanvas" */
  const base_canvas = d3
    .select(".main.map.builder")
    .append("canvas")
    .attr("id", "mapcanvas")
    .attr("width", width + SCALE * 400)
    .attr("height", height);
  const ctx = base_canvas.node().getContext("2d");
  ctx.LineCap = "round";

  // ######## Init Functions ######## //

  /** TODO: Move draw_base_map() to .builder.funcs.js and see
   * if you can get it to reach this file. Didn't work last time.  */
  /**
   * Draw the base map and legend
   */
  function draw_base_map() {
    Promise.all([d3.json(fmap), d3.json(fmapfill)])
      .then(function(files) {
        draw_land(ctx, files);
      })
      .then(function() {
        coal_legend(ctx);
      });
      
    console.log("draw base map");
  }

  // ######## Initializing Behavior ######## //

  draw_base_map();

  /*
   Generalized function form nate
   */

  // Should the next line be iterating through layer_funcs.length of layers.length? layer_funcs.length hasn't been set yet, has it?
  // Correct! Dumb mistake on my part. And it should be in the same loop as `counter`.

  // Do we need to call const checks as a function somewhere?
  /** @description Toggle layer functionality on checkbox change event */  
  const checks = d3.selectall('.checkbox').on('change', function() {
    // Attach a new canvas based on the checkbox's data-layer attribute
    let layer = d3.select(this).attr('data-layer');
    // let canvas = d3.select(`.map.layer.canvas.${layer}`);
    // Increase the counter of the current layer
    layers[layer].counter++;
    // If the counter is even, checkbox is in off state.
    // Destroy the canvas element and replace it with a new one
    // I don't think I'd destroy the canvas. It's been included in the
    // `canvases` object above. Maybe just fill it white?
    if (layers[layer].counter % 2 === 0) {
      // canvas.remove();
      // console.log(`${layer} counter is even, value of ${counters[layer]}`);
      // d3.select(`.map.layer.${layer}`)
      //   .append('canvas')
      //   .attr("class", `map layer canvas ${layer}`)
      //   .attr("width", width + SCALE * 400)
      //   .attr("height", height);

      // This needs to be transparent. Another dumb mistake.
      contexts[layer].fillStyle = 'rgba(255, 255, 255, 0)';
      contexts[layer].rect(0, 0, canvases[layer].attr('width'),
        canvases[layer].attr('height'));
      contexts[layer].fill();
    } else {
      // If the checkbox has been clicked before, the layer and is turned back on,
      // Add a new context since the old one was destroyed.
      // If we're filling the canvas white instead of destroying it,
      // should be able to keep the old context/
      // if (counters[layer] > 1) {
      //     canvas.node().getContext("2d").LineCap = "round";
      //   }
        // If the checkbox is in the on state, 
        // call the relevant layer function and show the loading spinner.
        console.log(`${layer} counter is odd, value of ${layers[layer].counter}`);

        Promise.all([
          layers[layer].file
        ]).then(function(files) {
          layers[layer].func(layers[layer].context, files);
        });

        load(2000);
    }
  });

})();
