import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Navbar({ session }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <Link to="/" className="text-lg font-bold">Smart SOPs</Link>
      <div className="space-x-4">
        {session ? (
          <>
            <Link to="/generate">Generate SOP</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
