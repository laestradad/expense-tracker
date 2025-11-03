import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState('')

  // Simple public endpoint, no authentication needed
  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error fetching API'))
  }, [])

  return (
    <div>
      <h1>Home Page</h1>
      <p>This is a React + Flask SPA example.</p>
      <p>Message from Flask: {message}</p>
    </div>
  )
}