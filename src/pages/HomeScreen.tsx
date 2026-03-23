import { useNavigate } from 'react-router-dom';
import { useTelecom } from '@/context/TelecomContext';
import { Signal, Radio, Smartphone, ChevronRight } from 'lucide-react';

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
];

const HomeScreen = () => {
  const navigate = useNavigate();
  const { setActiveNetwork } = useTelecom();

  const handleSelect = (id: 'mtn' | 'airtel') => {
    setActiveNetwork(id);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(220,25%,12%)]">
            <Smartphone className="h-7 w-7 text-[hsl(45,100%,50%)]" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance" style={{ lineHeight: 1.1 }}>
            TeleEase
          </h1>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Your Smart Telecom Assistant
          </p>
        </div>

        {/* Network Cards */}
        <div className="flex flex-col gap-4">
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
        <p className="mt-10 text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
          Select your network to get started
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
