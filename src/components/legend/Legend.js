import styled from 'styled-components';
import {useState} from 'react';
import {CssVars} from '../../const/CssVars';
import {StyledH6} from '../../const/StyledBlocks';
import {LegendToggle} from './LegendToggle';

const StyledLegend = styled.div`
  display: block;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  width: 20rem;
  background-color: #ffffff;
  z-index: 700;
  border-top: 2px solid #024964;
  height: 4rem;
  
  &[data-toggle-state=closed] {
    animation-name:options_close;
    animation-duration:0.5s;
    left:-19rem;
  }
  &[data-toggle-state=closed] .options-toggle {
    left:100%
  }  
  &[data-toggle-state=closed] .options-toggle .shade {
    border-width: 2rem 0 2rem 2rem;
    border-color: transparent transparent transparent #024964;
  }
  &[data-toggle-state=closed] .options-toggle .options-toggle-arrow {
    transform: scaleX(-1);
  }

  &[data-toggle-state=open] {
    animation-name:options_open;
    animation-duration:0.5s;
    left:0;
  }
  &[data-toggle-state=open] .options-toggle {
    right:0
  }  
  &[data-toggle-state=open] .options-toggle .shade {
    border-width: 2rem 2rem 2rem 0;
    border-color: transparent #024964 transparent transparent;
  }
`

const StyledShim = styled.div`
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
  width: ${CssVars.legend_width};
`;

/**
 * Unfinished. To be used for drawing the legend.
 *
 * @return {JSX.Element}
 * @constructor
 */
export const Legend = () => {

  const [toggleState, setToggleState] = useState('load');

  return (
    <StyledLegend
      data-toggle-state={
      (toggleState === 'closed') ? 'closed' :
        (toggleState === 'open') ? 'open' : 'load' } >
      <StyledShim>
        <StyledH6>Legend</StyledH6>
      </StyledShim>
      <LegendToggle
        toggleState={toggleState}
        setToggleState={setToggleState} />
    </StyledLegend>
  );
};