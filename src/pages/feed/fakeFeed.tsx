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
    console.log(toShow, 'from line 63');
    console.log(toShow == posts);