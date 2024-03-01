import { Repository } from 'typeorm';
// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    find: jest.fn((entity) => [entity]),
    create: jest.fn((entity) => entity),
    // Add more mock methods as needed
  }),
);

export type MockType<T> = {
  [P in keyof T]: jest.Mock<object>;
};
