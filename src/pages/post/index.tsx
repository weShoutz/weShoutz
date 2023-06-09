import { type NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { useState } from "react";

const Shoutz: NextPage = () => {
  const { data: sessionData } = useSession();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const posts = api.shouts.getAll.useQuery({ id: 23 });
  console.log("this is posts: ", posts);

  const handleClick = (message: string, recipient: string, title: string) => {
    console.log("message:" + message, "title:" + title);
    //api.shouts.postShout.useQuery({ message, recipient, title })
    const pic = sessionData?.user.image || "";
    handleItemClick(message, recipient, title, pic);
  };

  const mutation = api.shouts.postShout.useMutation();
  const handleItemClick = (
    message: string,
    recipient: string,
    title: string,
    pic?: string
  ) => {
    const authorPic = pic ? pic : "";
    mutation.mutate({ message, recipient, title, authorPic });
    setMessage(() => '')
    setTitle(() => '')
  };

  return (
    <>
      <Head>
        <title>Create a Shoutz</title>
        <meta name="description" content="Shout out your classmates, instructors, teams, and join us to help share the love." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {sessionData && sessionData.user  ? (
        <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#0b202f] to-[#243c1b]">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[3rem]">
              Create a <span className="text-[hsl(280,100%,70%)]">Shoutz</span>
            </h1>
            <div className="flex min-w-full flex-col gap-5 rounded-xl bg-white/10 p-10 text-white hover:bg-white/20">
              <form>
                <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                  <div className="rounded-t-lg bg-white px-4 py-2 dark:bg-gray-800">
                    <label className="sr-only">Your title</label>
                    <textarea
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      id="title"
                      className="mb-[1rem] w-full border-0 bg-white px-0 text-sm text-gray-900 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      placeholder="Create a Title"
                      value={title}
                      required
                    ></textarea>
                    <label className="sr-only">Your comment</label>
                    <textarea
                      onChange={(e) => setMessage(e.target.value)}
                      id="comment"
                      className="w-full border-0 bg-white px-0 text-sm text-gray-900 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      placeholder="Write a comment..."
                      value={message}
                      required
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-600">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(message, "Salem", title);
                      }}
                      className="inline-flex items-center rounded-lg bg-blue-700 py-2.5 px-4 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
                    >
                      Create a Shoutz
                    </button>
                  </div>
                </div>
              </form>
              <button
                className="max-w-[8rem] rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={() => (window.location.href = "/feed")}
              >
                Back
              </button>
            </div>
          </div>
        </main>
      ) : !sessionData && (
        <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#0b202f] to-[#243c1b]">

        </main>
      )}
    </>
  );
};

export default Shoutz;
