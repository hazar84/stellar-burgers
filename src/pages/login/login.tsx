import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch } from '../../services/store';
import { authChecked, loginUser } from '../../services/slices/userSlice';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(loginUser({ email: email, password: password }))
      .unwrap()
      .catch((error) => console.error('Ошибка авторизации:', error))
      .finally(() => authChecked());
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
