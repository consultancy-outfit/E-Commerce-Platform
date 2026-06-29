import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  create(data: Partial<User>): Promise<UserDocument> {
    return this.repo.create(data);
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.repo.findByEmail(email);
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.repo.findById(id);
  }
}
