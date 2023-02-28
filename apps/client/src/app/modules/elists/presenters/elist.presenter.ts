import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IElist, IElistNew } from '@gcloud-function-api-auth/interfaces';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import {
  ElistsDomainService,
  UsersDomainService,
} from '../../../domain-services';
import { ErrorUtils } from '../../../shared';
import { ElistFormMode } from '../interfaces';

@Injectable()
export class ElistsPresenter {
  // state -------------------------------------------------------------------------------------------------------------
  public readonly userElists$ = this._elistsDomainService.userElists$;

  public readonly user$ = this._usersDomainService.user$;

  private _mode$ = new BehaviorSubject<ElistFormMode>(ElistFormMode.CREATE);
  public mode$ = this._mode$.asObservable();

  // lifecycle ---------------------------------------------------------------------------------------------------------
  constructor(
    private _logger: NGXLogger,
    private _elistsDomainService: ElistsDomainService,
    private _usersDomainService: UsersDomainService,
    private _router: Router
  ) {}

  // api ---------------------------------------------------------------------------------------------------------------

  public setMode(mode: ElistFormMode) {
    this._mode$.next(mode);
  }

  public createElist(anElist: IElistNew) {
    this._elistsDomainService.createElist(anElist).subscribe({
      next: () => {
        try {
          this._elistsDomainService.getElistsForUser().subscribe({
            next: async () => {
              await this._router.navigateByUrl('/elists');
            },
            error: (e) => {
              this._logger.error(
                ErrorUtils.chainError(
                  'created elist but could not refresh list index',
                  e as Error
                )
              );
            },
          });
        } catch (e) {
          this._logger.error(
            ErrorUtils.chainError(
              'created elist but could not refresh list index',
              e as Error
            )
          );
        }
      },
      error: (e) => {
        this._logger.error(ErrorUtils.chainError('failed to create elist', e));
        // todo: add notificartion
      },
    });
  }

  public updateElist(anElist: IElist) {
    this._elistsDomainService.updateElist(anElist).subscribe({
      next: () => {
        try {
          this._elistsDomainService.getElistsForUser().subscribe({
            next: async () => {
              await this._router.navigateByUrl('/elists');
            },
            error: (e) => {
              this._logger.error(
                ErrorUtils.chainError(
                  'updated elist but could not refresh list index',
                  e as Error
                )
              );
            },
          });
        } catch (e) {
          this._logger.error(
            ErrorUtils.chainError(
              'updated elist but could not refresh list index',
              e as Error
            )
          );
        }
      },
      error: (e) => {
        this._logger.error(
          ErrorUtils.chainError('failed to update elist', e as Error)
        );
        // todo: add notificartion
      },
    });
  }

  public deleteElist(anElist: IElist) {
    this._elistsDomainService.deleteElist(anElist).subscribe({
      next: () => {
        try {
          this._elistsDomainService.getElistsForUser().subscribe({
            next: async () => {
              await this._router.navigateByUrl('/elists');
            },
            error: (e) => {
              this._logger.error(
                ErrorUtils.chainError(
                  'deleted elist but could not refresh list index',
                  e as Error
                )
              );
            },
          });
        } catch (e) {
          this._logger.error(
            ErrorUtils.chainError(
              'deleted elist but could not refresh list index',
              e as Error
            )
          );
        }
      },
      error: (e) => {
        this._logger.error(ErrorUtils.chainError('failed to delete elist', e));
        // todo: add notificartion
      },
    });
  }
}
