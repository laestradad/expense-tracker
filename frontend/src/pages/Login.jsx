import { useState } from "react"

export default function Login() {

  const [status, setStatus] = useState("")

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault() // prevent page reload
    setStatus("Sending...")
    try {
        const res = await fetch('/auth/login', {
          method: "POST",
          headers: { "Content-Type": "application/json" }, // needed for flask
          body: JSON.stringify(formData),
        })
        
        if (!res.ok) throw new Error("Request failed")

        const data = await res.json()
        setFormData({ username: "", password: ""}) // reset form
        setStatus(data.message || "Message sent successfully!")
      } catch (err) {
        console.error(err)
        setStatus("Error sending message. Please try again.")
      }
  }

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          autoComplete="off"
          type="text"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button>Log in</button>
      </form>
      <p>{status}</p>
    </div>
  )
}