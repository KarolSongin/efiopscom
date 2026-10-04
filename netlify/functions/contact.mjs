import {createContactHandler} from '../../server/contact.mjs';
const handler=createContactHandler();
export default (request,context)=>handler(request,{clientAddress:context.ip});
export const config={path:'/api/contact'};
