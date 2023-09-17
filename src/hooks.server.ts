import type { Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.userid = cookies['userid'] || crypto.randomUUID();

	let modifiedEvent = event;

	if (event.url.host.startsWith('links.') && !event.url.pathname.startsWith('/l/')) {
		return new Response('Redirect',
		{status: 308, headers: { Location: `/l${event.url.pathname}` }}
		);
	}

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
