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
import {
  IElist,
  IElistWithOwnerInfoDTO,
  IUser,
} from '@gcloud-function-api-auth/interfaces';

@Controller('elists')
export class ElistController {
  constructor(private readonly elistService: ElistService) {}

  @Get()
  public async index(): Promise<IElistWithOwnerInfoDTO[]> {
    try {
      return await this.elistService.findAll();
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Get('/:id')
  public async read(@Param('id') id) {
    try {
      return await this.elistService.findOne(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Post()
  public async create(@Body() body: Omit<IElist, 'id'>) {
    console.log('body:', body);
    try {
      return await this.elistService.createOne(body);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Put('/:id')
  public async update(@Param('id') id: string, @Body() body: IElist) {
    console.log('body:', body);

    if (id !== body.id) {
      throw new BadRequestException('id in request body does not match route');
    }

    try {
      const updated = await this.elistService.updateOne(id, body);
      return updated;
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Delete('/:id')
  public async destroy(@Param('id') id: string) {
    try {
      await this.elistService.deleteOne(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }
}
