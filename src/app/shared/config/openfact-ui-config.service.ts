import { OpenfactUIConfig } from './openfact-ui-config';

export function openfactUIConfigFactory(): OpenfactUIConfig {
  let answer = window['OpenfactUIEnv'] || {};
  // lets filter out any values of 'undefined' in case an env var is missing in the template expression
  for (let key in answer) {
    let value = answer[key];
    if (value === 'undefined') {
      answer[key] = '';
    }
  }
  return answer as OpenfactUIConfig;
}

export const openfactUIConfigProvider = {
  provide: OpenfactUIConfig,
  useFactory: openfactUIConfigFactory,
  deps: []
};
