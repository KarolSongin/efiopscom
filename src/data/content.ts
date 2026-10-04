import { getCollection } from 'astro:content';
export const services = async () =>
  (await getCollection('services')).filter((x) => x.data.publicationState === 'published');
export const cases = async () =>
  (await getCollection('case-studies')).filter(
    (x) =>
      x.data.publicationState === 'published' &&
      x.data.permissionConfirmed &&
      x.data.evidenceReviewed,
  );
export const articles = async () =>
  (await getCollection('articles'))
    .filter(
      (x) => x.data.publicationState === 'published' && x.data.reviewed && x.data.publishedDate,
    )
    .sort((a, b) => (b.data.publishedDate || '').localeCompare(a.data.publishedDate || ''));
export const workReleased = async () => (await cases()).length >= 1;
