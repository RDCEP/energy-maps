function draw_map(opt1, opt2) {
    draw_land();
    if (opt1 == true && opt2 == true) {
        draw_one();
        draw_two();
    }
    else if (opt1 == true && opt2 != true) {
        draw_one();
    } 
    else if (opt1 =! true && opt2 == true) {
        draw_two();
    }
    else {
        return
    }
}




  // toggle(layer1)
  // checked = false
  // if (checked = false) {
  //     layer1.clear();
  // }
  // toggle layer2
  // toggle layer ..
  // toggle layer n

  // function toggle(layer) {
  //     let checked = false;
  //     if (!checked) {
  //         onclick, checked = true
  //     }
  //      else if (checked) {
  //      onclick, checked = false
  //    }
  //
  //    if checked == false,
  //    clear()
  // }
  //







draw_base_map();

  /** Draw the base map */
  function draw_base_map() {
    Promise.all([
      d3.json(fmap),
      d3.json(fmapfill)
    ]).then(function(files) {
      draw_land(ctx, files)
    }).then(function() {
        coal_legend(ctx);
      });
      
      if (d3.select("#cb-coal").attr('id') == 'checked')
        toggle_coal_mines()
      if (d3.select("#cb-rrmap").attr('id') == 'checked')
        toggle_rrmap()

      if (rr && coal) {
        toggle_rrmap()
        toggle_coal_mines()
      }
      else if (rr && !coal)
        toggle_rrmap();
      else if (!rr && coal)
        toggle_coal_mines()
  }

  


  function submit() {
    if (d3.select("#cb-coal").attr('id') == 'checked') {
      draw_base_map()
    console.log("options submitted")
    }
  }




  function submit() {
    console.log("options submitted")
    draw_base_map()
    if (d3.select('#cb-rrmap').property('checked', true)) {
      toggle_rrmap()
    }
    if (d3.select('#cb-coal').property('checked', true)) {
      toggle_coal_mines()
    }
  }


  
  

  document.getElementById("submit")
  .addEventListener("click", submit())
  .addEventListener("click", function() {
    console.log("submit clicked")
  })