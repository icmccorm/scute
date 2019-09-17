declare module "worker-loader!*" {
	class WebWorker extends Worker {
	  constructor();
	  interpreter: any;
	  init: Function;
	}
	export default WebWorker;
  }