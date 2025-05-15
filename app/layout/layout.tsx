import { Outlet } from "react-router";
import Header from "~/layout/header";

const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;
