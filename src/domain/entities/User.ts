export class User {
  public id?: string;

  constructor(
    public username: string,
    public email: string,
    public password: string,
    id?: string
  ) {
    this.id = id;
  }
}
