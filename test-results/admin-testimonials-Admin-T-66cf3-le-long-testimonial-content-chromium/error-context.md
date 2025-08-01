# Page snapshot

```yaml
- dialog "Add New Testimonial":
  - heading "Add New Testimonial" [level=2]
  - paragraph: Create a new client testimonial
  - text: Name *
  - textbox "Name *"
  - text: Designation *
  - textbox "Designation *"
  - text: Company
  - textbox "Company"
  - text: Location
  - textbox "Location"
  - text: Content *
  - textbox "Content *"
  - text: Rating
  - spinbutton "Rating": "5"
  - text: Avatar URL
  - textbox "Avatar URL"
  - switch "Featured"
  - text: Featured
  - switch "Approved"
  - text: Approved
  - button "Cancel"
  - button "Create"
  - button "Close":
    - img
    - text: Close
```