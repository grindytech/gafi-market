import { NextSeo } from "next-seo";
import AdminPageLayout, { ADMIN_LINKS } from "../../layouts/AdminPageLayout";

export default function AdminPage() {
  return (
    <>
      <NextSeo title="Admin dashboard | Overmint Marketplace" />
      <AdminPageLayout links={ADMIN_LINKS} />
    </>
  );
}
