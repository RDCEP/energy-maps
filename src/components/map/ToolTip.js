import styled from 'styled-components';
import {Tooltip as ReactTooltip} from 'react-tooltip';

const StyledToolTip = styled(ReactTooltip)`
  position: fixed;
  background-color: black;
  padding: .5em;
  display: ${props => props.visible ? 'block' : 'none'};
  left: ${props => `${props.x}px`};
  top: ${props => `${props.y}px`};
`;

const ToolTip = (props) => {
  return (
    <StyledToolTip className="tooltip"></StyledToolTip>
  )
}

export default ToolTip;