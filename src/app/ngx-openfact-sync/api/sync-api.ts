import { InjectionToken } from '@angular/core';

/**
 * An OpaqueToken which is used to inject the WIT_API_URL in to this or any other module.
 *
 * For example, in your injectable constructor:
 *
 *   Inject(WIT_API_URL) apiUrl: string
 *
 */
export let SYNC_API_URL = new InjectionToken('openfact.sync.api.url');
