import WelcomePage from "../pages/WelcomePage";
import Shop from "../pages/shop/Shop";
import ItemDetail from "../pages/shop/detail/ItemDetail";

export const shopRoutes = [
  { path: ":gender/home", element: <WelcomePage /> },
  { path: ":gender/shop", element: <Shop /> },
  { path: ":gender/shop/products/:itemId", element: <ItemDetail /> },
];
