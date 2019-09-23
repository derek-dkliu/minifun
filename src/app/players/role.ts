export class Role {
  private constructor(private name: string) {}

  static create(name: string): Role {
    return new Role(name);
  }

  getName(): string {
    return this.name;
  }

  equals(role: Role): boolean {
    return this.getName() === role.getName();
  }

  is(name: string): boolean {
    return this.getName() === name;
  }
}
