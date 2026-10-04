import { z } from 'zod';
export const stages = ['opportunity', 'understand', 'agree', 'build', 'test', 'handover'];
export const statuses = ['active', 'on_hold', 'completed', 'not_proceeding'];
export const services = [
  'power-bi',
  'power-automate',
  'ai-assistants',
  'jev-ai-integration',
  'custom-business-apps',
  'system-integrations',
  'web-design-development',
  'website-optimisation',
  'seo',
  'computer-vision',
  'social-media',
];
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v)
  .or(z.literal(''))
  .transform((v) => v || null);
export const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  organisation: z.string().trim().max(160).default(''),
  phone: z.string().trim().max(50).default(''),
  website: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => {
        try {
          return !v || /^https?:$/.test(new URL(v).protocol);
        } catch {
          return false;
        }
      },
      { message: 'Use a full HTTP or HTTPS URL.' },
    )
    .default(''),
  service: z.enum(['', ...services]).default(''),
  message: z.string().trim().min(10).max(5000),
  stage: z.enum(stages).default('opportunity'),
  status: z.enum(statuses).default('active'),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  next_action: z.string().trim().max(500).default(''),
  follow_up_date: date.default(null),
});
export const patchSchema = z
  .object(
    Object.fromEntries(
      Object.entries(enquirySchema.shape).map(([key, schema]) => [
        key,
        (schema instanceof z.ZodDefault ? schema.unwrap() : schema).optional(),
      ]),
    ),
  )
  .extend({ version: z.number().int().positive() })
  .strict();
export const noteSchema = z.object({ body: z.string().trim().min(1).max(5000) }).strict();
export const contactRecord = (data) => ({
  name: data.name,
  email: data.email,
  organisation: data.organisation,
  service: data.service,
  website: data.website,
  message: data.message,
  source: 'website',
  stage: 'opportunity',
  status: 'active',
  priority: 'normal',
  next_action: 'Review the enquiry and arrange the first conversation.',
  follow_up_date: null,
});
