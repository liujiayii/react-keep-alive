//
import type { ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAliveLifecycle } from "react-keep-alive";
import { Link } from "react-router-dom";

export default function InvestmentLong(): ReactElement {
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
    <div style={{ padding: 24 }}>
      <h2>Investment Long（被缓存，检查滚动位置保持）</h2>
      <p style={{ color: "#666" }}>在页面内滚动，然后切换到其他缓存页面再回来，滚动位置应保持不变。</p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/investment/a">A</Link>
        <Link to="/investment/b">B</Link>
        <Link to="/investment/c">C</Link>
        <Link to="/investment/d">D</Link>
        <Link to="/">首页</Link>
      </div>
      <div
        ref={containerRef}
        style={{
          marginTop: 12,
          height: 320,
          overflow: "auto",
          border: "1px solid #eee",
          borderRadius: 8,
          background: "#fff",
        }}
      >
        {items.map((item, i) => (
          <div key={item.id} style={{ padding: 12, borderBottom: "1px solid #f0f0f0" }}>
            <strong>
              Item
              {i + 1}
            </strong>
            <div style={{ marginTop: 8 }}>
              <input placeholder={`给 Item ${i + 1} 留点字（保持状态）`} style={{ padding: 6, width: 280 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ color: "#666", marginTop: 12 }}>
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
