import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';

import { errorCode, globalErrors } from 'src/resources/constants/messages';
import {
  CustomError,
  getAccessToken,
  getFormatDate,
  GoogleAuthenticator,
  SaveUser,
} from 'src/resources';
import { Users } from 'src/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async toggleTfa(id: number): Promise<void> {
    await this.usersRepository
      .createQueryBuilder('user')
      .update()
      .set({
        tfa_enabled: () => '!tfa_enabled',
      })
      .where(`id = ${id}`)
      .execute();
  }

  async checkUserReauthorization(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        reauthorization: true,
      },
    });
    if (user) {
      throw new CustomError(globalErrors.passwordEmailUpdate, errorCode.login);
    }
  }

  async findUserById(id: number): Promise<Users> {
    return await this.usersRepository.findOne({
      where: {
        id,
        account_status: true,
      },
    });
  }

  async checkUserExist(
    email: string,
    message = globalErrors.incorrectUser,
    exist = false,
  ): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
        account_status: true,
      },
    });
    const check = exist ? user : !user;
    if (check) {
      throw new CustomError(message, errorCode.user);
    }
    return user;
  }

  async saveUser(data: SaveUser): Promise<void> {
    const { first_name, last_name, email, password, ip } = data;
    const password_hash = getAccessToken(password);
    const registration_datetime = getFormatDate();
    const secret = GoogleAuthenticator.createSecret(
      `${first_name} ${last_name}`,
    );
    const user = this.usersRepository.create({
      first_name,
      last_name,
      email,
      password_hash,
      registration_datetime,
      registration_ip: ip,
      tfa_key: secret,
    });
    await this.usersRepository.save(user);
  }

  async userFailedLogin(
    user_id: number,
    failed: number,
  ): Promise<UpdateResult> {
    return await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({
        failed_logins: () => `failed_logins + 1`,
        last_failed_login: failed,
      })
      .where(`user_id = ${user_id}`)
      .execute();
  }

  async updateLoginInfo(id: number): Promise<void> {
    const last_logged = getFormatDate();
    await this.usersRepository
      .createQueryBuilder('user')
      .update()
      .set({
        last_logged_in: last_logged,
        failed_logins: 0,
        reauthorization: false,
      })
      .where(`id = ${id}`)
      .execute();
  }
}
