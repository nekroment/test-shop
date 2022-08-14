import { isNull } from 'lodash';
import * as speakeasy from 'speakeasy';

enum QrLevelType {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H',
}

interface QrParams {
  width: number;
  height: number;
  level: QrLevelType;
}

export class GoogleAuthenticator {
  static _codeLength = 6;

  static tfaCode(value: string): string {
    return `TestShop_${value}`;
  }

  static verifyCode(secret: string, code: string): boolean {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: code,
    });
  }

  static createSecret(user_name: string, secret_length = 10): string {
    const secret = speakeasy.generateSecret({
      name: this.tfaCode(user_name),
      length: secret_length,
    });
    return secret.base32;
  }

  static getQRCodeGoogleUrl(
    name: string,
    secret: string,
    title = null,
    params?: QrParams,
  ): string {
    const width = params ? (params.width > 0 ? params.width : 200) : 200;
    const height = params ? (params.height > 0 ? params.height : 200) : 200;
    const level = params ? params.level : QrLevelType.M;
    let urlencoded = encodeURI(`otpauth://totp/${name}?secret=${secret}`);
    if (!isNull(title)) {
      urlencoded += encodeURI(`&issuer=${encodeURI(title)}`);
    }
    return `https://chart.googleapis.com/chart?chs=${width}x${height}&chld=${level}|1&cht=qr&chl=${urlencoded}`;
  }
}
