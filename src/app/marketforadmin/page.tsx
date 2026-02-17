'use client';

import React, { useEffect, useState } from 'react';
import { LayoutGrid, Calendar, Tag, DollarSign, Users, Plus, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSupabaseUser } from '@/providers/supabase-provider';

type AdminMarketRow = {
  id: string;
  question: string;
  category: string;
  end_time: string;
  initial_liquidity: number | null;
  status: string;
  outcome: string | null;
  option_a: string;
  option_b: string;
};

export default function MarketAdminPage() {
  const router = useRouter();
  const user = useSupabaseUser();
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Politics');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState('');
  const [optionA, setOptionA] = useState('Yes');
  const [optionB, setOptionB] = useState('No');
  const [initialYesPrice, setInitialYesPrice] = useState('0.5');
  const [initialLiquidity, setInitialLiquidity] = useState('1000');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [markets, setMarkets] = useState<AdminMarketRow[]>([]);
  const [marketsLoading, setMarketsLoading] = useState(false);
  const [marketsError, setMarketsError] = useState('');
  const [outcomeDrafts, setOutcomeDrafts] = useState<Record<string, string>>({});
  const [savingOutcomeId, setSavingOutcomeId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  async function loadMarkets() {
    setMarketsLoading(true);
    setMarketsError('');
    const { data, error } = await supabase
      .from('markets')
      .select('id, question, category, end_time, initial_liquidity, status, outcome, option_a, option_b')
      .order('created_at', { ascending: false });

    if (error) {
      setMarketsError(error.message);
      setMarkets([]);
      setMarketsLoading(false);
      return;
    }

    setMarkets((data ?? []) as AdminMarketRow[]);
    setMarketsLoading(false);
  }

  useEffect(() => {
    if (user) {
      loadMarkets();
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitError('');
    setSuccess(false);
    setSubmitting(true);
    const yesPriceNumber = parseFloat(initialYesPrice);
    const liquidityNumber = parseFloat(initialLiquidity);

    const { error } = await supabase.from('markets').insert({
      question,
      description,
      category,
      end_time: new Date(endTime).toISOString(),
      image_url: image || null,
      initial_yes_price: yesPriceNumber,
      initial_liquidity: isNaN(liquidityNumber) ? 0 : liquidityNumber,
      option_a: optionA && optionA.trim() !== '' ? optionA.trim() : 'Option A',
      option_b: optionB && optionB.trim() !== '' ? optionB.trim() : 'Option B',
      creator_id: user.id,
    });

    if (error) {
      setSubmitError(error.message);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSuccess(true);
    setQuestion('');
    setDescription('');
    setCategory('Politics');
    setEndTime('');
    setImage('');
    setOptionA('Yes');
    setOptionB('No');
    setInitialYesPrice('0.5');
    setInitialLiquidity('1000');
    loadMarkets();
  }

  async function handleSaveOutcome(id: string) {
    if (!user) return;
    const current = markets.find((m) => m.id === id);
    if (!current) return;
    if (current.outcome && current.outcome.trim() !== '') {
      return;
    }

    const draft = outcomeDrafts[id] ?? '';
    const trimmed = draft.trim();
    if (trimmed === '') {
      return;
    }

    setSavingOutcomeId(id);
    try {
      const functionsBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!functionsBaseUrl) {
        setSavingOutcomeId(null);
        return;
      }

      const res = await fetch(`${functionsBaseUrl}/functions/v1/resolve_market`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          market_id: id,
          outcome: trimmed,
        }),
      });

      if (!res.ok) {
        setSavingOutcomeId(null);
        return;
      }

      setMarkets((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                outcome: trimmed,
              }
            : m,
        ),
      );
    } catch {
      setSavingOutcomeId(null);
      return;
    }

    setSavingOutcomeId(null);
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
              Sign in to manage markets
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
              Markets admin
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              View all markets, update outcomes, and create new markets for agents.
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
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-hedera-purple text-hedera-white px-6 py-2 text-[11px] font-bold uppercase tracking-[0.22em] shadow-[0_0_18px_rgba(130,71,229,0.5)] hover:bg-hedera-purple/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Market
          </button>
          <button
            type="button"
            onClick={handleGoToMarkets}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            View public markets
          </button>
        </div>
      </header>

      <section className="space-y-6 md:space-y-8">
        <div className="rounded-3xl border border-border bg-card p-5 md:p-7 shadow-lg space-y-4 md:space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              All markets
            </h2>
          </div>
          {marketsError && (
            <div className="text-[11px] text-red-400 font-bold uppercase tracking-[0.2em]">
              {marketsError}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[11px] md:text-[12px]">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-[0.18em]">
                  <th className="py-2 pr-4 font-bold">Question</th>
                  <th className="py-2 px-4 font-bold">Category</th>
                  <th className="py-2 px-4 font-bold">Status</th>
                  <th className="py-2 px-4 font-bold">End time</th>
                  <th className="py-2 px-4 font-bold text-right">Total volume</th>
                  <th className="py-2 pl-4 font-bold">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {marketsLoading && (
                  <tr>
                    <td colSpan={6} className="py-4 text-[11px] text-muted-foreground">
                      Loading markets...
                    </td>
                  </tr>
                )}
                {!marketsLoading && markets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 text-[11px] text-muted-foreground">
                      No markets found.
                    </td>
                  </tr>
                )}
                {!marketsLoading &&
                  markets.map((m) => {
                    const isResolved = !!(m.outcome && m.outcome.trim() !== '');

                    return (
                      <tr key={m.id} className="border-t border-border/40 align-top">
                        <td className="py-3 pr-4">
                          <div className="text-[11px] md:text-[12px] text-foreground line-clamp-2">
                            {m.question}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {m.category}
                        </td>
                        <td className="py-3 px-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {m.status}
                        </td>
                        <td className="py-3 px-4 text-[10px] text-muted-foreground">
                          {m.end_time}
                        </td>
                        <td className="py-3 px-4 text-right text-[10px] font-medium text-foreground">
                          {m.initial_liquidity != null ? m.initial_liquidity.toLocaleString() : '0'} tBNB
                        </td>
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={outcomeDrafts[m.id] ?? (m.outcome ?? '')}
                              onChange={(e) =>
                                setOutcomeDrafts((prev) => ({
                                  ...prev,
                                  [m.id]: e.target.value,
                                }))
                              }
                              disabled={isResolved || savingOutcomeId === m.id}
                              className="w-32 md:w-40 rounded-2xl border border-border bg-background px-3 py-1.5 text-[10px] outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              <option value="">-</option>
                              {m.option_a && <option value={m.option_a}>{m.option_a}</option>}
                              {m.option_b && <option value={m.option_b}>{m.option_b}</option>}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleSaveOutcome(m.id)}
                              disabled={isResolved || savingOutcomeId === m.id}
                              className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] disabled:opacity-60 disabled:cursor-not-allowed ${
                                isResolved
                                  ? 'bg-muted text-muted-foreground'
                                  : 'bg-hedera-purple text-hedera-white'
                              }`}
                            >
                              {isResolved ? 'Solved' : savingOutcomeId === m.id ? 'Saving' : 'Save'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl border border-border bg-background shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-border/60">
              <div className="space-y-1">
                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Create market
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Configure a new prediction market for agents to trade.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto">
              <section className="max-w-3xl mx-auto">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 md:space-y-8"
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

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Options
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        type="text"
                        value={optionA}
                        onChange={(e) => setOptionA(e.target.value)}
                        placeholder="Option A (e.g. Michael Jordan)"
                        className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60"
                      />
                      <input
                        type="text"
                        value={optionB}
                        onChange={(e) => setOptionB(e.target.value)}
                        placeholder="Option B (e.g. Trump)"
                        className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hedera-purple/40 focus:border-hedera-purple/60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                        Initial {optionA || 'Option A'} price
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
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        Initial {optionB || 'Option B'} price
                      </label>
                      <input
                        type="text"
                        value={
                          initialYesPrice
                            ? (1 - parseFloat(initialYesPrice) || 0).toFixed(2)
                            : '0.50'
                        }
                        readOnly
                        className="w-full rounded-2xl border border-border bg-muted px-4 py-2.5 text-sm outline-none"
                      />
                    </div>
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

                  {submitError && (
                    <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-red-400">
                      {submitError}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
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
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
