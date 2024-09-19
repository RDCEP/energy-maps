import styled from 'styled-components';
import CssVars from '../../const/CssVars';
import Source from './Source';
import MenuLayers from './MenuLayers';

const Dialog = styled.dialog`
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
`

const Shim = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  width: ${CssVars.options_width};
`

const Container = styled.div`
  padding: 6.75rem 0 2rem 0;
  width: ${CssVars.options_width};
`

const LeftPane = (props) => {

  return (
    <Dialog data-toggle-state="open">
      <Shim>
        <Container>
          <Source />
          <MenuLayers />
        </Container>
      </Shim>
    </Dialog>
  );
};

export default LeftPane;