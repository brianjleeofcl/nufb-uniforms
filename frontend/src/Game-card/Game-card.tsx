import React, { useContext } from "react";
import { Box, Clock, Heading, Image, ResponsiveContext } from "grommet";
import { UniformCard } from "../Uniform-card/Uniform-card";
import styled from "styled-components";
import { FinalGameSummary, GameSummary, Scoreboard, Team, UpcomingGameSummary } from "../Models";
import { format, formatDuration, formatISODuration, intervalToDuration, isBefore } from "date-fns";
import { RespSizes } from "../grommet/utils";
import { HoverLink, Score } from "../Common-components";

export const gameCardBasis = 175;
const CardContainer = styled(HoverLink)`
  &:hover {
    background: rgba(78,42,132,.15);
  }
  width: 100%;
`;

const YearLabel = styled(Box)`
  font-weight: 600;
  position: sticky;
  top: 20px;
  text-align: center;
`;

const Win = styled.span`
  color: limegreen;
`;

const Loss = styled.span`
  color: red;
`;

const Record = styled.label`
  font-size: 12pt;
`;

const LogoSection = function ({ team }: { team: Team }) {
  return <Box direction="column" align="center">
    <Image src={team.logoURL} alt={team.logoAlt} width="50px" height="50px" />
    <Record>({team.record})</Record>
  </Box>
}

const Bold = styled.span`
  font-weight: 700;
  font-size: 28pt;
`;

const ScoreBox: React.FunctionComponent<Scoreboard>
  = function({ host, visitor, result: { win, home, homeScore, awayScore } }) {
    return <Box direction="row" align="center" justify="between" width="100%">
      <LogoSection team={visitor} />
        <Bold><Score home={home} homePos={false} win={win}>{awayScore}</Score></Bold>
        {' : '}
        <Bold><Score home={home} homePos={true} win={win}>{homeScore}</Score></Bold>
      <LogoSection team={host} />
    </Box>
  }

const BroadcastInfo = ({ kickoff, broadcast }: { kickoff: Date, broadcast: string }) => {
  const interval = intervalToDuration({ start: new Date(), end: kickoff })
  return <Box direction="column" align="end">
    <Heading level="5" margin={{top: '0', bottom: '10px'}}>{format(kickoff, 'M/d p')}{broadcast && `, ${broadcast}`}</Heading>
    {
      isBefore(new Date(), kickoff) && <Box direction="row" >
        {formatDuration(interval, { format: ['days'] })}
        <Clock margin={{left: '5px'}}
        run="backward" time={formatISODuration(interval)} type="digital" />
      </Box>
    }
  </Box>
}

function getSizing(name: string) {
  switch (name) {
    case RespSizes.S:
      return {
        showYear: () => false,
        yearPadding: () => { return {} },
        cardSpacing: '100%',
      }
    case RespSizes.M:
      return {
        showYear: (show: boolean) => show,
        yearPadding: (show: boolean) => show ? {} : {left: '100px'},
        cardSpacing: '450px',
      }
    case RespSizes.L:
      return {
        showYear: (show: boolean) => show,
        yearPadding: (show: boolean) => show ? {} : {left: '100px'},
        cardSpacing: '450px',
      }
    default:
      throw new Error()
  }
}

export function GameCard(game: GameSummary) {
  const size = useContext(ResponsiveContext);
  const { showYear, cardSpacing, yearPadding } = getSizing(size);
  const { opponent, home, season, week, title, uniform, final } = game;

  const gameTitle = size === RespSizes.S ? game.titleWithYear : title;
  const displayTitle = gameTitle.length > 21 ? `...${gameTitle.slice(-18)}` : gameTitle;

  return <Box basis={`${gameCardBasis}px`} flex={false} direction="row" pad={yearPadding(game.lastOfSeason)} width={cardSpacing}>
    {showYear(game.lastOfSeason) && <Box height={`${week * gameCardBasis}px`} flex={false} basis="100px" border="bottom" pad="small">
      <YearLabel>{season}</YearLabel>
    </Box>}
    <CardContainer to={`/game/${season}/${week}`}>
      <Box direction="row" border height="100%" pad="small">
        <UniformCard {...uniform}  />

        <Box direction="column" justify="start" align="end" flex>
          <Heading level="4" margin="none" >
            {displayTitle}
          </Heading>

          <Heading level="5" margin={{top: '0', bottom: '20px'}}>
            {home ? "vs" : "@"} {opponent.shortName}{final && <span>&nbsp;
            ({(game as FinalGameSummary).win ? <Win>W</Win> : <Loss>L</Loss>})</span>}
          </Heading>

          {
            final
            ? <ScoreBox {...(game as FinalGameSummary).scoreSummary} />
            : <BroadcastInfo broadcast={(game as UpcomingGameSummary).broadcast} kickoff={game.date} />
          }

        </Box>
      </Box>
    </CardContainer>
  </Box>
};
