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
  SimpleAccountCreation,
  SimpleAccountInfo,
  SimpleAccountStatusChangeRequest,
  SimpleAccountUpdate,
  UserLoginchange
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
  /**
   * Changes a password
   *
   * Changes a user password for this authentication realm.
   * The user can be either explicit, implicit (one of the current user's accounts) or deduced from the token.
   * You should provide at least one of 'key' and 'token'. If you do not, the server will try and find any key for the current user.
   * The change is effective immediately. However, already logged in users might stay connected.
   * The password and token fields are always null in the output.
   * @access public
   * */
  changePassword(body: ChangePasswordRequest): Promise<ChangePasswordRequest> {
    return this.$publish('changePassword', body);
  }
  /**
   * Checks some account's existence
   *
   * Checks whether the given account already exists in this 'simple' authentication realm.
   * This verb returns all the information about the user, including non public fields.
   * @access public
   * */
  checkAccount(body: ExistenceCheck): Promise<SimpleAccountInfo> {
    return this.$publish('checkAccount', body);
  }
  /**
   * Checks the password for the given account
   *
   * @access public
   * */
  checkPassword(body: CheckPasswordRequest): Promise<CheckPasswordResult> {
    return this.$publish('checkPassword', body);
  }
  /**
   * Checks some account's existence
   *
   * Checks whether the given account already exists in this 'simple' authentication realm.
   * This verb returns all the information about the user, including non public fields.
   * @access public
   * */
  checkUser(body: ExistenceCheck): Promise<StringAnyMap> {
    return this.$publish('checkUser', body);
  }
  /**
   * Creates an account
   *
   * Creates a new account in this 'simple' authentication realm.
   * Returns the account fields, including a field named <i>zetapushKey</i> containing the global user key of the user (value of the <b>__userKey</b> pseudo-constant when this new account will be used)
   * @access public
   * */
  createAccount(body: SimpleAccountCreation): Promise<SimpleAccountInfo> {
    return this.$publish('createAccount', body);
  }
  /**
   * Creates an account
   *
   * Creates a new account in this 'simple' authentication realm.
   * Returns a map of account fields, including a field named <i>zetapushKey</i> containing the global user key of the user (value of the <b>__userKey</b> pseudo-constant when this new account will be used)
   * @access public
   * */
  createUser(body: BasicAuthenticatedUser): Promise<StringAnyMap> {
    return this.$publish('createUser', body);
  }
  /**
   * Lists an account's credentials
   *
   * Returns the list of account credentials in this service for the asking user.
   * Might return an empty list.
   * @access public
   * */
  credentials(body: ImpersonatedTraceableRequest): Promise<AllCredentials> {
    return this.$publish('credentials', body);
  }
  /**
   * Deletes an account
   *
   * Deletes an existing account in this 'simple' authentication realm.
   * @access public
   * */
  deleteUser(body: ExistenceCheck): Promise<ExistenceCheck> {
    return this.$publish('deleteUser', body);
  }
  /**
   * Requests a password reset
   *
   * Requests a password reset for the given unique account key.
   * The account key must exist and must be given, as it cannot obviously be deduced from the currently logged in user.
   * The returned token needs to be sent to the intended recipient only. The typical use case is to define a macro that requests a reset, generates a email template and emails the user. The macro can then be safely called by a weakly authenticated user.
   * Requesting a reset does not invalidate the password.
   * Requesting a reset again invalidates previous reset requests (only the last token is usable)
   * @access public
   * */
  requestReset(body: ResetRequest): Promise<ResetInfo> {
    return this.$publish('requestReset', body);
  }
  /**
   * Change some account's status
   *
   * Changes status if the given account already exists in this 'simple' authentication realm.
   * This verb returns all the information about the user, including non public fields.
   * @access public
   * */
  setStatus(body: SimpleAccountStatusChangeRequest): Promise<SimpleAccountInfo> {
    return this.$publish('setStatus', body);
  }
  /**
   * Updates an account
   *
   * Updates an existing account in this 'simple' authentication realm.
   * The configured login field MUST be given, as a user (identified by his zetapush userKey) might possess several accounts.
   * Returns the account fields
   * @access public
   * */
  updateAccount(body: SimpleAccountUpdate): Promise<SimpleAccountInfo> {
    return this.$publish('updateAccount', body);
  }
  /**
   * Updates an account key
   *
   * Updates an existing account primary key (login, NOT <b>__userKey</b>) in this 'simple' authentication realm.
   * The updated account MUST belong to the user making the call.
   * The configured login field MUST be given, as a user (identified by his zetapush userKey) might possess several accounts.
   * Returns a map of account fields
   * @access public
   * */
  updateKey(body: UserLoginchange): Promise<StringAnyMap> {
    return this.$publish('updateKey', body);
  }
  /**
   * Updates an account
   *
   * Updates an existing account in this 'simple' authentication realm.
   * The updated account MUST belong to the user making the call.
   * The configured login field MUST be given, as a user (identified by his zetapush userKey) might possess several accounts.
   * Returns a map of account fields
   * @access public
   * */
  updateUser(body: BasicAuthenticatedUser): Promise<StringAnyMap> {
    return this.$publish('updateUser', body);
  }
}
