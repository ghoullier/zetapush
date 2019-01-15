import {
  StandardUserWorkflowConfigurer,
  RegistrationConfigurer,
  AuthenticationConfigurer,
  LostPasswordConfigurer
} from '../../common/configurer/grammar';
import { Provider, Environment } from '@zetapush/core';
import { TimestampBasedUuidGenerator, GdaTokenRepository, Base36RandomTokenGenerator } from '../../common/core';
import { DefaultLoginPasswordAccountDetails } from '../core';
import { StandardAccountStatus } from '../core/account';
import { StandardUserWorkflow } from '../core/StandardUserWorkflow';
import { StandardUserWorkflowConfigurerImpl } from './StandardUserWorkflowConfigurer';
import { Configurer, SimpleProviderRegistry } from '../../common/configurer';
import {
  RegistrationConfirmationPropertyKeys,
  MailjetPropertyKey,
  ProductPropertyKeys,
  EmailPropertyKeys
} from './properties';
import {
  DEFAULT_MAILJET_URL,
  DEFAULT_MAILJET_API_KEY_PUBLIC,
  DEFAULT_MAILJET_API_KEY_PRIVATE,
  DEFAULT_CONFIRMATION_SENDER,
  DEFAULT_CONFIRMATION_SUBJECT,
  DEFAULT_CONFIRMATION_HTML_TEMPLATE,
  DEFAULT_CONFIRMATION_TEXT_TEMPLATE,
  DEFAULT_CONFIRMATION_TOKEN_VALIDITY,
  DEFAULT_RESET_PASSWORD_TOKEN_VALIDITY,
  DEFAULT_CONFIRMATION_URL,
  DEFAULT_CONFIRMATION_SUCCESS_REDIRECTION,
  DEFAULT_CONFIRMATION_FAILURE_REDIRECTION,
  DEFAULT_SMTP_HOST,
  DEFAULT_SMTP_PORT,
  DEFAULT_SMTP_USERNAME,
  DEFAULT_SMTP_PASSWORD,
  DEFAULT_SMTP_SSL,
  DEFAULT_SMTP_STARTTLS,
  DEFAULT_MAILJET_ENABLE,
  DEFAULT_SMTP_ENABLE,
  DEFAULT_ASK_RESET_PASSWORD_SENDER,
  DEFAULT_ASK_RESET_PASSWORD_SUBJECT,
  DEFAULT_ASK_RESET_PASSWORD_HTML_TEMPLATE,
  DEFAULT_ASK_RESET_PASSWORD_TEXT_TEMPLATE,
  DEFAULT_ASK_RESET_PASSWORD_URL
} from './defaults';
import { LegacyAdapterUserRepository } from '../legacy';
import { ConfigurationProperties, ZetaPushContext } from '@zetapush/core';

// prettier-ignore

// default workflow:
// user signups -> confirmation email -> click on link in email -> account confirmed on ZetaPush -> welcome page
// user logs in -> welcome page
// user asks for password reset -> send email -> click on link in email -> show page to reset password -> change password -> welcome page

// TODO: find a more understandable name (StandardUserWorkflow, B2CUserWorkflow, SelfRegistrationUserWorkflow ?)
// "Standard" user workflow:
//  - Account registration
//    - User signs up himself to the service using email/username+password
//      or using principal OAuth providers (Google, Github, Facebook)
//    - User chooses an avatar
//  - Authentication
//    - User logs in using email/username+password or using principal OAuth providers (Google, Github, Facebook)
//    -
// @Configuration
export class DefaultUserWorkflowConfigurer implements Configurer {
  private userManagementConfigurer: StandardUserWorkflowConfigurerImpl;
  private zetapushContext: ZetaPushContext;
  private properties: ConfigurationProperties;
  
  constructor() {}
  
  configure(env: Environment) {
    this.properties = env.properties;
    this.zetapushContext = env.context;
    this.userManagementConfigurer = new StandardUserWorkflowConfigurerImpl(this.properties, this.zetapushContext);
    this.configureAccountRegistration(this.userManagementConfigurer.registration());
    this.configurePasswordReset(this.userManagementConfigurer.lostPassword());
    // this.configureLogin(this.userManagementConfigurer.login());
  }

  configureAccountRegistration(registrationConfigurer: RegistrationConfigurer) {
    registrationConfigurer
      .account()
        .storage(LegacyAdapterUserRepository)
        .uuid()
          .generator(TimestampBasedUuidGenerator)
          .and()
        .initialStatus()
          .value(StandardAccountStatus.WaitingConfirmation)
          .and()
        // .fields()
        //   .scan(DefaultLoginPasswordAccountDetails)
        //     .annotations()
        //     .and()
        //   .and()
        .and()
      // .fields()
      //   .field('username').optional().unique().and()
      //   .field('email').required().unique().and()
      //   .field('password').required().and()
      //   .field('confirm-password').required().equals('password').and()
      //   .field('avatar').optional().image().and()
      // .oauth()
      //   // TODO: for each provider −> keys, permissions, infos to retrieve
      //   .github()
      //   .google()
      //   .facebook()
      // .welcome()
      //   .email()
      //     .from(`no-reply@${this.properties.get('email.from')}`)
      //     .htmlTemplate(/*new MustacheTemplateProvider('templates/email/welcome.html')*/)
      //       .inlineCss(/*new CssInliner('styles')*/)
      //       .inlineImages(/*new Base64ImageInliner('images')*/)
      //       .and()
      //     .textTemplate(/*new MustacheTemplateProvider('templates/email/welcome.txt')*/)
      //     .and()
      //   .and()
      .confirmation()
        .token()
          .storage(GdaTokenRepository)
          .generator(Base36RandomTokenGenerator)
          .validity(DEFAULT_CONFIRMATION_TOKEN_VALIDITY)
          .and()
        .url(DEFAULT_CONFIRMATION_URL)
        .email()
          .mailjet()
            .enable(DEFAULT_MAILJET_ENABLE(this.properties))
            .url(DEFAULT_MAILJET_URL(this.properties))
            .apiKeyPublic(DEFAULT_MAILJET_API_KEY_PUBLIC(this.properties))
            .apiKeyPrivate(DEFAULT_MAILJET_API_KEY_PRIVATE(this.properties))
            .and()
          .smtp()
            .enable(DEFAULT_SMTP_ENABLE(this.properties))
            .host(DEFAULT_SMTP_HOST(this.properties))
            .port(DEFAULT_SMTP_PORT(this.properties))
            .username(DEFAULT_SMTP_USERNAME(this.properties))
            .password(DEFAULT_SMTP_PASSWORD(this.properties))
            .ssl(DEFAULT_SMTP_SSL(this.properties))
            .starttls(DEFAULT_SMTP_STARTTLS(this.properties))
            .and()
          .from(DEFAULT_CONFIRMATION_SENDER(this.properties))
          .subject(DEFAULT_CONFIRMATION_SUBJECT(this.properties))
          // A token is generated by ZetaPush. Token MUST be included in the template
          // Redirection URL may point to ZetaPush (so it may be dynamic) => Template variables MUST contain ZetaPush context
          .htmlTemplate(/*new MustacheTemplateProvider('templates/email/confirm.html')*/)
            .template(DEFAULT_CONFIRMATION_HTML_TEMPLATE)
            // .inlineCss(/*new CssInliner('styles')*/)
            // .inlineImages(/*new Base64ImageInliner('images')*/)
            .and()
          .textTemplate(/*new MustacheTemplateProvider('templates/email/confirm.txt')*/)
            .template(DEFAULT_CONFIRMATION_TEXT_TEMPLATE)
            .and()
          .and()
        .redirection()
          .successUrl(DEFAULT_CONFIRMATION_SUCCESS_REDIRECTION(this.properties, this.zetapushContext))
          .failureUrl(DEFAULT_CONFIRMATION_FAILURE_REDIRECTION(this.properties, this.zetapushContext));
  }

  configureLogin(loginConfigurer: AuthenticationConfigurer) {
    // loginConfigurer.loginPassword();
    // .field(or('username', 'email')).and()
    // .field('password')
  }

  configurePasswordReset(passwordResetConfigurer: LostPasswordConfigurer) {
    passwordResetConfigurer
      .reset()
        .token()
            .storage(GdaTokenRepository)
            .generator(Base36RandomTokenGenerator)
            .validity(DEFAULT_RESET_PASSWORD_TOKEN_VALIDITY)
            .and()
        .ask()
          .url(DEFAULT_ASK_RESET_PASSWORD_URL)
          .email()
            .subject(DEFAULT_ASK_RESET_PASSWORD_SUBJECT(this.properties))
            .mailjet()
              .enable(DEFAULT_MAILJET_ENABLE(this.properties))
              .url(DEFAULT_MAILJET_URL(this.properties))
              .apiKeyPublic(DEFAULT_MAILJET_API_KEY_PUBLIC(this.properties))
              .apiKeyPrivate(DEFAULT_MAILJET_API_KEY_PRIVATE(this.properties))
              .and()
            .smtp()
              .enable(DEFAULT_SMTP_ENABLE(this.properties))
              .host(DEFAULT_SMTP_HOST(this.properties))
              .port(DEFAULT_SMTP_PORT(this.properties))
              .username(DEFAULT_SMTP_USERNAME(this.properties))
              .password(DEFAULT_SMTP_PASSWORD(this.properties))
              .ssl(DEFAULT_SMTP_SSL(this.properties))
              .starttls(DEFAULT_SMTP_STARTTLS(this.properties))
              .and()
            .from(DEFAULT_ASK_RESET_PASSWORD_SENDER(this.properties))
            // A token is generated by ZetaPush. Token MUST be included in the template
            // Redirection URL may point to ZetaPush (so it may be dynamic) => Template variables MUST contain ZetaPush context
            .htmlTemplate(/*new MustacheTemplateProvider('templates/email/confirm.html')*/)
              .template(DEFAULT_ASK_RESET_PASSWORD_HTML_TEMPLATE)
              // .inlineCss(/*new CssInliner('styles')*/)
              // .inlineImages(/*new Base64ImageInliner('images')*/)
              .and()
            .textTemplate(/*new MustacheTemplateProvider('templates/email/confirm.txt')*/)
              .template(DEFAULT_ASK_RESET_PASSWORD_TEXT_TEMPLATE)
              .and()
            .and()
          .and()
        .confirm();
  }

  configureUserProfile(profileConfigurer: any) {
    // profileConfigurer
    //   .fields()
  }

  async getProviders(): Promise<Provider[]> {
    const providerRegistry = new SimpleProviderRegistry();
    await providerRegistry.registerConfigurer(this.userManagementConfigurer);
    return providerRegistry.getProviders();
  }
}

// @Configuration
// class CustomUserManagementConfigurer {
//   constructor(private userManagementConfigurer: UserManagementConfigurer) {}

//   configureAccountRegistration(registrationConfigurer) {
//     registrationConfigurer
//       .fields()
//         //.add()
//         .override()
//           // EITHER chainable version
//           .field('username').required().min(5).max(30)
//           // OR configuration object version
//           .field({username: {required: true, min: 5, max: 30}})
//           // OR configuration based on annotations
//           .fields(new AnnotatedFieldsScanner(SignupInfo))
//       .and()
//       .confirmation()
//         .email()
//           // EITHER simple template directly from code
//           .htmlTemplate(new MustacheTemplateProvider('templates/email/confirm.html'))
//             .inlineCss('styles')
//             .inlineImages('images')
//             .and()
//           .textTemplate(new MustacheTemplateProvider('templates/email/confirm.txt'))
//           // OR template using ZetaPush templating
//           .htmlTemplate(new TemplateEngineCloudServiceProvider(```
//             template content
//           ```))
//             .inlineCss('styles')
//             .inlineImages('images')
//           // OR template using external service templating (mailchimp)
//           .htmlTemplate(new MailChimpTemplateProvider(mailchimpAccount, milchimpTemplateName))
//           // OR directly using a string (template processing could be done elsewhere)
//           .htmlTemplate((user) => `template content ${user.firstname}`)
//   }

//   configurePasswordReset(passwordResetConfigurer) {
//     passwordResetConfigurer
//       .reset()
//         // replace email by sms
//         .sms()
//           .textTemplate(new MustacheTemplateProvider('templates/sms/reset-password.txt'))
//   }
// }

// @Configuration
// class FullyCustomUserManagementConfigurer {
//   constructor(private userManagementConfigurer: UserManagementConfigurer) {}

//   configure() {
//     this.userManagementConfigurer
//       .account()
//         .registration(new MyCustomAccountRegistrationManager('username'))
//           .confirmation(new MyCustomAccountConfirmationManager())
//       .password()
//         .reset(new MyCustomPasswordResetManager())
//   }
// }
