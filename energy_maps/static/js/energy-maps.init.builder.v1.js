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
  const map_container = '.main.map.builder';
  const base_map_class = '.map.layer.base-map';

  function fix_dpi(canvas) {
    // get height and width of a canvas as an integer (slice to remove 'px')
    let style_height = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2); 
    d3.select(canvas)
      .attr('height', style_height * dpi)
      .attr('width', style_width * dpi)
  }

  // Set base map canvas
  /**
   *  @description A canvas element for the base map, attached to
   *  <div class="main map builder" id="mapcanvas">
   * @memberof Init
   */
  const base_canvas = d3
    .select(map_container)
    .append('canvas')
    .attr('id', 'mapcanvas')
    // .attr('width', window.innerWidth)
    // .attr('height', window.innerHeight);
    .attr('width', width)
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
    .attr('width', width)
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

// AC
layers.push(ac_na_and_under_100);
layers.push(ac_100_300);
layers.push(ac_345_735);

// DC
layers.push(dc);

// Distribution
layers.push(distribution);

// Oil and Gas
layers.push(gas_well);
layers.push(oil_well);
layers.push(foreign_oil_wells);
layers.push(foreign_gas_wells);
layers.push(gas_pipeline);
layers.push(oil_pipeline);
console.log(oil_product_pipeline);
layers.push(oil_refinery);
layers.push(gas_processing);
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
// layers.push(biofuel); // TODO: push biofuel in when you have data with a valid scaling value
layers.push(bio_plants);

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
    // .select('.map.builder')
    .select(map_container)
    .append('div')
    .attr('class', `map layer ${lyr.name}`)
    .append('canvas')
    .attr('class', `map layer canvas ${lyr.name}`)
    .attr('width', width)
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

  let map_layer_legend_class = document.getElementsByClassName("map layer legend") // this seems to be working because it is the top-most canvas and therefore the only one actually reachable by the mouse!

  // getElementsByClassName() returns an array of HTML elements, so you have to index through that array and its children to get the element you want.
  let target_canv = map_layer_legend_class[0].children[0]; // this sets div id="legendcanvas" to our zoomable surface.
  // Use the target canvas (surface level) to drag the map canvas around
  let mapcanvas = document.getElementById('mapcanvas');

  let zoom = d3.zoom(); 

  // insert canvas elements for all layers into an array
  let layer_canvases = [];
  for (let i = 0; i < layers.length; i++) {
    layer_canvases[i] = document.getElementsByClassName(`map layer canvas ${layers[i].name}`)[0]
  }
  console.log(layer_canvases);

  // Clear current canvas at the beginning of the zoom event
  let last_zoom_timestamp;
  d3.select(target_canv).call(zoom
    .on("start", () => {
      last_zoom_timestamp = Date.now();
      ctx.save();
      ctx.clearRect(0, 0, width, height);
      console.log('cleared')
    }));

  // Perform translation during zoom activity
  d3.select(target_canv).call(zoom
  .scaleExtent([1, 5])
  .on("zoom", () => {
    console.log('zoom')
    zoomed(d3.event.transform);
  }));

  // Debounce and redraw when the user is finished zooming
  d3.select(target_canv).call(zoom
    .on("end", () => {
        _.debounce(function() {
          console.log(`current time is: ${current_time}, last zoom was: ${last_zoom_timestamp}.Difference between the two is: ${current_time - last_zoom_timestamp}`);
          draw_active_layers();
          if (layer_redrawn) {
            draw_base_map();
          }
        } , 500, true);
       
      // TODO: Update projection scale values here
      console.log(k, x, y)
    }));

  let draw_active_layers = function draw_active_layers() {
    for (let i = 0; i < lay; i++) {
      if (layers[i].active === true) {
        layers[i].context.clearRect(0, 0, width, height);
        load_layer_data(layers[i]);
        layer_redrawn = true;
     }
    }
  }

  let k, x, y;
  let layer_redrawn = false;
  function zoomed(transform) {
    x = transform.x 
    y = transform.y 
    k = transform.k
    mapcanvas.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
    for (let i = 0; i < layer_canvases.length; i++) {
      layer_canvases[i].style.transform = `translate(${x}px, ${y}px) scale(${k})`;
    }

    ctx.fill();
  }
  // function zoomed(transform) {
  //   if (transform.k != k) {  // if the zoom level has changed,
  //       layer_redrawn = false;
  //       for (let i = 0; i < lay; i++) {
  //         if (layers[i].active === true) {
  //           layers[i].context.clearRect(0, 0, width, height);
  //           load_layer_data(layers[i]);
  //           layer_redrawn = true;
  //        }
  //       }        
  //       if (layer_redrawn) {
  //         draw_base_map();
  //       }
  //   }
  //   else {
  //     x = transform.x // - screen_x; // This isn't the right formula, but it's the general approach
  //     y = transform.y // - screen_y;
  //   }
  //   k = transform.k

  //   // t1();
  //   t2();

  //   ctx.fill();
  // }
  zoomed(d3.zoomIdentity);
  
})();
