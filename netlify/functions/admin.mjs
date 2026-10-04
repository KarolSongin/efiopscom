import { createAdminHandler } from '../../server/admin.mjs';
const handler = createAdminHandler({ allowDemo: false });
export default (request, context) => handler(request, { clientAddress: context.ip });
export const config = { path: '/api/admin/*' };
