/** Evalueates to the instance type for a given constructor */
export type InstanceType<T> =
  T extends new (...args: any) => infer R
    ? R
    : never

/** Evaluates to a tuple of instance types for a given tuple of constructors */
export type InstanceTypes<Constructors extends unknown[]> =
  Constructors extends [ infer H, ...infer T ]
    ? [InstanceType<H>, ...InstanceTypes<T> ]
    : []
