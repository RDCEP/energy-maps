import {useState} from 'react';
import styled from 'styled-components';
import {CssVars} from '../../const/CssVars';
import {Source} from './Source';
import {MenuLayers} from './MenuLayers';
import {OptionsToggle} from './OptionsToggle';

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

/**
 * The UI on the left side of the screen through which the
 * user controls the map layers.
 *
 * @return {JSX.Element}
 * @constructor
 */
export const LeftPane = () => {

  const [toggleState, setToggleState] = useState('load');

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
      <OptionsToggle
        toggleState={toggleState}
        setToggleState={setToggleState} />
    </StyledDialog>
  );
};