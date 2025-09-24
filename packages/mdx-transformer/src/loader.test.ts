import { describe, expect, test } from '@rstest/core';

import { process as processMdx } from './loader';

describe('process', () => {
  test('returns raw text for a simple paragraph', () => {
    const code = processMdx('Hello world');

    expect(code).toBe('Hello world');
  });

  test('joins multiple top-level nodes with separators', () => {
    const code = processMdx('First paragraph.\n\nSecond paragraph.');

    expect(code).toBe('First paragraph.\r\n + \r\nSecond paragraph.');
  });

  test('renders flow JSX elements with their children', () => {
    const code = processMdx('<Alert severity="info">\nNotice\n</Alert>');

    expect(code).toBe('_jsx(Alert, { severity: "info" }, Notice)');
  });

  test('renders flow JSX elements with their children', () => {
    const code = processMdx('#test\n\nFooBar\n\n<Alert severity="info">\nNotice\n</Alert>');

    expect(code).toBe('#test\r\n + \r\nFooBar\r\n + \r\n_jsx(Alert, { severity: "info" }, Notice)');
  });
});
