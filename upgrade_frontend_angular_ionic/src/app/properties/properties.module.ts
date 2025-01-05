import { NgModule } from '@angular/core'; // Angular module decorator
import { CommonModule } from '@angular/common'; // Common Angular utilities
import { IonicModule } from '@ionic/angular'; // Ionic UI components
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Schema for custom elements

// Shared and Feature Modules
import { SharedModule } from '../shared/shared.module'; // Shared components, directives, pipes
import { PropertiesPageRoutingModule } from './properties-routing.module'; // Routing for the properties module
import { EnquiriesPageModule } from '../enquiries/enquiries.module'; // Enquiries feature module
import { MortgageCalcPageModule } from '../mortgage-calc/mortgage-calc.module'; // Mortgage calculator feature module

// Components specific to the Properties module
import { PropertiesPage } from './properties.page'; // Main page component
import { PropertiesNewComponent } from './properties-new-modal/properties-new.component'; // Modal for creating a new property
import { PropertiesListComponent } from './properties-list/properties-list.component'; // List display for properties
import { PropertiesCardComponent } from './properties-card/properties-card.component'; // Card display for individual property
import { PropertiesDetailComponent } from './properties-detail/properties-detail.component'; // Detailed view of a property
import { PropertiesEditComponent } from './properties-edit-modal/properties-edit.component'; // Modal for editing properties
import { PropertiesCoordinatesComponent } from './properties-coordinates-modal/properties-coordinates.component'; // Modal for editing property coordinates
import { PropertiesUploadsComponent } from './properties-uploads-modal/properties-uploads.component'; // Modal for uploading property files
import { PropertiesGalleryComponent } from './properties-gallery/properties-gallery.component'; // Gallery display for property images
import { PropertiesCurrentImagesComponent } from './properties-uploads-modal/properties-current-images/properties-current-images.component'; // Current uploaded images display
import { PropertyModalComponent } from './property-modal/property-modal.component'; // Generic modal for property actions

@NgModule({
  // Import other modules needed for this module to function
  imports: [
    CommonModule, // Provides Angular common functionalities like *ngIf, *ngFor
    IonicModule, // Enables Ionic components and UI framework
    PropertiesPageRoutingModule, // Routing specific to the Properties module
    SharedModule, // Shared resources like pipes, directives, and components
    EnquiriesPageModule, // Enquiries-related features
    MortgageCalcPageModule, // Mortgage calculator-related features
  ],
  // Specify schemas to allow usage of custom web components
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // Declare all components belonging to this module
  declarations: [
    PropertiesPage, // Main page for properties
    PropertiesNewComponent, // Modal to create new properties
    PropertiesListComponent, // Displays list of properties
    PropertiesCardComponent, // Card for individual property
    PropertiesDetailComponent, // Detailed property view
    PropertiesEditComponent, // Modal to edit properties
    PropertiesCoordinatesComponent, // Modal to set property coordinates
    PropertiesUploadsComponent, // Modal for file uploads
    PropertiesGalleryComponent, // Displays image gallery
    PropertiesCurrentImagesComponent, // Displays current uploaded images
    PropertyModalComponent, // General modal for property-related actions
  ],
  // Export components that are reusable outside this module
  exports: [
    PropertiesListComponent, // Makes the properties list component reusable in other modules
  ]
})
export class PropertiesPageModule { }
