import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone } from 'lucide-react';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1600);
    const t2 = setTimeout(() => navigate('/home', { replace: true }), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [navigate]);

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center bg-[hsl(220,20%,10%)] transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="animate-scale-in flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[hsl(45,100%,50%)] shadow-[0_0_40px_hsl(45,100%,50%,0.3)]">
          <Smartphone className="h-10 w-10 text-[hsl(220,20%,10%)]" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white" style={{ lineHeight: 1 }}>
          TeleEase
        </h1>
        <p className="text-sm text-[hsl(220,10%,60%)]">Your Smart Telecom Assistant</p>
      </div>
    </div>
  );
};

export default SplashScreen;
