import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

const StyledToolTip = styled(ReactTooltip)`
  position: fixed;
  background-color: black;
  padding: .5em;
  display: ${props => props.visible ? 'block' : 'none'};
  left: ${props => console.log(props)};
  top: ${props => `${props.y}px`};
`;

const ToolTip = (props) => {
  console.log(props);
  return (
    <StyledToolTip className="tooltip"></StyledToolTip>
  )
}

export default ToolTip;