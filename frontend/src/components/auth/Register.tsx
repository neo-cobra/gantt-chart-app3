import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: var(--box-shadow);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  margin-top: 1rem;
  text-align: center;
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
`;

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { register } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('すべてのフィールドを入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('パスワードと確認用パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setFormError('パスワードは6文字以上必要です');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name, email, password);
    } catch (error) {
      // Error is already handled in the context and displayed with toast
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterContainer>
      <Title>アカウント登録</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">名前</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">パスワード</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="confirmPassword">パスワード (確認)</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormGroup>
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '登録中...' : '登録'}
        </Button>
      </Form>
      <LoginLink>
        既にアカウントをお持ちの方は <Link to="/login">ログイン</Link>
      </LoginLink>
    </RegisterContainer>
  );
};

export default Register;