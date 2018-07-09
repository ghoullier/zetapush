import {
  PageContent,
  PageDirection,
  Pagination,
  StringAnyMap,
  StringObjectMap,
} from '../CommonTypes';

export interface SearchData {
  /**Type name*/
  type: string;
  /**Document id*/
  id: string;
  /**Index name*/
  index: string;
  /**User field for traceability of requests. Synchronous SDK APIs use this field for you.*/
  requestId?: string;
  /**Document data*/
  data: StringAnyMap;
}
export interface SearchDocumentId {
  /**Type name*/
  type: string;
  /**Document id*/
  id: string;
  /**Index name*/
  index: string;
  /**User field for traceability of requests. Synchronous SDK APIs use this field for you.*/
  requestId?: string;
}
export interface SearchIndex {
  /**Index name*/
  index: string;
  /**ElasticSearch field mappings*/
  mappings?: StringObjectMap;
  /**ElasticSearch index settings.*/
  settings?: StringAnyMap;
}
export interface SearchRequest {
  /**List of indices to be searched.*/
  indices: string[];
  /**User field for traceability of requests. Synchronous SDK APIs use this field for you.*/
  requestId?: string;
  /**ElasticSearch filter. Follows the syntax defined in the elastic search manual.*/
  filter?: StringAnyMap;
  /**ElasticSearch query. Follows the syntax defined in the elastic search manual.*/
  query: StringAnyMap;
  /**Sort information*/
  sort?: SearchRequestSortField[];
  /**Pagination information*/
  page?: Pagination;
  /**The document types to execute the search against. Defaults to be executed against all types.*/
  types?: string[];
}
export interface SearchRequestSortField {
  /**Field name*/
  name?: string;
  /**Field sort information. Follows elasticsearch syntax.*/
  sort?: StringAnyMap;
}
export interface SearchResults {
  /**List of found items*/
  items?: PageContent<SearchResultsItem>;
  /**User field for traceability of requests. The value was generated by the client requester.*/
  requestId?: string;
  /**Total number of documents matching the query*/
  totalHits?: number;
}
export interface SearchResultsItem {
  /**Type name*/
  type: string;
  /**Document id*/
  id: string;
  /**Index name*/
  index: string;
  /**User field for traceability of requests. Synchronous SDK APIs use this field for you.*/
  requestId?: string;
  /**Document data*/
  data: StringAnyMap;
  /**Item score*/
  score?: number;
}
