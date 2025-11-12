import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { KeepAlive } from "react-keep-alive";
import { createBrowserRouter, Link, RouterProvider, useLocation, useOutlet } from "react-router-dom";
import routes from "./routes";

function Layouts(): ReactElement {
  const location = useLocation();
  const outlet = useOutlet();

  // 顶部控制：缓存策略与 LRU 容量
  const [mode, setMode] = useState<"investment" | "all" | "disabled">("investment");
  const [max, setMax] = useState<number>(3);

  const includeRules = useMemo(() => {
    if (mode === "investment")
      return [/^\/investment/];
    if (mode === "all")
      return undefined; // 不传 include 表示允许全部缓存
    return [];
  }, [mode]);

  const excludeRules = useMemo(() => {
    if (mode === "disabled")
      return [/^\/.*/];
    return undefined;
  }, [mode]);

  return (
    <div>
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#ffffffcc",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid #eee",
        padding: "8px 12px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
      >
        <strong>KeepAlive 控制台：</strong>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/">首页</Link>
          <Link to="/investment/a">A</Link>
          <Link to="/investment/b">B</Link>
          <Link to="/investment/c">C</Link>
          <Link to="/investment/d">D</Link>
          <Link to="/investment/long">Long</Link>
          <Link to="/nocache">NoCache</Link>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span>模式：</span>
          <label>
            <input type="radio" name="mode" checked={mode === "investment"} onChange={() => setMode("investment")} />
            {" "}
            仅缓存 /investment
          </label>
          <label>
            <input type="radio" name="mode" checked={mode === "all"} onChange={() => setMode("all")} />
            {" "}
            缓存全部
          </label>
          <label>
            <input type="radio" name="mode" checked={mode === "disabled"} onChange={() => setMode("disabled")} />
            {" "}
            禁用缓存
          </label>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label>
            max:
            <input type="range" min={1} max={10} value={max} onChange={(e) => setMax(Number(e.target.value))} style={{ verticalAlign: "middle", marginLeft: 8 }} />
          </label>
          <span>{max}</span>
        </div>
        <div style={{ color: "#666" }}>
          activeKey:
          <code>{location.pathname}</code>
        </div>
      </div>

      <KeepAlive activeKey={location.pathname} max={max} include={includeRules} exclude={excludeRules}>
        {outlet}
      </KeepAlive>
    </div>
  );
}
const router = createBrowserRouter([
  { path: "/", element: <Layouts />, children: routes },
]);

function App(): ReactElement {
  return (
    <>
      {/* RouterProvider 不再设置 fallbackElement，避免与当前版本类型不匹配导致构建错误 */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
