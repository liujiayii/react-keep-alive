//
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useAliveLifecycle } from "react-keepalive";
import { Link } from "react-router-dom";

export default function DemoB(): ReactElement {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [activatedTimes, setActivatedTimes] = useState(0);
  const [deactivatedTimes, setDeactivatedTimes] = useState(0);
  const [tick, setTick] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useAliveLifecycle({
    onActivated: () => {
      setActivatedTimes((n) => n + 1);
      setTimerRunning(true);
      console.warn("[B] onActivated");
    },
    onDeactivated: () => {
      setDeactivatedTimes((n) => n + 1);
      setTimerRunning(false);
      console.warn("[B] onDeactivated");
    },
  });

  useEffect(() => {
    if (!timerRunning)
      return;
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [timerRunning]);

  return (
    <div style={{ padding: 24 }}>
      <h2>demo B（被缓存）</h2>
      <div style={{ display: "flex", gap: 16, margin: "12px 0" }}>
        <button type="button" onClick={() => setCount((c) => c + 1)}>count + 1</button>
        <span>
          count:
          {count}
        </span>
        <span>
          tick:
          {tick}
          s（激活时计时）
        </span>
      </div>
      <div style={{ margin: "12px 0" }}>
        <input
          placeholder="输入点什么（切页后保持）"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: 8, width: 280 }}
        />
      </div>
      <div style={{ color: "#666" }}>
        <p>
          onActivated 次数：
          {activatedTimes}
        </p>
        <p>
          onDeactivated 次数：
          {deactivatedTimes}
        </p>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link to="/demo/a">去 demo A</Link>
        <Link to="/">返回首页</Link>
        <Link to="/nocache">去非缓存页面 /nocache</Link>
      </div>
    </div>
  );
}
