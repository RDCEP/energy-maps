/**
 * @file Initializes the application in the browser.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 */

 let init = (function() {
  /**
   * init functionality
   * @alias Init
   * @namespace Init
   */

  'use strict';

  /** 
   * @type {string}
   * @description Sets the path for the base map 
   * @memberof Init
   */
  const fmap = '../static/json/us-geojson.json';

  /** @type {string} 
   * @description Sets the fill for the base map
   * @memberof Init
   */
  const fmapfill = '../static/json/gz_2010_us_040_00_20m.json';

  /** 
   * @type {string} 
   * @description HTML class on which the main map is drawn
   * @memberof Init
   */
  const mapclass = '.main.map.builder';

  // Set base map canvas
  /**
   *  @description A canvas element for the base map, attached to
   *  <div class="main map builder" id="mapcanvas">
   * @memberof Init
   */
  const base_canvas = d3
    .select(mapclass)
    .append('canvas')
    .attr('id', 'mapcanvas')
    .attr('width', canvas_width)
    .attr('height', height);
  const ctx = base_canvas.node().getContext('2d');
  ctx.LineCap = 'round';

  // Set legend canvas
  /**
   * @type {Object}
   * @description HTML5 canvas for the application legend
   * @memberof Init
   */
  let legend_canvas = d3
    .select('.map.legend')
    .append('canvas')
    .attr('id', 'legendcanvas')
    .attr('width', canvas_width)
    .attr('height', height);

  /**
   * @type {Object}
   * @description HTML5 canvas context for the application legend
   * @memberof Init
   */  
  let legend_ctx = legend_canvas.node().getContext('2d');
  ctx.LineCap = 'round';

  /**
   * @description Draw the base map for the application based off of the data from fmap and fmapfill
   * @memberof Init
   */
  function draw_base_map() {
    Promise.all(
      [d3.json(fmap), d3.json(fmapfill)]
    ).then(function(files) {
      draw_land(ctx, files, false);
    });
    console.log('draw base map');
  }

  /** 
   * @type {string}
   * @description the total sum of asset values for all active layers
   * @memberof Init 
   */
  let asset_total_sum = 0;

  /** Add the passed value to the asset total array and compute the new value
   * @param  {Number} value - the value to add to asset total value
   * @memberof Init
   */
  function increment_asset_total(value) {
    asset_total_sum += value;
    display_asset_total();
  }

  /** 
   * Remove the passed value from the asset total array and compute the new value 
   * @param  {Number} value - the value to subtract from asset total value
   * @memberof Init
   */
  function decrement_asset_total(value) {
    asset_total_sum -= value;
    display_asset_total();
  }
  
  /** 
   * Display total asset value of all active layers.
   * Currently using d3-format (https://github.com/d3/d3-format) for currency formatting.
   * Numeral.js (http://numeraljs.com/#format) was previously used for currency formatting.
   * @memberof Init
   */
  function display_asset_total() {
    // FIXME: This is a horrible kludge in order to get space before units.
    //  Need to write a proper formatter.
    document.getElementById("asset-totals")
      .innerHTML = `${d3.format('$.2~s')(asset_total_sum)
      .replace(/G/, ' B')
      .replace(/T/, ' T')}`
    ;
  }

  /**
   * @param  {String} s - the supplied character string to be formatted
   * @returns {String} the supplied string with the first letter capitalized
   * @memberof Init
   */
  const capitalize_first_letter = function capitalize_first_letter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  
  /**
   * @description Call all draw methods for a given layer and render it to its canvas element. 
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  // CODE SMELL: Inspect this for tight coupling.
  // It could be nice to map out the draw methods in one method and actually 
  // call them in another if we can do so feasibly. This would complement
  // A strategy in which we abstract data loading out of our draw functions
  // and store each object in a variable, so that when our draw 
  // functions are called they only operate on that data rather than collect
  // and parse it each time.
  const load_layer_data = function load_layer_data(lyr) {
    for (let i = 0; i < lyr.draw.length; ++i) {
      console.log('show spinner');
      show_spinner();
      Promise.all(lyr.draw[i].src.map(x => lyr.draw[i].w(x)))
        .then(function(files) {
          lyr.draw[i].f(lyr.context, files);
        });
    }
  };

  /** // TODO: Update this documentation. It's handy for now but not accurate.
   * @description An array of objects representing resources to be rendered on top of the map canvas.
   * @property {string}   name               - A canvas id.
   * @property {Number}   value              - Asset value in USD.
   * @property {Array}    draw               - An array of objects containing properties accessed by load_layer_data().
   * @property {function} draw.f             - A draw function bound to each object.
   * @property {string}   draw.src           - A reference to the data source (json or csv).
   * @property {function} draw.w             - A call to a d3 data parse function.
   * @property {string}   column             -The class of the column that the layer's checkbox is written to.
   * @memberof Init
   */
  let layers = [];

// Coal

layers.push(coal_mine)
layers.push(railroad);
// TODO: Update the rest of the layers in the above fashion.
// Move object instantiation to the bottom of your funcs files.

// AC under 100

// TODO: The `name` property for ac_na isn't meaningful since it doesn't have its own canvas to connect to independently. This isn't a huge issue but it's not descriptive when you look at the object's prototype in the console. Consider a rewrite of the Grid constructor. 
let ac_na_and_under_100 = new InfrastructureSet('AC-lines-under-100-kV', '', 102_000_000_000, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_unk_and_under_100,
  src: ['/static/json/elec_grid_split/grid-unk_under_100.json'],
  w: d3.json,
} ]);
layers.push(ac_na_and_under_100);

let ac_na = new Grid('AC-lines-under-100-kV', 'Unknown kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_unk_and_under_100,
  src: ['/static/json/elec_grid_split/grid-unk_under_100.json'],
  w: d3.json,
} ], 'NOT AVAILABLE', 'rgba(255, 255, 255)', 0, 50);
console.log(ac_na)

let ac_under_100 = new Grid('AC-lines-under-100-kV', 'Under 100 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_unk_and_under_100,
  src: ['/static/json/elec_grid_split/grid-unk_under_100.json'],
  w: d3.json,
} ], 'Under 100', 'rgba(255, 255, 170)', 1, 50);
console.log(ac_under_100); // Do not push to layers array

// AC 100-300

let ac_100_300 = new InfrastructureSet('AC-lines-100-to-300-kV', '', 167_000_000_000, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_100_300,
  src: ['/static/json/elec_grid_split/grid-100_300.json'],
  w: d3.json,
} ]);
layers.push(ac_100_300);

let ac_100_200 = new Grid('AC-lines-100-to-300-kV', '100–200 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_100_300,
  src: ['/static/json/elec_grid_split/grid-100_300.json'],
  w: d3.json,
} ], '100-161', 'rgba(86, 180, 233)', 2, 100);
console.log(ac_100_200); // Do not push to layers array

let ac_200_300 = new Grid('AC-lines-100-to-300-kV', '200–300 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_100_300,
  src: ['/static/json/elec_grid_split/grid-100_300.json'],
  w: d3.json,
} ], '220-287', 'rgba(55, 126, 184)', 3, 250);
console.log(ac_200_300); // Do not push to layers array

// AC 345-735

let ac_345_735 = new InfrastructureSet('AC-lines-345-to-735-kV', '', 137_000_000_000, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_345_735,
  src: ['/static/json/elec_grid_split/grid-345_735.json'],
  w: d3.json,
} ]);
layers.push(ac_345_735);

let ac_345 = new Grid('AC-lines-345-to-735-kV', '345 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_345_735,
  src: ['/static/json/elec_grid_split/grid-345_735.json'],
  w: d3.json,
} ], '345', 'rgba(255, 149, 0)', 4, 350);
console.log(ac_345); // Do not push to layers array

let ac_500 = new Grid('AC-lines-345-to-735-kV', '500 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_345_735,
  src: ['/static/json/elec_grid_split/grid-345_735.json'],
  w: d3.json,
} ], '500', 'rgba(213, 113, 45)', 5, 350);
console.log(ac_500); // Do not push to layers array

let ac_735_plus = new Grid('AC-lines-345-to-735-kV', '735 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_345_735,
  src: ['/static/json/elec_grid_split/grid-345_735.json'],
  w: d3.json,
} ], '735 and Above', 'rgba(228, 53, 5)', 6, 750);
console.log(ac_735_plus); // Do not push to layers array

// DC

let dc = new InfrastructureSet('DC-lines', '', 4_000_000_000, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_dc,
  src: ['/static/json/elec_grid_split/grid-dc.json'],
  w: d3.json,
} ]);
layers.push(dc);

// Distribution

let distribution = { name: 'electricity-distribution',
value: 1_400_000_000_000,
draw: false,
column: 'electricity-transmission-and-distribution',
};
layers.push(distribution);

// Oil and Gas

layers.push(gas_well);

let oil_well = new Well('oil-well', 'Oil well', 654_000_000_000, 'oil-and-gas', [ {
          f: draw_all_wells,
          src: [ `/static/csv/wells_oil1.csv`,
                 `/static/csv/wells_oil2.csv` ],
          w: d3.csv
        } ], 'rgba(34, 139, 34, .5)', 'rgba(34, 139, 34)')
layers.push(oil_well);

let foreign_oil_wells = { name: 'foreign-oil-wells',
      value: 931_000_000_000,
      draw: false,
      column: 'oil-and-gas',
    }
layers.push(foreign_oil_wells);

let foreign_gas_wells = { name: 'foreign-gas-wells',
      value: 63_000_000_000,
      draw: false,
      column: 'oil-and-gas',
    }
layers.push(foreign_gas_wells);

let gas_pipeline = new Transport('gas-pipeline', 'Gas pipeline', 940_000_000_000, 'oil-and-gas', [ {
  f: draw_gas_pipes,
  src: ['/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson'],
  w: d3.json
} ], 'rgba(0, 191, 255, .5)', 1.8 * SCALE);
layers.push(gas_pipeline);

let oil_pipeline = new Transport('oil-pipeline', 'Oil pipeline', 170_000_000_000, 'oil-and-gas', [ {
  f: draw_oil_pipes,
  src: [`/static/json/CrudeOil_Pipelines_US_Nov2014_clipped.geojson`],
  w: d3.json
}, {
  f: draw_oil_pipes,
  src: [`/static/json/PetroleumProduct_Pipelines_US_Nov2014_clipped.geojson`],
  w: d3.json
} ], '#3CB371', 1.5 * SCALE);
layers.push(oil_pipeline);

let oil_product_pipeline = new Transport('oil-product-pipeline', 'Oil product pipeline', null, 'oil-and-gas', [], '#3CB371', 2 * SCALE);
oil_product_pipeline.dash = 2.5 * SCALE;
console.log(oil_product_pipeline);

let oil_refinery = new Processing('oil-refinery', 'Gas processing', 373_000_000_000, 'oil-and-gas', [ {
  f: draw_refining,
  src: [`/static/json/Petroleum_Refineries_US_2015.geojson`],
  w: d3.json
}], 'rgba(60, 179, 113, .7)', .006 * SCALE);
layers.push(oil_refinery);

let gas_processing = new Processing('gas-processing', 'Gas processing', 45_000_000_000, 'oil-and-gas', [ {
  f: draw_processing,
  src: [ `/static/csv/nproc.csv`],
  w: d3.csv
} ], 'rgba(0, 0, 139, .5)', 1.5 * SCALE);
layers.push(gas_processing);

let oil_and_gas_storage = { name: 'oil-and-gas-storage',
value: 181_000_000_000,
draw: false,
// TODO: Split up the JSON files based on whatever property marks processing vs. storage
// draw: [ {
//   f: draw_storage,
//   src: [ `/static/csv/nproc.csv`],
//   w: d3.csv
// } ],
column: 'oil-and-gas',
}
layers.push(oil_and_gas_storage);


// Plants

layers.push(coal_plants);
layers.push(ng_plants);
layers.push(pet_plants);
layers.push(nuc_plants);
layers.push(hyc_plants);
layers.push(wnd_farms);
layers.push(solar_plants);
layers.push(geo_plants);
layers.push(biofuel);

console.log(layers);

  /** 
   * @description An array of named objects representing button column names to be shown at the top of the checkbox selection menu.
   * @property {string} name - an HTML/CSS ID that will be assigned to the markup dynamically and ultimately formatted for case and plain-English spacing to label the columns.
   * @memberof Init
   */
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

  // button_columns.push({name: 'test'}) 

  let cols = button_columns.length;

  /**
   * @description Initialize and display all menu columns that divide checkboxes into categories. 
   * @memberof Init
   */
  let initMenuColumns = function initMenuColumns() {
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
  }

  /**
   * @description Add a layer to the screen. 
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  let addLayer = function addLayer(lyr) {
    load_layer_data(lyr);
    lyr.active = true;
    increment_asset_total(lyr.value);
  }

  /**
   * @description Remove a layer from the screen. 
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  let removeLayer = function removeLayer(lyr) {
    hide_spinner();
    lyr.context.clearRect(0, 0, width, height);
    lyr.active = false;
    decrement_asset_total(lyr.value);  
  }

  initMenuColumns();

  let lay = layers.length;
  let checkbox_span;
    
  // Generate UI element for checkbox columns

  /**
   * @description Generate a label for a checkbox in the menu. 
   * @param {Object} lyr - An object from layers[].
   * @return {Object} checkbox_span - an HTML5 label tag with a class that corresponds to the `lyr` object 
   * and a descriptive formatted text string. 
   * @memberof Init
   */
  let initMenuCheckboxLabel = function initMenuCheckboxLabel(lyr) {
    checkbox_span = d3.select(`.${lyr.column}`)
    .append('label')
    .attr('class', () => {
      return (!lyr.draw) ? `${lyr.name} inactive` : `${lyr.name}`
    })
    .text(`${capitalize_first_letter(
      lyr.name
        .replace(/ /g, '\u00A0') // Replacing a normal space with nbsp;
        .replace(/-/g, '\u00A0'))}\u00A0`)
    return checkbox_span;
  }

  /**
   * @description Generate an asset value for a checkbox in the menu. 
   * @param {Object} lyr - An object from layers[].
   * @return {Object} checkbox_span - an HTML5 span tag with that displays total asset value for the menu item. 
   * abbreviated in either billions or trillions. Child of a parent label tag.
   * @memberof Init
   */
  let initMenuAssetValue = function initMenuAssetValue(lyr) {
    checkbox_span  
    .append('span')
    .attr('class', 'asset-value')
    // FIXME: This is a horrible kludge in order to get space before units.
    //  Need to write a proper formatter.
    .text(` ($${capitalize_first_letter(
      d3.format('.2~s')(lyr.value)
        .replace(/G/, ' B')
        .replace(/T/, ' T'))})`)
    .append('span');
    return checkbox_span;
  }

  /**
   * @description Generate a menu item. 
   * @param {Object} lyr - An object from layers[].
   * @return {Object} checkbox_span - HTML5 label and span as children of a column 
   * div in the menu. 
   * @memberof Init
   */
  let initMenuItem = function initMenuItem(lyr) {
    initMenuCheckboxLabel(lyr);
    initMenuAssetValue(lyr); 
    return checkbox_span;
  }

  /**
   * @description Generate each checkbox in the menu. 
   * @param {Object} lyr - An object from layers[].
   * @return {Object} lyr.checkbox - a `checkbox` property added to the lyr item 
   * containing a checkbox input tag.
   * @memberof Init
   */
  let initMenuCheckbox = function initMenuCheckbox(lyr) {
    lyr.checkbox = checkbox_span.append('input')
    .attr('type', 'checkbox')
    .attr('class', `checkbox ${lyr.name}`)
    .attr('data-assetvalue', lyr.value);
    return lyr.checkbox;
  }

  /**
   * @description Generate a canvas in the DOM for a given layer. 
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  let addLayerCanvas = function addLayerCanvas(lyr) {
    lyr.canvas = d3
    .select('.map.builder')
    .append('div')
    .attr('class', `map layer ${lyr.name}`)
    .append('canvas')
    .attr('class', `map layer canvas ${lyr.name}`)
    .attr('width', canvas_width)
    .attr('height', height);
  }

  /**
   * @description Generate a canvas context in the DOM for a given layer. 
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  let addCanvasContext = function addCanvasContext(lyr) {
    lyr.context = lyr.canvas.node().getContext('2d');
    lyr.context.lineCap = 'round';
    lyr.active = false;
  }

  let initMenu = (function initMenu() {
    for (let i = 0; i < lay; i++) {

      let lyr = layers[i];
      lyr.counter = 0;
      
      initMenuItem(lyr);
  
      if (lyr.draw) {
        initMenuCheckbox(lyr);
        lyr.checkbox.on('change', function() {
          lyr.counter++;

          if (lyr.counter % 2 === 0) {
            removeLayer(lyr);
          } else {
            addLayer(lyr);
          }
  
          // TODO: Arguably the legend context should be cleared in the
          //  update_legend() function.
          legend_ctx.clearRect(0, 0, width, height);
          update_legend(legend_ctx, layers);
  
        });
  
      }
      
      addLayerCanvas(lyr)
      addCanvasContext(lyr)
  
    }
  });

  initMenu();
  draw_base_map();

})();
