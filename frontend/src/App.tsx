import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, BoxExtendedProps, Grommet, ResponsiveContext } from 'grommet';
import { theme } from './grommet/theme';
import { NavHeader } from './Nav-header/Nav-header';
import styled from 'styled-components';
import { sizeIsS } from './grommet/utils';
import './App.css';
import { preloadMetadata } from './Models/App-metadata';
import { DataSummaryRequest } from './Requests';

export const SchemeContext = createContext(preloadMetadata)

export function App() {
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
              <Outlet />
            </ResponsiveContainer>
          }
        </ResponsiveContext.Consumer>
      </SchemeContext.Provider>
    </Grommet>
  );
}

const ResponsiveContainer = styled<React.FC<BoxExtendedProps & { respSize: string }>>(Box)`
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
