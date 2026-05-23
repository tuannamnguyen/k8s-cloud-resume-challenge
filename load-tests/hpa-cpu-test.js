import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';

const BASE_URL = (__ENV.BASE_URL || 'http://localhost:9000').replace(/\/$/, '');
const TARGET_PATH = __ENV.TARGET_PATH || '/';

export const options = {
  scenarios: {
    hpa_cpu_ramp: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 25 },
        { duration: '3m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 180 },
        { duration: '5m', target: 180 },
        { duration: '3m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const url = `${BASE_URL}${TARGET_PATH}`;
  const response = http.get(url, {
    headers: {
      'Cache-Control': 'no-cache',
      'X-K6-Iteration': `${exec.scenario.iterationInTest}`,
    },
    tags: {
      endpoint: TARGET_PATH,
    },
  });

  check(response, {
    'status is 2xx or 3xx': (r) => r.status >= 200 && r.status < 400,
    'body is not empty': (r) => r.body && r.body.length > 0,
  });

  sleep(0.1);
}

export function handleSummary(data) {
  return {
    stdout: [
      '\nHPA load test summary',
      `Target: ${BASE_URL}${TARGET_PATH}`,
      `Requests: ${data.metrics.http_reqs?.values?.count || 0}`,
      `Failed request rate: ${data.metrics.http_req_failed?.values?.rate || 0}`,
      `p95 latency ms: ${data.metrics.http_req_duration?.values?.['p(95)'] || 0}`,
      '',
      'Watch HPA while this runs:',
      'kubectl get hpa ecom-app-hpa -w',
      'kubectl get pods -l app=my-ecom-app -w',
      '',
    ].join('\n'),
  };
}
