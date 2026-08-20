# ERP Enterprise App

Full-stack ERP scaffold with:
- Frontend: Next.js (React + App Router)
- Backend: Node.js + Express
- Database: PostgreSQL + Prisma

## Included Modules

POS, Procurement, Inventory, Retail, Production, Wholesale, Forecasting, Finance, Reports, Admin Utilities, Notifications, and Service.

Each module has:
- Navigation entry in dashboard sidebar
- Data entry form
- Record listing section
- Backend CRUD skeleton endpoint

## Project Structure

- `frontend/` - Next.js app (landing page, login page, dashboard shell, module pages/forms)
- `backend/` - Express API, auth, module routes, Prisma schema, seed script

## Run Locally

1. Set up PostgreSQL and create database `erp_app`.
2. Backend setup:
   - Copy `backend/.env.example` to `backend/.env` and adjust values.
   - Install deps: `npm install` (already done if you scaffolded here).
   - Generate Prisma client: `npm run prisma:generate`
   - Run migrations: `npm run prisma:migrate`
   - Seed admin user: `npm run prisma:seed`
   - Start backend: `npm run dev`
3. Frontend setup:
   - Copy `frontend/.env.example` to `frontend/.env.local`
   - Install deps: `npm install`
   - Start frontend: `npm run dev`
4. Open `http://localhost:3000` and login with ID `sample` / password `sample`.

## API Endpoints

- `POST /api/auth/login`
- `GET /api/modules/:module`
- `POST /api/modules/:module`
- `PUT /api/modules/:module/:id`
- `DELETE /api/modules/:module/:id`

## Notes

- Current auth model is single-admin MVP.
- Module records are scaffolded in a shared `ModuleEntry` model for rapid iteration.
- Extend Prisma models per module as business rules are finalized.
