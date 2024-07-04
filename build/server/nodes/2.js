

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DmIOmsyb.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.C9ohtohL.js"];
export const stylesheets = ["_app/immutable/assets/2.2hrnVjAe.css"];
export const fonts = [];
