export type Serialized<T> = {
  [P in keyof T]: T[P] extends Date ? string : Serialized<T[P]>
}
