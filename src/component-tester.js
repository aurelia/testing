import {bootstrap} from 'aurelia-bootstrapper';

export const StageComponent = {
  withResources(resources): ComponentTester {
    return new ComponentTester().withResources(resources);
  }
};

export class ComponentTester {
  _html: string;
  _resources: string | string[] = [];
  _bindingContext: any;
  element;

  withResources(resources): ComponentTester {
    this._resources = resources;
    return this;
  }

  inView(html): ComponentTester {
    this._html = html;
    return this;
  }

  boundTo(bindingContext): ComponentTester {
    this._bindingContext = bindingContext;
    return this;
  }

  create(): Promise<void> {
    return bootstrap(aurelia => {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .globalResources(this._resources);

      return aurelia.start().then(a => {
        let host = document.createElement('div');
        host.innerHTML = this._html;

        document.body.appendChild(host);
        aurelia.enhance(this._bindingContext, host);

        this.element = host.firstElementChild;
      });
    });
  }
}
