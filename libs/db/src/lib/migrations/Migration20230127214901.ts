import { Migration } from '@mikro-orm/migrations';

export class Migration20230127214901 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `users` (`id` BINARY(16) not null, `uid` varchar(255) not null, `first_name` varchar(100) null, `last_name` varchar(100) null, `phone_number` varchar(20) null, `phone_country_code` varchar(10) null, `email` varchar(255) not null, `role` enum('USER', 'ADMIN') not null default 'USER', primary key (`id`)) default character set utf8mb4 engine = InnoDB;"
    );
    this.addSql('alter table `users` add index `users_uid_index`(`uid`);');
    this.addSql('alter table `users` add unique `users_uid_unique`(`uid`);');
    this.addSql('alter table `users` add index `users_email_index`(`email`);');
    this.addSql(
      'alter table `users` add unique `users_email_unique`(`email`);'
    );

    this.addSql(
      'create table `elists` (`id` BINARY(16) not null, `elist_name` varchar(255) not null, `settings` JSON null, `default_settings` JSON null, `owner_id` BINARY(16) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;'
    );
    this.addSql(
      'alter table `elists` add index `elists_owner_id_index`(`owner_id`);'
    );
    this.addSql(
      'alter table `elists` add unique `elists_elist_name_owner_id_unique`(`elist_name`, `owner_id`);'
    );

    this.addSql(
      'create table `subscriptions` (`id` BINARY(16) not null, `first_name` varchar(100) not null, `last_name` varchar(100) not null, `company` varchar(255) not null, `email` varchar(255) not null, `phone_number` varchar(10) not null, `phone_country_code` varchar(10) not null, `user_did_consent` BOOLEAN not null, `settings` JSON not null, `elist_id` BINARY(16) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;'
    );
    this.addSql(
      'alter table `subscriptions` add index `subscriptions_elist_id_index`(`elist_id`);'
    );
    this.addSql(
      'alter table `subscriptions` add unique `subscriptions_email_elist_id_unique`(`email`, `elist_id`);'
    );

    this.addSql(
      'alter table `elists` add constraint `elists_owner_id_foreign` foreign key (`owner_id`) references `users` (`id`) on update cascade;'
    );

    this.addSql(
      'alter table `subscriptions` add constraint `subscriptions_elist_id_foreign` foreign key (`elist_id`) references `elists` (`id`) on update cascade;'
    );
  }
}
