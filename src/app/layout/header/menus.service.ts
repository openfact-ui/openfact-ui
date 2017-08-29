import { MenuedContextType } from './menued-context-type';
import { Injectable } from '@angular/core';
import { MenuItem } from './../../models/menu-item';
import { ContextType, Contexts, ContextTypes, Context } from 'ngo-openfact-sync';
import { cloneDeep } from 'lodash';

@Injectable()
export class MenusService {

    constructor() { }

    public attach(context: Context) { }

    private buildPath(...args: string[]): string {
        let res = '';
        for (let p of args) {
            if (p.startsWith('/')) {
                res = p;
            } else {
                res = res + '/' + p;
            }
            res = res.replace(/\/*$/, '');
        }
        return res;
    }
}
