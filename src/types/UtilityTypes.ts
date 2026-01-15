export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Keys extends keyof T
  ? Pick<T, Keys> & Partial<Record<Exclude<keyof T, Keys>, never>>
  : never;
