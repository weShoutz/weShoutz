import { type NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { useState } from 'react';

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Create a Shoutz</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#0b202f] to-[#243c1b]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Latest <span className="text-[hsl(280,100%,70%)]">Shoutz</span> 
          </h1>

          <Shout />

        </div>
      </main>
    </>
  );
};

export default Home;

const Shout: React.FC = () => {
  const { data: sessionData } = useSession();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

//   const onTitleHandler = event => {
//     setTitle(event.target.value);
//  };

  const handleClick = (message: string, recipient: string, title: string) => {
    console.log('message:' + message, 'title:' + title);
    api.shouts.postShout.useQuery({ message, recipient, title }) 
  };
    //const title = getElementById('title').
 

  return (
    <div
    className="flex min-w-full flex-col gap-5 rounded-xl bg-white/10 p-10 text-white hover:bg-white/20"
    >
<form>
   <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
       <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
           <label  className="sr-only">Your title</label>
           <textarea onChange={(e) => {setTitle(e.target.value)}} id="title" className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 mb-[1rem]" placeholder="Create a Title" required></textarea>
           <label  className="sr-only">Your comment</label>
           <textarea onChange={(e) => setMessage(e.target.value)} id="comment" className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write a comment..." required></textarea>
       </div>
       <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
            <button onClick={(e) => { e.preventDefault(); handleClick(message, "Salem", title) }} className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
               Create a Shoutz
           </button>
           <div className="flex pl-0 space-x-1 sm:pl-2">
               <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                   <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
                   <span className="sr-only">Attach file</span>
               </button>
               <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                   <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                   <span className="sr-only">Set location</span>
               </button>
               <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                   <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                   <span className="sr-only">Upload image</span>
               </button>
           </div>
       </div>
   </div>
</form>
    </div>
  );
};

