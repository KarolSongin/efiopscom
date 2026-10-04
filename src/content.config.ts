import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
const text = z.string().min(1);
const state = z.enum(['draft', 'published']);
const service = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/services' }),
  schema: z.object({
    slug: text,
    title: text,
    seoTitle: text,
    metaDescription: text,
    h1: text,
    eyebrow: text,
    lead: text,
    summary: text,
    sections: z
      .array(
        z.object({
          heading: text,
          paragraphs: z.array(text),
          items: z.array(text),
          caption: z.string(),
        }),
      )
      .min(3),
    faqs: z.array(z.object({ question: text, answer: text })).min(4),
    cta: z.object({ label: text, heading: text, text: text }),
    relatedServices: z.array(text).min(2),
    useCases: z.array(z.object({ audience: text, title: text, body: text })).min(3),
    journey: z.object({
      heading: text,
      example: text,
      sources: z.array(text).length(3),
      question: text,
      scope: z.array(text).length(3),
      boundary: text,
      build: z.array(text).length(3),
      stages: z
        .array(
          z.object({
            id: z.enum(['understand', 'agree', 'build', 'test', 'handover']),
            label: text,
            title: text,
            body: text,
            output: text,
          }),
        )
        .length(5),
      tests: z.array(z.object({ label: text, input: text, result: text, reason: text })).length(3),
      handover: z.array(z.object({ title: text, body: text })).length(3),
    }),
    visualKey: text,
    primaryIntent: text,
    publicationState: state,
  }),
});
const cases = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/case-studies' }),
  schema: z.object({
    slug: text,
    title: text,
    description: text,
    projectType: z.enum([
      'Internal project',
      'Owned-business project',
      'Client project',
      'Demonstration',
    ]),
    projectStatus: z.enum(['Completed', 'In progress', 'Pilot', 'Concept']),
    publicationState: state,
    permissionConfirmed: z.boolean(),
    evidenceReviewed: z.boolean(),
    role: text,
    dates: text,
    relatedServices: z.array(text),
    images: z.array(z.object({ src: text, alt: text, caption: text })),
    metrics: z.array(
      z.object({
        label: text,
        value: text,
        method: text,
        sampleSize: z.number().positive(),
        observationPeriod: text,
      }),
    ),
    internalEvidenceNotes: text,
    sections: z.array(z.object({ heading: text, body: text })).min(7),
  }),
});
const insights = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/insights' }),
  schema: z.object({
    slug: text,
    title: text,
    description: text,
    author: z.literal('Karol Songin'),
    publishedDate: z.string().nullable(),
    substantiveUpdatedDate: z.string().nullable(),
    relatedServices: z.array(text),
    publicationState: state,
    reviewed: z.boolean(),
    sources: z.array(z.object({ label: text, url: z.url() })),
    sections: z.array(z.object({ heading: text, body: text })).min(2),
  }),
});
export const collections = { services: service, 'case-studies': cases, insights };
