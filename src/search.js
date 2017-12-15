import xhr from 'xhr';
import { normaliser } from './resultNormaliser';

const requestUrl = 'https://search.freecodecamp.org';

export function search({
  update,
  searchTerm,
  handleResults,
  handleSearchingState
}) {
  xhr(
    {
      method: 'get',
      uri: `${requestUrl}/search?q=${searchTerm}`
    },
    function(err, resp, body) {
      if (resp.statusCode !== 200) {
        update(
          state => ({
            ...state,
            results: []
          }),
          () => {
            handleSearchingState()
            handleResults()
          }
        );
        console.error('Something went wrong whilst searching');
        console.error(err);
        return;
      } else if (err) {
        update(
          state => ({
            ...state,
            isSearching: false,
            results: []
          }),
          () => {
            handleSearchingState()
            handleResults()
          }
        );
        console.error('Something went wrong');
        console.error(err);
        return;
      }
      const data = JSON.parse(body);
      const results = normaliser(data);
      update(
        state => ({
          ...state,
          isSearching: false,
          results
        }),
        () => {
          handleSearchingState()
          handleResults()
        }
      );
      return;
    }
  );
}