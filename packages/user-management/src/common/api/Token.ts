import { BaseError } from '@zetapush/common';

/**
 * ================================
 * Token Managers
 * ================================
 */
export interface TokenGenerator {
  generate(): Promise<Token>;
}

export abstract class TokenGeneratorInjectable implements TokenGenerator {
  abstract generate(): Promise<Token>;
}

/**
 * Allows to store tokens
 */
export interface TokenRepository {
  store(token: Token, associatedValue?: AssociatedValueToToken): Promise<Token>;
  getFromToken(token: Token): Promise<StoredToken>;
  delete(token: Token): Promise<Token>;
}
export abstract class TokenRepositoryInjectable implements TokenRepository {
  abstract store(token: Token, associatedValue?: AssociatedValueToToken): Promise<Token>;
  abstract getFromToken(token: Token): Promise<StoredToken>;
  abstract delete(token: Token): Promise<Token>;
}

/**
 * Allows to validate or delete
 */
export interface TokenManager {
  validate(
    token: Token,
    matcher?: (associatedValue?: AssociatedValueToToken) => Promise<boolean>
  ): Promise<StoredToken>;
  generate(): Promise<Token>;
  save(token: Token, associatedValue?: AssociatedValueToToken): Promise<Token>;
}
export abstract class TokenManagerInjectable implements TokenManager {
  abstract validate(
    token: Token,
    matcher?: (associatedValue?: AssociatedValueToToken) => Promise<boolean>
  ): Promise<StoredToken>;
  abstract generate(): Promise<Token>;
  abstract save(token: Token, associatedValue?: AssociatedValueToToken): Promise<Token>;
}

/**
 * ================================
 * Utils Type / Interfaces
 * ================================
 */
export interface Token {
  value: string;
}

export interface StoredToken {
  token: Token;
  associatedValue?: AssociatedValueToToken;
}

// Can be extends with other types
export type AssociatedValueToToken = any;

export class TokenGenerationError extends BaseError {}
