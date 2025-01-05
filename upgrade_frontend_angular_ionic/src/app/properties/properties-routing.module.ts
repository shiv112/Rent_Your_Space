import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importing components
import { PropertiesDetailComponent } from './properties-detail/properties-detail.component';
import { PropertiesPage } from './properties.page';
import { PropertiesListComponent } from './properties-list/properties-list.component';

/**
 * Define the application routes for the Properties module.
 * Each route is mapped to a specific component for better modular navigation.
 */
const routes: Routes = [
  // Default route: Renders the PropertiesPage component when the path is empty.
  {
    path: '',
    component: PropertiesPage
  },
  
  // Route for accessing PropertiesPage explicitly.
  {
    path: 'propertiespage',
    component: PropertiesPage
  }
  
  // Additional routes can be added here for other components like PropertiesDetailComponent or PropertiesListComponent.
  // Example:
  // {
  //   path: 'detail',
  //   component: PropertiesDetailComponent
  // },
  // {
  //   path: 'list',
  //   component: PropertiesListComponent
  // }
];

@NgModule({
  // Import RouterModule and register the defined routes.
  imports: [RouterModule.forChild(routes)],
  
  // Export RouterModule to make it available in other parts of the module.
  exports: [RouterModule],
})
export class PropertiesPageRoutingModule { }
