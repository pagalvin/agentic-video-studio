export const OAUTH_FPS = 30;
export const OAUTH_BEAT_FRAMES = 300;

export const protocolColors = {
  redirect: '#67d9ff', code: '#ffcd77', key: '#c6a2ff',
  access: '#75edb0', id: '#f6a5d6', cookie: '#9db9ff',
  request: '#a8bacd', data: '#d8ecf7',
};
export type Payload = keyof typeof protocolColors;
export type Lane = 0 | 1 | 2 | 3;
export type Message = {
  from: Lane; to: Lane; label: string; payload: Payload; badge: string;
};
export type OAuthBeat = {
  chapter: string; title: string; caption: string; caution: string;
  panelTitle: string; points: string[]; messages: Message[];
};

export const oauthBeats: OAuthBeat[] = [
  {
    chapter: '01 / ROLES + BOUNDARIES', title: 'Access is a conversation.',
    caption: 'OAuth 2.0 delegates access to protected resources. OpenID Connect adds authentication for sign-in.',
    caution: 'This authorization-code example uses a confidential server-side client, not a browser-only SPA.',
    panelTitle: 'FOUR PARTICIPANTS',
    points: ['User + browser: follows redirects.', 'Client: asks for authorized access.', 'Authorization server: grants tokens.', 'Resource API: checks access.'],
    messages: [
      {from: 0, to: 1, label: 'User starts at the client application', payload: 'request', badge: 'START'},
      {from: 1, to: 3, label: 'Goal: access an API with permission', payload: 'access', badge: 'ACCESS'},
    ],
  },
  {
    chapter: '02 / AUTHORIZATION CODE + PKCE', title: 'Create a proof before redirecting.',
    caption: 'The client creates a random verifier and derives an S256 challenge. The verifier stays with the client.',
    caution: 'The challenge travels in the authorization request. The verifier is revealed only at the token exchange.',
    panelTitle: 'PKCE / PROOF KEY',
    points: ['Random verifier: kept by the client.', 'SHA-256 + base64url encoding.', 'Derived challenge: sent to /authorize.', 'The server later checks the relationship.'],
    messages: [],
  },
  {
    chapter: '02 / AUTHORIZATION CODE + PKCE', title: 'The browser carries the request.',
    caption: 'The client redirects the browser to the authorization endpoint with scope, state and the PKCE challenge.',
    caution: 'Use HTTPS and an exactly registered redirect URI. State binds the callback to the initiating session.',
    panelTitle: 'AUTHORIZATION REQUEST',
    points: ['response_type=code', 'client_id + redirect_uri + scopes', 'state + code_challenge (S256)', 'OIDC sign-in: openid + nonce.'],
    messages: [
      {from: 1, to: 0, label: '302 redirect to /authorize', payload: 'redirect', badge: 'REDIRECT'},
      {from: 0, to: 2, label: 'Authorization request + challenge', payload: 'key', badge: 'CHALLENGE'},
    ],
  },
  {
    chapter: '02 / AUTHORIZATION CODE + PKCE', title: 'Authenticate. Authorize.',
    caption: 'The authorization server handles user sign-in and required consent according to policy.',
    caution: 'Credentials go to the identity provider, not to the client app. Existing sessions may avoid a prompt.',
    panelTitle: 'USER INTERACTION',
    points: ['Sign-in establishes user identity.', 'Consent/policy governs requested access.', 'Permissions can require administrator approval.', 'OAuth access and OIDC sign-in are distinct.'],
    messages: [
      {from: 2, to: 0, label: 'Sign-in and consent UI, when needed', payload: 'redirect', badge: 'SIGN IN'},
      {from: 0, to: 2, label: 'User interaction at the identity provider', payload: 'request', badge: 'APPROVE'},
    ],
  },
  {
    chapter: '02 / AUTHORIZATION CODE + PKCE', title: 'A code returns. Not an access token.',
    caption: 'The browser follows the callback redirect to the client, carrying a short-lived authorization code and state.',
    caution: 'The client checks state. The code is single-use and must be redeemed; it is not an API credential.',
    panelTitle: 'FRONT CHANNEL',
    points: ['Authorization server -> browser.', 'Browser -> registered client callback.', 'Callback contains code + state.', 'Verify state before continuing.'],
    messages: [
      {from: 2, to: 0, label: '302 to registered callback: code + state', payload: 'code', badge: 'CODE'},
      {from: 0, to: 1, label: 'Follow callback; client validates state', payload: 'code', badge: 'CODE'},
    ],
  },
  {
    chapter: '02 / AUTHORIZATION CODE + PKCE', title: 'Redeem the code with proof.',
    caption: 'The server-side client sends the code and verifier to the token endpoint and authenticates as a confidential client.',
    caution: 'PKCE does not replace client authentication. Public clients use PKCE without an embedded client secret.',
    panelTitle: 'BACK CHANNEL / HTTPS',
    points: ['grant_type=authorization_code', 'Code + redirect_uri + verifier.', 'Confidential client authentication.', 'Server compares derived proof to challenge.'],
    messages: [
      {from: 1, to: 2, label: 'POST /token: code + verifier + client authentication', payload: 'key', badge: 'VERIFIER'},
    ],
  },
  {
    chapter: '02 / AUTHORIZATION CODE + PKCE', title: 'Two tokens. Different jobs.',
    caption: 'An access token authorizes API access. With OpenID Connect, an ID token tells the client about authentication.',
    caution: 'Validate the ID token, including issuer, audience and nonce. Never use an ID token as an API access token.',
    panelTitle: 'TOKEN DESTINATIONS',
    points: ['ACCESS TOKEN -> intended resource API.', 'ID TOKEN -> client, for OIDC sign-in.', 'Tokens remain server-side in this example.', 'Refresh tokens are policy/scope-dependent.'],
    messages: [
      {from: 2, to: 1, label: 'Token response: access token', payload: 'access', badge: 'ACCESS TOKEN'},
      {from: 2, to: 1, label: 'Also: ID token when using OIDC', payload: 'id', badge: 'ID TOKEN'},
    ],
  },
  {
    chapter: '02 / AUTHORIZATION CODE + PKCE', title: 'The API enforces access.',
    caption: 'The client calls the resource with an access token. The API validates the token and required permissions.',
    caution: 'For JWT access tokens: validate signature, issuer, audience, expiry and scopes/roles. Other token formats may use introspection.',
    panelTitle: 'RESOURCE REQUEST',
    points: ['Authorization: Bearer <access token>', 'Intended audience must match this API.', 'Valid token does not imply all permissions.', 'API returns data only if authorized.'],
    messages: [
      {from: 1, to: 3, label: 'API request + access token', payload: 'access', badge: 'ACCESS TOKEN'},
      {from: 3, to: 1, label: 'Authorized resource response', payload: 'data', badge: 'DATA'},
    ],
  },
  {
    chapter: '03 / CLIENT CREDENTIALS', title: 'Sometimes there is no user.',
    caption: 'A confidential service authenticates directly to the token endpoint using the client credentials grant.',
    caution: 'No browser redirects or delegated user identity. Keep credentials out of browsers and source code.',
    panelTitle: 'MACHINE-TO-MACHINE',
    points: ['grant_type=client_credentials', 'Service authenticates with a credential.', 'Certificate or workload federation where supported.', 'Permissions belong to the application.'],
    messages: [
      {from: 1, to: 2, label: 'POST /token: client_credentials + authentication', payload: 'key', badge: 'APP PROOF'},
    ],
  },
  {
    chapter: '03 / CLIENT CREDENTIALS', title: 'Application access, not user access.',
    caption: 'The service receives an app-only access token and calls the API within its assigned application permissions.',
    caution: 'Client credentials does not issue an ID token or refresh token. Acquire another access token when needed.',
    panelTitle: 'APP-ONLY TOKEN',
    points: ['Application identity, not an acting user.', 'API enforces application authorization.', 'Entra: app roles / application permissions.', 'Permissions need appropriate admin assignment.'],
    messages: [
      {from: 2, to: 1, label: 'App-only access token', payload: 'access', badge: 'APP TOKEN'},
      {from: 1, to: 3, label: 'Service calls API with application access', payload: 'access', badge: 'APP TOKEN'},
      {from: 3, to: 1, label: 'Authorized response', payload: 'data', badge: 'DATA'},
    ],
  },
  {
    chapter: '04 / SAME PROTOCOL, AZURE SERVICES', title: 'Now put the web app in Azure.',
    caption: 'The same roles become a browser, an Azure App Service web app, Microsoft Entra ID and a protected API.',
    caution: 'Chosen architecture: server-side web app / backend-for-frontend. Azure hosting alone does not determine the OAuth flow.',
    panelTitle: 'EXPLICIT ARCHITECTURE',
    points: ['App Service hosts the confidential client.', 'Entra ID is the authorization server.', 'The API has its own resource registration.', 'This example uses app-managed OIDC/MSAL, not an Easy Auth walkthrough.'],
    messages: [],
  },
  {
    chapter: '04 / AZURE WEB APP REPLAY', title: 'The app redirects to Entra ID.',
    caption: 'The App Service backend creates PKCE, state and nonce, then sends the browser to Entra for delegated access and sign-in.',
    caution: 'Use a Web redirect URI, least-privilege API scopes and openid for OIDC. An example callback is /signin-oidc.',
    panelTitle: 'APP REGISTRATION',
    points: ['Registered HTTPS callback on the web app.', 'API delegated scope, such as api://<id>/read.', 'login.microsoftonline.com/<tenant>', '/oauth2/v2.0/authorize'],
    messages: [
      {from: 0, to: 1, label: 'GET web app / sign in', payload: 'request', badge: 'SIGN IN'},
      {from: 1, to: 0, label: '302 to Entra /authorize', payload: 'redirect', badge: 'REDIRECT'},
      {from: 0, to: 2, label: 'openid + API scope + challenge + state + nonce', payload: 'key', badge: 'CHALLENGE'},
    ],
  },
  {
    chapter: '04 / AZURE WEB APP REPLAY', title: 'Entra returns the code via the browser.',
    caption: 'After sign-in and required consent, the browser delivers the authorization response to the App Service callback.',
    caution: 'The authentication library checks state and handles protocol errors before redeeming the code.',
    panelTitle: 'BROWSER HANDOFF',
    points: ['Sign-in takes place at Entra ID.', 'Consent and tenant policies apply.', 'Code + state return to the web callback.', 'The browser still has no OAuth access token.'],
    messages: [
      {from: 0, to: 2, label: 'Sign-in + required consent at Entra', payload: 'request', badge: 'CONSENT'},
      {from: 2, to: 0, label: 'Redirect to web callback: code + state', payload: 'code', badge: 'CODE'},
      {from: 0, to: 1, label: 'Callback to App Service backend', payload: 'code', badge: 'CODE'},
    ],
  },
  {
    chapter: '04 / AZURE WEB APP REPLAY', title: 'The backend redeems and validates.',
    caption: 'The web app exchanges the code with its verifier and confidential-client authentication, then validates the OIDC response.',
    caution: 'Keep credentials and OAuth tokens on the server. Use maintained authentication libraries, not hand-written protocol code.',
    panelTitle: 'SERVER-TO-SERVER',
    points: ['POST /oauth2/v2.0/token over HTTPS.', 'Code + verifier + client authentication.', 'Validate ID token and expected nonce.', 'Store access tokens in a protected server cache.'],
    messages: [
      {from: 1, to: 2, label: 'Code + verifier + confidential-client authentication', payload: 'key', badge: 'VERIFIER'},
      {from: 2, to: 1, label: 'Access token for API + OIDC ID token for client', payload: 'access', badge: 'TOKENS'},
    ],
  },
  {
    chapter: '04 / AZURE WEB APP REPLAY', title: 'The browser gets a session cookie.',
    caption: 'The backend establishes an application session. The browser receives a secure session cookie, not the OAuth tokens.',
    caution: 'Use Secure, HttpOnly and appropriate SameSite settings, plus CSRF defenses. A cookie does not remove all browser risks.',
    panelTitle: 'TOKEN STORAGE BOUNDARY',
    points: ['Browser: application-session cookie.', 'Server: OAuth tokens + token cache.', 'ID token: sign-in to this client.', 'Access token: authorization at the API.'],
    messages: [
      {from: 1, to: 0, label: 'Set-Cookie: secure application session', payload: 'cookie', badge: 'SESSION'},
      {from: 0, to: 1, label: 'Subsequent app request with session cookie', payload: 'cookie', badge: 'SESSION'},
    ],
  },
  {
    chapter: '04 / AZURE WEB APP REPLAY', title: 'App Service calls the protected API.',
    caption: 'The backend attaches the delegated access token. The API validates Entra-issued credentials and enforces the required scope.',
    caution: 'Check signature, issuer, API audience, expiry and permissions. The browser receives the app response, not an API bearer token.',
    panelTitle: 'DELEGATED RESOURCE ACCESS',
    points: ['Bearer token represents delegated access.', 'API validates JWT and required scp.', 'App returns a page or data to the browser.', 'The ID token is never sent to this API.'],
    messages: [
      {from: 1, to: 3, label: 'Backend -> API: Bearer access token', payload: 'access', badge: 'ACCESS TOKEN'},
      {from: 3, to: 1, label: 'Authorized API response', payload: 'data', badge: 'API DATA'},
      {from: 1, to: 0, label: 'Application response to the browser', payload: 'data', badge: 'APP DATA'},
    ],
  },
  {
    chapter: '05 / AZURE WORKLOAD IDENTITY', title: 'For background work, consider managed identity.',
    caption: 'An authorized Azure workload can acquire an Entra access token through managed identity without managing a client secret.',
    caution: 'This is application access, not a replacement for delegated user access. Assign permissions on the target resource first.',
    panelTitle: 'SEPARATE APP-ONLY PATH',
    points: ['Enable a supported managed identity.', 'Azure SDK uses the platform identity endpoint.', 'Azure obtains an Entra token for the workload.', 'The target API/resource must authorize it.'],
    messages: [
      {from: 1, to: 2, label: 'SDK / platform identity endpoint (simplified)', payload: 'request', badge: 'IDENTITY'},
      {from: 2, to: 1, label: 'Entra-issued workload access token', payload: 'access', badge: 'APP TOKEN'},
      {from: 1, to: 3, label: 'Authorized workload calls target resource', payload: 'access', badge: 'APP TOKEN'},
    ],
  },
  {
    chapter: '06 / CHOOSE THE RIGHT FLOW', title: 'Different flows. Clear boundaries.',
    caption: 'Use authorization code with PKCE for user-driven access, and application identity for service-to-service work.',
    caution: 'Avoid password grants and new implicit-flow designs. This is a focused overview, not every OAuth grant or a deployment guide.',
    panelTitle: 'TAKEAWAYS',
    points: ['OAuth: authorized API access.', 'OIDC: client sign-in and ID tokens.', 'PKCE: binds code redemption to its initiator.', 'Azure web app: server tokens + browser session.'],
    messages: [
      {from: 0, to: 1, label: 'User-driven: authorization code + PKCE + OIDC', payload: 'code', badge: 'DELEGATED'},
      {from: 1, to: 3, label: 'Service-driven: application access', payload: 'access', badge: 'APP-ONLY'},
    ],
  },
];
export const OAUTH_DURATION = oauthBeats.length * OAUTH_BEAT_FRAMES;

export const genericLanes = [
  {title: 'User / browser', subtitle: 'User-agent / front channel', boundary: 'BROWSER'},
  {title: 'Client application', subtitle: 'Server-side confidential client', boundary: 'APP SERVER'},
  {title: 'Authorization server', subtitle: 'Sign-in, grants and tokens', boundary: 'IDENTITY PROVIDER'},
  {title: 'Resource API', subtitle: 'Protected data / permissions', boundary: 'RESOURCE'},
];
export const azureLanes = [
  genericLanes[0],
  {title: 'Azure App Service', subtitle: 'Web app / backend-for-frontend', boundary: 'APP SERVER / AZURE'},
  {title: 'Microsoft Entra ID', subtitle: 'Authorization server + OIDC', boundary: 'IDENTITY PROVIDER'},
  {title: 'Protected API', subtitle: 'Entra-protected resource', boundary: 'RESOURCE / AZURE'},
];
