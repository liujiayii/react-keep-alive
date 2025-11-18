import type { ReactElement } from "react";
import { marked } from "marked";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import readmeRaw from "../../../README.md?raw";

export default function Docs(): ReactElement {
  const html = useMemo(() => marked.parse(readmeRaw) as string, []);
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/">返回 Demo 首页</Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
