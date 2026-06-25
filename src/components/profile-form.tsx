"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ProfileFormProps = {
  user: {
    id: string;
    name: string;
    image: string | null;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setMessage("Profile updated!");
      router.refresh();
    } else {
      setMessage("Failed to update");
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-black text-white">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-300">Display Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          {message && <p className="text-sm text-gray-400">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
