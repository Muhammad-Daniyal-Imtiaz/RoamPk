import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7fbf7] px-4 py-24">
      <SignIn />
    </main>
  );
}
