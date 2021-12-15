import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginMenuComponent } from './login-menu/login-menu.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthenticationSettingsProvider } from './authentication.settings';
import { AppIdProvider } from './appIdProvider.service';
import { resolveAppService } from '@kephas/ngx-core';

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
  ]
})
export class OidcModule { }
