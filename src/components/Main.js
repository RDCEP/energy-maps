import styled from 'styled-components';
import DeckGLMap from './map/DeckGLMap';
import LeftPane from './left/LeftPane';

const StyledMain = styled.main`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const Main = (props) => {

  return (
    <StyledMain>
      <DeckGLMap />
      <LeftPane />
    </StyledMain>
  );
};

export default Main;