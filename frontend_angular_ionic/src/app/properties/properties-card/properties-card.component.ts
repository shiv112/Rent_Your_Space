import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesService } from 'src/app/properties/properties.service';
import { Property } from 'src/app/shared/interface/property';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-properties-card', // The component's selector
  templateUrl: './properties-card.component.html', // HTML template for this component
  styleUrls: ['./properties-card.component.scss'], // CSS/SCSS styling for this component
})
export class PropertiesCardComponent implements OnInit {

  // The property input passed to the component from a parent component
  @Input() property: Property;

  // Injecting necessary services for this component
  constructor(
    private propertiesService: PropertiesService, // Service to manage properties
    private router: Router, // Router service to handle navigation
    public userService: UserService // User service to manage user-specific actions
  ) { }

  ngOnInit(): void {
    // ngOnInit is used for component initialization, but no logic needed here for now
  }

  /**
   * This method is called when the user selects a property.
   * It sets the selected property in the PropertiesService
   * and navigates to the property details page.
   *
   * @param property - The selected property to display details for
   */
  public selectProperty(property: Property): void {
    // Set the selected property in the PropertiesService
    this.propertiesService.property = property;
    
    // Navigate to the detailed view of the selected property using its ID
    this.router.navigate(['/properties', property.property_id]);
  }
}
