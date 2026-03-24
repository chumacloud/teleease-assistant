import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelecom } from '@/context/TelecomContext';
import {
  ArrowLeft, RefreshCw, Wifi, Phone, Calendar, Clock, AlertTriangle,
  Plus, CheckCircle2, ShoppingCart, X, Loader2, Bell, ChevronDown,
  TrendingUp, Zap, Shield, Send, Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const theme = {
  mtn: {
    gradient: 'from-[hsl(45,100%,52%)] to-[hsl(42,100%,40%)]',
    bg: 'hsl(45,100%,50%)',
    bgLight: 'hsl(44,60%,97%)',
    text: 'hsl(45,100%,6%)',
    accent: 'hsl(45,80%,38%)',
    cardGlow: '0 8px 32px hsl(45 100% 50% / 0.12)',
    subtleBg: 'hsl(45,100%,50%,0.08)',
    subtleBorder: 'hsl(45,100%,50%,0.15)',
    name: 'MTN',
  },
  airtel: {
    gradient: 'from-[hsl(0,80%,55%)] to-[hsl(350,75%,40%)]',
    bg: 'hsl(0,80%,52%)',
    bgLight: 'hsl(0,40%,97%)',
    text: 'hsl(0,0%,100%)',
    accent: 'hsl(0,70%,40%)',
    cardGlow: '0 8px 32px hsl(0 80% 52% / 0.12)',
    subtleBg: 'hsl(0,80%,52%,0.06)',
    subtleBorder: 'hsl(0,80%,52%,0.12)',
    name: 'Airtel',
  },
  glo: {
    gradient: 'from-[hsl(130,70%,45%)] to-[hsl(145,65%,32%)]',
    bg: 'hsl(130,70%,42%)',
    bgLight: 'hsl(130,40%,97%)',
    text: 'hsl(0,0%,100%)',
    accent: 'hsl(130,60%,32%)',
    cardGlow: '0 8px 32px hsl(130 70% 42% / 0.12)',
    subtleBg: 'hsl(130,70%,42%,0.07)',
    subtleBorder: 'hsl(130,70%,42%,0.14)',
    name: 'Glo',
  },
};

const airtimeAmounts = [100, 200, 500, 1000, 2000, 5000];
const dataPlans = [
  { label: '500MB Daily', mb: 512, price: 200, duration: '24hrs' },
  { label: '1GB Weekly', mb: 1024, price: 500, duration: '7 days' },
  { label: '2GB Weekly', mb: 2048, price: 800, duration: '7 days' },
  { label: '5GB Monthly', mb: 5120, price: 2000, duration: '30 days' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    activeNetwork, numbers, isLoading, error,
    getActiveNumber, getSubscription, switchNumber, addNumber,
    refresh, buyAirtime, buyData, shareAirtime, shareData,
    notifications, dismissNotification,
  } = useTelecom();

  const [buyModal, setBuyModal] = useState<'airtime' | 'data' | null>(null);
  const [shareModal, setShareModal] = useState<'airtime' | 'data' | null>(null);
  const [shareRecipient, setShareRecipient] = useState('');
  const [shareAmount, setShareAmount] = useState('');

  const [buyModal, setBuyModal] = useState<'airtime' | 'data' | null>(null);
  const [newNum, setNewNum] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showNumbers, setShowNumbers] = useState(false);

  const net = activeNetwork ?? 'mtn';
  const t = theme[net];
  const activeNum = getActiveNumber();
  const sub = getSubscription();
  const networkNumbers = numbers.filter((n) => n.network === net);
  const activeNotifs = notifications.filter((n) => !n.dismissed);

  useEffect(() => {
    if (!activeNetwork) navigate('/home', { replace: true });
  }, [activeNetwork, navigate]);

  if (!sub) return null;

  const daysLeft = Math.max(0, Math.ceil((sub.expiryDate.getTime() - Date.now()) / 86400000));
  const dataPredictionDays = sub.dataBalanceMB > 0 ? Math.max(1, Math.round(sub.dataBalanceMB / 350)) : 0;
  const timeSinceUpdate = Math.round((Date.now() - sub.lastUpdated.getTime()) / 60000);
  const dataPercent = Math.min(100, (sub.dataBalanceMB / 5120) * 100);

  const handleAddNumber = () => {
    if (!newNum.trim()) return;
    if (!otpStep) { setOtpStep(true); return; }
    addNumber(newNum, net);
    setNewNum('');
    setOtpStep(false);
    setAddNumModal(false);
    flash('Number added successfully!');
  };

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleBuyAirtime = async (amount: number) => {
    await buyAirtime(amount);
    setBuyModal(null);
    flash(`₦${amount} airtime purchased!`);
  };

  const handleBuyData = async (plan: typeof dataPlans[0]) => {
    await buyData(plan.mb, plan.label);
    setBuyModal(null);
    flash(`${plan.label} purchased!`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: t.bgLight }}>
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full opacity-30 blur-3xl" style={{ background: `radial-gradient(circle, ${t.bg} 0%, transparent 70%)` }} />
        <div className="absolute bottom-20 -left-20 h-48 w-48 rounded-full opacity-20 blur-3xl" style={{ background: `radial-gradient(circle, ${t.bg} 0%, transparent 70%)` }} />
      </div>
      {/* Header */}
      <div
        className={`sticky top-0 z-20 bg-gradient-to-br ${t.gradient}`}
        style={{ color: t.text }}
      >
        <div className="mx-auto max-w-sm px-5 pb-5 pt-5">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/home')} className="flex items-center gap-1.5 text-sm font-semibold active:scale-95 transition-transform">
              <ArrowLeft className="h-5 w-5" /> Back
            </button>
            <span className="text-lg font-bold tracking-tight">{t.name}</span>
            <button className="relative active:scale-95 transition-transform" onClick={() => {}}>
              <Bell className="h-5 w-5" />
              {activeNotifs.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold" style={{ color: t.bg }}>
                  {activeNotifs.length}
                </span>
              )}
            </button>
          </div>

          {/* Balance cards in header */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <BalanceCard
              icon={<Phone className="h-4 w-4" />}
              label="Airtime"
              value={`₦${sub.airtimeBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              textColor={t.text}
            />
            <BalanceCard
              icon={<Wifi className="h-4 w-4" />}
              label="Data"
              value={`${(sub.dataBalanceMB / 1024).toFixed(1)}GB`}
              textColor={t.text}
              percent={dataPercent}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-sm space-y-4 px-5 pb-8 pt-5">
        {/* Success toast */}
        {successMsg && (
          <div className="animate-fade-in flex items-center gap-2.5 rounded-2xl bg-[hsl(152,60%,40%)] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[hsl(152,60%,40%,0.2)]">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {successMsg}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="animate-fade-in flex items-center gap-2.5 rounded-2xl bg-[hsl(0,70%,95%)] px-4 py-3.5 text-sm font-semibold text-[hsl(0,65%,45%)] shadow-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        {/* Alert banners */}
        {sub.airtimeBalance < 200 && (
          <AlertBanner icon={<Zap className="h-4 w-4" />} color="hsl(35,90%,50%)" msg={`Low airtime: ₦${sub.airtimeBalance.toFixed(0)}`} />
        )}
        {sub.dataBalanceMB < 500 && (
          <AlertBanner icon={<Wifi className="h-4 w-4" />} color="hsl(0,70%,55%)" msg={`Low data: ${(sub.dataBalanceMB / 1024).toFixed(1)}GB remaining`} />
        )}
        {daysLeft <= 2 && (
          <AlertBanner icon={<Shield className="h-4 w-4" />} color="hsl(270,50%,55%)" msg={`Plan expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`} />
        )}

        {/* Active number selector */}
        <div className="animate-fade-in" style={{ animationDelay: '50ms', animationFillMode: 'backwards' }}>
          <button
            onClick={() => setShowNumbers(!showNumbers)}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5 text-sm active:scale-[0.98] transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: t.subtleBg }}>
                <Phone className="h-4 w-4" style={{ color: t.accent }} />
              </div>
              <span className="font-semibold text-foreground">{activeNum?.number ?? 'No number'}</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showNumbers ? 'rotate-180' : ''}`} />
          </button>
          {showNumbers && (
            <div className="animate-fade-in mt-2 space-y-1 rounded-2xl border border-border bg-card p-2 shadow-lg">
              {networkNumbers.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { switchNumber(n.id); setShowNumbers(false); }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${n.isActive ? 'font-semibold' : 'text-muted-foreground hover:bg-secondary'}`}
                  style={n.isActive ? { backgroundColor: t.subtleBg, color: t.accent } : {}}
                >
                  {n.number}
                  {n.isActive && <CheckCircle2 className="h-4 w-4" />}
                </button>
              ))}
              <button
                onClick={() => { setShowNumbers(false); setAddNumModal(true); }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary transition-colors"
              >
                <Plus className="h-4 w-4" /> Add number
              </button>
            </div>
          )}
        </div>

        {/* Info cards */}
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
          <InfoCard icon={<Calendar className="h-4 w-4" />} label="Active Plan" value={sub.activePlan} accentBg={t.subtleBg} accentColor={t.accent} />
          <InfoCard icon={<Clock className="h-4 w-4" />} label="Expires" value={daysLeft === 0 ? 'Today' : `In ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`} accentBg={t.subtleBg} accentColor={t.accent} />
          <InfoCard icon={<Clock className="h-4 w-4" />} label="Last Updated" value={timeSinceUpdate < 1 ? 'Just now' : `${timeSinceUpdate}m ago`} accentBg={t.subtleBg} accentColor={t.accent} />
        </div>

        {/* Data prediction */}
        <div className="animate-fade-in rounded-2xl border border-border bg-card p-4 shadow-sm" style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: t.subtleBg }}>
              <TrendingUp className="h-3.5 w-3.5" style={{ color: t.accent }} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Smart Prediction</p>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            Based on average usage, your data will last approximately <strong className="font-bold">{dataPredictionDays} day{dataPredictionDays !== 1 ? 's' : ''}</strong>.
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
          <button
            onClick={() => setBuyModal('airtime')}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.97]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: t.subtleBg }}>
              <ShoppingCart className="h-5 w-5" style={{ color: t.accent }} />
            </div>
            <span className="text-sm font-semibold text-foreground">Buy Airtime</span>
          </button>
          <button
            onClick={() => setBuyModal('data')}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.97]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: t.subtleBg }}>
              <Wifi className="h-5 w-5" style={{ color: t.accent }} />
            </div>
            <span className="text-sm font-semibold text-foreground">Buy Data</span>
          </button>
        </div>

        {/* Refresh */}
        <Button
          onClick={refresh}
          disabled={isLoading}
          className={`w-full rounded-2xl py-6 text-sm font-bold active:scale-[0.97] transition-all duration-200 bg-gradient-to-r ${t.gradient} border-0 animate-fade-in`}
          style={{ color: t.text, animationDelay: '250ms', animationFillMode: 'backwards' }}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {isLoading ? 'Refreshing…' : 'Refresh Balances'}
        </Button>

        {/* Notifications */}
        {activeNotifs.length > 0 && (
          <div className="space-y-2 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notifications</p>
            {activeNotifs.map((n) => (
              <div key={n.id} className="flex items-start justify-between rounded-2xl border border-border bg-card p-3.5 shadow-sm">
                <p className="text-sm text-foreground">{n.message}</p>
                <button onClick={() => dismissNotification(n.id)} className="ml-2 shrink-0 active:scale-90 transition-transform">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buy Airtime Modal */}
      <Dialog open={buyModal === 'airtime'} onOpenChange={() => setBuyModal(null)}>
        <DialogContent className="max-w-xs rounded-3xl border-border">
          <DialogHeader><DialogTitle className="text-lg">Buy Airtime</DialogTitle></DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {airtimeAmounts.map((a) => (
              <button
                key={a}
                onClick={() => handleBuyAirtime(a)}
                disabled={isLoading}
                className="rounded-2xl border border-border bg-card py-3.5 text-sm font-bold text-foreground transition-all duration-200 hover:shadow-md hover:border-muted-foreground/30 active:scale-95"
              >
                ₦{a.toLocaleString()}
              </button>
            ))}
          </div>
          {isLoading && <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Processing…</p>}
        </DialogContent>
      </Dialog>

      {/* Buy Data Modal */}
      <Dialog open={buyModal === 'data'} onOpenChange={() => setBuyModal(null)}>
        <DialogContent className="max-w-xs rounded-3xl border-border">
          <DialogHeader><DialogTitle className="text-lg">Buy Data</DialogTitle></DialogHeader>
          <div className="space-y-2">
            {dataPlans.map((p) => (
              <button
                key={p.label}
                onClick={() => handleBuyData(p)}
                disabled={isLoading}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5 text-sm transition-all duration-200 hover:shadow-md hover:border-muted-foreground/30 active:scale-[0.97]"
              >
                <div>
                  <span className="font-bold text-foreground">{p.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{p.duration}</span>
                </div>
                <span className="font-bold" style={{ color: t.accent }}>₦{p.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
          {isLoading && <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Processing…</p>}
        </DialogContent>
      </Dialog>

      {/* Add Number Modal */}
      <Dialog open={addNumModal} onOpenChange={() => { setAddNumModal(false); setOtpStep(false); setNewNum(''); }}>
        <DialogContent className="max-w-xs rounded-3xl border-border">
          <DialogHeader><DialogTitle className="text-lg">{otpStep ? 'Verify Number' : 'Add Number'}</DialogTitle></DialogHeader>
          {otpStep ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">An OTP has been sent to {newNum}</p>
              <Input placeholder="Enter OTP" maxLength={6} className="rounded-xl" />
              <Button className={`w-full rounded-xl active:scale-[0.97] bg-gradient-to-r ${t.gradient}`} onClick={handleAddNumber} style={{ color: t.text }}>
                Verify
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input placeholder="e.g. 0803 456 7890" value={newNum} onChange={(e) => setNewNum(e.target.value)} className="rounded-xl" />
              <Button className={`w-full rounded-xl active:scale-[0.97] bg-gradient-to-r ${t.gradient}`} onClick={handleAddNumber} style={{ color: t.text }}>
                Send OTP
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ---------- Sub-components ---------- */

function BalanceCard({ icon, label, value, textColor, percent }: {
  icon: React.ReactNode; label: string; value: string; textColor: string; percent?: number;
}) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: `${textColor}12`, color: textColor }}>
      <div className="flex items-center gap-1.5 opacity-70">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1.5 text-2xl font-bold tabular-nums" style={{ lineHeight: 1.1 }}>{value}</p>
      {percent !== undefined && (
        <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${textColor}20` }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: textColor }} />
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value, accentBg, accentColor }: {
  icon: React.ReactNode; label: string; value: string; accentBg: string; accentColor: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: accentBg }}>
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

function AlertBanner({ icon, color, msg }: { icon: React.ReactNode; color: string; msg: string }) {
  return (
    <div
      className="animate-fade-in flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg"
      style={{ backgroundColor: color, boxShadow: `0 4px 16px ${color}40` }}
    >
      {icon} {msg}
    </div>
  );
}

export default Dashboard;
