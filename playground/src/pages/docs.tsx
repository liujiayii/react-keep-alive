import type { ReactElement } from "react";
import { marked } from "marked";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import readmeRaw from "../../../README.md?raw";

export default function Docs(): ReactElement {
  const html = useMemo(() => marked.parse(readmeRaw) as string, []);
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="row" style={{ marginBottom: 16 }}>
          <Link to="/"><button>返回首页</button></Link>
        </div>
        <div className="card" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
