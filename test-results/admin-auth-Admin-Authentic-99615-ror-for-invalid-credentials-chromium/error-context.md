# Page snapshot

```yaml
- img
- text: Admin Portal Sign in to access the TaxExclusive admin dashboard Email
- textbox "Email": invalid@test.com
- text: Password
- textbox "Password": wrongpassword
- alert: Invalid email or password
- button "Sign In"
- region "Notifications (F8)":
  - list
- button "Open contact options":
  - img
- region "Notifications (F8)":
  - list
- button "Open Next.js Dev Tools":
  - img
- alert
```