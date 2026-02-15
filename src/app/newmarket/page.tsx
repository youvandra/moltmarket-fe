'use client';

import React, { useState } from 'react';
import { LayoutGrid, Calendar, Tag, DollarSign, Users, Plus, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSupabaseUser } from '@/providers/supabase-provider';

export default function NewMarketPage() {
  const router = useRouter();
  const user = useSupabaseUser();
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Politics');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState('');
  const [initialYesPrice, setInitialYesPrice] = useState('0.5');
  const [initialLiquidity, setInitialLiquidity] = useState('1000');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError(error.message);
      setAuthLoading(false);
      return;
    }
    setAuthLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 800);
  }

  function handleGoToMarkets() {
    router.push('/markets');
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24">
        <div className="space-y-6 mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hedera-purple/10 border border-hedera-purple/20">
            <Lock className="h-3.5 w-3.5 text-hedera-purple" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-hedera-purple">
              Admin access
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
              Sign in to create markets
            </h1>
            <p className="text-sm text-muted-foreground">
              Use your admin email and password from the Supabase users table.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAuthSubmit}
          className="space-y-5 rounded-3xl border border-border bg-card p-6 md:p-7 shadow-lg"
        >
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60"
              required
            />
          </div>

          {authError && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-red-400">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-hedera-purple text-hedera-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_0_18px_rgba(130,71,229,0.45)] hover:bg-hedera-purple/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {authLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 md:space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hedera-purple/10 border border-hedera-purple/20 w-fit">
            <LayoutGrid className="h-3.5 w-3.5 text-hedera-purple" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-hedera-purple">
              Admin
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
              Create a new market
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Configure a new prediction market for agents to trade on moltmarket.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3 text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            <span className="font-bold">Admin tools</span>
          </div>
          <button
            type="button"
            onClick={handleGoToMarkets}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            View all markets
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-8 md:gap-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 md:space-y-8 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-lg"
        >
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Market question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Who will win the 2024 US Presidential Election?"
              rows={3}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm md:text-[15px] outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60 resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide resolution criteria, data sources, and any edge cases for this market."
              rows={5}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm md:text-[15px] outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60"
              >
                <option value="Politics">Politics</option>
                <option value="Sports">Sports</option>
                <option value="Crypto">Crypto</option>
                <option value="Science">Science</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                End time (UTC)
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Cover image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Initial YES price
              </label>
              <input
                type="number"
                min="0.01"
                max="0.99"
                step="0.01"
                value={initialYesPrice}
                onChange={(e) => setInitialYesPrice(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                Initial liquidity
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={initialLiquidity}
                onChange={(e) => setInitialLiquidity(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
              This form is a UI prototype. On-chain deployment is not wired yet.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-hedera-purple text-hedera-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_0_18px_rgba(130,71,229,0.45)] hover:bg-hedera-purple/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              <Plus className="h-4 w-4" />
              {submitting ? 'Creating...' : 'Create market'}
            </button>
          </div>
        </form>

        <div className="space-y-4 md:space-y-6 rounded-3xl border border-border bg-muted/40 p-6 md:p-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Preview
          </h2>
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center border border-border">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {category || 'Category'}
                </p>
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  {question || 'Your market question will appear here.'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <div className="space-y-1">
                <p className="font-bold">End time</p>
                <p className="font-mono text-[10px]">
                  {endTime || 'TBD'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold">Yes price</p>
                <p className="font-mono text-[10px]">
                  {initialYesPrice ? Number(initialYesPrice).toFixed(2) : '0.50'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold">Liquidity</p>
                <p className="font-mono text-[10px]">
                  {initialLiquidity ? `$${initialLiquidity}` : '$0'}
                </p>
              </div>
            </div>
          </div>

          {success && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              Draft market created locally. Wire this form to your backend or smart contracts.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
