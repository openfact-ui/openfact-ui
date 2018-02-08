import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CnUserName } from './user/cn-user-name.pipe';

@NgModule({
  imports: [
    HttpModule
  ],
  declarations: [
    CnUserName
  ],
  exports: [
    CnUserName
  ]
})
export class LoginModule {
  // static forRoot(providedLoader: any = {
  //   provide: TranslateLoader,
  //   useFactory: translateLoaderFactory,
  //   deps: [Http]
  // }): ModuleWithProviders {
  //   return {
  //     ngModule: WidgetsModule,
  //     providers: [
  //       providedLoader,
  //       TranslateService,
  //       { provide: TranslateParser, useClass: DefaultTranslateParser }
  //     ]
  //   };
  // }
}
