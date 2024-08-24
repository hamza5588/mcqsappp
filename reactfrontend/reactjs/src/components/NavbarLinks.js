import { Link, Outlet } from "react-router-dom";

export default function NavbarLinks() {
  return (
    <div className="content-section-last">
      {/* Ensure NavbarLinks is inside the content section if
  you want it to appear there */}
      <nav className="navbarlinks">
        <ul>
          <li>
            <Link to="/text">Text</Link>
          </li>
          <li>
            <Link to="/subject">Subject</Link>
          </li>
          <li>
            <Link to="/file">File</Link>
          </li>
          <li>
            <Link to="/prompt">Prompt</Link>
          </li>
          <li>
            <Link to="/url">Link</Link>
          </li>
        </ul>

        {/* <div className="Main-Section"> */}
        <Outlet />
        {/* </div> */}
      </nav>
    </div>
  );
}
