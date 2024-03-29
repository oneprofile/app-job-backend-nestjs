export class FindJobByIdCommand {
  id: string;
}

export class JobQuery {
  keywords: string[];
  minSalary: number;
  maxSalary: number;

  constructor({
    keywords,
    minSalary,
    maxSalary,
  }: {
    keywords: string[];
    minSalary: number;
    maxSalary: number;
  }) {
    this.keywords = keywords;
    this.minSalary = minSalary;
    this.maxSalary = maxSalary;
  }
}
