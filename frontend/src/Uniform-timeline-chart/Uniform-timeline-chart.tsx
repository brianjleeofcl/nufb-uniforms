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

  const chartWidth = gameCount * BAR_INCREMENT + LABEL_OFFSET;
  const chartHeight = result.length * BAR_HEIGHT + AXIS_OFFSET;

  // Scroll rerender
  const [scrollPosition, setScroll] = useState({ x: 0, y: 0 });
  const parentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const containerRef = useRef() as MutableRefObject<any>; // Nothing really works here
  useScrollPosition(({ currPos }) => setScroll({ x: currPos.x, y: currPos.y }),
    [], containerRef, false, 10, parentRef);

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
              return <g key={season} className="seasons">
                {
                  i % 2 === 0
                  ? <rect x={offset} y="0" width={seasonLength * BAR_INCREMENT} height={chartHeight}/>
                  : null
                }
                {
                  <text x={offset + 5} y={scrollPosition.y + 30}>{season}</text>
                }
                </g>
            })
          }
          {result.map((uniform, i) => {
            const [ helmet, jersey, pants ] = uniform.axisLabel.split("-")
            const start = uniform.gameData[0].order;
            const end = uniform.gameData.slice(-1)[0].order;
            return <g key={uniform.axisLabel} className="rendered-data">
              <SidewaysUniformCard helmet={getColor(helmet)} jersey={getColor(jersey)} pants={getColor(pants)} size={50} x={scrollPosition.x} y={i * 50 + AXIS_OFFSET}/>
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
