/* eslint-disable react-refresh/only-export-components */
import React, { createContext, use, useMemo } from "react";

export type AliveItemContextValue = {
  /** 当前缓存项是否处于激活态（显示态） */
  active: boolean;
};

export const AliveItemContext = createContext<AliveItemContextValue>({ active: true });

export function AliveItemProvider({ active, children }: { active?: boolean; children: React.ReactNode }): React.ReactElement {
  const value = useMemo(() => ({ active: !!active }), [active]);
  return <AliveItemContext value={value}>{children}</AliveItemContext>;
}

export type AliveScopeContextValue = string[];
export const AliveScopeContext = createContext<AliveScopeContextValue>([]);

export function AliveScopeProvider({ name, children }: { name: string; children: React.ReactNode }): React.ReactElement {
  const parent = use(AliveScopeContext);
  const value = useMemo(() => [...parent, name], [parent, name]);
  return <AliveScopeContext value={value}>{children}</AliveScopeContext>;
}

export type KeepAliveInstance = {
  getKeys: () => string[];
  getScopes: () => Map<string, string[]>;
  dropByName: (name: string | RegExp, deep: boolean) => void;
  refreshByName: (name: string | RegExp, deep: boolean) => void;
  clearAll: () => void;
};

const registry: Set<KeepAliveInstance> = new Set();

export function registerKeepAliveInstance(inst: KeepAliveInstance): void {
  registry.add(inst);
}

export function unregisterKeepAliveInstance(inst: KeepAliveInstance): void {
  registry.delete(inst);
}

function matchName(target: string, name: string | RegExp): boolean {
  if (typeof name === "string")
    return target === name;
  return name.test(target);
}

export const AliveController = {
  drop(name: string | RegExp): void {
    for (const inst of registry) {
      inst.dropByName(name, false);
    }
  },
  dropScope(name: string | RegExp): void {
    for (const inst of registry) {
      const scopes = inst.getScopes();
      for (const [key, path] of scopes.entries()) {
        if (path.some((seg) => matchName(seg, name))) {
          inst.dropByName(key, false);
        }
      }
    }
  },
  refresh(name: string | RegExp): void {
    for (const inst of registry) {
      inst.refreshByName(name, false);
    }
  },
  refreshScope(name: string | RegExp): void {
    for (const inst of registry) {
      const scopes = inst.getScopes();
      for (const [key, path] of scopes.entries()) {
        if (path.some((seg) => matchName(seg, name))) {
          inst.refreshByName(key, false);
        }
      }
    }
  },
  clear(): void {
    for (const inst of registry) {
      inst.clearAll();
    }
  },
  getCachingNodes(): string[] {
    const out: string[] = [];
    for (const inst of registry) {
      for (const key of inst.getKeys())
        out.push(key);
    }
    return Array.from(new Set(out));
  },
};
