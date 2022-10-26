import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { Box, BoxProps, Grommet, Heading, Main, Paragraph, ResponsiveContext } from 'grommet';
import { theme } from './grommet/theme';
import { NavHeader, NAV_HEIGHT } from './Nav-header/Nav-header';
import { Timeline } from './Timeline/Timeline';
import { LatestGameDetail, SingleGameDetail } from './Game-detail/Game-detail';
import styled from 'styled-components';
import { UniformList } from './Uniform-list/Uniform-list';
import { UniformInfoView } from './Uniform-info-view/Uniform-info-view';
import { UniformTimeline } from './Uniform-timeline/Uniform-timeline';
import { AboutPage } from './About-page/About-page';
import { sizeIsS } from './grommet/utils';
import { Alert } from 'grommet-icons';
import './App.css';
import { preloadMetadata } from './Models/App-metadata';
import { DataSummaryRequest } from './Requests';

export const SchemeContext = createContext(preloadMetadata)

const ResponsiveContainer = styled<React.FC<BoxProps & { respSize: string }>>(Box)`
${(props) =>  sizeIsS(props.respSize)
  ? `header {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  height: -webkit-fill-available;`
  : `
  height: 100vh;
  `
}
`;


function App() {
  const [dataSummary, setScheme] = useState(preloadMetadata)
  useEffect(() => {
    new DataSummaryRequest().asPromise().then(data => setScheme(data))
  }, [])
  return (
    <Grommet theme={theme}>
      <SchemeContext.Provider value={dataSummary}>
        <ResponsiveContext.Consumer>
          {
            resp => <ResponsiveContainer respSize={resp}>
              <NavHeader />
              <Routes>
                <Route path="/*" element={<GamePage />} />
                <Route path="/uniform/*" element={<SimplePage />}>
                  <Route index element={<UniformList />} />
                  <Route path=":combination" element={<UniformInfoView />} />
                </Route>
                <Route path="/timeline" element={<UniformTimelineContainer />} />
                <Route path="/about" element={<MainContent><AboutPage /></MainContent>} />
              </Routes>
            </ResponsiveContainer>
          }
          </ResponsiveContext.Consumer>
      </SchemeContext.Provider>
    </Grommet>
  );
}

const UniformTimelineContainer = () => {
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement> ;

  return <MainContent ref={containerRef}>
    <Box align="center" pad="50px">
      <Alert/>
      <Heading level="3">Sorry, under construction</Heading>
      <Paragraph>Anyone know of a charting library that's maintained? I'm all ears at this point.</Paragraph>
    </Box>
    {/* <UniformTimeline parentRef={containerRef} /> */}
  </MainContent>
}

const MainContent = styled.div`
  flex: auto;
  overflow: auto;
`;

const DetailLayout = styled.div`
  flex: 1 1 1000px;
  overflow: auto;
`

const ReflexiveMain = styled<React.FC<BoxProps & { respSize: string }>>(Main)`
  ${({respSize}) => !sizeIsS(respSize)
    && `.timeline {
      height: calc(100vh - ${NAV_HEIGHT})
    }`}

`;

function GamePage() {
  const size = useContext(ResponsiveContext)
  return <ReflexiveMain direction="row" flex="shrink" respSize={size}>
    {size !== 'small' && <Timeline />}
    <Routes>
      <Route path="/" element={
        size !== 'small' ? <DetailLayout><LatestGameDetail /></DetailLayout> : <Timeline />
      }/>
      <Route path="/game/:year/:week" element={<DetailLayout><SingleGameDetail /></DetailLayout>}/>
    </Routes>
  </ReflexiveMain>
}

function SimplePage() {
  return <MainContent>
    <Outlet />
  </MainContent>
}

export default App;
