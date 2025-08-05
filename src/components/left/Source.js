import styled from 'styled-components';
import StyledH6 from '../../const/StyledBlocks';

const StyledSourceSection = styled.section`
`;

const StyledSourceP = styled.p`
  font-size: .75rem;
  line-height: 1.2;
  text-align: center;
  padding: 0 2rem;
`;

const Source = (props) => {

  return (
    <StyledSourceSection>
      <StyledH6>Source</StyledH6>
      <StyledSourceP>
        <a href="">A Physical Inventory of the U.S. Energy System.</a> Chen,
          Weisbach, Matteson, Brizius, Moyer, 2020.
      </StyledSourceP>
    </StyledSourceSection>
  )
}

export default Source;