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

/**
 * Unfinished. Tooltip container.
 *
 * @return {JSX.Element}
 * @constructor
 */
export const ToolTip = () => {
  return (
    <StyledToolTip className="tooltip"></StyledToolTip>
  )
};