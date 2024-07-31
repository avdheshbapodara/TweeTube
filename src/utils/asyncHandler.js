const asyncHandler = (requestHandler) => {
    return (req, res, next) => {//function inside function
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => {
                next(err)
            })
    }
}
export { asyncHandler }

