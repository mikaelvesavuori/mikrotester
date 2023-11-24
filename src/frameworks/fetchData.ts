import { FetchResponse } from '../interfaces/FetchResponse';

import { getParamsString } from './getParamsString';

/**
 * @description Wrapper for fetching data.
 */
export async function fetchData(
  url: string,
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  headers?: Record<string, any>,
  body?: any,
  urlParams?: Record<string, any>
): Promise<FetchResponse> {
  const fetchUrl = urlParams ? `${url}${getParamsString(urlParams)}` : url;

  const response = await fetch(fetchUrl, {
    headers,
    body: body ? JSON.stringify(body) : undefined,
    method: method || 'GET'
  });

  // If this is OK and status 204 ("No content") then we can safely return
  if (response.ok && response.status === 204) return Response(response.status, 'OK');

  const text = await response.text();

  // Return text or JSON depending on what it actually was
  try {
    const data = JSON.parse(text);
    return Response(response.status, data);
  } catch (error) {
    return Response(response.status, text);
  }
}

function Response(statusCode: number, response: string) {
  return {
    status: statusCode,
    response: response
  };
}
