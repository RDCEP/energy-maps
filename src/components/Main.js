import {useState, useRef} from 'react';
import styled from 'styled-components';
import DeckGLMap from './map/DeckGLMap';
import LeftPane from './left/LeftPane';
import ToolTip from './map/ToolTip';

const StyledMain = styled.main`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const Main = (props) => {

  const [tooltip_visible, setTooltipVisible] = useState(false);
  const [tooltip_x, setTooltipX] = useState(0);
  const [tooltip_y, setTooltipY] = useState(0);
  const [tooltip_text, setTooltipText] = useState('');
  // TODO: should asset_total implement useState or useRef?
  const [asset_total, setAssetTotal] = useState(0);
  // TODO: `useState` is going to update the map so it shouldn't really be used
  //  except for incrementing the year---because that may be the only time when
  //  the map actually needs to be redrawn. Actually no, the layers also trigger
  //  a redraw. So they need to useState. But in the markup below the LeftPane
  //  is separate from the DeckGLMap, so can we not refer to the state variable in
  //  both elements????

  return (
    <StyledMain>
      <DeckGLMap />
      <ToolTip visible={tooltip_visible} x={tooltip_x} y={tooltip_y}>
        {tooltip_text}
      </ToolTip>
      <div></div>
      <LeftPane />
    </StyledMain>
  );
};

export default Main;