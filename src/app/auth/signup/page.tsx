"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(result.error || "Kuch masla aa gaya, dobara koshish karein");
      return;
    }

    router.push("/auth/login?registered=1");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/">
            <span className="text-2xl sm:text-3xl font-bold text-rose-600">CLOTH</span>
            <span className="text-2xl sm:text-3xl font-light text-gray-700"> HAUS</span>
          </Link>
          <p className="text-gray-500 mt-2 text-sm">Create your account and start shopping</p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <input name="firstName" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors" placeholder="Ahmad" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input name="lastName" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors" placeholder="Ali" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input name="email" type="email" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors" placeholder="ahmad@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input name="phone" type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors" placeholder="+92 300 1234567" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-rose-400 transition-colors"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" required id="terms" className="accent-rose-600" />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I agree to the{" "}
                <Link href="#" className="text-rose-600 hover:underline">Terms & Conditions</Link>
                {" "}and{" "}
                <Link href="#" className="text-rose-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} /> Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-rose-600 hover:text-rose-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
