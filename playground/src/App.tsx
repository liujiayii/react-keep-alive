import type { ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { KeepAlive, useAliveController } from "react-keep-alive";
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

  const { drop, dropScope, refresh, refreshScope, clear, getCachingNodes } = useAliveController();
  const [nameInput, setNameInput] = useState<string>("/investment/a");
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const target = useMemo(() => (useRegex ? new RegExp(nameInput) : nameInput), [useRegex, nameInput]);
  const handledQuery = useRef<string>("");

  useEffect(() => {
    const q = location.search;
    if (q === handledQuery.current)
      return;
    handledQuery.current = q;
    const params = new URLSearchParams(q);
    const action = params.get("action");
    const t = params.get("target");
    const isRegex = params.get("regex") === "1";
    const arg = t ? (isRegex ? new RegExp(t) : t) : undefined;
    if (!action)
      return;
    if (action === "clear") {
      clear();
      return;
    }
    if (!arg)
      return;
    if (action === "drop")
      drop(arg as any);
    else if (action === "dropScope")
      dropScope(arg as any);
    else if (action === "refresh")
      refresh(arg as any);
    else if (action === "refreshScope")
      refreshScope(arg as any);
  }, [location.search]);

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
          <Link to="/components">Components</Link>
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
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} style={{ padding: 6, width: 220 }} placeholder="name 或正则" />
          <label>
            <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} />
            {" "}
            正则
          </label>
          <button type="button" onClick={() => drop(target)}>drop</button>
          <button type="button" onClick={() => dropScope(target)}>dropScope</button>
          <button type="button" onClick={() => refresh(target)}>refresh</button>
          <button type="button" onClick={() => refreshScope(target)}>refreshScope</button>
          <button type="button" onClick={() => clear()}>clear</button>
          <span>
            缓存：
            {JSON.stringify(getCachingNodes())}
          </span>
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
