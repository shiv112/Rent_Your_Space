import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../shared/interface/api-response';
// import { properties as dummyData } from '../shared/dummy-data';
import { Property } from '../shared/interface/property';
import { headerDict } from '../shared/utility';
import { UserService } from '../user/user.service';

// API URL for property operations
const propertyUrl = environment.api.server + 'properties';

// Utility function to create request options
const requestOptions = (
  { token = '', contentType = 'application/json' },
  body = {}
) => ({
  headers: new HttpHeaders(headerDict({ token, contentType })),
  body,
});

// API Response Interfaces
interface ResProperty extends ApiResponse {
  data: Property;
}

interface ResProperties extends ApiResponse {
  data: Property[];
}

interface ResStrings extends ApiResponse {
  data: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  // API URL for fetching properties
  public apiUrl = 'https://backend-python-mongodb.vercel.app/';
  
  // Observables and Subjects for property data
  public readonly properties$: Observable<Property[]>;
  public readonly property$: Observable<Property>;
  private readonly propertiesSub = new BehaviorSubject<Property[]>([]);
  private readonly propertySub = new BehaviorSubject<Property>(null);

  // User data Observables and storage key
  public user$: Observable<any>;
  public userSub = new BehaviorSubject<any>('');
  private readonly storageKey = 'userSession';

  // Property data for local use
  propertData: any;

  constructor(private http: HttpClient, private userService: UserService) {
    this.properties$ = this.propertiesSub.asObservable();
    this.property$ = this.propertySub.asObservable();
    this.fetchProperties(); // Initial property fetch
  }

  /**
   * Fetch properties from a local JSON file (for mock or static data)
   */
  public properties_two(): any {
    this.http.get<any>('/assets/properties.json').subscribe((resp) => {
      this.propertData = resp;
      console.log(this.propertData);
      return this.propertData;
    });
  }

  // Getters and Setters for properties and property
  public get properties(): Property[] {
    return this.propertiesSub.getValue();
  }

  public set properties(property: Property[]) {
    this.propertiesSub.next(property);
  }

  public get property(): Property | null {
    return this.propertySub.getValue();
  }

  public set property(property: Property) {
    this.propertySub.next(property);
  }

  /**
   * Fetch all properties from the backend API.
   */
  public async fetchProperties(): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.get(this.apiUrl + 'properties_get'));
      return response;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific property by its ID.
   * @param id - Property ID
   */
  public async fetchProperty(id: string): Promise<void> {
    try {
      this.property = (
        await firstValueFrom(this.http.get<ResProperty>(`${propertyUrl}/${id}`))
      ).data;
    } catch (error) {
      console.error('Error fetching property:', error);
    }
  }

  /**
   * Add a new property with optional file attachment.
   * @param json - Property data
   * @param file - Optional file to upload
   */
  public async addProperty(json: any, file: File | null = null): Promise<Property> {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      if (file) formData.append('file', file, file.name);

      const response = await firstValueFrom(
        this.http.post<Property>(`${this.apiUrl}property_save`, formData)
      );
      return response;
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  }

  /**
   * Upload images for a property.
   * @param files - Array of image files
   * @param id - Property ID
   */
  public async addPropertyImage(files: File[], id: string): Promise<ResStrings> {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file, file.name));

    try {
      const token = this.userService.token();
      return await firstValueFrom(
        this.http.post<ResStrings>(
          `${propertyUrl}/upload/images/${id}`,
          formData,
          requestOptions({ token, contentType: null })
        )
      );
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }

  /**
   * Delete images for a property.
   * @param images - List of image URLs to delete
   * @param propId - Property ID
   */
  public async deletePropertyImage(images: string[], propId: string): Promise<ResStrings> {
    try {
      const token = this.userService.token();
      const url = `${propertyUrl}/upload/images/${propId}`;
      const res = await firstValueFrom(
        this.http.delete<ResStrings>(url, requestOptions({ token }, { images }))
      );

      // Update property images
      this.property.images = this.property.images.filter(
        (img) => !res.data.includes(img)
      );
      return res;
    } catch (error) {
      console.error('Error deleting images:', error);
      throw error;
    }
  }

  /**
   * Remove a property from the database.
   * @param propId - Property ID
   */
  public async removeProperty(propId: string): Promise<void> {
    try {
      const token = this.userService.token();
      const url = `${propertyUrl}/${propId}`;
      const res = await firstValueFrom(
        this.http.delete<ResProperty>(url, requestOptions({ token }))
      );

      // Update property list
      this.properties = this.properties.filter(
        (property) => property.property_id !== res.data.property_id
      );
    } catch (error) {
      console.error('Error removing property:', error);
      throw error;
    }
  }

  /**
   * Update an existing property.
   * @param updated - Updated property data
   */
  public async updateProperty(updated: Property): Promise<ResProperty> {
    try {
      const token = this.userService.token();
      const url = `${propertyUrl}/${updated.property_id}`;
      const res = await firstValueFrom(
        this.http.patch<ResProperty>(url, updated, requestOptions({ token }))
      );

      // Update properties and selected property
      this.properties = this.properties.map((property) =>
        property.property_id === updated.property_id ? res.data : property
      );
      this.property = res.data;
      return res;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }
}
