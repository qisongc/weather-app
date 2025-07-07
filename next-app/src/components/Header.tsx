import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link href="/" style={styles.link}>Home</Link>
        <Link href="/login" style={styles.link}>Login</Link>
        <Link href="/about" style={styles.link}>About</Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#333',
    padding: '1rem',
    color: 'white',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
};

export default Header;