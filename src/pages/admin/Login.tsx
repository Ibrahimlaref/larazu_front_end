import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "@/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await adminLogin(email, password);
      toast.success("Logged in");
      navigate("/admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone/30">
      <div className="w-full max-w-sm p-8 bg-chalk border border-stone shadow-sm">
        <h1 className="text-2xl font-serif font-semibold text-ink mb-2">LAZULI Admin</h1>
        <p className="text-sm text-mist mb-6">Sign in to the admin panel</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="text-xs text-mist mt-4">
          Use admin@lazuli.dz / admin123 (after seed_lazuli)
        </p>
      </div>
    </div>
  );
}
