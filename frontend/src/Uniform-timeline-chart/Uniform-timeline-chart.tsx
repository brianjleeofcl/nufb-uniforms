import { Spinner } from "grommet";
import { useContext } from "react"
import { useLoaderData } from "react-router-dom"
import { SchemeContext } from "../App"
import { getColor, UniformTimelineData } from "../Models"
import { SidewaysUniformCard } from "../Uniform-card/Uniform-card";

const BAR_INCREMENT = 25;
const BAR_HEIGHT = 50;
const AXIS_OFFSET = 75;

export function UniformTimelineChart() {
  const result = (useLoaderData() as UniformTimelineData[]).sort((a, b) => {
    return a.gameData[0].order - b.gameData[0].order;
  });
  const { gameCount, seasons, seasonLengths } = useContext(SchemeContext);

  const [seasonMap] = seasonLengths;
  let seasonCount = 0;

  const chartWidth = gameCount * BAR_INCREMENT + AXIS_OFFSET;
  const chartHeight = result.length * BAR_HEIGHT;

  return gameCount > 0
    ? <svg width={`${chartWidth}px`} height={`${chartHeight}px`}
      viewBox={`0 0 ${chartWidth} ${chartHeight}`} >
      {
        seasons.map((season, i) => {
          const offset = (seasonCount * BAR_INCREMENT + AXIS_OFFSET)
          const seasonLength = seasonMap[season];
          seasonCount += seasonLength;
          return <g key={season}>
            {
              i % 2 === 0
              ? <rect x={offset} y="0" width={seasonLength * BAR_INCREMENT} height={chartHeight}
                fill="#4E2A84"/>
              : null
            }
            {
              <text >{season}</text>
            }
            </g>
        })
      }
      {result.map((uniform, i) => {
        const [ helmet, jersey, pants ] = uniform.axisLabel.split("-")
        const start = uniform.gameData[0].order;
        const end = uniform.gameData.slice(-1)[0].order;
        return <g key={uniform.axisLabel}>
          <SidewaysUniformCard helmet={getColor(helmet)} jersey={getColor(jersey)} pants={getColor(pants)} size={50} x={0} y={i * 50}/>
          {
            uniform.gameData.length > 1 ?
            <rect
              x={start * 25 + 75} y={i * 50 + 5} width={(end - start) * 25} height="40"
              opacity=".25">
              </rect>
              : null
          }
          {uniform.gameData.map(game => {
            return <circle key={game.order} r="10" cx={game.order * 25 + 75} cy={i * 50 + 25}
              fill={game.win ? "limegreen" : "red"} />
          })}
        </g>
      })}
    </svg>
    : <Spinner size="xlarge" />
}
