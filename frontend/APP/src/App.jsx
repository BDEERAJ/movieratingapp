import {Route,BrowserRouter as Router,Routes} from 'react-router-dom';
import AuthRoute from './Auth/Auth.jsx';
import HomePage from './HomePage/HomePagema.jsx';
import MoviePage from './MoviePage/MoviePage.jsx';
import Profile from './Profile/Profile.jsx';
import Watchlist from './WatchList/watchList.jsx';
import AdminDashboard from './Admin/Admin.jsx';
export default function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<AuthRoute />} />
            <Route path="/Home" element={<HomePage />} />
            <Route path="/movie" element={<MoviePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    </Router>
  );
}

