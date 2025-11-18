# react-keepalive

一个基于 React 19.2 的 Activity 实现的 KeepAlive 组件，为 React 路由应用带来与 Vue KeepAlive 类似的 include/exclude/max 语义与行为。

## 仓库结构

- `src/` 库源码（react-keepalive）
- `playground/` 演示应用：展示缓存、生命周期、LRU 等效果

## 安装

要求 React 版本为 19.2 及以上（以支持 Activity）。

```bash
pnpm add react-keepalive
```

## 快速上手

用 `KeepAlive` 包裹你的路由出口，并传入当前路径作为 `activeKey`。

```tsx
import { KeepAlive } from "react-keepalive";
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom";

function Layout() {
  const { pathname } = useLocation();
  return (
    <KeepAlive activeKey={pathname} include={[/^\/demo/]} max={3}>
      <Outlet />
    </KeepAlive>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <Layout />, children: [
    { path: "", element: <Home /> },
    { path: "demo/a", element: <demoA /> },
    { path: "demo/b", element: <demoB /> },
    { path: "nocache", element: <NoCache /> },
  ] }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

## API

### `<KeepAlive />`

参数说明：

- `activeKey: string` 当前激活项的唯一键，推荐使用 `location.pathname`
- `include?: (string | RegExp | (key: string) => boolean)[]` 允许被缓存的集合；设置后仅命中者缓存
- `exclude?: (string | RegExp | (key: string) => boolean)[]` 禁止被缓存的集合；命中者不缓存
- `max?: number` LRU 最大容量；超出后淘汰最久未使用项
- `children: ReactNode` 要被缓存/切换显示的内容

Tips：

- 当 `include` 为空时，默认允许所有页面进入缓存；设置了 `exclude` 后会优先生效
- `max` 为 `Infinity` 时不做容量限制；设为较小数值可观察 LRU 淘汰行为

### `useAliveLifecycle`

提供 `onActivated/onDeactivated` 生命周期回调（仅在被 KeepAlive 包裹的组件中触发）。

```tsx
import { useAliveLifecycle } from "react-keepalive";

export default function Page() {
  useAliveLifecycle({
    onActivated: () => console.log("activated"),
    onDeactivated: () => console.log("deactivated"),
  });
  return <div>content</div>;
}
```

### `useAliveController`

提供对缓存节点的主动控制能力，返回：`drop`、`dropScope`、`refresh`、`refreshScope`、`clear`、`getCachingNodes`。

- `drop(name)`：按 `name` 卸载命中的第一层缓存节点（`string | RegExp`）。
- `dropScope(name)`：按 `name` 卸载命中节点及其作用域内所有嵌套的 `<KeepAlive>`。
- `refresh(name)`：按 `name` 刷新命中的第一层缓存节点（重新挂载实例）。
- `refreshScope(name)`：按 `name` 刷新命中节点及其作用域内所有嵌套的 `<KeepAlive>`。
- `clear()`：清空所有缓存中的 `<KeepAlive>`。
- `getCachingNodes()`：获取当前所有缓存节点的名称列表。

```tsx
import { useAliveController } from "react-keepalive";

export default function Panel() {
  const { drop, dropScope, refresh, refreshScope, clear, getCachingNodes } = useAliveController();
  const target = "/demo/a";
  return (
    <div>
      <button type="button" onClick={() => drop(target)}>drop</button>
      <button type="button" onClick={() => dropScope(/^\/demo/)}>dropScope</button>
      <button type="button" onClick={() => refresh(target)}>refresh</button>
      <button type="button" onClick={() => refreshScope(/^\/demo/)}>refreshScope</button>
      <button type="button" onClick={() => clear()}>clear</button>
      <pre>{JSON.stringify(getCachingNodes(), null, 2)}</pre>
    </div>
  );
}
```

## Playground（演示）

已经内置演示工程：

- 顶部控制条：切换缓存模式（仅 /demo / 全部 / 禁用）与 LRU 容量
- 页面示例：`/demo/a/b/c/d`（计数器+输入框维持）、`/demo/long`（滚动位置维持）、`/nocache`（对照）

启动：

```bash
pnpm -C playground dev
```

构建：

```bash
pnpm -C playground build
```

## 开发&规范

本仓库在根目录配置了 `husky` + `lint-staged`：

- `pre-commit`：对变更的 `*.{ts,tsx,js,jsx}` 执行 `eslint --fix`
- `pre-push`：递归构建所有 workspace 包，提前发现类型/构建错误

启用 Git hooks：

```bash
git init
pnpm install
pnpm run prepare
```

常用脚本：

- `pnpm -C playground dev` 启动演示
- `pnpm -C playground build` 构建演示
- `pnpm build` 构建库（仅 TypeScript 编译）
- `pnpm lint` 在根目录执行 ESLint

## 说明

- 依赖 React 19.2+ 的 `Activity`，旧版本 React 不支持。
- 路由懒加载时，`KeepAlive` 仍能保持已加载页面的状态；首次进入页面后会进入缓存池。
- SSR 尚未验证，欢迎 PR。

## License

MIT
