import Link from "next/link";
import { AppHeader } from "@/components/layout/app-chrome";

export const metadata = {
  title: "Privacy Policy — Quest Log",
};

export default function PrivacyPage() {
  return (
    <>
      <AppHeader title="PRIVACY" />
      <main className="app-content-pad-top app-content-pad-bottom max-w-md mx-auto px-4 py-8 space-y-6">
        <h1 className="text-xl font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase">
          Privacy Policy
        </h1>
        <p className="text-sm text-on-surface-variant font-[family-name:var(--font-courier-prime)]">
          Last updated: June 2026
        </p>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-[family-name:var(--font-space-mono)] text-on-surface uppercase">
            What we collect
          </h2>
          <p className="text-sm text-on-surface-variant font-[family-name:var(--font-courier-prime)]">
            When you sign in with Google, we store your name, email, profile photo, and chosen character.
            Club data (names, books, invite codes, reading streaks, and daily area state) is stored in our
            database. Photos and videos you upload for reading check-ins or punishments are used to update
            your club status.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-[family-name:var(--font-space-mono)] text-on-surface uppercase">
            How we use it
          </h2>
          <p className="text-sm text-on-surface-variant font-[family-name:var(--font-courier-prime)]">
            Data is used only to run Quest Log: authentication, club membership, streaks, and accountability
            features shared with your book club members.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-[family-name:var(--font-space-mono)] text-on-surface uppercase">
            Third parties
          </h2>
          <p className="text-sm text-on-surface-variant font-[family-name:var(--font-courier-prime)]">
            We use Google (Firebase Authentication), Vercel (hosting), and Neon (database). These providers
            process data on our behalf under their own privacy policies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold font-[family-name:var(--font-space-mono)] text-on-surface uppercase">
            Contact
          </h2>
          <p className="text-sm text-on-surface-variant font-[family-name:var(--font-courier-prime)]">
            Questions? Open an issue on our GitHub repository or contact the app owner.
          </p>
        </section>

        <Link
          href="/"
          className="inline-block text-primary text-sm font-bold font-[family-name:var(--font-space-mono)] uppercase"
        >
          ← Back
        </Link>
      </main>
    </>
  );
}
