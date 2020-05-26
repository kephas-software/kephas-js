import { expect } from 'chai';
import 'mocha';

import { LogLevel, Logger, AppServiceInfoRegistry } from '..';

class TestLogger extends Logger {
    content: string = '';
    log(level: LogLevel, exception: Error | null, messageFormat: string, ...args: any[]): void {
        if(!exception) {
            this.content = this.content + `${level},${messageFormat}\n`;
        }
    }
}

describe('Logger.fatal', () => {
    it('should set log level to fatal', () => {
        let logger = new TestLogger();
        logger.fatal('message');
        const result = logger.content;
        expect(result).to.equal('0,message\n');
    });
});

describe('Logger.composition', () => {
    it('should be registered', () => {
        expect(AppServiceInfoRegistry.Instance.isServiceContract(Logger)).is.true;
        expect(AppServiceInfoRegistry.Instance.isService(Logger)).is.true;
    });
});
