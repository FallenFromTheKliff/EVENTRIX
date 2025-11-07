# EVENTRIX - Backend

## Current Version: v0.2.2

### Changelog:
- **Models**
    - User model established
- **Controllers**
    - AuthController established
- **Repositories**
    - UserRepository established
- **Services**
    - AuthService established
- **Config**
    - SecurityConfig established
    - Jwt merged integrated into Config folder
    - JwtService established
    - JwtAuthFilter established
- **Others**
    - build.gradle.kts updated with dependencies
    - cleaned build using terminal to refresh dependencies

### Work-in-Progress:
- **JWT Service and Filtering**
    - Reconfiguring service and filtering to ensure expired tokens are handled
    - Analyzing code to be more robust
- **Events**
    - Analyzing events integration for users and admin

### To be implemented next:
1. Login & Register Testing
2. User Events Page functionalities
3. Admin Dashboard Page functionalities