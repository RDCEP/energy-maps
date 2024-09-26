import styled from 'styled-components';
import DeckGLMap from './map/DeckGLMap';
import LeftPane from './left/LeftPane';
import ToolTip from './map/ToolTip';
import {useState} from 'react';
import {useRef} from 'react';

const StyledMain = styled.main`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const Main = (props) => {

  const [tooltip_visible, setTooltipVisible] = useState(false)
  const [tooltip_x, setTooltipX] = useState(0)
  const [tooltip_y, setTooltipY] = useState(0)
  const [tooltip_text, setTooltipText] = useState('')

  return (
    <StyledMain>
      <DeckGLMap />
      <ToolTip $visible={tooltip_visible} $x={tooltip_x} $y={tooltip_y}>
        {tooltip_text}
      </ToolTip>
      <LeftPane />
    </StyledMain>
  );
};

export default Main;