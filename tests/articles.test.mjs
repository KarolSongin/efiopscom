import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const html = fs.readFileSync('dist/articles/template-preview/index.html', 'utf8');
test('article template is reusable, semantic and remains unpublished', () => {
  assert.deepEqual(
    JSON.parse(fs.readFileSync('templates/article.json')),
    JSON.parse(fs.readFileSync('src/data/article-template.json')),
  );
  assert.match(html, /Article template preview/);
  assert.match(html, /noindex, nofollow/);
  assert.match(html, /aria-label="Article contents"/);
  assert.match(html, /scope="col"/);
  assert.match(html, /scope="row"/);
  assert.doesNotMatch(html, /"@type":"Article"|article:published_time/);
  assert.doesNotMatch(
    fs.readFileSync('dist/articles/index.html', 'utf8'),
    /href="\/articles\/template-preview/,
  );
});
