import {useState} from 'react';

export const useZoom = (initialZoom) => {
  const [zoomLevel, setZoomLevel] = useState(initialZoom);

  return {zoomLevel,  setZoomLevel};
}