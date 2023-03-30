import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

import { api } from "@/utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>weShoutz</title>
        <meta name="description" content="Shout out your classmates, instructors, teams, and join us to help share the love." />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0b202f] to-[#243c1b]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            we <span className="text-[hsl(280,100%,70%)]">Shoutz</span> 
          </h1>
          {!sessionData && <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">

            <Link
              className="flex max-w-md flex-col gap-5 rounded-xl bg-white/10 p-5 text-white hover:bg-white/20"
              href=""
            >
              <div className="text-lg">
                Shout out your classmates, instructors, teams, and join us to help share the love.
              </div>
            </Link>
          </div>}
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => window.location.href="/feed" : () => void signIn()}
      >
        {sessionData ? "View Feed" : "Sign in"}
      </button>
      {
        sessionData && 
        <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => window.location.href="/post" }
      >
        Create a Shoutz
      </button>
      }
    </div>
  );
};


