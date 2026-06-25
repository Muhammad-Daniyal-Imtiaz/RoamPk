"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { pakistanProvinces } from "@/lib/roles";

type ProfileFormProps = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    bio: string | null;
    city: string | null;
    province: string | null;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [city, setCity] = useState(user.city ?? "");
  const [province, setProvince] = useState(user.province ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrl = user.image;

      if (imageFile) {
        const uploadForm = new FormData();
        uploadForm.set("file", imageFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        }
      } else if (imagePreview === null && imageFile === null) {
        imageUrl = null;
      }

      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: imageUrl, bio, city, province }),
      });

      if (res.ok) {
        setMessage("Profile updated!");
        router.refresh();
      } else {
        setMessage("Failed to update");
      }
    } catch {
      setMessage("Something went wrong");
    }
    setLoading(false);
  };

  const currentImage = imagePreview ?? user.image;

  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-black text-white">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              {currentImage ? (
                <div className="relative h-20 w-20">
                  <img src={currentImage} alt="" className="h-20 w-20 rounded-full object-cover" />
                  {imagePreview && (
                    <button type="button" onClick={clearImage} className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-white shadow">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-full bg-[#006600]/10 text-3xl font-black text-[#006600]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-[#006600] text-white shadow transition hover:bg-[#008800]">
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </div>
            <div>
              <p className="font-bold text-white">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#006600] hover:underline">
                <Upload className="h-3 w-3" /> Change photo
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-300">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-300">Email</label>
            <Input value={user.email} disabled className="opacity-60" />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-300">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-[#1a201a] px-5 py-3 text-sm text-white outline-none ring-[#006600]/20 placeholder:text-gray-500 focus:border-[#006600] focus:ring-4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-300">City</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Lahore" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-300">Province</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="h-12 w-full rounded-full border border-white/10 bg-[#1a201a] px-5 text-sm text-white outline-none ring-[#006600]/20 focus:border-[#006600] focus:ring-4"
              >
                <option value="">Select province</option>
                {pakistanProvinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {message && (
            <p className={`text-sm font-semibold ${message === "Profile updated!" ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
