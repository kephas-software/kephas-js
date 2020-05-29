import { expect } from 'chai';
import 'mocha';

import { LogLevel, Logger, AppServiceInfoRegistry, AppService } from '..';

describe('Logger.log', () => {
    class TestLogger extends Logger {
        content: string = '';
        protected write(level: LogLevel, exception: Error | null | undefined, messageFormat: string, args: any[]): void {
            if (!exception) {
                this.content = this.content + `${LogLevel[level]},${messageFormat}\n`;
            }
        }
    }

    it('should write as fatal', () => {
        let logger = new TestLogger();
        logger.fatal('message');
        const result = logger.content;
        expect(result).to.equal('Fatal,message\n');
    });

    it('should write as error', () => {
        let logger = new TestLogger();
        logger.error('message');
        const result = logger.content;
        expect(result).to.equal('Error,message\n');
    });

    it('should write as warning', () => {
        let logger = new TestLogger();
        logger.warn('message');
        const result = logger.content;
        expect(result).to.equal('Warning,message\n');
    });

    it('should write as info', () => {
        let logger = new TestLogger();
        logger.info('message');
        const result = logger.content;
        expect(result).to.equal('Info,message\n');
    });

    it('should write as debug', () => {
        let logger = new TestLogger();
        logger.setLevel(LogLevel.Debug);
        logger.debug('message');
        const result = logger.content;
        expect(result).to.equal('Debug,message\n');
    });

    it('should write as trace', () => {
        let logger = new TestLogger();
        logger.setLevel(LogLevel.Trace);
        logger.trace('message');
        const result = logger.content;
        expect(result).to.equal('Trace,message\n');
    });
});

describe('Logger.composition', () => {
    it('should be registered', () => {
        expect(AppServiceInfoRegistry.Instance.isServiceContract(Logger)).is.true;
        expect(AppServiceInfoRegistry.Instance.isService(Logger)).is.true;
    });

    it('should be able to overwrite', () => {
        @AppService()
        class TestLogger extends Logger {
        }

        expect(AppServiceInfoRegistry.Instance.isServiceContract(Logger)).is.true;
        expect(AppServiceInfoRegistry.Instance.isService(TestLogger)).is.true;
    });
});
