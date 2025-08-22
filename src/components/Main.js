import styled from 'styled-components';
import {DeckGLMap} from './map/DeckGLMap';
import {DndContext} from '@dnd-kit/core';
import {LeftPane} from './left/LeftPane';
import {ToolTip} from './map/ToolTip';

const StyledMain = styled.main`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

/**
 * The main wrapper around the header, left pane, map, legend, etc.
 *
 * @return {JSX.Element}
 * @constructor
 */
export const Main = () => {
  return (
    <StyledMain>
      <DeckGLMap />
      <ToolTip></ToolTip>
      <div></div>
      <DndContext>
        <LeftPane />
      </DndContext>
    </StyledMain>
  );
};