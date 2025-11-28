# Layerwyse

Layerwyse is a pricing and business management toolkit for 3D-printing creators.  
It helps makers calculate accurate costs, track projects, understand profitability, and eventually send invoices — turning a 3D-printing hobby into a sustainable business.

This project is built on top of the **Next.js SaaS Starter**, providing:
- Authentication  
- Protected dashboard  
- Postgres + Drizzle ORM  
- User/team management  
- Middleware-protected routes  
- A scalable structure for SaaS apps  

Layerwyse customizes this foundation into a full toolset for 3D-printing businesses.

---

## Features

### Layerwyse Features (In Progress & Planned)
- 3D print cost calculator  
  - Materials (resin/filament)  
  - Machine usage & wear  
  - Labor (sanding, painting, post-processing)  
  - Electricity cost  
  - Failure rate & retries  
- Job & project tracking  
  - Status, effort (hours), worker cost, added value  
  - Profit estimation  
  - Notes & failure logs  
- Partner/freelancer payout logic  
- Bulk order pricing models  
- Calculation history  
- (Future) Itemized invoicing  
- (Future) Payment tracking (paid/partial/unpaid)  
- (Future) Instalment-based billing  
- (Future) STL/3MF volume extraction  

### Features Inherited from SaaS Starter
- Email/password authentication  
- JWT cookies stored securely  
- Dashboard with CRUD for users/teams  
- Basic RBAC: Owner / Member roles  
- Global middleware for protected routes  
- Zod validation middleware for Server Actions  
- Activity logging system  
- Prebuilt dashboard layout and components  

---

## Tech Stack

- **Framework:** Next.js  
- **Database:** Postgres  
- **ORM:** Drizzle  
- **UI Library:** shadcn/ui  
- **Styling:** Tailwind CSS  
- **Runtime:** Bun  

---

## Getting Started

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd <project-folder>
bun install
```

---

## Running Locally

### 1. Create your `.env.local` file

```bash
bun db:setup
```

This generates your environment variables (including database URL).

### 2. Run database migrations and seed the database

```bash
bun db:migrate
bun db:seed
```

This creates a default development user:

- **Email:** test@test.com  
- **Password:** admin123  

You may also create users via `/sign-up`.

### 3. Start the dev server

```bash
bun dev
```

Then open:

http://localhost:3000

---

## Going to Production

### Deploy on Vercel

1. Push your code to GitHub  
2. Import the repo in Vercel  
3. Deploy using the guided setup  

### Required Environment Variables

```
BASE_URL=https://your-domain.com
POSTGRES_URL=<your-production-database-url>
AUTH_SECRET=<32-byte-random-string>
```


---

## Project Status

Layerwyse is a private, in-development project.  
All code, designs, and assets are proprietary.
