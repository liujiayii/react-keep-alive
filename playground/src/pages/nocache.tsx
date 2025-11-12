import type { ReactElement } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NoCachePage(): ReactElement {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  return (
    <div style={{ padding: 24 }}>
      <h2>非缓存页面 /nocache</h2>
      <p>
        由于 KeepAlive 的 include 仅包含
        {" "}
        <code>/investment</code>
        {" "}
        前缀，本页面不会被缓存。
        离开再回来时，下面的状态会重置。
      </p>
      <div style={{ display: "flex", gap: 16, margin: "12px 0" }}>
        <button type="button" onClick={() => setCount((c) => c + 1)}>count + 1</button>
        <span>
          count:
          {count}
        </span>
      </div>
      <div style={{ margin: "12px 0" }}>
        <input
          placeholder="输入点什么（离开返回后将重置）"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: 8, width: 280 }}
        />
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link to="/">返回首页</Link>
        <Link to="/investment/a">去 Investment A</Link>
        <Link to="/investment/b">去 Investment B</Link>
      </div>
    </div>
  );
}
