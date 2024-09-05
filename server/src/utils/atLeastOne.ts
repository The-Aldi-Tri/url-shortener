/**
 * `AtLeastOne<T>` is a utility type that ensures at least one property from type `T` is present.
 * It creates a union of types where each type has exactly one property of `T` (and all other properties are omitted).
 */
export type AtLeastOne<T> = {
  [K in keyof T]-?: Pick<T, K> & Partial<Record<Exclude<keyof T, K>, never>>;
}[keyof T];
