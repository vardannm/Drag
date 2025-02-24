import { Link } from "react-router-dom";
import "./UserInfo.css";

const UserInfo = () => {
  return (
    <div className="user-info-container">
      <h1>User Information</h1>
      <div className="user-info-content">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> john.doe@example.com</p>
        <p><strong>Joined:</strong> February 24, 2025</p>
        <p><strong>Bio:</strong> Just a creative soul exploring the canvas!</p>
      </div>
      <Link to="/" className="back-button">
        Back to Editor
      </Link>
    </div>
  );
};

export default UserInfo;