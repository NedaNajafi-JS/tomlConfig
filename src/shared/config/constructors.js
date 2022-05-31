function response (data)  {
    this.status = 'success',
    this.data = {
        data
    }
}

function ServerError (error) {
    this.status = 'fail',
    this.data = {
        message: 'Server error',
        error: error
    }
}

function ParameterError (error) {
    this.status ='fail',
    this.data = {
        message: 'Input error',
        error: error
    }
}

module.exports = {
    response,
    ServerError,
    ParameterError
}
