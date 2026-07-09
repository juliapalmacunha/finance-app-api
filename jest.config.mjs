/** @type {import('jest').Config} */
const config = {
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  collectCoverageFrom: [
    "src/**/*.js",
  ],

  //o rootdir pega a raiz do projeto e depois entra no arquivo criado
  globalSetup: "<rootDir>/jest.global-setup.js",
  //ele limpa o banco de dados antes de cada teste            
  setupFilesAfterEnv: ["<rootDir>/jest.setup-after-env.js"],

  // 1. Evita o erro de permissão da pasta do Docker
 watchPathIgnorePatterns: [
    '<rootDir>/.postgres-data',
    '<rootDir>/prisma',
    '<rootDir>/node_modules'
  ],
  modulePathIgnorePatterns: ['<rootDir>/.postgres-data'],

  // 2. Permite que o Babel converta o Faker moderno para o Jest entender
  transformIgnorePatterns: [
    'node_modules/(?!@faker-js/)',
  ],
};

export default config; 