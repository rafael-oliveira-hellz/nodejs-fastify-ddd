import { CreateUserCommandHandler } from "../handlers/CreateUserCommandHandler";

export const makeCreateUserCommandHandlerFactory = () => {
  return new CreateUserCommandHandler();
};
