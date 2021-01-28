import { AppService, Priority, SingletonAppServiceContract } from '@kephas/core';

export const ReturnUrlType = 'returnUrl';

export const QueryParameterNames = {
  ReturnUrl: ReturnUrlType,
  Message: 'message'
};

export const LogoutActions = {
  LogoutCallback: 'logout-callback',
  Logout: 'logout',
  LoggedOut: 'logged-out'
};

export const LoginActions = {
  Login: 'login',
  LoginCallback: 'login-callback',
  LoginFailed: 'login-failed',
  Profile: 'profile',
  Register: 'register'
};

export interface ApplicationPathsType {
  readonly DefaultLoginRedirectPath: string;
  readonly ApiAuthorizationClientConfigurationUrl: string;
  readonly Login: string;
  readonly LoginFailed: string;
  readonly LoginCallback: string;
  readonly Register: string;
  readonly Profile: string;
  readonly LogOut: string;
  readonly LoggedOut: string;
  readonly LogOutCallback: string;
  readonly LoginPathComponents: string [];
  readonly LoginFailedPathComponents: string [];
  readonly LoginCallbackPathComponents: string [];
  readonly RegisterPathComponents: string [];
  readonly ProfilePathComponents: string [];
  readonly LogOutPathComponents: string [];
  readonly LoggedOutPathComponents: string [];
  readonly LogOutCallbackPathComponents: string [];
  readonly IdentityRegisterPath: string;
  readonly IdentityManagePath: string;
}

export interface ActivitySettingsType {
  /**
   * The maximum idle time (seconds) until an automatic disconnect happens.
   * Do not set if the automatic disconnect should not be triggered.
   *
   * @type {number}
   * @memberof ActivitySettingsType
   */
  readonly MaxIdleSeconds?: number;
}

export interface AuthorizationSettings {
  readonly applicationName: string;
  readonly returnUrl: string;
  readonly applicationPaths: ApplicationPathsType;
  readonly activity: ActivitySettingsType;
  popUpDisabled: boolean;
}

@AppService({ overridePriority: Priority.Lowest })
@SingletonAppServiceContract()
export class AuthorizationSettingsProvider {

  readonly settings: AuthorizationSettings;

  /**
   * Initializes a new instance of the AuthorizationSettingsProvider class.
   */
  constructor(appName?: string) {
    this.settings = this.getSettings(appName ?? '[TODO-APP-NAME]')
  }

  protected getSettings(appName: string): AuthorizationSettings {
    let applicationPaths: ApplicationPathsType = {
      DefaultLoginRedirectPath: '/',
      ApiAuthorizationClientConfigurationUrl: `/_configuration/${appName}`,
      Login: `authentication/${LoginActions.Login}`,
      LoginFailed: `authentication/${LoginActions.LoginFailed}`,
      LoginCallback: `authentication/${LoginActions.LoginCallback}`,
      Register: `authentication/${LoginActions.Register}`,
      Profile: `authentication/${LoginActions.Profile}`,
      LogOut: `authentication/${LogoutActions.Logout}`,
      LoggedOut: `authentication/${LogoutActions.LoggedOut}`,
      LogOutCallback: `authentication/${LogoutActions.LogoutCallback}`,
      LoginPathComponents: [],
      LoginFailedPathComponents: [],
      LoginCallbackPathComponents: [],
      RegisterPathComponents: [],
      ProfilePathComponents: [],
      LogOutPathComponents: [],
      LoggedOutPathComponents: [],
      LogOutCallbackPathComponents: [],
      IdentityRegisterPath: '/Identity/Account/Register',
      IdentityManagePath: '/Identity/Account/Manage'
    };

    applicationPaths = {
      ...applicationPaths,
      LoginPathComponents: applicationPaths.Login.split('/'),
      LoginFailedPathComponents: applicationPaths.LoginFailed.split('/'),
      RegisterPathComponents: applicationPaths.Register.split('/'),
      ProfilePathComponents: applicationPaths.Profile.split('/'),
      LogOutPathComponents: applicationPaths.LogOut.split('/'),
      LoggedOutPathComponents: applicationPaths.LoggedOut.split('/'),
      LogOutCallbackPathComponents: applicationPaths.LogOutCallback.split('/')
    };

    let activity: ActivitySettingsType = {
    };

    return {
      applicationName: appName,
      returnUrl: ReturnUrlType,
      applicationPaths: applicationPaths,
      activity: activity,
      // By default pop ups are disabled because they don't work properly on Edge.
      // If you want to enable pop up authentication simply set this flag to false.
      popUpDisabled: true,
    }
  }
}
