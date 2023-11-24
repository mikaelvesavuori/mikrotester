import Ajv from 'ajv';

import { Assertion } from '../interfaces/Assertion';
import { FetchResponse } from '../interfaces/FetchResponse';
import { TestInput } from '../interfaces/TestInput';
import { TestResult } from '../interfaces/TestResult';

import { displayFailureResults, displayFinalResults } from '../frameworks/display';
import { fetchData } from '../frameworks/fetchData';

/**
 * @description TODO
 */
export class MikroTest {
  /**
   * @description Run all tests.
   */
  public async runTests(testInputs: TestInput[]) {
    const allTests = await this.getAllTests(testInputs);

    Promise.all(allTests)
      .catch((error) => error)
      .then((results: TestResult[]) => {
        displayFailureResults(results);
        return results
          .map((result: TestResult) => result.success)
          .every((result: boolean) => result === true);
      })
      .then((success: boolean) => displayFinalResults(success));

    return Promise.all(allTests);
  }

  /**
   * @description Return all assertions as promises.
   */
  private async getAllTests(testInputs: TestInput[]) {
    const allTests: Promise<TestResult>[] = [];

    const mikrotest = new MikroTest();

    for (const testInput of testInputs) {
      const { assertions } = testInput;

      for (const assertion of assertions) {
        allTests.push(
          new Promise(async (resolve) => {
            const { endpoint, method, headers, body, urlParams } = testInput;
            const actual = await fetchData(endpoint, method, headers, body, urlParams);
            if (!actual) throw new Error('❌ No response!');

            const { success, status, response, expected } = mikrotest.assert(assertion, actual);
            resolve({ name: assertion.name, success, status, response, expected });
          })
        );
      }
    }

    return allTests;
  }

  /**
   * @description Run an assertion against fetched data.
   */
  private assert(assertion: Assertion, actual: FetchResponse): TestResult {
    const { name } = assertion;
    const { status, response } = actual;

    console.log(`Running integration test: "${name}"`);

    const success = this.validate(assertion, actual);

    return {
      name,
      success,
      status,
      response,
      expected: assertion
    };
  }

  /**
   * @description Match the assertion with the correct validator.
   */
  private validate(assertion: Assertion, actual: FetchResponse) {
    try {
      const { is, matches, statusCodeIs } = assertion;
      const { status, response } = actual;

      if (statusCodeIs) return this.validateAgainstStatusCode(status, statusCodeIs);

      if (is) {
        if (typeof response !== 'object') return this.validateAgainstResponse(response, is);
        if (typeof response === 'object') return this.validateAgainstObject(response, is);
      }

      if (matches && typeof response === 'object')
        return this.validateAgainstSchema(response, matches);

      console.log('No matching validator found, will check for "OK" message as assertion...');
      return JSON.stringify(response) === JSON.stringify('OK');
    } catch (error) {
      // If this fails, it's most likely that the Ajv compilation failed because of incorrect JSON schema
      console.error(error);
      return false;
    }
  }

  private validateAgainstStatusCode = (value: number, expected: number) => value === expected;
  private validateAgainstResponse = (value: string | number, expected: string | number) =>
    value === expected;
  private validateAgainstObject = (response: Record<string, any>, expected: Record<string, any>) =>
    JSON.stringify(response) === JSON.stringify(expected);
  private validateAgainstSchema = (response: Record<string, any>, expected: Record<string, any>) =>
    new Ajv().compile(expected)(response);
}
