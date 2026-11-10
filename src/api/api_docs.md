# API client

This folder contains the app's API client. Import domain callers from `src/api` (for example, `Auth`, `Account`, or `Invoice`). The shared transport in `apiMethods.ts` is an internal implementation detail.

## Configuration and request behavior

The client builds its HTTPS API base URL from `EXPO_PUBLIC_BASE_URL` and `EXPO_PUBLIC_ENDPOINT_PATH`. Requests use relative endpoint paths; the transport rejects URLs that escape the configured origin or endpoint path. Configure both environment variables for the target environment.

All `GET` requests are authenticated. Write requests are authenticated by default; `Auth.LogIn` opts out because no token exists yet. The client reads the current token from credential storage for each authenticated request, checks that it matches the expected token format, and sends it as a Bearer authorization token. This local format check does not establish whether the token is expired or still accepted; the backend makes that decision.

Authenticated writes require an idempotency key consisting of 32 lowercase hexadecimal characters. The transport sends it in the `Idempotency-Key` header. `Api.Patch` currently sends an HTTP `PUT` request.

The transport:

- Sends JSON request bodies and expects successful JSON responses to contain a `data` property.
- Returns PDF responses as an `ArrayBuffer` when requested.
- Uses 15-second request timeouts, or 30 seconds for PDF requests.
- Does not automatically retry failed requests.
- Omits browser credentials and rejects redirects.

## Authentication and expired tokens

`Auth.LogIn` posts to `/auth/login` without authentication, validates the returned Bearer token, and saves it. `Auth.CheckToken` validates the saved token with `/me`; a missing or malformed token, or a 401 from `/me`, clears credentials and reports that the user is signed out.

For authenticated requests during a session, the backend should reject an expired or otherwise unusable token with HTTP 401 and this JSON problem response:

```json
{
  "type": "about:blank",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Please sign in again.",
  "request_id": "some bs here"
}
```

The client's special sign-out behavior is triggered by the **HTTP status** being `401` and the JSON `detail` being exactly `"Please sign in again."`. It does not match on `type`, `title`, or the body's `status` field. On a match, the registered auth handler clears saved credentials and changes the app state to signed out. The request still rejects with an API error carrying the 401 status, so the caller can handle the failed operation.

Other authenticated 401 responses request reauthentication but do not use this special full sign-out path. Non-401 responses do not trigger either 401 handler behavior. The client never automatically replays a failed write after the user signs in again.

Because signing out changes the protected navigation state, a form screen may unmount after a 401. Form values are not automatically persisted; save a draft if they must survive reauthentication. A caller should not automatically replay a write unless it has an explicit, safe retry strategy.

## Errors

For non-success HTTP responses, the client uses a non-empty JSON `detail` as the error message when available, otherwise it uses a generic message. It exposes these failures as `ApiError` values with an HTTP `status` and, when available, a `requestId` from the `x-request-id` header or the problem response's `request_id`.

Network, timeout, and response-reading failures use status `0`. Unexpected successful response formats use status `502`. Callers can use `isApiError` to identify API errors.

## Available domain callers

The public barrel in `index.ts` exports these callers:

| Caller | Operations |
| --- | --- |
| `Auth` | `LogIn`, `CheckToken`, `LogOut` |
| `Account` | List accounts; get one account |
| `Invoice` | List invoices with filters; get invoice details; download an invoice PDF |
| `Machine` | List machines for an account, optionally using an `after` cursor |
| `Site` | List, get, create, update, and delete site-access rules |
| `Support` | Submit a query about an invoice |
| `User` | Get the current user's profile |
| `Orders` | No operations are currently implemented |

Account codes used in account-scoped paths must match one uppercase letter followed by three digits. Record IDs must be positive decimal integers of at most 10 digits.
