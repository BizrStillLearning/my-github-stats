import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { isValidGithubUsername, escapeXml } from '../src/utils/sanitize.ts';

describe('Sanitize & Validation Utility', () => {
    test('should accept valid GitHub usernames', () => {
        assert.equal(isValidGithubUsername('torvalds'), true);
        assert.equal(isValidGithubUsername('john-doe'), true);
        assert.equal(isValidGithubUsername('user123'), true);
        assert.equal(isValidGithubUsername('a'), true);
    });

    test('should reject invalid GitHub usernames', () => {
        assert.equal(isValidGithubUsername(''), false);
        assert.equal(isValidGithubUsername('-invalid'), false);
        assert.equal(isValidGithubUsername('invalid-'), false);
        assert.equal(isValidGithubUsername('inv@lid'), false);
        assert.equal(isValidGithubUsername('user--name'), false);
        assert.equal(isValidGithubUsername('a'.repeat(40)), false);
    });

    test('should escape XML entities to prevent SVG injection', () => {
        const raw = '<script>alert("XSS")</script> & \'hello\'';
        const escaped = escapeXml(raw);
        assert.equal(
            escaped,
            '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt; &amp; &apos;hello&apos;'
        );
        assert.equal(escaped.includes('<'), false);
        assert.equal(escaped.includes('>'), false);
    });
});