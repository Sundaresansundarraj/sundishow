const Theatre = require("../models/Theatre")
const Message = require("../messages/Message")
const Httpcode = require("../codes/httpCodes")
const axios = require('axios');
const MOVIE_API = process.env.MOVIE_API
// const Movie = require("../models/Movie")


class TheaterService {
    static async addTheater(req) {
      try {
        const adminId = req.user.user_id;
  
        const { theater_name, location } = req.body;
        
        const theater_details = {
          theater_name,
          location,
          admin_id: adminId,
        };
  
        const result = await Theatre.create(theater_details);
        return {
          sucess: true,
          status: Httpcode.HTTP_OK,
          message: Message[213],
          data: result,
        };
      } catch (e) {
        console.log(e);
      }
    }
  
    static async getTheaterbyLocation(req) {
      try {
        const { location } = req.body;
  
        const result = await Theatre.findOne({ where: { location } });

        if (!result) {
          return {
            sucess: false,
            status: Httpcode.HTTP_NOT_FOUND,
            message: Message[126],
          };
        }
        delete result.dataValues.admin_id;
        delete result.dataValues.createdAt;
        delete result.dataValues.updatedAt;
        return {
          sucess: true,
          status: Httpcode.HTTP_OK,
          message: Message[219],
          data: result,
        };
      } catch (e) {
        console.log(e);
      }
    }
  
    static async getSpecficTheaterbyMovies(req) {
      try {
        const { theater_id } = req.body;
  
        const result = await Theatre.findOne({ where: { theater_id } });
  
        if (!result) {
          return {
            sucess: false,
            status: Httpcode.HTTP_NOT_FOUND,
            message: Message[127],
          };
        }

         const Movies = await axios.get(MOVIE_API+theater_id)
         const findMovies = JSON.parse(JSON.stringify(Movies.data))
         console.log(findMovies.data)
         
        // const findMovies = await Movie.findAll({ where: { theater_id } });
        
  
        if (!findMovies) {
          return {
            sucess: false,
            status: Httpcode.HTTP_NOT_FOUND,
            message: Message[128],
          };
        }
  
        return {
          sucess: true,
          status: Httpcode.HTTP_OK,
          message: Message[219],
          data: findMovies,
        };
      } catch (e) {
        console.log(e);
      }
    }
  }

module.exports = TheaterService