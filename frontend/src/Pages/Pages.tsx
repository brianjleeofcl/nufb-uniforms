import { Box, Heading, Paragraph, ResponsiveContext } from "grommet";
import { Alert } from "grommet-icons";
import React, { useContext, useRef } from "react";
import { Outlet } from "react-router-dom";
import { LatestGameDetail, SingleGameDetail } from "../Game-detail/Game-detail";
import { RespSizes } from "../grommet/utils";
import { Timeline } from "../Timeline/Timeline";
import { DetailLayout, MainContent, ReflexiveMain } from "./Page-layout";

export function SimplePage() {
  return <MainContent>
    <Outlet />
  </MainContent>
}

export function LandingPage() {
  return <ResponsiveContext.Consumer>
      {value => value !== RespSizes.S
        ? <DetailLayout><LatestGameDetail /></DetailLayout>
        : <Timeline />}
    </ResponsiveContext.Consumer>
}

export function GameDetailPage() {
  return <DetailLayout><SingleGameDetail /></DetailLayout>
}


export function GamePage() {
  const size = useContext(ResponsiveContext)
  return <ReflexiveMain direction="row" flex="shrink" respSize={size}>
    {size !== RespSizes.S && <Timeline />}
    <Outlet />
  </ReflexiveMain>
}

export function UniformTimelineContainer() {
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement> ;

  return <MainContent ref={containerRef}>
    <Box align="center" pad="50px">
      <Alert/>
      <Heading level="3">Sorry, under construction</Heading>
      <Paragraph>Anyone know of a charting library that's maintained? I'm all ears at this point.</Paragraph>
    </Box>
    {/* <UniformTimeline parentRef={containerRef} /> */}
  </MainContent>
}


