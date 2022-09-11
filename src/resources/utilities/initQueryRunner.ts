import { Connection, QueryRunner } from 'typeorm';
import { errorCode } from '../constants';
import { CustomError } from './customError';

export enum TransactionLockType {
  UNCOMMITTED = 'READ UNCOMMITTED',
  COMMITED = 'READ COMMITTED',
  REPEATABLE = 'REPEATABLE READ',
  SERIALIZABLE = 'SERIALIZABLE',
}

export interface InitQueryType {
  connect: Connection;
  methods: (query: QueryRunner) => any;
  lock?: TransactionLockType;
  attemts?: number;
  errorMethod?: () => void;
  disableAttemts?: boolean;
}

const transactionError = 'Deadlock';

const transactionAttempts = 5;

export const initQueryRunner = async (data: InitQueryType) => {
  const { connect, methods, lock, errorMethod, disableAttemts } = data;
  const attemts = data?.attemts || transactionAttempts;
  const queryRunner = connect.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction(lock || TransactionLockType.UNCOMMITTED);
  try {
    const data = await methods(queryRunner);
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return data;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    if (
      error.message.includes(transactionError) &&
      (attemts > 1 || disableAttemts)
    ) {
      console.log(transactionError);
      await initQueryRunner({
        ...data,
        attemts: disableAttemts ? attemts : attemts - 1,
      });
    } else if (attemts <= 1) {
      console.log(error);
      throw new CustomError(
        `Something went wrong! Please, try again.`,
        errorCode.deadlock,
      );
    } else {
      if (errorMethod) {
        errorMethod();
      }
      throw error;
    }
  }
};
