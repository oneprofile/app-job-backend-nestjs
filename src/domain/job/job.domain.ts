export class JobDomain {
  private _id: string;
  private _title: string;
  private _address: string;
  private _salary: string;
  private _contract_type: string;
  private _description: string;
  private _author: string;
  private _created_at: Date;
  private _updated_at: Date;

  constructor({
    id,
    title,
    address,
    salary,
    contract_type,
    author,
    description,
  }: {
    id: string;
    title: string;
    address: string;
    salary: string;
    contract_type: string;
    author: string;
    description: string;
  }) {
    this._id = id;
    this._title = title;
    this._address = address;
    this._salary = salary;
    this._contract_type = contract_type;
    this._author = author;
    this._created_at = new Date();
    this._updated_at = new Date();
    this._description = description;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    this._title = value;
  }

  public get address(): string {
    return this._address;
  }
  public set address(value: string) {
    this._address = value;
  }

  public get salary(): string {
    return this._salary;
  }
  public set salary(value: string) {
    this._salary = value;
  }

  public get contract_type(): string {
    return this._contract_type;
  }
  public set contract_type(value: string) {
    this._contract_type = value;
  }

  public get author(): string {
    return this._author;
  }
  public set author(value: string) {
    this._author = value;
  }

  public get created_at(): Date {
    return this._created_at;
  }
  public set created_at(value: Date) {
    this._created_at = value;
  }

  public get updated_at(): Date {
    return this._updated_at;
  }
  public set updated_at(value: Date) {
    this._updated_at = value;
  }

  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }
}

export const toDomain = (it: Partial<JobDomain>) => {
  return new JobDomain({
    id: it.id,
    title: it.title,
    address: it.address,
    salary: it.salary,
    contract_type: it.contract_type,
    author: it.author,
    description: it.description,
  });
};
