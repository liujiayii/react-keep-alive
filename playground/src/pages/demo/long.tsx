//
import type { ReactElement } from "react";
import { useAliveLifecycle } from "rc-keep-alive";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function DemoLong(): ReactElement {
  const [activatedTimes, setActivatedTimes] = useState(0);
  const [deactivatedTimes, setDeactivatedTimes] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const items = useMemo(() => Array.from({ length: 200 }, (_, i) => ({ id: `item-${i + 1}` })), []);

  useAliveLifecycle({
    onActivated: () => {
      setActivatedTimes((n) => n + 1);
      console.warn("[Long] onActivated", { scrollTop: containerRef.current?.scrollTop });
    },
    onDeactivated: () => {
      setDeactivatedTimes((n) => n + 1);
      console.warn("[Long] onDeactivated", { scrollTop: containerRef.current?.scrollTop });
    },
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el)
      return;
    const onScroll = (): void => {
      // 仅用于在控制台观察滚动位置是否在失活/激活之间保持
      console.warn("[Long] scrollTop:", el.scrollTop);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="p-6">
      <h2>demo Long（被缓存，检查滚动位置保持）</h2>
      <p className="text-slate-500">在页面内滚动，然后切换到其他缓存页面再回来，滚动位置应保持不变。</p>
      <div className="flex gap-3">
        <Link to="/demo/a">A</Link>
        <Link to="/demo/b">B</Link>
        <Link to="/demo/c">C</Link>
        <Link to="/demo/d">D</Link>
        <Link to="/">首页</Link>
      </div>
      <div
        ref={containerRef}
        className="mt-3 h-80 overflow-auto border border-[#eee] rounded-lg bg-white"
      >
        {items.map((item, i) => (
          <div key={item.id} className="border-b border-[#f0f0f0] p-3">
            <strong>
              Item
              {i + 1}
            </strong>
            <div className="mt-2">
              <input placeholder={`给 Item ${i + 1} 留点字（保持状态）`} className="w-72 p-2" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-slate-500">
        <p>
          onActivated 次数：
          {activatedTimes}
        </p>
        <p>
          onDeactivated 次数：
          {deactivatedTimes}
        </p>
      </div>
    </div>
  );
}
