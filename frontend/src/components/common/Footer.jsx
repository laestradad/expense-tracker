import { useEffect, useState } from "react";
import githubLogo from "@/assets/github.svg";
import linkedinLogo from "@/assets/linkedin.svg";
import { API_URL } from "@/api/api.js";

export default function Footer() {  
  const [version, setversion] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/version`)
      .then((res) => res.json())
      .then((data) => setversion(data.version))
      .catch(() =>
        setversion(error)
      );
  }, []);

  return (
    <footer>
      <a style={{color : 'white'}} href="https://github.com/laestradad/expense-tracker">
        v{version}
      </a>
      <p></p>
      <div className="social-links">
        <a
          href="https://github.com/laestradad"
          target="_blank"
          rel="noreferrer"
        >
          <img src={githubLogo} alt="GitHub" className="social-logo" />
        </a>
        <a
          href="https://www.linkedin.com/in/laestradad/"
          target="_blank"
          rel="noreferrer"
        >
          <img src={linkedinLogo} alt="LinkedIn" className="social-logo" />
        </a>
        <p>By the way, I am Luis! :)</p>
      </div>
    </footer>
  );
}