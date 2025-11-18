import type { RouteObject } from "react-router-dom";
import ComponentsCacheDemo from "./pages/components";
import DemoA from "./pages/demo/a";
import DemoB from "./pages/demo/b";
import DemoC from "./pages/demo/c";
import DemoD from "./pages/demo/d";
import DemoLong from "./pages/demo/long";
import Docs from "./pages/docs";
import Home from "./pages/index";
import NoCachePage from "./pages/nocache";

const routes: RouteObject[] = [
  { index: true, element: <Home /> },
  {
    path: "demo",
    children: [
      { path: "a", element: <DemoA /> },
      { path: "b", element: <DemoB /> },
      { path: "c", element: <DemoC /> },
      { path: "d", element: <DemoD /> },
      { path: "long", element: <DemoLong /> },
    ],
  },
  { path: "nocache", element: <NoCachePage /> },
  { path: "components", element: <ComponentsCacheDemo /> },
  { path: "docs", element: <Docs /> },
];

export default routes;
