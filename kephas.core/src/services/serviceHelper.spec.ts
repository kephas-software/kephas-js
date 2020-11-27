import { expect } from 'chai';
import 'mocha';

import { Deferrable, ServiceHelper, AsyncInitializable, Initializable, Context } from '..';

describe('ServiceHelper.initializeAsync', () => {
    it('should call service.initialize()', async () => {
        let called = false;
        let context: Context | undefined = undefined;
        let svc: Initializable = {
            initialize(ctx?: Context) {
                called = true;
                context = ctx;
            }
        }

        const svcContext = {};
        await ServiceHelper.initializeAsync(svc, svcContext);

        expect(called).true;
        expect(context).not.null;
    });

    it('should call service.initializeAsync()', async () => {
        let called = false;
        let context: Context | undefined = undefined;
        let svc: AsyncInitializable = {
            initializeAsync(ctx?: Context) {
                called = true;
                context = ctx;
                let d = new Deferrable();
                d.resolve(null);
                return <Promise<void>>d.promise;
            }
        }

        await ServiceHelper.initializeAsync(svc);

        expect(called).true;
        expect(context).not.null;
    });
});
