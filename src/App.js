import {useEffect} from 'react';
import {MainHeader} from './components/header/MainHeader';
import {Main} from './components/Main';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import {GlobalStyle} from './components/GlobalStyle';
import {ZoomLevelContextProvider} from './contexts/ZoomContext';
import {LayerContextProvider} from './contexts/LayerContext';
import {DataYearContextProvider} from './contexts/DataYearContext';
import {AssetValueContextProvider} from './contexts/AssetValueContext';

function App() {

  useEffect(() => {
    UIkit.use(Icons)
  });

  return (
    <ZoomLevelContextProvider>
      <LayerContextProvider>
        <DataYearContextProvider>
          <AssetValueContextProvider>
            <GlobalStyle />
            <MainHeader />
            <Main />
          </AssetValueContextProvider>
        </DataYearContextProvider>
      </LayerContextProvider>
    </ZoomLevelContextProvider>
  );
}

export default App;