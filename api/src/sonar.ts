const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: `http://${process.env.SONAR_HOST}:${process.env.SONAR_PORT}`,
    options: {
      'sonar.sources': '.',
      'sonar.inclusions': 'src/**',
    },
  },
  () => {},
);
