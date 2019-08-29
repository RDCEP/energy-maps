/** Draw a layer to the screen. 
 * Pass the data from a JSON file through a drawing function out to a canvas context. */
function draw_json_layer(path, draw_function, context) {
    Promise.all([
      d3.json(path)
    ]).then(function(files) {
      draw_function(context, files)
    })
    console.log(`draw json layer`);
  }  

function draw_csv_layer(path, draw_function, context) {
    Promise.all([
        d3.csv(path)
    ]).then(function(files) {
        draw_function(context, files)
    });
    console.log(`draw csv layer`);
}

/** @description an array that contains the asset value of all active layers */
let asset_total = [0];
/** @description the total sum of asset values for all active layers */
let asset_total_sum;

/** Add total asset value of all active layers.
   * Numeral.js is used for currency formatting (http://numeraljs.com/#format)
   */
  function calc_asset_total_sum() {
    // use Array.reduce() as an accumulator to add up all values in the array
    asset_total_sum = asset_total.reduce((total, amount) => total + amount);
    document.getElementById(
      "asset-totals"
    // ).innerHTML = `<p>Asset totals: Approximately ${numeral(asset_total_sum).format('$0.000 a').toUpperCase()} of $10.5 T shown.</p>`;
    ).innerHTML = `<p>Asset totals: Approximately ${numeral(asset_total_sum).format('$0.00a').toUpperCase()} of $10.5T shown.</p>`;
  }

  /** Add the passed value to the asset total array and compute the new value */
  function increment_asset_total(value) {
    asset_total.push(value);
    calc_asset_total_sum();
  }

  /** Remove the passed value from the asset total array and compute the new value */
  function decrement_asset_total(value) {
    for (let i in asset_total) {
      if (asset_total[i] == value) {
        asset_total.splice(i, 1)
        break
      }
    }
    calc_asset_total_sum();
  }