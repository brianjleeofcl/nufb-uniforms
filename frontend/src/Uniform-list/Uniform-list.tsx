import { getTime } from "date-fns";
import { Box, Button } from "grommet";
import React, { useEffect, useState } from "react";
import { Uniform } from "../Models";
import { UniformListRequest } from "../Requests";
import { UniformSummary } from "../Uniform-summary/Uniform-summary";

type Sort<T> = {
  by: T,
  dir: 'asc' | 'desc'
}

const sortFns: { [sort: string]: (a: Uniform, b: Uniform) => number } = {
  'lastPlayed:asc': (a, b) => getTime(a.lastPlayed) - getTime(b.lastPlayed),
  'lastPlayed:desc': (a, b) => getTime(b.lastPlayed) - getTime(a.lastPlayed),
  'firstPlayed:asc': (a, b) => getTime(a.firstPlayed) - getTime(b.firstPlayed),
  'firstPlayed:desc': (a, b) => getTime(b.firstPlayed) - getTime(a.firstPlayed),
  'wins:asc': (a, b) => a.wins - b.wins,
  'wins:desc': (a, b) => b.wins - a.wins,
  'winPercent:asc': (a, b) => (a.wins/a.total) - (b.wins/b.total),
  'winPercent:desc': (a, b) => (b.wins/b.total) - (a.wins/a.total),
  'total:asc': (a, b) => a.total - b.total,
  'total:desc': (a, b) => b.total - a.total,
};
type UniformSort = 'lastPlayed' | 'firstPlayed' | 'wins' | 'winPercent' | 'total'
const sortButtons: { sort: UniformSort, label: string }[] = [
  { sort: 'lastPlayed', label: 'Last Played' },
  { sort: 'firstPlayed', label: 'First Played' },
  { sort: 'wins', label: 'Total Wins' },
  { sort: 'winPercent', label: 'Win %' },
  { sort: 'total', label: 'Total' },
];
export function UniformList() {
  const [list, setList] = useState<Uniform[]>([]);
  const [sort, setSort] = useState<Sort<UniformSort>>({ by: 'lastPlayed', dir: 'desc'})
  useEffect(() => {
    new UniformListRequest().asPromise().then(uniforms => setList(uniforms))
  }, [])
  useEffect(() => {
    setList(list => [...list].sort(sortFns[`${sort.by}:${sort.dir}`]))
  }, [sort])

  const determineSort = (by: UniformSort): Sort<UniformSort> => {
    const dir = sort.by === by && sort.dir === 'desc' ? 'asc' : 'desc'
    return { by, dir };
  }
  return <Box direction="row" justify="center">
    <Box direction="row" justify="center" wrap basis="1400px" flex="shrink">
      <Box width="100%" pad="medium" direction="row" align="center" wrap>Sort by:{
        sortButtons.map(({ sort: sortVal, label }) => <Button key={label} margin={{left: '10px'}}
        label={`${label}${sort.by === sortVal ? (sort.dir === 'asc' ? '↑' : '↓') : ''}`}
        active={sort.by === sortVal}
        onClick={() => setSort(determineSort(sortVal))}/>)
      }</Box>
      {list.map(uniform => <UniformSummary uniform={uniform} />)
    }</Box>
  </Box>
}



