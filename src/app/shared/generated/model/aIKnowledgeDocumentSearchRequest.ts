/**
 * onecx-ai-ui-bff
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface AIKnowledgeDocumentSearchRequest { 
    limit?: number;
    id?: number;
    name?: string;
    status?: AIKnowledgeDocumentSearchRequestStatusEnum;
}
export enum AIKnowledgeDocumentSearchRequestStatusEnum {
    New = 'NEW',
    Processing = 'PROCESSING',
    Embedded = 'EMBEDDED'
};



