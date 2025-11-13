import { use, useEffect, useRef } from "react";
import { AliveController, AliveItemContext } from "./context";

/** 当组件被激活（显示）时触发 */
export function useActivated(effect?: () => void): void {
  const { active } = use(AliveItemContext);
  const last = useRef<boolean>(active);

  useEffect(() => {
    if (effect && active && !last.current) {
      // 由失活 -> 激活
      effect();
    }
    last.current = active;
  }, [active, effect]);
}

/** 当组件被失活（隐藏但保留状态）时触发 */
export function useDeactivated(effect?: () => void): void {
  const { active } = use(AliveItemContext);
  const last = useRef<boolean>(active);

  useEffect(() => {
    if (effect && !active && last.current) {
      // 由激活 -> 失活
      effect();
    }
    last.current = active;
  }, [active, effect]);
}

/**
 * 综合生命周期支持（类比 Vue 的 onActivated/onDeactivated）
 */
export function useAliveLifecycle(opts: { onActivated?: () => void; onDeactivated?: () => void }): void {
  const { onActivated, onDeactivated } = opts;
  // Hooks 必须无条件调用：传入可选 effect，在内部判断是否执行
  useActivated(onActivated);
  useDeactivated(onDeactivated);
}

export function useAliveController(): {
  drop: (name: string | RegExp) => void;
  dropScope: (name: string | RegExp) => void;
  refresh: (name: string | RegExp) => void;
  refreshScope: (name: string | RegExp) => void;
  clear: () => void;
  getCachingNodes: () => string[];
} {
  return {
    drop: (name) => AliveController.drop(name),
    dropScope: (name) => AliveController.dropScope(name),
    refresh: (name) => AliveController.refresh(name),
    refreshScope: (name) => AliveController.refreshScope(name),
    clear: () => AliveController.clear(),
    getCachingNodes: () => AliveController.getCachingNodes(),
  };
}
