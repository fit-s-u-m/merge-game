/** Pause the code for a certain amount of time, in seconds */
export function waitFor(delayInSecs = 1): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), delayInSecs * 1000);
	});
}

type AsyncQueueFn = () => Promise<void>;

export class AsyncQueue {
	/** Queue of async functions that will be executed one after another */
	private readonly queue: AsyncQueueFn[] = [];
	/** Check if processing is paused */
	private paused = false;
	/** Check if processing has been started and queue is not empty */
	private processing = false;

	/** Pause the execution queue */
	public pause() {
		this.paused = true;
	}

	/** Resume the execution queue */
	public resume() {
		this.paused = false;
	}

	/** Check if the queue is processing */
	public isProcessing() {
		return this.processing;
	}

	/** Check if the execution is paused */
	public isPaused() {
		return this.processing;
	}

	public async add(fn: AsyncQueueFn, autoStart = true) {
		this.queue.push(fn);
		if (autoStart) await this.process();
	}

	/** Run the execution queue one by one, awaiting each other. */
	public async process() {
		if (this.processing) return;
		this.processing = true;
		while (this.queue.length) {
			if (this.paused) {
				await waitFor(0.1);
			} else {
				const fn = this.queue.shift();
				if (fn) await fn();
			}
		}
		this.processing = false;
	}

	/** Stop processing and remove all remaining functions in the queue. */
	public clear() {
		this.queue.length = 0;
		this.processing = false;
		this.paused = false;
	}
}
