import { SingletonAppServiceContract, AppService, Priority } from '@kephas/core';
import jwtDecode from 'jwt-decode';

export interface RawTokenInfo {
    sub?: any;
    iat: number;
    exp: number;
    preferred_username?: string;
}

export interface TokenInfo {
    token?: string;
    subject?: any;
    userName?: string;
    expiresAt?: Date;
    issuedAt?: Date;
}

export interface TokenData {
    userName: string;
    token: string;
    refreshToken: string;
}

/**
 * Service for working with JWT tokens.
 *
 * @export
 * @class TokenService
 */
@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class TokenService {
    private static readonly AuthTokenKey = 'auth-token';
    private _tokenInfo?: TokenInfo;
    private _refreshTokenInfo?: TokenInfo;

    /**
     * Gets a structure containing the token data.
     *
     * @returns {TokenInfo}
     * @memberof TokenService
     */
    public get tokenInfo(): TokenInfo | undefined {
        if (!this._tokenInfo) {
            this._loadTokenData();
        }

        return this._tokenInfo;
    }

    /**
     * Gets a structure containing the refresh token data.
     *
     * @returns {TokenInfo}
     * @memberof TokenService
     */
    public get refreshTokenInfo(): TokenInfo | undefined {
        if (!this._refreshTokenInfo) {
            this._loadTokenData();
        }

        return this._refreshTokenInfo;
    }

    /**
     * Gets or sets the JWT token string of the authenticated user (if any).
     *
     * @returns {string}
     * @memberof TokenService
     */
    public get token(): string | undefined {
        const tokenInfo = this.tokenInfo;
        return tokenInfo && tokenInfo.token;
    }
    public set token(token: string | undefined) {
        if (this._tokenInfo && this._tokenInfo.token === token) {
            return;
        };

        const jwtToken = this.decode(token!);
        this._tokenInfo = jwtToken;
    }

    /**
     * Gets or sets the JWT refresh token string of the authenticated user (if any).
     *
     * @returns {string}
     * @memberof TokenService
     */
    public get refreshToken(): string | undefined {
        const tokenInfo = this.refreshTokenInfo;
        return tokenInfo && tokenInfo.token;
    }
    public set refreshToken(token: string | undefined) {
        if (this._refreshTokenInfo && this._refreshTokenInfo.token === token) {
            return;
        };

        const jwtToken = this.decode(token!);
        this._refreshTokenInfo = jwtToken;
    }

    /**
     * Sets the token data to the local storage.
     *
     * @param {TokenData} tokenData
     * @memberof TokenService
     */
    public setTokenData(tokenData: TokenData) {
        localStorage.setItem(TokenService.AuthTokenKey, JSON.stringify(tokenData));
    }

    /**
     * Clears the token data from the local storage.
     *
     * @memberof TokenService
     */
    public clearTokenData() {
        localStorage.removeItem(TokenService.AuthTokenKey);
    }

    /**
     * Gets a value indicating whether the current token is expired.
     *
     * @readonly
     * @type {boolean}
     * @memberof TokenService
     */
    public get isTokenExpired(): boolean {
        return !this._tokenInfo || this._isExpired(this._tokenInfo);
    }

    /**
     * Decodes the token string and returns the parsed token information.
     *
     * @protected
     * @param {string} token The token string.
     * @returns {TokenInfo} The parsed token information.
     * @memberof TokenService
     */
    protected decode(token: string): TokenInfo {
        if (!token) {
            return {
                expiresAt: new Date(2000, 1),
            }
        }

        const decoded = jwtDecode<RawTokenInfo>(token);
        return {
            token,
            subject: decoded.sub,
            issuedAt: this._toDate(decoded.iat),
            expiresAt: this._toDate(decoded.exp),
        }
    }

    private _loadTokenData() {
        const tokenDataString = localStorage.getItem(TokenService.AuthTokenKey);
        if (tokenDataString) {
            const tokenData: TokenData = JSON.parse(tokenDataString);
            this.token = tokenData && tokenData.token;
            this.refreshToken = tokenData && tokenData.refreshToken;
        }
    }

    private _isExpired(jwtToken: TokenInfo): boolean {
        const expirationDate = jwtToken && jwtToken.expiresAt;
        if (!expirationDate) {
            return false;
        }

        return !(expirationDate.valueOf() > new Date().valueOf());
    }

    private _toDate(seconds: number): Date | undefined {
        if (!seconds) {
            return undefined;
        }

        const date = new Date(0);
        date.setUTCSeconds(seconds);
        return date;
    }
}
