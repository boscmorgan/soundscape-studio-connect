import { describe, it, expect } from 'vitest';

import { mailtoLink } from './utils';
import { isValidEmail } from './newsletter';
import { site } from '@/config/site';

describe('mailtoLink', () => {
  it('encodes the subject', () => {
    const result = mailtoLink('Collaborazione & Supporto?');

    expect(result.startsWith(`mailto:${site.email}?`)).toBe(true);
    expect(result).toContain('subject=Collaborazione+%26+Supporto%3F');
  });

  it('omits the body when none is given', () => {
    expect(mailtoLink('Ciao')).not.toContain('body=');
  });

  it('includes an encoded body when given', () => {
    const result = mailtoLink('Ciao', 'Riga uno\nRiga due');

    expect(result).toContain('body=Riga+uno%0ARiga+due');
  });
});

describe('isValidEmail', () => {
  it.each(['a@b.co', 'lorenzo.lucchetti@example.com', ' padded@example.org '])(
    'accepts %s',
    (value) => expect(isValidEmail(value)).toBe(true),
  );

  it.each(['', 'not-an-email', 'missing@tld', 'two@@at.com', 'spa ce@x.com'])(
    'rejects %s',
    (value) => expect(isValidEmail(value)).toBe(false),
  );
});
