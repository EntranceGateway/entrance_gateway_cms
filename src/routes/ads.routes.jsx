import { lazy } from "react";

const AllAds = lazy(() => import("@/pages/ads/AllAds"));
const AddAd = lazy(() => import("@/pages/ads/AddAd"));
const EditAd = lazy(() => import("@/pages/ads/EditAd"));
const AddBanner = lazy(() => import("@/banner/Form/AddBanner"));
const AddCategory = lazy(() => import("@/category/CategoryForm/AddCategory"));

export const adsRoutes = [
    { path: "/ads/all", element: <AllAds /> },
    { path: "/ads/add", element: <AddAd /> },
    { path: "/ads/edit/:id", element: <EditAd /> },
    { path: "/banner/add", element: <AddBanner /> },
    { path: "/banner/all", element: <AllAds /> },
    { path: "/category/add", element: <AddCategory /> },
];
