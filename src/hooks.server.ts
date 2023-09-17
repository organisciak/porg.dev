import type { Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.userid = cookies['userid'] || crypto.randomUUID();

	console.log(event);
	let modifiedEvent = event;

	if (event.url.host.startsWith('links.')) {
		console.log('links redirect');
        // Rewrite the URL to have the `/l/` prefix
		modifiedEvent.url.pathname = `/l${event.url.pathname}`;
		modifiedEvent.url.host = event.url.host.replace('links.', '');
		modifiedEvent.url.href = `https://${modifiedEvent.url.host}${modifiedEvent.url.pathname}`;
		modifiedEvent.routeId = 'l/[shorturl]';
    }
	console.log(modifiedEvent);
	const response = await resolve(modifiedEvent);

	if (!cookies['userid']) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers.set(
			'set-cookie',
			cookie.serialize('userid', event.locals.userid, {
				path: '/',
				httpOnly: true
			})
		);
	}

	return response;
};
