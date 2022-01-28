export interface MobxState<T> {
  toJSON: () => Partial<T>
}
