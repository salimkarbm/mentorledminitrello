import { PartialType } from '@nestjs/mapped-types';
import { LoggedInUser } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(LoggedInUser) {}
