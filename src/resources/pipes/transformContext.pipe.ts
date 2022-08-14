import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ipFormat } from '../utilities';

export interface ContextType {
  ip: string;
  id: number;
  token: string;
}

@Injectable()
export class TransformContextPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): ContextType {
    const ip = ipFormat(value['req']['headers']['ip']);
    return {
      ip: ip,
      id: value['req']['id'],
      token: value['req']['token'],
    };
  }
}
