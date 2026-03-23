import { useNavigate } from 'react-router-dom';
import { useTelecom } from '@/context/TelecomContext';
import { Signal, Smartphone } from 'lucide-react';

const networks = [
  {
    id: 'mtn' as const,
    name: 'MTN',
    tagline: 'Everywhere you go',
    bg: 'hsl(45,100%,50%)',
    text: 'hsl(45,100%,8%)',
    shadow: 'hsl(45,100%,50%,0.25)',
    icon: Signal,
  },
  {
    id: 'airtel' as const,
    name: 'Airtel',
    tagline: 'The smartphone network',
    bg: 'hsl(0,87%,52%)',
    text: 'hsl(0,0%,100%)',
    shadow: 'hsl(0,87%,52%,0.25)',
    icon: Smartphone,
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(220,20%,97%)] px-6">
      <div className="animate-fade-in w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[hsl(220,20%,15%)]" style={{ lineHeight: 1.1 }}>
            TeleEase
          </h1>
          <p className="mt-2 text-sm text-[hsl(220,10%,50%)]">Your Smart Telecom Assistant</p>
        </div>

        <div className="flex flex-col gap-4">
          {networks.map((net, i) => {
            const Icon = net.icon;
            return (
              <button
                key={net.id}
                onClick={() => handleSelect(net.id)}
                className="group flex items-center gap-4 rounded-2xl p-5 text-left transition-all duration-200 active:scale-[0.97]"
                style={{
                  backgroundColor: net.bg,
                  color: net.text,
                  boxShadow: `0 8px 24px ${net.shadow}`,
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: `${net.text}15` }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-xl font-bold">{net.name}</div>
                  <div className="text-sm opacity-80">{net.tagline}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
