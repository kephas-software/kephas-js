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
    static initializeAsync(service: { [key: string]: any }, context?: Context): Promise<void> {
        if (service.initializeAsync) {
            return service.initializeAsync(context);
        }

        var deferrable = new Deferrable();

        if (service.initialize) {
            deferrable.resolve(true);
            service.initialize(context);
        }
        else {
            deferrable.resolve(false);
        }

        return <Promise<void>>deferrable.promise;
    }
}