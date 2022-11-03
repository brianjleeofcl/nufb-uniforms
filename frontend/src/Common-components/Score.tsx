import React, { ReactNode } from "react";
import styled from "styled-components";

type GameContext = { win: boolean, home: boolean, homePos: boolean };

const Win = styled.span`
  color: limegreen;
`;

const Loss = styled.span`
  color: red;
`;

export const Score = ({ win, home, homePos, children }: GameContext & { children: ReactNode }) => {
  if (home !== homePos) {
    return <span>{ children }</span>
  }
  return win ? <Win>{ children }</Win> : <Loss>{ children }</Loss>
}
