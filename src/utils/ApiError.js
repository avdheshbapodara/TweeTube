class ApiError extends Error {//Error is predefined class of nodejs
    constructor(
        statusCode,
        message = "Something went Wrong",
        errors = [],
        statck = ""
    ) {
        super(message)
        this.statusCode = statusCode//indicating type of the error
        this.data = null//used to store data related to error
        this.message = message
        this.success = false//indicating that error is occurred 
        this.errors = errors

    }
}
export { ApiError }

// Understand this file from tushar