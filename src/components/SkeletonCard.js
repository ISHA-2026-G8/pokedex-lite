import React from 'react';
import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`${styles.id} skeleton`} />
      <div className={`${styles.image} skeleton`} />
      <div className={`${styles.name} skeleton`} />
      <div className={styles.types}>
        <div className={`${styles.type} skeleton`} />
        <div className={`${styles.type} skeleton`} />
      </div>
    </div>
  );
}
