import { escapeString } from './escapeString';

/**
 * @description Get the query parameters from an object.
 */
export const getParamsString = (urlParams: Record<string, any>) =>
  Object.entries(urlParams).reduce(
    (previousValue: [string, any], currentValue: any[], index: number): any => {
      let paramValue = index === 1 ? `?` : `${previousValue}&`;

      // On the first run this will include the "zeroth" value
      if (index === 1) {
        const [key, value] = previousValue;
        paramValue += `${key}=${escapeString(value)}&`;
      }

      const [key, value] = currentValue;
      paramValue += `${key}=${escapeString(escapeString(value))}`;

      return paramValue;
    }
  );
