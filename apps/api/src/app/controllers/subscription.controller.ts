import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SubscriptionService, UserService } from '@gcloud-function-api-auth/db';
import {
  ISubscription,
  ISubscriptionWithElistInfoDTO,
  IUser,
} from '@gcloud-function-api-auth/interfaces';
import { Public } from '../decorators/public.decorator';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  public async index(
    @Query('email') email: string
  ): Promise<ISubscriptionWithElistInfoDTO[]> {
    try {
      return (await this.subscriptionService.findAll(
        email ? { email } : undefined
      )) as unknown as Promise<ISubscriptionWithElistInfoDTO[]>;
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Public()
  @Get('/:id')
  public async read(@Param('id') id) {
    try {
      return await this.subscriptionService.findOne(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Public()
  @Post()
  public async create(@Body() body: Omit<ISubscription, 'id'>) {
    try {
      return await this.subscriptionService.createOne(body);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Public()
  @Put('/:id')
  public async update(@Param('id') id: string, @Body() body: ISubscription) {
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
