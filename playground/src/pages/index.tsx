import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export default function Home(): ReactElement {
  return (
    <div style={{ padding: 24 }}>
      <h1>React KeepAlive 演示首页</h1>
      <p>
        这个 playground 使用 KeepAlive 包裹路由内容，并通过
        <code style={{ margin: "0 4px" }}>include: [/^/investment/]</code>
        仅缓存
        <code style={{ margin: "0 4px" }}>/investment</code>
        下的页面。切换页面时你可以观察到状态是否被保留。
      </p>

      <h2>演示入口</h2>
      <ul style={{ lineHeight: 2 }}>
        <li>
          <Link to="/investment/a">/investment/a - 缓存页面 A</Link>
        </li>
        <li>
          <Link to="/investment/b">/investment/b - 缓存页面 B</Link>
        </li>
        <li>
          <Link to="/investment/c">/investment/c - 缓存页面 C</Link>
        </li>
        <li>
          <Link to="/investment/d">/investment/d - 缓存页面 D</Link>
        </li>
        <li>
          <Link to="/investment/long">/investment/long - 大列表与滚动保持</Link>
        </li>
        <li>
          <Link to="/nocache">/nocache - 非缓存页面</Link>
        </li>
        <li>
          <Link to="/components">/components - 组件缓存演示（页内 Tab 切换）</Link>
        </li>
      </ul>

      <p style={{ color: "#666" }}>
        提示：在 A 与 B 之间来回切换，输入框与计数器状态会保留下来；切去非缓存页面再回来，A/B 状态仍在。
        进入 /nocache 后离开再返回，状态会重置。
      </p>
      <p style={{ color: "#666" }}>
        你也可以使用顶部的控制栏调整缓存策略（仅缓存 /investment / 缓存全部 / 禁用缓存）以及 LRU 的最大缓存数量 max，
        访问 A/B/C/D 超过 max 时，将看到最早访问的页面被淘汰，再返回时状态会重置。
      </p>
    </div>
  );
}
