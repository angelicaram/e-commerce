import axios from "axios";

export const getProducts = async (keyboard: string, page: number) => {
    let data: never[] = [];
    const headers = {
        'x-rapidapi-key': 'fce0e15738msh6a87c0c9db9505cp14b74fjsn54bc768f3bc7'
    }
    const url = `https://axesso-walmart-data-service.p.rapidapi.com/wlm/walmart-search-by-keyword?keyword=${keyboard}&page=${page}&sortBy=id`;

    await axios({
        method: 'get',
        url: url,
        headers: headers
      })
        .then((response) => {
            data = response.data?.item?.props?.pageProps?.initialData?.searchResult?.itemStacks[0]?.items;
            
        }).catch((error) => {
            console.log('Error: ', error);
        });

   
    return data;
};

