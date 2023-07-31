/**
* @file Initializes the application in the browser.
* @author Benjamin Kleeman
* @author Nathan Matteson
*/

EnergyMaps = (function (EnergyMaps) {

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
  const mapContainer = '.main-map';
  const baseMapClass = '.base-map';

  /**
   *  @description A canvas element for the base map, attached to
   *  <div class="main map builder" id="mapcanvas">
   * @memberof Init
   */
  const baseCanvas = d3
    .select(baseMapClass)
    .append('canvas')
    .attr('id', 'mapcanvas')
    .attr('width', EnergyMaps.width)
    .attr('height', EnergyMaps.height);

  const baseCtx = baseCanvas.node().getContext('2d');
  baseCtx.LineCap = 'round';

  /**
   * @description Draw the base map for the application based off
   * of the data from fmap and fmapfill
   * @memberof Init
   */
  const drawBaseMap = function drawBaseMap
    (transform)
  {
    Promise.all(
      [d3.json(fmap)]
    ).then(function(files) {
      EnergyMaps.drawLand(baseCtx, files, transform, false, false);
    });
  };

  let layersToRedraw = []
  let cBoxesToCheck = []
  let unchangedLayers2022 = []

  const createYearButton = function createYearButton
    (btnVal, yearVal)
  {
    let btn = document.createElement("button");
    btn.innerHTML = `${btnVal}`;
    document.querySelector('.options-list h6')
      .appendChild(btn);
    btn.classList.add('btn-year');
    btn.addEventListener('click', function() {
      btnVal = btnVal;
      data_year = EnergyMaps.get_data_year(btnVal)
      // API_URL_PREFIX = `http://127.0.0.1:5000/api/v0.1.0/infrastructure/${DATA_YEAR}`

      // Add an asterisk if year is 2022
      if (DATA_YEAR === 2022) {
        initMenuAsteriskNote();
      } else if (DATA_YEAR === 2012) {
        EnergyMaps.asteriskNote[0].remove()
      }

      unchangedLayers2022 = [
        EnergyMaps.gasWell, EnergyMaps.oilWell, EnergyMaps.railroad,
        EnergyMaps.AcNaAndUnder100, EnergyMaps.Ac100300,
        EnergyMaps.Ac345735, EnergyMaps.dc, EnergyMaps.gasPipeline,
        EnergyMaps.oilPipeline, EnergyMaps.oilProductPipeline ];
      if (DATA_YEAR === 2022) {
        for (let i = 0; i < unchangedLayers2022.length; i++) {
          unchangedLayers2022[i].unchanged_2022 = true;
        }
      } else if (DATA_YEAR === 2012) {
        for (let i = 0; i < unchangedLayers2022.length; i++) {
          unchangedLayers2022[i].unchanged_2022 = false;
        }
      }

      // deactivate any layers that don't have data for specific years
      // try to store draw props in a variable to restore them
      // This may not be necessary at all rn, as we don't want to
      // deactivate any layers now
      let deactivatedLayers2022 = [
        EnergyMaps.gasWell, EnergyMaps.oilWell, EnergyMaps.railroad,
        EnergyMaps.AcNaAndUnder100, EnergyMaps.Ac100300,
        EnergyMaps.Ac345735, EnergyMaps.dc]
      let deactivatedDrawProps = []

      // TODO: fix this
      for (let i = 0; i < deactivatedLayers2022; i++) {
        deactivatedDrawProps.push(deactivatedLayers2022[i].drawProps[0])
      }
      console.log(`deactivated draw props: ${JSON.stringify(deactivatedDrawProps)}`)

      // Need a function to toggle draw props
      // Need some way of storing original draw_props in a buffer
      // to use again later

      let toggleDrawProps = function toggleDrawProps(deactivatedLayers) {
        if (DATA_YEAR === 2022) {
          for (let i = 0; i < deactivatedLayers.length; i++) {
            deactivatedLayers[i].drawProps = false;
          }
        } else if (DATA_YEAR === 2012) {
          for (let i = 0; i < deactivatedLayers.length; i++) {
            deactivatedLayers[i].drawProps = true;
          }
        }
      }

      // toggleDrawProps(deactivatedLayers2022)

      // empty the array of layers to redraw and cBoxesToCheck

      layersToRedraw = [];

      cBoxesToCheck = [];

      // remove any layers from the previous cycle

      for (let i = 0; i < layersToRedraw.length; i++) {
        EnergyMaps.removeLayer(layersToRedraw[i]);
      }

      let values = document.getElementsByClassName('asset-value');
      let assetLabels = document.getElementsByClassName('asset-label');
      let cBoxes = document.getElementsByClassName('checkbox');

      for (let i = 0; i < cBoxes.length; i++) {
        if (cBoxes[i].checked) {
          cBoxesToCheck.push(cBoxes[i]);
        }
      }

      // populate array with layers to redraw and
      // remove current layers from the screen
      // for (let i = 0; i < layers.length; i++) {
      //   if (layers[i].active) {
      //     layersToRedraw.push(layers[i])
      //     removeLayer(layers[i], transform)
      //   }
      // }

      // // redraw layers
      // for (let i = 0; i < layersToRedraw.length; i++) {
      //   addLayer(layersToRedraw[i], transform)
      // }

      layers = layers.map(x => {
        if (x.active) {
          EnergyMaps.removeLayer(x, EnergyMaps.transform);
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

        for (let i = 0, m = assetLabels.length; i < m; i++) {
          assetLabels[i].remove();
        }

        for (let i = 0, m = cBoxes.length; i < m; i++) {
          cBoxes[i].remove();
        }

      }

      // for (let i = 0; i < active_layers.length; i++) {
      //   active_layers[i].remove();
      // }

      // redraw the menu and reactivate draw functions
      _initMenu();

      // re-check the box on redraw
      for (let i = 0; i < cBoxesToCheck.length; i++) {
        var cb = document.getElementsByClassName(`${cBoxesToCheck[i].classList}`)[0];
        cb.click();
        cb.checked = true;
      }

      console.table(layersToRedraw);
      console.log(layersToRedraw);
      console.table(cBoxesToCheck);
      console.log(cBoxesToCheck);
      console.table(ACTIVE_LAYERS);
      console.log(ACTIVE_LAYERS);

      // let state_boundaries_asset_value = document.getElementsByClassName('state-boundaries')[4].children[0]
      // state_boundaries_asset_value.remove()


      console.log(DATA_YEAR);
      document.getElementById("value-year")
        .innerHTML = `out of ${yearVal} in ${btnVal}`;
    });
  }

  createYearButton(2012, "$9.8T");
  createYearButton(2022, "$9.8T");

  const initMenuAsteriskNote = function initMenuAsteriskNote
    ()
  {
    let noteDiv = d3.select('.options.canvas')
      .append('div')
      .attr('class', () => {return 'column asterisk-note'})
      .append('h4')
      .text('* 2012 asset values used');
  }

  function fixDpi(canvas) {
    // get height and width of a canvas as an integer (slice to remove 'px')
    let style_height = +getComputedStyle(canvas)
      .getPropertyValue('height').slice(0, -2);
    let style_width = +getComputedStyle(canvas)
      .getPropertyValue('width').slice(0, -2);
    d3.select(canvas)
      .attr('height', style_height * dpi)
      .attr('width', style_width * dpi);
  }

  drawBaseMap(EnergyMaps.transform);

  EnergyMaps.drawBaseMap = drawBaseMap;
  EnergyMaps.baseCanvas = baseCanvas;
  EnergyMaps.baseCtx = baseCtx;

  return EnergyMaps;

})(EnergyMaps || {});