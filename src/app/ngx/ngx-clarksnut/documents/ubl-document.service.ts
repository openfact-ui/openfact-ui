import { DocumentQuery } from './../../../models/document-quey';
import { SearchResult } from '../models/search-result';
import { Space } from '../models/space';
import { SpaceService } from '../spaces/space.service';
import { Injectable, Inject } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { cloneDeep } from 'lodash';
import { Logger } from '../../ngx-base';
import { Observable } from 'rxjs';

import { CLARKSNUT_API_URL } from '../api/clarksnut-api';
import { UBLDocument } from '../models/ubl-document';
import { FileWrapper } from '../models/file-wrapper';

@Injectable()
export class UBLDocumentService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private documentsUrl: string;
  private usersUrl: string;
  private nextLink: string = null;

  constructor(
    private http: Http,
    private logger: Logger,
    private spaceService: SpaceService,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.documentsUrl = apiUrl.endsWith('/') ? apiUrl + 'documents' : apiUrl + '/documents';
    this.usersUrl = apiUrl.endsWith('/') ? apiUrl + 'users' : apiUrl + '/users';
  }

  getDocumentById(userId: string, documentId: string): Observable<UBLDocument> {
    const url = `${this.usersUrl}/${userId}/documents/${documentId}`;
    return this.http.get(url, { headers: this.headers })
      .map((response) => {
        return response.json().data as UBLDocument;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  create(document: UBLDocument): Observable<UBLDocument> {
    const url = this.documentsUrl;
    const payload = JSON.stringify({ data: document });
    return this.http
      .post(url, payload, { headers: this.headers })
      .map(response => {
        return response.json().data as UBLDocument;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  update(userId: string, document: UBLDocument): Observable<UBLDocument> {
    const url = `${this.usersUrl}/${userId}/documents/${document.id}`;
    const payload = JSON.stringify({ data: document });
    return this.http
      .put(url, payload, { headers: this.headers })
      .map(response => {
        return response.json().data as UBLDocument;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  deleteDocument(userId: string, document: UBLDocument): Observable<UBLDocument> {
    const url = `${this.usersUrl}/${userId}/documents/${document.id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .map(() => { })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Filter documents. If empty then searchText becomes '*'
   */
  getDocuments(userId: string, filterText: string, spaces: Space[], limit: number = 10): Observable<UBLDocument[]> {
    const url = `${this.usersUrl}/${userId}/documents`;
    const params: URLSearchParams = new URLSearchParams();
    if (filterText === '') {
      filterText = '*';
    }
    params.set('filterText', filterText);
    params.set('limit', limit.toString());
    spaces.forEach((s) => {
      params.set('spaceIds', s.id);
    });

    return this.http
      .get(url, { search: params, headers: this.headers })
      .map(response => {
        return response.json().data as UBLDocument[];
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  searchDocuments(userId: string, query: DocumentQuery): Observable<SearchResult<UBLDocument>> {
    const url = `${this.usersUrl}/${userId}/documents/search`;

    return this.http
      .post(url, query)
      .map(response => {
        return response.json().data as UBLDocument[];
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  downloadDocumentById(userId: string, documentId: string): Observable<FileWrapper> {
    const url = `${this.usersUrl}/${userId}/documents/${documentId}`;
    return this.http.get(url, {
      headers: this.headers,
      responseType: ResponseContentType.Blob
    })
      .map((response) => {
        let filename;
        const headers = response.headers;
        const disposition = headers.get('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['']).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['']/g, '');
          }
        }

        const file = response.blob();
        const blob = new Blob([file]);
        return {
          filename: filename,
          file: blob
        } as FileWrapper;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  printDocumentById(userId: string, documentId: string, theme?: string, format?: string): Observable<FileWrapper> {
    const params = new URLSearchParams();
    if (theme) { params.append('theme', theme); }
    if (format) { params.append('format', format); }

    const url = `${this.usersUrl}/${userId}/documents/${documentId}`;
    return this.http.get(url, {
      headers: this.headers,
      responseType: ResponseContentType.Blob,
      params: params
    })
      .map((response) => {
        let filename;
        const headers = response.headers;
        const disposition = headers.get('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['']).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['']/g, '');
          }
        }

        const file = response.blob();
        const blob = new Blob([file]);

        return {
          filename: filename,
          file: blob
        } as FileWrapper;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  // /**
  //  * Get All documents
  //  */
  // getDocuments(pageSize: number = 20): Observable<UBLDocument[]> {
  //   const url = this.documentsUrl + '?page[limit]=' + pageSize;
  //   return this.getDocumentsDelegate(url, true);
  // }

  // /**
  //  * Get More documents
  //  */
  // getMoreDocuments(): Observable<UBLDocument[]> {
  //   if (this.nextLink) {
  //     return this.getDocumentsDelegate(this.nextLink, false);
  //   } else {
  //     return Observable.throw('No more documents found');
  //   }
  // }

  // getDocumentsDelegate(url: string, isAll: boolean): Observable<UBLDocument[]> {
  //   return this.http
  //     .get(url, { headers: this.headers })
  //     .map(response => {
  //       // Extract links from JSON API response.
  //       // and set the nextLink, if server indicates more resources
  //       // in paginated collection through a 'next' link.
  //       const links = response.json().links;
  //       if (links.hasOwnProperty('next')) {
  //         this.nextLink = links.next;
  //       } else {
  //         this.nextLink = null;
  //       }
  //       // Extract data from JSON API response, and assert to an array of documents.
  //       const newDocuments: UBLDocument[] = response.json().data as UBLDocument[];
  //       return newDocuments;
  //     })
  //     .catch((error) => {
  //       return this.handleError(error);
  //     });
  // }


  // /**
  //  * Update UBLDocument
  //  */
  // updateMassive(documents: UBLDocument[]): Observable<UBLDocument> {
  //   const url = `${this.documentsUrl}/massive`;
  //   const payload = JSON.stringify({ data: documents });
  //   return this.http
  //     .patch(url, payload, { headers: this.headers })
  //     .catch((error) => {
  //       return this.handleError(error);
  //     });
  // }

  // /**
  //  * Currently serves to fetch the list of all documents owned by a user.
  //  * @param userName
  //  * @param pageSize
  //  */
  // getDocumentsByUser(userName: string, pageSize: number = 20): Observable<UBLDocument[]> {
  //   const url = `${this.namedDocumentsUrl}/${userName}` + '?page[limit]=' + pageSize;
  //   const isAll = false;
  //   return this.getDocumentsDelegate(url, isAll);
  // }

  // getMoreDocumentsByUser(): Observable<UBLDocument[]> {
  //   if (this.nextLink) {
  //     return this.getDocumentsDelegate(this.nextLink, false);
  //   } else {
  //     return Observable.throw('No more documents found');
  //   }
  // }

  // downloadDocumentsMassive(documents: string[]): Observable<FileWrapper> {
  //   const params = new URLSearchParams();
  //   documents.forEach(d => params.append('documents', d));

  //   const url = `${this.documentsUrl}/massive/download`;
  //   return this.http.get(url, {
  //     headers: this.headers,
  //     responseType: ResponseContentType.Blob,
  //     params: params
  //   })
  //     .map((response) => {
  //       let filename;
  //       const headers = response.headers;
  //       const disposition = headers.get('Content-Disposition');
  //       if (disposition && disposition.indexOf('attachment') !== -1) {
  //         const filenameRegex = /filename[^;=\n]*=((['']).*?\2|[^;\n]*)/;
  //         const matches = filenameRegex.exec(disposition);
  //         if (matches != null && matches[1]) {
  //           filename = matches[1].replace(/['']/g, '');
  //         }
  //       }

  //       const file = response.blob();
  //       const blob = new Blob([file]);
  //       return {
  //         filename: filename,
  //         file: blob
  //       } as FileWrapper;
  //     })
  //     .catch((error) => {
  //       return this.handleError(error);
  //     });
  // }

  // printDocumentsMassive(documents: string[], theme?: string, format?: string): Observable<FileWrapper> {
  //   const params = new URLSearchParams();
  //   documents.forEach(d => params.append('documents', d));
  //   if (theme) { params.append('theme', theme); }
  //   if (format) { params.append('format', format); }

  //   const url = `${this.documentsUrl}/massive/print`;
  //   return this.http.get(url, {
  //     headers: this.headers,
  //     responseType: ResponseContentType.Blob,
  //     params: params
  //   })
  //     .map((response) => {
  //       let filename;
  //       const headers = response.headers;
  //       const disposition = headers.get('Content-Disposition');
  //       if (disposition && disposition.indexOf('attachment') !== -1) {
  //         const filenameRegex = /filename[^;=\n]*=((['']).*?\2|[^;\n]*)/;
  //         const matches = filenameRegex.exec(disposition);
  //         if (matches != null && matches[1]) {
  //           filename = matches[1].replace(/['']/g, '');
  //         }
  //       }

  //       const file = response.blob();
  //       const blob = new Blob([file]);

  //       return {
  //         filename: filename,
  //         file: blob
  //       } as FileWrapper;
  //     })
  //     .catch((error) => {
  //       return this.handleError(error);
  //     });
  // }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }

}
