/** Draw a layer to the screen. 
 * Pass the data from a JSON file through a drawing function out to a canvas context. */
function draw_json_layer(path, draw_function, ctx) {
    Promise.all([
      d3.json(path)
    ]).then(function(files) {
      draw_function(ctx, files)
    })
    console.log(`draw json layer`);
  }  

function draw_csv_layer(path, draw_function, ctx) {
    Promise.all([
        d3.csv(path)
    ]).then(function(files) {
        draw_function(ctx, files)
    });
    console.log(`draw csv layer`);
}

/** @description an array that contains the asset value of all active layers */
let asset_total = [0];
/** @description the total sum of asset values for all active layers */
let asset_total_sum;

/** Add total asset value of all active layers. */
  function calc_asset_total_sum() {
    // use Array.reduce() as an accumulator to add up all values in the array
    asset_total_sum = asset_total.reduce((total, amount) => total + amount);
  }

  /** Add the passed value to the asset total array and compute the new value */
  function increment_asset_total(value) {
    asset_total.push(value);
    calc_asset_total_sum();
    display_asset_total()
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
    display_asset_total()
  }

  /** Display total asset value of all active layers.
   * Numeral.js is used for currency formatting (http://numeraljs.com/#format)
   */
  function display_asset_total() {
    let asset_total_sum_display = numeral(asset_total_sum).format('$0.00a').toUpperCase();
    /** @description A numeric constant that represents the last 4 digits of a formatted number. 
     * Used to trim the '.00B' or '.00T' off of a formatted number. */
    const UNWANTED_PRECISION = 4;
    /** @description A regular expression that matches '.00' followed by any other character. Used to check for strings ending in ".00B" or ".00T"*/
    const REGEX_TWO_TRAILING_ZEROES = /[.]00\w/;
    /** @description A regular expression that matches '.10' followed by any other character (substitute 1 for any other number). Used to check for strings ending in ".10B" or ".10T"*/
    const REGEX_ONE_POS_ONE_ZERO = /[.]\w0\w/;
    /** @description A regular expression that matches '.01' followed by any other character (substitute 1 for any other number). Used to check for strings ending in ".01B" or ".01T"*/
    const REGEX_ONE_ZERO_ONE_POS = /[.]0\w\w/;
    const NUMBER_SCALE_SIGNIFIER = 1;
    // Check if the number format is blacklisted. 
    if (REGEX_TWO_TRAILING_ZEROES.test(asset_total_sum_display.substring(asset_total_sum_display.length - UNWANTED_PRECISION)) || REGEX_ONE_POS_ONE_ZERO.test(asset_total_sum_display.substring(asset_total_sum_display.length - UNWANTED_PRECISION)) || REGEX_ONE_ZERO_ONE_POS.test(asset_total_sum_display.substring(asset_total_sum_display.length - UNWANTED_PRECISION))) {
      if (asset_total_sum_display.substring(asset_total_sum_display.length - NUMBER_SCALE_SIGNIFIER) == 'B') {
        asset_total_sum_display = asset_total_sum_display.slice(0, -4) + 'B';  
        // Can't get gas well to format as 1.06B without making it a special case... not without wrecking everything else
        if (asset_total_sum == 1_059_000_000) {
          asset_total_sum_display = "$1.06B"
        }
      }
      if (asset_total_sum_display.substring(asset_total_sum_display.length - NUMBER_SCALE_SIGNIFIER) == 'T') {
        asset_total_sum_display = asset_total_sum_display.slice(0, -4) + 'T';  
      } 
    }
    document.getElementById(
      "asset-totals"
    ).innerHTML = `<p>Asset totals: ${asset_total_sum_display} of $10.5T shown.</p>`;
  }