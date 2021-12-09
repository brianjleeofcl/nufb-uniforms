import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "grommet";
import { ScoreByQuarter } from "./Game-detail-model";
import { Score } from "../Common-components";

export function GameScore({ score, win, home }: ScoreByQuarter ) {
  return <Table>
    <TableHeader>
      <TableRow>
        <TableCell />
        <TableCell>1</TableCell>
        <TableCell>2</TableCell>
        <TableCell>3</TableCell>
        <TableCell>4</TableCell>
        <TableCell>F</TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {
        score.map(({ team, quarters, final }, i) => <TableRow key={team.name}>
          <TableCell>{team.fullName}</TableCell>
          {quarters.map((score, i) => <TableCell key={i}>{score}</TableCell>)}
          <TableCell>
            <Score home={home} homePos={Boolean(i)} win={win}>{final}</Score>
          </TableCell>
        </TableRow>)
      }
    </TableBody>
  </Table>
}
