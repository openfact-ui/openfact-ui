export interface DateFilterValueGenerator {
  (): DateFilterValue;
}

export interface DateFilterValue {
  before?: Date;
  after?: Date
}
