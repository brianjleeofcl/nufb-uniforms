import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { Spinner } from "grommet";
import { MutableRefObject, useContext, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { SchemeContext } from "../App";
import { getColor, UniformTimelineData } from "../Models";
import { MainContent } from "../Pages/Page-layout";
import { SidewaysUniformCard } from "../Uniform-card/Uniform-card";
import "./Uniform-timeline-chart.css";

const BAR_INCREMENT = 25;
const BAR_HEIGHT = 50;
const BAR_PADDING = 5;
const LABEL_OFFSET = 75;
const AXIS_OFFSET = 50;

export function UniformTimelineChart() {
  const result = (useLoaderData() as UniformTimelineData[]).sort((a, b) => {
    return a.gameData[0].order - b.gameData[0].order;
  });
  const { gameCount, seasons, seasonLengths } = useContext(SchemeContext);

  const [seasonMap] = seasonLengths;
  let seasonCount = 0;

  const chartWidth = gameCount * BAR_INCREMENT + LABEL_OFFSET + BAR_INCREMENT;
  const chartHeight = result.length * BAR_HEIGHT + AXIS_OFFSET;

  // Scroll rerender
  const [scrollPosition, setScroll] = useState({ x: 0, y: 0 });
  const parentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const containerRef = useRef() as MutableRefObject<any>; // Nothing really works here
  useScrollPosition(({ currPos }) => setScroll({ x: currPos.x, y: currPos.y }),
    [], containerRef, false, 100, parentRef);

  return <MainContent ref={parentRef}>
    {
      gameCount > 0
        ? <svg ref={containerRef}
          width={`${chartWidth}px`} height={`${chartHeight}px`}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {
            seasons.map((season, i) => {
              const offset = (seasonCount * BAR_INCREMENT + LABEL_OFFSET)
              const seasonLength = seasonMap[season];
              seasonCount += seasonLength;
              const seasonWidth = seasonLength * BAR_INCREMENT;
              return <g key={season} className="seasons">
                {
                  i % 2 === 0
                  ? <rect x={offset} y="0" width={seasonWidth} height={chartHeight}/>
                  : null
                }
                {
                  <g className="transition" transform={`translate(0, ${scrollPosition.y + 30})`}>
                    <text x={offset + 5} y="0">{season}</text>
                    <line x1={offset} x2={offset + seasonWidth} y1="0" y2="0" stroke="black" />
                    {
                      [...Array(seasonLength)].map((_, i) => {
                      return <line key={`${season}-${i}`} stroke="black"
                        x1={offset + i * BAR_INCREMENT} x2={offset + i * BAR_INCREMENT} y1="0" y2="20" />
                      })
                    }
                  </g>
                }
                </g>
            })
          }
          {result.map((uniform, i) => {
            const [ helmet, jersey, pants ] = uniform.axisLabel.split("-")
            const start = uniform.gameData[0].order;
            const end = uniform.gameData.slice(-1)[0].order;
            return <g key={uniform.axisLabel} className="rendered-data">
              <g transform={`translate(${scrollPosition.x})`} className="transition">
                <SidewaysUniformCard size={50} x={0} y={i * 50 + AXIS_OFFSET}
                  helmet={getColor(helmet)} jersey={getColor(jersey)} pants={getColor(pants)} />
              </g>
              {
                uniform.gameData.length > 1
                  ? <rect x={start * BAR_INCREMENT + LABEL_OFFSET} y={i * BAR_HEIGHT + AXIS_OFFSET + BAR_PADDING} width={(end - start) * BAR_INCREMENT} height="40" />
                  : null
              }
              {uniform.gameData.map(game => {
                return <circle key={game.order} r="10" cx={game.order * BAR_INCREMENT + LABEL_OFFSET} cy={(i + .5) * BAR_HEIGHT + AXIS_OFFSET}
                  fill={game.win ? "limegreen" : "red"} />
              })}
            </g>
          })}
        </svg>
        : <Spinner size="xlarge" />
    }
  </MainContent>
}
