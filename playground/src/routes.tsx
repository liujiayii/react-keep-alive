import type { RouteObject } from "react-router-dom";
import Home from "./pages/index";
import InvestmentA from "./pages/investment/a";
import InvestmentB from "./pages/investment/b";
import InvestmentC from "./pages/investment/c";
import InvestmentD from "./pages/investment/d";
import InvestmentLong from "./pages/investment/long";
import NoCachePage from "./pages/nocache";

const routes: RouteObject[] = [
  { index: true, element: <Home /> },
  {
    path: "investment",
    children: [
      { path: "a", element: <InvestmentA /> },
      { path: "b", element: <InvestmentB /> },
      { path: "c", element: <InvestmentC /> },
      { path: "d", element: <InvestmentD /> },
      { path: "long", element: <InvestmentLong /> },
    ],
  },
  { path: "nocache", element: <NoCachePage /> },
];

export default routes;
