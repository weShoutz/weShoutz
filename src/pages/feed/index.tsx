import { type NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { ReactElement, JSXElementConstructor, ReactFragment, useState, useRef } from "react";


const Home: NextPage = () => {
  //   const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Feed</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#0b202f] to-[#243c1b]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Latest <span className="text-[hsl(280,100%,70%)]">Shoutz</span>
          </h1>
          <div className="grid min-w-full grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">
            <Media />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const Media: React.FC = () => {
  const posts = api.shouts.getAll.useQuery({id: 0});
  const { data: sessionData } = useSession();
  const image = sessionData?.user.image;
  const [page, setPage] = useState(0);  

  const listInnerRef = useRef();

  const onScroll = () => {
    console.log(listInnerRef.current);
    // if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        // TO SOMETHING HERE
        console.log('Reached bottom')
      }
    // }
  };

  const { data, fetchNextPage } = api.shouts.getBatch.useInfiniteQuery(
    {
      limit: 15
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

    const handleFetchNextPage = () => {
      fetchNextPage();
      setPage((prev: number) => prev + 1);
    };

    const handleFetchPreviousPage = () => {
      setPage((prev: number) => prev - 1);
    };

      // data will be split in pages
    const toShow = data?.pages[page]?.items;
    //const toShow = data
    console.log(toShow, 'from line 62');
    console.log(toShow == posts);


  const renderItems: JSX.Element[] = [];
  //console.log(posts, 'from 41')
  if (posts.data) {
    posts.data.forEach((el, i) => {
      console.log(el);
      renderItems.push(
        <div key={`post-${i}`} className="flex min-w-full flex-col gap-5 rounded-xl bg-white/10 p-10 text-white hover:bg-white/20">
          <p>{el.author.name}</p>
          <div>
            {el.authorPic && (
              <img
                alt="some-alt-text"
                className="max-w-[3rem]"
                src={el.authorPic}
              ></img>
            )}
          </div>
          <h3 className="text-2xl font-bold">{el.title}</h3>
          <div className="text-lg">{el.message}</div>
          {sessionData && sessionData.user && sessionData.user.id && sessionData.user.name === el.author.name && <button
            className="max-w-[8rem] rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            // onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {/* {sessionData ? "Sign out" : "Sign in"} */}
            Edit
          </button>}
        </div>
      );
    });
  }

  return (
    <div onScroll={() => onScroll()} ref={listInnerRef} className="flex min-w-full flex-col gap-5 rounded-xl bg-white/10 p-10 text-white hover:bg-white/20">
      {renderItems}
    </div>
  );
};

/*
onScroll={() => onScroll()} ref={listInnerRef}
*/
