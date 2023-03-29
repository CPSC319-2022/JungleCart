import { ServiceStepFunction, ServiceStepFunctionProps } from "./service-step-function";
import { OrderStepFunctionFlow } from "./ordersSfn";
import { Construct } from "constructs";

export class StepFunctionFacade {
  createStepFunction(scope: Construct, id: string, props: ServiceStepFunctionProps): ServiceStepFunction {
    if (id === "OrdersStepFunction") {
      return new OrderStepFunctionFlow(scope, id, props);
    } else {
      throw new Error(`no step function with $id} exists`);
    }
  }
}
