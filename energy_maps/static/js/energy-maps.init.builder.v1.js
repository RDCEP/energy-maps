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
  const fmap = '../static/json/states-10m.json';

  /**
   * @type {string}
   * @description HTML class on which the main map is drawn
   * @memberof Init
   */
  const map_container = '.main.map.builder';
  const base_map_class = '.map.layer.base-map';

  /**
   *  @description A canvas element for the base map, attached to
   *  <div class="main map builder" id="mapcanvas">
   * @memberof Init
   */
  const base_canvas = d3
    .select(base_map_class)
    .append('canvas')
    .attr('id', 'mapcanvas')
    .attr('width', width)
    .attr('height', height);

  const ctx = base_canvas.node().getContext('2d');
  ctx.LineCap = 'round';

  /**
   * @type {Object}
   * @description HTML5 canvas for the application legend
   * @memberof Init
   */
  const legend_canvas = d3
    .select('.legend.canvas')
    .append('canvas')
    .attr('width', 400)
    .attr('height', 0);

  /**
   * @type {Object}
   * @description HTML5 canvas context for the application legend
   * @memberof Init
   */
  let legend_ctx = legend_canvas.node().getContext('2d');
  legend_ctx.lineCap = 'round';

  const legend_tmpcanvas = d3
    .select('.legend.tmpcanvas')
    .append('canvas')
    .attr('width', 400)
    .attr('height', 1000);

  /**
   * @type {Object}
   * @description HTML5 canvas context for the application legend
   * @memberof Init
   */
  let tmplegend_ctx = legend_tmpcanvas.node().getContext('2d');
  tmplegend_ctx.lineCap = 'round';

  /**
   * @type {number}
   * @description the total sum of asset values for all active layers
   * @memberof Init
   */
  let asset_total_sum = 0;

  /** // TODO: Update this documentation. It's handy for now but not accurate.
   * @description An array of objects representing resources to be rendered
   * on top of the map canvas.
   * @property {string}   name        - A canvas id.
   * @property {Number}   value       - Asset value in USD.
   * @property {Array}    draw        - An array of objects containing
   *                                    properties accessed by
   *                                    load_layer_data().
   * @property {function} draw.f      - A draw function bound to each object.
   * @property {string}   draw.src    - A reference to the data source
   *                                    (json or csv).
   * @property {function} draw.w      - A call to a d3 data parse function.
   * @property {string}   column      - The class of the column that the
   *                                    layer's checkbox is written to.
   * @memberof Init
   */
  let layers = [];

  /**
   * @description Draw the base map for the application based off
   * of the data from fmap and fmapfill
   * @memberof Init
   */
  const draw_base_map = function draw_base_map(transform) {
    Promise.all(
      [d3.json(fmap)]
    ).then(function(files) {
      draw_land(ctx, files, transform, false, false);
    });
  };

  /** Add the passed value to the asset total array and compute the new value
   * @param  {Number} value - the value to add to asset total value
   * @memberof Init
   */
  const increment_asset_total = function increment_asset_total(value) {
    asset_total_sum += value;
    display_asset_total();
  };

  /**
   * Remove the passed value from the asset total array and compute
   * the new value
   * @param  {Number} value - the value to subtract from asset total value
   * @memberof Init
   */
  const decrement_asset_total = function decrement_asset_total(value) {
    asset_total_sum -= value;
    display_asset_total();
  };

  /**
   * Display total asset value of all active layers.
   * Currently using d3-format (https://github.com/d3/d3-format) for currency formatting.
   * Numeral.js (http://numeraljs.com/#format) was previously used for currency formatting.
   * @memberof Init
   */
  const display_asset_total = function display_asset_total() {
    // FIXME: This is a horrible kludge in order to get space before units.
    //  Need to write a proper formatter.
    document.getElementById('asset-totals')
      .innerHTML = `${d3.format('$.2~s')(asset_total_sum)
      .replace(/G/, ' B')
      .replace(/T/, ' T')}`;
  };

  /**
   * @param  {String} s - the supplied character string to be formatted
   * @returns {String} the supplied string with the first letter capitalized
   * @memberof Init
   */
  const capitalize_first_letter = function capitalize_first_letter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  /**
   * @description Call all draw methods for a given layer and render it
   * to its canvas element.
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
      show_spinner();
      Promise.all(lyr.draw[i].src.map(x => lyr.draw[i].w(x)))
        .then(function(files) {
          lyr.context.restore();
          lyr.context.save();
          transform_layer(lyr.context, transform);
          lyr.draw[i].f(lyr.context, files);
        });
    }
  };

  layers.push(wind_map);
  layers.push(state_boundaries);

  // Coal
  layers.push(coal_mine);
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
  layers.push(oil_product_pipeline);
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

  let lay = layers.length;
  //TODO: Why is this here? Shouldn't it be passed to funcs as we
  // create checkboxes?
  let checkbox_span;

  /**
   * @description An array of named objects representing button column names to
   * be shown at the top of the checkbox selection menu.
   * @property {string} name - an HTML/CSS ID that will be assigned to the
   * markup dynamically and ultimately formatted for case and plain-English
   * spacing to label the columns.
   * @memberof Init
   */
  const button_columns = [
    [{ name: 'oil-and-gas',
    }],
    [{ name: 'coal',
    },
    { name: 'layers'
    }],
    [{ name: 'electricity-generation',
    }],
    [{ name: 'electricity-transmission-and-distribution',
    }],
  ];

  let cols = button_columns.length;

  /**
   * @description Initialize and display all menu columns that divide
   * checkboxes into categories.
   * @memberof Init
   */
  const initMenuColumns = function initMenuColumns() {
    for (let i = 0; i < cols; ++i) {
      let column_divs = d3.select('.options.canvas')
        .append('div')
        .attr('class', () => {return `column`})
      for (let j = 0; j < button_columns[i].length; j++) {
        let col = button_columns[i][j];
        column_divs.append('div')
          .attr('class', () => { return `${col.name}`})
          .append('h4')
          .text((d) => { return `${capitalize_first_letter(col.name
            .replace(/ /g, '\u00A0')
            .replace(/-/g, '\u00A0'))}`; })
      }
    }
  };

  /**
   * @description Add a layer to the screen.
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  const addLayer = function addLayer(lyr, transform) {
    load_layer_data(lyr, transform);
    lyr.active = true;
    increment_asset_total(lyr.value);
  };

  /**
   * @description Remove a layer from the screen.
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  const removeLayer = function removeLayer(lyr) {
    hide_spinner();
    lyr.context.clearRect(0, 0, width, height);
    lyr.active = false;
    decrement_asset_total(lyr.value);
  };

  initMenuColumns();

  // Generate UI element for checkbox columns

  /**
   * @description Generate a label for a checkbox in the menu.
   * @param {Object} lyr - An object from layers[].
   * @return {Object} checkbox_span - an HTML5 label tag with a class
   * that corresponds to the `lyr` object
   * and a descriptive formatted text string.
   * @memberof Init
   */
  const initMenuCheckboxLabel = function initMenuCheckboxLabel(lyr) {
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
  };

  /**
   * @description Generate an asset value for a checkbox in the menu.
   * @param {Object} lyr - An object from layers[].
   * @return {Object} checkbox_span - an HTML5 span tag with that displays
   * total asset value for the menu item.
   * abbreviated in either billions or trillions. Child of a parent label tag.
   * @memberof Init
   */
  const initMenuAssetValue = function initMenuAssetValue(lyr) {
    if (lyr.value !== 0) {
      checkbox_span.append('span')
        .attr('class', 'asset-value')
        // FIXME: This is a horrible kludge in order to get space before units.
        //  Need to write a proper formatter.
        .text(` ($${capitalize_first_letter(
          d3.format('.2~s')(lyr.value)
            .replace(/G/, ' B')
            .replace(/T/, ' T'))})`);
      return checkbox_span;
    }
  };

  /**
   * @description Generate a menu item.
   * @param {Object} lyr - An object from layers[].
   * @return {Object} checkbox_span - HTML5 label and span as children
   * of a column
   * div in the menu.
   * @memberof Init
   */
  const initMenuItem = function initMenuItem(lyr) {
    initMenuCheckboxLabel(lyr);
    initMenuAssetValue(lyr);
    return checkbox_span;
  };

  /**
   * @description Generate each checkbox in the menu.
   * @param {Object} lyr - An object from layers[].
   * @return {Object} lyr.checkbox - a `checkbox` property added to the lyr item
   * containing a checkbox input tag.
   * @memberof Init
   */
  const initMenuCheckbox = function initMenuCheckbox(lyr) {
    lyr.checkbox = checkbox_span.append('input')
    .attr('type', 'checkbox')
    .attr('class', `checkbox ${lyr.name}`)
    .attr('data-assetvalue', lyr.value);
    return lyr.checkbox;
  };

  /**
   * @description Generate a canvas in the DOM for a given layer.
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  const addLayerCanvas = function addLayerCanvas(lyr) {
    lyr.canvas = d3
      .select(map_container)
      .append('div')
      .attr('class', `map layer ${lyr.name}`)
      .append('canvas')
      .attr('class', `canvas ${lyr.name}`)
      .attr('width', width)
      .attr('height', height);
  };

  /**
   * @description Generate a canvas context in the DOM for a given layer.
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  const addCanvasContext = function addCanvasContext(lyr) {
    lyr.context = lyr.canvas.node().getContext('2d');
    lyr.context.lineCap = 'round';
    lyr.active = false;
  };

  let initMenu = (function initMenu() {
    for (let i = 0; i < lay; i++) {

      let lyr = layers[i];
      
      initMenuItem(lyr);

      if (lyr.draw) {
        initMenuCheckbox(lyr);
        lyr.checkbox.on('change', function() {

          // checkbox is buried in a ut {} object for some reason
          let checkbox = lyr.checkbox._groups[0][0];

          if (checkbox.checked) {
            addLayer(lyr, transform);
            console.log(lyr.checkbox)
          } else {
            removeLayer(lyr, transform);
            console.log(lyr.checkbox)
          }
          if (!(lyr instanceof StateBoundary)) {
            legend_ctx.clearRect(0, 0, width, height);
            tmplegend_ctx.clearRect(0, 0, width, height);
            update_legend(tmplegend_ctx, legend_ctx, layers);
          }

        });
      }

      addLayerCanvas(lyr)
      addCanvasContext(lyr)

    }
  })();

  draw_base_map(transform);

  const target_canvas = d3.select('.map.layer.zoom-target');

  const zoom_start = function zoom_start() {
    transform = {x:0, y:0, k:1};
    for (let i = 0; i < lay; i++) {
      layers[i].context.clearRect(0, 0, width, height);
    }
    transform = d3.event.transform;
  };

  const zoomed = function zoomed() {
    transform = d3.event.transform;
    draw_land(ctx, [simple_map_bkgd], transform, false, true);
  };

  const zoom_end = _.debounce(function(e) {
    draw_base_map(transform);
    draw_active_layers(transform);
  }, 500, false);

  const zoom = d3.zoom()
    .scaleExtent([1, 50])
    .on('start', zoom_start)
    .on('zoom', zoomed)
    .on('end', zoom_end)

  target_canvas.call(zoom);

  d3.select('.zoom-in').on('click', function() {
    let increment = .1
    let k = transform.k + increment
    let x = (transform.x + projection_width * (transform.k - k) / 2) / k
    let y = (transform.y + projection_height * (transform.k - k) / 2) / k
    let initial_transform = d3.zoomIdentity
      .scale(k)
      .translate(x, y)
    target_canvas.call(zoom.transform, initial_transform);
  });

  d3.select('.zoom-out').on('click', function() {
    let increment = .1
    let k = transform.k - increment
    let x = (transform.x + projection_width * (transform.k - k) / 2) / k + transform.x
    let y = (transform.y + projection_height * (transform.k - k) / 2) / k + transform.y
    let initial_transform = d3.zoomIdentity
      .scale(k)
      .translate(x - transform.x, y - transform.y)
    target_canvas.call(zoom.transform, initial_transform);
  });

  // FIXME: This probably doesn't belong here in the code.
  // From: https://stackoverflow.com/questions/41607804/promise-each-without-bluebird
  Promise.each = function(arr, fn) { // take an array and a function
    // invalid input
    if(!Array.isArray(arr)) return Promise.reject(new Error("Non array passed to each"));
    // empty case
    if(arr.length === 0) return Promise.resolve();
    return arr.reduce(function(prev, cur) {
      return prev.then(() => fn(cur))
    }, Promise.resolve());
  }

  let draw_active_layers = function draw_active_layers(transform) {
    for (let i = 0; i < lay; ++i) {
      if (layers[i].active === true) {
        load_layer_data(layers[i], transform);
      } else {
        layers[i].context.restore();
        layers[i].context.save();
        transform_layer(layers[i].context, transform);
      }
    }
  };

  const window_resize = _.debounce(function(e) {
    console.log('resize')
    width = window.innerWidth * SCALE;
    height = window.innerHeight * SCALE;
    base_canvas
      .attr('width', width)
      .attr('height', height);
    for (let i = 0; i < lay; i++) {
      layers[i].canvas
        .attr('width', width)
        .attr('height', height);
      layers[i].context.clearRect(0, 0, width, height);
    }
    draw_base_map(transform);
    draw_active_layers(transform);
  }, 500, false);

  d3.select(window).on('resize', window_resize);

  function fix_dpi(canvas) {
    // get height and width of a canvas as an integer (slice to remove 'px')
    let style_height = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
    d3.select(canvas)
      .attr('height', style_height * dpi)
      .attr('width', style_width * dpi)
  }

  const toggles = d3.selectAll('.window .toggle');

  toggles.on('click', function() {
    console.log('click')
    let closed = d3.select(this).classed('open');
    // Toggle legend visibility
    d3.select(this.parentNode).select('.canvas')
      .classed('closed', closed)
      .classed('closed', !closed);
    // Toggle state of visibility icon
    d3.select(this)
      .classed('open', !closed)
      .classed('close', closed);
  });

  const window_menus = d3.selectAll('.window.menu');

  const window_drag_started = function window_drag_started() {

    d3.event.on('drag', dragged).on('end', ended);

    function dragged() {
      let that = d3.select(this);
      that
        .style('bottom', null)
        .style('right', `${
          parseInt(that.style('right'), 10) - d3.event.dx}px`)
        .style('top', `${
          parseInt(that.style('top'), 10) + d3.event.dy}px`);
    }

    function ended() {
      //
    }
  }

  window_menus
    // Set horizontal position of draggable windows on page load.
    .style('right', function() { if (d3.select(this).classed('legend')) {
      return `${(width-1200)/2+100}px`;
    } else if (d3.select(this).classed('options')) {
      return `${(width-1200)/2}px`;
    }})
    // Set vertical position of legend on page load.
    .style('top', function() { if (d3.select(this).classed('legend')) {
      let header_height = d3.select('header').node().offsetHeight;
      return `${header_height}px`;
    }})
    .call(d3.drag().on('start', window_drag_started));

})();
