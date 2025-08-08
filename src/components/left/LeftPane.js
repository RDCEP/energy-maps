import {useState} from 'react';
import styled from 'styled-components';
import {CssVars} from '../../const/CssVars';
import {Source} from './Source';
import {MenuLayers} from './MenuLayers';

const StyledDialog = styled.dialog`
  display: block;
  position: relative;
  width: ${CssVars.options_width};
  top: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  background-color: ${CssVars.white};
  border: none;
  border-right: 2px solid ${CssVars.darkblue};
  z-index: 910;

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
`;

const StyledShim = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  width: ${CssVars.options_width};
`;

const StyledContainer = styled.div`
  padding: 6.75rem 0 2rem 0;
  width: ${CssVars.options_width};
`;

const StyledOptionsToggle = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  right: 0;
  align-items: center;
  height: 4rem;
  width: 2rem;
  top: 14.5rem;
  z-index: 999;
`

const StyledShade = styled.div`
  position: absolute;
  top: 0;
  height: 0;
  width: 0;
  border-width: 2rem 2rem 2rem 0;
  border-color: transparent #024964 transparent transparent;
  border-style: solid;
`

const StyledOptionsToggleArrow = styled.div`
  margin: 0;
  border: none;
  border-radius: 0;
  overflow: visible;
  font: inherit;
  color: #ffffff;
  text-transform: none;
  padding: 0;
  background-color: transparent;
  display: inline-block;
  fill: currentcolor;
  line-height: 0;
`

/**
 * The interface on the left side of the screen through which the
 * user controls the map layers.
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const LeftPane = (props) => {
  const [toggleState, setToggleState] = useState('load');

  const toggleOptions = function(event) {
    setToggleState((toggleState === 'closed') ? 'open' : 'closed')
  }

  return (
    <StyledDialog
      data-toggle-state={
      (toggleState === 'closed') ? 'closed' :
        (toggleState === 'open') ? 'open' : 'load' } >
      <StyledShim>
        <StyledContainer>
          <Source />
          <MenuLayers />
        </StyledContainer>
      </StyledShim>
      <StyledOptionsToggle
        onClick={toggleOptions}
        className='options-toggle' >
        <StyledShade className='shade'></StyledShade>
        <StyledOptionsToggleArrow
          className='uk-icon options-toggle-arrow'
          data-uk-icon='icon: chevron-left; ratio: 3;' >
        </StyledOptionsToggleArrow>
      </StyledOptionsToggle>
    </StyledDialog>
  );
};