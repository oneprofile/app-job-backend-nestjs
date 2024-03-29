import { Given, Then, When } from '@cucumber/cucumber';
import { After, Before } from '@cucumber/cucumber';
import { ConfigModule } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { expect } from 'chai';

import { JobComponentModule } from '../../../src/modules/job.component.module';

import backendConfig from '../../../src/environment/backend.config';
import { TestDatabaseModule } from '../../modules/test.database.module';
import { getConnection } from 'typeorm';
import { fromDomain } from '../../../src/infrastructure/job/job.entity';

Before(async function () {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [backendConfig],
      }),
      TestDatabaseModule,
      JobComponentModule,
    ],
  }).compile();

  this.app = moduleFixture.createNestApplication();
  await this.app.init();

  this.dbConnect = getConnection('test-default');
});

After(async function () {
  const entities = this.dbConnect.entityMetadatas;

  for (const entity of entities) {
    const repository = this.dbConnect.getRepository(entity.name);
    await repository.clear();
  }

  this.dbConnect.close();
});

Given('a user job with details as shown in the table', function (dataTable) {
  this.job = dataTable.rowsHash();
});

When('the user posts the job', async function () {
  await request(this.app.getHttpServer())
    .post('/jobs')
    .send(this.job)
    .expect(HttpStatus.CREATED)
    .then((res) => {
      this.result = res.body;
    });
});

Then('The job is created as shown in the table', function (dataTable) {
  this.expectedJob = dataTable.rowsHash();
  expect(this.result.job.title).to.eql(this.expectedJob.title);
  expect(this.result.job.company).to.eql(this.expectedJob.company);
  expect(this.result.job.salary).to.eql(this.expectedJob.salary);
  expect(this.result.job.description).to.eql(this.expectedJob.description);
});

Then('a message <message> is shown', function (dataTable) {
  const expectedMessage = dataTable.rowsHash()['message'];
  const message = this.result['message'];
  expect(message).to.eql(expectedMessage);
});

Given('an existing job with details as followed', function (dataTable) {
  this.job = dataTable.rowsHash();
  const entity = fromDomain(this.job);
  entity.created_at = new Date();
  entity.updated_at = new Date();
  const repository = this.dbConnect.getRepository(entity.constructor.name);
  repository.save(entity);
});

When(
  'The user updates a few attributes of the job identified by id as shown',
  async function (dataTable) {
    this.partialJob = dataTable.rowsHash();
    await request(this.app.getHttpServer())
      .put('/jobs/' + this.partialJob.id)
      .send(this.partialJob)
      .expect(HttpStatus.OK)
      .then((res) => {
        this.result = res.body;
      });
  },
);

Then('The job is modified as followed', function (dataTable) {
  this.expectedJob = dataTable.rowsHash();
  expect(this.result.job.title).to.eql(this.expectedJob.title);
  expect(this.result.job.company).to.eql(this.expectedJob.company);
  expect(this.result.job.salary).to.eql(this.expectedJob.salary);
  expect(this.result.job.description).to.eql(this.expectedJob.description);
});

When('The user deletes the job identified by id as below', async function (dataTable) {
  const job = dataTable.rowsHash();
  await request(this.app.getHttpServer())
    .delete('/jobs/' + job.id)
    .send()
    .expect(HttpStatus.OK)
    .then((res) => {
      this.result = res.body;
    });
});

Then('The job identified by id as below is deleted', async function (dataTable) {
  const job = dataTable.rowsHash();
  const entity = fromDomain(this.job);
  const repository = this.dbConnect.getRepository(entity.constructor.name);
  const result = await repository.findOne(job.id);
  expect(result).to.eql(undefined);
});

When('The user opens the job identified by id as below for details', async function (dataTable) {
  const job = dataTable.rowsHash();
  await request(this.app.getHttpServer())
    .get('/jobs/' + job.id)
    .send()
    .expect(HttpStatus.FOUND)
    .then((res) => {
      this.result = res.body;
    });
});

Then('The job detail is displayed as followed', function (dataTable) {
  this.expectedJob = dataTable.rowsHash();
  expect(this.result.title).to.eql(this.expectedJob.title);
  expect(this.result.company).to.eql(this.expectedJob.company);
  expect('' + this.result.salary).to.eql(this.expectedJob.salary);
  expect(this.result.description).to.eql(this.expectedJob.description);
});

Given('The existing jobs as followed', function (dataTable) {
  const repository = this.dbConnect.getRepository('JobEntity');
  const jobs = dataTable.hashes().map((job) => {
    const entity = fromDomain(job);
    entity.created_at = new Date();
    entity.updated_at = new Date();
    return entity;
  });
  repository.save(jobs);
});

When('The user lists all jobs', async function () {
  await request(this.app.getHttpServer())
    .get('/jobs')
    .send()
    .expect(HttpStatus.OK)
    .then((res) => {
      this.result = res.body;
    });
});

Then('All jobs appear in the list as followed:', function (dataTable) {
  const expectedJobs = dataTable.hashes().map((job) => {
    job.salary = +job.salary;
    return job;
  });
  // ignore dates in comparison
  const actualJobs = this.result.map((job) => {
    delete job.created_at;
    delete job.updated_at;
    delete job.matched;
    return job;
  });
  expect(actualJobs).to.eql(expectedJobs);
});

When('The user searches jobs with keywords as below', async function (dataTable) {
  const keywords = dataTable.rowsHash().keywords;
  await request(this.app.getHttpServer())
    .get('/jobs?keywords=' + keywords)
    .send()
    .expect(HttpStatus.OK)
    .then((res) => {
      this.result = res.body;
    });
});

Then('All jobs appear in the list by matched order as followed :', function (dataTable) {
  const expectedJobs = dataTable.hashes().map((job) => {
    job.salary = +job.salary;
    job.matched = +job.matched;
    return job;
  });
  // ignore dates in comparison
  const actualJobs = this.result.map((job) => {
    delete job.created_at;
    delete job.updated_at;
    return job;
  });

  expect(this.result.length).to.eql(expectedJobs.length);
  expect(actualJobs).to.eql(expectedJobs);
});
