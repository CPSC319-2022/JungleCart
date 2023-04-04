import {
  ServiceStepFunction,
  ServiceStepFunctionProps,
} from '../service-step-function';
import { OrderFetchSfn } from './OrderFetchSfn';
import { Construct } from 'constructs';
import { OrdersSfn } from './OrdersSfn';
import { OrderUpdateSfn } from './OrderUpdateSfn';

export class StepFunctionFacade {
  createStepFunction(
    scope: Construct,
    id: string,
    props: ServiceStepFunctionProps
  ): ServiceStepFunction {
    switch (id) {
      case 'OrderFetchSfn':
        return new OrderFetchSfn(scope, id, props);
      case 'OrdersSfn':
        return new OrdersSfn(scope, id, props);
      case 'OrderUpdateSfn':
        return new OrderUpdateSfn(scope, id, props);
      default:
        throw new Error(`no step function with $id} exists`);
    }
  }
}
