
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import styles from './UserMenu.module.css';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 72, right: 8 });
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportRight = Math.max(8, window.innerWidth - rect.right);
    setMenuPosition({
      top: rect.bottom + 8,
      right: viewportRight,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();

    const handlePointerDown = (e) => {
      const inTrigger = wrapRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inTrigger && !inDropdown) setOpen(false);
    };

    const handleLayout = () => updateMenuPosition();

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('resize', handleLayout);
    window.addEventListener('scroll', handleLayout, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('resize', handleLayout);
      window.removeEventListener('scroll', handleLayout, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, []);

  if (!user) return null;

  const displayName = user.name || user.login;
  const initials = displayName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);


  const handleLogout = () => {
    logout();
  };

  const dropdownContent = open ? (
    <>
      <button
        className={styles.backdrop}
        aria-label="Close user menu"
        onClick={() => setOpen(false)}
      />

      <div
        ref={dropdownRef}
        className={styles.dropdown}
        role="menu"
        aria-label="User menu"
        style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
      >
        <div className={styles.profileRow}>
          {user.avatar_url ? (
            <img
              className={styles.avatarLg}
              src={user.avatar_url}
              alt={displayName}
              width={44}
              height={44}
            />
          ) : (
            <span className={`${styles.initials} ${styles.initialsLg}`}>{initials}</span>
          )}
          <div>
            <p className={styles.profileName}>{displayName}</p>
            <p className={styles.profileLogin}>@{user.login || 'trainer'}</p>
          </div>
        </div>

        {user.mock && (
          <div className={styles.mockBadgeRow}>
            <span className={styles.mockBadge}>DEMO ACCOUNT</span>
          </div>
        )}

        <hr className={styles.divider} />

        {user.html_url && !user.mock && (
          <a
            className={styles.menuItem}
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <GitHubIcon />
            View GitHub profile
          </a>
        )}

        <button
          className={`${styles.menuItem} ${styles.logoutItem}`}
          role="menuitem"
          onClick={handleLogout}
        >
          <LogoutIcon />
          Sign out
        </button>
      </div>
    </>
  ) : null;

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`User menu for ${displayName}`}
      >
        {user.avatar_url ? (
          <img
            className={styles.avatar}
            src={user.avatar_url}
            alt={displayName}
            width={32}
            height={32}
          />
        ) : (
          <span className={styles.initials}>{initials}</span>
        )}
        <span className={styles.name}>{user.login || user.name}</span>
        <svg
          className={`${styles.caret} ${open ? styles.caretOpen : ''}`}
          viewBox="0 0 12 12"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {createPortal(dropdownContent, document.body)}
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
