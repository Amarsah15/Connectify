import React from "react";
import CreatePost from "../components/posts/CreatePost";
import PostFeed from "../components/posts/PostFeed";
import Sidebar from "../components/common/Sidebar";

const HomePage = () => (
  <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      {/* Sidebar Column - Positioned on the left */}
      <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24">
        <Sidebar />
      </div>

      {/* Feed Column - Wider container to fill screen area */}
      <div className="lg:col-span-3 space-y-4">
        <CreatePost />
        <PostFeed scope="following" />
      </div>
    </div>
  </main>
);

export default HomePage;
