import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginMenuComponent } from './login-menu/login-menu.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthenticationSettingsProvider } from './authentication.settings';
import { AppIdProvider } from './appIdProvider.service';
import { resolveAppService } from '@kephas/ngx-core';
import { AuthenticationService } from './authentication.service';
import { AuthorizeGuard } from './authorize.guard';
import { AuthorizeInterceptor } from './authorize.interceptor';

const applicationPaths = AuthenticationSettingsProvider.instance.settings.applicationPaths;

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(
      [
        { path: applicationPaths.Register, component: LoginComponent },
        { path: applicationPaths.Profile, component: LoginComponent },
        { path: applicationPaths.Login, component: LoginComponent },
        { path: applicationPaths.LoginFailed, component: LoginComponent },
        { path: applicationPaths.LoginCallback, component: LoginComponent },
        { path: applicationPaths.LogOut, component: LogoutComponent },
        { path: applicationPaths.LoggedOut, component: LogoutComponent },
        { path: applicationPaths.LogOutCallback, component: LogoutComponent }
      ]
    )
  ],
  declarations: [LoginMenuComponent, LoginComponent, LogoutComponent],
  exports: [LoginMenuComponent, LoginComponent, LogoutComponent],
  providers: [
    {
      provide: AppIdProvider,
      useFactory: resolveAppService(AppIdProvider),
      deps: [Injector]
    },
    AuthenticationSettingsProvider,
    AuthenticationService,
    AuthorizeGuard,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthorizeInterceptor,
     }
  ]
})
export class OidcModule { }
