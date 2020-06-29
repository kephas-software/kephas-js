import { Context, Deferrable } from "..";

/**
 * Helper class for working with services.
 *
 * @export
 * @class ServiceHelper
 */
export class ServiceHelper {
    /**
     * Initializes the service asynchronously, provided it implements either the
     * Initializable or AsyncInitializable interfaces.
     *
     * @static
     * @param {{ [key: string]: any }} service
     * @param {Context} [context] The context to pass to the initialization method.
     * @returns {Promise<void>} A promise returning the asynchronous result.
     * @memberof ServiceHelper
     */
    static InitializeAsync(service: { [key: string]: any }, context?: Context): Promise<void> {
        if (service.InitializeAsync) {
            return service.InitializeAsync(context);
        }

        var deferrable = new Deferrable();

        if (service.Initialize) {
            deferrable.resolve(true);
            service.Initialize(context);
        }
        else {
            deferrable.resolve(false);
        }

        return <Promise<void>>deferrable.promise;
    }
}