# RedFlix Authentication System Guide

## Overview

This guide documents the authentication system implementation for RedFlix, which uses Supabase Auth for real user authentication.

## What Changed

### Before (Fake Authentication)
- ❌ Accepted any email/password combination
- ❌ Generated random fake user IDs
- ❌ No real database validation
- ❌ Simulated delays and fake tokens
- ❌ No actual security

### After (Real Supabase Authentication)
- ✅ Real JWT-based authentication
- ✅ Validates credentials against Supabase database
- ✅ Proper session management
- ✅ Persistent login across page reloads
- ✅ Secure token handling

## Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Get Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Update .env File

```env
# SUPABASE Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANT**: Never commit the `.env` file to git. It's already in `.gitignore`.

## Features

### User Authentication

#### Sign In
```typescript
const { signIn } = useAuth();

try {
  await signIn('user@example.com', 'password123');
  // User is now authenticated
} catch (error) {
  // Handle errors (invalid credentials, etc.)
}
```

#### Sign Up
```typescript
const { signUp } = useAuth();

try {
  await signUp('user@example.com', 'password123', 'User Name');
  // User account created
} catch (error) {
  // Handle errors (email already exists, weak password, etc.)
}
```

#### Sign Out
```typescript
const { signOut } = useAuth();

await signOut();
// User is logged out
```

### Session Management

- **Auto Login**: If user has an active session, they're automatically logged in on page load
- **Session Persistence**: Sessions persist across page reloads
- **Token Refresh**: Supabase automatically handles token refresh

### Auth Context Properties

The `useAuth()` hook provides:

```typescript
interface AuthContextType {
  user: User | null;                    // Current user object
  loading: boolean;                     // Loading state
  error: string | null;                 // Last error message
  isAuthenticated: boolean;             // True if user is logged in
  accessToken: string | null;           // JWT access token
  selectedProfile: User | null;         // Current profile (same as user)
  signIn: (email, password) => Promise<void>;
  signUp: (email, password, name) => Promise<void>;
  signOut: () => Promise<void>;
  signout: () => Promise<void>;         // Alias for compatibility
  updateProfile: (data) => Promise<void>;
}
```

## Error Handling

The system provides user-friendly error messages:

### Login Errors
- **Invalid credentials**: "Email ou senha incorretos"
- **Unconfirmed email**: "Confirme seu email antes de fazer login"
- **Rate limiting**: "Muitas tentativas. Aguarde alguns minutos"

### Signup Errors
- **Email exists**: "Este email já está cadastrado"
- **Weak password**: "A senha deve ter no mínimo 6 caracteres"
- **Invalid email**: "Email inválido"

## Security Best Practices

### ✅ Implemented
- JWT-based authentication
- Secure password hashing (handled by Supabase)
- HTTP-only session management
- Environment variable validation
- No credentials in source code

### 🔒 Recommendations
1. **Enable Email Confirmation** in Supabase:
   - Go to Authentication → Settings
   - Enable "Confirm email" option

2. **Configure Row Level Security (RLS)**:
   - Go to Database → Tables
   - Enable RLS on all tables
   - Add appropriate policies

3. **Password Requirements**:
   - Minimum 8 characters (configured in Supabase)
   - Mix of letters and numbers recommended

4. **Rate Limiting**:
   - Supabase automatically rate limits authentication attempts
   - Prevents brute force attacks

## Testing Checklist

- [ ] Login with valid credentials → Success
- [ ] Login with invalid email → Error message shown
- [ ] Login with wrong password → Error message shown
- [ ] Signup with new email → Account created
- [ ] Signup with existing email → Error message shown
- [ ] Reload page while logged in → User stays logged in
- [ ] Logout → User is logged out and redirected
- [ ] Try accessing protected routes when logged out → Redirected to login

## Troubleshooting

### "Supabase configuration is missing" error
- Check that `.env` file exists
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart the development server after changing `.env`

### "Invalid API key" error
- Verify you're using the **anon/public** key, not the service role key
- Check that the key is a valid JWT (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

### Session not persisting
- Check browser console for errors
- Verify Supabase URL is correct
- Clear browser localStorage and try again

### "Email not confirmed" error
- Check if email confirmation is enabled in Supabase
- Look for confirmation email in user's inbox
- Can be disabled in Supabase settings for testing

## API Reference

### User Object
```typescript
interface User {
  id: string;          // Unique user ID from Supabase
  email: string;       // User's email address
  name: string;        // Display name
  avatar?: string;     // Avatar URL (auto-generated from Dicebear)
  role?: string;       // User role (default: 'user')
}
```

### Auth Functions

#### signIn(email: string, password: string): Promise<void>
Authenticates user with email and password.

**Throws:**
- Error with message if authentication fails

#### signUp(email: string, password: string, name: string): Promise<void>
Creates a new user account.

**Throws:**
- Error with message if signup fails

#### signOut(): Promise<void>
Logs out the current user.

#### updateProfile(data: Partial<User>): Promise<void>
Updates user profile information in Supabase.

**Parameters:**
- `data.name` - New display name
- `data.avatar` - New avatar URL

## Development vs Production

### Development
- Email confirmation can be disabled for faster testing
- Use test accounts
- Console logs show authentication flow

### Production
- Enable email confirmation
- Enable password strength requirements
- Set up proper RLS policies
- Monitor authentication logs
- Consider adding 2FA

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/auth-signin)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Support

For issues or questions:
1. Check this guide first
2. Review Supabase documentation
3. Check browser console for error messages
4. Verify environment variables are correct
