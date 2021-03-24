import { AppService, SingletonAppServiceContract } from '@kephas/core';
import { Profile, User, UserManager, } from 'oidc-client';
import { BehaviorSubject, concat, from, Observable } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { AuthenticationSettingsProvider } from './authentication.settings';

export type IAuthenticationResult =
  SuccessAuthenticationResult |
  FailureAuthenticationResult |
  RedirectAuthenticationResult;

export interface SuccessAuthenticationResult {
  status: AuthenticationResultStatus.Success;
  state: any;
}

export interface FailureAuthenticationResult {
  status: AuthenticationResultStatus.Fail;
  message: string;
}

export interface RedirectAuthenticationResult {
  status: AuthenticationResultStatus.Redirect;
}

export enum AuthenticationResultStatus {
  Success,
  Redirect,
  Fail
}

export interface IUser extends Profile {
  name?: string;
}

@AppService()
@SingletonAppServiceContract()
export class AuthenticationService {
  private _lastActivityTime?: Date;

  /**
   * Creates an instance of AuthorizeService.
   * @param {AuthenticationSettingsProvider} settingsProvider The settings provider.
   * @memberof AuthorizeService
   */
  constructor(protected readonly settingsProvider: AuthenticationSettingsProvider) {
  }

  protected userManager?: UserManager;
  protected readonly userSubject: BehaviorSubject<IUser | null> = new BehaviorSubject(null as IUser | null);

  /**
   * Gets the time of user's last activity.
   *
   * @readonly
   * @type {(Date | undefined)}
   * @memberof AuthorizeService
   */
  public get lastActivityTime(): Date | undefined {
    return this._lastActivityTime;
  }

  /**
   * Gets an observable indicating whether the user is authenticated.
   *
   * @return {*}  {Observable<boolean>}
   * @memberof AuthorizeService
   */
  public isAuthenticated(): Observable<boolean> {
    return this.getUser().pipe(map(u => !!u));
  }

  /**
   * Gets an observable retrieving the user.
   *
   * @return {*}  {(Observable<IUser | null | undefined>)}
   * @memberof AuthorizeService
   */
  public getUser(): Observable<IUser | null | undefined> {
    return concat(
      this.userSubject.pipe(take(1), filter(u => !!u)),
      this.getUserFromStorage().pipe(filter(u => !!u), tap(u => this.userSubject.next(u!))),
      this.userSubject.asObservable());
  }

  /**
   * Gets an observable containing the access token of the signed-in user.
   *
   * @return {*}  {(Observable<string | undefined>)}
   * @memberof AuthorizeService
   */
  public getAccessToken(): Observable<string | undefined> {
    return from(this.ensureUserManagerInitialized())
      .pipe(mergeMap(() => from(this.userManager!.getUser())),
        map(user => user?.access_token));
  }

  /**
   * Notifies the authorization service that the user is active.
   *
   * @memberof AuthorizeService
   */
  public touch() {
    this._lastActivityTime = new Date();
  }

  /**
   * Sign in the user.
   * We try to authenticate the user in three different ways:
   * 1) We try to see if we can authenticate the user silently. This happens
   *    when the user is already logged in on the IdP and is done using a hidden iframe
   *    on the client.
   * 2) We try to authenticate the user using a PopUp Window. This might fail if there is a
   *    Pop-Up blocker or the user has disabled PopUps.
   * 3) If the two methods above fail, we redirect the browser to the IdP to perform a traditional
   *    redirect flow.
   *
   * @param {*} state
   * @return {*}  {Promise<IAuthenticationResult>}
   * @memberof AuthorizeService
   */
  public async signIn(state: any): Promise<IAuthenticationResult> {
    await this.ensureUserManagerInitialized();
    let user: User | null = null;
    try {
      user = await this.userManager!.signinSilent(this.createArguments());
      this.userSubject.next(user.profile);
      return this.success(state);
    } catch (silentError) {
      // User might not be authenticated, fallback to popup authentication
      console.log('Silent authentication error: ', silentError);

      const popUpDisabled = this.settingsProvider.settings.popUpDisabled;
      try {
        this.ensurePopupEnabled();

        user = await this.userManager!.signinPopup(this.createArguments());
        this.userSubject.next(user.profile);
        return this.success(state);
      } catch (popupError) {
        if (popupError.message === 'Popup window closed') {
          // The user explicitly cancelled the login action by closing an opened popup.
          return this.error('The user closed the window.');
        } else if (!popUpDisabled) {
          console.log('Popup authentication error: ', popupError);
        }

        // PopUps might be blocked by the user, fallback to redirect
        try {
          await this.userManager!.signinRedirect(this.createArguments(state));
          return this.redirect();
        } catch (redirectError) {
          console.log('Redirect authentication error: ', redirectError);
          return this.error(redirectError);
        }
      }
    }
  }

  public async completeSignIn(url: string): Promise<IAuthenticationResult> {
    try {
      await this.ensureUserManagerInitialized();
      const user = await this.userManager!.signinCallback(url);
      this.userSubject.next(user && user.profile);
      return this.success(user && user.state);
    } catch (error) {
      console.log('There was an error signing in: ', error);
      return this.error('There was an error signing in.');
    }
  }

  public async signOut(state: any): Promise<IAuthenticationResult> {
    try {
      this.ensurePopupEnabled();

      await this.ensureUserManagerInitialized();
      await this.userManager!.signoutPopup(this.createArguments());
      this.userSubject.next(null);
      return this.success(state);
    } catch (popupSignOutError) {
      console.log('Popup signout error: ', popupSignOutError);
      try {
        await this.userManager!.signoutRedirect(this.createArguments(state));
        return this.redirect();
      } catch (redirectSignOutError) {
        console.log('Redirect signout error: ', popupSignOutError);
        return this.error(redirectSignOutError);
      }
    }
  }

  public async completeSignOut(url: string): Promise<IAuthenticationResult> {
    await this.ensureUserManagerInitialized();
    try {
      const response = await this.userManager!.signoutCallback(url);
      this.userSubject.next(null);
      return this.success(response && response.state);
    } catch (error) {
      console.log(`There was an error trying to log out '${error}'.`);
      return this.error(error);
    }
  }

  protected async ensureUserManagerInitialized(): Promise<void> {
    if (this.userManager !== undefined) {
      return;
    }

    const authSettings = this.settingsProvider.settings;
    const response = await fetch(authSettings.applicationPaths.ApiAuthorizationClientConfigurationUrl);
    if (!response.ok) {
      throw new Error(`Could not load settings for '${authSettings.identityAppId}'`);
    }

    const settings: any = await response.json();
    settings.automaticSilentRenew = true;
    settings.includeIdTokenInSilentRenew = true;
    this.userManager = new UserManager(settings);

    this.userManager.events.addUserSignedOut(async () => {
      await this.userManager!.removeUser();
      this.userSubject.next(null);
    });
  }

  private ensurePopupEnabled()
  {
    if (this.settingsProvider.settings.popUpDisabled) {
      throw new Error('Popup disabled. Instruct the AuthorizationSettingsProvider service to return false in \'settings.popupDisabled\' to enable it.');
    }
  }

  private createArguments(state?: any): any {
    return { useReplaceToNavigate: true, data: state };
  }

  private error(message: string): IAuthenticationResult {
    return { status: AuthenticationResultStatus.Fail, message };
  }

  private success(state: any): IAuthenticationResult {
    return { status: AuthenticationResultStatus.Success, state };
  }

  private redirect(): IAuthenticationResult {
    return { status: AuthenticationResultStatus.Redirect };
  }

  private getUserFromStorage(): Observable<IUser | undefined> {
    return from(this.ensureUserManagerInitialized())
      .pipe(
        mergeMap(() => this.userManager!.getUser()),
        map(u => u?.profile));
  }
}
