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
const HALF_INCREMENT = BAR_INCREMENT / 2;
const BAR_HEIGHT = 50;
const BASIC_PADDING = 5;
const LABEL_WIDTH = 75;
const LABEL_SPACING = LABEL_WIDTH + BASIC_PADDING * 2;
const AXIS_OFFSET = 50;

export function UniformTimelineChart() {
  const defaultSort = [...(useLoaderData() as UniformTimelineData[])].sort((a, b) => {
    return a.gameData[0].order - b.gameData[0].order;
  });
  const [uniforms, setUniforms] = useState<UniformTimelineData[]>(defaultSort);
  const { gameCount, seasons, seasonLengths } = useContext(SchemeContext);

  const [seasonMap] = seasonLengths;
  let seasonCount = 0;

  const chartWidth = gameCount * BAR_INCREMENT + LABEL_SPACING + BASIC_PADDING;
  const chartHeight = uniforms.length * BAR_HEIGHT + AXIS_OFFSET;

  // Season select
  const [selectedSeason, setSeason] = useState<number | null>(null);


  // Scroll rerender
  const [scrollPosition, setScroll] = useState({ x: 0, y: 0 });
  const boundRef = useRef() as MutableRefObject<HTMLDivElement>;
  const chartRef = useRef() as MutableRefObject<unknown>; // Nothing really works here
  useScrollPosition(({ currPos }) => setScroll({ x: currPos.x, y: currPos.y }),
    [], (chartRef as MutableRefObject<HTMLElement>), false, 100, boundRef);

  return <MainContent ref={boundRef}>
    {
      gameCount > 0
        ? <svg ref={chartRef as MutableRefObject<SVGSVGElement>}
          width={`${chartWidth}px`} height={`${chartHeight}px`}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {
            seasons.map((season, i) => {
              const offset = (seasonCount * BAR_INCREMENT + LABEL_SPACING)
              const seasonLength = seasonMap[season];
              seasonCount += seasonLength;
              const seasonWidth = seasonLength * BAR_INCREMENT;
              const classes = season === selectedSeason ? "seasons selected" : "seasons";
              return <g key={season} className={classes}>
                {
                  i % 2 === 0
                  ? <rect x={offset} y="0" width={seasonWidth} height={chartHeight}/>
                  : null
                }
                {
                  <g className="transition axis" transform={`translate(0, ${scrollPosition.y + 30})`}>
                    <text x={offset + HALF_INCREMENT} y={-BASIC_PADDING}
                      className="clickable" onClick={() => {
                        boundRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                        if (selectedSeason !== season) {
                          setSeason(season)
                          setUniforms([...uniforms].sort((a, b) => {
                            const aOrder = a.seasons[season] || 0
                            const bOrder = b.seasons[season] || 0
                            const diff = aOrder - bOrder
                            if (diff * aOrder * bOrder !== 0 ) return diff;
                            else if (diff !== 0) return -diff;
                            else return a.gameData[0].order - b.gameData[0].order;
                          }))
                        } else {
                          setSeason(null)
                          setUniforms(defaultSort)
                        }
                      }}>{season} {selectedSeason === season ? "- reset" : ""}</text>
                    <line x1={offset + HALF_INCREMENT} x2={offset + seasonWidth - HALF_INCREMENT}
                      y1="0" y2="0" />
                    {
                      [...Array(seasonLength)].map((_, i) => {
                        return <line key={`${season}-${i}`}
                          x1={offset + (i +.5) * BAR_INCREMENT} x2={offset + (i + .5) * BAR_INCREMENT}
                          y1="0" y2="20" />
                      })
                    }
                  </g>
                }
                </g>
            })
          }
          {uniforms.map((uniform, i) => {
            const [ helmet, jersey, pants ] = uniform.axisLabel.split("-")
            const start = uniform.gameData[0].order;
            const end = uniform.gameData.slice(-1)[0].order;
            return <g key={uniform.axisLabel} className="rendered-data">
              <g transform={`translate(${scrollPosition.x})`} className="transition">
                <SidewaysUniformCard size={BAR_HEIGHT}
                  x={BASIC_PADDING} y={i * BAR_HEIGHT + AXIS_OFFSET}
                  helmet={getColor(helmet)} jersey={getColor(jersey)} pants={getColor(pants)} />
              </g>
              {
                uniform.gameData.length > 1
                  ? <rect width={(end - start) * BAR_INCREMENT} height="40"
                    x={start * BAR_INCREMENT - HALF_INCREMENT + LABEL_SPACING}
                    y={i * BAR_HEIGHT + AXIS_OFFSET + BASIC_PADDING} />
                  : null
              }
              {uniform.gameData.map(game => {
                return <circle key={game.order} r="10" fill={game.win ? "limegreen" : "red"}
                  cx={game.order * BAR_INCREMENT - HALF_INCREMENT + LABEL_SPACING}
                  cy={(i + .5) * BAR_HEIGHT + AXIS_OFFSET} onClick={() => {
                    console.log(game)
                  }} />
              })}
            </g>
          })}
        </svg>
        : <Spinner size="xlarge" />
    }
  </MainContent>
}
