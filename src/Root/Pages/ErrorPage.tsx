import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // adjust import to your project

interface ErrorPageProps {
  message?: string; // optional custom message
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-6xl font-bold mb-4">Oops!</h1>
      <p className="text-xl mb-6 text-center">
        {message || "Something went wrong. We couldn't load this page."}
      </p>

      <div className="flex gap-4">
       

        <Button
          className="bg-gray-700 hover:bg-gray-600 cursor-pointer text-white px-6 py-2 rounded-md"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>

      <p className="mt-10 text-gray-400 text-sm">
        If the problem persists, please contact support.
      </p>
    </div>
  );
};

export default ErrorPage;
