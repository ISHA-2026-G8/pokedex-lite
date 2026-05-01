import React from 'react';
import { capitalize, typeColor } from '../utils/helpers';
import styles from './TypeFilter.module.css';

export default function TypeFilter({ types, selected, onChange }) {
  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.chip} ${!selected ? styles.allActive : ''}`}
        onClick={() => onChange(null)}
      >
        All Types
      </button>
      {types.map(type => (
        <button
          key={type}
          className={`${styles.chip} ${selected === type ? styles.selected : ''}`}
          style={selected === type ? {
            background: typeColor[type],
            borderColor: typeColor[type],
            color: ['electric', 'ground', 'ice', 'steel', 'fairy', 'normal'].includes(type) ? '#333' : '#fff',
          } : { '--hover-color': typeColor[type] }}
          onClick={() => onChange(selected === type ? null : type)}
        >
          {capitalize(type)}
        </button>
      ))}
    </div>
  );
}
