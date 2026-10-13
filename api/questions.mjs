// api/questions.mjs - Vercel Node function: /api/questions (agent/http.mjs). The brand is this deployment's env BRAND. Nothing is stored or logged.
import { handle } from '../agent/http.mjs';

export default function handler(req, res) {
  return handle(req, res, 'questions');
}
