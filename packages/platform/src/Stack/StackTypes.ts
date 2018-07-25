import {
  Base64EncodedBytes,
  PageContent,
  PageDirection,
  Pagination,
  StringAnyMap,
} from '../CommonTypes';

export interface StackItem {
  /**Server-generated GUID*/
  guid?: Base64EncodedBytes;
  /**Insertion timestamp*/
  ts?: number;
  /**Stored data*/
  data?: StringAnyMap;
}
export interface StackItemAdd {
  /**Key of this stack item*/
  guid?: Base64EncodedBytes;
  /**Context ID. Clients and developers must not pass this explicitly. This value is generated by the server and can be passed back by the worker SDKs.*/
  contextId?: string;
  /**User field for traceability of requests. Synchronous SDK APIs use this field for you.*/
  requestId?: string;
  /**Stack name.*/
  stack: string;
  /**Insertion timestamp*/
  ts?: number;
  /**Stored data*/
  data: StringAnyMap;
  /**Optional User key. When calling the API, defaults to the current (calling) user's primary key. For impersonation purposes, the caller may use the key of another user, provided that the proper authorizations have been given by the impersonated user*/
  owner?: string;
}
export interface StackItemRemove {
  /**Context ID. Clients and developers must not pass this explicitly. This value is generated by the server and can be passed back by the worker SDKs.*/
  contextId?: string;
  /**List of keys of the items to be removed*/
  guids: Base64EncodedBytes[];
  /**User field for traceability of requests. Synchronous SDK APIs use this field for you.*/
  requestId?: string;
  /**Stack name.*/
  stack: string;
  /**Optional User key. When calling the API, defaults to the current (calling) user's primary key. For impersonation purposes, the caller may use the key of another user, provided that the proper authorizations have been given by the impersonated user*/
  owner?: string;
}
export interface StackListRequest {
  /**Context ID. Clients and developers must not pass this explicitly. This value is generated by the server and can be passed back by the worker SDKs.*/
  contextId?: string;
  /**User field for traceability of requests. Synchronous SDK APIs use this field for you.*/
  requestId?: string;
  /**Stack name.*/
  stack: string;
  /**Optional User key. When calling the API, defaults to the current (calling) user's primary key. For impersonation purposes, the caller may use the key of another user, provided that the proper authorizations have been given by the impersonated user*/
  owner?: string;
  /**Pagination information*/
  page?: Pagination;
}
export interface StackListResponse {
  /**Request leading to the result*/
  request?: StackListRequest;
  /**Result for the specified request*/
  result?: PageContent<StackItem>;
  /**User field for traceability of requests. The value was generated by the client requester.*/
  requestId?: string;
}
export interface StackListeners {
  /**List of userKeys (as in the value of __userKey) or fully qualified group names (the syntax is groupServiceDeploymentId:userKey:group) that will be notified of modifying stack operations*/
  listeners?: string[];
  /**Context ID. Clients and developers must not pass this explicitly. This value is generated by the server and can be passed back by the worker SDKs.*/
  contextId?: string;
  /**User field for traceability of requests. Synchronous SDK APIs use this field for you.*/
  requestId?: string;
  /**Stack name.*/
  stack: string;
  /**Optional User key. When calling the API, defaults to the current (calling) user's primary key. For impersonation purposes, the caller may use the key of another user, provided that the proper authorizations have been given by the impersonated user*/
  owner?: string;
}
export interface StackRequest {
  /**Context ID. Clients and developers must not pass this explicitly. This value is generated by the server and can be passed back by the worker SDKs.*/
  contextId?: string;
  /**User field for traceability of requests. Synchronous SDK APIs use this field for you.*/
  requestId?: string;
  /**Stack name.*/
  stack: string;
  /**Optional User key. When calling the API, defaults to the current (calling) user's primary key. For impersonation purposes, the caller may use the key of another user, provided that the proper authorizations have been given by the impersonated user*/
  owner?: string;
}
