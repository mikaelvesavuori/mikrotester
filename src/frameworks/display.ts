import { TestResult } from '../interfaces/TestResult';

/**
 * @description The wrapping function for displaying failed results.
 */
export function displayFailureResults(results: TestResult[]) {
  const failedResults = results.filter((result: TestResult) => result.success === false);

  failedResults.forEach((failedResult: any) => {
    const { name, status, response, expected } = failedResult;
    const expectedStatus = expected.statusCodeIs;
    const expectedResponse = expected.is || expected.matches;

    displayFailureMessage(name, status, expectedStatus, response, expectedResponse);
  });
}

/**
 * @description Displays the failure message for a given assertion.
 */
function displayFailureMessage(
  name: string,
  status: number,
  expectedStatus: number,
  response: Record<string, any>,
  expectedResponse: Record<string, any>
) {
  const _response = response ? JSON.stringify(response) : '';
  const _expectedResponse = expectedResponse ? JSON.stringify(expectedResponse) : '';

  console.log(`❌ Failed integration test: "${name}"`);
  console.log(`Response status was ${status}, expected ${expectedStatus}`);
  console.log(`Response data: ${_response}\nExpected response: ${_expectedResponse}`);
}

/**
 * @description Displays the final results of a test run.
 */
export function displayFinalResults(success: boolean) {
  if (success) console.log('✅ Passed all integration tests');
  else console.log('❌ Encountered failing tests!');
}
