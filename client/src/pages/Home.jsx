import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-5">
      <h3 className="fw-bold text-secondary">Welcome to MERN Stack Google Authentication</h3>
      <p className="fw-bold text-secondary">This project is a robust authentication system built using the MERN stack (MongoDB Atlas, Express.js, React.js, Node.js), integrating Firebase for Google OAuth. It ensures secure user authentication with JSON Web Tokens (JWT) and offers OTP verification for enhanced security. Users can register, log in, and update their profiles, including uploading a custom avatar image. The interface, styled with Bootstrap, provides a responsive and user-friendly experience.</p>
      <ul>
        <li className="mt-2"><b>Seamless Google Login:</b> Users can quickly sign up and log in using their Google accounts, thanks to the integrated Firebase Google OAuth.</li>
        <li className="mt-2"><b>OTP Verification:</b> To enhance security, an OTP (One-Time Password) is sent to the user's email for verification during the registration or password recovery process.</li>
        <li className="mt-2"><b>Profile Customization:</b> Users can personalize their profiles by uploading an avatar image, making the platform more engaging and visually appealing.</li>
        <li className="mt-2"><b>Real-Time Data Management:</b> User information is stored in MongoDB Atlas, allowing for efficient and scalable data management.</li>
        <li className="mt-2"><b>Admin Panel:</b> Manage users, block users, monitor activity, and oversee the entire system with a robust and user-friendly admin panel.</li>
        <p className="mt-3">
          <b>Admin Panel Access:</b> Use the following credentials to access the <Link to={"/admin/dashboard"} className="fw-bold text-decoration-none">admin dashboard</Link>:
          <br />
          <b>Email:</b> admin@gmail.com
          <br />
          <b>Password:</b> admin@1234
        </p>
      </ul>

      <p className="lead fw-bold text-secondary">
        Start your journey with a secure and seamless Google authentication experience.
        <Link to="/sign-up" className="fw-bold fs-5 text-decoration-none"> Get Started</Link> and create your personalized profile now!
      </p>
    </div>
  );
}

export default Home;