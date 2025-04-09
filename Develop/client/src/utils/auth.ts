import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  // Returns the decoded token (user profile)
  getProfile() {
    const token = this.getToken();
    if (token) {
      try {
        // Decode the JWT token to get the payload (user info)
        const decoded: JwtPayload = jwtDecode(token);
        return decoded;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  // Returns whether the user is logged in (token exists and is not expired)
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Checks if the JWT is expired
  isTokenExpired(token: string) {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      if (decoded.exp) {
        // Token expiration time is in seconds, so compare it with current time (in seconds)
        return decoded.exp < Date.now() / 1000;
      }
    } catch (error) {
      console.error('Error decoding token to check expiration:', error);
    }
    return true;
  }

  // Get the token from localStorage
  getToken(): string {
    return localStorage.getItem('jwtToken') || '';
  }

  // Set the token to localStorage and redirect to the home page
  login(idToken: string) {
    localStorage.setItem('jwtToken', idToken);
    window.location.href = '/';  // Redirect to the home page (Kanban board)
  }

  // Remove the token from localStorage and redirect to the login page
  logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login';  // Redirect to the login page
  }
}

export default new AuthService();
