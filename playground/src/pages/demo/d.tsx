//
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useAliveLifecycle } from "react-keepalive";
import { Link } from "react-router-dom";

export default function DemoD(): ReactElement {
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
      console.warn("[D] onActivated");
    },
    onDeactivated: () => {
      setDeactivatedTimes((n) => n + 1);
      setTimerRunning(false);
      console.warn("[D] onDeactivated");
    },
  });

  useEffect(() => {
    if (!timerRunning)
      return;
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [timerRunning]);

  return (
    <div className="p-6">
      <h2>demo D（被缓存）</h2>
      <div className="my-3 flex gap-4">
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
      <div className="my-3">
        <input
          placeholder="输入点什么（切页后保持）"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-72 p-2"
        />
      </div>
      <div className="text-slate-500">
        <p>
          onActivated 次数：
          {activatedTimes}
        </p>
        <p>
          onDeactivated 次数：
          {deactivatedTimes}
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <Link to="/demo/a">A</Link>
        <Link to="/demo/b">B</Link>
        <Link to="/demo/c">C</Link>
        <Link to="/">首页</Link>
      </div>
    </div>
  );
}
