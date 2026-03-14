# 🌐 Frontend Documentation

> **Phygital-Trace** | Web Portal for Truth Verification

---

## 🚀 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks (useState, useEffect)
- **API Fetching**: Native `fetch` with environment variables
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

## 📁 Structure

- `src/app`: Page routes and layouts
  - `/dashboard`: Journalist dashboard (certificate list)
  - `/verify/[hash]`: Public verification page for specific image hashes
  - `/profiles/[handle]`: Journalist profile pages
- `src/components`: Reusable UI components
  - `VerificationPortal.tsx`: Core logic for hash-based verification
- `public`: Static assets (images, fonts)

## 🔑 Environment Variables

Create a `.env.local` file in the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🛠️ Developmental Tasks

1. **Authentication**: Implement JWT storage and session handling.
2. **On-chain Verification**: Integrate Ethers.js for direct blockchain lookups.
3. **Responsive Design**: Polish mobile layouts for on-the-go verification.

---

*Last Updated: 2026-03-14*
