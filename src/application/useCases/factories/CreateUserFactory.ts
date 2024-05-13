import { makeCreateUserCommandHandlerFactory } from "../../commands/factories/CreateUserCommandHandlerFactory";
import { CreateUserUseCaseImpl } from "../implementation/CreateUserUseCaseImpl";

export const makeCreateUserUseCaseFactory = () => {
  return new CreateUserUseCaseImpl(makeCreateUserCommandHandlerFactory());
};
