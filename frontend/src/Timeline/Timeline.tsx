import React, { useContext, useEffect, useState } from "react";
import { Box, InfiniteScroll, ResponsiveContext } from "grommet";
import { GameCard } from "../Game-card/Game-card";
import { GameSummaryRequest } from "../Requests";
import { GameSummary } from "../Models";
import { TimelineFilter } from "./Timeline-filter";

export function Timeline() {
  const size = useContext(ResponsiveContext);
  const sizedWidth = size === 'small' ? '100%' : '450px';
  const [games, setGames] = useState<GameSummary[]>([]);
  const [index, setIndex] = useState(games.length)
  useEffect(() => {
    new GameSummaryRequest(index, 10).asPromise()
      .then(res => setGames(existing => [...existing, ...res]))
  }, [index])

  return <Box basis={sizedWidth} flex="grow" align="end">
    <TimelineFilter />
    <Box width={sizedWidth} overflow={{vertical:'auto'}}>
      <InfiniteScroll items={games} onMore={() => setIndex(index + 10)} step={10}>
        {(game: GameSummary) => {
          return <GameCard key={game.index} {...game}></GameCard>
        }}
      </InfiniteScroll>
    </Box>
  </Box>
}
