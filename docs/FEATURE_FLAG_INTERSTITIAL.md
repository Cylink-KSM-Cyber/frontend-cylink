# Interstitial Feature Flag Implementation Guide

## Overview

The interstitial micro-learning feature is now controlled by a PostHog feature flag, allowing gradual rollout and A/B testing without code deployment.

## Feature Flag Configuration

### PostHog Setup

1. **Feature Flag Key**: `interstitial-micro-learning`
2. **Runtime**: Both client and server
3. **Served Value**: `true` when conditions match

### Recommended PostHog Settings

```yaml
Key: interstitial-micro-learning
Description: Enables the 10-second interstitial page with cyber security micro-learning content when users click short URLs
Enable: ✅ Yes
Create Usage Dashboard: ✅ Yes (recommended for tracking metrics)
Persist Flag: ✅ Yes (ensures consistency across authentication)
Evaluation Runtime: Both client and server
```

### Optional Payload Configuration

You can optionally configure the feature behavior via JSON payload:

```json
{
  "countdownDuration": 10,
  "enableAnalytics": true,
  "showManualButton": true,
  "minTimeBeforeManualButton": 10
}
```

## Rollout Strategy

### Phase 1: Internal Testing (Week 1)

```
Condition: Email ends with @cylink.id
Rollout: 100% of matching users
```

### Phase 2: Beta Users (Week 2-3)

```
Condition: All users
Rollout: 5% (approximately 100-200 users)
```

### Phase 3: Gradual Rollout (Week 4+)

```
Week 4: 25%
Week 5: 50%
Week 6: 75%
Week 7: 100% (if metrics are good)
```

## How It Works

### Middleware

1. When a short URL is accessed, middleware always passes request to InterstitialPage
2. No feature flag evaluation in middleware (Edge Runtime limitation)
3. Simple pass-through for all short URL requests

**File**: `src/middleware.ts`

**Note**: Next.js middleware runs on Edge Runtime which doesn't support Node.js APIs required by `posthog-node`, so server-side feature flag evaluation isn't possible.

### Client-Side (Interstitial Page) - Primary Evaluation

1. **Component loads** and checks PostHog feature flag on mount
2. Uses PostHog JS SDK for client-side evaluation
3. **If enabled**: Shows interstitial experience with countdown
4. **If disabled**: Fetches original URL and redirects immediately
5. Provides graceful fallback if PostHog isn't loaded (fails open)

**File**: `src/app/[shortCode]/InterstitialPage.tsx`

## Code Implementation

### Constants

All feature flag keys are centralized in:

```typescript
// src/constants/featureFlags.ts
export const FEATURE_FLAG_INTERSTITIAL = "interstitial-micro-learning";
```

### Client-Side Check (React Component - Primary Evaluation)

```typescript
import { posthog } from "@/utils/posthogClient";
import { FEATURE_FLAG_INTERSTITIAL } from "@/constants/featureFlags";

useEffect(() => {
  if (posthog.__loaded) {
    const isEnabled = posthog.isFeatureEnabled(FEATURE_FLAG_INTERSTITIAL);
    if (isEnabled === false) {
      // Fetch original URL and redirect immediately
      fetchOriginalUrl().then((urlResult) => {
        if (urlResult?.original_url) {
          window.location.replace(urlResult.original_url);
        }
      });
    }
  }
}, []);
```

## Metrics to Monitor

### Success Indicators

- ✅ **Completion Rate**: > 85% of users complete the countdown
- ✅ **Auto-redirect Success**: > 95% auto-redirect without manual intervention
- ✅ **Average Time Spent**: ~10 seconds (as expected)

### Warning Signs

- ⚠️ **Bounce Rate**: > 15% (users leaving during countdown)
- ⚠️ **Manual Redirect Usage**: > 5% (indicates auto-redirect issues)
- ⚠️ **Error Rate**: > 1%

### PostHog Dashboard

The "Create usage dashboard" option automatically tracks:

- Call volume trends
- Variant distribution (enabled vs disabled)
- Feature flag evaluation frequency
- User segments experiencing each variant

## Troubleshooting

### Feature Flag Not Working

1. **Check PostHog is Initialized**

   ```typescript
   console.log("PostHog loaded:", posthog.__loaded);
   ```

2. **Verify Environment Variables**

   ```bash
   NEXT_PUBLIC_POSTHOG_KEY=your_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
   ```

3. **Check Network Tab**

   - Look for requests to `/ingest/decide`
   - Verify feature flag is returned in response

4. **Test with Specific User**
   ```typescript
   // In browser console
   posthog.isFeatureEnabled("interstitial-micro-learning");
   ```

### Server-Side Issues

1. **Check Logs**

   ```bash
   # Look for feature flag evaluation logs
   grep "interstitial enabled" logs
   ```

2. **Verify PostHog Node SDK**

   ```bash
   npm list posthog-node
   ```

3. **Test Distinct ID Generation**
   - Check middleware logs for `distinctId` values
   - Ensure consistent IDs across requests

## Rollback Plan

If issues arise:

1. **Immediate**: Set rollout to 0% in PostHog
2. **Quick**: Disable the feature flag entirely
3. **Code-level**: Set default to `false` in code

```typescript
// Emergency rollback in code
const isEnabled = await isFeatureEnabledServer(
  FEATURE_FLAG_INTERSTITIAL,
  distinctId
);

// Force disable regardless of PostHog response
const finalDecision =
  isEnabled && process.env.INTERSTITIAL_EMERGENCY_DISABLE !== "true";
```

## Testing

### Local Testing

1. **Enable for Your Account**

   ```
   PostHog UI → Feature Flags → Add condition
   Email equals your@email.com
   Rollout: 100%
   ```

2. **Test Short URL**

   ```
   http://localhost:3000/testclaude
   ```

3. **Check Console Logs**
   ```typescript
   // Should see in browser console
   Interstitial feature flag enabled for testclaude
   ```

### Testing Disabled State

1. **Set Rollout to 0%** in PostHog
2. **Clear Cookies** to reset distinct ID
3. **Access Short URL** → Should redirect directly
4. **Check Middleware Logs** → Should see "interstitial disabled"

## Best Practices

1. ✅ **Always Test Locally First**
2. ✅ **Monitor Metrics During Rollout**
3. ✅ **Increase Rollout Gradually**
4. ✅ **Keep Rollback Plan Ready**
5. ✅ **Document Any Issues**
6. ✅ **Communicate Changes to Team**

## Support

For issues or questions:

- Check PostHog documentation: https://posthog.com/docs/feature-flags
- Review middleware logs
- Contact development team

---

**Last Updated**: November 16, 2025
**Version**: 1.3.0
