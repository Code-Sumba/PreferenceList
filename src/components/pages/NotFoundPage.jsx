import { useNavigate } from "react-router-dom";
import { PublicLayout } from "../layout/PublicLayout";
import { EmptyState } from "../ui";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <PublicLayout>
      <EmptyState icon="🔍" title="Page not found" subtitle="The page you're looking for doesn't exist." action={{ label: "Go Home", onClick: () => navigate("/") }} />
    </PublicLayout>
  );
}
