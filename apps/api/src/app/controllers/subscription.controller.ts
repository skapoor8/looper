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
import { SubscriptionService, UserService } from '@gcloud-function-api-auth/db';
import { ISubscription, IUser } from '@gcloud-function-api-auth/interfaces';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  public async index() {
    try {
      return await this.subscriptionService.findAll();
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Get('/:id')
  public async read(@Param('id') id) {
    try {
      return await this.subscriptionService.findOne(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Post()
  public async create(@Body() body: Omit<ISubscription, 'id'>) {
    console.log('body:', body);
    try {
      return await this.subscriptionService.createOne(body);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Put('/:id')
  public async update(@Param('id') id: string, @Body() body: ISubscription) {
    console.log('body:', body);

    if (id !== body.id) {
      throw new BadRequestException('id in request body does not match route');
    }

    try {
      const updated = await this.subscriptionService.updateOne(id, body);
      return updated;
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Delete('/:id')
  public async destroy(@Param('id') id: string) {
    try {
      await this.subscriptionService.deleteOne(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }
}
