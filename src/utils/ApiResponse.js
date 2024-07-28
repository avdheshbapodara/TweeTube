class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message
        this.success = statusCode < 400
    }
}
//statusCodes division is there for standard data message 
//so generally responses are set to <400 and aboves are for errors
export { ApiResponse }