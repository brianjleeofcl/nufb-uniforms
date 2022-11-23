import { createBrowserRouter, LoaderFunctionArgs } from "react-router-dom"
import { AboutPage } from "./About-page/About-page";
import App from "./App";
import { GameDetailPage, GamePage, LandingPage, SimplePage, UniformTimelineContainer } from "./Pages/Pages"
import { LatestGameDetailRequest, SingleGameDetailRequest } from "./Requests";
import { UniformInfoView } from "./Uniform-info-view/Uniform-info-view";
import { UniformList } from "./Uniform-list/Uniform-list";

const routes = [
  {element: <App />, children: [
    {path: '/', element: <GamePage />, children:[
      {index: true, loader:() => new LatestGameDetailRequest().asPromise(),
        element: <LandingPage />},
      {path: '/game/:year/:week', loader: ({ params }: LoaderFunctionArgs) => {
        return new SingleGameDetailRequest(params["year"] as string, params["week"] as string).asPromise()
      }, element: <GameDetailPage />},
    ]},
    {path: '/uniform', element: <SimplePage />, children: [
      {index: true, element: <UniformList />},
      {path: ':combination', element: <UniformInfoView />},
    ]},
    {path: '/timeline', element: <UniformTimelineContainer />},
    {path: '/about', element:<AboutPage />}
  ]},
];

export const router = createBrowserRouter(routes);
