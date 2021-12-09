import { Box, Image } from "grommet"
import { MarginType } from "grommet/utils";
import { HoverLink, Score } from "../Common-components";
import { SimpleGame } from "../Models"

export const SimpleGameCard: React.FunctionComponent<SimpleGame & {margin?: MarginType}> = (game) => {
  return <HoverLink key={game.route} to={`/game/${game.route}`}><Box direction="row" border pad="small" justify="between" align="center" margin={game.margin} background="white">
    <Box direction="column">
      <Box>{game.opponent}</Box>
      <Box>{game.title.length > 18 ? `...${game.title.slice(-15)}` : game.title}</Box>
    </Box>
    <Box direction="column">
      <Box direction="row" align="center">
        <Image src={game.awayTeam.logoURL} alt={game.awayTeam.logoAlt} width="30px" height="30px" margin={{right: '5px'}} />
        <Score home={game.home} homePos={false} win={game.win}>{game.awayScore}</Score>
      </Box>
      <Box direction="row" align="center">
        <Image src={game.homeTeam.logoURL} alt={game.homeTeam.logoAlt} width="30px" height="30px" margin={{right: '5px'}} />
        <Score home={game.home} homePos={true} win={game.win}>{game.homeScore}</Score>
      </Box>
    </Box>
  </Box></HoverLink>
}