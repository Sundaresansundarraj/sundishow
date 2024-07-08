const MovieService = require("../services/movie-service.js")
const Response = require("../response/Response.js")
const Message = require("../messages/Message")
const Httpcode = require("../codes/httpCodes")


class MovieController {

  static async Movie(req, res, next) {
    try {
      const result = await MovieService.addMovie(req);

      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async MovieSlot(req, res, next) {
    try {
      const result = await MovieService.addMovieSlot(req);
      if (!result) {
        return Response.error(req, res, 500, null, "Unexpected error occurred");
      }

      if (!result.sucess) {
        return Response.error(req, res, result.status, null, result.message);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async ShowMovies(req, res, next) {
    try {
      const result = await MovieService.ShowALLMovies(req);

      if (!result.sucess) {
        return Response.error(req, res, Httpcode.HTTP_BAD_REQUEST, null, Message[107]);
      }
      return Response.sucess(req, res, result.status, result.data, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async getMovieByid(req, res) {
    const theater_id  = req.params.id;
    console.log(theater_id)

    try {
      const employee = await MovieService.getMovieByid(theater_id);
      console.log(employee)
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ error: 'movie not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to get movie' });
    }
  }
}



module.exports = MovieController