import styled from 'styled-components';
import CssVars from '../../const/CssVars';
import Source from './Source';
import MenuLayers from './MenuLayers';

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

const LeftPane = (props) => {

  return (
    <StyledDialog data-toggle-state="open">
      <StyledShim>
        <StyledContainer>
          <Source />
          <MenuLayers />
        </StyledContainer>
      </StyledShim>
    </StyledDialog>
  );
};

export default LeftPane;