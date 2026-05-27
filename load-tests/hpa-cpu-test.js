import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';

const BASE_URL = (__ENV.BASE_URL);
const TARGET_PATH = __ENV.TARGET_PATH || '/cpu';

function targetUrl() {
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const path = TARGET_PATH.startsWith('/') ? TARGET_PATH : `/${TARGET_PATH}`;

  return `${baseUrl}${path}`;
}

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
    http_req_duration: ['p(95)<5000'],
  },
};

export default function () {
  const url = targetUrl();
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
    'cpu endpoint responded': (r) => r.json('task') === 'cpu-intensive',
  });

  sleep(0.1);
}

export function handleSummary(data) {
  return {
    stdout: [
      '\nHPA load test summary',
      `Target: ${targetUrl()}`,
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
