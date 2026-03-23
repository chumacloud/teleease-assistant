import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelecom } from '@/context/TelecomContext';
import {
  ArrowLeft, RefreshCw, Wifi, Phone, Calendar, Clock, AlertTriangle,
  Plus, CheckCircle2, ShoppingCart, X, Loader2, Bell, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const theme = {
  mtn: { bg: 'hsl(45,100%,50%)', bgLight: 'hsl(45,100%,96%)', text: 'hsl(45,100%,8%)', accent: 'hsl(45,80%,40%)' },
  airtel: { bg: 'hsl(0,87%,52%)', bgLight: 'hsl(0,60%,97%)', text: 'hsl(0,0%,100%)', accent: 'hsl(0,70%,40%)' },
};

const airtimeAmounts = [100, 200, 500, 1000, 2000, 5000];
const dataPlans = [
  { label: '500MB Daily', mb: 512, price: 200 },
  { label: '1GB Weekly', mb: 1024, price: 500 },
  { label: '2GB Weekly', mb: 2048, price: 800 },
  { label: '5GB Monthly', mb: 5120, price: 2000 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    activeNetwork, numbers, isLoading, error,
    getActiveNumber, getSubscription, switchNumber, addNumber,
    refresh, buyAirtime, buyData, notifications, dismissNotification,
  } = useTelecom();

  const [buyModal, setBuyModal] = useState<'airtime' | 'data' | null>(null);
  const [addNumModal, setAddNumModal] = useState(false);
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
    <div className="min-h-screen" style={{ backgroundColor: t.bgLight }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pb-4 pt-4" style={{ backgroundColor: t.bg, color: t.text }}>
        <div className="mx-auto flex max-w-sm items-center justify-between">
          <button onClick={() => navigate('/home')} className="flex items-center gap-1 text-sm font-medium active:scale-95">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <span className="text-lg font-bold">{net === 'mtn' ? 'MTN' : 'Airtel'}</span>
          <button className="relative active:scale-95" onClick={() => {}}>
            <Bell className="h-5 w-5" />
            {activeNotifs.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(0,0%,100%)] text-[10px] font-bold" style={{ color: t.bg }}>
                {activeNotifs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-sm space-y-4 px-4 pb-8 pt-4">
        {/* Success toast */}
        {successMsg && (
          <div className="animate-fade-in flex items-center gap-2 rounded-xl bg-[hsl(145,60%,42%)] px-4 py-3 text-sm font-medium text-white">
            <CheckCircle2 className="h-4 w-4" /> {successMsg}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-[hsl(0,70%,95%)] px-4 py-3 text-sm font-medium text-[hsl(0,70%,40%)]">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        )}

        {/* Alert banners */}
        {sub.airtimeBalance < 200 && (
          <AlertBanner color="hsl(35,90%,50%)" msg={`Low airtime: ₦${sub.airtimeBalance.toFixed(0)}`} />
        )}
        {sub.dataBalanceMB < 500 && (
          <AlertBanner color="hsl(0,70%,55%)" msg={`Low data: ${(sub.dataBalanceMB / 1024).toFixed(1)}GB remaining`} />
        )}
        {daysLeft <= 2 && (
          <AlertBanner color="hsl(270,50%,55%)" msg={`Plan expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`} />
        )}

        {/* Active number selector */}
        <button
          onClick={() => setShowNumbers(!showNumbers)}
          className="flex w-full items-center justify-between rounded-xl border border-[hsl(220,15%,90%)] bg-white px-4 py-3 text-sm active:scale-[0.98]"
        >
          <span className="font-medium text-[hsl(220,15%,30%)]">{activeNum?.number ?? 'No number'}</span>
          <ChevronDown className={`h-4 w-4 text-[hsl(220,10%,60%)] transition-transform ${showNumbers ? 'rotate-180' : ''}`} />
        </button>
        {showNumbers && (
          <div className="animate-fade-in space-y-2 rounded-xl border border-[hsl(220,15%,90%)] bg-white p-3">
            {networkNumbers.map((n) => (
              <button
                key={n.id}
                onClick={() => { switchNumber(n.id); setShowNumbers(false); }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${n.isActive ? 'font-semibold' : 'text-[hsl(220,10%,50%)]'}`}
                style={n.isActive ? { backgroundColor: `${t.bg}20`, color: t.accent } : {}}
              >
                {n.number}
                {n.isActive && <CheckCircle2 className="h-4 w-4" />}
              </button>
            ))}
            <button
              onClick={() => { setShowNumbers(false); setAddNumModal(true); }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[hsl(220,10%,50%)] hover:bg-[hsl(220,15%,96%)]"
            >
              <Plus className="h-4 w-4" /> Add number
            </button>
          </div>
        )}

        {/* Balance cards */}
        <div className="grid grid-cols-2 gap-3">
          <BalanceCard icon={<Phone className="h-5 w-5" />} label="Airtime" value={`₦${sub.airtimeBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} color={t.bg} textColor={t.text} />
          <BalanceCard icon={<Wifi className="h-5 w-5" />} label="Data" value={`${(sub.dataBalanceMB / 1024).toFixed(1)}GB`} color={t.bg} textColor={t.text} />
        </div>

        {/* Info cards */}
        <div className="space-y-3">
          <InfoCard icon={<Calendar className="h-4 w-4" />} label="Active Plan" value={sub.activePlan} />
          <InfoCard icon={<Clock className="h-4 w-4" />} label="Expires" value={daysLeft === 0 ? 'Today' : `In ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`} />
          <InfoCard icon={<Clock className="h-4 w-4" />} label="Last Updated" value={timeSinceUpdate < 1 ? 'Just now' : `${timeSinceUpdate} min${timeSinceUpdate !== 1 ? 's' : ''} ago`} />
        </div>

        {/* Data prediction */}
        <div className="rounded-xl border border-[hsl(220,15%,90%)] bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[hsl(220,10%,55%)]">Smart Prediction</p>
          <p className="mt-1 text-sm text-[hsl(220,15%,25%)]">
            Based on average usage, your data will last approximately <strong>{dataPredictionDays} day{dataPredictionDays !== 1 ? 's' : ''}</strong>.
          </p>
        </div>

        {/* Refresh */}
        <Button
          onClick={refresh}
          disabled={isLoading}
          className="w-full rounded-xl py-6 text-sm font-semibold active:scale-[0.97]"
          style={{ backgroundColor: t.bg, color: t.text }}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {isLoading ? 'Refreshing…' : 'Refresh Balances'}
        </Button>

        {/* Buy actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="rounded-xl py-6 active:scale-[0.97]" onClick={() => setBuyModal('airtime')}>
            <ShoppingCart className="h-4 w-4" /> Buy Airtime
          </Button>
          <Button variant="outline" className="rounded-xl py-6 active:scale-[0.97]" onClick={() => setBuyModal('data')}>
            <Wifi className="h-4 w-4" /> Buy Data
          </Button>
        </div>

        {/* Notifications */}
        {activeNotifs.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-[hsl(220,10%,55%)]">Notifications</p>
            {activeNotifs.map((n) => (
              <div key={n.id} className="flex items-start justify-between rounded-xl border border-[hsl(220,15%,90%)] bg-white p-3">
                <p className="text-sm text-[hsl(220,15%,30%)]">{n.message}</p>
                <button onClick={() => dismissNotification(n.id)} className="ml-2 shrink-0 active:scale-90">
                  <X className="h-4 w-4 text-[hsl(220,10%,65%)]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buy Airtime Modal */}
      <Dialog open={buyModal === 'airtime'} onOpenChange={() => setBuyModal(null)}>
        <DialogContent className="max-w-xs rounded-2xl">
          <DialogHeader><DialogTitle>Buy Airtime</DialogTitle></DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {airtimeAmounts.map((a) => (
              <button
                key={a}
                onClick={() => handleBuyAirtime(a)}
                disabled={isLoading}
                className="rounded-xl border border-[hsl(220,15%,90%)] py-3 text-sm font-semibold transition-colors hover:border-[hsl(220,15%,75%)] active:scale-95"
              >
                ₦{a.toLocaleString()}
              </button>
            ))}
          </div>
          {isLoading && <p className="mt-2 flex items-center gap-2 text-sm text-[hsl(220,10%,50%)]"><Loader2 className="h-4 w-4 animate-spin" /> Processing…</p>}
        </DialogContent>
      </Dialog>

      {/* Buy Data Modal */}
      <Dialog open={buyModal === 'data'} onOpenChange={() => setBuyModal(null)}>
        <DialogContent className="max-w-xs rounded-2xl">
          <DialogHeader><DialogTitle>Buy Data</DialogTitle></DialogHeader>
          <div className="space-y-2">
            {dataPlans.map((p) => (
              <button
                key={p.label}
                onClick={() => handleBuyData(p)}
                disabled={isLoading}
                className="flex w-full items-center justify-between rounded-xl border border-[hsl(220,15%,90%)] px-4 py-3 text-sm transition-colors hover:border-[hsl(220,15%,75%)] active:scale-[0.97]"
              >
                <span className="font-medium">{p.label}</span>
                <span className="text-[hsl(220,10%,50%)]">₦{p.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
          {isLoading && <p className="mt-2 flex items-center gap-2 text-sm text-[hsl(220,10%,50%)]"><Loader2 className="h-4 w-4 animate-spin" /> Processing…</p>}
        </DialogContent>
      </Dialog>

      {/* Add Number Modal */}
      <Dialog open={addNumModal} onOpenChange={() => { setAddNumModal(false); setOtpStep(false); setNewNum(''); }}>
        <DialogContent className="max-w-xs rounded-2xl">
          <DialogHeader><DialogTitle>{otpStep ? 'Verify Number' : 'Add Number'}</DialogTitle></DialogHeader>
          {otpStep ? (
            <div className="space-y-3">
              <p className="text-sm text-[hsl(220,10%,50%)]">An OTP has been sent to {newNum}</p>
              <Input placeholder="Enter OTP" maxLength={6} />
              <Button className="w-full active:scale-[0.97]" onClick={handleAddNumber} style={{ backgroundColor: t.bg, color: t.text }}>
                Verify
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input placeholder="e.g. 0803 456 7890" value={newNum} onChange={(e) => setNewNum(e.target.value)} />
              <Button className="w-full active:scale-[0.97]" onClick={handleAddNumber} style={{ backgroundColor: t.bg, color: t.text }}>
                Send OTP
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

function BalanceCard({ icon, label, value, color, textColor }: { icon: React.ReactNode; label: string; value: string; color: string; textColor: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: color, color: textColor }}>
      <div className="flex items-center gap-2 opacity-80">{icon}<span className="text-xs font-medium uppercase tracking-wide">{label}</span></div>
      <p className="mt-2 text-2xl font-bold" style={{ lineHeight: 1.1 }}>{value}</p>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[hsl(220,15%,90%)] bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-[hsl(220,10%,55%)]">{icon}<span className="text-sm">{label}</span></div>
      <span className="text-sm font-semibold text-[hsl(220,15%,25%)]">{value}</span>
    </div>
  );
}

function AlertBanner({ color, msg }: { color: string; msg: string }) {
  return (
    <div className="animate-fade-in flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white" style={{ backgroundColor: color }}>
      <AlertTriangle className="h-4 w-4 shrink-0" /> {msg}
    </div>
  );
}

export default Dashboard;
