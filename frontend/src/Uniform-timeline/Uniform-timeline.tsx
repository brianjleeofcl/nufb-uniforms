import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ResponsiveContext, Spinner } from "grommet";
import React, { useContext, useEffect, useRef, useState } from "react";
import { VerticalGridLines, YAxis, MarkSeries, HorizontalRectSeries, FlexibleXYPlot, XYPlot, LabelSeries, LabelSeriesPoint, Hint, MarkSeriesPoint, RectSeriesPoint } from "react-vis";
import styled from "styled-components";
import { SimpleGameCard } from "../Game-card/Simple-game-card";
import { sizeIsL } from "../grommet/utils";
import { getColor, SimpleGame, Uniform } from "../Models";
import { UniformSummaryRequest, UniformTimelineRequest } from "../Requests";
import { SidewaysUniformCard } from "../Uniform-card/Uniform-card";
import { UniformSummary } from "../Uniform-summary/Uniform-summary";
import "./Uniform-timeline.css";

const CHART_HEIGHT = 1200;
const CHART_WIDTH = 2400;

const Container = styled.div`
  ${({size}: { size: string }) => {
    return sizeIsL(size)
    ? `
    height: auto;
    width: auto;
    `
    : `
    height: ${CHART_HEIGHT}px;
    width: ${CHART_WIDTH}px;
    `
  }}
  `;

  const uniformCache: { [label: string]: Uniform } = {};

  type PlotData = (SimpleGame & MarkSeriesPoint);
  type BarData = RectSeriesPoint & { label: string };
  type TimelineProp = { parentRef: React.MutableRefObject<HTMLDivElement> };
  type PointSelection = { point: MarkSeriesPoint | RectSeriesPoint, type: 'bar' | 'point' }
export function UniformTimeline({ parentRef }: TimelineProp) {
  const size = useContext(ResponsiveContext);
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement> ;
  const [xPos, scrollX] = useState<number>(0);
  const [barData, setBar] = useState<BarData[]>([])
  const [plotData, setPlot] = useState<PlotData[]>([])
  const [gridTick, setGrid] = useState<number[]>([])
  const [axisTicks, setAxis] = useState<string[]>([])
  const [seasonLabels, setLabel] = useState<LabelSeriesPoint[]>([])
  const [selectedPoint, selectPoint] = useState<PointSelection | null>(null)
  const [uniformData, setUniformData] = useState<Uniform | null>(null)
  const AxisTick = (v: number) => {
    const [helmet = 'white', jersey = 'white', pants = 'white'] = axisTicks[v]?.split('-');
    return (<SidewaysUniformCard x={-30} y={0} size={30}
      helmet={getColor(helmet)}
      jersey={getColor(jersey)}
      pants={getColor(pants)}
      />) as unknown as string
  }

  useEffect(() => {
    new UniformTimelineRequest().asPromise().then(res => {
      const reverseMap: { [key: string]: number } = {};
      const yAxisOrder = res.map(({axisLabel}, i) => {
        reverseMap[axisLabel] = i;
        return axisLabel;
      });
      setAxis(yAxisOrder);
      const barData = res
        .filter(res => res.gameData.length > 1)
        .map(({ axisLabel, gameData }, i) => {
          const max = gameData.reduce((prev, val) => prev.order > val.order ? prev : val);
          const min = gameData.reduce((prev, val) => prev.order > val.order ? val : prev);
          const basisTick = reverseMap[axisLabel];
          return  {
            x: min.order,
            x0: max.order,
            y: basisTick+.75,
            y0: basisTick,
            label: axisLabel,
          };
        });
      setBar(barData);

      const plot = res.reduce((agg, vals) => {
        const pts = vals.gameData.map(val => {
          return {
            ...val,
            x: val.order,
            y: reverseMap[vals.axisLabel]-.375,
            color: val.win ? 'limegreen' : 'red',
            size: 5,
          }
        });
        return [...agg, ...pts];
      }, [] as (SimpleGame & {x: number, y: number})[]);
      setPlot(plot);

      const labels = plot.filter(val => val.week === 1).map(val => {
        return {
          x: val.order,
          y: yAxisOrder.length / 2,
          label: String(val.season),
          rotation: 270
        };
      });
      setLabel(labels);

      const years = labels.map(val => val.x);
      setGrid(years);
    });
  }, [])

  useEffect(() => {
    if (selectedPoint === null || selectedPoint.type === 'point') return;
    const label = (selectedPoint.point as BarData).label;
    if (uniformCache[label]) {
      setUniformData(uniformCache[label]);
      return;
    }
    new UniformSummaryRequest(label).asPromise()
      .then(uniform => {
        uniformCache[label] = uniform;
        setUniformData(uniform);
      });
  }, [selectedPoint]);

  useScrollPosition(({ currPos }) => {
    scrollX(currPos.x)
  }, undefined, containerRef, false, 10, parentRef);

  const toggleTip = (point: MarkSeriesPoint | RectSeriesPoint, type: 'bar' | 'point') => {
    setUniformData(null);
    selectPoint(selectedPoint?.point === point ? null : { point, type });
  }

  const Tooltip = ({ selected: { point, type } }: { selected: PointSelection }) => {
    switch (type) {
      case 'bar':
        return uniformData ? <UniformSummary uniform={uniformData} /> : <Spinner size="medium" />
      case 'point':
        return <SimpleGameCard {...(point as PlotData as SimpleGame)} />
    }
  }

  return sizeIsL(size)
    ? <FlexibleXYPlot>
      <VerticalGridLines tickValues={gridTick} style={{ stroke: "black" }} />
      <LabelSeries data={seasonLabels} />
      <HorizontalRectSeries data={barData} width={2.5} fill="#4E2A84" className="chart-bar"
          opacity={.8} onValueClick={br => toggleTip(br, 'bar')} />
      <MarkSeries data={plotData} colorType="literal" className="chart-point"
          onValueClick={pt => toggleTip(pt, 'point')} />
      <YAxis tickTotal={axisTicks.length} tickFormat={AxisTick} />
      {
          selectedPoint && <Hint value={selectedPoint.point}>
            <Tooltip selected={selectedPoint} />
          </Hint>
        }
    </FlexibleXYPlot>
    :
    <Container ref={containerRef} size={size}>
      <XYPlot width={CHART_WIDTH} height={CHART_HEIGHT}>
        <VerticalGridLines tickValues={gridTick} style={{ stroke: "black" }} />
        <LabelSeries data={seasonLabels} className="chart-season-label" />
        <HorizontalRectSeries data={barData} width={2.5} fill="#4E2A84" className="chart-bar"
          opacity={.8} onValueClick={br => toggleTip(br, 'bar')} />
        <MarkSeries data={plotData} colorType="literal" className="chart-point"
          onValueClick={pt => toggleTip(pt, 'point')} />
        <YAxis tickTotal={axisTicks.length} tickFormat={AxisTick} left={xPos} />
        {
          selectedPoint && <Hint value={selectedPoint.point}>
            <Tooltip selected={selectedPoint} />
          </Hint>
        }
      </XYPlot>
    </Container>
}
