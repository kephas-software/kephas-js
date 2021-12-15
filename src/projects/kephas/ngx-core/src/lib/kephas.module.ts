import { Injectable, NgModule } from "@angular/core";
import { CommandProcessorClient } from "@kephas/commands";
import { AbstractType, EventHub, HashingService, Injector, Logger, Type } from "@kephas/core";
import { MessageProcessorClient } from "@kephas/messaging";
import { TypeInfoRegistry } from "@kephas/reflection";
import { NotificationService } from "@kephas/ui";
import { AppSettings } from "./services/appSettings";
import { Configuration } from "./services/configuration";

export function resolveAppService(type: AbstractType | Type<unknown>) {
  Injectable()(type);
  return () => Injector.Instance.resolve(type);
}

@NgModule({
  providers: [
    // core
    {
      provide: Injector,
      useFactory: resolveAppService(Injector),
    },
    {
      provide: Logger,
      useFactory: resolveAppService(Logger),
    },
    {
      provide: HashingService,
      useFactory: resolveAppService(HashingService),
    },
    {
      provide: EventHub,
      useFactory: resolveAppService(EventHub),
    },

    // commands
    {
      provide: CommandProcessorClient,
      useFactory: resolveAppService(CommandProcessorClient),
    },

    // messaging
    {
      provide: MessageProcessorClient,
      useFactory: resolveAppService(MessageProcessorClient),
    },

    // reflection
    {
      provide: TypeInfoRegistry,
      useFactory: resolveAppService(TypeInfoRegistry),
    },

    // ui
    {
      provide: NotificationService,
      useFactory: resolveAppService(NotificationService),
    },

    // ngx-core
    {
      provide: AppSettings,
      useFactory: resolveAppService(AppSettings),
    },
    {
      provide: Configuration,
      useFactory: resolveAppService(Configuration),
    },
  ]
})
export class KephasModule {
}
