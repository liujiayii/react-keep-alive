/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useMemo } from "react";

export type AliveItemContextValue = {
  /** 当前缓存项是否处于激活态（显示态） */
  active: boolean;
};

export const AliveItemContext = createContext<AliveItemContextValue>({ active: true });

export function AliveItemProvider({ active, children }: { active?: boolean; children: React.ReactNode }): React.ReactElement {
  const value = useMemo(() => ({ active: !!active }), [active]);
  return <AliveItemContext value={value}>{children}</AliveItemContext>;
}
