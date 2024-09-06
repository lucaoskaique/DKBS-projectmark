import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleService } from 'src/database/drizzle.service';
import { users } from '../database/database-schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.drizzleService.db
      .insert(users)
      .values({
        name: createUserDto.name,
        email: createUserDto.email,
      })
      .returning();

    return createdUser[0];
  }

  async findAll() {
    return await this.drizzleService.db.select().from(users).execute();
  }

  async findOne(id: number) {
    const user = await this.drizzleService.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .execute();

    if (!user[0]) {
      throw new NotFoundException('No users found');
    }

    return user[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.drizzleService.db
      .update(users)
      .set({
        name: updateUserDto.name,
        email: updateUserDto.email,
        role: updateUserDto.role,
      })
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  }

  async remove(id: number) {
    const deletedUser = await this.drizzleService.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return deletedUser;
  }
}
