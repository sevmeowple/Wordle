export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/Quicksand.ttf","fonts/SpaceGrotesk.ttf","words/CET4.txt","words/CET6.txt","words/KaoYan.txt","words/words_alpha.txt"]),
	mimeTypes: {".png":"image/png",".ttf":"font/ttf",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.CgaJD7Ot.js","app":"_app/immutable/entry/app.DhFFTEP7.js","imports":["_app/immutable/entry/start.CgaJD7Ot.js","_app/immutable/chunks/entry.CyIOU3_8.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/entry/app.DhFFTEP7.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.C9ohtohL.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
