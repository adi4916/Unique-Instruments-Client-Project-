import { useAuth } from '../contexts/AuthContext';

interface AuthStatusProps {
  className?: string;
}

const AuthStatus: React.FC<AuthStatusProps> = ({ className = '' }) => {
  const { currentUser } = useAuth();

  return (
    <div className={`text-sm ${className}`}>
      {currentUser ? (
        <span>Logged in as: {currentUser.email}</span>
      ) : (
        <span>Not logged in</span>
      )}
    </div>
  );
};

export default AuthStatus;
