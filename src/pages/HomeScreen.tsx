import { useNavigate } from 'react-router-dom';
import { useTelecom } from '@/context/TelecomContext';
import { Signal, Radio, Smartphone, ChevronRight, Globe } from 'lucide-react';
import type { NetworkType } from '@/types/telecom';

const networks = [
  {
    id: 'mtn' as const,
    name: 'MTN',
    tagline: 'Everywhere you go',
    gradient: 'from-[hsl(45,100%,52%)] to-[hsl(42,100%,42%)]',
    text: 'hsl(45,100%,6%)',
    iconBg: 'hsl(45,100%,6%,0.12)',
    shadow: '0 12px 40px hsl(45 100% 50% / 0.25), 0 4px 12px hsl(45 100% 50% / 0.15)',
    icon: Signal,
    decoration: 'hsl(45,100%,6%,0.06)',
  },
  {
    id: 'airtel' as const,
    name: 'Airtel',
    tagline: 'The smartphone network',
    gradient: 'from-[hsl(0,80%,55%)] to-[hsl(350,75%,42%)]',
    text: 'hsl(0,0%,100%)',
    iconBg: 'hsl(0,0%,100%,0.18)',
    shadow: '0 12px 40px hsl(0 80% 52% / 0.25), 0 4px 12px hsl(0 80% 52% / 0.15)',
    icon: Radio,
    decoration: 'hsl(0,0%,100%,0.06)',
  },
  {
    id: 'glo' as const,
    name: 'Glo',
    tagline: 'Rule your world',
    gradient: 'from-[hsl(130,70%,45%)] to-[hsl(145,65%,32%)]',
    text: 'hsl(0,0%,100%)',
    iconBg: 'hsl(0,0%,100%,0.18)',
    shadow: '0 12px 40px hsl(130 70% 42% / 0.25), 0 4px 12px hsl(130 70% 42% / 0.15)',
    icon: Globe,
    decoration: 'hsl(0,0%,100%,0.06)',
  },
];

const HomeScreen = () => {
  const navigate = useNavigate();
  const { setActiveNetwork } = useTelecom();

  const handleSelect = (id: NetworkType) => {
    setActiveNetwork(id);
    navigate('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: 'linear-gradient(145deg, hsl(220,25%,8%) 0%, hsl(230,30%,14%) 50%, hsl(220,20%,10%) 100%)' }}
    >
      {/* Decorative background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(45,100%,50%) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(0,80%,52%) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-0 h-60 w-60 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(130,70%,45%) 0%, transparent 70%)' }} />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(hsl(0,0%,100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0,0%,100%) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in">
          <div className="mx-auto mb-5 relative">
            <div className="absolute inset-0 mx-auto h-16 w-16 rounded-2xl bg-[hsl(45,100%,50%)] blur-xl opacity-30 animate-pulse" />
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(45,100%,55%)] to-[hsl(45,100%,40%)] shadow-lg shadow-[hsl(45,100%,50%,0.25)]">
              <Smartphone className="h-8 w-8 text-[hsl(220,25%,8%)]" strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white text-balance" style={{ lineHeight: 1.1 }}>
            TeleEase
          </h1>
          <p className="mt-2 text-sm font-medium text-[hsl(220,15%,55%)]">
            Your Smart Telecom Assistant
          </p>
        </div>

        {/* Network Cards */}
        <div className="flex flex-col gap-3.5">
          {networks.map((net, i) => {
            const Icon = net.icon;
            return (
              <button
                key={net.id}
                onClick={() => handleSelect(net.id)}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${net.gradient} p-5 text-left transition-all duration-300 active:scale-[0.97] animate-fade-in`}
                style={{
                  color: net.text,
                  boxShadow: net.shadow,
                  animationDelay: `${150 + i * 100}ms`,
                  animationFillMode: 'backwards',
                }}
              >
                {/* Background decoration */}
                <div
                  className="absolute -right-8 -top-8 h-32 w-32 rounded-full transition-transform duration-500 group-hover:scale-150"
                  style={{ backgroundColor: net.decoration }}
                />
                <div
                  className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full"
                  style={{ backgroundColor: net.decoration }}
                />

                <div className="relative flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
                    style={{ backgroundColor: net.iconBg }}
                  >
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold tracking-tight">{net.name}</div>
                    <div className="text-sm opacity-75 font-medium">{net.tagline}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 opacity-40 transition-all duration-300 group-hover:opacity-70 group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-[hsl(220,15%,40%)] animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
          Select your network to get started
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
