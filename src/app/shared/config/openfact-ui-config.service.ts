import {OpenfactUIConfig} from './openfact-ui-config';

function fabric8UIConfigFactory(): OpenfactUIConfig {
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

export let openfactUIConfigProvider = {
  provide: OpenfactUIConfig,
  useFactory: fabric8UIConfigFactory,
  deps: []
};
