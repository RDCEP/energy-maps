import { useState } from 'react';
import styled from 'styled-components';



const StyledToolTip = styled.div`
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