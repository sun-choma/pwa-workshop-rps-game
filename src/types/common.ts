export type MergeRecords<
  FirstRecord extends { [Key in keyof FirstRecord]: FirstRecord[Key] },
  SecondRecord extends { [Key in keyof SecondRecord]: SecondRecord[Key] },
> = {
  [Key in keyof FirstRecord | keyof SecondRecord]: Key extends keyof FirstRecord
    ? FirstRecord[Key]
    : Key extends keyof SecondRecord
      ? SecondRecord[Key]
      : never;
};

export type PublicMethods<Instance> = {
  [Key in keyof Instance]: Instance[Key] extends (...args: never) => unknown
    ? Key
    : never;
}[keyof Instance];
