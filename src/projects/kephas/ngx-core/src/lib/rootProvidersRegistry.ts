import { XhrFactory } from '@angular/common';
import { HttpClient, HttpHandler, HttpXhrBackend, HttpBackend } from '@angular/common/http';
import { Injectable, Injector, StaticClassProvider } from '@angular/core';
import { AppServiceInfo, AppServiceInfoRegistry, AppServiceMetadata, Expando, Type } from '@kephas/core';
import { NgTarget } from './angularTarget';
import { BrowserXhrFactory } from "./services/http/browserXhrFactory";
import { HttpInterceptingHandler } from './services/http/httpInterceptingHandler';

/**
* Registry for root services.
*
* @export
* @class RootProvidersRegistry
*/

export class RootProvidersRegistry {
  static #providers: StaticClassProvider[] = [
    { provide: HttpClient, useClass: HttpClient, deps: [HttpHandler] },
    { provide: HttpHandler, useClass: HttpInterceptingHandler, deps: [HttpBackend, Injector] },
    { provide: HttpBackend, useClass: HttpXhrBackend, deps: [XhrFactory] },
    { provide: HttpXhrBackend, useClass: HttpXhrBackend, deps: [XhrFactory] },
    { provide: XhrFactory, useClass: BrowserXhrFactory, deps: [] },
  ];

  /**
   * Gets the providers for the HTTP client.
   *
   * @returns {((StaticClassProvider | ExistingProvider)[])}
   * @memberof HttpClientAppServiceInfoRegistry
   */
  public static getRootProviders(serviceRegistry: AppServiceInfoRegistry): (StaticClassProvider)[] {
    const providers: (StaticClassProvider)[] = [];
    for (const c of serviceRegistry.serviceContracts) {
      const serviceContract: AppServiceInfo = c;
      if ((c as Expando).target === NgTarget) {
        Injectable()(serviceContract.contractType);
        for (const m of serviceContract.services) {
          const serviceMetadata: AppServiceMetadata<any> = m;
          Injectable()(serviceMetadata.serviceType!);
          providers.push({
            provide: serviceContract.contractToken || serviceContract.contractType,
            useClass: serviceMetadata.serviceType!,
            multi: serviceContract.allowMultiple,
            deps: RootProvidersRegistry.getDependencies(serviceMetadata.serviceType!),
          });
        }
      }
    }

    providers.push(...RootProvidersRegistry.#providers);

    return providers;
  }

  private static getDependencies(serviceType: Type<any>): any[] {
    let deps = Reflect.getMetadata('design:paramtypes', serviceType);
    if (!deps && serviceType.ctorParameters) {
      deps = serviceType.ctorParameters();
    }

    return deps || [];
  }
}
