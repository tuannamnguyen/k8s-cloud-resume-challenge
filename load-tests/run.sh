# kubectl port-forward svc/my-ecom-app-service 9000:9000
BASE_URL=http://localhost:9000
k6 run load-tests/hpa-cpu-test.js
