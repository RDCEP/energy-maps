/**
 * @file Provides draw functions and any helpers for all power plants.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Plants
 */

const draw_single_plant = function draw_single_plant(ctx, queued_data, fuel) {
  console.log('draw_single_plant');

  let wells = queued_data[0];

  // Filter out all records based on primary fuel and draw their white layer
  features = wells.features
    .filter(function(d) {
      return d.properties.primary_fu === fuel; 
    });
  features.forEach(function(d) {
    let xy = projection(d.geometry.coordinates);
    draw_power_plant(ctx, xy, viz.white, +d.properties.total_cap);
  });
  // Draw the standard layer
  features.forEach(function(d, i) {
    let xy = projection(d.geometry.coordinates);
    if (xy === null) {
      //
    } else {
      let color = 'black';
      switch(fuel) {
        case 'COAL': color = viz.plants.coal; break;
        case 'GEO': color = viz.plants.geo; break;
        case 'HYC': color = viz.plants.hydro; break;
        case 'NG': color = viz.plants.gas; break;
        case 'NUC': color = viz.plants.nuclear; break;
        case 'PET': color = viz.plants.oil; break;
        case 'SUN': color = viz.plants.solar; break;
        case 'WND': color = viz.plants.wind; break;
        default:
          color =  'rgba(255, 255, 255, 0)';  break;
      }
      draw_power_plant(ctx, xy, color, +d.properties.total_cap);
    }
    if (i === features.length - 1) { 
      hide_spinner(); 
    }
  });

};

const draw_power_plants = function draw_power_plants(ctx, queued_data, nff) {
  console.log('draw_power_plants');

  let wells = queued_data[0];

  // Toggle fuels for fossil vs non-fossil fuels
  let fuels = ['PET', 'NG', 'COAL'];
  if (nff) {
    fuels = ['SUN', 'WND', 'NUC', 'GEO', 'HYC'];
  }

  // Attempt at filtering by layer
  // If you decide to bring this back in and make it work, 
  // change method signature to draw_power_plants(ctx, queued_data, nff, set)

  // if (set === fuels[0]) {
  //   wells.features.filter(function(d) {
  //     return fuels.indexOf(d.properties.primary_fu) == fuels[0];
  //   })
  //   .forEach(function(d) {
  //     let xy = projection(d.geo.coordinates);
  //     draw_power_plant(ctx, xy, iz.whit, +d.properties.total_cap);
  //   });
  //   wells.features
  //     .filter(function(d) {
  //       return fuels.indexOf(d.properties.primary_fu) == fuels[0];
  //     }).forEach(function(d) {
  //       let xy = projection(d.geometry.coordinates);
  //       if (xy == null) {
  //         //
  //       } else {
  //         let color = viz.plants.oil;
  //         draw_power_plant(ctx, xy, color, +d.properties.total_cap);
  //       }
  //     })
  // }
  wells.features.filter(function(d) {
      return fuels.indexOf(d.properties.primary_fu) > -1;
    })
    .forEach(function(d) {
      let xy = projection(d.geometry.coordinates);
      draw_power_plant(ctx, xy, viz.white, +d.properties.total_cap);
    });
  wells.features
    .filter(function(d) {
      return fuels.indexOf(d.properties.primary_fu) > -1;
    }).forEach(function(d) {
      let xy = projection(d.geometry.coordinates);
      if (xy === null) {
        //
      } else {
        let color = 'black';
        switch(d.properties.primary_fu) {
          case 'COAL': color = viz.plants.coal; break;
          case 'NG': color = viz.plants.gas; break;
          case 'PET': color = viz.plants.oil; break;
          case 'HYC': color = viz.plants.hydro; break;
          case 'SUN': color = viz.plants.solar; break;
          case 'WND': color = viz.plants.wind; break;
          case 'GEO': color = viz.plants.geo; break;
          case 'NUC': color = viz.plants.nuclear; break;
          default:
            color =  'rgba(255, 255, 255, 0)';  break;
        }
        draw_power_plant(ctx, xy, color, +d.properties.total_cap);
      }
    });
  // plants_legend(ctx, nff);
};

const draw_ff_plants = function draw_ff_plants(ctx, queued_data) {
  draw_power_plants(ctx, queued_data, false)
};

const draw_nff_plants = function draw_nff_plants(ctx, queued_data) {
  draw_power_plants(ctx, queued_data, true)
};

// const draw_coal_plants = function draw_coal_plants(ctx, queued_data) {
//   draw_power_plants(ctx, queued_data, false)
// };

const draw_power_plant = function draw_power_plant(ctx, xy, color, r) {
  ctx.strokeStyle = viz.plants.stroke.light;
  ctx.lineWidth = viz.plants.stroke.width;
  ctx.fillStyle = color;
  r = Math.sqrt(r / Math.PI) * viz.plants.scale;
  ctx.beginPath();
  // Draw larger circle for stroke, so that stroke aligns to outside of
  //  of circumference
  draw_circle(ctx, xy, r + ctx.lineWidth);
  // FIXME: Need a better method of changing stroke color for lighter circles.
  if (color !== viz.white) {
    if (color === viz.plants.gas) {
      ctx.strokeStyle = 'darkblue';
    } else if (color === viz.plants.solar) {
      ctx.strokeStyle = 'darkorange';
      // ctx.strokeStyle = viz.plants.stroke.dark;
    }
    ctx.stroke();
  }
  draw_circle(ctx, xy, r);
  ctx.fill();
};

const draw_coal_plants = function draw_coal_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, 'COAL')
};

const draw_ng_plants = function draw_ng_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, 'NG')
};

const draw_petro_plants = function draw_petro_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, 'PET')
};

const draw_hydro_plants = function draw_hydro_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, 'HYC')
};

const draw_nuclear_plants = function draw_nuclear_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, 'NUC')
};

const draw_wind_farms = function draw_wind_farms(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, 'WND')
};

const draw_solar_plants = function draw_solar_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, 'SUN')
};

const draw_geo_plants = function draw_geo_plants(ctx, queued_data) {
  draw_single_plant(ctx, queued_data, 'GEO')
};

