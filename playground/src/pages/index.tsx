import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export default function Home(): ReactElement {
  return (
    <div className="page">
      <div className="hero">
        <h1>React KeepAlive Playground</h1>
        <p>在路由与组件层面演示缓存、刷新与作用域；观察状态的保留与重置。</p>
        <div className="row" style={{ justifyContent: "center" }}>
          <Link to="/docs"><button>文档</button></Link>
          <Link to="/components"><button>组件演示</button></Link>
          <Link to="/nocache"><button>非缓存页面</button></Link>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Demo A</h3>
          <p>基础计数与输入缓存。</p>
          <Link to="/demo/a"><button>进入</button></Link>
        </div>
        <div className="card">
          <h3>Demo B</h3>
          <p>与 A 切换观察状态保持。</p>
          <Link to="/demo/b"><button>进入</button></Link>
        </div>
        <div className="card">
          <h3>Demo C</h3>
          <p>更多交互与生命周期。</p>
          <Link to="/demo/c"><button>进入</button></Link>
        </div>
        <div className="card">
          <h3>Demo D</h3>
          <p>组合场景与切页体验。</p>
          <Link to="/demo/d"><button>进入</button></Link>
        </div>
        <div className="card">
          <h3>Demo Long</h3>
          <p>大列表与滚动位置保持。</p>
          <Link to="/demo/long"><button>进入</button></Link>
        </div>
      </div>
    </div>
  );
}
