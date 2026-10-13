// app/brand.js - the active brand. In the source folder this is Blaze Camp; tools/build-site.mjs rewrites this file in the built
// site to re-export the brand it builds (--brand <id> / env BRAND). The brands live in app/brands/<id>.js.
export { BRAND } from './brands/blazecamp.js';
