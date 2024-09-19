const Legend = (props) => {

  return (
    <div className="legend" data-toggle-state="load">
      <div className="shim">
        <h6>Legend</h6>
        <div className="legend-canvas">
          <canvas width="400" height="0"></canvas>
        </div>
        <div className="legend-tmpcanvas">
          <canvas width="400" height="1000"></canvas>
        </div>
        <div className="legend-toggle">
          <div className="shade"></div>
          <div className="legend-toggle-arrow uk-icon" uk-icon="icon: chevron-up; ratio: 3;"></div>
        </div>
      </div>
    </div>
  );
};

export default Legend;