"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";

export default function Likes({
  tweet,
  addOptimisticTweet,
}: {
  tweet: TweetWithAuthor;
  addOptimisticTweet: (newTweet: TweetWithAuthor) => void;
}) {
  const router = useRouter();
  const updateLikes = async () => {
    const supabase = createClientComponentClient<Database>({
      supabaseKey: process.env.NEXT_PUBLIC_ANON_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      if (tweet.user_has_liked_tweet) {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes - 1,
          user_has_liked_tweet: !tweet.user_has_liked_tweet,
        });
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id });
      } else {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes + 1,
          user_has_liked_tweet: !tweet.user_has_liked_tweet,
        });
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet.id });
      }
    }
    router.refresh();
  };
  return (
    <button onClick={updateLikes} className="group flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`group-hover:fill-red-600 group-hover:stroke-red-600 ${
          tweet.user_has_liked_tweet
            ? "fill-red-500 stroke-red-600"
            : "fill-none  stroke-gray-500"
        }`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span
        className={`ml-2 group-hover:text-red-600  text-sm ${
          tweet.user_has_liked_tweet ? "text-red-600" : "text-gray-500"
        }`}
      >
        {tweet.likes}
      </span>
    </button>
  );
}
