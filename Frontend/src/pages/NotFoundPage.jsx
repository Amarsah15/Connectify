import React from "react";
import Button from "../components/ui/Button";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
    <div className="text-center">
      <h1 className="text-7xl font-extrabold bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent mb-2">
        404
      </h1>
      <p className="text-lg text-[var(--text-muted)] mb-6">
        Page not found. The page you're looking for doesn't exist.
      </p>
      <Button variant="primary" as="link" to="/feed">
        Back to Feed
      </Button>
    </div>
  </div>
);

export default NotFoundPage;
