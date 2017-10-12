const YOUTUBE_API_KEY = "AIzaSyDxjXuYRG2MUJKMv8C249GRn114BQa5vcM";
export default {
  API_URL: `https://you-mp3-converter.herokuapp.com/?videoID=`,
  SEARCH_API_URL: `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&maxResults=40&q=`
}
