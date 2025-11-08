import { Outlet } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import LoginRequired from "@/components/common/LoginRequired";

export default function LoginReqLayout() {
  return (
    <LoginRequired>
      <MainLayout>
        <Outlet /> {/* Protected page will render here */}
      </MainLayout>
    </LoginRequired>
  );
}