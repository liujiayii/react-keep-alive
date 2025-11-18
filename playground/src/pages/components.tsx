import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { KeepAlive, useAliveLifecycle } from "react-activity-keep-alive";

function APane(): ReactElement {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [activatedTimes, setActivatedTimes] = useState(0);
  const [deactivatedTimes, setDeactivatedTimes] = useState(0);
  useAliveLifecycle({
    onActivated: () => setActivatedTimes((n) => n + 1),
    onDeactivated: () => setDeactivatedTimes((n) => n + 1),
  });
  return (
    <div className="p-4">
      <h3>组件 A（组件级缓存）</h3>
      <div className="my-3 flex gap-3">
        <button type="button" onClick={() => setCount((c) => c + 1)}>count + 1</button>
        <span>
          count:
          {count}
        </span>
      </div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="A 的输入框（切 Tab 后保持）" className="w-72 p-2" />
      <div className="mt-2 text-slate-500">
        <div>
          onActivated:
          {activatedTimes}
        </div>
        <div>
          onDeactivated:
          {deactivatedTimes}
        </div>
      </div>
    </div>
  );
}

function BPane(): ReactElement {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [activatedTimes, setActivatedTimes] = useState(0);
  const [deactivatedTimes, setDeactivatedTimes] = useState(0);
  useAliveLifecycle({
    onActivated: () => setActivatedTimes((n) => n + 1),
    onDeactivated: () => setDeactivatedTimes((n) => n + 1),
  });
  return (
    <div className="p-4">
      <h3>组件 B（组件级缓存）</h3>
      <div className="my-3 flex gap-3">
        <button type="button" onClick={() => setCount((c) => c + 1)}>count + 1</button>
        <span>
          count:
          {count}
        </span>
      </div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="B 的输入框（切 Tab 后保持）" className="w-72 p-2" />
      <div className="mt-2 text-slate-500">
        <div>
          onActivated:
          {activatedTimes}
        </div>
        <div>
          onDeactivated:
          {deactivatedTimes}
        </div>
      </div>
    </div>
  );
}

export default function ComponentsCacheDemo(): ReactElement {
  const [tab, setTab] = useState<"A" | "B">("A");
  const include = useMemo(() => ["A", "B"], []);
  return (
    <div className="p-6">
      <h2>组件缓存演示</h2>
      <p className="text-slate-500">本页内部通过嵌套的 KeepAlive 对组件进行缓存，切换 Tab 时未激活的组件保持挂载与状态。</p>
      <div className="mb-3 flex gap-2">
        <button type="button" onClick={() => setTab("A")} disabled={tab === "A"}>Tab A</button>
        <button type="button" onClick={() => setTab("B")} disabled={tab === "B"}>Tab B</button>
        <span className="ml-3">
          activeKey:
          <code>{tab}</code>
        </span>
      </div>
      <div className="border border-[#eee] rounded-lg">
        <KeepAlive activeKey={tab} include={include} max={5}>
          {tab === "A" ? <APane /> : <BPane />}
        </KeepAlive>
      </div>
    </div>
  );
}
