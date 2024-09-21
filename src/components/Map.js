import styled from 'styled-components';

const StyledMap = styled.div`
  z-index: 510;
  background-color: #e7eff2;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`;

const Map = (props) => {

  return (
    <StyledMap className="main-map" />
  );
};

export default Map;