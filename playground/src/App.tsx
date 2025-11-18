import type { ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { KeepAlive, useAliveController } from "react-activity-keep-alive";
import { createBrowserRouter, Link, RouterProvider, useLocation, useOutlet } from "react-router-dom";
import routes from "./routes";

function Layouts(): ReactElement {
  const location = useLocation();
  const outlet = useOutlet();

  // 顶部控制：缓存策略与 LRU 容量
  const [mode, setMode] = useState<"demo" | "all" | "disabled">("demo");
  const [max, setMax] = useState<number>(3);

  const includeRules = useMemo(() => {
    if (mode === "demo")
      return [/^\/demo/];
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
  const [nameInput, setNameInput] = useState<string>("/demo/a");
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
    <div className="min-h-screen">
      <div className="sticky top-0 z-[100] border-b bg-white/70 backdrop-blur">
        <div className="container flex flex-wrap items-center gap-4 py-3">
          <div className="from-indigo-600 to-cyan-400 bg-gradient-to-r bg-clip-text text-transparent font-800 tracking-wide">React KeepAlive</div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="badge">Home</Link>
            <Link to="/demo/a" className="badge">A</Link>
            <Link to="/demo/b" className="badge">B</Link>
            <Link to="/demo/c" className="badge">C</Link>
            <Link to="/demo/d" className="badge">D</Link>
            <Link to="/demo/long" className="badge">Long</Link>
            <Link to="/nocache" className="badge">NoCache</Link>
            <Link to="/components" className="badge">Components</Link>
            <Link to="/docs" className="badge">Docs</Link>
          </div>
          <div className="flex-1" />
          <div className="badge">
            activeKey:
            {location.pathname}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="panel">
          <div className="mb-2 font-600">缓存控制</div>
          <div className="flex flex-wrap items-center gap-3">
            <span>模式</span>
            <label>
              <input type="radio" name="mode" checked={mode === "demo"} onChange={() => setMode("demo")} />
              {" "}
              仅缓存 /demo
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
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span>max</span>
            <input type="range" min={1} max={10} value={max} onChange={(e) => setMax(Number(e.target.value))} />
            <span className="badge">{max}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="name 或正则" className="w-60 p-2" />
            <label>
              <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} />
              {" "}
              正则
            </label>
            <button type="button" className="btn" onClick={() => drop(target)}>drop</button>
            <button type="button" className="btn" onClick={() => dropScope(target)}>dropScope</button>
            <button type="button" className="btn" onClick={() => refresh(target)}>refresh</button>
            <button type="button" className="btn" onClick={() => refreshScope(target)}>refreshScope</button>
            <button type="button" className="btn" onClick={() => clear()}>clear</button>
            <span className="badge">
              缓存：
              {JSON.stringify(getCachingNodes())}
            </span>
          </div>
        </div>

        <KeepAlive activeKey={location.pathname} max={max} include={includeRules} exclude={excludeRules}>
          {outlet}
        </KeepAlive>
      </div>
    </div>
  );
}
const router = createBrowserRouter([
  { path: "/", element: <Layouts />, children: routes },
], { basename: "/react-keep-alive" });

function App(): ReactElement {
  return (
    <>
      {/* RouterProvider 不再设置 fallbackElement，避免与当前版本类型不匹配导致构建错误 */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
