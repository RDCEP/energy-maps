/**
 * Provides a SVG burger icon for dragging layers in the map options panel.
 *
 * @return {JSX.Element}
 * @constructor
 */
export const DragHandle = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <rect width="12" height="1" x="6" y="4"></rect>
      <rect width="12" height="1" x="6" y="9"></rect>
      <rect width="12" height="1" x="6" y="14"></rect>
      <rect width="2" height="1" x="2" y="4"></rect>
      <rect width="2" height="1" x="2" y="9"></rect>
      <rect width="2" height="1" x="2" y="14"></rect>
    </svg>
  );
};

/**
 * UNUSED. Provided by UIkit.
 * Provides a SVG left-facing chevron for closing the map options panel.
 *
 * @return {JSX.Element}
 * @constructor
 */
export const ChevronLeft = () => {
  return (
    <svg width="60" height="60" viewBox="0 0 20 20">
      <polyline fill="none" stroke="#fff" stroke-width="1.03" points="13 16 7 10 13 4">
      </polyline>
    </svg>
  );
};

/**
 * UNUSED. Using PNG file instead.
 * Provides SVG shapes for map icons.
 *
 * @return {JSX.Element}
 * @constructor
 */
export const MapIcons = () => {
  return (
    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 170 30">
      <rect width="170" height="30" fill="#fff" fill-opacity="0.01"/>
      <rect x="10" y="8" width="12" height="12"/>
      <polygon points="36.9 8 30 20 43.9 20 36.9 8"/>
      <polygon points="136.9 20 130 8 143.9 8 136.9 20"/>
      <polygon points="60.4 8 53.5 8 50 14 53.5 20 60.4 20 63.9 14 60.4 8"/>
      <polygon points="155.2 8 150 11 150 17 155.2 20 160.4 17 160.4 11 155.2 8"/>
      <polygon points="76.3 20 70 15.4 72.4 8 80.2 8 82.6 15.4 76.3 20"/>
      <path d="M117.4,14l4.3-4.3c.4-.4.4-1,0-1.4s-1-.4-1.4,0l-4.3,4.3-4.3-4.3c-.4-.4-1-.4-1.4,0s-.4,1,0,1.4l4.3,4.3-4.3,4.3c-.4.4-.4,1,0,1.4s.5.3.7.3.5,0,.7-.3l4.3-4.3,4.3,4.3c.2.2.5.3.7.3s.5,0,.7-.3c.4-.4.4-1,0-1.4l-4.3-4.3Z"/>
      <path d="M101,13h-4v-4c0-.6-.4-1-1-1s-1,.4-1,1v4h-4c-.6,0-1,.4-1,1s.4,1,1,1h4v4c0,.6.4,1,1,1s1-.4,1-1v-4h4c.6,0,1-.4,1-1s-.4-1-1-1Z"/>
    </svg>
  );
};