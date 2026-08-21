import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import logoTagline from '../../assets/Tagline.png?inline'

const bgImage = '/bg2.png'

type FormData = {
  username: string;
  password: string;
};

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    username: 'admin123',
    password: 'admin123',
  });
  const [showPassword, setShowPassword] = useState(false)
  const [bgImageAvailable, setBgImageAvailable] = useState(true)

  useEffect(() => {
    const image = new Image()
    image.onload = () => setBgImageAvailable(true)
    image.onerror = () => setBgImageAvailable(false)
    image.src = bgImage
  }, [])

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

  return (
    <section className='tf24-admin-login' style={{ backgroundImage: bgImageAvailable ? `url(${bgImage})` : undefined }}>
      <div className='tf24-admin-shell'>
        <div className='tf24-admin-showcase' style={{ backgroundImage: bgImageAvailable ? `linear-gradient(180deg, rgba(3,6,7,0.25), rgba(3,6,7,0.68)), url(${bgImage})` : undefined }}>
          <div className='tf24-admin-showcase-top'>
            <img src={logoTagline} alt='TURFON24 — Premium Turfs 24/7' />
          </div>
        </div>

        <div className='tf24-admin-form-panel'>
          <div className='tf24-admin-form-top'>
          </div>
          <div className='tf24-admin-form-content'>
            <h1>Hi Admin</h1>
            <p>Welcome to TURFON24</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor='admin-username'>Username</label>
              <input id='admin-username' type='text' value={formData.username} placeholder='Username' onChange={event => handleInputChange(event, 'username')} />
              <label htmlFor='admin-password'>Password</label>
              <div className='tf24-admin-password'>
                <input id='admin-password' type={showPassword ? 'text' : 'password'} value={formData.password} placeholder='Password' onChange={event => handleInputChange(event, 'password')} />
                <button type='button' aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
              <button type='button' className='tf24-admin-forgot' onClick={goToForgotPassword}>Forgot password?</button>
              <button type='submit' className='tf24-admin-submit'>Login</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
