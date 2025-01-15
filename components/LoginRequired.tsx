import { LoginRequired } from "@/lib/auth-client";

export default function ProtectedClientPage() {
  return (
    <LoginRequired>
      <div>Protected Client Content</div>
    </LoginRequired>
  );
}
