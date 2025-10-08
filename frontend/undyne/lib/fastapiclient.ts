// lib/fastapiClient.ts
import axios from 'axios'

// Determine the base URL based on environment
let baseURL = process.env.FASTAPI_URL || 'http://localhost:8000';

// In Docker environment, use the service name
if (process.env.DOCKER_ENV === 'true') {
  baseURL = 'http://backend:80';
}

const fastapi = axios.create({
  baseURL,
  timeout: 5000,
})

export default fastapi
