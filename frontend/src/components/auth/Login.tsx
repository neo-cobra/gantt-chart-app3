import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styled from 'styled-components';

const LoginContainer = styled.div`
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

const RegisterLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    
    // Simple validation
    if (!email || !password) {
      setFormError('すべてのフィールドを入力してください');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error) {
      // Error is already handled in the context and displayed with toast
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <Title>ログイン</Title>
      <Form onSubmit={handleSubmit}>
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
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </Button>
      </Form>
      <RegisterLink>
        アカウントをお持ちでない方は <Link to="/register">登録</Link>
      </RegisterLink>
    </LoginContainer>
  );
};

export default Login;