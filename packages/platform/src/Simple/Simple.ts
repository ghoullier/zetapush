import { Service } from '../Core/index';
import { StringAnyMap } from '../CommonTypes';
import {
  AllCredentials,
  BasicAuthenticatedUser,
  ChangePasswordRequest,
  CheckPasswordRequest,
  CheckPasswordResult,
  ExistenceCheck,
  ImpersonatedTraceableRequest,
  ResetInfo,
  ResetRequest,
  UserLoginchange,
} from './SimpleTypes';

/**
 * Local authentication
 *
 * Zetapush local authentication
 *  The configurer can choose the primary key and mandatory user fields for account creation
 *  The field 'zetapushKey' is generated by the server and MUST not be used : it contains the unique key of the user inside a sandbox (it can be obtained from inside a macro with the <b>__userKey</b> pseudo-constant)
 * */
export class Simple extends Service {
  /**
   * Get deployment type associated to Simple service
   * @return {string}
   */
  static get DEPLOYMENT_TYPE() {
    return 'simple';
  }
  /**
   * Get default deployment id associated to Simple service
   * @return {string}
   */
  static get DEFAULT_DEPLOYMENT_ID() {
    return 'simple_0';
  }
  /**
   * End-user API for the simple local authentication
   *
   * These API verbs allow end-users to manage their account(s).
   * @access public
   * */
  changePassword(body: ChangePasswordRequest): Promise<ChangePasswordRequest> {
    return this.$publish('changePassword', body);
  }
  checkPassword(body: CheckPasswordRequest): Promise<CheckPasswordResult> {
    return this.$publish('checkPassword', body);
  }
  checkUser(body: ExistenceCheck): Promise<StringAnyMap> {
    return this.$publish('checkUser', body);
  }
  createUser(body: BasicAuthenticatedUser): Promise<StringAnyMap> {
    return this.$publish('createUser', body);
  }
  credentials(body: ImpersonatedTraceableRequest): Promise<AllCredentials> {
    return this.$publish('credentials', body);
  }
  deleteUser(body: ExistenceCheck): Promise<ExistenceCheck> {
    return this.$publish('deleteUser', body);
  }
  requestReset(body: ResetRequest): Promise<ResetInfo> {
    return this.$publish('requestReset', body);
  }
  updateKey(body: UserLoginchange): Promise<StringAnyMap> {
    return this.$publish('updateKey', body);
  }
  updateUser(body: BasicAuthenticatedUser): Promise<StringAnyMap> {
    return this.$publish('updateUser', body);
  }
}
