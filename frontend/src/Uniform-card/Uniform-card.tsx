import React, { SVGProps, SyntheticEvent } from 'react';
import { Box } from 'grommet';
import styled from 'styled-components';
import { ReactComponent as HelmetSVG } from './helmet.svg';
import { ReactComponent as UniformSVG } from './basic-uniform.svg';
import { Colors, UniformColors } from '../Models/Uniform';

type SVGProp<T> = React.FunctionComponent<React.SVGProps<SVGSVGElement> & T>;

const colorMap: Record<Colors, string> = {
  [Colors.purple]: '#4E2A84',
  [Colors.white]: '#FFFFFF',
  [Colors.black]: '#000000',
  [Colors.gray]: '#777777',
};

const Helmet = styled<SVGProp<{ helmet: Colors, rotated?: boolean }>>(HelmetSVG)
  .attrs({ viewBox: '0 0 1000 1000' })`
    #helmet-side {
      fill: ${props => colorMap[props.helmet]};
    }

    ${props => props.rotated ? `
    #layer3 {
      transform: rotate(270deg);
      transform-origin: center;
    }` : ''}
  `;

const Uniform = styled<SVGProp<{ jersey: Colors, pants: Colors, rotated?: boolean }>>(UniformSVG)`
  #jersey , #left-no, #right-no {
    fill: ${props => colorMap[props.jersey]};
  }
  #pants {
    fill: ${props => colorMap[props.pants]};
  }
  ${props => props.rotated ? `
  #uniform-all {
    transform: rotate(270deg);
    transform-origin: center;
  }
  ` : ''}
`;

type UniformCardProp = UniformColors & { size?: number };
type SidewaysCardProp = UniformCardProp & SVGProps<SVGSVGElement>;

export function SidewaysUniformCard(props: SidewaysCardProp) {
  const {helmet, jersey, pants, size = 10 } = props;
  const basis = `${size}px`;
  const half = `${size / 2}px`;
  return <svg width={size * 1.5} height={size} {...props}>
    <Helmet x={0} y={size / 4} helmet={helmet} width={half} height={half} rotated/>
    <Uniform x={size / 2} y={0} jersey={jersey} pants={pants} width={basis} height={basis} rotated/>
  </svg>
}

export function UniformCard({ helmet, jersey, pants, size = 100 }: UniformCardProp) {
  const basis = `${size}px`;
  const half = `${size / 2}px`;
  return <Box basis={basis} align="center" flex={false}>
    <Helmet helmet={helmet} width={half} height={half} />
    <Uniform jersey={jersey} pants={pants} width={basis} height={basis} />
  </Box>
}
