import { Assertion } from './Assertion';

export type TestResult = {
  name: string;
  success: boolean;
  status: number;
  response: Record<string, any> | string | number;
  expected: Assertion;
};
