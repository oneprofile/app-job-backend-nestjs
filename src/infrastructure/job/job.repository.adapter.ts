import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { JobDomain } from '../../domain/job/job.domain';
import { JobPort } from '../../domain/job/job.port';
import { fromDomain, JobEntity, toDomain } from './job.entity';
import { JobEntityRepository } from './job.entity.repository';

@Injectable()
export class JobRepositoryAdapter implements JobPort {
  constructor(
    //@InjectRepository(JobEntity)
    private readonly jobEntityRepository: JobEntityRepository,
  ) {}

  public save(job: JobDomain) {
    const entity = fromDomain(job);
    this.jobEntityRepository.save(entity);
    return job;
  }

  public update(id: string, job: JobDomain): JobDomain | void {
    const entity = fromDomain(job);
    this.jobEntityRepository.updateJob(id, entity).then((data) => data);
  }

  public delete(id: string): JobDomain | void {
    this.jobEntityRepository.deleteJob(id).then((data) => data);
  }

  public find(id: string): JobDomain | void {
    this.jobEntityRepository
      .findById(id)
      .then((data) => {
        return toDomain(data);
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  }

  public getAll(): JobDomain[] | void {
    this.jobEntityRepository
      .find()
      .then((data) => {
        const domains = data.map((entity) => toDomain(entity));
        return domains;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  }
}
