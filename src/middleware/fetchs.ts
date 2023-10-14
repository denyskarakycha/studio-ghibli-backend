import axios from 'axios';
import Film from '../models/film.js';
import User, {IUser} from '../models/user.js'

const STUDIO_GHILIBLI_API = 'https://ghibliapi.vercel.app/films';

interface FilmInfo {
  title: string,
  original_title: string,
  image: string,
  movie_banner: string,
  description: string,
  director: string,
  producer: string,
  release_date: string,
  running_time: string,
}

const fetchDataGhibli = async () => {
  try {
    const response = await axios.get(STUDIO_GHILIBLI_API);

    if (response.status === 200) {
      const films: FilmInfo[] = response.data.map((filmData: FilmInfo) => {
        return {
          title: filmData.title,
          originalTitle: filmData.original_title,
          imageUrl: filmData.image,
          bannerUrl: filmData.movie_banner,
          description: filmData.description,
          director: filmData.director,
          producer: filmData.producer,
          releaseDate: filmData.release_date,
          runningTime: filmData.running_time
        };
      });
      await Film.insertMany(films);
    } else {
      console.error('Failed to fetch data from the API.');
    }
  } catch (error) {
    console.log(error);
  }
};

export default fetchDataGhibli;
