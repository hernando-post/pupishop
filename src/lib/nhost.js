import { NhostClient } from "@nhost/vue";

export const nhost = new NhostClient({
  subdomain: "nvzyuskncfxuohsujxqx",
  region: "eu-central-1"
});

// const refreshToken = async () => {
//   try {
//     const { session } = await nhost.auth.refreshSession();
//     const accessToken = session.accessToken;
//     console.log('Nuevo Bearer Token:', accessToken);
//   } catch (error) {
//     console.error('Error al obtener el nuevo token de acceso:', error);
//   }
// };

// refreshToken();