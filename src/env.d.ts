interface ImportMetaEnv {
  VITE_COMPASS_URL: string;
  VITE_EDUCATION_COURSES_URL: string;
  VITE_GAME_GUIDE_URL: string;
  VITE_HOME_URL: string;
  VITE_WOLFOX_CLUB_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
