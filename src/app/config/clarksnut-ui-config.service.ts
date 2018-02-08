import { ClarksnutUIConfig } from './clarksnut-ui-config';

export function clarksnutUIConfigFactory(): ClarksnutUIConfig {
  let answer = window['ClarksnutUIEnv'] || {};
  // lets filter out any values of "undefined" in case an env var is missing in the template expression
  for (let key in answer) {
    let value = answer[key];
    if (value === 'undefined') {
      answer[key] = '';
    }
  }
  return answer as ClarksnutUIConfig;
}

export let clarksnutUIConfigProvider = {
  provide: ClarksnutUIConfig,
  useFactory: clarksnutUIConfigFactory,
  deps: []
};
