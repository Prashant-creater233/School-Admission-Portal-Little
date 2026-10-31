# Little Hearts Pre Primary School - Admission Portal
Next.js 15 + Auth.js v5 + MongoDB (Mongoose) + Framer Motion.

## Setup
1. `npm install`
2. `.env.local` kholo: `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` apne hisab se badlo (AUTH_SECRET already generated hai).
3. `npm run dev` -> http://localhost:3000
4. Admin: http://localhost:3000/admin/login

## API
- `POST /api/applications` public form (validation + duplicate check)
- `GET /api/applications` admin, aggregation $facet (search, filter, pagination)
- `GET /api/applications/stats` admin, aggregation stats
- `PATCH|DELETE /api/applications/[id]` admin only
