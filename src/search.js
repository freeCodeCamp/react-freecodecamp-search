import xhr from 'xhr';

const requestUrl = 'https://search.freecodecamp.org';

export function search({ update, searchTerm }) {
  xhr(
    {
      method: 'get',
      uri: `${requestUrl}/search?q=${searchTerm}`
    },
    function(err, resp, body) {
      if (resp.statusCode !== 200) {
        update(state => ({
          ...state,
          results: []
        }));
        console.error('Something went wrong whilst searching');
        console.error(err);
        return;
      } else if (err) {
        update(state => ({
          ...state,
          isSearching: false,
          results: []
        }));
        console.error('Something went wrong');
        console.error(err);
        return;
      }
      const results = JSON.parse(body);
      update(state => ({
        ...state,
        isSearching: false,
        results
      }));
      return;
    }
  );
}
