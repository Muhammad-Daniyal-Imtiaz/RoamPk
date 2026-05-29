import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7fbf7] px-4 py-24">
      <SignUp />
    </main>
  );
}
