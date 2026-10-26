This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Layanan Surat (staff only)

The letter service at `/layanan-surat` is for village staff. It is not linked from the public site and is marked `noindex`, but hiding the URL is not security. Resident data is protected on the server:

- **Staff allowlist.** Set `STAFF_EMAILS` to a comma-separated list of staff emails (for example, `STAFF_EMAILS=sekdes@example.id,kades@example.id`). The API routes `/api/search-person`, `/api/person/[nik]`, `/api/upload` and `/api/sheets` accept only a valid Firebase ID token whose email is on this list. If the list is empty, all requests are refused.
- **No self sign-up.** Disable email/password sign-up in the Firebase console; create staff accounts manually. In the console, go to **Authentication > Settings > User actions** and clear **Enable create (sign-up)**. Then add each account under **Authentication > Users**.
- **Firestore rules.** `firestore.rules` lets staff read and increment only the letter-number counters (`counters/{letterType}`) and denies everything else to the client SDK. Before you deploy it, replace the placeholder email in `isStaff()` with the same emails as `STAFF_EMAILS`. To deploy, paste the file into **Firestore Database > Rules** in the Firebase console and publish it. Alternatively, run `firebase deploy --only firestore:rules` with a `firebase.json` that points `"firestore": { "rules": "firestore.rules" }`.

The section's base path is defined once in `src/app/layanan-surat/route-base.ts`. To move the section, rename the folder and this constant together.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
