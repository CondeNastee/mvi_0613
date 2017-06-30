var ids = [], durations = [];

function YTDurationToSeconds(duration) {
  var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  var hours = (parseInt(match[1]) || 0);
  var minutes = (parseInt(match[2]) || 0);
  var seconds = (parseInt(match[3]) || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

function makeSearchURL(pageToken) {
  var url = new URL('https://www.googleapis.com/youtube/v3/search'),
      params = {
        q: 'mvi 0613',
        type: 'video',
        part: 'snippet',
        maxResults: 50,
        key: 'sold seprately',
        videoEmbeddable: true
      };
  if (pageToken) {
    params.pageToken = pageToken;
  }
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  return url;
}

function makeVideoURL(ids) {
  var url = new URL('https://www.googleapis.com/youtube/v3/videos'),
      params = {
        id: ids.join(','),
        part: 'contentDetails',
        key: 'sold seprately',
      };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  return url;
}

// ADD '?modestbranding=1' to url above to remove youtube watermark

function get(url, cb, onErr) {
  fetch(url)
    .then(resp => resp.json())
    .then(cb)
    .catch(onErr);
}

function crawl(cb, pageToken) {
  var url = makeSearchURL(pageToken);
  get(url, function(data) {
    var newIds = data.items.map(i => i.id.videoId);
    ids = ids.concat(newIds);
    get(makeVideoURL(newIds), function(res) {
      durations = durations.concat(res.items.map(i => YTDurationToSeconds(i.contentDetails.duration)));
      if (!data.nextPageToken) {
        results = [];
        for (var i=0; i<ids.length; i++) {
          results.push({
            id: ids[i],
            duration: durations[i]
          });
        }
        cb(results);
      } else {
        crawl(cb, data.nextPageToken);
      }
    })
  }, pageToken);
}

crawl(ready);

