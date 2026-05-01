import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { loginWithGitHub, authLoading } = useAuth();
  const isDev = !process.env.REACT_APP_GITHUB_CLIENT_ID;

  return (
    <div className={styles.page}>
      {/* Background blobs inherit from App, add extra glow */}
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoRow}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>Pokédex</span>
          <span className={styles.logoSub}>LITE</span>
        </div>

        <h1 className={styles.headline}>
          Catch&nbsp;'em&nbsp;all.<br />
          <span className={styles.highlight}>Sign in first.</span>
        </h1>

        <p className={styles.sub}>
          Browse 1 000+ Pokémon, filter by type, and build your personal
          favourites list — all synced to your account.
        </p>

        {/* Feature pills */}
        <ul className={styles.features} aria-label="Features">
          {['🔍 Smart search & filters', '❤️ Persistent favourites', '⚡ Live PokéAPI data'].map(f => (
            <li key={f} className={styles.featurePill}>{f}</li>
          ))}
        </ul>

        {/* Sign-in button */}
        <button
          className={styles.githubBtn}
          onClick={loginWithGitHub}
          disabled={authLoading}
          aria-busy={authLoading}
        >
          {authLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Signing in…
            </>
          ) : (
            <>
              <GitHubIcon />
              Continue with GitHub
            </>
          )}
        </button>

        {isDev && (
          <p className={styles.devNote}>
            <span className={styles.devBadge}>DEV MODE</span>
            No <code>REACT_APP_GITHUB_CLIENT_ID</code> set — clicking above
            signs you in with a mock account instantly.{' '}
            <a
              href="https://github.com/settings/developers"
              target="_blank"
              rel="noreferrer"
            >
              Create an OAuth App ↗
            </a>
          </p>
        )}

        <p className={styles.legal}>
          By signing in you agree to nothing in particular — this is a demo.
        </p>
      </div>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg
      className={styles.githubIcon}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
        0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755
        -1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236
        1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466
        -1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176
        0 0 1.005-.322 3.3 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404
        2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23
        1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22
        0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295
        24 12c0-6.63-5.37-12-12-12z"
      />
    </svg>
  );
}
