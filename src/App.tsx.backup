import { useState, useEffect } from 'react';
console.log("🚀 HELLO FROM c:/backupfigma/src/App.tsx");
const redflixLogo = 'https://chemorena.com/redfliz.png';

// OMDb API Configuration
const OMDB_API_KEY = 'faa9f03';
const OMDB_API_URL = 'http://www.omdbapi.com/';

import { Movie } from './types';

// SVG Paths inline para evitar dependência do Figma
const svgPaths = {
  p19c1fbc0: "M7.75194 2.073C8.12941 1.87802 8.52802 1.72703 8.93994 1.623C8.97594 2.433 9.22794 3.234 9.56994 3.999C10.0559 5.0805 10.7699 6.1845 11.4659 7.254L11.5469 7.377C12.2294 8.4225 12.8969 9.444 13.4039 10.47C13.9289 11.5335 14.2514 12.5385 14.2514 13.5C14.2514 15.2295 13.7339 16.7205 12.7634 17.772C11.8034 18.8145 10.3274 19.5 8.25144 19.5C6.15594 19.5 4.69944 18.894 3.68244 17.9625C2.65194 17.0205 1.99944 15.678 1.64544 14.0865C1.31244 12.5895 1.60644 11.247 1.99794 10.2615C2.06194 10.1015 2.12694 9.9515 2.19294 9.8115L2.38044 10.188C2.51593 10.4599 2.7037 10.7023 2.93301 10.9015C3.16231 11.1007 3.42865 11.2527 3.71678 11.3489C4.00491 11.445 4.30917 11.4834 4.61215 11.4618C4.91512 11.4402 5.21086 11.359 5.48244 11.223C6.75144 10.5885 7.10244 9.033 6.56544 7.869C6.00744 6.6585 5.57244 5.154 5.96094 3.987C6.25344 3.111 6.94794 2.487 7.75044 2.073M1.66194 7.7835L1.65894 7.7895L1.65144 7.7985L1.62744 7.8285L1.55094 7.935C1.48494 8.026 1.39994 8.154 1.29594 8.319C1.02537 8.76118 0.793508 9.22591 0.602942 9.708C0.137942 10.878 -0.237058 12.5355 0.181442 14.4135C0.578942 16.1985 1.34394 17.8545 2.66994 19.0695C4.00794 20.2935 5.84544 21 8.25144 21C10.6784 21 12.5774 20.1855 13.8659 18.7905C15.1454 17.4045 15.7514 15.5205 15.7514 13.5C15.7514 12.2115 15.3239 10.9665 14.7479 9.804C14.2004 8.697 13.4879 7.608 12.8204 6.5835L12.7229 6.4335C12.0134 5.346 11.3669 4.341 10.9379 3.384C10.5089 2.427 10.3424 1.614 10.4849 0.897C10.5067 0.788233 10.504 0.675998 10.4772 0.568381C10.4503 0.460764 10.3999 0.360444 10.3296 0.274649C10.2593 0.188854 10.1709 0.11972 10.0706 0.0722276C9.97038 0.0247352 9.86086 6.69791e-05 9.74994 0C9.11694 0 8.06244 0.222 7.06194 0.7395C6.05244 1.263 4.99644 2.139 4.53894 3.513C3.95394 5.268 4.62744 7.248 5.20344 8.4975C5.45994 9.0525 5.23644 9.6675 4.81194 9.8805C4.71665 9.9284 4.61283 9.957 4.50645 9.96467C4.40007 9.97235 4.29322 9.95893 4.19204 9.92521C4.09086 9.89148 3.99733 9.8381 3.91683 9.76814C3.83633 9.69817 3.77044 9.613 3.72294 9.5175L2.92044 7.914C2.86403 7.80119 2.78007 7.70442 2.67634 7.63266C2.57261 7.5609 2.45246 7.51646 2.327 7.50345C2.20154 7.49044 2.07482 7.50928 1.95857 7.55823C1.84233 7.60718 1.7403 7.68466 1.66194 7.7835Z",
  p1d7c1c80: "M9.75 18.75C14.7206 18.75 18.75 14.7206 18.75 9.75C18.75 4.77944 14.7206 0.75 9.75 0.75C4.77944 0.75 0.75 4.77944 0.75 9.75C0.75 14.7206 4.77944 18.75 9.75 18.75Z",
  p261e0f00: "M0 10.204C0 7.915 0 6.771 0.52 5.823C1.038 4.874 1.987 4.286 3.884 3.108L5.884 1.867C7.889 0.622 8.892 0 10 0C11.108 0 12.11 0.622 14.116 1.867L16.116 3.108C18.013 4.286 18.962 4.874 19.481 5.823C20 6.772 20 7.915 20 10.203V11.725C20 15.625 20 17.576 18.828 18.788C17.656 20 15.771 20 12 20H8C4.229 20 2.343 20 1.172 18.788C0.000999928 17.576 0 15.626 0 11.725V10.204Z",
  p274d3200: "M9.057 7.489L12.75 6.75L12.011 10.443C11.9336 10.8301 11.7435 11.1856 11.4644 11.4648C11.1854 11.744 10.83 11.9344 10.443 12.012L6.75 12.75L7.489 9.057C7.56654 8.67011 7.75678 8.3148 8.03579 8.03579C8.3148 7.75678 8.67011 7.56654 9.057 7.489Z",
  p2511f680: "M10.25 8.25L7.75 10.75M12.75 5.75L13.75 4.75M9.75 0.75H5.75M0.75 10.75C0.75 11.6693 0.93106 12.5795 1.28284 13.4288C1.63463 14.2781 2.15024 15.0497 2.80025 15.6997C3.45026 16.3498 4.22194 16.8654 5.07122 17.2172C5.92049 17.5689 6.83075 17.75 7.75 17.75C8.66925 17.75 9.57951 17.5689 10.4288 17.2172C11.2781 16.8654 12.0497 16.3498 12.6997 15.6997C13.3498 15.0497 13.8654 14.2781 14.2172 13.4288C14.5689 12.5795 14.75 11.6693 14.75 10.75C14.75 8.89348 14.0125 7.11301 12.6997 5.80025C11.387 4.4875 9.60652 3.75 7.75 3.75C5.89348 3.75 4.11301 4.4875 2.80025 5.80025C1.4875 7.11301 0.75 8.89348 0.75 10.75Z",
  p841ef00: "M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10 6C10.2652 6 10.5196 6.10536 10.7071 6.29289C10.8946 6.48043 11 6.73478 11 7V10C11 10.2652 10.8946 10.5196 10.7071 10.7071C10.5196 10.8946 10.2652 11 10 11C9.73478 11 9.48043 10.8946 9.29289 10.7071C9.10536 10.5196 9 10.2652 9 10V7C9 6.73478 9.10536 6.48043 9.29289 6.29289C9.48043 6.10536 9.73478 6 10 6ZM10 13.5C10.3978 13.5 10.7794 13.342 11.0607 13.0607C11.342 12.7794 11.5 12.3978 11.5 12C11.5 11.6022 11.342 11.2206 11.0607 10.9393C10.7794 10.658 10.3978 10.5 10 10.5C9.60218 10.5 9.22064 10.658 8.93934 10.9393C8.65804 11.2206 8.5 11.6022 8.5 12C8.5 12.3978 8.65804 12.7794 8.93934 13.0607C9.22064 13.342 9.60218 13.5 10 13.5Z",
  p23141a00: "M8 2V11M8 11C6.93913 11 5.92172 10.5786 5.17157 9.82843C4.42143 9.07828 4 8.06087 4 7V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4C6.53043 4 7.03914 4.21071 7.41421 4.58579C7.78929 4.96086 8 5.46957 8 6V11ZM8 11C9.06087 11 10.0783 10.5786 10.8284 9.82843C11.5786 9.07828 12 8.06087 12 7V6C12 5.46957 11.7893 4.96086 11.4142 4.58579C11.0391 4.21071 10.5304 4 10 4C9.46957 4 8.96086 4.21071 8.58579 4.58579C8.21071 4.96086 8 5.46957 8 6V11ZM5 14H11M8 14V16",
  p328ee780: "M5 2V8M2 5H8M13 7L10 10M19 2L13 8M10 10L9 16L11.5 14.5L14 19L15 18.5L12.5 14L15 13.5L10 10Z",
  pec31540: "M2 2V8",
  p3cd7cf00: "M5 2H2V5",
  p3ec9480: "M5.5 8C7.433 8 9 6.433 9 4.5S7.433 1 5.5 1 2 2.567 2 4.5 3.567 8 5.5 8ZM11.2 9.65C10.92 9.24 10.57 8.89 10.16 8.61 10.05 8.54 9.94 8.47 9.82 8.41 9.94 8.23 10.05 8.04 10.14 7.84 10.54 6.98 10.75 6.04 10.75 5.07V5C10.75 4.45 10.88 3.92 11.09 3.43 11.5 2.5 12.26 1.76 13.19 1.35 13.43 1.24 13.69 1.16 13.95 1.1 14.14 1.06 14.33 1.03 14.53 1.02 14.56 1.02 14.59 1.01 14.62 1.01 14.73 1.00 14.84 1 14.95 1 15.06 1 15.17 1.00 15.28 1.01 15.31 1.01 15.34 1.02 15.37 1.02 15.57 1.03 15.76 1.06 15.95 1.1 16.21 1.16 16.47 1.24 16.71 1.35 17.64 1.76 18.4 2.5 18.81 3.43 19.02 3.92 19.15 4.45 19.15 5V5.07C19.15 6.04 18.94 6.98 18.54 7.84 18.45 8.04 18.34 8.23 18.22 8.41 18.1 8.47 17.99 8.54 17.88 8.61 17.47 8.89 17.12 9.24 16.84 9.65 16.41 10.25 16.17 10.97 16.17 11.74V11.75C16.17 12.62 16.52 13.45 17.14 14.07 17.76 14.69 18.59 15.04 19.46 15.04H19.95V16.54H19.46C18.19 16.54 16.98 16.03 16.09 15.14 15.2 14.25 14.69 13.04 14.69 11.77V11.74C14.69 11.29 14.82 10.85 15.06 10.48 15.3 10.11 15.64 9.82 16.04 9.64 16.02 9.62 16 9.6 15.98 9.58 15.77 9.36 15.6 9.11 15.47 8.83 15.21 8.3 15.07 7.71 15.07 7.11V7C15.07 6.71 15.12 6.43 15.21 6.16 15.38 5.68 15.73 5.28 16.19 5.05 16.65 4.82 17.19 4.79 17.68 4.98 17.99 5.09 18.26 5.28 18.47 5.53 18.68 5.78 18.82 6.08 18.88 6.4 18.94 6.72 18.92 7.05 18.82 7.35 18.72 7.65 18.55 7.92 18.33 8.14 18.11 8.36 17.84 8.52 17.54 8.62 17.24 8.72 16.92 8.75 16.6 8.7 16.28 8.65 15.98 8.53 15.73 8.34 15.48 8.15 15.28 7.9 15.16 7.62 15.04 7.34 14.99 7.03 15.02 6.73 15.05 6.43 15.15 6.14 15.32 5.9 15.49 5.66 15.72 5.47 15.99 5.36 16.26 5.25 16.55 5.22 16.84 5.27 17.13 5.32 17.4 5.44 17.64 5.62 17.88 5.8 18.07 6.04 18.2 6.32 18.33 6.6 18.4 6.91 18.4 7.22V7.27C18.4 7.58 18.33 7.89 18.2 8.17 18.07 8.45 17.88 8.7 17.64 8.88 17.4 9.06 17.13 9.17 16.84 9.2 16.55 9.23 16.26 9.18 15.99 9.05 15.72 8.92 15.49 8.72 15.32 8.47 15.15 8.22 15.05 7.93 15.02 7.63 14.99 7.33 15.04 7.02 15.16 6.74 15.28 6.46 15.48 6.21 15.73 6.02 15.98 5.83 16.28 5.71 16.6 5.66 16.92 5.61 17.24 5.64 17.54 5.74 17.84 5.84 18.11 6 18.33 6.22 18.55 6.44 18.72 6.71 18.82 7.01 18.92 7.31 18.94 7.64 18.88 7.96 18.82 8.28 18.68 8.58 18.47 8.83 18.26 9.08 17.99 9.27 17.68 9.38 17.37 9.49 17.03 9.52 16.69 9.47 16.35 9.42 16.03 9.29 15.75 9.1 15.47 8.91 15.25 8.65 15.1 8.36 14.95 8.07 14.88 7.75 14.88 7.42V7.11C14.88 6.78 14.95 6.46 15.1 6.17 15.25 5.88 15.47 5.62 15.75 5.43 16.03 5.24 16.35 5.11 16.69 5.06 17.03 5.01 17.37 5.04 17.68 5.15 17.99 5.26 18.26 5.45 18.47 5.7 18.68 5.95 18.82 6.25 18.88 6.57 18.94 6.89 18.92 7.22 18.82 7.52 18.72 7.82 18.55 8.09 18.33 8.31 18.11 8.53 17.84 8.69 17.54 8.79 17.24 8.89 16.92 8.92 16.6 8.87 16.28 8.82 15.98 8.7 15.73 8.51 15.48 8.32 15.28 8.07 15.16 7.79 15.04 7.51 14.99 7.2 15.02 6.9 15.05 6.6 15.15 6.31 15.32 6.07 15.49 5.83 15.72 5.64 15.99 5.53 16.26 5.42 16.55 5.39 16.84 5.44 17.13 5.49 17.4 5.61 17.64 5.79 17.88 5.97 18.07 6.21 18.2 6.49 18.33 6.77 18.4 7.08 18.4 7.39V7.44C18.4 7.75 18.33 8.06 18.2 8.34 18.07 8.62 17.88 8.87 17.64 9.05 17.4 9.23 17.13 9.34 16.84 9.37 16.55 9.4 16.26 9.35 15.99 9.22 15.72 9.09 15.49 8.89 15.32 8.64 15.15 8.39 15.05 8.1 15.02 7.8 14.99 7.5 15.04 7.19 15.16 6.91 15.28 6.63 15.48 6.38 15.73 6.19 15.98 6 16.28 5.88 16.6 5.83 16.92 5.78 17.24 5.81 17.54 5.91 17.84 6.01 18.11 6.17 18.33 6.39 18.55 6.61 18.72 6.88 18.82 7.18 18.92 7.48 18.94 7.81 18.88 8.13 18.82 8.45 18.68 8.75 18.47 9 18.26 9.25 17.99 9.44 17.68 9.55 17.19 9.74 16.65 9.77 16.19 9.54 15.73 9.31 15.38 8.91 15.21 8.43 15.12 8.16 15.07 7.88 15.07 7.59V7C15.07 6.4 15.21 5.81 15.47 5.28 15.6 5 15.77 4.75 15.98 4.53 16 4.51 16.02 4.49 16.04 4.47 15.64 4.29 15.3 4 15.06 3.63 14.82 3.26 14.69 2.82 14.69 2.37V2.34C14.69 1.07 15.2 -0.14 16.09 -1.03 16.98 -1.92 18.19 -2.43 19.46 -2.43H19.95V-0.93H19.46C18.59 -0.93 17.76 -0.58 17.14 0.04 16.52 0.66 16.17 1.49 16.17 2.36V2.37C16.17 3.14 16.41 3.86 16.84 4.46 17.12 4.87 17.47 5.22 17.88 5.5 17.99 5.57 18.1 5.64 18.22 5.7 18.34 5.52 18.45 5.33 18.54 5.13 18.94 4.27 19.15 3.33 19.15 2.36V2.29C19.15 1.76 19.02 1.23 18.81 0.74 18.4 -0.19 17.64 -0.93 16.71 -1.34 16.47 -1.45 16.21 -1.53 15.95 -1.59 15.76 -1.63 15.57 -1.66 15.37 -1.67 15.34 -1.67 15.31 -1.68 15.28 -1.68 15.17 -1.69 15.06 -1.69 14.95 -1.69 14.84 -1.69 14.73 -1.69 14.62 -1.68 14.59 -1.68 14.56 -1.67 14.53 -1.67 14.33 -1.66 14.14 -1.63 13.95 -1.59 13.69 -1.53 13.43 -1.45 13.19 -1.34 12.26 -0.93 11.5 -0.19 11.09 0.74 10.88 1.23 10.75 1.76 10.75 2.29V2.36C10.75 3.33 10.96 4.27 11.36 5.13 11.45 5.33 11.56 5.52 11.68 5.7 11.8 5.64 11.91 5.57 12.02 5.5 12.43 5.22 12.78 4.87 13.06 4.46 13.49 3.86 13.73 3.14 13.73 2.37V2.36C13.73 1.49 13.38 0.66 12.76 0.04 12.14 -0.58 11.31 -0.93 10.44 -0.93H9.95V-2.43H10.44C11.71 -2.43 12.92 -1.92 13.81 -1.03 14.7 -0.14 15.21 1.07 15.21 2.34V2.37C15.21 2.82 15.08 3.26 14.84 3.63 14.6 4 14.26 4.29 13.86 4.47 13.88 4.49 13.9 4.51 13.92 4.53 14.13 4.75 14.3 5 14.43 5.28 14.69 5.81 14.83 6.4 14.83 7V7.59C14.83 7.88 14.78 8.16 14.69 8.43 14.52 8.91 14.17 9.31 13.71 9.54 13.25 9.77 12.71 9.74 12.22 9.55 11.91 9.44 11.64 9.25 11.43 9 11.22 8.75 11.08 8.45 11.02 8.13 10.96 7.81 10.98 7.48 11.08 7.18 11.18 6.88 11.35 6.61 11.57 6.39 11.79 6.17 12.06 6.01 12.36 5.91 12.66 5.81 12.98 5.78 13.3 5.83 13.62 5.88 13.92 6 14.17 6.19 14.42 6.38 14.62 6.63 14.74 6.91 14.86 7.19 14.91 7.5 14.88 7.8 14.85 8.1 14.75 8.39 14.58 8.64 14.41 8.89 14.18 9.09 13.91 9.22 13.64 9.35 13.35 9.4 13.06 9.37 12.77 9.34 12.5 9.23 12.26 9.05 12.02 8.87 11.83 8.62 11.7 8.34 11.57 8.06 11.5 7.75 11.5 7.44V7.39C11.5 7.08 11.57 6.77 11.7 6.49 11.83 6.21 12.02 5.97 12.26 5.79 12.5 5.61 12.77 5.49 13.06 5.44 13.35 5.39 13.64 5.42 13.91 5.53 14.18 5.64 14.41 5.83 14.58 6.07 14.75 6.31 14.85 6.6 14.88 6.9 14.91 7.2 14.86 7.51 14.74 7.79 14.62 8.07 14.42 8.32 14.17 8.51 13.92 8.7 13.62 8.82 13.3 8.87 12.98 8.92 12.66 8.89 12.36 8.79 12.06 8.69 11.79 8.53 11.57 8.31 11.35 8.09 11.18 7.82 11.08 7.52 10.98 7.22 10.96 6.89 11.02 6.57 11.08 6.25 11.22 5.95 11.43 5.7 11.64 5.45 11.91 5.26 12.22 5.15 12.53 5.04 12.87 5.01 13.21 5.06 13.55 5.11 13.87 5.24 14.15 5.43 14.43 5.62 14.65 5.88 14.8 6.17 14.95 6.46 15.02 6.78 15.02 7.11V7.42C15.02 7.75 14.95 8.07 14.8 8.36 14.65 8.65 14.43 8.91 14.15 9.1 13.87 9.29 13.55 9.42 13.21 9.47 12.87 9.52 12.53 9.49 12.22 9.38 11.91 9.27 11.64 9.08 11.43 8.83 11.22 8.58 11.08 8.28 11.02 7.96 10.96 7.64 10.98 7.31 11.08 7.01 11.18 6.71 11.35 6.44 11.57 6.22 11.79 6 12.06 5.84 12.36 5.74 12.66 5.64 12.98 5.61 13.3 5.66 13.62 5.71 13.92 5.83 14.17 6.02 14.42 6.21 14.62 6.46 14.74 6.74 14.86 7.02 14.91 7.33 14.88 7.63 14.85 7.93 14.75 8.22 14.58 8.47 14.41 8.72 14.18 8.92 13.91 9.05 13.64 9.18 13.35 9.23 13.06 9.2 12.77 9.17 12.5 9.06 12.26 8.88 12.02 8.7 11.83 8.45 11.7 8.17 11.57 7.89 11.5 7.58 11.5 7.27V7.22C11.5 6.91 11.57 6.6 11.7 6.32 11.83 6.04 12.02 5.8 12.26 5.62 12.5 5.44 12.77 5.32 13.06 5.27 13.35 5.22 13.64 5.25 13.91 5.36 14.18 5.47 14.41 5.66 14.58 5.9 14.75 6.14 14.85 6.43 14.88 6.73 14.91 7.03 14.86 7.34 14.74 7.62 14.62 7.9 14.42 8.15 14.17 8.34 13.92 8.53 13.62 8.65 13.3 8.7 12.98 8.75 12.66 8.72 12.36 8.62 12.06 8.52 11.79 8.36 11.57 8.14 11.35 7.92 11.18 7.65 11.08 7.35 10.98 7.05 10.96 6.72 11.02 6.4 11.08 6.08 11.22 5.78 11.43 5.53 11.64 5.28 11.91 5.09 12.22 4.98 12.71 4.79 13.25 4.82 13.71 5.05 14.17 5.28 14.52 5.68 14.69 6.16 14.78 6.43 14.83 6.71 14.83 7V7.11C14.83 7.71 14.69 8.3 14.43 8.83 14.3 9.11 14.13 9.36 13.92 9.58 13.9 9.6 13.88 9.62 13.86 9.64 14.26 9.82 14.6 10.11 14.84 10.48 15.08 10.85 15.21 11.29 15.21 11.74V11.77C15.21 13.04 14.7 14.25 13.81 15.14 12.92 16.03 11.71 16.54 10.44 16.54H9.95V15.04H10.44C11.31 15.04 12.14 14.69 12.76 14.07 13.38 13.45 13.73 12.62 13.73 11.75V11.74C13.73 10.97 13.49 10.25 13.06 9.65ZM0 11C0 9.54 0.48 8.14 1.36 7.03C2.24 5.92 3.47 5.16 4.86 4.88C6.25 4.6 7.69 4.82 8.95 5.51C10.21 6.2 11.22 7.31 11.82 8.67C12.42 10.03 12.58 11.54 12.27 12.99C11.96 14.44 11.2 15.75 10.1 16.73C9 17.71 7.61 18.3 6.14 18.42C4.67 18.54 3.2 18.17 1.95 17.38L0 19.33V11Z",
  p36eed880: "M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z",
  p2959f370: "M10 13.3333C11.841 13.3333 13.3333 11.841 13.3333 10C13.3333 8.15905 11.841 6.66667 10 6.66667C8.15905 6.66667 6.66667 8.15905 6.66667 10C6.66667 11.841 8.15905 13.3333 10 13.3333Z",
  pad20300: "M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z",
  p204109f0: "M3 17V5M1.5 8H4.5M8 17C8 14.8783 8.84285 12.8434 10.3431 11.3431C11.8434 9.84285 13.8783 9 16 9",
  p3d802230: "M8 17C8 14.8783 7.15714 12.8434 5.65685 11.3431C4.15656 9.84285 2.12171 9 0 9",
  p3d5b69c0: "M8.50012 5.00043L4.50012 1.00043L0.500122 5.00043H8.50012Z",
};
import { MovieCard } from './components/MovieCard';
import { ContinueWatchingCard } from './components/ContinueWatchingCard';
import { ContinueWatching } from './components/ContinueWatching';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { HeroSlider } from './components/HeroSlider';
import { MovieDetails } from './components/MovieDetails';
import { PersonDetails } from './components/PersonDetails';
import { ChannelsPage } from './components/ChannelsPage';
import { KidsPage } from './components/KidsPage';
import { SoccerPage } from './components/SoccerPage';
import { LanguageBrowsePage } from './components/LanguageBrowsePage';
import { MyListPage } from './components/MyListPage';
import { ContinueWatchingPage } from './components/ContinueWatchingPage';
import { HistoryPage } from './components/HistoryPage';
import { FavoritosPage } from './components/FavoritosPage';
import { RedFlixOriginalsPage } from './components/RedFlixOriginalsPage';
import { MoviesPage } from './components/MoviesPage';
import { SeriesPage } from './components/SeriesPage';
import { BombandoPage } from './components/BombandoPage';
import { IPTVPage } from './components/IPTVPage';
import { CanaisPage } from './components/CanaisPage';
import { SearchOverlay } from './components/SearchOverlay';
import { SearchResultsPage } from './components/SearchResultsPage';
import { ContentRow } from './components/ContentRow';
import { InfiniteContentRow } from './components/InfiniteContentRow';
import { ScrollToTop } from './components/ScrollToTop';
import { AdminDashboard } from './components/AdminDashboard';
import { NetflixHeader } from './components/NetflixHeader';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ChoosePlan } from './components/ChoosePlan';
import { ProfileSelection } from './components/ProfileSelection';
import { ProfileManagement } from './components/ProfileManagement';
import { UserDashboard } from './components/UserDashboard';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { AccountSettings } from './components/AccountSettings';
import { DatabaseStatus } from './components/DatabaseStatus';
import { MyProfile } from './components/MyProfile';
import { AccountPage } from './components/AccountPage';
import Player from './components/Player';
import { ResetButton } from './components/ResetButton';
import { IptvServiceTest } from './components/IptvServiceTest';
import { TestBackend } from './components/TestBackend';
import { TestConnection } from './components/TestConnection';
import { ContentManagerPage } from './components/ContentManagerPage';
import { GitHubDiagnostics } from './components/GitHubDiagnostics';
import { BottomNavBar } from './components/BottomNavBar';
import { Top10Section } from './components/Top10Section';
import { StreamingMarquee } from './components/StreamingMarquee';
import { FeaturedBanners } from './components/FeaturedBanners';
import { StreamingLogos } from './components/StreamingLogos';
import { ImagePreloadMonitor } from './components/ImagePreloadMonitor';
import { loadAllContentFromDatabase, convertToMovieFormat } from './utils/databaseContentLoader'; // ✅ ÚNICA FONTE: BANCO DE DADOS
import { initializeImageCache } from './utils/imageCache';
import { preloadCriticalResources } from './utils/resourcePreloader';
import { setupTVMode } from './utils/tvNavigation';
import { initSecurityProtections } from './utils/securityChecks';




// Toast nativo simples
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const toastEl = document.createElement('div');
  toastEl.className = `fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all ${type === 'success' ? 'bg-green-600' :
    type === 'error' ? 'bg-red-600' :
      'bg-blue-600'
    }`;
  toastEl.textContent = message;
  document.body.appendChild(toastEl);

  setTimeout(() => {
    toastEl.style.opacity = '0';
    setTimeout(() => toastEl.remove(), 300);
  }, 2000);
};

const toast = {
  success: (msg: string, _options?: any) => showToast(msg, 'success'),
  error: (msg: string, _options?: any) => showToast(msg, 'error'),
  info: (msg: string, _options?: any) => showToast(msg, 'info')
};



function Group() {
  return (
    <div className="absolute inset-[8.333%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path d={svgPaths.p261e0f00} fill="var(--fill-0, #DC2626)" id="Vector" />
          <path d="M10 13V16" id="Vector_2" stroke="var(--stroke-0, #2D2E47)" strokeLinecap="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame308({ active = false, collapsed = false }: { active?: boolean; collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="solar:home-2-linear">
        <Group />
      </div>
      {!collapsed && <p className={`font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre ${active ? 'text-red-600' : 'text-[#fefefe]'}`}>Início</p>}
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[12.5%]" data-name="Group">
      <div className="absolute inset-[-4.167%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <g id="Group">
            <path d={svgPaths.p1d7c1c80} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p274d3200} id="Vector_2" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame310({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="iconamoon:discover">
        <Group1 />
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Descobrir</p>}
    </div>
  );
}

function Frame309({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="fluent:fire-16-regular">
        <div className="absolute inset-[6.25%_15.61%_6.25%_18.76%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 21">
            <path d={svgPaths.p19c1fbc0} fill="var(--fill-0, #FEFEFE)" id="Vector" />
          </svg>
        </div>
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Em Alta</p>}
    </div>
  );
}

function Frame312({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="tabler:stopwatch">
        <div className="absolute inset-[12.5%_20.83%_16.67%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-4.41%_-5.36%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 19">
              <path d={svgPaths.p2511f680} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Em Breve</p>}
    </div>
  );
}

function Frame311({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0">
      <Frame308 active={true} collapsed={collapsed} />
      <Frame310 collapsed={collapsed} />
      <Frame309 collapsed={collapsed} />
      <Frame312 collapsed={collapsed} />
    </div>
  );
}

function Frame2654({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-full not-italic relative shrink-0 text-[#bebebe] text-[12px] w-[min-content]">MENU</p>}
      <Frame311 collapsed={collapsed} />
    </div>
  );
}

function Frame313({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="fluent:clock-12-regular">
        <div className="absolute inset-[8.333%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p841ef00} fill="var(--fill-0, #FEFEFE)" id="Vector" />
          </svg>
        </div>
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Histórico</p>}
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[11.46%_19.79%_11.44%_19.79%]" data-name="Group">
      <div className="absolute inset-[-4.05%_-5.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
          <g id="Group">
            <path d={svgPaths.p23141a00} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame314({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="mage:bookmark-question-mark">
        <Group2 />
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Favoritos</p>}
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[12.5%_8.33%_8.33%_12.5%]" data-name="Group">
      <div className="absolute inset-[-3.947%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
          <g id="Group">
            <path d={svgPaths.p328ee780} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.pec31540} id="Vector_2" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3cd7cf00} id="Vector_3" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame315({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="tabler:calendar-time">
        <Group3 />
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Ver Depois</p>}
    </div>
  );
}

function ChannelsMenuItem({ collapsed = false, onClick }: { collapsed?: boolean; onClick: () => void }) {
  return (
    <div
      className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}
      onClick={onClick}
    >
      <div className="relative shrink-0 size-[24px]">
        <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="#FEFEFE" strokeWidth="1.5">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
          <polyline points="17 2 12 7 7 2" />
        </svg>
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Canais</p>}
    </div>
  );
}

function Frame316({ collapsed = false, onChannelsClick }: { collapsed?: boolean; onChannelsClick: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0">
      <Frame313 collapsed={collapsed} />
      <Frame314 collapsed={collapsed} />
      <Frame315 collapsed={collapsed} />
      <ChannelsMenuItem collapsed={collapsed} onClick={onChannelsClick} />
    </div>
  );
}

function Frame2821({ collapsed = false, onChannelsClick }: { collapsed?: boolean; onChannelsClick: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-full not-italic relative shrink-0 text-[#bebebe] text-[12px] w-[min-content]">BIBLIOTECA</p>}
      <Frame316 collapsed={collapsed} onChannelsClick={onChannelsClick} />
    </div>
  );
}

function Frame317({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="relative shrink-0 size-[24px]" data-name="fluent:person-support-24-regular">
        <div className="absolute inset-[4.16%_16.65%_8.32%_16.68%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(254, 254, 254, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 21">
              <path d={svgPaths.p3ec9480} fill="var(--fill-0, #FEFEFE)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Ajuda</p>}
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[8.33%_10.72%]" data-name="Group">
      <div className="absolute inset-[-3.75%_-3.98%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 22">
          <g id="Group">
            <path d={svgPaths.p36eed880} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeWidth="1.5" />
            <path d={svgPaths.p2959f370} id="Vector_2" stroke="var(--stroke-0, #FEFEFE)" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame318({ collapsed = false, onAdminClick }: { collapsed?: boolean; onAdminClick?: () => void }) {
  return (
    <div
      onClick={onAdminClick}
      className={`content-stretch flex gap-[12px] items-center relative shrink-0 ${collapsed ? '' : 'w-full'} cursor-pointer hover:opacity-80 transition-opacity`}
    >
      <div className="relative shrink-0 size-[24px]" data-name="solar:settings-linear">
        <Group4 />
      </div>
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#fefefe] text-[16px] text-nowrap whitespace-pre">Admin Panel</p>}
    </div>
  );
}

function Frame319({ collapsed = false, onAdminClick }: { collapsed?: boolean; onAdminClick?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0">
      <Frame317 collapsed={collapsed} />
      <Frame318 collapsed={collapsed} onAdminClick={onAdminClick} />
    </div>
  );
}

function Frame2822({ collapsed = false, onAdminClick }: { collapsed?: boolean; onAdminClick?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
      {!collapsed && <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-full not-italic relative shrink-0 text-[#bebebe] text-[12px] w-[min-content]">OUTROS</p>}
      <Frame319 collapsed={collapsed} onAdminClick={onAdminClick} />
    </div>
  );
}

function Frame3370({ collapsed = false, onChannelsClick, onAdminClick }: { collapsed?: boolean; onChannelsClick: () => void; onAdminClick: () => void }) {
  return (
    <div className={`absolute content-stretch flex flex-col gap-[34px] items-start left-[24px] top-[104px] transition-all duration-300 ${collapsed ? 'w-[48px]' : 'w-[146px]'}`}>
      <Frame2654 collapsed={collapsed} />
      <Frame2821 collapsed={collapsed} onChannelsClick={onChannelsClick} />
      <Frame2822 collapsed={collapsed} onAdminClick={onAdminClick} />
    </div>
  );
}

function Frame2789({ activeCategory, onCategoryChange }: { activeCategory: string; onCategoryChange: (category: string) => void }) {
  const categories = ['Início', 'Filmes', 'Séries', 'Animes', 'Canais', 'Futebol', 'Kids'];

  return (
    <div className="content-stretch flex gap-[24px] items-center leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre px-[30px] my-[6px] my-[7px] mx-[0px] px-[130px] py-[0px]">
      {categories.map((category) => (
        <p
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity ${activeCategory === category
            ? "font-['Inter:Bold',sans-serif] font-bold"
            : "font-['Inter:Medium',sans-serif] font-medium"
            }`}
        >
          {category}
        </p>
      ))}
    </div>
  );
}

function Frame2790({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <div
      className="content-stretch flex items-center justify-center relative shrink-0 cursor-pointer"
      onClick={onSearchClick}
    >
      <div className="relative shrink-0 size-[24px]" data-name="majesticons:search-line">
        <div className="absolute inset-[16.66%_16.67%_16.67%_16.66%]" data-name="Vector">
          <div className="absolute inset-[-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <path d={svgPaths.pad20300} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2791({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <div
      className="content-stretch flex items-center justify-center relative shrink-0 cursor-pointer transition-all hover:scale-110"
      onClick={onSearchClick}
    >
      <Frame2790 onSearchClick={onSearchClick} />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[8.33%_16.67%_8.33%_16.66%]" data-name="Group">
      <div className="absolute inset-[-5%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 22">
          <g id="Group">
            <path d={svgPaths.p204109f0} id="Vector" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p3d802230} id="Vector_2" stroke="var(--stroke-0, #FEFEFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame2792() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
      <div className="relative shrink-0 size-[44px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
          <circle cx="22" cy="22" fill="var(--fill-0, #B8DFF2)" id="Ellipse 182" r="22" />
        </svg>
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="ri:arrow-drop-down-line">
        <div className="absolute inset-[38.93%_32.32%_37.5%_32.32%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 6">
            <path d={svgPaths.p3d5b69c0} fill="var(--fill-0, #FEFEFE)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame2793() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 transition-opacity" data-name="akar-icons:bell">
        <Group5 />
      </div>
      <Frame2792 />
    </div>
  );
}

function Frame3368({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <div className="content-stretch flex gap-[34px] items-center relative shrink-0">
      <Frame2791 onSearchClick={onSearchClick} />
      <Frame2793 />
    </div>
  );
}

function Frame3369({ activeCategory, onCategoryChange, onSearchClick }: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onSearchClick: () => void;
}) {
  return (
    <div className="content-stretch flex items-center justify-between top-[12px] w-full px-[0px] py-[5px] my-[-30px] mx-[0px] m-[0px]">
      <div className="flex items-center gap-[24px] mx-[0px] my-[30px] px-[30px] px-[50px] py-[5px]">
        <Frame2789 activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
      </div>
      <Frame3368 onSearchClick={onSearchClick} />
    </div>
  );
}


function App() {
  // Auth & Navigation States
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'choosePlan' | 'profileSelection' | 'profileManagement' | 'home'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Content States
  const [allContent, setAllContent] = useState<Movie[]>([]);
  const [topShows, setTopShows] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);
  const [activeCategory, setActiveCategory] = useState('Início');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<{ id: number; name: string } | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null); // ✅ ESTADO DO PLAYER

  // Função wrapper para validar antes de abrir MovieDetails
  const handleMovieClick = (movie: Movie | null) => {
    console.log('🎬 handleMovieClick chamado:', movie);

    if (!movie) {
      console.log('🎬 Fechando MovieDetails (movie = null)');
      setSelectedMovie(null);
      return;
    }

    // Validar ID
    if (!movie.id || movie.id <= 0 || isNaN(movie.id)) {
      console.warn('⚠️ Invalid movie ID, skipping:', movie);
      return;
    }

    // ✅ LOG IMPORTANTE: Verificar se streamUrl está presente
    console.log('🎬 Abrindo MovieDetails para:', movie.title || movie.name, 'ID:', movie.id);
    console.log('📡 streamUrl presente:', (movie as any).streamUrl || 'NÃO ENCONTRADA');
    console.log('🖼️ poster_path:', movie.poster_path || 'NÃO ENCONTRADO');
    console.log('📦 Objeto completo:', movie);

    setSelectedMovie(movie);
  };

  // ✅ FUNÇÕES DO PLAYER (padrão limpo)
  const handlePlayMovie = (movie: Movie) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎬 REPRODUZINDO:', movie.title || movie.name);
    console.log('🎥 Stream URL:', movie.streamUrl);
    console.log('📂 Categoria:', movie.category || 'N/A');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Validar se tem streamUrl
    if (!movie.streamUrl) {
      console.error('❌ ERRO: Filme sem streamUrl!', movie);
      alert('Erro: Este filme não possui URL de reprodução.');
      return;
    }

    setSelectedMovie(null); // Fechar MovieDetails
    setPlayingMovie(movie); // Abrir Player
  };

  const handleBackFromPlayer = () => {
    console.log('🔙 handleBackFromPlayer: Fechando player');
    setPlayingMovie(null);
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showChannels, setShowChannels] = useState(false);
  const [showKidsPage, setShowKidsPage] = useState(false);
  const [showSoccerPage, setShowSoccerPage] = useState(false);
  const [showLanguagePage, setShowLanguagePage] = useState(false);
  const [showMyListPage, setShowMyListPage] = useState(false);
  const [showContinueWatchingPage, setShowContinueWatchingPage] = useState(false);
  const [showHistoryPage, setShowHistoryPage] = useState(false);
  const [showFavoritosPage, setShowFavoritosPage] = useState(false);
  const [showRedFlixOriginalsPage, setShowRedFlixOriginalsPage] = useState(false);
  const [showMoviesPage, setShowMoviesPage] = useState(false);
  const [showSeriesPage, setShowSeriesPage] = useState(false);
  const [showBombandoPage, setShowBombandoPage] = useState(false);
  const [showIPTVPage, setShowIPTVPage] = useState(false);
  const [showCanaisPage, setShowCanaisPage] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Minha Lista & Likes States (com localStorage)
  const [myList, setMyList] = useState<number[]>(() => {
    const saved = localStorage.getItem('redflix_mylist');
    return saved ? JSON.parse(saved) : [];
  });
  const [likedList, setLikedList] = useState<number[]>(() => {
    const saved = localStorage.getItem('redflix_liked');
    return saved ? JSON.parse(saved) : [];
  });
  const [watchLaterList, setWatchLaterList] = useState<number[]>(() => {
    const saved = localStorage.getItem('redflix_watchlater');
    return saved ? JSON.parse(saved) : [];
  });
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [showAccountPage, setShowAccountPage] = useState(false);
  const [showTestBackend, setShowTestBackend] = useState(false);
  const [showTestConnection, setShowTestConnection] = useState(false);
  const [showContentManager, setShowContentManager] = useState(false);
  const [showGitHubDiagnostics, setShowGitHubDiagnostics] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [currentUser] = useState({ name: 'Usuário', email: 'usuario@example.com', avatar: '' });
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<number>(0);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null); // State para z-index fix
  const [selectedProviderName, setSelectedProviderName] = useState<string>('');
  const [bottomNavTab, setBottomNavTab] = useState<string>('home');
  const [mobileFilter, setMobileFilter] = useState<string>('series');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // TOP 10 States
  const [top10BrasilSeries, setTop10BrasilSeries] = useState<Movie[]>([]);
  const [top10Trending, setTop10Trending] = useState<Movie[]>([]);

  // Verificar se deve resetar para tela de login
  useEffect(() => {
    // Verificar URL para parâmetro de reset
    const urlParams = new URLSearchParams(window.location.search);
    const shouldReset = urlParams.get('reset');

    if (shouldReset === 'true') {
      console.log('🔄 Resetando para tela de login...');
      localStorage.removeItem('redflix_current_screen');
      localStorage.removeItem('redflix_auth');
      sessionStorage.clear();
      setCurrentScreen('login');
      setIsAuthenticated(false);

      // Remover parâmetro da URL
      window.history.replaceState({}, document.title, '/');
    }

    // Verificar se deve forçar login (não está autenticado)
    const savedAuth = localStorage.getItem('redflix_auth');
    if (!savedAuth || savedAuth !== 'true') {
      console.log('🔒 Usuário não autenticado - redirecionando para login');
      setCurrentScreen('login');
      setIsAuthenticated(false);
    }
  }, []);

  // Inicializar sistema de cache de imagens
  useEffect(() => {
    console.log('🚀 Initializing RedFlix Image Cache System...');
    initializeImageCache();

    // DESABILITADO: Edge Functions não deployadas no novo projeto vsztquvvnwlxdwyeoffh
    // O sistema funciona perfeitamente sem cache server-side (degradação graciosa)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📡 REDFLIX SYSTEM STATUS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ TMDB API: Direct connection (working)');
    console.log('✅ Image Loading: Direct from TMDB CDN');
    console.log('⏸️  Edge Functions: Disabled (not deployed)');
    console.log('⏸️  Server Cache: Disabled (not needed)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎬 All features fully functional!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, []);

    // Preload de recursos críticos na inicialização
    useEffect(() => {
      preloadCriticalResources();
    }, []);

    // Inicializar TV Mode e Security Protections
    useEffect(() => {
      console.log('Initializing TV Mode and Security Protections...');
    
      // Setup TV navigation for Android TV / TV Box
      setupTVMode();
      console.log('TV Mode initialized');
    
      // Initialize security protections (device fingerprint, devtools detection, etc)
      initSecurityProtections();
      console.log('Security Protections initialized');
    }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setLoadingProgress(10);
        setError(null);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎬 REDFLIX - FONTE ÚNICA: filmes.txt REMOTO + TMDB');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📡 Fonte: https://chemorena.com/filmes/filmes.txt');
        console.log('🎨 Enriquecimento: TMDB API (imagens)');
        console.log('📹 URLs de vídeo: MP4 direto do .txt');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        setLoadingProgress(20);

        // ✅ FONTE ÚNICA: BANCO DE DADOS
        console.log('🎬 ═══════════════════════════════════════════════════');
        console.log('🎬 CARREGANDO CONTEÚDO');
        console.log('🎬 Fonte: BANCO DE DADOS (API /api/content)');
        console.log('🎬 ═══════════════════════════════════════════════════');

        const contentData = await loadAllContentFromDatabase();

        setLoadingProgress(60);

        console.log('✅ Carregado:', contentData.movies.length, 'filmes +', contentData.series.length, 'séries');

        setLoadingProgress(70);

        // Combinar filmes e séries para a home
        const allMoviesAndSeries = [...contentData.movies, ...contentData.series];

        if (allMoviesAndSeries.length === 0) {
          console.warn('⚠️ Nenhum conteúdo encontrado');
          setError('Falha ao carregar conteúdo. Verifique sua conexão.');
          setLoading(false);
          return;
        }

        console.log(`✅ Total combinado: ${allMoviesAndSeries.length} itens`);

        setLoadingProgress(80);

                // Converter para formato do App usando a funcao convertToMovieFormat
                const convertedMovies = allMoviesAndSeries.map(item => convertToMovieFormat(item));

                setLoadingProgress(90);

                // Organizar conteudo
                setAllContent(convertedMovies);
                setTopShows(convertedMovies.slice(0, 20));
                setContinueWatching(convertedMovies.slice(0, 5));

                // TOP 10 - conteudo com melhor avaliacao
                const top10Content = [...convertedMovies]
                  .filter((m: any) => m.vote_average && m.vote_average > 0)
                  .sort((a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0))
                  .slice(0, 10);

                setTop10BrasilSeries(top10Content.length > 0 ? top10Content : convertedMovies.slice(0, 10));
        setTop10Trending(convertedMovies.slice(0, 10));

        setLoadingProgress(100);
        setLoading(false);

        console.log('✅ ═══════════════════════════════════════════════════');
        console.log('✅ PÁGINA CARREGADA!');
        console.log('✅ Total:', convertedMovies.length, 'itens');
        console.log('✅ Filmes:', contentData.movies.length);
        console.log('✅ Séries:', contentData.series.length);
        console.log('✅ ═══════════════════════════════════════════════════');

        // Log de amostra
        if (convertedMovies.length > 0) {
          console.log('📊 AMOSTRA DO PRIMEIRO ITEM:');
          console.log('  Título:', convertedMovies[0].title || convertedMovies[0].name);
          console.log('  Tipo:', convertedMovies[0].type);
          console.log('  Poster TMDB:', convertedMovies[0].poster_path ? '✅' : '❌');
          console.log('  Logo TMDB:', convertedMovies[0].logo ? '✅' : '❌');
          console.log('  Embed URL:', convertedMovies[0].embedUrl || 'N/A');
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      } catch (error) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ ERRO NO CARREGAMENTO:', error);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        setError('Erro ao carregar conteúdo. Verifique sua conexão.');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Efeito para esconder/mostrar barra superior ao rolar
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Mostrar barra ao rolar
      setShowTopBar(true);

      // Limpar timeout anterior
      clearTimeout(timeoutId);

      // Esconder após 2 segundos de inatividade
      timeoutId = setTimeout(() => {
        if (currentScrollY > 100) {
          setShowTopBar(false);
        }
      }, 2000);

      setLastScrollY(currentScrollY);
    };

    // Mostrar barra ao mover o mouse
    const handleMouseMove = () => {
      setShowTopBar(true);
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (window.scrollY > 100) {
          setShowTopBar(false);
        }
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      console.log('🔍 Busca vazia - resetando resultados');
      setShowSearchResults(false);
      return;
    }

    console.log('🔍 Buscando por:', query);

    // Filtrar conteúdo baseado na query
    const searchResults = allContent.filter(item => {
      const title = (item.title || item.name || '').toLowerCase();
      const overview = (item.overview || '').toLowerCase();
      const searchTerm = query.toLowerCase();

      return title.includes(searchTerm) || overview.includes(searchTerm);
    });

    console.log(`✅ ${searchResults.length} resultados encontrados para "${query}"`);

    // Mostrar página de resultados
    setShowSearchResults(true);
  };

  // Funções para gerenciar Minha Lista e Likes
  const handleAddToList = (movie: Movie) => {
    const isAdding = !myList.includes(movie.id);
    const title = movie.title || movie.name || 'Item';

    setMyList((prev) => {
      const newList = prev.includes(movie.id)
        ? prev.filter(id => id !== movie.id)
        : [...prev, movie.id];
      localStorage.setItem('redflix_mylist', JSON.stringify(newList));
      return newList;
    });

    if (isAdding) {
      toast.success(`${title} adicionado à Minha Lista`, {
        duration: 2000,
        position: 'bottom-center',
      });
    } else {
      toast(`${title} removido da Minha Lista`, {
        duration: 2000,
        position: 'bottom-center',
      });
    }
  };

  const handleLike = (movie: Movie) => {
    const isLiking = !likedList.includes(movie.id);
    const title = movie.title || movie.name || 'Item';

    setLikedList((prev) => {
      const newList = prev.includes(movie.id)
        ? prev.filter(id => id !== movie.id)
        : [...prev, movie.id];
      localStorage.setItem('redflix_liked', JSON.stringify(newList));
      return newList;
    });

    if (isLiking) {
      toast.success(`Você curtiu ${title}`, {
        duration: 2000,
        position: 'bottom-center',
        icon: '👍',
      });
    } else {
      toast(`Curtida removida de ${title}`, {
        duration: 2000,
        position: 'bottom-center',
      });
    }
  };

  const handleWatchLater = (movie: Movie) => {
    const isAdding = !watchLaterList.includes(movie.id);
    const title = movie.title || movie.name || 'Item';

    setWatchLaterList((prev) => {
      const newList = prev.includes(movie.id)
        ? prev.filter(id => id !== movie.id)
        : [...prev, movie.id];
      localStorage.setItem('redflix_watchlater', JSON.stringify(newList));
      return newList;
    });

    if (isAdding) {
      toast.success(`${title} adicionado a Assistir Depois`, {
        duration: 2000,
        position: 'bottom-center',
        icon: '🕒',
      });
    } else {
      toast(`${title} removido de Assistir Depois`, {
        duration: 2000,
        position: 'bottom-center',
      });
    }
  };

  // Categorizar conteúdo (usar media_type ou verificar title vs name)
  const movies = allContent.filter(item => {
    // Se tiver media_type, usar ele
    if (item.media_type === 'movie') return true;
    if (item.media_type === 'tv') return false;
    // Senão, usar heurística: filmes têm 'title' e séries têm 'name'
    return item.title !== undefined && item.name === undefined;
  });

  const series = allContent.filter(item => {
    if (item.media_type === 'tv') return true;
    if (item.media_type === 'movie') return false;
    return item.name !== undefined && item.title === undefined;
  });

  // Filtrar por categoria ativa (Filmes ou Séries) e por plataforma (se selecionada)
  let filteredContent = activeCategory === 'Filmes' ? movies :
    activeCategory === 'Séries' ? series :
      allContent;

  // Se uma plataforma foi selecionada, filtrar por ela
  // Nota: Este filtro é simulado, pois os dados do TMDB não incluem provider_id por padrão
  // Em produção, você precisaria fazer uma chamada à API do TMDB para obter essa informação
  if (selectedProvider > 0) {
    console.log(`🎯 Filtrando conteúdo pela plataforma: ${selectedProviderName} (Provider ID: ${selectedProvider})`);
    // Aqui você implementaria a lógica real de filtro quando tiver os dados de providers
    // Por enquanto, vamos mostrar todo o conteúdo com uma mensagem de log
  }

  // Mapear genre_ids para nomes de categorias (IDs do TMDB)
  const genreMap: Record<number, string> = {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Document��rio',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Ficção Científica',
    10770: 'Cinema TV',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Faroeste',
    // Gêneros de TV
    10759: 'Action & Adventure',
    10762: 'Kids',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics'
  };

  // Agrupar conteúdo por gênero
  const contentByGenre: Record<string, Movie[]> = {};

  filteredContent.forEach(item => {
    if (item.genre_ids && item.genre_ids.length > 0) {
      item.genre_ids.forEach(genreId => {
        const genreName = genreMap[genreId] || 'Outros';
        if (!contentByGenre[genreName]) {
          contentByGenre[genreName] = [];
        }
        if (!contentByGenre[genreName].find(m => m.id === item.id)) {
          contentByGenre[genreName].push(item);
        }
      });
    } else {
      if (!contentByGenre['Outros']) {
        contentByGenre['Outros'] = [];
      }
      if (!contentByGenre['Outros'].find(m => m.id === item.id)) {
        contentByGenre['Outros'].push(item);
      }
    }
  });

  // Ordenar cada gênero para que conteúdo local apareça primeiro
  Object.keys(contentByGenre).forEach(genre => {
    contentByGenre[genre].sort((a, b) => {
      const aIsLocal = (a as any).isLocal ? 1 : 0;
      const bIsLocal = (b as any).isLocal ? 1 : 0;
      return bIsLocal - aIsLocal; // Local primeiro
    });
  });

  // Ordenar categorias por quantidade de itens
  // Na página Início: top 10 categorias
  // Na página Filmes/Séries: TODAS as categorias
  const sortedGenres = Object.entries(contentByGenre)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, activeCategory === 'Início' ? 10 : undefined); // Sem limite para Filmes/Séries

  // Navigation Handlers
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('profileSelection');
  };

  const handleSignup = () => {
    setCurrentScreen('signup');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleContinueToPlans = () => {
    setCurrentScreen('choosePlan');
  };

  const handleContinueToProfile = () => {
    setCurrentScreen('profileSelection');
  };

  const handleSelectProfile = () => {
    setCurrentScreen('home');
  };

  // Handle category changes from header
  const handleCategoryChange = (category: string) => {
    switch (category) {
      case 'home':
        setActiveCategory('Início');
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        break;
      case 'redflix-originals':
        setShowRedFlixOriginalsPage(true);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setShowMyListPage(false);
        setShowContinueWatchingPage(false);
        setShowHistoryPage(false);
        setShowFavoritosPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      case 'Filmes':
        setShowMoviesPage(true);
        setShowSeriesPage(false);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setShowRedFlixOriginalsPage(false);
        setBottomNavTab('home');
        break;
      case 'Séries':
        setShowSeriesPage(true);
        setShowMoviesPage(false);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setShowRedFlixOriginalsPage(false);
        setBottomNavTab('home');
        break;
      case 'canais':
        setShowCanaisPage(true);
        setShowChannels(false);
        setShowLanguagePage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setShowIPTVPage(false);
        setShowBombandoPage(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setBottomNavTab('home');
        break;
      case 'futebol':
        setShowSoccerPage(true);
        setShowLanguagePage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        break;
      case 'kids':
        setShowKidsPage(true);
        setShowLanguagePage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('games');
        break;
      case 'languages':
        setShowLanguagePage(true);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      case 'user-dashboard':
        setShowUserDashboard(true);
        setBottomNavTab('profile');
        break;
      case 'admin-dashboard':
        setShowAdminDashboard(true);
        setBottomNavTab('profile');
        break;
      case 'my-profile':
        setShowMyProfile(true);
        setBottomNavTab('profile');
        break;
      case 'account-settings':
        setShowAccountSettings(true);
        setBottomNavTab('profile');
        break;
      case 'account':
        setShowAccountPage(true);
        setBottomNavTab('profile');
        break;
      case 'test-backend':
        setShowTestBackend(true);
        setBottomNavTab('profile');
        break;
      case 'test-connection':
        setShowTestConnection(true);
        setBottomNavTab('profile');
        break;
      case 'content-manager':
        setShowContentManager(true);
        setBottomNavTab('profile');
        break;
      case 'github-diagnostics':
        setShowGitHubDiagnostics(true);
        setBottomNavTab('profile');
        break;
      case 'trending':
        setActiveCategory('Início');
        setBottomNavTab('trending');
        break;
      case 'bombando':
        setShowBombandoPage(true);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setBottomNavTab('home');
        break;
      case 'iptv':
        setShowIPTVPage(true);
        setShowBombandoPage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setBottomNavTab('home');
        break;
      case 'my-list':
        setShowMyListPage(true);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      case 'continue-watching':
        setShowContinueWatchingPage(true);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      case 'favorites':
        setShowFavoritosPage(true);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      case 'history':
        setShowHistoryPage(true);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        setBottomNavTab('home');
        break;
      default:
        setActiveCategory(category);
        setShowChannels(false);
        setShowKidsPage(false);
        setShowSoccerPage(false);
        setShowLanguagePage(false);
        setShowMyListPage(false);
        setShowContinueWatchingPage(false);
        setShowHistoryPage(false);
        setShowFavoritosPage(false);
        setShowRedFlixOriginalsPage(false);
        setShowMoviesPage(false);
        setShowSeriesPage(false);
        // Atualizar bottom nav baseado na categoria
        if (category === 'Início' || category === 'home') {
          setBottomNavTab('home');
        }
    }
  };

  // Screen Routing
  // Verificação especial para DatabaseStatus (via URL: ?db-status=true)
  if (typeof window !== 'undefined' && window.location.search.includes('db-status=true')) {
    return <DatabaseStatus />;
  }

  // Verificação especial para IptvServiceTest (via URL: ?iptv-test=true)
  if (typeof window !== 'undefined' && window.location.search.includes('iptv-test=true')) {
    return <IptvServiceTest />;
  }

  // ✅ PRIORIDADE MÁXIMA: Renderizar Player quando há filme reproduzindo
  if (playingMovie) {
    return <Player movie={playingMovie} onBack={handleBackFromPlayer} />;
  }

  if (currentScreen === 'login') {
    return <Login onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (currentScreen === 'signup') {
    return (
      <>
        <Signup onBack={handleBackToLogin} onContinue={handleContinueToPlans} />
        <ResetButton />
      </>
    );
  }

  if (currentScreen === 'choosePlan') {
    return (
      <>
        <ChoosePlan onBack={() => setCurrentScreen('signup')} onContinue={handleContinueToProfile} />
        <ResetButton />
      </>
    );
  }

  if (currentScreen === 'profileSelection') {
    return (
      <>
        <ProfileSelection
          onSelectProfile={handleSelectProfile}
          onSelectKidsProfile={() => {
            handleSelectProfile();
            setShowKidsPage(true);
            setBottomNavTab('games');
          }}
          onManageProfiles={() => setCurrentScreen('profileManagement')}
        />
        <ResetButton />
      </>
    );
  }

  if (currentScreen === 'profileManagement') {
    return (
      <>
        <ProfileManagement
          onBack={() => setCurrentScreen('profileSelection')}
          onSave={(profiles) => {
            console.log('Perfis salvos:', profiles);
            // Aqui você pode salvar os perfis no localStorage ou backend
          }}
        />
        <ResetButton />
      </>
    );
  }

  // Show My Profile
  if (showMyProfile) {
    return (
      <MyProfile
        onClose={() => setShowMyProfile(false)}
        currentUser={currentUser}
        onManageProfiles={() => {
          setShowMyProfile(false);
          setCurrentScreen('profileManagement');
        }}
      />
    );
  }

  // Show user dashboard
  if (showUserDashboard) {
    return (
      <>
        <NetflixHeader
          activeCategory="user-dashboard"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <UserDashboard
          onBack={() => setShowUserDashboard(false)}
          onProfileClick={() => {
            setShowUserDashboard(false);
            setShowMyProfile(true);
          }}
          onAccountClick={() => {
            setShowUserDashboard(false);
            setShowAccountPage(true);
          }}
        />
      </>
    );
  }

  // Show admin dashboard
  if (showAdminDashboard) {
    return (
      <>
        <NetflixHeader
          activeCategory="admin"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
      </>
    );
  }

  // Show account settings
  if (showAccountSettings) {
    return (
      <>
        <NetflixHeader
          activeCategory="account-settings"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <AccountSettings onClose={() => setShowAccountSettings(false)} />
      </>
    );
  }

  // Show My Profile page
  if (showMyProfile) {
    return (
      <>
        <NetflixHeader
          activeCategory="my-profile"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <MyProfile
          onClose={() => setShowMyProfile(false)}
          currentUser={currentUser}
        />
      </>
    );
  }

  // Show Account Page
  if (showAccountPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="account"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <AccountPage
          onClose={() => setShowAccountPage(false)}
          currentUser={currentUser}
          onLogout={() => {
            setShowAccountPage(false);
            setCurrentScreen('login');
            setIsAuthenticated(false);
          }}
        />
      </>
    );
  }

  // Show Test Connection page
  if (showTestConnection) {
    return (
      <>
        <TestConnection />
        <button
          onClick={() => setShowTestConnection(false)}
          className="fixed top-4 right-4 z-50 bg-[#E50914] hover:bg-[#C41A23] text-white px-4 py-2 rounded-lg"
        >
          ← Voltar
        </button>
      </>
    );
  }

  // Show Test Backend page
  if (showTestBackend) {
    return (
      <>
        <TestBackend />
        <button
          onClick={() => setShowTestBackend(false)}
          className="fixed top-4 right-4 z-50 bg-[#E50914] hover:bg-[#C41A23] text-white px-4 py-2 rounded-lg"
        >
          ← Voltar
        </button>
      </>
    );
  }

  // Show Content Manager page
  if (showContentManager) {
    return (
      <>
        <ContentManagerPage />
        <button
          onClick={() => setShowContentManager(false)}
          className="fixed top-4 right-4 z-50 bg-[#E50914] hover:bg-[#C41A23] text-white px-4 py-2 rounded-lg shadow-lg"
        >
          ← Voltar
        </button>
      </>
    );
  }

  // Show GitHub Diagnostics page
  if (showGitHubDiagnostics) {
    return (
      <>
        <GitHubDiagnostics />
        <button
          onClick={() => setShowGitHubDiagnostics(false)}
          className="fixed top-4 right-4 z-50 bg-[#E50914] hover:bg-[#C41A23] text-white px-4 py-2 rounded-lg shadow-lg"
        >
          ← Voltar
        </button>
      </>
    );
  }

  // Show Search Results page
  if (showSearchResults && searchQuery.trim()) {
    return (
      <>
        <SearchResultsPage
          searchQuery={searchQuery}
          allContent={allContent}
          onClose={() => {
            setShowSearchResults(false);
            setSearchQuery('');
          }}
          onMovieClick={handleMovieClick}
          onSearchClick={() => {
            setShowSearchResults(false);
            setShowSearchOverlay(true);
          }}
          onAddToList={handleAddToList}
          onLike={handleLike}
          onWatchLater={handleWatchLater}
          myList={myList}
          likedList={likedList}
          watchLaterList={watchLaterList}
        />
      </>
    );
  }

  // Show channels page if channels is selected
  if (showChannels) {
    return (
      <>
        <NetflixHeader
          activeCategory="canais"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <ChannelsPage onClose={() => setShowChannels(false)} />
      </>
    );
  }

  // Show kids page if kids is selected
  if (showKidsPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="kids"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <KidsPage onClose={() => setShowKidsPage(false)} />
      </>
    );
  }

  // Show soccer page if soccer is selected
  if (showSoccerPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="futebol"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onLogoClick={() => {
            setShowSoccerPage(false);
            setActiveCategory('Início');
          }}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <SoccerPage onClose={() => setShowSoccerPage(false)} />
      </>
    );
  }

  // Show language browse page if selected
  if (showLanguagePage) {
    return (
      <>
        <NetflixHeader
          activeCategory="languages"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <LanguageBrowsePage
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          onLike={handleLike}
          onWatchLater={handleWatchLater}
          myList={myList}
          likedList={likedList}
          watchLaterList={watchLaterList}
        />
      </>
    );
  }

  // Show My List page
  if (showMyListPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="my-list"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <MyListPage
          onClose={() => setShowMyListPage(false)}
          onMovieClick={handleMovieClick}
          myList={myList}
          onRemoveFromList={(movieId) => {
            setMyList(myList.filter(id => id !== movieId));
            localStorage.setItem('redflix_mylist', JSON.stringify(myList.filter(id => id !== movieId)));
          }}
          onAddToList={handleAddToList}
          onLike={handleLike}
          onWatchLater={handleWatchLater}
          likedList={likedList}
          watchLaterList={watchLaterList}
        />
      </>
    );
  }

  // Show Continue Watching page
  if (showContinueWatchingPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="continue-watching"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <ContinueWatchingPage
          onClose={() => setShowContinueWatchingPage(false)}
          onMovieClick={handleMovieClick}
        />
      </>
    );
  }

  // Show History page
  if (showHistoryPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="history"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <HistoryPage
          onClose={() => setShowHistoryPage(false)}
          onMovieClick={handleMovieClick}
        />
      </>
    );
  }

  // Show Favoritos page
  if (showFavoritosPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="favorites"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <FavoritosPage
          onClose={() => setShowFavoritosPage(false)}
          onMovieClick={handleMovieClick}
          likedList={likedList}
          onRemoveLike={(movieId) => {
            setLikedList(likedList.filter(id => id !== movieId));
            localStorage.setItem('redflix_likedlist', JSON.stringify(likedList.filter(id => id !== movieId)));
          }}
          onAddToList={handleAddToList}
          onLike={handleLike}
          onWatchLater={handleWatchLater}
          myList={myList}
          watchLaterList={watchLaterList}
        />
      </>
    );
  }

  // Show RedFlix Originals page
  if (showRedFlixOriginalsPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="redflix-originals"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <RedFlixOriginalsPage
          onClose={() => setShowRedFlixOriginalsPage(false)}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          onLike={handleLike}
          onWatchLater={handleWatchLater}
          myList={myList}
          likedList={likedList}
          watchLaterList={watchLaterList}
        />
      </>
    );
  }

  // Show Movies page
  if (showMoviesPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="Filmes"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <MoviesPage
          onClose={() => setShowMoviesPage(false)}
          onMovieClick={handleMovieClick}
          onPlay={handlePlayMovie}
          onAddToList={handleAddToList}
          onLike={handleLike}
          onWatchLater={handleWatchLater}
          myList={myList}
          likedList={likedList}
          watchLaterList={watchLaterList}
        />
      </>
    );
  }

  // Show Series page
  if (showSeriesPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="Séries"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <SeriesPage
          onClose={() => setShowSeriesPage(false)}
          onMovieClick={handleMovieClick}
          onPlay={handlePlayMovie}
          onAddToList={handleAddToList}
          onLike={handleLike}
          onWatchLater={handleWatchLater}
          myList={myList}
          likedList={likedList}
          watchLaterList={watchLaterList}
        />
      </>
    );
  }

  // Show Bombando page
  if (showBombandoPage) {
    return (
      <>
        <NetflixHeader
          activeCategory="bombando"
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
          onProfileClick={() => setCurrentScreen('login')}
          currentUser={currentUser}
        />
        <BombandoPage
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          onLike={handleLike}
          onWatchLater={handleWatchLater}
          myList={myList}
          likedList={likedList}
          watchLaterList={watchLaterList}
        />
      </>
    );
  }

  // Show IPTV page
  if (showIPTVPage) {
    return (
      <>
        <IPTVPage
          onClose={() => setShowIPTVPage(false)}
          onCategoryChange={handleCategoryChange}
          onSearchClick={() => setShowSearchOverlay(true)}
        />
      </>
    );
  }

  // Show Canais page
  if (showCanaisPage) {
    return (
      <CanaisPage
        onClose={() => setShowCanaisPage(false)}
      />
    );
  }

  // Show person details if a person is selected
  if (selectedPerson) {
    return (
      <PersonDetails
        personId={selectedPerson.id}
        personName={selectedPerson.name}
        onClose={() => setSelectedPerson(null)}
        onContentClick={(id, mediaType) => {
          setSelectedPerson(null);
          // Criar um objeto Movie básico para abrir o MovieDetails
          handleMovieClick({
            id,
            title: mediaType === 'movie' ? '' : undefined,
            name: mediaType === 'tv' ? '' : undefined,
            poster_path: '',
            backdrop_path: '',
            overview: '',
            vote_average: 0,
            media_type: mediaType,
            first_air_date: mediaType === 'tv' ? '' : undefined,
            release_date: mediaType === 'movie' ? '' : undefined
          });
        }}
      />
    );
  }

  // Show movie details if a movie is selected
  if (selectedMovie) {
    return (
      <MovieDetails
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onActorClick={(actorId, actorName) => {
          console.log('🎬 App: Recebeu clique no ator:', actorName, 'ID:', actorId);
          handleMovieClick(null);
          setSelectedPerson({ id: actorId, name: actorName });
        }}
        onPlayMovie={handlePlayMovie}
      />
    );
  }

  return (
    <div className="bg-[#141414] relative w-full min-h-screen overflow-x-hidden" data-name="Movie Dashboard">
      {/* Performance Monitor - Ativar com: localStorage.setItem('redflix-show-performance', 'true') */}
      <PerformanceMonitor />

      {/* Error Banner */}
      {error && (
        <div className="fixed top-20 right-8 bg-red-600 text-white p-4 z-50 transition-all duration-300 rounded-lg shadow-2xl max-w-md">
          <p className="font-['Inter:Medium',sans-serif]">Erro: {error}</p>
          <p className="text-sm mt-2">Verifique o console para mais detalhes e certifique-se de que sua chave da API TMDB está configurada corretamente.</p>
        </div>
      )}

      {/* Netflix Header */}
      <NetflixHeader
        activeCategory={activeCategory === 'Início' ? 'home' : activeCategory === 'Séries' ? 'Séries' : activeCategory === 'Filmes' ? 'Filmes' : activeCategory}
        onCategoryChange={handleCategoryChange}
        onSearchClick={() => setShowSearchOverlay(true)}
        onProfileClick={() => setCurrentScreen('login')}
        currentUser={currentUser}
      />

      {/* Show Channels Page in fullscreen mode */}
      {activeCategory === 'Canais' ? (
        <ChannelsPage />
      ) : (
        <>
          {/* Hero Slider */}
          <HeroSlider
            onMovieClick={handleMovieClick}
            sidebarCollapsed={false}
            onAddToList={handleAddToList}
            onLike={handleLike}
            onWatchLater={handleWatchLater}
            myList={myList}
            likedList={likedList}
            watchLaterList={watchLaterList}
          />

          {/* Continuar Assistindo Section */}
          {activeCategory === 'Início' && (
            <div className="relative z-10 -mt-20">
              <ContinueWatching 
                userId={1}
                onPlay={(movie, streamUrl) => handlePlayMovie(movie, streamUrl)}
              />
            </div>
          )}

          {/* TOP 10 Section - EMBAIXO DO BANNER PRINCIPAL */}
          {activeCategory === 'Início' && !loading && (
            <div
              className="absolute z-10 left-0 right-0"
              style={{
                top: 'calc(100vh + 75px)'
              }}
            >
              <div className="bg-gradient-to-b from-black via-black to-transparent pb-12">
                {/* TOP 10 Brasil */}
                {top10BrasilSeries.length > 0 && (
                  <Top10Section
                    title="Brasil: top 10 em séries hoje"
                    movies={top10BrasilSeries}
                    onMovieClick={handleMovieClick}
                  />
                )}
              </div>
            </div>
          )}

          {/* Featured Banners - Logo abaixo do TOP 10 */}
          <div
            className="absolute z-10 left-0 right-0"
            style={{
              top: activeCategory === 'Início' && !loading && top10BrasilSeries.length > 0
                ? 'calc(100vh + 625px)'
                : '100vh'
            }}
          >
            <FeaturedBanners />
            <StreamingLogos
              onPlatformSelect={(providerId, platformName) => {
                setSelectedProvider(providerId);
                setSelectedProviderName(platformName);
                if (providerId === 0) {
                  console.log('🔄 Filtro de plataforma removido - mostrando todo o conteúdo');
                } else {
                  console.log(`✅ Plataforma selecionada: ${platformName} (Provider ID: ${providerId})`);
                }
              }}
            />
          </div>

          {/* Streaming Marquee - Logos animados passando pela tela */}
          <div
            className="absolute z-10 left-0 right-0"
            style={{
              top: activeCategory === 'Início' && !loading && top10BrasilSeries.length > 0
                ? 'calc(100vh + 1175px)'
                : 'calc(100vh + 550px)'
            }}
          >
            <StreamingMarquee />
          </div>

          {/* Content Rows by Category */}
          <div
            className="absolute pb-24 md:pb-20 px-0 md:px-4 lg:px-12 left-0 right-0"
            style={{
              top: activeCategory === 'Início' && !loading && top10BrasilSeries.length > 0
                ? 'calc(100vh + 1625px)'
                : 'calc(100vh + 1000px)'
            }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-center mb-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                  </div>
                  <p className="text-white text-center mb-4 font-['Inter:Medium',sans-serif]">
                    Carregando catálogo...
                  </p>
                  <div className="w-full bg-[#333333] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all duration-300 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <p className="text-white/50 text-center mt-2 text-sm font-['Inter:Regular',sans-serif]">
                    {loadingProgress}%
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-[24px] mt-12 w-full">
                  {Array.from({ length: 84 }).map((_, i) => (
                    <div key={i} className="bg-[#2a2a2a] h-[302px] relative rounded-[10px] w-full animate-pulse" />
                  ))}
                </div>
              </div>
            ) : filteredContent.length > 0 ? (
              <div>
                {/* Header com contador */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-white font-['Inter:Extra_Bold',sans-serif] text-[32px]">
                      {activeCategory === 'Filmes' ? 'Filmes' :
                        activeCategory === 'Séries' ? 'Séries' :
                          'Catálogo Completo'}
                    </h2>
                    <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px] mt-1">
                      {activeCategory === 'Filmes' ? `${movies.length} filmes disponíveis` :
                        activeCategory === 'Séries' ? `${series.length} séries disponíveis` :
                          `${allContent.length} títulos no catálogo`}
                    </p>
                  </div>

                  {/* Platform Filter Badge */}
                  {selectedProvider > 0 && (
                    <div className="flex items-center gap-3 bg-gradient-to-r from-[#E50914] to-[#B20710] px-4 py-2 rounded-full shadow-lg">
                      <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[13px]">
                        🎬 {selectedProviderName}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedProvider(0);
                          setSelectedProviderName('');
                        }}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-all duration-200"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Se estiver em "Início", mostrar as categorias principais com limite */}
                {activeCategory === 'Início' && sortedGenres.length > 0 ? (
                  <div className="space-y-12">
                    {/* Helper para converter tipos se necessário */}
                    {(() => {
                      const toMovie = (item: any): Movie => ({
                        ...item,
                        // Garantir campos obrigatórios para o MovieCard
                        id: item.id,
                        title: item.title || item.name || 'Sem título',
                        name: item.name || item.title || 'Sem título',
                        overview: item.overview || '',
                        poster_path: item.poster_path || item.posterPath || '',
                        backdrop_path: item.backdrop_path || item.backdropPath || '',
                        vote_average: item.vote_average || item.rating || 0,
                        media_type: item.type === 'series' ? 'tv' : 'movie',
                        release_date: item.release_date || item.releaseDate,
                        first_air_date: item.first_air_date || item.releaseDate,
                      });

                      return (
                        <>
                          {/* Destaques do Dia - GRID */}
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-6 pl-4 md:pl-0">Destaques do Dia</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-[24px] px-4 md:px-0">
                              {allContent.slice(0, 12).map(item => (
                                <div
                                  key={item.id}
                                  className="relative w-full"
                                  onMouseEnter={() => setHoveredId(item.id)}
                                  onMouseLeave={() => setHoveredId(null)}
                                  style={{
                                    zIndex: hoveredId === item.id ? 999 : 1,
                                    position: 'relative'
                                  }}
                                >
                                  <div style={{
                                    transform: hoveredId === item.id ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    position: 'relative',
                                    zIndex: hoveredId === item.id ? 999 : 1
                                  }}>
                                    <MovieCard
                                      movie={toMovie(item)}
                                      onClick={() => handleMovieClick(toMovie(item))}
                                      onAddToList={() => handleAddToList(toMovie(item))}
                                      onLike={() => handleLike(toMovie(item))}
                                      onWatchLater={() => handleWatchLater(toMovie(item))}
                                      isInList={myList.includes(item.id)}
                                      isLiked={likedList.includes(item.id)}
                                      isInWatchLater={watchLaterList.includes(item.id)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Em Alta Agora - GRID */}
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-6 pl-4 md:pl-0">Em Alta Agora</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-[24px] px-4 md:px-0">
                              {allContent.slice(18, 30).map(item => (
                                <div
                                  key={item.id}
                                  className="relative w-full"
                                  onMouseEnter={() => setHoveredId(item.id)}
                                  onMouseLeave={() => setHoveredId(null)}
                                  style={{
                                    zIndex: hoveredId === item.id ? 999 : 1,
                                    position: 'relative'
                                  }}
                                >
                                  <div style={{
                                    transform: hoveredId === item.id ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    position: 'relative',
                                    zIndex: hoveredId === item.id ? 999 : 1
                                  }}>
                                    <MovieCard
                                      movie={toMovie(item)}
                                      onClick={() => handleMovieClick(toMovie(item))}
                                      onAddToList={() => handleAddToList(toMovie(item))}
                                      onLike={() => handleLike(toMovie(item))}
                                      onWatchLater={() => handleWatchLater(toMovie(item))}
                                      isInList={myList.includes(item.id)}
                                      isLiked={likedList.includes(item.id)}
                                      isInWatchLater={watchLaterList.includes(item.id)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Adicionados Recentemente - GRID */}
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-6 pl-4 md:pl-0">Adicionados Recentemente</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-[24px] px-4 md:px-0">
                              {allContent.slice(36, 48).map(item => (
                                <div
                                  key={item.id}
                                  className="relative w-full"
                                  onMouseEnter={() => setHoveredId(item.id)}
                                  onMouseLeave={() => setHoveredId(null)}
                                  style={{
                                    zIndex: hoveredId === item.id ? 999 : 1,
                                    position: 'relative'
                                  }}
                                >
                                  <div style={{
                                    transform: hoveredId === item.id ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    position: 'relative',
                                    zIndex: hoveredId === item.id ? 999 : 1
                                  }}>
                                    <MovieCard
                                      movie={toMovie(item)}
                                      onClick={() => handleMovieClick(toMovie(item))}
                                      onAddToList={() => handleAddToList(toMovie(item))}
                                      onLike={() => handleLike(toMovie(item))}
                                      onWatchLater={() => handleWatchLater(toMovie(item))}
                                      isInList={myList.includes(item.id)}
                                      isLiked={likedList.includes(item.id)}
                                      isInWatchLater={watchLaterList.includes(item.id)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Mais Assistidos - GRID */}
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-6 pl-4 md:pl-0">Mais Assistidos</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-[24px] px-4 md:px-0">
                              {allContent.slice(54, 66).map(item => (
                                <div
                                  key={item.id}
                                  className="relative w-full"
                                  onMouseEnter={() => setHoveredId(item.id)}
                                  onMouseLeave={() => setHoveredId(null)}
                                  style={{
                                    zIndex: hoveredId === item.id ? 999 : 1,
                                    position: 'relative'
                                  }}
                                >
                                  <div style={{
                                    transform: hoveredId === item.id ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    position: 'relative',
                                    zIndex: hoveredId === item.id ? 999 : 1
                                  }}>
                                    <MovieCard
                                      movie={toMovie(item)}
                                      onClick={() => handleMovieClick(toMovie(item))}
                                      onAddToList={() => handleAddToList(toMovie(item))}
                                      onLike={() => handleLike(toMovie(item))}
                                      onWatchLater={() => handleWatchLater(toMovie(item))}
                                      isInList={myList.includes(item.id)}
                                      isLiked={likedList.includes(item.id)}
                                      isInWatchLater={watchLaterList.includes(item.id)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Fileiras por gênero - GRID */}
                          {sortedGenres.map(([genre, content]) => (
                            <div key={genre}>
                              <h2 className="text-2xl font-bold text-white mb-6 pl-4 md:pl-0">{genre}</h2>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-[24px] px-4 md:px-0">
                                {content.slice(0, 12).map(item => (
                                  <div
                                    key={item.id}
                                    className="relative w-full"
                                    onMouseEnter={() => setHoveredId(item.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    style={{
                                      zIndex: hoveredId === item.id ? 999 : 1,
                                      position: 'relative'
                                    }}
                                  >
                                    <div style={{
                                      transform: hoveredId === item.id ? 'scale(1.05)' : 'scale(1)',
                                      transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                      position: 'relative',
                                      zIndex: hoveredId === item.id ? 999 : 1
                                    }}>
                                      <MovieCard
                                        movie={toMovie(item)}
                                        onClick={() => handleMovieClick(toMovie(item))}
                                        onAddToList={() => handleAddToList(toMovie(item))}
                                        onLike={() => handleLike(toMovie(item))}
                                        onWatchLater={() => handleWatchLater(toMovie(item))}
                                        isInList={myList.includes(item.id)}
                                        isLiked={likedList.includes(item.id)}
                                        isInWatchLater={watchLaterList.includes(item.id)}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  /* Visualização COMPLETA para Filmes ou Séries - SEM LIMITE */
                  <div>
                    {sortedGenres.length > 0 ? (
                      <div className="space-y-12">
                        {/* Mostrar TODO o conteúdo por categoria com scroll infinito */}
                        {sortedGenres.map(([genre, content]) => (
                          <InfiniteContentRow
                            key={genre}
                            title={`${genre}`}
                            content={content}
                            onMovieClick={handleMovieClick}
                            initialLoadCount={18}
                            loadMoreCount={18}
                            onAddToList={handleAddToList}
                            onLike={handleLike}
                            myList={myList}
                            likedList={likedList}
                          />
                        ))}
                      </div>
                    ) : (
                      /* Fallback: grid completa de todo o conteúdo com lazy loading */
                      <div>
                        <InfiniteContentRow
                          title={activeCategory === 'Filmes' ? 'Todos os Filmes' : 'Todas as Séries'}
                          content={filteredContent}
                          onMovieClick={handleMovieClick}
                          initialLoadCount={24}
                          loadMoreCount={24}
                          onAddToList={handleAddToList}
                          onLike={handleLike}
                          myList={myList}
                          likedList={likedList}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-white/70 text-center text-lg font-['Inter:Medium',sans-serif]">
                  Nenhum conteúdo encontrado
                </p>
                <p className="text-white/50 text-center text-sm mt-2 font-['Inter:Regular',sans-serif]">
                  {activeCategory === 'Filmes' ? 'Não há filmes disponíveis' :
                    activeCategory === 'Séries' ? 'Não há séries disponíveis' :
                      'Verifique se o arquivo filmes.txt está disponível no repositório'}
                </p>
              </div>
            )}
          </div>
        </>
      )}



      {/* Search Overlay */}
      <SearchOverlay
        isOpen={showSearchOverlay}
        onClose={() => setShowSearchOverlay(false)}
        onSearch={handleSearch}
        initialValue={searchQuery}
      />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Bottom Navigation Bar - Mobile Only */}
      {isAuthenticated && currentScreen === 'home' && !showAdminDashboard && (
        <BottomNavBar
          activeTab={bottomNavTab}
          onTabChange={(tab) => {
            setBottomNavTab(tab);
            if (tab === 'home') {
              setActiveCategory('Início');
              setShowKidsPage(false);
              setShowSoccerPage(false);
              setShowUserDashboard(false);
            } else if (tab === 'games') {
              setShowKidsPage(true);
              setShowSoccerPage(false);
              setShowUserDashboard(false);
            } else if (tab === 'trending') {
              setActiveCategory('trending');
              setShowKidsPage(false);
              setShowSoccerPage(false);
              setShowUserDashboard(false);
            } else if (tab === 'profile') {
              setShowMyProfile(true);
              setShowKidsPage(false);
              setShowSoccerPage(false);
              setShowUserDashboard(false);
            }
          }}
        />
      )}

      {/* Image Preload Monitor - Debug only */}
      <ImagePreloadMonitor />
    </div>
  );
}

export default App;
