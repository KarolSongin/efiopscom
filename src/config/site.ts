export const site = {
  name: 'EfiOps',
  url: 'https://efiops.com',
  person: 'Karol Songin',
  email: 'karol@efiops.com',
};
export const production = import.meta.env.PUBLIC_BUILD_MODE === 'production';
export const groups = [
  {
    title: 'Make information useful.',
    nav: 'Data and business tools',
    text: 'Bring reporting into focus or give your team a better tool for planning and managing work.',
    slugs: ['power-bi', 'custom-business-apps'],
  },
  {
    title: 'Keep work moving.',
    nav: 'Automation and integration',
    text: 'Automate a repeated process or connect the systems involved in getting the job done.',
    slugs: ['power-automate', 'system-integrations'],
  },
  {
    title: 'Add AI where it earns its place.',
    nav: 'AI in your systems',
    text: 'Explore a connected assistant, a structured decision layer or a focused visual prototype.',
    slugs: ['ai-assistants', 'jev-ai-integration', 'computer-vision'],
  },
  {
    title: 'Build a stronger online presence.',
    nav: 'Websites, search and social',
    text: 'Build a distinctive website, improve search visibility and organise useful social content around your business.',
    slugs: ['web-design-development', 'website-optimisation', 'seo', 'social-media'],
  },
];
