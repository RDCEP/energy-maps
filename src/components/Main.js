import styled from 'styled-components';
import Map from './map/Map';
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
      <Map />
      <LeftPane />
    </StyledMain>
  );
};

export default Main;