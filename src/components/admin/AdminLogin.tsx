import { useState, ChangeEvent, FormEvent } from 'react'
import { AuthTabs } from '@/components/ui/modern-animated-sign-in'
import AnimatedGradient from '@/components/ui/animated-gradient'

type FormData = {
  username: string;
  password: string;
};

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    username: 'admin123',
    password: 'admin123',
  });

  const goToForgotPassword = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    event.preventDefault();
    console.log('forgot password');
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted', formData);
    if (formData.username.trim() && formData.password.trim()) {
      onLogin();
    }
  };

  const formFields = {
    header: 'Welcome back',
    subHeader: 'Sign in to your admin dashboard',
    fields: [
      {
        label: 'Username',
        required: true,
        type: 'text' as const,
        placeholder: 'Enter your username',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'username'),
      },
      {
        label: 'Password',
        required: true,
        type: 'password' as const,
        placeholder: 'Enter your password',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'password'),
      },
    ],
    submitButton: 'Sign in',
    textVariantButton: 'Forgot password?',
  };

  return (
    <section className='relative min-h-screen text-white overflow-hidden'>
      {/* Full-page animated gradient background */}
      <AnimatedGradient
        config={{
          preset: "custom",
          color1: "#000000",
          color2: "#176B02",
          color3: "#39F72A",
          rotation: 114,
          proportion: 63,
          scale: 0.75,
          speed: 30,
          distortion: 5,
          swirl: 61,
          swirlIterations: 5,
          softness: 100,
          offset: -168,
          shape: "Checks",
          shapeSize: 28,
        }}
        noise={{ opacity: 0.5, scale: 1 }}
        style={{ zIndex: 0 }}
      />

      {/* Login Card */}
      <div className='relative z-10 flex min-h-screen items-center justify-center px-4'>
        <div className='w-full max-w-md rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-8 shadow-2xl'>
          <AuthTabs
            formFields={formFields}
            goTo={goToForgotPassword}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Back link */}
      <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50'>
        <a
          href='/'
          className='font-mono text-xs tracking-widest uppercase text-neutral-500 hover:text-emerald-400 transition-colors duration-250'
        >
          ← Back to website
        </a>
      </div>
    </section>
  );
}
