// FILE: services/auth/architecture.js

/**
 * AFFYNIX AUTHENTICATION SUBSTRATE
 * JWT-based stateless auth with refresh token rotation
 * Multi-tenant support with role-based access control
 */

const AUTH_SERVICE_SPEC = {
  // Identity Providers
  providers: {
    local: {
      enabled: true,
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        preventReuse: 5
      }
    },
    oauth: {
      google: { enabled: true },
      github: { enabled: true },
      stripe: { enabled: true } // For customer portal
    }
  },
  
  // Token Strategy
  tokens: {
    access: {
      type: 'JWT',
      algorithm: 'RS256', // Asymmetric for distributed verification
      expiry: '15m',
      claims: ['sub', 'role', 'tenant', 'permissions']
    },
    refresh: {
      type: 'Opaque',
      storage: 'Redis',
      expiry: '7d',
      rotation: true, // Rotate on each use
      maxDevices: 5
    }
  },
  
  // Role Hierarchy
  roles: {
    superadmin: {
      permissions: ['*'],
      description: 'Full system access'
    },
    admin: {
      permissions: [
        'products:*',
        'analytics:read',
        'subdomains:read',
        'users:manage'
      ],
      description: 'Domain administrator'
    },
    subdomain_owner: {
      permissions: [
        'subdomain:manage:own',
        'billing:read:own',
        'analytics:read:own'
      ],
      description: 'Subdomain lease holder'
    },
    api_client: {
      permissions: [
        'api:read',
        'analytics:read:own'
      ],
      description: 'API-only access'
    }
  },
  
  // Multi-factor Authentication
  mfa: {
    totp: { enabled: true },
    sms: { enabled: false }, // Cost consideration
    email: { enabled: true },
    webauthn: { enabled: true } // Passkeys
  },
  
  // Session Management
  sessions: {
    storage: 'Redis',
    cookieSettings: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      domain: '.affynix.com' // Cross-subdomain
    },
    concurrentSessions: 5,
    deviceTracking: true
  }
};