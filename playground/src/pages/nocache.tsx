import type { ReactElement } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NoCachePage(): ReactElement {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  return (
    <div className="p-6">
      <h2>非缓存页面 /nocache</h2>
      <p>
        由于 KeepAlive 的 include 仅包含
        {" "}
        <code>/demo</code>
        {" "}
        前缀，本页面不会被缓存。
        离开再回来时，下面的状态会重置。
      </p>
      <div className="my-3 flex gap-4">
        <button type="button" onClick={() => setCount((c) => c + 1)}>count + 1</button>
        <span>
          count:
          {count}
        </span>
      </div>
      <div className="my-3">
        <input
          placeholder="输入点什么（离开返回后将重置）"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-72 p-2"
        />
      </div>
      <div className="mt-4 flex gap-3">
        <Link to="/">返回首页</Link>
        <Link to="/demo/a">去 demo A</Link>
        <Link to="/demo/b">去 demo B</Link>
      </div>
    </div>
  );
}
