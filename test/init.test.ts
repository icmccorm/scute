import {expect} from 'chai';
import Scute from '../src/lang-c/scute-test.js';
import { ScuteTestWrapper } from '../src/worker/ScuteTestWrapper';

var scute: ScuteTestWrapper;
before(() => {
	return new Promise((resolve) => {
		Scute().then((module) => {
			scute = new ScuteTestWrapper(module);
			resolve();
		});
	});
  });

describe("print()", () => {
	it("prints strings successfully", () => {
		scute.compileCode("print('hello!')");
		scute.runCode();
		return true;
	});
});