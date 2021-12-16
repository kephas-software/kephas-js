import { Injectable, NgModule, Injector } from "@angular/core";
import { CommandProcessorClient } from "@kephas/commands";
import { AbstractType, EventHub, HashingService, Injector as KephasInjector, Logger, Type } from "@kephas/core";
import { MessageProcessorClient } from "@kephas/messaging";
import { TypeInfoRegistry } from "@kephas/reflection";
import { NotificationService } from "@kephas/ui";
import { AppSettings } from "./services/appSettings";
import { Configuration } from "./services/configuration";
import { HttpInterceptingHandler } from "./services/http/httpInterceptingHandler";

export function resolveAppService<T>(type: AbstractType | Type<T>) {
  Injectable()(type);
  return (injector: Injector) => KephasInjector.instance.resolve(type, t => injector.get(t));
}

@NgModule({
  providers: [
    // core
    {
      provide: KephasInjector,
      useFactory: resolveAppService(KephasInjector),
      deps: [Injector]
    },
    {
      provide: Logger,
      useFactory: resolveAppService(Logger),
      deps: [Injector]
    },
    {
      provide: HashingService,
      useFactory: resolveAppService(HashingService),
      deps: [Injector]
    },
    {
      provide: EventHub,
      useFactory: resolveAppService(EventHub),
      deps: [Injector]
    },

    // commands
    {
      provide: CommandProcessorClient,
      useFactory: resolveAppService(CommandProcessorClient),
      deps: [Injector]
    },

    // messaging
    {
      provide: MessageProcessorClient,
      useFactory: resolveAppService(MessageProcessorClient),
      deps: [Injector]
    },

    // reflection
    {
      provide: TypeInfoRegistry,
      useFactory: resolveAppService(TypeInfoRegistry),
      deps: [Injector]
    },

    // ui
    {
      provide: NotificationService,
      useFactory: resolveAppService(NotificationService),
      deps: [Injector]
    },

    // ngx-core
    {
      provide: AppSettings,
      useFactory: resolveAppService(AppSettings),
      deps: [Injector]
    },
    {
      provide: Configuration,
      useFactory: resolveAppService(Configuration),
      deps: [Injector]
    },
    HttpInterceptingHandler,
  ]
})
export class KephasModule {
}
