"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Globe,
  Loader2,
  MapPin,
  Upload,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { roleDefinitions, getRoleDefinition, countries, pakistanProvinces, pakistanCities } from "@/lib/roles";
import { completeOnboarding } from "@/app/onboarding/actions";
import type { UserRole } from "@/lib/roles";

const steps = ["Profile Type", "Choose Role", "Details", "Verification"];

const visitPurposes = [
  { value: "tourism", label: "Tourism & Sightseeing" },
  { value: "adventure", label: "Adventure & Trekking" },
  { value: "business", label: "Business" },
  { value: "study", label: "Study / Exchange" },
  { value: "visit_family", label: "Visiting Family" },
  { value: "spiritual", label: "Spiritual / Religious" },
  { value: "food", label: "Food & Culture" },
  { value: "other", label: "Other" },
];

const travelGroups = [
  { value: "solo", label: "Solo Traveler" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Group of Friends" },
  { value: "group_tour", label: "Organized Group Tour" },
];

const accommodationOptions = [
  { value: "hotel", label: "Hotel" },
  { value: "hostel", label: "Hostel / Backpacker" },
  { value: "guest_house", label: "Guest House" },
  { value: "airbnb", label: "Airbnb / Rental" },
  { value: "camping", label: "Camping" },
  { value: "home_stay", label: "Home Stay" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profileType, setProfileType] = useState<"personal" | "business" | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const [showOtherDesignation, setShowOtherDesignation] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState("");

  const [touristType, setTouristType] = useState<"local" | "international" | null>(null);
  const [country, setCountry] = useState("Pakistan");
  const [comingToPakistan, setComingToPakistan] = useState(true);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  // Captured step-3 form values — stored when user clicks "Next" so they
  // survive the conditional unmount of step-3 JSX.
  const [capturedFields, setCapturedFields] = useState<Record<string, string>>({});

  const filteredRoles = roleDefinitions.filter(
    (r) => r.id !== "admin" && (profileType === "business" ? r.isBusiness : !r.isBusiness),
  );
  const roleDef = selectedRole ? getRoleDefinition(selectedRole) : null;
  const isTourist = selectedRole === "tourist";

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (proofFile) {
      const uploadForm = new FormData();
      uploadForm.set("file", proofFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm });
      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "proofImageUrl";
        input.value = url;
        formRef.current?.appendChild(input);
      }
    }

    const formData = new FormData(formRef.current!);
    formData.set("role", selectedRole!);
    // citiesToVisit is already in capturedFields as a hidden input,
    // but override with latest selectedCities just in case.
    formData.set("citiesToVisit", JSON.stringify(selectedCities));

    try {
      await completeOnboarding(formData);
    } catch {
      router.push("/dashboard");
    }
  };

  const handleSelectTourist = (type: "local" | "international") => {
    setTouristType(type);
    if (type === "local") setCountry("Pakistan");
    setStep(3);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-28">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-[1.5rem] bg-[#006600] text-2xl font-black text-white shadow-lg">
            PK
          </div>
          <h1 className="text-3xl font-black text-white">Set Up Your Profile</h1>
          <p className="mt-2 text-gray-400">Tell us about yourself to get started</p>
        </div>

        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black ${
                  i < step
                    ? "bg-[#006600] text-white"
                    : i === step
                      ? "border-2 border-[#006600] text-[#006600]"
                      : "border border-white/10 text-gray-500"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden text-sm font-semibold sm:block ${i === step ? "text-white" : "text-gray-500"}`}>
                {label}
              </span>
              {i < steps.length - 1 && <div className="mx-1 h-px w-8 bg-white/10" />}
            </div>
          ))}
        </div>

        <Card>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 0: Personal or Business */}
              {step === 0 && (
                <div className="space-y-4">
                  <p className="text-center text-sm font-semibold text-gray-400">What type of profile are you setting up?</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => { setProfileType("personal"); setStep(1); }}
                      className="flex flex-col items-center gap-3 rounded-2xl border-2 border-white/10 p-6 text-center transition hover:bg-[#006600]/5 hover:border-[#006600]/50"
                    >
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#006600]/10 text-[#006600]">
                        <User className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-white">Personal</p>
                        <p className="mt-1 text-sm text-gray-400">Tourist, Local User, Food Expert, Tour Guide</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setProfileType("business"); setStep(1); }}
                      className="flex flex-col items-center gap-3 rounded-2xl border-2 border-white/10 p-6 text-center transition hover:bg-[#006600]/5 hover:border-[#006600]/50"
                    >
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#006600]/10 text-[#006600]">
                        <Building2 className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-white">Business</p>
                        <p className="mt-1 text-sm text-gray-400">Hotel, Hostel, Café, Restaurant, SIM Outlet</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 1: Choose Role */}
              {step === 1 && profileType && (
                <div className="space-y-4">
                  <p className="text-center text-sm font-semibold text-gray-400">Select your role on RoamPK</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredRoles.map((r) => {
                      const Icon = r.icon;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => { setSelectedRole(r.id); r.id === "tourist" ? setStep(2) : setStep(3); }}
                          className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition hover:bg-[#006600]/5 ${
                            selectedRole === r.id ? "border-[#006600] bg-[#006600]/10" : "border-white/10"
                          }`}
                        >
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#006600]/10 text-[#006600]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-black text-white">{r.label}</p>
                            <p className="mt-0.5 text-xs text-gray-500">{r.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <Button type="button" variant="ghost" onClick={() => { setProfileType(null); setStep(0); setSelectedRole(null); }}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                </div>
              )}

              {/* STEP 2: Tourist Type Select (only for tourist role) */}
              {step === 2 && isTourist && (
                <div className="space-y-4">
                  <p className="text-center text-sm font-semibold text-gray-400">Are you exploring Pakistan as a local or visiting from abroad?</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleSelectTourist("local")}
                      className="flex flex-col items-center gap-4 rounded-2xl border-2 border-white/10 p-8 text-center transition hover:bg-[#006600]/5 hover:border-[#006600]/50"
                    >
                      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#006600]/10 text-[#006600]">
                        <MapPin className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-white">Local Tourist</p>
                        <p className="mt-2 text-sm text-gray-400">I live in Pakistan and want to explore my own country</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTourist("international")}
                      className="flex flex-col items-center gap-4 rounded-2xl border-2 border-white/10 p-8 text-center transition hover:bg-[#006600]/5 hover:border-[#006600]/50"
                    >
                      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#006600]/10 text-[#006600]">
                        <Globe className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-white">International Tourist</p>
                        <p className="mt-2 text-sm text-gray-400">I&apos;m visiting Pakistan from another country</p>
                      </div>
                    </button>
                  </div>
                  <Button type="button" variant="ghost" onClick={() => { setSelectedRole(null); setStep(1); }}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                </div>
              )}

              {/* STEP 3: Details Form */}
              {step === 3 && selectedRole && roleDef && (
                <div className="space-y-5">
                  {isTourist && touristType === "local" && (
                    <>
                      <p className="text-center text-sm font-semibold text-gray-400">Tell us about your travels within Pakistan</p>
                      <input type="hidden" name="country" value="Pakistan" />
                      <input type="hidden" name="touristType" value="local" />
                      <input type="hidden" name="comingToPakistan" value="yes" />

                      <div className="rounded-2xl border border-[#006600]/20 bg-[#006600]/5 p-4">
                        <p className="text-sm font-semibold text-[#006600]">🇵🇰 Exploring Pakistan as a Local</p>
                        <p className="mt-1 text-xs text-gray-400">Help us understand your travel preferences</p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Your City *</label>
                          <Input name="city" placeholder="e.g., Lahore, Karachi" required />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Province *</label>
                          <Select name="province" required>
                            <option value="">Select province</option>
                            {pakistanProvinces.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Purpose of Travel</label>
                        <Select name="visitPurpose">
                          <option value="">Select purpose</option>
                          {visitPurposes.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </Select>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Travel Date</label>
                          <Input name="arrivalDate" type="date" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Duration (days)</label>
                          <Input name="durationDays" type="number" min="1" placeholder="e.g., 7" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Destinations You Want to Visit in Pakistan</label>
                        <div className="flex flex-wrap gap-2">
                          {pakistanCities.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => toggleCity(city)}
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                selectedCities.includes(city)
                                  ? "bg-[#006600] text-white"
                                  : "border border-white/10 text-gray-400 hover:border-[#006600]/50"
                              }`}
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Travel Group</label>
                          <Select name="travelGroup">
                            <option value="">Select</option>
                            {travelGroups.map((g) => (
                              <option key={g.value} value={g.value}>{g.label}</option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Group Size</label>
                          <Input name="groupSize" type="number" min="1" placeholder="e.g., 2" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Preferred Accommodation</label>
                        <Select name="accommodationPreference">
                          <option value="">Select preference</option>
                          {accommodationOptions.map((a) => (
                            <option key={a.value} value={a.value}>{a.label}</option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Budget (PKR per night)</label>
                        <Input name="accommodationBudget" type="number" min="0" step="500" placeholder="e.g., 3000" />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">About You</label>
                        <textarea
                          name="bio"
                          placeholder="Share your travel style, favorite places in Pakistan, and what kind of experiences you're looking for..."
                          className="w-full rounded-2xl border border-white/10 bg-[#1a201a] p-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#006600] focus:ring-1 focus:ring-[#006600]"
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {isTourist && touristType === "international" && (
                    <>
                      <p className="text-center text-sm font-semibold text-gray-400">Welcome! Tell us about your visit to Pakistan</p>
                      <input type="hidden" name="touristType" value="international" />

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Your Country *</label>
                        <Select
                          name="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required
                        >
                          <option value="">Select your country</option>
                          {countries.filter((c) => c !== "Pakistan").map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </Select>
                      </div>

                      <div className="rounded-2xl border border-[#006600]/20 bg-[#006600]/5 p-4">
                        <p className="text-sm font-semibold text-[#006600]">🌍 Welcome to Pakistan!</p>
                        <p className="mt-1 text-xs text-gray-400">We&apos;re excited to help you plan an amazing trip</p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Are you planning to visit Pakistan?</label>
                        <Select name="comingToPakistan" value={comingToPakistan ? "yes" : "no"} onChange={(e) => setComingToPakistan(e.target.value === "yes")}>
                          <option value="yes">Yes, I&apos;m coming to Pakistan</option>
                          <option value="no">Not yet, just exploring travel options</option>
                        </Select>
                      </div>

                      {comingToPakistan && (
                        <>
                          <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-300">Purpose of Visit</label>
                            <Select name="visitPurpose">
                              <option value="">Select purpose</option>
                              {visitPurposes.map((p) => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                              ))}
                            </Select>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-semibold text-gray-300">Arrival Date</label>
                              <Input name="arrivalDate" type="date" />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-semibold text-gray-300">Duration (days)</label>
                              <Input name="durationDays" type="number" min="1" placeholder="e.g., 14" />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-300">Cities You Plan to Visit in Pakistan</label>
                            <div className="flex flex-wrap gap-2">
                              {pakistanCities.map((city) => (
                                <button
                                  key={city}
                                  type="button"
                                  onClick={() => toggleCity(city)}
                                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                    selectedCities.includes(city)
                                      ? "bg-[#006600] text-white"
                                      : "border border-white/10 text-gray-400 hover:border-[#006600]/50"
                                  }`}
                                >
                                  {city}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Travel Group</label>
                          <Select name="travelGroup">
                            <option value="">Select</option>
                            {travelGroups.map((g) => (
                              <option key={g.value} value={g.value}>{g.label}</option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Group Size</label>
                          <Input name="groupSize" type="number" min="1" placeholder="e.g., 2" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Preferred Accommodation</label>
                        <Select name="accommodationPreference">
                          <option value="">Select preference</option>
                          {accommodationOptions.map((a) => (
                            <option key={a.value} value={a.value}>{a.label}</option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Accommodation Budget (PKR per night)</label>
                        <Input name="accommodationBudget" type="number" min="0" step="500" placeholder="e.g., 5000" />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Your City</label>
                        <Input name="city" placeholder="Your home city" />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">About You</label>
                        <textarea
                          name="bio"
                          placeholder="Tell us about yourself, what excites you about Pakistan, and any special interests..."
                          className="w-full rounded-2xl border border-white/10 bg-[#1a201a] p-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#006600] focus:ring-1 focus:ring-[#006600]"
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {!isTourist && !roleDef.isBusiness && (
                    <>
                      <p className="text-center text-sm font-semibold text-gray-400">Tell us about yourself</p>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">About You</label>
                        <textarea
                          name="about"
                          placeholder="Tell other travelers about yourself, your interests..."
                          className="w-full rounded-2xl border border-white/10 bg-[#1a201a] p-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#006600] focus:ring-1 focus:ring-[#006600]"
                          rows={3}
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">City *</label>
                          <Input name="city" placeholder="e.g., Islamabad, Lahore" required />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Province</label>
                          <Select name="province">
                            <option value="">Select province</option>
                            {pakistanProvinces.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Bio</label>
                        <Input name="bio" placeholder="Adventure seeker, food lover..." />
                      </div>
                    </>
                  )}

                  {roleDef.isBusiness && (
                    <>
                      <p className="text-center text-sm font-semibold text-gray-400">Tell us about your business</p>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Business Name *</label>
                        <Input name="businessName" placeholder="e.g., Pearl Continental Islamabad" required />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Your Designation *</label>
                        <Select name="designation" required onChange={(e) => setShowOtherDesignation(e.target.value === "other")}>
                          <option value="">Select designation</option>
                          {roleDef.designations?.map((d) => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                          ))}
                        </Select>
                        {showOtherDesignation && (
                          <Input name="designationOther" placeholder="Enter your designation" className="mt-2" />
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">About Business</label>
                        <textarea
                          name="about"
                          placeholder="Describe your business..."
                          className="w-full rounded-2xl border border-white/10 bg-[#1a201a] p-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#006600] focus:ring-1 focus:ring-[#006600]"
                          rows={3}
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">City *</label>
                          <Input name="city" placeholder="e.g., Islamabad, Lahore" required />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Province</label>
                          <Select name="province">
                            <option value="">Select province</option>
                            {pakistanProvinces.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Address</label>
                        <Input name="address" placeholder="Full business address" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Contact Phone</label>
                          <Input name="contactPhone" placeholder="+92 300 1234567" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-300">Website</label>
                          <Input name="website" placeholder="https://example.com" />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => { isTourist ? (setTouristType(null), setStep(2)) : setStep(1); }}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        // Capture all current step-3 form values before the
                        // step changes and the inputs are unmounted from DOM.
                        if (formRef.current) {
                          const fd = new FormData(formRef.current);
                          const snapshot: Record<string, string> = {};
                          fd.forEach((value, key) => {
                            snapshot[key] = String(value);
                          });
                          // Also persist cities & touristType from React state
                          snapshot["citiesToVisit"] = JSON.stringify(selectedCities);
                          if (touristType) snapshot["touristType"] = touristType;
                          if (country) snapshot["country"] = country;
                          snapshot["comingToPakistan"] = comingToPakistan ? "yes" : "no";
                          setCapturedFields(snapshot);
                        }
                        setStep(4);
                      }}
                      className="ml-auto"
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Hidden inputs that persist captured step-3 values across step changes.
                  These are always rendered so FormData always contains them at submission. */}
              {Object.entries(capturedFields).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}

              {/* STEP 4: Verification / Review */}
              {step === 4 && selectedRole && roleDef && (
                <div className="space-y-6">
                  <p className="text-center text-sm font-semibold text-gray-400">
                    {roleDef.isBusiness ? "Upload a verification document" : "Almost done! Review and finish"}
                  </p>

                  {roleDef.isBusiness && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-300">Verification Document *</label>
                      <div
                        className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 p-8 text-center hover:border-[#006600]/50"
                        onClick={() => document.getElementById("proof-upload")?.click()}
                      >
                        {proofPreview ? (
                          <img src={proofPreview} alt="Preview" className="h-32 w-32 rounded-xl object-cover" />
                        ) : (
                          <Upload className="h-10 w-10 text-gray-500" />
                        )}
                        <div>
                          <p className="font-semibold text-white">{proofFile ? proofFile.name : "Click to upload"}</p>
                          <p className="mt-1 text-xs text-gray-500">PNG, JPG or PDF (max 5MB)</p>
                        </div>
                      </div>
                      <input id="proof-upload" type="file" accept="image/*,.pdf" className="hidden" onChange={handleProofUpload} />
                      {proofPreview && (
                        <button type="button" onClick={() => { setProofFile(null); setProofPreview(""); }} className="mt-2 flex items-center gap-1 text-sm text-red-400">
                          <X className="h-4 w-4" /> Remove
                        </button>
                      )}
                      <div className="mt-4">
                        <label className="mb-1 block text-sm font-semibold text-gray-300">Document Type</label>
                        <Select name="proofType" required>
                          <option value="">Select type</option>
                          <option value="cnic">CNIC (National ID)</option>
                          <option value="business_license">Business License</option>
                          <option value="passport">Passport</option>
                          <option value="other">Other</option>
                        </Select>
                      </div>
                    </div>
                  )}

                  {isTourist && (
                    <div className="rounded-2xl border border-white/10 bg-[#1a201a] p-4">
                      <p className="text-sm font-bold text-gray-400">Travel Profile Summary</p>
                      <div className="mt-3 space-y-2 text-sm">
                        <p><span className="text-gray-500">Type:</span> <span className="font-semibold text-white">
                          {touristType === "local" ? "🇵🇰 Local Tourist" : "🌍 International Tourist"}
                        </span></p>
                        <p><span className="text-gray-500">Country:</span> <span className="font-semibold text-white">{country}</span></p>
                        {selectedCities.length > 0 && (
                          <p><span className="text-gray-500">Visiting:</span> <span className="font-semibold text-white">{selectedCities.join(", ")}</span></p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-white/10 bg-[#1a201a] p-4">
                    <p className="text-sm font-bold text-gray-400">Summary</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <p><span className="text-gray-500">Role:</span> <span className="font-semibold text-white">{roleDef.label}</span></p>
                      {roleDef.isBusiness && <p><span className="text-gray-500">Status:</span> <span className="font-semibold text-[#006600]">Waiting for verification</span></p>}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep(3)}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" disabled={loading} className="ml-auto">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {loading ? "Setting up..." : "Complete Setup"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
