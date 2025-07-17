# PostHog Integration Guide

This guide explains how to use PostHog in our Next.js application for analytics and user tracking.

## Setup Status

PostHog has been successfully integrated into our application with:

- Client-side tracking via `posthog-js`
- Server-side tracking via `posthog-node`
- Automatic pageview tracking
- User identification on login
- Custom event tracking
- CI/CD integration for staging environment

## Environment Variables

The following environment variables are required:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_CT5Fe17VBkHoT9OILqJ798dLeLagtTdi1eRp64lfxH1
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

These have been added to:
- Local `.env` file
- GitHub Actions secrets for CI/CD pipeline

## Using PostHog in Components

### Importing the PostHog Client

```typescript
import posthogClient from "@/utils/posthogClient";
```

### Identifying Users

When a user logs in or their identity is established, use:

```typescript
posthogClient.identifyUser(userId, {
  email: user.email,
  name: user.name,
  role: user.role,
  // Add any other user properties you want to track
});
```

This has been implemented in the `AuthContext` when a user logs in.

### Tracking Custom Events

To track custom events throughout the application:

```typescript
posthogClient.captureEvent('event_name', {
  // Optional properties related to the event
  property1: 'value1',
  property2: 'value2'
});
```

### Example Events to Track

Here are some examples of events you might want to track:

#### User Actions
```typescript
// When user creates a new resource
posthogClient.captureEvent('resource_created', {
  resource_type: 'project',
  resource_id: project.id
});

// When user updates settings
posthogClient.captureEvent('settings_updated', {
  changed_settings: ['theme', 'notifications']
});

// When user performs a search
posthogClient.captureEvent('search_performed', {
  query: searchQuery,
  results_count: results.length
});
```

#### Feature Usage
```typescript
// When a feature is used
posthogClient.captureEvent('feature_used', {
  feature_name: 'export_to_pdf',
  context: 'dashboard'
});

// When a user interacts with a specific component
posthogClient.captureEvent('component_interaction', {
  component: 'data_filter',
  action: 'applied',
  filters_count: 3
});
```

#### Error Tracking
```typescript
// When an error occurs
posthogClient.captureEvent('error_occurred', {
  error_type: 'api_failure',
  error_message: error.message,
  component: 'UserDashboard'
});
```

### Resetting User Identity on Logout

When a user logs out, reset their identity:

```typescript
posthogClient.resetUser();
```

This has been implemented in the `logout` function in `AuthContext`.

## Viewing Analytics Data

To view the collected analytics data:

1. Log in to the PostHog dashboard at https://eu.posthog.com
2. Navigate to "Insights" to create custom reports
3. Use "Sessions" to see user journeys
4. Check "Events" to see all tracked events

## Best Practices

1. Be consistent with event naming (use snake_case)
2. Group related events with common prefixes (e.g., `user_`, `feature_`, `error_`)
3. Include relevant properties with each event for better analysis
4. Don't include sensitive or personal information in events
5. Test your events in development mode to ensure they're being captured correctly

## Troubleshooting

If events aren't being tracked:

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure the PostHog client is properly initialized
4. Check for ad blockers that might be blocking analytics requests