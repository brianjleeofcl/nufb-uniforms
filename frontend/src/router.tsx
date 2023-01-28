import { createBrowserRouter, LoaderFunctionArgs } from "react-router-dom"
import { AboutPage } from "./About-page/About-page";
import { App } from "./App";
import { GameDetailPage, GamePage, LandingPage, SimplePage } from "./Pages/Pages"
import { LatestGameDetailRequest, SingleGameDetailRequest, UniformInfoRequest, UniformTimelineRequest } from "./Requests";
import { UniformInfoView } from "./Uniform-info-view/Uniform-info-view";
import { UniformList } from "./Uniform-list/Uniform-list";
import { UniformTimelineChart } from "./Uniform-timeline-chart/Uniform-timeline-chart";

const routes = [
  {element: <App />, children: [
    {path: '/', element: <GamePage />, children:[
      {index: true, loader:() => new LatestGameDetailRequest().asPromise(),
        element: <LandingPage />},
      {path: '/game/:year/:week', loader: ({ params }: LoaderFunctionArgs) => {
        return new SingleGameDetailRequest(params["year"] as string, params["week"] as string).asPromise();
      }, element: <GameDetailPage />},
    ]},
    {path: '/uniform', element: <SimplePage />, children: [
      {index: true, element: <UniformList />},
      {path: ':combination', loader:({ params }: LoaderFunctionArgs) => {
        return new UniformInfoRequest(params["combination"] as string).asPromise();
      }, element: <UniformInfoView />},
    ]},
    {path: '/timeline-chart', element: <UniformTimelineChart />,
      loader: () => new UniformTimelineRequest().asPromise()},
    {path: '/about', element:<AboutPage />}
  ]},
];

export const router = createBrowserRouter(routes);
