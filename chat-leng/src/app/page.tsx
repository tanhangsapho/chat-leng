import ChatPage from "@/components/ChatPage";

export default function Home() {
  return (
    <main className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <ChatPage />
      </div>
    </main>
  );
}
