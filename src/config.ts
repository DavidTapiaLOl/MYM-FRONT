const PROTOCOL = typeof window !== 'undefined' ? window.location.protocol : 'http:'; // Asigna un valor por defecto para Node.js
const DOMINIO = typeof window !== 'undefined' ? window.location.hostname : 'localhost'; // Asigna un valor por defecto para Node.js
const ACCESS = 'public'
const WSERVICE = '';
const CLOUD_NAME = 'conexionb2b';
const CLOUD_PRESET = 'conexion_b2b';
const CLOUD_API = '635696783638373';
const CLOUD_API_SECRET = 'NMRbL4YO3Oh5WbTMLDLhGQ0cJAE';

const ONE_SIGNAL_ID = ''

export const utils = {
   // App utils
   USER: 'APP_USER',
   APP_LANG: 'APP_LANG',

   URL: 'http://localhost/',

   // MAPS
   GOOGLE_MAPS_KEY: 'AIzaSyAaaUa6YO7aU4l9oL0yulQsr738I-sTH70',
   GEOLOCATION_KEY: 'b73cf933-89f0-410a-94be-2fd256d7c2a8',

   // ONE SIGNAL
   ONE_SIGNAL_APP_ID: ONE_SIGNAL_ID,
   ONE_SIGNAL_API_URL: 'https://onesignal.com/api/v1/apps/' + ONE_SIGNAL_ID +'/users/', //Se agrega el ID del usuario en la petición

   // Cloudinary
   UPLOAD_CONFIG: {
      upload_preset: CLOUD_PRESET,
      cloud_name: CLOUD_NAME,
      api_url: 'https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/image/upload',
   },

   // RECAPTCHA:
   RECAPTCHA_KEY: '6LeknV4gAAAAAP6gklef0jYY6p3YCgDlBsPb2AnP',

   // PIPEDREAM
   SEND_CODE: '',
   VERIFY_CODE: '',

   /* // CUSTOM EXCEPTIONS
   excep: {
      "001": "Método de petición incorrecto",
      "002": "Clase incorrecta",
      "003": "Método inexistente",
      "006": "Token no enviado",
      "007": "Parámetros vacíos",
      // Login
      "004": "El usuario no existe",
      "005": "Credenciales inválidas",
   } */
};
