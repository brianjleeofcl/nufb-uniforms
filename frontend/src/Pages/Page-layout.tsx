import { BoxExtendedProps, Main } from "grommet";
import styled from "styled-components";
import { sizeIsS } from "../grommet/utils";
import { NAV_HEIGHT } from "../Nav-header/Nav-header";

export const MainContent = styled.div`
  flex: auto;
  overflow: auto;
`;

export const DetailLayout = styled.div`
  flex: 1 1 1000px;
  overflow: auto;
`

export const ReflexiveMain = styled<React.FC<BoxExtendedProps & { respSize: string }>>(Main)`
  ${({respSize}) => !sizeIsS(respSize)
    && `.timeline {
      height: calc(100vh - ${NAV_HEIGHT})
    }`}
`;