import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── GitHub OAuth Config ────────────────────────────────────────────────────
// To use real GitHub OAuth:
//  1. Create a GitHub OAuth App at https://github.com/settings/developers
//  2. Set Authorization callback URL to: http://localhost:3000
//  3. Set REACT_APP_GITHUB_CLIENT_ID in your .env file
// ─────────────────────────────────────────────────────────────────────────────

const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || '';
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_USER_API  = 'https://api.github.com/user';
const SCOPES           = 'read:user user:email';
const SESSION_KEY      = 'pokedex-auth-session';

// ─── Mock user (dev mode — no Client ID configured) ──────────────────────────
const MOCK_USER = {
  id: 0,
  login: 'trainer_ash',
  name: 'Ash Ketchum',
  avatar_url: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=pikachu&backgroundColor=4ecdc4',
  html_url: 'https://github.com',
  mock: true,
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // ── BUG FIX 1: Only restore REAL token sessions from localStorage.
  // Mock sessions are intentionally NOT persisted so the login screen
  // always appears on a fresh page load / after logout.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
          const session = JSON.parse(stored);
          if (session.mock) {
            // Stale mock entry from old builds — clear it
            localStorage.removeItem(SESSION_KEY);
          } else if (session.token) {
            // Real token — re-verify with GitHub
            const profile = await fetchGitHubUser(session.token);
            if (profile) {
              setUser({ ...profile, token: session.token });
            } else {
              localStorage.removeItem(SESSION_KEY);
            }
          }
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Handle OAuth redirect callback (code in URL) ──────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get('code');
    const state  = params.get('state');

    if (!code) return;

    // Remove OAuth params from URL immediately
    window.history.replaceState({}, document.title, window.location.pathname);

    // Verify state (CSRF protection)
    const savedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');

    if (state !== savedState) {
      console.error('OAuth state mismatch');
      setLoading(false);
      return;
    }

    handleOAuthCode(code);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOAuthCode = async (code) => {
    setAuthLoading(true);
    try {
      // ── Real flow: uncomment when you have a backend ─────────────────────
      // const res = await fetch('/api/auth/github/callback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code }),
      // });
      // const { access_token, error } = await res.json();
      // if (error || !access_token) throw new Error(error || 'Token exchange failed');
      // const profile = await fetchGitHubUser(access_token);
      // persistSession({ token: access_token });
      // setUser({ ...profile, token: access_token });

      // ── Demo fallback (no backend) ────────────────────────────────────────
      await new Promise(r => setTimeout(r, 700));
      // Mock user is set in state ONLY — not saved to localStorage
      setUser(MOCK_USER);
    } catch (err) {
      console.error('OAuth callback error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Log in with GitHub ────────────────────────────────────────────────────
  const loginWithGitHub = useCallback(() => {
    if (!GITHUB_CLIENT_ID) {
      // Dev mode: instant mock sign-in, state only — NOT persisted
      setAuthLoading(true);
      setTimeout(() => {
        setUser(MOCK_USER);
        setAuthLoading(false);
      }, 800);
      return;
    }

    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id:    GITHUB_CLIENT_ID,
      redirect_uri: window.location.origin,
      scope:        SCOPES,
      state,
    });

    window.location.href = `${GITHUB_OAUTH_URL}?${params}`;
  }, []);

  // ── BUG FIX 2: Logout ────────────────────────────────────────────────────
  // Clears any real token from storage and resets user state to null.
  // Because mock sessions are never stored, this is guaranteed to always
  // return to the login screen.
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, authLoading, loginWithGitHub, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

async function fetchGitHubUser(token) {
  try {
    const res = await fetch(GITHUB_USER_API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// eslint-disable-next-line no-unused-vars
// Only called for real token sessions — mock sessions intentionally excluded
// ✅ Replace with this (adds eslint-disable comment)
// eslint-disable-next-line no-unused-vars
function persistSession(session) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch { /* storage full */ }
  }