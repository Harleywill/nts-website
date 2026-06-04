"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

interface SiteSettings {
  id: number;
  companyName: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  postalCode?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (settings) {
      setSettings({ ...settings, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      const updated = await res.json();
      setSettings(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-adm-textMut font-mono">LOADING SETTINGS...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-nts-danger font-mono">FAILED TO LOAD SETTINGS</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-mono font-bold text-adm-textPri uppercase">Site Settings</h1>
        <p className="text-xs text-adm-textMut mt-1">Manage your company information and contact details</p>
      </div>

      {error && (
        <div className="p-4 bg-nts-danger/20 border border-nts-danger/40 rounded-lg text-nts-danger font-mono text-sm">
          ERROR: {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-nts-green/20 border border-nts-green/40 rounded-lg text-nts-green font-mono text-sm">
          ✓ Settings saved successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-adm-textMut uppercase mb-2">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-adm-textMut uppercase mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-adm-textMut uppercase mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-adm-textMut uppercase mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={settings.address || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
              placeholder="Street address"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-adm-textMut uppercase mb-2">City</label>
            <input
              type="text"
              name="city"
              value={settings.city || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-adm-textMut uppercase mb-2">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={settings.postalCode || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
              placeholder="Postal code"
            />
          </div>
        </div>

        <div className="border-t border-adm-border pt-6">
          <h2 className="text-sm font-mono font-semibold text-adm-textPri uppercase mb-4">Social Media Links</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-adm-textMut uppercase mb-2">Facebook URL</label>
              <input
                type="url"
                name="facebookUrl"
                value={settings.facebookUrl || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-adm-textMut uppercase mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedinUrl"
                value={settings.linkedinUrl || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
                placeholder="https://linkedin.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-adm-textMut uppercase mb-2">Twitter/X URL</label>
              <input
                type="url"
                name="twitterUrl"
                value={settings.twitterUrl || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-nts-green text-white font-mono font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
