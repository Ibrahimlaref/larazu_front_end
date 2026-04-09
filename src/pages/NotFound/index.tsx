import { Link } from "react-router-dom";
import Wrapper from "@/components/hoc/Wrapper";

export default function NotFound() {
  return (
    <Wrapper>
      <div className="text-center py-40 px-4">
        <h1 className="heading-display text-8xl text-sand mb-4">404</h1>
        <h2 className="heading-display text-3xl mb-4">Page Not Found</h2>
        <p className="text-mist mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="inline-flex items-center justify-center bg-ink text-chalk hover:bg-ink/90 label-mono px-8 py-3">
          Back to Home
        </Link>
      </div>
    </Wrapper>
  );
}
