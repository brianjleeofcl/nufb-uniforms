import { format, getTime } from "date-fns";
import { Box, Meter, ResponsiveContext, Text } from "grommet";
import { useContext } from "react";
import { HoverLink } from "../Common-components";
import { sizeIsS } from "../grommet/utils";
import { Uniform } from "../Models";
import { UniformCard } from "../Uniform-card/Uniform-card";

export function UniformSummary({ uniform }: { uniform: Uniform }) {
  const size = useContext(ResponsiveContext)
  return <HoverLink key={getTime(uniform.firstPlayed)}
    to={`/uniform/${uniform.helmet}-${uniform.jersey}-${uniform.pants}`}>
    <Box width={sizeIsS(size) ? '100%' : '350px'} direction="row" background="white"
      align="around" justify="between" border pad="small">
      <Box flex={{grow: 4, shrink: 4}} basis="200px" justify="around" align="center">
        <UniformCard {...uniform} size={150}/>
        <Meter background="dark-5" color="brand" margin={{top: '10px'}}
          max={uniform.total} value={uniform.wins} />
        <Text textAlign="center">{uniform.winPercent} ({uniform.wins} - {uniform.losses})</Text>
      </Box>
      <Box flex={{grow: 3, shrink: 3}} basis="150px" pad={{left: '5px'}}>
        <dl>
          <dt>Helmet</dt>
          <dd>{uniform.helmet}</dd>
          <dt>Jersey</dt>
          <dd>{uniform.jersey}</dd>
          <dt>Pants</dt>
          <dd>{uniform.pants}</dd>
          <dt>Recent</dt>
          <dd>{format(uniform.lastPlayed, 'M/dd/Y')}</dd>
          <dt>First Appeared</dt>
          <dd>{format(uniform.firstPlayed, 'M/dd/Y')}</dd>
        </dl>
      </Box>
    </Box>
  </HoverLink>
}