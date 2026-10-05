import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { Contact } from "./pages/contact";
import { Services } from "./pages/services";
import { Blog } from "./pages/blog";
import { BlogPost } from "./pages/blog-post";
import { AdminLogin } from "./pages/admin/login";
import { AdminDashboard } from "./pages/admin/dashboard";
import { BlogEditor } from "./pages/admin/blog-editor";
import { PortfolioEditor } from "./pages/admin/portfolio-editor";
import { Layout } from "./components/layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "services", Component: Services },
      { path: "blog", Component: Blog },
      { path: "blog/:slug", Component: BlogPost },
      { path: "contact", Component: Contact },
    ],
  },
  {
    path: "/admin",
    children: [
      { index: true, Component: AdminLogin },
      { path: "dashboard", Component: AdminDashboard },
      { path: "blog/new", Component: BlogEditor },
      { path: "blog/edit/:slug", Component: BlogEditor },
      { path: "portfolio/new", Component: PortfolioEditor },
    ],
  },
]);