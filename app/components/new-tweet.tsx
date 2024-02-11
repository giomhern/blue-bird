"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/auth-helpers-nextjs";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function NewTweet({ user }: { user: User }) {
  const supabase = createClientComponentClient<Database>({
    supabaseKey: process.env.NEXT_PUBLIC_ANON_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
  const router = useRouter();
  const [newTweet, setNewTweet] = useState("");
  const handleFormSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault(); // Prevent the form from submitting on Enter key or form action
  };
  async function addTweet({ newTweet }: { newTweet: string }) {
    try {
      const { error } = await supabase
        .from("tweets")
        .insert({ tweet: newTweet, user_id: user.id });

      if (error) throw error;
      setNewTweet("");
      router.refresh();
    } catch {
      alert("error submitting data!");
    }
  }

  const handleTweetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTweet(e.target.value);
  };

  return (
    <form className="border border-gray-200 flex " onSubmit={handleFormSubmit}>
      <div className="flex w-full gap-2 py-4 px-6 items-center justify-evenly ">
        <Image
          src={user.user_metadata.avatar_url}
          alt="logo"
          height={50}
          width={50}
          className="rounded-full"
        />
        <input
          name="title"
          className="flex-1 appearance-none text-sm text-[#191515] placeholder-gray-500 placeholder:text-md bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none resize-none overflow-hidden"
          placeholder="What is happening?!"
          onChange={(e) => setNewTweet(e.target.value)}
          value={newTweet}
        />
        <button
          className=" bg-gray-100 hover:bg-secondary hover:border-secondary-light flex gap-1 text-xs tracking-regular border border-primary-dark text-primary-dark px-3 py-2 rounded-lg"
          onClick={() => addTweet({ newTweet })}
          type="button"
        >
          Send
          <Image
            src="/send-doggy.png"
            height={15}
            width={15}
            alt="send doggy"
          />
        </button>
      </div>
    </form>
  );
}