var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as cookie from 'cookie';
export const handle = ({ event, resolve }) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    event.locals.userid = cookies['userid'] || crypto.randomUUID();
    const response = yield resolve(event);
    if (!cookies['userid']) {
        // if this is the first time the user has visited this app,
        // set a cookie so that we recognise them when they return
        response.headers.set('set-cookie', cookie.serialize('userid', event.locals.userid, {
            path: '/',
            httpOnly: true
        }));
    }
    return response;
});
