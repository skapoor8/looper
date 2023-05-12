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
import {
  ElistService,
  UserService,
  SubscriptionService,
} from '@gcloud-function-api-auth/db';
import {
  IElist,
  IElistWithOwnerInfoDTO,
  IUser,
} from '@gcloud-function-api-auth/interfaces';
import { Public } from '../decorators/public.decorator';

@Controller('elists')
export class ElistController {
  constructor(
    private readonly elistService: ElistService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  @Get()
  public async index(): Promise<IElistWithOwnerInfoDTO[]> {
    try {
      return await this.elistService.findAll();
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Public()
  @Get('/:id')
  public async read(@Param('id') id) {
    try {
      return await this.elistService.findOne(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Get('/:id/subscriptions')
  public async getSubscriptions(@Param('id') elistId: string) {
    try {
      return await this.subscriptionService.findByElistId(elistId);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  @Post()
  public async create(@Body() body: Omit<IElist, 'id'>) {
    try {
      return await this.elistService.createOne(body);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Put('/:id')
  public async update(@Param('id') id: string, @Body() body: IElist) {
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
