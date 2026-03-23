import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone } from 'lucide-react';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setShowContent(true), 100);
    const t1 = setTimeout(() => setFadeOut(true), 2000);
    const t2 = setTimeout(() => navigate('/home', { replace: true }), 2500);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [navigate]);

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center bg-[hsl(220,25%,8%)] transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className={`flex flex-col items-center gap-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-[hsl(45,100%,50%)] blur-2xl opacity-30 animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[hsl(45,100%,55%)] to-[hsl(45,100%,42%)]">
            <Smartphone className="h-11 w-11 text-[hsl(220,25%,8%)]" strokeWidth={2} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-white" style={{ lineHeight: 1 }}>
            TeleEase
          </h1>
          <p className="text-sm font-medium text-[hsl(220,15%,55%)] tracking-wide">
            Your Smart Telecom Assistant
          </p>
        </div>
        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[hsl(45,100%,50%)] animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
