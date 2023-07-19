/**
* @file Initializes the application in the browser.
* @author Benjamin Kleeman
* @author Nathan Matteson
*/

EnergyMaps = (function (energy_maps, InfrastructureSet) {

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
  const map_container = '.main-map';
  const base_map_class = '.base-map';

  /**
   *  @description A canvas element for the base map, attached to
   *  <div class="main map builder" id="mapcanvas">
   * @memberof Init
   */
  const base_canvas = d3
    .select(base_map_class)
    .append('canvas')
    .attr('id', 'mapcanvas')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

  const base_ctx = base_canvas.node().getContext('2d');
  base_ctx.LineCap = 'round';

  /**
   * @description Draw the base map for the application based off
   * of the data from fmap and fmapfill
   * @memberof Init
   */
  energy_maps.draw_base_map = function draw_base_map(transform) {
    Promise.all(
      [d3.json(fmap)]
    ).then(function(files) {
      energy_maps.draw_land(base_ctx, files, transform, false, false);
    });
  };

  var layers_to_redraw = []
  var cboxes_to_check = []
  let unchanged_layers_2022 = []

  let create_year_button = function create_year_button
    (btn_val, year_val)
  {
    let btn = document.createElement("button");
    btn.innerHTML = `${btn_val}`;
    document.querySelector('.options-list h6')
      .appendChild(btn);
    btn.classList.add('btn-year');
    btn.addEventListener('click', function() {
      btn_val = btn_val;
      data_year = energy_maps.get_data_year(btn_val)
      // API_URL_PREFIX = `http://127.0.0.1:5000/api/v0.1.0/infrastructure/${DATA_YEAR}`

      // Add an asterisk if year is 2022
      if (DATA_YEAR === 2022) {
        initMenuAsteriskNote();
      } else if (DATA_YEAR === 2012) {
        energy_maps.asterisk_note[0].remove()
      }

      unchanged_layers_2022 = [
        energy_maps.gas_well, energy_maps.oil_well, energy_maps.railroad,
        energy_maps.ac_na_and_under_100, energy_maps.ac_100_300,
        energy_maps.ac_345_735, energy_maps.dc, energy_maps.gas_pipeline,
        energy_maps.oil_pipeline, energy_maps.oil_product_pipeline ];
      if (DATA_YEAR === 2022) {
        for (let i = 0; i < unchanged_layers_2022.length; i++) {
          unchanged_layers_2022[i].unchanged_2022 = true;
        }
      } else if (DATA_YEAR === 2012) {
        for (let i = 0; i < unchanged_layers_2022.length; i++) {
          unchanged_layers_2022[i].unchanged_2022 = false;
        }
      }

      // deactivate any layers that don't have data for specific years
      // try to store draw props in a variable to restore them
      // This may not be necessary at all rn, as we don't want to
      // deactivate any layers now
      let deactivated_layers_2022 = [
        energy_maps.gas_well, energy_maps.oil_well, energy_maps.railroad,
        energy_maps.ac_na_and_under_100, energy_maps.ac_100_300,
        energy_maps.ac_345_735, energy_maps.dc]
      let deactivated_draw_props = []

      // TODO: fix this
      for (let i = 0; i < deactivated_layers_2022; i++) {
        deactivated_draw_props.push(deactivated_layers_2022[i].draw_props[0])
      }
      console.log(`deactivated draw props: ${JSON.stringify(deactivated_draw_props)}`)

      // Need a function to toggle draw props
      // Need some way of storing original draw_props in a buffer
      // to use again later

      let toggle_draw_props = function toggle_draw_props(deactivated_layers) {
        if (DATA_YEAR === 2022) {
          for (let i = 0; i < deactivated_layers.length; i++) {
            deactivated_layers[i].draw_props = false;
          }
        } else if (DATA_YEAR === 2012) {
          for (let i = 0; i < deactivated_layers.length; i++) {
            deactivated_layers[i].draw_props = true;
          }
        }
      }

      // toggle_draw_props(deactivated_layers_2022)

      // empty the array of layers to redraw and cboxes_to_check

      layers_to_redraw = [];

      cboxes_to_check = [];

      // remove any layers from the previous cycle

      for (let i = 0; i < layers_to_redraw.length; i++) {
        energy_maps.removeLayer(layers_to_redraw[i]);
      }

      let values = document.getElementsByClassName('asset-value');
      let asset_labels = document.getElementsByClassName('asset-label');
      let cboxes = document.getElementsByClassName('checkbox');

      for (let i = 0; i < cboxes.length; i++) {
        if (cboxes[i].checked) {
          cboxes_to_check.push(cboxes[i]);
        }
      }

      // populate array with layers to redraw and
      // remove current layers from the screen
      // for (let i = 0; i < layers.length; i++) {
      //   if (layers[i].active) {
      //     layers_to_redraw.push(layers[i])
      //     removeLayer(layers[i], transform)
      //   }
      // }

      // // redraw layers
      // for (let i = 0; i < layers_to_redraw.length; i++) {
      //   addLayer(layers_to_redraw[i], transform)
      // }

      layers = layers.map(x => {
        if (x.active) {
          energy_maps.removeLayer(x, TRANSFORM);
        }
        return x
      })

      var labels = document.getElementsByTagName('label');
      for (let i = 0, l = labels.length; i < l; i++) {
        labels[i].classList.add('asset-label')
      }

      // remove asset values, asset labels, and checkboxes
      for (let i = 0, l = layers.length; i < l; i++) {

        for (let i = 0, m = values.length; i < m; i++) {
          values[i].remove();
        }

        for (let i = 0, m = asset_labels.length; i < m; i++) {
          asset_labels[i].remove();
        }

        for (let i = 0, m = cboxes.length; i < m; i++) {
          cboxes[i].remove();
        }

      }

      // for (let i = 0; i < active_layers.length; i++) {
      //   active_layers[i].remove();
      // }

      // redraw the menu and reactivate draw functions
      _initMenu();

      // re-check the box on redraw
      for (let i = 0; i < cboxes_to_check.length; i++) {
        var cb = document.getElementsByClassName(`${cboxes_to_check[i].classList}`)[0];
        cb.click();
        cb.checked = true;
      }

      console.table(layers_to_redraw);
      console.log(layers_to_redraw);
      console.table(cboxes_to_check);
      console.log(cboxes_to_check);
      console.table(active_layers);
      console.log(active_layers);

      // let state_boundaries_asset_value = document.getElementsByClassName('state-boundaries')[4].children[0]
      // state_boundaries_asset_value.remove()


      console.log(DATA_YEAR);
      document.getElementById("value-year")
        .innerHTML = `out of ${year_val} in ${btn_val}`;
    });
  }


  create_year_button(2012, "$9.8T");
  create_year_button(2022, "$9.8T");

  // TODO: Why is this here? Shouldn't it be passed to funcs as we
  // create checkboxes?
  let checkbox_span;

  const initMenuAsteriskNote = function initMenuAsteriskNote
    ()
  {
    let note_div = d3.select('.options.canvas')
      .append('div')
      .attr('class', () => {return 'column asterisk-note'})
      .append('h4')
      .text('* 2012 asset values used');
  }

  // Load base map and any layers you want on by default

  energy_maps.draw_base_map(TRANSFORM);

  function fix_dpi(canvas) {
    // get height and width of a canvas as an integer (slice to remove 'px')
    let style_height = +getComputedStyle(canvas)
      .getPropertyValue('height').slice(0, -2);
    let style_width = +getComputedStyle(canvas)
      .getPropertyValue('width').slice(0, -2);
    d3.select(canvas)
      .attr('height', style_height * dpi)
      .attr('width', style_width * dpi);
  }

  energy_maps.base_canvas = base_canvas;
  energy_maps.base_ctx = base_ctx;

  return energy_maps;

})(EnergyMaps || {}, InfrastructureSet);