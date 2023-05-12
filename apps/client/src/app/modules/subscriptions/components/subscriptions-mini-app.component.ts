import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component, HostBinding } from '@angular/core';
import { SubscriptionsManagePresenter } from '../presenters/subscriptions-manage.presenter';

@Component({
  selector: 'looper-subscriptions-mini-app',
  standalone: true,
  imports: [RouterModule],
  providers: [SubscriptionsManagePresenter],
  template: `<router-outlet></router-outlet>`,
})
export class SubscriptionsMiniAppComponent {
  @HostBinding('class')
  _classes = 'flex flex-col flex-1 items-stretch';

  constructor(
    private _route: ActivatedRoute,
    private _presenter: SubscriptionsManagePresenter
  ) {}

  ngOnInit() {
    const subId = this._route.snapshot.paramMap.get('id');
    if (subId) this._presenter.load(subId);
  }

  ngOnDestroy() {
    this._presenter.unload();
  }
}
