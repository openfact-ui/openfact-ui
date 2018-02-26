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
  private namedDocumentsUrl: string;
  private nextLink: string = null;

  constructor(
    private http: Http,
    private logger: Logger,
    private spaceService: SpaceService,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.documentsUrl = apiUrl.endsWith('/') ? apiUrl + 'documents' : apiUrl + '/documents';
    this.namedDocumentsUrl = apiUrl + 'nameddocuments';
  }

  /**
   * Get All documents
   */
  getDocuments(pageSize: number = 20): Observable<UBLDocument[]> {
    const url = this.documentsUrl + '?page[limit]=' + pageSize;
    return this.getDocumentsDelegate(url, true);
  }

  /**
   * Get More documents
   */
  getMoreDocuments(): Observable<UBLDocument[]> {
    if (this.nextLink) {
      return this.getDocumentsDelegate(this.nextLink, false);
    } else {
      return Observable.throw('No more documents found');
    }
  }

  /**
   * Currently returns the document emited by space
   * @param spaceAssignedId
   * @param documentAssignedId
   */
  getDocumentByAssignedId(spaceAssignedId: string, documentAssignedId: string): Observable<UBLDocument> {
    const url = `${this.namedDocumentsUrl}/${spaceAssignedId}/${documentAssignedId}`;
    return this.http.get(url, { headers: this.headers })
      .map((response) => {
        return response.json().data as UBLDocument;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  getDocumentsDelegate(url: string, isAll: boolean): Observable<UBLDocument[]> {
    return this.http
      .get(url, { headers: this.headers })
      .map(response => {
        // Extract links from JSON API response.
        // and set the nextLink, if server indicates more resources
        // in paginated collection through a 'next' link.
        const links = response.json().links;
        if (links.hasOwnProperty('next')) {
          this.nextLink = links.next;
        } else {
          this.nextLink = null;
        }
        // Extract data from JSON API response, and assert to an array of documents.
        const newDocuments: UBLDocument[] = response.json().data as UBLDocument[];
        return newDocuments;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   *
   */
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

  /**
   * Update UBLDocument
   */
  update(document: UBLDocument): Observable<UBLDocument> {
    const url = `${this.documentsUrl}/${document.id}`;
    const payload = JSON.stringify({ data: document });
    return this.http
      .patch(url, payload, { headers: this.headers })
      .map(response => {
        return response.json().data as UBLDocument;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Update UBLDocument
   */
  updateMassive(documents: UBLDocument[]): Observable<UBLDocument> {
    const url = `${this.documentsUrl}/massive`;
    const payload = JSON.stringify({ data: documents });
    return this.http
      .patch(url, payload, { headers: this.headers })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Delete document using id
   */
  deleteDocument(document: UBLDocument): Observable<UBLDocument> {
    const url = `${this.documentsUrl}/${document.id}`;
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
  search(searchText: string): Observable<SearchResult<UBLDocument>> {
    const url = this.documentsUrl;
    const params: URLSearchParams = new URLSearchParams();
    if (searchText === '') {
      searchText = '*';
    }
    params.set('q', searchText);

    return this.http
      .get(url, { search: params, headers: this.headers })
      .map(response => {
        // Extract data from JSON API response, and assert to an array of documents.
        const json = response.json();

        const map = new Map();
        const facets = json.meta.facets;
        if (facets) {
          Object.keys(facets).forEach(key => {
            map.set(key, facets[key]);
          });
        }

        return {
          totalResults: json.meta.totalCount,
          data: json.data as UBLDocument[],
          facets: map
        } as SearchResult<UBLDocument>;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Currently serves to fetch the list of all documents owned by a user.
   * @param userName
   * @param pageSize
   */
  getDocumentsByUser(userName: string, pageSize: number = 20): Observable<UBLDocument[]> {
    const url = `${this.namedDocumentsUrl}/${userName}` + '?page[limit]=' + pageSize;
    const isAll = false;
    return this.getDocumentsDelegate(url, isAll);
  }

  getMoreDocumentsByUser(): Observable<UBLDocument[]> {
    if (this.nextLink) {
      return this.getDocumentsDelegate(this.nextLink, false);
    } else {
      return Observable.throw('No more documents found');
    }
  }

  /**
   * Get document by id
   */
  getDocumentById(documentId: string): Observable<UBLDocument> {
    const url = `${this.documentsUrl}/${documentId}`;
    return this.http.get(url, { headers: this.headers })
      .map((response) => {
        return response.json().data as UBLDocument;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  downloadDocumentById(documentId: string): Observable<FileWrapper> {
    const url = `${this.documentsUrl}/${documentId}/download`;
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

  printDocumentById(documentId: string, theme?: string, format?: string): Observable<FileWrapper> {
    const params = new URLSearchParams();
    if (theme) { params.append('theme', theme); }
    if (format) { params.append('format', format); }

    const url = `${this.documentsUrl}/${documentId}/print`;
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

  downloadDocumentsMassive(documents: string[]): Observable<FileWrapper> {
    const params = new URLSearchParams();
    documents.forEach(d => params.append('documents', d));

    const url = `${this.documentsUrl}/massive/download`;
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

  printDocumentsMassive(documents: string[], theme?: string, format?: string): Observable<FileWrapper> {
    const params = new URLSearchParams();
    documents.forEach(d => params.append('documents', d));
    if (theme) { params.append('theme', theme); }
    if (format) { params.append('format', format); }

    const url = `${this.documentsUrl}/massive/print`;
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

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }

}
