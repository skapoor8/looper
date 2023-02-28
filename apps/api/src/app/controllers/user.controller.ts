import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ElistService, UserService } from '@gcloud-function-api-auth/db';
import { IUser, UserRole } from '@gcloud-function-api-auth/interfaces';
import { Public } from '../decorators/public.decorator';
import { Role } from '../decorators/role.decorator';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly elistService: ElistService
  ) {}

  @Role(UserRole.ADMIN)
  @Get()
  public async index() {
    try {
      return await this.userService.findAll();
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  @Get('/:id')
  public async read(@Param('id') id) {
    try {
      return await this.userService.findOne(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  @Get('/uid/:id')
  public async readByUid(@Param('id') id) {
    try {
      return await this.userService.findOneByUid(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  @Role(UserRole.ADMIN)
  @Post()
  public async create(@Body() body: Omit<IUser, 'id'>) {
    console.log('body:', body);
    try {
      await this.userService.createOne(body);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  @Put('/:id')
  public async update(@Param('id') id: string, @Body() body: IUser) {
    console.log('body:', body);

    if (id !== body.id) {
      throw new BadRequestException('id in request body does not match route');
    }

    try {
      const updated = await this.userService.updateOne(id, body);
      return updated;
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  @Delete('/:id')
  public async destroy(@Param('id') id: string) {
    try {
      await this.userService.deleteOne(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  @Get('/:id/elists')
  public async getElists(@Param('id') userId: string) {
    try {
      return await this.elistService.findByOwnerId(userId);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }
}
