import { Space } from './space';

export interface UBLDocument {
    id: string;
    type: string;
    attributes: UBLDocumentAttributes;
    links: UBLDocumentLink;
    relationships: UBLDocumentRelationships;

    path: string;
    assignedId: string;
    relationalData?: UBLDocumentRelationalData;
}

export class UBLDocumentLink {
    self: string;
    filelink: string;
    filters?: string;
}

export class UBLDocumentRelationships {
    ownedBy: {
        data: {
            id: string;
            type: string;
        };
    };
}

export class UBLDocumentAttributes {
    id: string;
    assignedId: string;
    type: string;
    currency: string;
    amount: number;
    tax: number;
    issueDate: Date;
    supplierName: string;
    supplierAssignedId: string;
    customerName: string;
    customerAssignedId: string;
    provider: string;
    starred: boolean; //
    viewed: boolean;
    checked: boolean;
    tags: string[];
    updatedAt: string;
    createdAt: string;
}

export class UBLDocumentRelationalData {
    creator?: Space;
}
