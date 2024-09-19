import styled from 'styled-components';
import StyledH6 from '../../const/StyledBlocks';

const SourceSection = styled.section`
  
`

const SourceP = styled.p`
  font-size: .75rem;
  line-height: 1.2;
  text-align: center;
  padding: 0 2rem;
`

const Source = (props) => {

  return (
    <SourceSection>
      <StyledH6>Source</StyledH6>
      <SourceP><a href="">A Physical Inventory of the U.S. Energy System.</a>
        Chen, Weisbach, Matteson, Brizius, Moyer, 2020.</SourceP>
    </SourceSection>
  )
}

export default Source;