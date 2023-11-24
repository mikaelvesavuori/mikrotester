import { Assertion } from './Assertion';

export type TestInput = {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, any>;
  urlParams?: Record<string, any>;
  body?: string;
  assertions: Assertion[];
};
