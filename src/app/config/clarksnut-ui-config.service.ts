import { ClarksnutUIConfig } from './clarksnut-ui-config';

export function clarksnutUIConfigFactory(): ClarksnutUIConfig {
  const answer = window['ClarksnutUIEnv'] || {};
  // lets filter out any values of 'undefined' in case an env var is missing in the template expression
  for (const key in answer) {
    if (answer[key]) {
      const value = answer[key];
      if (value === 'undefined') {
        answer[key] = '';
      }
    }
  }
  return answer as ClarksnutUIConfig;
}

export let clarksnutUIConfigProvider = {
  provide: ClarksnutUIConfig,
  useFactory: clarksnutUIConfigFactory,
  deps: []
};
