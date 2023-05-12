import { Migration } from '@mikro-orm/migrations';

export class Migration20230424193623 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `subscriptions` add `is_active` BOOLEAN not null;'
    );
  }

  override async down(): Promise<void> {
    this.addSql('alter table `subscriptions` drop `is_active`;');
  }
}
