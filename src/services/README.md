# Mock Authentication Service

This service provides mock authentication for local development when the backend API is not available.

## Usage

The mock service automatically activates in development mode (`import.meta.env.DEV`). You can also force it to use mock data by setting the environment variable:

```bash
VITE_USE_MOCK_AUTH=true
```

## Mock Data

The service returns mock user data:
- **Name**: John Doe
- **Email**: john.doe@example.com
- **User Type**: PHOTOGRAPHER
- **Profile Picture**: Mock Google profile URL
- **Status**: Active

## Environment Detection

- **Development**: Uses mock by default
- **Production**: Uses real API unless `VITE_USE_MOCK_AUTH=true` is set

## Switching to Real API

When your backend is deployed, simply remove the `VITE_USE_MOCK_AUTH` environment variable or set it to `false`.
