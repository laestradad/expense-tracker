import { useAuth } from "@/contexts/AuthContext";
import { apiFetch, downloadFile } from "@/api/api";

export default function DeleteAccount() {
  const { logout } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    
    try {
      const data = await apiFetch("/auth/delete", {
        method: "POST"
      });

      if (data.message) {
        alert(data.message);
        logout();
      }

      if (data.error) {
        alert(data.error);
      }

    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadFile("/api/downloadraw");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Delete Account</h1>
      <h2 style={{ color: "#dc3545" }}>⚠️ Attention</h2>
      <p>Deleting your account is permanent and cannot be undone. </p>
      <p>Please download your data before proceeding. </p>
      <div style={{ margin: "1rem" }}>
        <button onClick={handleDownload} style={{ backgroundColor: "#646cff" }}>
          Download My Data
        </button>
      </div>
      <div style={{ margin: "1rem" }}>
        <button onClick={handleDelete} style={{ backgroundColor: "#dc3545" }}>
          Delete My Account
        </button>
      </div>
    </div>
  );
}