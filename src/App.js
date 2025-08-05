import {useEffect} from 'react';
import MainHeader from './components/header/MainHeader';
import Main from './components/Main';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import GlobalStyle from './components/GlobalStyle';
import {ZoomLevelContextProvider} from './contexts/ZoomContext';
import {LayerContextProvider} from './contexts/LayerContext';
import {DataYearContextProvider} from './contexts/DataYearContext';

function App() {

  useEffect(() => {
    UIkit.use(Icons)
  });

  return (
    <ZoomLevelContextProvider>
      <LayerContextProvider>
        <DataYearContextProvider>
          <GlobalStyle />
          <MainHeader />
          <Main />
        </DataYearContextProvider>
      </LayerContextProvider>
    </ZoomLevelContextProvider>
  );
}

export default App;