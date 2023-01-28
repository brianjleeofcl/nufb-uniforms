import { Box, Image } from "grommet"
import { Close } from "grommet-icons";
import { MarginType } from "grommet/utils";
import { MouseEvent } from "react";
import styled from "styled-components";
import { HoverLink, Score } from "../Common-components";
import { SimpleGame } from "../Models"
import "./Simple-game-card.css";

type CardSetting = {
  margin?: MarginType
  onClose?: () => void
}

const LinkedBounding = styled(HoverLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  flex: 1 0 auto;
  flex-direction: row;
  border: solid 1px rgba(0,0,0,0.33);
  padding: 12px;
`

export function SimpleGameCard(game: SimpleGame & CardSetting) {
  const closer = game.onClose
  const close = closer
    ? (event: MouseEvent) => {
      event.preventDefault();
      closer()
    }
    : null;

  return <LinkedBounding to={`/game/${game.route}`} >
    <Box direction="column" flex={false}>
      <Box>{game.opponent}</Box>
      <Box>{game.title.length > 18 ? `...${game.title.slice(-15)}` : game.title}</Box>
    </Box>
    <Box direction="column" flex={false}>
      <Box direction="row" align="center">
        <Image src={game.awayTeam.logoURL} alt={game.awayTeam.logoAlt} width="30px" height="30px" margin={{right: '5px'}} />
        <Score home={game.home} homePos={false} win={game.win}>{game.awayScore}</Score>
      </Box>
      <Box direction="row" align="center">
        <Image src={game.homeTeam.logoURL} alt={game.homeTeam.logoAlt} width="30px" height="30px" margin={{right: '5px'}} />
        <Score home={game.home} homePos={true} win={game.win}>{game.homeScore}</Score>
      </Box>
    </Box>
    {
      close
        ? <Close className="button" onClick={(ev) => close(ev)}/>
        : null
    }

  </LinkedBounding>
}
// {/* <Box key={game.route} direction="row" border pad="small" justify="between" align="center" flex="grow" basis="200px" margin={game.margin} background="white" as={() =>
// } /> */}

  // key={game.route} direction="row" border pad="small" justify="between" align="center" flex="grow" basis="200px" margin={game.margin} background="white" width="100%">

  // </Box>
    // <Box direction="row" border pad="small" justify="between" align="center" flex="grow" basis="200px" margin={game.margin} background="white" width="100%">
    // </Box>
