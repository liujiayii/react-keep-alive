/* eslint-disable no-console */
import type { ReactElement, ReactNode } from "react";
import { Activity, use, useLayoutEffect, useMemo, useRef, useState } from "react";

import { AliveItemProvider, AliveScopeContext, AliveScopeProvider, registerKeepAliveInstance, unregisterKeepAliveInstance } from "./context";

const ActivityAny = Activity as any;

export type Rule = string | RegExp | ((key: string) => boolean);

export type KeepAliveProps = {
  /** 当前活跃组件的 key（建议使用路由 pathname） */
  activeKey: string;
  /** 允许被缓存的规则，若为空则不限制 */
  include?: Rule[];
  /** 禁止被缓存的规则 */
  exclude?: Rule[];
  /** 最大缓存数量，超出后采用 LRU 淘汰策略 */
  max?: number;
  /** children 通常为 <Outlet key={pathname} /> */
  children: ReactNode;
};

function matchRules(key: string, rules?: Rule[]): boolean {
  if (!rules || !rules.length)
    return false;
  return rules.some((r) => {
    if (typeof r === "string")
      return r === key;
    if (r instanceof RegExp)
      return r.test(key);
    if (typeof r === "function")
      return !!r(key);
    return false;
  });
}

/**
 * KeepAlive：基于 React 19.2 Activity 的缓存容器
 * - 尽量对齐 Vue KeepAlive 的 include/exclude/max 语义
 * - 通过 activeKey 控制当前激活项
 * - 非激活项通过 <Activity active={false}> 保持挂载与状态
 */
export default function KeepAlive(props: KeepAliveProps): ReactElement {
  const { activeKey, include, exclude, max = Infinity, children } = props;

  // 缓存池：key -> ReactNode（允许为 null）
  const cacheRef = useRef<Map<string, ReactNode>>(new Map());
  // LRU 队列（最旧在前，最新在后）
  const orderRef = useRef<string[]>([]);
  const scopesRef = useRef<Map<string, string[]>>(new Map());
  const [, setRev] = useState(0);
  const parentScope = use(AliveScopeContext);
  useRegisterInstance(cacheRef, orderRef, scopesRef, setRev);

  const shouldExclude = useMemo(() => matchRules(activeKey, exclude), [activeKey, exclude]);
  const shouldInclude = useMemo(() => matchRules(activeKey, include), [activeKey, include]);

  // Vue 语义：如果设置了 include，则只有命中 include 的才缓存；如果设置了 exclude，则命中 exclude 的不缓存
  const allowCache = useMemo(() => {
    if (shouldExclude)
      return false;
    if (include && include.length)
      return shouldInclude;
    return true;
  }, [shouldExclude, shouldInclude, include]);

  // 写入或更新当前活跃项到缓存
  // 使用 useLayoutEffect，确保在首次渲染前就把当前活跃项写入缓存，避免首屏空白
  useLayoutEffect(() => {
    if (!allowCache) {
      // 非缓存直接返回，不进入池；但依旧会渲染为唯一子节点
      return;
    }
    const cache = cacheRef.current;
    const order = orderRef.current;
    const scopes = scopesRef.current;

    const __DEV__ = typeof import.meta !== "undefined" && (import.meta as any).env?.DEV;
    if (__DEV__) {
      console.log("[KeepAlive] write cache", { activeKey, allowCache, beforeKeys: Array.from(cache.keys()) });
    }

    const existed = cache.get(activeKey);
    if (!existed) {
      cache.set(activeKey, children);
      order.push(activeKey);
      scopes.set(activeKey, [...parentScope, activeKey]);
    } else {
      // 更新当前活跃项的最新节点（保证下一次切回时是最新 UI）
      cache.set(activeKey, children);
      // 触碰 LRU：把 activeKey 移动到队尾
      const idx = order.indexOf(activeKey);
      if (idx !== -1) {
        order.splice(idx, 1);
      }
      order.push(activeKey);
      scopes.set(activeKey, [...parentScope, activeKey]);
    }

    // LRU 淘汰：超出最大容量时，移除队首（但不移除当前活跃项）
    while (cache.size > max) {
      const victim = order[0];
      if (!victim || victim === activeKey)
        break;
      order.shift();
      cache.delete(victim);
      scopes.delete(victim);
    }
    if (__DEV__) {
      console.log("[KeepAlive] cache state", { keys: Array.from(cache.keys()), order: [...order] });
    }
  }, [activeKey, children, allowCache, max]);

  // 构造需要渲染的列表：
  // - 若不允许缓存，则只渲染当前 children（非缓存）
  // - 若允许缓存，则渲染缓存池里的所有项，并根据 activeKey 切换 Activity 状态
  const renderList = useMemo(() => {
    const list: ReactElement[] = [];
    const cache = cacheRef.current;
    const order = orderRef.current;
    const __DEV__ = typeof import.meta !== "undefined" && (import.meta as any).env?.DEV;

    // 首次进入且允许缓存：在渲染前就预填充当前活跃项到缓存，避免先渲染“临时 children”再替换为缓存元素导致的卸载/重装
    if (allowCache && !cache.has(activeKey)) {
      cache.set(activeKey, children);
      order.push(activeKey);
      scopesRef.current.set(activeKey, [...parentScope, activeKey]);
      if (__DEV__) {
        console.log("[KeepAlive] prefill cache", { activeKey, allowCache, keys: Array.from(cache.keys()) });
      }
    }

    const entries = Array.from(cache.entries());

    if (__DEV__) {
      console.log("[KeepAlive] render", { activeKey, allowCache, cacheKeys: entries.map(([k]) => k) });
    }

    // 始终渲染缓存池中的所有项
    for (const [key, element] of entries) {
      const isActive = key === activeKey;
      // 关键修正：不论激活与否，始终渲染缓存池里“同一份 element”，避免在激活/失活切换时
      // 在 Activity 子树下替换为一个“新的 children”导致 React 认为需要卸载并重装组件实例。
      // 这样可以避免你看到的首次离开时出现 unmount 然后再 mount 的现象。
      const node = element;
      list.push(
        <ActivityAny key={key} active={isActive}>
          <div style={{ display: isActive ? undefined : "none" }}>
            <AliveScopeProvider name={key}>
              <AliveItemProvider active={isActive}>
                {node}
              </AliveItemProvider>
            </AliveScopeProvider>
          </div>
        </ActivityAny>,
      );
    }

    // 当不允许缓存时，仍需要渲染当前活跃项（作为临时子节点，不进入缓存）
    if (!allowCache || entries.length === 0) {
      list.push(
        <ActivityAny key={activeKey} active>
          <AliveScopeProvider name={activeKey}>
            <AliveItemProvider active>
              {children}
            </AliveItemProvider>
          </AliveScopeProvider>
        </ActivityAny>,
      );
    }

    return list;
  }, [allowCache, activeKey, children]);

  return <>{renderList}</>;
}

function makeInstance(
  cacheRef: React.MutableRefObject<Map<string, ReactNode>>,
  orderRef: React.MutableRefObject<string[]>,
  scopesRef: React.MutableRefObject<Map<string, string[]>>,
  bump: () => void,
): import("./context").KeepAliveInstance {
  return {
    getKeys: () => Array.from(cacheRef.current.keys()),
    getScopes: () => scopesRef.current,
    dropByName: (name) => {
      const cache = cacheRef.current;
      const order = orderRef.current;
      const scopes = scopesRef.current;
      const keys = Array.from(cache.keys());
      for (const k of keys) {
        const hit = typeof name === "string" ? k === name : name.test(k);
        if (hit) {
          cache.delete(k);
          scopes.delete(k);
          const idx = order.indexOf(k);
          if (idx !== -1)
            order.splice(idx, 1);
        }
      }
      bump();
    },
    refreshByName: (name) => {
      const cache = cacheRef.current;
      const order = orderRef.current;
      const scopes = scopesRef.current;
      const keys = Array.from(cache.keys());
      for (const k of keys) {
        const hit = typeof name === "string" ? k === name : name.test(k);
        if (hit) {
          cache.delete(k);
          scopes.delete(k);
          const idx = order.indexOf(k);
          if (idx !== -1)
            order.splice(idx, 1);
        }
      }
      bump();
    },
    clearAll: () => {
      cacheRef.current.clear();
      orderRef.current.length = 0;
      scopesRef.current.clear();
      bump();
    },
  };
}

function useRegisterInstance(cacheRef: React.MutableRefObject<Map<string, ReactNode>>, orderRef: React.MutableRefObject<string[]>, scopesRef: React.MutableRefObject<Map<string, string[]>>, setRev: React.Dispatch<React.SetStateAction<number>>): void {
  useLayoutEffect(() => {
    const inst = makeInstance(cacheRef, orderRef, scopesRef, () => setRev((x) => x + 1));
    registerKeepAliveInstance(inst);
    return () => unregisterKeepAliveInstance(inst);
  }, []);
}
