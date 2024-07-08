const Movie = require("../models/Movie")
const MovieSlot = require("../models/MovieSlots")
const Message = require("../messages/Message")
const Httpcode = require("../codes/httpCodes")


class MovieService {
    
  static async addMovie(req) {
    try {
      const adminId = req.user.user_id;

      const {
        movie_title, release_date, duration, total_seats, theater_id, screen_id,
      } = req.body;
      const movie_details = {
        movie_title,
        release_date,
        duration,
        total_seats,
        theater_id,
        screen_id,
        admin_id: adminId,
      };
      const result = await Movie.create(movie_details);

      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[202],
        data: result,
      };
    } catch (e) {
      console.log(e);
    }
  }

  static async addMovieSlot(req) {
    try {
      const adminId = req.user.user_id;
      console.log("aaa")

      const {
        movie_id, start_time, end_time, price, available_seats,
      } = req.body;
      const movie_details = {
        movie_id,
        start_time,
        end_time,
        price,
        available_seats,
        admin_id: adminId,
      };
      console.log(movie_details,"aaaa")
      const result = await MovieSlot.create(movie_details);
      
      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[216],
        data: result,
      };
    } catch (e) {
      console.log(e);
    }
  }

  static async ShowALLMovies(req) {
    try {
      const movie_details = await Movie.findAll({
        include: [
          {
            model: MovieSlot,
          },
        ],
      });
      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[203],
        data: movie_details,
      };
    } catch (e) {
      console.log(e);
    }
  }

  static async getMovieByid(theater_id) {
    return await Movie.findAll({ where: { theater_id } });
  }
}

module.exports = MovieService