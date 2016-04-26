import $ from "jquery";
import _ from "lodash";
import {Origin} from "aurelia-metadata";
import {bootstrap as webpackBootstrap} from "aurelia-bootstrapper-webpack";
import {TaskQueue} from "aurelia-framework";

export class ComponentTester {

  resources = [];
  html;
  bindingContext;
  element;
  container;
  viewModel;
  view;
  config;

  static load(config) {
    let componentTester = new ComponentTester(config);
    return componentTester
      .start()
      .then(()=> Promise.resolve(componentTester));
  }

  constructor(config) {
    this.config = config;
    this.html = config.markup;
    this.bindingContext = {};
  }

  configure(aurelia) {
    aurelia.use.standardConfiguration();

    if (this.config.type) {
      this.resources = _.isFunction(this.config.type) ? Origin.get(this.config.type).moduleId : this.config.type;
    }
    if (this.config.mocks) {
      this.config.mocks(this.container);
    }
    if (this.config.setupBindingContext) {
      this.config.setupBindingContext(this.bindingContext, this.container);
    }
  }

  flushTaskQueues() {
    let queue = this.container.get(TaskQueue);
    queue.flushTaskQueue();
    queue.flushMicroTaskQueue();
  }

  dispose(done) {
    this.element.au.controller.unbind();
    this.element.au.controller.detached();
    this.element.au.controller.view.removeNodes();
    this.element.remove();

    if (done) {
      done();
    }
  }

  createView(aurelia) {
    let host = document.createElement('div');
    host.innerHTML = this.html;

    document.body.appendChild(host);
    aurelia.enhance(this.bindingContext, host);

    this.element = host.firstElementChild;
    this.$el = $(this.element);
    this.viewModel = this.element.au.controller.viewModel;
    this.view = this.element.au.controller.view;
    this.flushTaskQueues();
  }

  start() {
    return webpackBootstrap(aurelia => {
      this.container = aurelia.container;
      return Promise.resolve(this.configure(aurelia)).then(() => {
        aurelia.use.globalResources(this.resources);
        return aurelia.start().then(()=>this.createView(aurelia));
      });
    });
  }
}