import { Anchor, Box, Heading, ResponsiveContext, Spinner } from "grommet";
import React, { FunctionComponent, useContext, useState } from "react";
import { useHref } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import { Tweet } from "react-twitter-widgets";
import styled from "styled-components";
import { RespSizes, sizeIsS } from "../grommet/utils";
import { UniformColors } from "../Models";
import { UniformCard } from "../Uniform-card/Uniform-card";
import { GameDetail } from "./Game-detail-model";

const SizedTweet = styled(Tweet)`
  flex: 1 1 300px;
`;

export interface UpcomingGame {
  year: number,
  week: number,
};

const UniformLarge = (prop: UniformColors) => <UniformCard {...prop} size={300} />

const GameDetailLayout: FunctionComponent<{ game: GameDetail }> = ({ game }) => {
  const [ tweetLoaded, setSpinner ] = useState<boolean>(false);
  const size = useContext(ResponsiveContext);
  const home = useHref("/")

  let width = 'auto', basis = 'auto',
    align: 'center' | 'start' = 'center',
    justify: 'center' | 'start' = 'start',
    flexDir: 'row' | 'column' = 'row', twtMargin;
  switch(size) {
    case RespSizes.L:
      width = '';
      basis = '500px';
      twtMargin = {left: '25px', right: '25px'};
      align = 'start'
      break;
    case RespSizes.M:
      width = '500px'
      basis = '500px'
      justify = 'center'
      twtMargin = {left: '25px', right: '25px'};
      break;
    case RespSizes.S:
      width = '100%'
      basis = 'auto'
      flexDir = 'column';
  }

  return <Box pad={{vertical: 'medium'}} align={align} basis={basis}>
    <Box direction="row" align="flex-end" justify="between" width="100%" pad={{horizontal: '25px'}}>
      <Heading level="3" textAlign="start" margin={{vertical: '0'}}>{game.titleWithYear}</Heading>
      {sizeIsS(size) && <Anchor href={home}>&lt;&lt; Back to list</Anchor>}
    </Box>
    <Box direction={flexDir} align={size === 'small'? 'center': 'start'} justify={justify} wrap={size === 'medium'} width="100%" pad="20px">
      <Box direction="column" basis={basis} width={width}
      justify={size === 'small' ? 'center': 'end'}>
        <Box width="500px" direction="row">
          {
            size === RespSizes.S
            ? <UniformCard {...game.uniform} size={150}/>
            : <UniformLarge {...game.uniform} />
          }
          <Box direction="column" width="200px">
            <dl>
              {game.uniform.special && <dt>Special theme</dt>}
              {game.uniform.special && <dd>{game.uniform.special}</dd>}
              <dt>Helmet</dt>
              <dd>{game.uniform.helmetDesc}</dd>
              <dt>Jersey</dt>
              <dd>{game.uniform.jersey}</dd>
              <dd>+ {game.uniform.jerseyLetter} lettering</dd>
              <dd>+ {game.uniform.jerseyDetail} stripes</dd>
              <dt>Pants</dt>
              <dd>{game.uniform.pantsDesc}</dd>
              <dt>{game.uniformAppearance} Appearance</dt>
              <dd>{game.uniformCurrentTotal} Total</dd>
              <dt>{game.uniformWinPercent} Win Percent</dt>
              <dd>{game.uniformWins} wins, {game.uniformLosses} losses</dd>
            </dl>
          </Box>
        </Box>
        <Box width={size === 'large' ? '450px' : '100%'} margin={twtMargin}>
          <div>
            {!tweetLoaded && <Spinner size="medium"/>}
            <SizedTweet tweetId={game.officialTweet} onLoad={() => setSpinner(true)}/>
          </div>
        </Box>
      </Box>
      <Box>
        {game.detailComponent(size)}
      </Box>

    </Box>
  </Box>
}

export const SingleGameDetail = () => {
  const game = useLoaderData() as GameDetail

  return game
    ? <GameDetailLayout game={game} />
    : <Box width="100%" margin={{ top: '100px' }} justify="center" align="center">
      <Spinner size="large" />
    </Box>
};
