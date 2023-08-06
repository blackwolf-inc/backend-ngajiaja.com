const { validationResult } = require("express-validator");
const ApiError = require("./../middleware/errorHandler/apiError");

module.exports = (validations) => {
    return async (req, res, next) => {
        try {
            await Promise.all(validations.map((validation) => validation.run(req)));

            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return next();
            }

            const extractedErrors = {};
            errors.array().forEach((value) => {
                if (!value.param) return;

                if (!extractedErrors[value.param]) extractedErrors[value.param] = [value.msg];
                else extractedErrors[value.param].push(value.msg);
            });

            throw ApiError.unprocessableEntity("Please check your input data", {
                ...extractedErrors,
            });
        } catch (error) {
            next(error);
        }

        // return res.status(422).json({
        //     code: 422,
        //     message: "Please check your input data",
        //     errors: extractedErrors,
        // });
    };
};
