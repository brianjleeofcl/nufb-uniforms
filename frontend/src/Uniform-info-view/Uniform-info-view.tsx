import { format } from "date-fns";
import { Box, Button, Heading, Meter, ResponsiveContext, Spinner, Text } from "grommet";
import { MarginType } from "grommet/utils";
import React, { useContext, useState } from "react";
import { useLoaderData } from "react-router";
import styled from "styled-components";
import { SimpleGameCard } from "../Game-card/Simple-game-card";
import { sizeIsS } from "../grommet/utils";
import { UniformInfo } from "../Models";
import { UniformCard } from "../Uniform-card/Uniform-card";

type FlexDir = 'row' | 'column';

const OverflowBox = styled(Box)`
  overflow: auto;
`;

const InfoSection = styled(Box)`
  min-width: 400px;
  min-height: 400px;
  overflow: auto;
`;

const InfoList = styled.dl`
  margin-right: 20px;
`

export function UniformInfoView() {
  const info = useLoaderData() as UniformInfo;
  const size = useContext(ResponsiveContext);
  const [section, setAll] = useState(false);

  let layout: FlexDir = 'row',
    infoAlign = 'end',
    infoBasis = '500px',
    infoFlex: 'shrink' | false = 'shrink',
    variantBasis = '250px',
    cardMargin: MarginType = {};

  if (sizeIsS(size)) {
    layout = 'column';
    infoAlign = 'center';
    infoBasis = 'auto';
    infoFlex = false;
    variantBasis = 'auto';
    cardMargin = {horizontal: '50px'};
  }

  return info
  ? <Box direction={layout} height="100%">
    <InfoSection justify="start" align={infoAlign} direction="column" border="right"
    flex={infoFlex} basis={infoBasis} pad="small">
      <Box>
        <Box direction="row" justify="between" margin={{bottom: '25px'}}>
          <UniformCard {...info} size={200} />
          <InfoList>
            <dt>Helmet</dt>
            <dd>{info.helmet}</dd>
            <dt>Jersey</dt>
            <dd>{info.jersey}</dd>
            <dt>Pants</dt>
            <dd>{info.pants}</dd>
            <dt>Recent</dt>
            <dd>{format(info.lastPlayed, 'M/dd/Y')}</dd>
            <dt>First Appeared</dt>
            <dd>{format(info.firstPlayed, 'M/dd/Y')}</dd>
          </InfoList>
        </Box>

        <Meter background="dark-5" color="brand" margin={{bottom: '10px'}}
          max={info.total} value={info.wins} />
        <Text textAlign="center">{info.winPercent} ({info.wins} - {info.losses})</Text>
      </Box>
      <Box>
      </Box>
    </InfoSection>
    <OverflowBox flex="shrink">
      {
        size !== 'small'
        ? <Heading level="4" margin={{left: "10px"}}>Uniform Variants ({info.uniformVariations.length})</Heading>
        : <Box direction="row" justify="center">
          <Button onClick={() => setAll(!section)} label={section ? 'All games' : 'By Variant'} />
        </Box>
      }
      {
        size === 'small' && !section
        ? <Box>
          {info.gameData.map(game => <SimpleGameCard key={game.order} {...game} margin={cardMargin}/>)}
        </Box>
        : <Box direction={layout} align="start">
          {
            info.uniformVariations.map((variant, i) => <Box key={i} basis={variantBasis}
              flex={false} direction="column" width="100%">
              <Box pad="small" basis="350px" flex={size === 'small' ? 'shrink' : false}
              align="center" justify="end">
                <dl>
                  {variant.special && <dt>Special theme</dt>}
                  {variant.special && <dd>{variant.special}</dd>}
                  <dt>Helmet</dt>
                  <dd>{variant.helmetDesc}</dd>
                  <dt>Jersey</dt>
                  <dd>{variant.jersey}</dd>
                  <dd>+ {variant.jerseyLetter} lettering</dd>
                  {variant.jerseyDetail && <dd>+ {variant.jerseyDetail} stripes</dd>}
                  <dt>Pants</dt>
                  <dd>{variant.pantsDesc}</dd>
                  <dt>{variant.total} Total</dt>
                  <dd>{variant.winPercent} Win Percent</dd>
                  <dd>{variant.wins} wins, {variant.losses} losses</dd>
                </dl>
              </Box>
              {variant.games.map(game => <SimpleGameCard {...game} margin={cardMargin} />)}
            </Box>)
          }
        </Box>
      }
    </OverflowBox>
  </Box>
  : <Spinner size="medium" />
}