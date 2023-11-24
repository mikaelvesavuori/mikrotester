export type Assertion = {
  name: string;
  respondsWithin?: string;
  statusCodeIs?: number;
  is?: any;
  matches?: any;
};
