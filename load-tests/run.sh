# kubectl port-forward svc/my-ecom-app-service 9000:9000
BASE_URL=http://127.0.0.1:41793/ k6 run load-tests/hpa-cpu-test.js
