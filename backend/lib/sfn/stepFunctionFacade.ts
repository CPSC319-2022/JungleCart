import { ServiceStepFunction, ServiceStepFunctionProps } from "./service-step-function";
import { OrderStepFunctionFlow } from "./ordersSfn";
import { Construct } from "constructs";


export class StepFunctionFacade {

  createStepFunction(scope: Construct, id: string, props: ServiceStepFunctionProps): ServiceStepFunction {
    if (id === "Orders") {
      return new OrderStepFunctionFlow(scope, id, props);
    } else {
      return new OrderStepFunctionFlow(scope, id, props);
    }
  }
}
