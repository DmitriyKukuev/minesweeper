import {numberPadStart} from '@/helper/common.ts';

export default class Timer {
    protected timestamp = 0;
    protected intervalId = 0;
    protected tick = 10;

    protected get dateObject(): Date {
        return new Date(this.timestamp);
    }

    public start(): void {
        this.timestamp = 0;

        this.intervalId = setInterval(() => {
            this.timestamp += this.tick;
        }, this.tick);
    }

    public stop(): void {
        clearInterval(this.intervalId);
    }

    public reboot(): void {
        this.timestamp = 0;
        clearInterval(this.intervalId);
    }

    public toString(): string {
        const dateObject = this.dateObject;

        const mm = numberPadStart(dateObject.getMinutes());
        const ss = numberPadStart(dateObject.getSeconds());
        const ms = numberPadStart(dateObject.getMilliseconds() / this.tick);

        return `${mm}:${ss}:${ms}`;
    }
}
