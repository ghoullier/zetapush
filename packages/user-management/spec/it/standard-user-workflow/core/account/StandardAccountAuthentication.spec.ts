import 'jasmine';
import { given, runInWorker, autoclean, frontUserAction } from '@zetapush/testing';
import { LegacyAdapterUserRepository } from '../../../../../src/standard-user-workflow/legacy';
import { AccountCreationManager, StandardAccountStatus } from '../../../../../src';
import { AccountCreationManagerInjectable } from '../../../../../src/';
import { AccountCreationManagerConfigurerImpl } from '../../../../../src/standard-user-workflow/configurer/account';
import { TimestampBasedUuidGenerator } from '../../../../../src/common/core';

describe(`StandardAccountAuthentication`, () => {
  const registrationConfigurer = jasmine.createSpyObj('registrationConfigurer', ['account', 'welcome', 'confirmation']);
  describe(`connect()`, () => {
    describe(`that use the LoginPasswordAuthenticationManager`, () => {
      beforeEach(async () => {
        await given()
          /**/ .credentials()
          /*  */ .fromEnv()
          /*  */ .newApp()
          /*  */ .and()
          /**/ .worker()
          /*  */ .testModule(async () => {
            // create configurer + inject services
            const configurer = new AccountCreationManagerConfigurerImpl(registrationConfigurer);
            configurer
              .uuid()
              /**/ .generator(TimestampBasedUuidGenerator)
              /**/ .and()
              .initialStatus()
              /**/ .value(StandardAccountStatus.WaitingConfirmation)
              /**/ .and()
              .storage(LegacyAdapterUserRepository);
            return {
              providers: await (<AccountCreationManagerConfigurerImpl>configurer).getProviders()
            };
          })
          .dependencies(AccountCreationManagerInjectable, LegacyAdapterUserRepository)
          .and()
          .apply(this);
      });

      describe(`On valid authentication`, () => {
        it(
          `Connection success and that returns the connected user`,
          async () => {
            await runInWorker(
              this,
              async (creationManager: AccountCreationManager, userRepo: LegacyAdapterUserRepository) => {
                // GIVEN
                const account = await creationManager.createAccount({
                  credentials: {
                    login: 'odile.deray',
                    password: 'password'
                  },
                  profile: {
                    firstname: 'Odile',
                    lastname: 'DERAY'
                  }
                });

                // Set the account status
                await userRepo.updateStatus(account.accountId, StandardAccountStatus.Active);
              }
            );

            const credentials = { login: 'odile.deray', password: 'password' };

            await frontUserAction()
              .name('Client connection')
              .context(this)
              .loggedAs(credentials)
              .execute();
          },
          5 * 60 * 1000
        );

        it(
          `Connection failed with bad credentials and returns the proper error`,
          async () => {
            await runInWorker(
              this,
              async (creationManager: AccountCreationManager, userRepo: LegacyAdapterUserRepository) => {
                // GIVEN
                const account = await creationManager.createAccount({
                  credentials: {
                    login: 'odile.deray',
                    password: 'password'
                  },
                  profile: {
                    firstname: 'Odile',
                    lastname: 'DERAY'
                  }
                });

                // Set the account status
                await userRepo.updateStatus(account.accountId, StandardAccountStatus.Active);
              }
            );

            const credentials = { login: 'odile.deray', password: 'wrong_password' };

            try {
              await frontUserAction()
                .name('Client connection')
                .context(this)
                .loggedAs(credentials)
                .execute();
              fail('authentication should have failed');
            } catch (e) {
              expect(e).toEqual('403::Handshake denied');
            }
          },
          5 * 60 * 1000
        );

        it(
          `Connection failed because the account is not activated and returns the proper error`,
          async () => {
            await runInWorker(
              this,
              async (creationManager: AccountCreationManager, userRepo: LegacyAdapterUserRepository) => {
                // GIVEN
                const account = await creationManager.createAccount({
                  credentials: {
                    login: 'odile.deray',
                    password: 'password'
                  },
                  profile: {
                    firstname: 'Odile',
                    lastname: 'DERAY'
                  }
                });
              }
            );

            const credentials = { login: 'odile.deray', password: 'password' };

            try {
              await frontUserAction()
                .name('Client connection')
                .context(this)
                .loggedAs(credentials)
                .execute();
              fail('authentication should have failed');
            } catch (e) {
              // TODO: Handle the proper error
              expect(e).toEqual('403::Handshake denied');
            }
          },
          5 * 60 * 1000
        );
      });

      afterEach(async () => {
        await autoclean(this);
      });
    });
  });
});
