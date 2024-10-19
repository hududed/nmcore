// TODO: wait for fix then we can use Forms validation https://github.com/sveltejs/kit/issues/10022
// import type { PageServerLoad, Actions } from "./$types.js";
// import { fail } from "@sveltejs/kit";
// import { superValidate } from "sveltekit-superforms";
// import { zod } from "sveltekit-superforms/adapters";
// import { formSchema } from "./schema";

// // export const prerender = false; // Add this line to disable prerendering

// export const load: PageServerLoad = async () => {
//  return {
//   form: await superValidate(zod(formSchema)),
//  };
// };
 
// export const actions: Actions = {
//  default: async (event) => {
//   const form = await superValidate(event, zod(formSchema));
//   if (!form.valid) {
//    return fail(400, {
//     form,
//    });
//   }
//   return {
//    form,
//   };
//  },
// };